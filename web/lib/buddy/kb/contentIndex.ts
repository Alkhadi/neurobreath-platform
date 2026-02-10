/**
 * Content Index for NeuroBreath Buddy
 * Search and retrieval interface for internal knowledge base
 */

import { InternalPageMetadata, InternalIndex } from './types';
import fs from 'fs';
import path from 'path';

// This will be generated at build time
let internalIndexCache: InternalIndex = { version: '1.0', generatedAt: new Date().toISOString(), pages: [] };
let indexLoaded = false;

export async function loadInternalIndex(): Promise<InternalIndex> {
  if (indexLoaded) {
    return internalIndexCache;
  }

  try {
    // Prefer filesystem load on the server to avoid fetch issues
    const fsPath = path.join(process.cwd(), 'public', 'generated', 'buddy-internal-index.json');
    if (fs.existsSync(fsPath)) {
      const raw = fs.readFileSync(fsPath, 'utf-8');
      internalIndexCache = JSON.parse(raw);
      indexLoaded = true;
      return internalIndexCache;
    }

    // Fallback to fetch (client or if fs missing)
    const response = await fetch('/generated/buddy-internal-index.json');
    if (!response.ok) {
      console.warn('[Buddy] Internal index not found; creating fallback');
      indexLoaded = true;
      return internalIndexCache;
    }
    internalIndexCache = await response.json();
    indexLoaded = true;
    return internalIndexCache;
  } catch (error) {
    console.warn('[Buddy] Failed to load internal index:', error);
    indexLoaded = true;
    return internalIndexCache;
  }
}

export function searchInternalIndex(
  index: InternalIndex,
  query: string,
  options?: { limit?: number; region?: 'uk' | 'us' }
): InternalPageMetadata[] {
  const limit = options?.limit ?? 5;
  const region = options?.region;
  const queryLower = query.toLowerCase();

  const scored = index.pages
    .filter((page) => {
      // Filter by region if specified
      if (region && page.regionSpecific?.regions && !page.regionSpecific.regions.includes(region)) {
        return false;
      }
      return page.isPublished;
    })
    .map((page) => {
      let score = 0;

      // Exact title match (highest priority)
      if (page.title.toLowerCase() === queryLower) {
        score += 100;
      } else if (page.title.toLowerCase().includes(queryLower)) {
        score += 80;
      }

      // Key topics match
      if (page.keyTopics.some((topic) => topic.toLowerCase().includes(queryLower))) {
        score += 60;
      }

      // Description match
      if (page.description?.toLowerCase().includes(queryLower)) {
        score += 40;
      }

      // Headings match
      if (page.headings.some((h) => h.text.toLowerCase().includes(queryLower))) {
        score += 30;
      }

      // Partial word match in any field
      const words = queryLower.split(/\s+/);
      words.forEach((word) => {
        if (
          page.title.toLowerCase().includes(word) ||
          page.keyTopics.some((t) => t.toLowerCase().includes(word)) ||
          page.description?.toLowerCase().includes(word)
        ) {
          score += 5;
        }
      });

      return { page, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.page);

  return scored;
}

export function getPageByPath(
  index: InternalIndex,
  path: string
): InternalPageMetadata | undefined {
  return index.pages.find((page) => page.path === path);
}

export function getPagesByAudience(
  index: InternalIndex,
  audience: string
): InternalPageMetadata[] {
  return index.pages.filter(
    (page) =>
      page.isPublished &&
      page.audiences.some((a) => a.toLowerCase() === audience.toLowerCase())
  );
}

export function getPagesByTopic(
  index: InternalIndex,
  topic: string
): InternalPageMetadata[] {
  const topicLower = topic.toLowerCase();
  return index.pages.filter(
    (page) =>
      page.isPublished &&
      page.keyTopics.some((t) => t.toLowerCase() === topicLower)
  );
}
