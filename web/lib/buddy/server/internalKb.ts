import fs from 'node:fs/promises';
import path from 'node:path';
import Fuse from 'fuse.js';

import { pageBuddyConfigs } from '@/lib/page-buddy-configs';
import { ROUTE_REGISTRY } from '@/lib/trust/routeRegistry';
import { cacheGetWithStatus, cacheSet } from './cache';
import { extractTopicCandidates, normalizeQuery } from './text';

export type InternalCoverage = 'high' | 'partial' | 'none';

export interface KbPage {
  route: string;
  title: string;
  summary: string;
  tags: string[];
  keySections: string[];
  evidenceRefs: string[];
}

export interface InternalSearchHit {
  page: KbPage;
  score: number; // 0 is best (Fuse score)
}

type RoutesMap = {
  generatedAt: string;
  routes: string[];
  staticRoutes: string[];
  dynamicRoutes: string[];
};

const ROUTES_JSON_PATH = path.join(process.cwd(), 'generated', 'appRoutes.json');
const ROUTES_TTL_MS = 6 * 60 * 60 * 1000;
const KB_TTL_MS = 6 * 60 * 60 * 1000;

function stripMarkdown(input: string): string {
  return String(input || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromRoute(route: string): string {
  if (route === '/') return 'Home';
  const seg = route.split('/').filter(Boolean);
  const words = seg[seg.length - 1]
    ?.replace(/-/g, ' ')
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
  return words || route;
}

async function getStaticRoutes(): Promise<Set<string>> {
  const cached = cacheGetWithStatus<Set<string>>('buddy:routes:static');
  if (cached.value) return cached.value;

  let json: RoutesMap | null = null;
  try {
    const raw = await fs.readFile(ROUTES_JSON_PATH, 'utf8');
    json = JSON.parse(raw) as RoutesMap;
  } catch {
    json = null;
  }

  const staticRoutes = new Set<string>(json?.staticRoutes || []);
  cacheSet('buddy:routes:static', staticRoutes, ROUTES_TTL_MS);
  return staticRoutes;
}

function normalizeTags(tags: string[]): string[] {
  return Array.from(
    new Set(
      tags
        .flatMap((t) => String(t || '').split(/[,/]/g))
        .map((t) => normalizeQuery(t))
        .filter(Boolean)
    )
  ).slice(0, 40);
}

async function buildKbPages(): Promise<KbPage[]> {
  const staticRoutes = await getStaticRoutes();

  const pages: KbPage[] = [];

  // 1) Page Buddy configs (best metadata coverage)
  for (const [route, cfg] of Object.entries(pageBuddyConfigs)) {
    if (!staticRoutes.has(route)) continue;

    pages.push({
      route,
      title: cfg.pageName,
      summary: stripMarkdown(cfg.welcomeMessage),
      tags: normalizeTags([...(cfg.keywords || []), ...(cfg.audiences || []), cfg.pageId, cfg.pageName]),
      keySections: (cfg.sections || []).map((s) => s.name).filter(Boolean),
      evidenceRefs: ROUTE_REGISTRY[route]?.primarySources || [],
    });
  }

  // 2) Route registry (fallback for routes not in configs)
  for (const [route, gov] of Object.entries(ROUTE_REGISTRY)) {
    if (!staticRoutes.has(route)) continue;
    if (pages.some((p) => p.route === route)) continue;

    pages.push({
      route,
      title: titleFromRoute(route),
      summary: stripMarkdown(gov.notes || ''),
      tags: normalizeTags([gov.category, ...(gov.badges || []), ...(gov.primarySources || [])]),
      keySections: [],
      evidenceRefs: gov.primarySources || [],
    });
  }

  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

export async function getKbIndex(): Promise<KbPage[]> {
  return (await getKbIndexWithCache()).pages;
}

export async function getKbIndexWithCache(): Promise<{ pages: KbPage[]; cache: 'hit' | 'miss' }> {
  const cached = cacheGetWithStatus<KbPage[]>('buddy:kb:index');
  if (cached.value) return { pages: cached.value, cache: cached.hit };

  const pages = await buildKbPages();
  cacheSet('buddy:kb:index', pages, KB_TTL_MS);
  return { pages, cache: 'miss' };
}

export async function searchInternalKb(
  question: string,
  limit = 5
): Promise<{ hits: InternalSearchHit[]; coverage: InternalCoverage; cache: 'hit' | 'miss' }> {
  const { pages, cache } = await getKbIndexWithCache();
  const q = String(question || '').trim();

  if (!q || pages.length === 0) {
    return { hits: [], coverage: 'none', cache };
  }

  const fuse = new Fuse(pages, {
    includeScore: true,
    shouldSort: true,
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'summary', weight: 0.25 },
      { name: 'tags', weight: 0.2 },
      { name: 'keySections', weight: 0.1 },
    ],
  });

  // Expand acronyms like PTSD -> post-traumatic stress disorder
  const queries = extractTopicCandidates(q);
  const results = queries.flatMap((qq) => fuse.search(qq, { limit }));

  // Deduplicate by route, keep best score
  const byRoute = new Map<string, InternalSearchHit>();
  for (const r of results) {
    const score = typeof r.score === 'number' ? r.score : 1;
    const existing = byRoute.get(r.item.route);
    if (!existing || score < existing.score) {
      byRoute.set(r.item.route, { page: r.item, score });
    }
  }

  const hits = Array.from(byRoute.values()).sort((a, b) => a.score - b.score).slice(0, limit);
  const best = hits[0]?.score;

  let coverage: InternalCoverage = 'none';
  if (typeof best === 'number') {
    if (best <= 0.22) coverage = 'high';
    else if (best <= 0.38) coverage = 'partial';
  }

  return { hits, coverage, cache };
}

export async function isValidInternalRoute(route: string): Promise<boolean> {
  const staticRoutes = await getStaticRoutes();
  return staticRoutes.has(route);
}
