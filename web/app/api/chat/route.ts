import { NextRequest } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getOpenAIClient } from "@/lib/openai";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatRequestBody {
  message: string;
  sessionId?: string;
  uid?: string;
  pathname?: string;
}

interface ChatResponsePayload {
  reply: string;
  sessionId: string | null;
  source: "navigation" | "knowledge" | "ai" | "fallback";
  navigateTo?: string;
}

// ─── Navigation matching (deterministic, runs first) ─────────────────────────

async function matchNavigation(
  db: FirebaseFirestore.Firestore,
  query: string,
): Promise<{ path: string; title: string; description: string } | null> {
  const q = query.toLowerCase().trim();

  // Load navigation entries from Firestore
  const snap = await db.collection(COLLECTIONS.SITE_NAVIGATION).get();
  if (snap.empty) return null;

  let bestMatch: { path: string; title: string; description: string; score: number } | null = null;

  for (const doc of snap.docs) {
    if (doc.id === "_meta") continue;
    const data = doc.data();
    const path = data.path as string;
    const title = (data.title as string).toLowerCase();
    const keywords = (data.keywords as string[]) || [];

    let score = 0;

    // Exact keyword match
    for (const kw of keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 10;
      }
    }

    // Title match
    if (q.includes(title)) {
      score += 15;
    }

    // "go to X", "take me to X", "show me X", "navigate to X" patterns
    const navPatterns = [
      /(?:go\s+to|take\s+me\s+to|navigate\s+to|show\s+me|open|visit)\s+(.+)/i,
      /(?:where\s+is|find)\s+(?:the\s+)?(.+?)(?:\s+page)?$/i,
    ];

    for (const pattern of navPatterns) {
      const match = q.match(pattern);
      if (match) {
        const target = match[1].toLowerCase().trim();
        if (title.includes(target) || keywords.some((kw) => kw.toLowerCase().includes(target))) {
          score += 20;
        }
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { path, title: data.title as string, description: data.description as string, score };
    }
  }

  return bestMatch;
}

// ─── Knowledge search (Firestore content chunks) ────────────────────────────

