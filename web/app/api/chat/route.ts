import { NextRequest } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getOpenAIClient } from "@/lib/openai";
import { verifyAuthToken } from "@/lib/buddy/auth";
import { ensureSession, saveTurnPair } from "@/lib/buddy/history";
import { resolveNavigation } from "@/lib/buddy/navigation";
import { retrieveContent, buildContextFromChunks } from "@/lib/buddy/retrieval";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { FieldValue } from "firebase-admin/firestore";

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

function buildSystemPrompt(context: string | null): string {
  return `You are NeuroBreath Buddy, a friendly and supportive assistant for neurobreath.co.uk — a UK-based platform providing neurodivergent-friendly breathing techniques and wellbeing tools for ADHD, autism, anxiety, sleep, and dyslexia support.

Rules:
- Answer only from the supplied site context below. If the context is weak or does not cover the topic, say so clearly.
- Do not invent features, routes, policies, statistics, or medical claims not present in the context.
- Be warm, concise, and evidence-aware.
- Never give medical diagnoses or replace professional advice.
- If the user seems in crisis, direct them to NHS 111, Samaritans (116 123), or emergency services (999).
- Reference specific NeuroBreath pages and tools when supported by the context.
- Keep answers under 300 words unless the user asks for detail.
- Use British English spelling.
- Recommend the most relevant page if supported by context.${context ? `\n\nRelevant site content for context:\n${context}` : "\n\nNo indexed site content is available for this query. Let the user know and suggest they browse the site directly."}`;
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
          { role: "system", content: buildSystemPrompt(context) },
          { role: "user", content: message },
        ],
        max_tokens: 600,
        temperature: 0.5,
      });

      reply = completion.choices[0]?.message?.content?.trim()
        || "I wasn't able to generate a response. Please try rephrasing your question.";
      source = context ? "knowledge" : "ai";
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

  return Response.json(response);
}
