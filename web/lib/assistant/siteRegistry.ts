import 'server-only';

import type { InternalIndex, InternalPageMetadata } from '@/lib/buddy/kb/types';
import { loadInternalIndex, searchInternalIndex } from '@/lib/buddy/kb/contentIndex';

export type AssistantRegion = 'uk' | 'us' | undefined;

export interface SiteRegistryPage {
  path: string;
  title: string;
  description?: string;
  headings?: Array<{ text: string; id: string; level: number }>;
  keyTopics?: string[];
}

let registryPromise: Promise<InternalIndex> | null = null;

export async function getInternalIndex(): Promise<InternalIndex> {
  if (!registryPromise) {
    registryPromise = loadInternalIndex();
  }
  return registryPromise;
}

export async function searchSiteRegistry(
  query: string,
  options?: { limit?: number; region?: AssistantRegion }
): Promise<SiteRegistryPage[]> {
  const index = await getInternalIndex();
  const limit = options?.limit ?? 7;

  const hits = searchInternalIndex(index, query, {
    limit,
    region: options?.region,
  });

  return hits.map(toRegistryPage);
}

function toRegistryPage(page: InternalPageMetadata): SiteRegistryPage {
  const title = page.title && page.title !== '/' ? page.title : page.path;
  return {
    path: page.path,
    title,
    description: page.description,
    headings: page.headings,
    keyTopics: page.keyTopics,
  };
}

function dedupeByPath(pages: SiteRegistryPage[]): SiteRegistryPage[] {
  const seen = new Set<string>();
  const out: SiteRegistryPage[] = [];
  for (const p of pages) {
    if (!p?.path) continue;
    if (seen.has(p.path)) continue;
    seen.add(p.path);
    out.push(p);
  }
  return out;
}

const DEFAULT_FALLBACK_INTERNAL_PATHS = ['/', '/tools', '/techniques', '/evidence', '/adhd', '/autism'];

export async function ensureMinimumInternalPages(
  input: SiteRegistryPage[],
  opts?: { min?: number; region?: AssistantRegion; queryHint?: string }
): Promise<SiteRegistryPage[]> {
  const min = opts?.min ?? 3;
  const region = opts?.region;

  const unique = dedupeByPath(input);
  if (unique.length >= min) return unique;

  const index = await getInternalIndex();

  const candidates: SiteRegistryPage[] = [];

  // 1) If we have a query hint, use it to pull more.
  if (opts?.queryHint) {
    candidates.push(
      ...searchInternalIndex(index, opts.queryHint, { limit: 12, region }).map(toRegistryPage)
    );
  }

  // 2) Curated defaults.
  const byPath = new Map(index.pages.map((p) => [p.path, p] as const));
  for (const p of DEFAULT_FALLBACK_INTERNAL_PATHS) {
    const hit = byPath.get(p);
    if (hit) candidates.push(toRegistryPage(hit));
    else candidates.push({ path: p, title: p });
  }

  return dedupeByPath([...unique, ...candidates]).slice(0, Math.max(min, unique.length));
}

export function toMarkdownInternalLinks(pages: SiteRegistryPage[], max = 6): string {
  const lines = pages.slice(0, max).map((p) => `• [${p.title}](${p.path})`);
  return lines.join('\n');
}