async function searchKnowledge(
  db: FirebaseFirestore.Firestore,
  query: string,
): Promise<string | null> {
  const q = query.toLowerCase();
  const snap = await db.collection(COLLECTIONS.SITE_CONTENT_CHUNKS).get();
  if (snap.empty) return null;

  // Simple keyword relevance scoring
  const results: Array<{ title: string; url: string; content: string; score: number }> = [];

  const queryWords = q
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 10);

  for (const doc of snap.docs) {
    if (doc.id === "_meta") continue;
    const data = doc.data();
    const content = (data.content as string || "").toLowerCase();
    const title = (data.title as string || "").toLowerCase();
    const headings = (data.headings as string[] || []).map((h: string) => h.toLowerCase());

    let score = 0;
    for (const word of queryWords) {
      if (title.includes(word)) score += 5;
      if (headings.some((h: string) => h.includes(word))) score += 3;
      // Count occurrences in content (capped)
      const occurrences = Math.min((content.match(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length, 10);
      score += occurrences;
    }

    if (score > 0) {
      results.push({
        title: data.title as string,
        url: data.url as string,
        content: (data.content as string || "").slice(0, 2000),
        score,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, 3);

  if (top.length === 0) return null;

  // Build context string for the LLM
  return top
    .map((r) => `--- ${r.title} (${r.url}) ---\n${r.content}`)
    .join("\n\n");
}

// ─── Chat history persistence ───────────────────────────────────────────────

async function saveMessage(
  db: FirebaseFirestore.Firestore,
  uid: string,
  sessionId: string | undefined,
  userMessage: string,
  assistantReply: string,
  pathname?: string,
): Promise<string> {
  const now = new Date().toISOString();
  const userMsg = { role: "user", content: userMessage, timestamp: now };
  const assistantMsg = { role: "assistant", content: assistantReply, timestamp: now };

  if (sessionId) {
    // Append to existing session
    const ref = db
      .collection(COLLECTIONS.USERS)
      .doc(uid)
      .collection(COLLECTIONS.CHAT_SESSIONS)
      .doc(sessionId);

    await ref.update({
      messages: FieldValue.arrayUnion(userMsg, assistantMsg),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return sessionId;
  }

  // Create new session
  const ref = db
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(COLLECTIONS.CHAT_SESSIONS)
    .doc();

  await ref.set({
    title: userMessage.slice(0, 100),
    messages: [userMsg, assistantMsg],
    pathname: pathname || null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return ref.id;
}

// ─── OpenAI call (server-side only) ─────────────────────────────────────────

async function askOpenAI(
  userMessage: string,
  context: string | null,
): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) {
    return "I can help with navigation and site information. For detailed AI answers, the service is being configured — please try again shortly.";
  }

  const systemPrompt = `You are NeuroBreath Buddy, a friendly and supportive assistant for NeuroBreath — a UK-based platform providing neurodivergent-friendly breathing techniques and wellbeing tools for ADHD, autism, anxiety, sleep, and dyslexia support.

Rules:
- Be warm, concise, and evidence-aware.
- Never give medical diagnoses or replace professional advice.
- If the user seems in crisis, direct them to NHS 111, Samaritans (116 123), or emergency services (999).
- Reference NeuroBreath pages and tools when relevant.
- Keep answers under 300 words unless the user asks for detail.
- Use British English spelling.${context ? `\n\nRelevant site content for context:\n${context}` : ""}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content?.trim() || "I wasn't able to generate a response. Please try rephrasing your question.";
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as ChatRequestBody | null;
  const message = body?.message?.trim();

  if (!message) {
    return Response.json({ error: "Missing message" }, { status: 400 });
  }

  if (message.length > 2000) {
    return Response.json({ error: "Message too long (max 2000 chars)" }, { status: 400 });
  }

  const db = getAdminFirestore();

  // ── Step 1: Deterministic navigation matching ──
  if (db) {
    const navMatch = await matchNavigation(db, message);
    if (navMatch) {
      const reply = `I can take you to **${navMatch.title}** — ${navMatch.description}.\n\n👉 [Go to ${navMatch.title}](${navMatch.path})`;
      const response: ChatResponsePayload = {
        reply,
        sessionId: null,
        source: "navigation",
        navigateTo: navMatch.path,
      };

      // Persist if user is authenticated
      if (body?.uid && db) {
        try {
          response.sessionId = await saveMessage(db, body.uid, body.sessionId, message, reply, body.pathname);
        } catch (err) {
          console.error("[api/chat] Failed to save chat history:", err);
        }
      }

      return Response.json(response);
    }
  }

  // ── Step 2: Knowledge search + AI answer ──
  let context: string | null = null;
  if (db) {
    try {
      context = await searchKnowledge(db, message);
    } catch (err) {
      console.error("[api/chat] Knowledge search failed:", err);
    }
  }

  let reply: string;
  let source: ChatResponsePayload["source"];

  try {
    reply = await askOpenAI(message, context);
    source = context ? "knowledge" : "ai";
  } catch (err) {
    console.error("[api/chat] OpenAI call failed:", err);
    reply = "I'm having trouble processing that right now. You can browse our pages directly — try ADHD, Autism, Breathing, or Sleep hubs for specific support.";
    source = "fallback";
  }

  const response: ChatResponsePayload = {
    reply,
    sessionId: null,
    source,
  };

  // Persist if user is authenticated
  if (body?.uid && db) {
    try {
      response.sessionId = await saveMessage(db, body.uid, body.sessionId, message, reply, body.pathname);
    } catch (err) {
      console.error("[api/chat] Failed to save chat history:", err);
    }
  }

  return Response.json(response);
}
