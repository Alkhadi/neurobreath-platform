import { cacheGetWithStatus, cacheSet } from './cache';
import { extractTopicCandidates } from './text';

export interface NhsManifestEntry {
  title: string;
  apiUrl: string;
  webUrl?: string;
  description?: string;
}

const MANIFEST_TTL_MS = 24 * 60 * 60 * 1000;

const NHS_BASE_URLS: Record<string, string> = {
  sandbox: 'https://sandbox.api.service.nhs.uk/nhs-website-content',
  integration: 'https://int.api.service.nhs.uk/nhs-website-content',
  production: 'https://api.service.nhs.uk/nhs-website-content',
};

function getNhsBaseUrl(): string {
  // Explicit base URL override takes priority
  if (process.env.NHS_WEBSITE_CONTENT_API_BASE) return process.env.NHS_WEBSITE_CONTENT_API_BASE;
  if (process.env.NHS_WEBSITE_CONTENT_BASE_URL) return process.env.NHS_WEBSITE_CONTENT_BASE_URL;

  // Respect NHS_WEBSITE_CONTENT_API_ENV (sandbox | integration | production)
  const env = (process.env.NHS_WEBSITE_CONTENT_API_ENV || '').toLowerCase().trim();
  if (env && NHS_BASE_URLS[env]) return NHS_BASE_URLS[env];

  // Fallback: if a key is set, default to production; otherwise sandbox
  return process.env.NHS_WEBSITE_CONTENT_API_KEY
    ? NHS_BASE_URLS.production
    : NHS_BASE_URLS.sandbox;
}

function isSandbox(url: string): boolean {
  return url.startsWith('https://sandbox.api.service.nhs.uk');
}

function addModulesParam(url: string): string {
  if (url.includes('modules=true')) return url;
  return url.includes('?') ? `${url}&modules=true` : `${url}?modules=true`;
}

/**
 * Convert a topic phrase into URL slugs to try against the NHS Content API.
 * Returns slugs in order of specificity (most specific first).
 *
 * The NHS website appends the condition acronym to the slug, e.g.:
 *   "generalised anxiety disorder" → "generalised-anxiety-disorder-gad"
 *   "obsessive compulsive disorder" → "obsessive-compulsive-disorder-ocd"
 *   "post traumatic stress disorder" → "post-traumatic-stress-disorder-ptsd"
 * We generate both the plain slug and the acronym-appended variant.
 */
function topicToSlugs(topic: string): string[] {
  const slug = topic
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) return [];

  const words = slug.split('-').filter(Boolean);
  const slugs: string[] = [slug];

  // NHS appends acronym: "generalised-anxiety-disorder" → "generalised-anxiety-disorder-gad"
  if (words.length >= 2) {
    const acronym = words.map((w) => w[0]).join('');
    if (acronym.length >= 2 && acronym.length <= 6) {
      slugs.push(`${slug}-${acronym}`);
    }
  }

  if (words.length > 2) {
    // Also try shorter tail: "anxiety-disorder" and "anxiety-disorder-ad"
    const tail = words.slice(-2).join('-');
    const tailAcronym = words.slice(-2).map((w) => w[0]).join('');
    slugs.push(tail);
    if (tailAcronym.length >= 2) slugs.push(`${tail}-${tailAcronym}`);
    slugs.push(words[words.length - 1]);
  } else if (words.length === 2) {
    slugs.push(words[0]);
  }

  return [...new Set(slugs)].filter(Boolean);
}

/**
 * NHS Content API v2 path prefixes to probe.
 * /mental-health/conditions/ is listed first because most Buddy queries are
 * mental-health topics. Production 404s return in <100 ms so the cost is low.
 */
const NHS_PATH_PREFIXES = [
  '/mental-health/conditions/',
  '/conditions/',
  '/mental-health/',
  '/live-well/',
] as const;

export interface NhsFetchDiag {
  url: string;
  status: number | null;
  error: 'auth' | 'forbidden' | 'not_found' | 'rate_limited' | 'timeout' | 'network' | 'parse' | null;
}

let _lastDiag: NhsFetchDiag | null = null;

/** Returns the diagnostic from the most recent fetchJson call (for observability). */
export function getLastNhsDiag(): NhsFetchDiag | null { return _lastDiag; }

