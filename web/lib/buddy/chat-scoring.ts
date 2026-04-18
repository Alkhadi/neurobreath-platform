/**
 * Scoring helpers extracted from /api/chat for testability.
 * Pure functions — no side-effects, no external deps.
 */

import type { InternalPageMetadata } from "@/lib/buddy/kb/types";

export interface ScoredPage {
  page: InternalPageMetadata;
  score: number;
}

/**
 * Normalise a user query for matching: strip punctuation and common question
 * words so the core intent remains.
 */
export function normaliseQuery(raw: string): string {
  return (
    raw
      .replace(/[?!.,;:'"]/g, "")
      .replace(
        /\b(what|where|how|who|why|when|is|are|do|does|can|the|a|an)\b/gi,
        "",
      )
      .replace(/\s+/g, " ")
      .trim() || raw
  );
}

/**
 * Score a set of published pages against a normalised query string.
 * Returns up to `limit` results sorted by descending score.
 */
export function scorePages(
  pages: InternalPageMetadata[],
  query: string,
  limit = 5,
): ScoredPage[] {
  const queryLower = query.toLowerCase();
  return pages
    .filter((p) => p.isPublished)
    .map((page) => {
      let score = 0;
      if (page.title.toLowerCase() === queryLower) score += 100;
      else if (page.title.toLowerCase().includes(queryLower)) score += 80;
      if (page.keyTopics.some((t) => t.toLowerCase().includes(queryLower)))
        score += 60;
      if (page.description?.toLowerCase().includes(queryLower)) score += 40;
      if (page.headings.some((h) => h.text.toLowerCase().includes(queryLower)))
        score += 30;
      const words = queryLower.split(/\s+/);
      for (const w of words) {
        if (
          page.title.toLowerCase().includes(w) ||
          page.keyTopics.some((t) => t.toLowerCase().includes(w)) ||
          page.description?.toLowerCase().includes(w)
        )
          score += 5;
      }
      return { page, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Threshold above which we consider site content a "strong" match. */
export const STRONG_MATCH_THRESHOLD = 30;
