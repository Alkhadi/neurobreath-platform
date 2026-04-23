import { load } from 'cheerio';
import { cacheGetWithStatus, cacheSet } from './cache';
import { extractTopicCandidates } from './text';

export interface NhsManifestEntry {
  title: string;
  apiUrl: string;
  webUrl?: string;
  description?: string;
}

const MANIFEST_TTL_MS = 24 * 60 * 60 * 1000;
const PUBLIC_NHS_BASE_URL = 'https://www.nhs.uk';

export interface NhsResolvedPage {
  title: string;
  text: string;
  lastReviewed?: string;
  publicUrl?: string;
}

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

function apiUrlToPublicUrl(apiUrl: string): string | undefined {
  try {
    const parsed = new URL(apiUrl);
    const publicPath = parsed.pathname.replace(/^\/nhs-website-content/, '') || '/';
    return new URL(publicPath, PUBLIC_NHS_BASE_URL).toString();
  } catch {
    return undefined;
  }
}

function normalizePublicUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url, PUBLIC_NHS_BASE_URL).toString();
  } catch {
    return undefined;
  }
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

/**
 * Explicit known-good paths for common clinical topics.
 * Keys are normalized lowercase phrases; value is the exact NHS Content API path
 * (relative to base URL). Matched by substring against the extracted topic.
 *
 * Source: verified live against https://www.nhs.uk/ on 2026-04-23.
 * Add new entries here when you discover a clinical topic Buddy should surface.
 */
const NHS_KNOWN_PATHS: Array<{ match: RegExp; path: string }> = [
  { match: /\b(generalised|general)\s+anxiety(\s+disorder)?|\bgad\b/i, path: '/mental-health/conditions/generalised-anxiety-disorder-gad/' },
  { match: /\bpanic\s+(disorder|attack)/i, path: '/mental-health/conditions/panic-disorder/' },
  { match: /\b(social\s+anxiety|social\s+phobia)/i, path: '/mental-health/conditions/social-anxiety/' },
  { match: /\bphobia/i, path: '/mental-health/conditions/phobias/' },
  { match: /\b(ocd|obsessive\s+compulsive)/i, path: '/mental-health/conditions/obsessive-compulsive-disorder-ocd/' },
  { match: /\b(ptsd|post.?traumatic\s+stress)/i, path: '/mental-health/conditions/post-traumatic-stress-disorder-ptsd/' },
  { match: /\b(clinical\s+)?depression|\blow\s+mood\b/i, path: '/mental-health/conditions/clinical-depression/' },
  { match: /\bbipolar/i, path: '/mental-health/conditions/bipolar-disorder/' },
  { match: /\bschizophrenia/i, path: '/mental-health/conditions/schizophrenia/' },
  { match: /\beating\s+disorder|\banorexia|\bbulimia|\bbinge\s+eat/i, path: '/mental-health/conditions/eating-disorders/' },
  { match: /\bself.?harm/i, path: '/mental-health/feelings-symptoms-behaviours/behaviours/self-harm/' },
  { match: /\bsuicid/i, path: '/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/' },
  { match: /\badhd|attention\s+deficit/i, path: '/conditions/attention-deficit-hyperactivity-disorder-adhd/' },
  { match: /\b(autism|autistic|\basd\b)/i, path: '/conditions/autism/' },
  { match: /\bdyslexia/i, path: '/conditions/dyslexia/' },
  { match: /\binsomnia|\bsleep\s+problem|\btrouble\s+sleep/i, path: '/conditions/insomnia/' },
  { match: /\bsleep\s+apnoea|\bsleep\s+apnea/i, path: '/conditions/sleep-apnoea/' },
  { match: /\bstress\b/i, path: '/mental-health/feelings-symptoms-behaviours/feelings/stress/' },
  { match: /\bloneliness|\blonely/i, path: '/mental-health/feelings-symptoms-behaviours/feelings/loneliness-in-adults/' },
  { match: /\banger\s+(management|issues|problems)/i, path: '/mental-health/feelings-symptoms-behaviours/feelings/anger/' },
];

