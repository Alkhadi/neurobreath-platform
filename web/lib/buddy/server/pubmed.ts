import { cacheGet, cacheSet, rateLimit } from './cache';

const PUBMED_TTL_MS = 24 * 60 * 60 * 1000;

export interface PubMedCitation {
  title: string;
  url: string;
  year?: number;
}

export async function fetchPubMed(query: string, ipKey: string): Promise<PubMedCitation[]> {
  const cacheKey = `pubmed:${query.toLowerCase()}`;
  const cached = cacheGet<PubMedCitation[]>(cacheKey);
  if (cached) return cached;

  // NCBI guidance: 3 req/sec without API key.
  const rl = rateLimit(`pubmed:${ipKey}`, 3, 1000);
  if (!rl.ok) return [];

  const tool = process.env.NCBI_TOOL || 'neurobreath';
  const email = process.env.NCBI_EMAIL || 'contact@example.com';
  const apiKey = process.env.NCBI_API_KEY;

  const base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  const common = `tool=${encodeURIComponent(tool)}&email=${encodeURIComponent(email)}`;
  const keyParam = apiKey ? `&api_key=${encodeURIComponent(apiKey)}` : '';

  const esearch = `${base}/esearch.fcgi?db=pubmed&retmode=json&retmax=3&sort=relevance&${common}${keyParam}&term=${encodeURIComponent(query)}`;

  const sRes = await fetch(esearch, { signal: AbortSignal.timeout(12000) }).catch(() => null);
  if (!sRes?.ok) return [];

  const sJson = (await sRes.json().catch(() => null)) as Record<string, unknown> | null;
  const idList = (sJson?.esearchresult as { idlist?: string[] } | undefined)?.idlist || [];
  if (!idList.length) return [];

  const esummary = `${base}/esummary.fcgi?db=pubmed&retmode=json&${common}${keyParam}&id=${idList.join(',')}`;
  const sumRes = await fetch(esummary, { signal: AbortSignal.timeout(12000) }).catch(() => null);
  if (!sumRes?.ok) return [];

  const sumJson = (await sumRes.json().catch(() => null)) as Record<string, unknown> | null;
  const result = (sumJson?.result as Record<string, Record<string, unknown>> | undefined) || {};

  const citations: PubMedCitation[] = [];
  for (const uid of idList) {
    const entry = result[uid];
    if (!entry) continue;

    const title = typeof entry.title === 'string' ? entry.title : 'PubMed record';
    const year = typeof entry.pubdate === 'string' ? Number.parseInt(entry.pubdate.slice(0, 4), 10) : undefined;
    citations.push({ title, url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`, year: Number.isFinite(year) ? year : undefined });
  }

  cacheSet(cacheKey, citations, PUBMED_TTL_MS);
  return citations;
}
