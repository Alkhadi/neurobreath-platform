/**
 * Deterministic navigation resolution for Buddy.
 *
 * Reads the siteNavigation Firestore collection and matches user queries
 * to exact site paths BEFORE any LLM call. This ensures navigation is
 * always accurate and instant.
 */

import type { Firestore } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";

export interface NavMatch {
  path: string;
  title: string;
  url: string;
}

interface NavEntry {
  title: string;
  url: string;
  path: string;
  aliases: string[];
  published: boolean;
}

// ─── Navigation intent detection ─────────────────────────────────────────────

const NAV_PATTERNS = [
  /(?:go\s+to|take\s+me\s+to|navigate\s+to|show\s+me|open|visit|find)\s+(?:the\s+)?(.+?)(?:\s+page)?$/i,
  /(?:where\s+is|where\s+can\s+i\s+find)\s+(?:the\s+)?(.+?)(?:\s+page)?$/i,
];

function extractNavTarget(query: string): string | null {
  for (const pattern of NAV_PATTERNS) {
    const match = query.match(pattern);
    if (match?.[1]) return match[1].trim().toLowerCase();
  }
  return null;
}

// ─── Matching logic ──────────────────────────────────────────────────────────

/**
 * Resolve a user query to a site path, if it matches a known navigation entry.
 * Returns null if no confident match is found.
 */
export async function resolveNavigation(
  db: Firestore,
  query: string,
): Promise<NavMatch | null> {
  const q = query.toLowerCase().trim();
  const navTarget = extractNavTarget(q);

  const snap = await db
    .collection(COLLECTIONS.SITE_NAVIGATION)
    .where("published", "==", true)
    .get();

  if (snap.empty) return null;

  let bestMatch: (NavMatch & { score: number }) | null = null;

  for (const doc of snap.docs) {
    const data = doc.data() as NavEntry;
    const title = data.title.toLowerCase();
    const aliases = (data.aliases ?? []).map((a) => a.toLowerCase());
    const allTerms = [title, ...aliases];

    let score = 0;

    // Exact title match in raw query
    if (q.includes(title)) score += 15;

    // Alias match in raw query
    for (const alias of aliases) {
      if (q.includes(alias)) score += 12;
    }

    // Match against extracted navigation target (higher confidence)
    if (navTarget) {
      for (const term of allTerms) {
        if (term.includes(navTarget) || navTarget.includes(term)) {
          score += 20;
        }
      }
    }

    // Path segment match (e.g. user says "adhd" and path contains "/adhd")
    const pathSegments = data.path.split("/").filter(Boolean);
    for (const seg of pathSegments) {
      if (q.includes(seg) && seg.length > 2) score += 5;
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = {
        path: data.path,
        title: data.title,
        url: data.url,
        score,
      };
    }
  }

  // Only return if confidence is reasonable
  if (bestMatch && bestMatch.score >= 10) {
    return { path: bestMatch.path, title: bestMatch.title, url: bestMatch.url };
  }

  return null;
}