/** Return the first known path matching the question, or null. */
function matchKnownPath(question: string): string | null {
  for (const { match, path } of NHS_KNOWN_PATHS) {
    if (match.test(question)) return path;
  }
  return null;
}

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

  // 1) Fast path: explicit known-good paths for common clinical topics.
  const knownPath = matchKnownPath(question);
  if (knownPath) {
    const url = `${base}${knownPath}`;
    const cacheKey = `nhs:known:${url}`;
    const cached = cacheGetWithStatus<NhsManifestEntry>(cacheKey);
    if (cached.value) return { entry: cached.value, cache: 'hit' };

    const json = await fetchJson(url, apiKey, 5000);
    if (json) {
      const title =
        (typeof json.name === 'string' && json.name.trim()) ||
        (typeof json.headline === 'string' && json.headline.trim()) ||
        'NHS topic';
      const webUrl = (typeof json.url === 'string' && json.url) || undefined;
      const entry: NhsManifestEntry = { title, apiUrl: url, webUrl };
      cacheSet(cacheKey, entry, MANIFEST_TTL_MS);
      console.log(JSON.stringify({
        component: 'nhs',
        event: 'nhs_known_path_resolved',
        path: knownPath,
        title,
      }));
      return { entry, cache: 'miss' };
    }
    // If the known path fails, fall through to slug probing so a wrong map
    // entry doesn't break retrieval entirely.
  }

  // 2) Slug probing fallback.
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

const PUBLIC_HTML_SKIP_EXACT = new Set([
  'Cookies on the NHS website',
  'Support links',
  'Additional Links',
  'NHS homepage',
  'Search the NHS website',
]);

const PUBLIC_HTML_SKIP_PREFIXES = [
  'Accept analytics cookies',
  'Reject analytics cookies',
  'Choose your cookie settings',
  'Skip to main content',
  'Page last reviewed:',
  'Next review due:',
  'Home',
  'Health A to Z',
  'NHS services',
  'Healthy living',
  'Mental health',
  'Care and support',
  'About us',
  'Report an issue with the NHS website',
  'Accessibility statement',
  'Our policies',
];

function shouldSkipPublicHtmlText(text: string): boolean {
  if (!text) return true;
  if (PUBLIC_HTML_SKIP_EXACT.has(text)) return true;
  return PUBLIC_HTML_SKIP_PREFIXES.some((prefix) => text.startsWith(prefix));
}

export function extractTextFromNhsPublicHtml(html: string, publicUrl: string): NhsResolvedPage | null {
  const $ = load(html);
  const root = $('main').first().length ? $('main').first() : $('#maincontent').first();
  const scope = root.length ? root : $('body').first();

  const title = scope.find('h1').first().text().trim() || $('h1').first().text().trim() || 'NHS topic';
  const textBits: string[] = [];
  const seen = new Set<string>();
  let stop = false;

  scope.find('h2, h3, p, li').each((_, node) => {
    if (stop) return;

    const element = $(node);
    if (element.parents('header, footer, nav, aside, form').length > 0) return;

    const rawText = element.text().replace(/\s+/g, ' ').trim();
    if (!rawText || rawText === title || shouldSkipPublicHtmlText(rawText)) return;

    if (node.tagName === 'h2' && /^(Support links|Additional Links|Cookies on the NHS website)$/i.test(rawText)) {
      stop = true;
      return;
    }

    const formatted = node.tagName === 'li' ? `• ${rawText}` : rawText;
    if (seen.has(formatted)) return;

    seen.add(formatted);
    textBits.push(formatted);
  });

  if (textBits.length === 0) return null;

  const reviewMatch = html.match(/Page last reviewed:\s*([^<\n]+).*?Next review due:\s*([^<\n]+)/is);
  const lastReviewed = reviewMatch?.[1]?.trim();

  return {
    title,
    text: textBits.join('\n\n').trim(),
    lastReviewed,
    publicUrl: normalizePublicUrl(publicUrl),
  };
}

async function fetchPublicNhsPage(publicUrl: string, timeoutMs = 12000): Promise<NhsResolvedPage | null> {
  let res: Response;
  try {
    res = await fetch(publicUrl, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'user-agent': 'NeuroBreathBuddy/1.0 (+https://www.neurobreath.app)',
      },
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const html = await res.text().catch(() => '');
  if (!html) return null;

  return extractTextFromNhsPublicHtml(html, publicUrl);
}

export async function fetchResolvedNhsPage(entry: NhsManifestEntry): Promise<NhsResolvedPage | null> {
  const apiKey = process.env.NHS_WEBSITE_CONTENT_API_KEY ?? '';
  const publicUrl = normalizePublicUrl(entry.webUrl) || apiUrlToPublicUrl(entry.apiUrl);

  if (!apiKey && !isSandbox(entry.apiUrl)) {
    return publicUrl ? fetchPublicNhsPage(publicUrl) : null;
  }

  const url = addModulesParam(entry.apiUrl);
  const json = await fetchJson(url, apiKey);
  const extracted = json ? extractTextFromNhsJson(json) : null;
  if (extracted) {
    return {
      ...extracted,
      publicUrl: normalizePublicUrl(extracted.publicUrl) || publicUrl || entry.webUrl,
    };
  }

  if (!publicUrl) return null;

  const publicPage = await fetchPublicNhsPage(publicUrl);
  if (!publicPage) return null;

  return publicPage;
}
