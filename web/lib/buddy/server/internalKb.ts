import fs from 'node:fs/promises';
import path from 'node:path';
import Fuse from 'fuse.js';

import { pageBuddyConfigs } from '@/lib/page-buddy-configs';
import { getFixtures } from '@/lib/seo/route-fixtures';
import { getSupportHubEntries } from '@/lib/support-hub/registry';
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

function normalizeRouteToFixturePattern(route: string): string {
  return String(route)
    .replace(/\[\.\.\.([^\]]+)\]/g, ':$1*')
    .replace(/\[([^\]]+)\]/g, ':$1');
}

async function getAllowedRoutes(): Promise<Set<string>> {
  const cached = cacheGetWithStatus<Set<string>>('buddy:routes:allowed');
  if (cached.value) return cached.value;

  let json: RoutesMap | null = null;
  try {
    const raw = await fs.readFile(ROUTES_JSON_PATH, 'utf8');
    json = JSON.parse(raw) as RoutesMap;
  } catch {
    json = null;
  }

  const allowed = new Set<string>(json?.staticRoutes || []);

  // Expand dynamic routes using fixtures so we can safely cite real URLs.
  for (const dyn of json?.dynamicRoutes || []) {
    const pattern = normalizeRouteToFixturePattern(dyn);
    const fixtures = getFixtures(pattern);
    for (const url of fixtures) {
      allowed.add(url);
    }
  }

  cacheSet('buddy:routes:allowed', allowed, ROUTES_TTL_MS);
  return allowed;
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
  const allowedRoutes = await getAllowedRoutes();

  const pages: KbPage[] = [];

  // 1) Page Buddy configs (best metadata coverage)
  for (const [route, cfg] of Object.entries(pageBuddyConfigs)) {
    if (!allowedRoutes.has(route)) continue;

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
    if (!allowedRoutes.has(route)) continue;
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

  // 3) Focus Garden “Support Hub” enrichment (curated tags + summaries)
  const hubEntries = getSupportHubEntries();
  const hubByRoute = new Map(hubEntries.map((e) => [e.route, e] as const));

  for (const p of pages) {
    const hub = hubByRoute.get(p.route);
    if (!hub) continue;

    // Prefer curated titles/summaries when available.
    p.title = hub.title || p.title;
    p.summary = hub.summary || p.summary;

    p.tags = normalizeTags([
      ...p.tags,
      ...hub.tags,
      ...(hub.domains || []),
      ...(hub.conditions || []),
      ...(hub.audiences || []),
    ]);

    if (hub.keySections?.length) {
      p.keySections = Array.from(new Set([...(p.keySections || []), ...hub.keySections])).slice(0, 40);
    }
  }

  // 4) Add any hub entries that weren't otherwise indexed but are routable.
  for (const hub of hubEntries) {
    if (!allowedRoutes.has(hub.route)) continue;
    if (pages.some((p) => p.route === hub.route)) continue;

    pages.push({
      route: hub.route,
      title: hub.title || titleFromRoute(hub.route),
      summary: hub.summary,
      tags: normalizeTags([...(hub.tags || []), ...(hub.domains || []), ...(hub.conditions || []), ...(hub.audiences || [])]),
      keySections: hub.keySections || [],
      evidenceRefs: ROUTE_REGISTRY[hub.route]?.primarySources || [],
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
  const allowedRoutes = await getAllowedRoutes();
  return allowedRoutes.has(route);
}
