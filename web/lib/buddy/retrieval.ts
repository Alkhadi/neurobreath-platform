/**
 * Content retrieval from Firestore siteContentChunks.
 *
 * Two strategies:
 *   1. Embedding-based similarity (when embeddings exist and OpenAI is available)
 *   2. Keyword-based fallback (always works)
 *
 * The caller gets ranked content chunks for inclusion in the LLM prompt.
 */

import type { Firestore } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { getOpenAIClient } from "@/lib/openai";

export interface RetrievedChunk {
  title: string;
  url: string;
  content: string;
  score: number;
}

// ─── Embedding helpers ───────────────────────────────────────────────────────

async function getQueryEmbedding(query: string): Promise<number[] | null> {
  const openai = getOpenAIClient();
  if (!openai) return null;

  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  try {
    const resp = await openai.embeddings.create({
      model,
      input: query,
    });
    return resp.data[0]?.embedding ?? null;
  } catch (err) {
    console.error("[buddy/retrieval] Embedding generation failed:", err);
    return null;
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ─── Keyword search (fallback) ───────────────────────────────────────────────

function keywordScore(query: string, title: string, content: string, keywords: string[]): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2).slice(0, 12);

  let score = 0;
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  for (const word of words) {
    if (titleLower.includes(word)) score += 5;
    if (keywords.some((kw) => kw.toLowerCase().includes(word))) score += 4;
    // Count content occurrences (capped)
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = contentLower.match(new RegExp(escaped, "g"));
    score += Math.min(matches?.length ?? 0, 8);
  }
  return score;
}

// ─── Main retrieval ──────────────────────────────────────────────────────────

/**
 * Retrieve the most relevant content chunks for a given query.
 * Attempts embedding similarity first; falls back to keyword scoring.
 */
export async function retrieveContent(
  db: Firestore,
  query: string,
  maxResults = 5,
): Promise<RetrievedChunk[]> {
  const snap = await db
    .collection(COLLECTIONS.SITE_CONTENT_CHUNKS)
    .where("published", "==", true)
    .get();

  if (snap.empty) return [];

  // Try embedding-based search
  const queryEmbedding = await getQueryEmbedding(query);

  const scored: RetrievedChunk[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    const title = (data.title as string) ?? "";
    const url = (data.url as string) ?? "";
    const content = (data.content as string) ?? "";
    const keywords = (data.keywords as string[]) ?? [];
    const embedding = data.embedding as number[] | undefined;

    let score: number;

    if (queryEmbedding && embedding && embedding.length === queryEmbedding.length) {
      score = cosineSimilarity(queryEmbedding, embedding);
    } else {
      // Keyword fallback — normalise to 0-1 range roughly
      score = keywordScore(query, title, content, keywords) / 50;
    }

    if (score > 0.01) {
      scored.push({ title, url, content: content.slice(0, 2500), score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults);
}

/**
 * Build a context string from retrieved chunks for the LLM system prompt.
 */
export function buildContextFromChunks(chunks: RetrievedChunk[]): string | null {
  if (chunks.length === 0) return null;
  return chunks
    .map((c) => `--- ${c.title} (${c.url}) ---\n${c.content}`)
    .join("\n\n");
}
