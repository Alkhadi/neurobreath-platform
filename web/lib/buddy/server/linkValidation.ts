import { cacheGetWithStatus, cacheSet } from './cache';

const EXTERNAL_VALIDATION_TTL_MS = 6 * 60 * 60 * 1000;

export type ExternalLinkValidation =
  | { ok: true; status: number; contentType?: string }
  | { ok: false; status?: number; reason: string };

function looksLikeNotFound(snippet: string): boolean {
  return /(page not found|404|not\s+found|does not exist|gone|410)/i.test(snippet);
}

function isHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

async function tryHead(url: string): Promise<Response | null> {
  const res = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  return res;
}

async function tryGetSnippet(url: string): Promise<{ res: Response; snippet: string } | null> {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      // Many servers ignore Range; still helps when supported.
      Range: 'bytes=0-20000',
      'User-Agent': 'NeuroBreathBuddyLinkValidator/1.0',
      Accept: 'text/html,application/json;q=0.9,*/*;q=0.1',
    },
    signal: AbortSignal.timeout(12000),
  }).catch(() => null);

  if (!res) return null;

  const text = await res.text().catch(() => '');
  return { res, snippet: text.slice(0, 20000) };
}

export async function validateExternalUrl(
  url: string,
  onCache?: (hit: 'hit' | 'miss') => void
): Promise<ExternalLinkValidation> {
  const key = `buddy:extlink:${url}`;
  const cached = cacheGetWithStatus<ExternalLinkValidation>(key);
  if (cached.value) {
    onCache?.(cached.hit);
    return cached.value;
  }
  onCache?.('miss');

  if (!url || !isHttpUrl(url)) {
    const fail: ExternalLinkValidation = { ok: false, reason: 'Invalid URL' };
    cacheSet(key, fail, EXTERNAL_VALIDATION_TTL_MS);
    return fail;
  }

  const head = await tryHead(url);
  if (head?.ok) {
    const ct = head.headers.get('content-type') || '';
    // Allow HTML/JSON; reject obvious non-content types.
    if (!/(text\/html|application\/json|text\/plain)/i.test(ct)) {
      const fail: ExternalLinkValidation = { ok: false, status: head.status, reason: `Unsupported content-type: ${ct}` };
      cacheSet(key, fail, EXTERNAL_VALIDATION_TTL_MS);
      return fail;
    }

    const ok: ExternalLinkValidation = { ok: true, status: head.status, contentType: ct };
    cacheSet(key, ok, EXTERNAL_VALIDATION_TTL_MS);
    return ok;
  }

  // HEAD is often blocked; fallback to GET and sniff content.
  const fetched = await tryGetSnippet(url);
  if (!fetched) {
    const fail: ExternalLinkValidation = { ok: false, reason: 'Network error' };
    cacheSet(key, fail, EXTERNAL_VALIDATION_TTL_MS);
    return fail;
  }

  const { res, snippet } = fetched;
  const ct = res.headers.get('content-type') || '';

  if (!res.ok) {
    const fail: ExternalLinkValidation = { ok: false, status: res.status, reason: `HTTP ${res.status}` };
    cacheSet(key, fail, EXTERNAL_VALIDATION_TTL_MS);
    return fail;
  }

  if (!/(text\/html|application\/json|text\/plain)/i.test(ct)) {
    const fail: ExternalLinkValidation = { ok: false, status: res.status, reason: `Unsupported content-type: ${ct}` };
    cacheSet(key, fail, EXTERNAL_VALIDATION_TTL_MS);
    return fail;
  }

  if (/text\/html/i.test(ct) && looksLikeNotFound(snippet)) {
    const fail: ExternalLinkValidation = { ok: false, status: res.status, reason: 'Not-found markers detected' };
    cacheSet(key, fail, EXTERNAL_VALIDATION_TTL_MS);
    return fail;
  }

  const ok: ExternalLinkValidation = { ok: true, status: res.status, contentType: ct };
  cacheSet(key, ok, EXTERNAL_VALIDATION_TTL_MS);
  return ok;
}
