import { cacheGetWithStatus, cacheSet } from './cache';
import { extractTopicCandidates, scoreTextMatch } from './text';

export interface NhsManifestEntry {
  title: string;
  apiUrl: string;
  webUrl?: string;
  description?: string;
}

const MANIFEST_TTL_MS = 24 * 60 * 60 * 1000;

function getNhsBaseUrl(): string {
  return (
    process.env.NHS_WEBSITE_CONTENT_API_BASE ||
    process.env.NHS_WEBSITE_CONTENT_BASE_URL ||
    'https://api.service.nhs.uk/nhs-website-content'
  );
}

function addModulesParam(url: string): string {
  if (url.includes('modules=true')) return url;
  return url.includes('?') ? `${url}&modules=true` : `${url}?modules=true`;
}

function getNextUrl(json: Record<string, unknown>): string | null {
  const direct = typeof json.next === 'string' ? json.next : null;
  if (direct) return direct;

  const links = json.links as Record<string, unknown> | undefined;
  const next = (links?.next as Record<string, unknown> | undefined)?.href;
  if (typeof next === 'string') return next;

  return null;
}

function extractEntries(json: unknown, base: string): NhsManifestEntry[] {
  const root = json as Record<string, unknown>;
  const items =
    (Array.isArray(root?.items) && (root.items as unknown[])) ||
    (Array.isArray(root?.pages) && (root.pages as unknown[])) ||
    (Array.isArray(root?.hasPart) && (root.hasPart as unknown[])) ||
    null;

  if (!items) return [];

  const out: NhsManifestEntry[] = [];
  for (const item of items) {
    const obj = item as Record<string, unknown>;

    const title =
      (typeof obj.name === 'string' && obj.name.trim()) ||
      (typeof obj.title === 'string' && obj.title.trim()) ||
      (typeof obj.headline === 'string' && obj.headline.trim()) ||
      '';

    const apiUrl =
      (typeof obj.url === 'string' && obj.url) ||
      (typeof obj['@id'] === 'string' && (obj['@id'] as string)) ||
      '';

    const webUrl =
      (typeof obj.webUrl === 'string' && obj.webUrl) ||
      (typeof obj.webpage === 'string' && obj.webpage) ||
      (typeof obj.sameAs === 'string' && obj.sameAs) ||
      undefined;

    const description = (typeof obj.description === 'string' && obj.description.trim()) || undefined;

    if (!title || !apiUrl) continue;
    if (!apiUrl.startsWith('http')) continue;

    // Filter to likely NHS content API URLs (best-effort)
    if (!apiUrl.startsWith(base)) continue;

    out.push({ title, apiUrl, webUrl, description });
  }

  return out;
}

async function fetchJson(url: string, apiKey: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(url, {
    headers: { apikey: apiKey },
    signal: AbortSignal.timeout(12000),
  }).catch(() => null);

  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as Record<string, unknown> | null;
}

export async function getManifestIndex(): Promise<NhsManifestEntry[] | null> {
  const cached = cacheGetWithStatus<NhsManifestEntry[]>('nhs:manifest:index');
  if (cached.value) return cached.value;

  const apiKey = process.env.NHS_WEBSITE_CONTENT_API_KEY;
  if (!apiKey) return null;

  const base = getNhsBaseUrl();
  const startCandidates = [`${base}/manifest/pages/?pageSize=200`, `${base}/manifest/pages/`];

  let entries: NhsManifestEntry[] = [];

  for (const startUrl of startCandidates) {
    let nextUrl: string | null = startUrl;
    let pageCount = 0;

    while (nextUrl && pageCount < 20) {
      pageCount += 1;
      const json = await fetchJson(nextUrl, apiKey);
      if (!json) break;

      entries = entries.concat(extractEntries(json, base));
      nextUrl = getNextUrl(json);

      // Some endpoints return relative next links
      if (nextUrl && nextUrl.startsWith('/')) nextUrl = `${base}${nextUrl}`;
    }

    if (entries.length > 0) break;
  }

  if (entries.length === 0) return null;

  // Deduplicate by apiUrl
  const deduped = Array.from(new Map(entries.map((e) => [e.apiUrl, e])).values());
  cacheSet('nhs:manifest:index', deduped, MANIFEST_TTL_MS);
  return deduped;
}

export async function getManifestIndexWithCache(): Promise<{ index: NhsManifestEntry[] | null; cache: 'hit' | 'miss' }> {
  const cached = cacheGetWithStatus<NhsManifestEntry[]>('nhs:manifest:index');
  if (cached.value) return { index: cached.value, cache: cached.hit };
  const index = await getManifestIndex();
  return { index, cache: index ? 'miss' : 'miss' };
}

export async function resolveNhsTopic(question: string): Promise<{ entry: NhsManifestEntry | null; cache: 'hit' | 'miss' }> {
  const { index, cache } = await getManifestIndexWithCache();
  if (!index) return { entry: null, cache };

  const candidates = extractTopicCandidates(question);

  let best: { entry: NhsManifestEntry; score: number } | null = null;
  for (const entry of index) {
    const haystack = `${entry.title} ${entry.description || ''} ${entry.webUrl || ''} ${entry.apiUrl}`;
    let score = scoreTextMatch(haystack, candidates);

    const url = (entry.webUrl || entry.apiUrl).toLowerCase();
    if (url.includes('/mental-health/')) score += 20;
    if (url.includes('/conditions/')) score += 10;
    if (url.includes('/health-a-to-z/')) score += 10;

    if (!best || score > best.score) best = { entry, score };
  }

  if (!best || best.score < 60) return { entry: null, cache };
  return { entry: best.entry, cache };
}

export function extractTextFromNhsJson(json: unknown): { title: string; text: string; lastReviewed?: string; publicUrl?: string } | null {
  const obj = json as Record<string, unknown>;
  const parts = Array.isArray(obj?.hasPart) ? (obj.hasPart as Array<Record<string, unknown>>) : [];
  const textBits: string[] = [];

  const title =
    (typeof obj?.name === 'string' && obj.name.trim()) ||
    (typeof obj?.headline === 'string' && obj.headline.trim()) ||
    'NHS topic';

  if (typeof obj?.description === 'string') textBits.push(obj.description);

  for (const p of parts) {
    if (typeof p?.name === 'string' && typeof p?.text === 'string') {
      textBits.push(`${p.name}\n${p.text}`);
      continue;
    }
    if (typeof p?.text === 'string') textBits.push(p.text);
  }

  const text = textBits.join('\n\n').trim();
  if (!text) return null;

  const publicUrl = typeof obj?.url === 'string' ? obj.url : undefined;
  const lastReviewed =
    (typeof obj?.lastReviewed === 'string' && obj.lastReviewed) ||
    (typeof obj?.dateModified === 'string' && obj.dateModified) ||
    undefined;

  return { title, text, lastReviewed, publicUrl };
}

export async function fetchResolvedNhsPage(entry: NhsManifestEntry): Promise<{ title: string; text: string; lastReviewed?: string; publicUrl?: string } | null> {
  const apiKey = process.env.NHS_WEBSITE_CONTENT_API_KEY;
  if (!apiKey) return null;

  const url = addModulesParam(entry.apiUrl);
  const json = await fetchJson(url, apiKey);
  if (!json) return null;

  const extracted = extractTextFromNhsJson(json);
  if (!extracted) return null;

  return {
    ...extracted,
    publicUrl: extracted.publicUrl || entry.webUrl,
  };
}
