import { NextRequest } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getOpenAIClient } from "@/lib/openai";
import { verifyAuthToken } from "@/lib/buddy/auth";
import { ensureSession, saveTurnPair } from "@/lib/buddy/history";
import { resolveNavigation } from "@/lib/buddy/navigation";
import { retrieveContent, buildContextFromChunks } from "@/lib/buddy/retrieval";
import { loadInternalIndex } from "@/lib/buddy/kb/contentIndex";
import { resolveNhsTopic, fetchResolvedNhsPage } from "@/lib/buddy/server/nhs";
import { fetchPubMed } from "@/lib/buddy/server/pubmed";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { FieldValue } from "firebase-admin/firestore";
import { normaliseQuery, scorePages, STRONG_MATCH_THRESHOLD } from "@/lib/buddy/chat-scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatRequestBody {
  message: string;
  sessionId?: string;
  /** @deprecated — use Authorization header instead; kept for back-compat */
  uid?: string;
  pathname?: string;
}

interface ChatSource {
  title: string;
  url: string;
}

interface ChatResponsePayload {
  reply: string;
  sessionId: string | null;
  source: "navigation" | "knowledge" | "ai" | "fallback";
  navigateTo?: string;
  sources?: ChatSource[];
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildSystemPrompt(siteContext: string | null, externalContext: string | null): string {
  const contextParts: string[] = [];
  if (siteContext) contextParts.push(`--- NeuroBreath site content ---\n${siteContext}`);
  if (externalContext) contextParts.push(`--- External evidence (NHS / PubMed) ---\n${externalContext}`);
  const hasContext = contextParts.length > 0;

  return `You are NeuroBreath Buddy, a friendly and supportive assistant for neurobreath.co.uk — a UK-based platform providing neurodivergent-friendly breathing techniques and wellbeing tools for ADHD, autism, anxiety, sleep, and dyslexia support.

Rules:
- Answer from the supplied context below. Clearly distinguish NeuroBreath site content from external evidence when both are present.
- When citing NeuroBreath content, say "On NeuroBreath…" or reference the page.
- When citing external evidence, say "According to NHS…" or "Research suggests…" and note the source.
- If the context is weak or does not cover the topic, say so clearly. Do not invent claims.
- Do not invent features, routes, policies, statistics, or medical claims not present in the context.
- Be warm, concise, and evidence-aware.
- Never give medical diagnoses or replace professional advice.
- If the user seems in crisis, direct them to NHS 111, Samaritans (116 123), or emergency services (999).
- Reference specific NeuroBreath pages and tools when supported by the context.
- Keep answers under 300 words unless the user asks for detail.
- Use British English spelling.
- Recommend the most relevant page if supported by context.${hasContext ? `\n\n${contextParts.join("\n\n")}` : "\n\nNo indexed site content or external evidence is available for this query. Let the user know and suggest they browse the site directly."}`;
}

// ─── User doc bootstrap ──────────────────────────────────────────────────────

async function ensureUserDoc(
  db: FirebaseFirestore.Firestore,
  uid: string,
  isAnonymous: boolean,
): Promise<void> {
  const ref = db.collection(COLLECTIONS.USERS).doc(uid);
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({
      plan: isAnonymous ? "guest" : "free",
      isSupporter: false,
      nbCardLimit: 2,
      nbCardUsed: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  // 1. Validate request body
  const body = (await req.json().catch(() => null)) as ChatRequestBody | null;
  const message = body?.message?.trim();

  if (!message) {
    return Response.json({ error: "Missing message" }, { status: 400 });
  }

  if (message.length > 2000) {
    return Response.json({ error: "Message too long (max 2000 chars)" }, { status: 400 });
  }

  // 2. Verify Firebase auth token (if present)
  const auth = await verifyAuthToken(req);
  // Back-compat: accept body.uid as fallback when no auth header
  const uid = auth.uid ?? body?.uid ?? null;

  const db = getAdminFirestore();

  // Bootstrap user document if authenticated
  if (uid && db) {
    try {
      await ensureUserDoc(db, uid, auth.isAnonymous);
    } catch (err) {
      console.error("[api/chat] ensureUserDoc failed:", err);
    }
  }

  // 3. Check deterministic navigation FIRST
  if (db) {
    try {
      const navMatch = await resolveNavigation(db, message);
      if (navMatch) {
        const reply = `I can take you to **${navMatch.title}**.\n\n👉 [Go to ${navMatch.title}](${navMatch.path})`;
        const response: ChatResponsePayload = {
          reply,
          sessionId: null,
          source: "navigation",
          navigateTo: navMatch.path,
        };

        // Save chat turn
        if (uid) {
          try {
            const sid = await ensureSession(db, uid, body?.sessionId, message);
            await saveTurnPair(db, uid, sid, message, reply, { source: "navigation", navigateTo: navMatch.path });
            response.sessionId = sid;
          } catch (err) {
            console.error("[api/chat] Failed to save nav chat history:", err);
          }
        }

        return Response.json(response);
      }
    } catch (err) {
      console.error("[api/chat] Navigation resolution failed:", err);
    }
  }

  // 4. Retrieve indexed site content
  let context: string | null = null;
  const sources: ChatSource[] = [];

  if (db) {
    try {
      const chunks = await retrieveContent(db, message, 5);
      context = buildContextFromChunks(chunks);
      for (const chunk of chunks.slice(0, 3)) {
        sources.push({ title: chunk.title, url: chunk.url });
      }
    } catch (err) {
      console.error("[api/chat] Content retrieval failed:", err);
    }
  }

  // 4b. Fallback: use internal KB (local page index) when Firestore returned nothing.
  let siteMatchStrong = false;
  if (!context) {
    try {
      const index = await loadInternalIndex();
      const searchQuery = normaliseQuery(message);
      const scored = scorePages(index.pages, searchQuery, 5);

      // Only treat as real site context if hits actually scored above zero.
      const topScore = scored[0]?.score ?? 0;
      const qualityHits = scored.filter((h) => h.score > 0);

      if (qualityHits.length > 0) {
        siteMatchStrong = topScore >= STRONG_MATCH_THRESHOLD;
        context = qualityHits
          .map(({ page }) => {
            const parts = [`--- ${page.title} (${page.path}) ---`];
            if (page.description) parts.push(page.description);
            if (page.headings.length > 0)
              parts.push(`Sections: ${page.headings.map((h) => h.text).join(", ")}`);
            if (page.keyTopics.length > 0)
              parts.push(`Topics: ${page.keyTopics.slice(0, 8).join(", ")}`);
            return parts.join("\n");
          })
          .join("\n\n");

        for (const { page } of qualityHits.slice(0, 3)) {
          sources.push({ title: page.title, url: page.path });
        }
      }
    } catch (err) {
      console.error("[api/chat] Internal KB fallback failed:", err);
    }
  }

  // 4c. External evidence: NHS / PubMed for questions outside site content.
  let externalContext: string | null = null;
  const wantsResearch = /(study|studies|evidence|research|trial|paper|meta.analysis)/i.test(message);

  // Fetch external evidence when site content is absent, weak, or user explicitly asks for research.
  if (!context || !siteMatchStrong || wantsResearch) {
    try {
      const nhsResult = await resolveNhsTopic(message);
      if (nhsResult.entry) {
        const nhsPage = await fetchResolvedNhsPage(nhsResult.entry);
        if (nhsPage?.text) {
          const snippet = nhsPage.text.length > 800 ? nhsPage.text.slice(0, 800).trimEnd() + "…" : nhsPage.text;
          externalContext = `NHS — ${nhsPage.title}\n${snippet}`;
          const nhsUrl = nhsPage.publicUrl || nhsResult.entry.webUrl;
          if (nhsUrl) sources.push({ title: `NHS: ${nhsPage.title}`, url: nhsUrl });
        }
      }
    } catch (err) {
      console.error("[api/chat] NHS evidence fetch failed:", err);
    }

    // Add PubMed citations when the question asks for research/evidence.
    if (wantsResearch) {
      try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        // Strip question words and filler for a tighter PubMed search term.
        const pubmedQuery = message
          .replace(/[?!.,;:'"]/g, "")
          .replace(/\b(what|where|how|who|why|when|is|are|do|does|can|the|a|an|say|about|exist|and|or|for)\b/gi, "")
          .replace(/\s+/g, " ")
          .trim() || message;
        const pubs = await fetchPubMed(pubmedQuery, ip);
        if (pubs.results.length > 0) {
          const pubLines = pubs.results.slice(0, 3).map((p) => `• ${p.title} (${p.url})`);
          externalContext = (externalContext ? externalContext + "\n\n" : "") + `PubMed research:\n${pubLines.join("\n")}`;
          for (const p of pubs.results.slice(0, 3)) {
            sources.push({ title: `PubMed: ${p.title}`, url: p.url });
          }
        }
      } catch (err) {
        console.error("[api/chat] PubMed evidence fetch failed:", err);
      }
    }
  }

  // 5. Call OpenAI (server-side only)
  let reply: string;
  let source: ChatResponsePayload["source"];

  const openai = getOpenAIClient();
  if (!openai) {
    reply = "I can help with navigation and site information. For detailed AI answers, the service is being configured — please try again shortly.";
    source = "fallback";
  } else {
    try {
      const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt(context, externalContext) },
          { role: "user", content: message },
        ],
        max_tokens: 600,
        temperature: 0.5,
      });

      reply = completion.choices[0]?.message?.content?.trim()
        || "I wasn't able to generate a response. Please try rephrasing your question.";
      source = (context || externalContext) ? "knowledge" : "ai";
    } catch (err) {
      console.error("[api/chat] OpenAI call failed:", err);
      reply = "I'm having trouble processing that right now. You can browse our pages directly — try ADHD, Autism, Breathing, or Sleep hubs for specific support.";
      source = "fallback";
    }
  }

  // 6. Build response
  const response: ChatResponsePayload = {
    reply,
    sessionId: null,
    source,
    sources: sources.length > 0 ? sources : undefined,
  };

  // 7. Save chat turn
  if (uid && db) {
    try {
      const sid = await ensureSession(db, uid, body?.sessionId, message);
      await saveTurnPair(db, uid, sid, message, reply, { source, sources });
      response.sessionId = sid;
    } catch (err) {
      console.error("[api/chat] Failed to save chat history:", err);
    }
  }

  // 8. Structured observability log (no secrets, no user content)
  const latencyMs = Date.now() - t0;
  const siteSourceCount = sources.filter((s) => s.url.startsWith("/")).length;
  const externalSourceCount = sources.filter((s) => s.url.startsWith("http")).length;
  console.log(
    JSON.stringify({
      event: "chat_response",
      source,
      siteSourceCount,
      externalSourceCount,
      hasExternalEvidence: !!externalContext,
      hasSiteContext: !!context,
      siteMatchStrong,
      wantsResearch,
      latencyMs,
    }),
  );

  return Response.json(response);
}