async function fetchJson(url: string, apiKey: string, timeoutMs = 12000): Promise<Record<string, unknown> | null> {
  const headers: Record<string, string> = {};
  if (apiKey && !isSandbox(url)) headers.apikey = apiKey;

  const logCtx = {
    component: 'nhs',
    baseUrl: getNhsBaseUrl(),
    hasApiKey: !!apiKey,
    isSandbox: isSandbox(url),
    path: url.replace(/https?:\/\/[^/]+/, ''),
  };

  let res: Response | null = null;
  try {
    res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === 'TimeoutError';
    const errorType = isTimeout ? 'timeout' : 'network';
    console.error(JSON.stringify({ ...logCtx, event: 'nhs_fetch_error', error: errorType, message: String(err) }));
    _lastDiag = { url, status: null, error: errorType };
    return null;
  }

  if (!res.ok) {
    const errorMap: Record<number, NhsFetchDiag['error']> = { 401: 'auth', 403: 'forbidden', 404: 'not_found', 429: 'rate_limited' };
    const errorType = errorMap[res.status] || 'network';
    console.error(JSON.stringify({ ...logCtx, event: 'nhs_fetch_http_error', status: res.status, error: errorType }));
    _lastDiag = { url, status: res.status, error: errorType };
    return null;
  }

  _lastDiag = { url, status: res.status, error: null };

  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    console.error(JSON.stringify({ ...logCtx, event: 'nhs_fetch_parse_error', status: res.status }));
    _lastDiag = { url, status: res.status, error: 'parse' };
    return null;
  }
}

/**
 * Resolve an NHS topic by directly probing slug-based URLs against the NHS
 * Content API v2. This avoids the non-existent /manifest/pages/ endpoint and
 * instead tries paths like /conditions/{slug}/ and /mental-health/{slug}/.
 *
 * Strategy: iterate prefixes in the outer loop, slugs in the inner loop.
 * This ensures the most likely prefix (/mental-health/conditions/) is tried
 * with ALL slug variants before falling through to less likely prefixes.
 *
 * Example for "generalised anxiety disorder":
 *   slugs → ["generalised-anxiety-disorder", "generalised-anxiety-disorder-gad", ...]
 *   prefix 1: /mental-health/conditions/generalised-anxiety-disorder/ → 404
 *   prefix 1: /mental-health/conditions/generalised-anxiety-disorder-gad/ → 200 ✓
 *
 * Attempt budget: MAX_ATTEMPTS=6, per-probe timeout=3 s, wall-clock cap=12 s.
 * Production 404s return in <100 ms so 6 probes ≈ <600 ms in the happy path.
 */
export async function resolveNhsTopic(question: string): Promise<{ entry: NhsManifestEntry | null; cache: 'hit' | 'miss' }> {
  const base = getNhsBaseUrl();
  const apiKey = process.env.NHS_WEBSITE_CONTENT_API_KEY ?? '';
  if (!apiKey && !isSandbox(base)) return { entry: null, cache: 'miss' };

  const candidates = extractTopicCandidates(question).slice(0, 2);

  let attempts = 0;
  const MAX_ATTEMPTS = 6;
  const deadline = Date.now() + 12_000; // 12 s wall-clock cap

  // Outer loop: prefix — ensures the best prefix is exhausted across all slug
  // variants before we try a less likely prefix.
  for (const prefix of NHS_PATH_PREFIXES) {
    for (const candidate of candidates) {
      const slugs = topicToSlugs(candidate).slice(0, 4);

      for (const slug of slugs) {
        if (attempts >= MAX_ATTEMPTS || Date.now() > deadline) return { entry: null, cache: 'miss' };
        attempts += 1;

        const url = `${base}${prefix}${slug}/`;
        const cacheKey = `nhs:slug:${url}`;

        const cached = cacheGetWithStatus<NhsManifestEntry>(cacheKey);
        if (cached.value) return { entry: cached.value, cache: 'hit' };

        const json = await fetchJson(url, apiKey, 3000);
        if (!json) continue; // 404/timeout/error — try next

        const title =
          (typeof json.name === 'string' && json.name.trim()) ||
          (typeof json.headline === 'string' && json.headline.trim()) ||
          candidate;
        const webUrl = (typeof json.url === 'string' && json.url) || undefined;

        const entry: NhsManifestEntry = { title, apiUrl: url, webUrl };
        cacheSet(cacheKey, entry, MANIFEST_TTL_MS);

        console.log(JSON.stringify({
          component: 'nhs',
          event: 'nhs_slug_resolved',
          slug,
          prefix,
          title,
          url,
          attempts,
        }));

        return { entry, cache: 'miss' };
      }
    }
  }

  return { entry: null, cache: 'miss' };
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
  const apiKey = process.env.NHS_WEBSITE_CONTENT_API_KEY ?? '';
  if (!apiKey && !isSandbox(entry.apiUrl)) return null;

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
