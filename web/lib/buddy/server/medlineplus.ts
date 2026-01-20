import { cacheGet, cacheSet, rateLimit } from './cache';

const MEDLINE_TTL_MS = 12 * 60 * 60 * 1000;

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractFirstResult(xml: string): { title: string; summary: string; url: string } | null {
  const docTitle = xml.match(/<title>(.*?)<\/title>/)?.[1]?.trim();
  const docUrl = xml.match(/<url>(.*?)<\/url>/)?.[1]?.trim();
  const fullSummary = xml
    .match(/<FullSummary>([\s\S]*?)<\/FullSummary>/)?.[1]
    ?.replace(/<[^>]+>/g, '')
    ?.trim();

  if (!docTitle || !docUrl || !fullSummary) return null;

  return {
    title: decodeXml(docTitle),
    url: decodeXml(docUrl),
    summary: decodeXml(fullSummary),
  };
}

export async function fetchMedlinePlus(topic: string, ipKey: string): Promise<{ title: string; summary: string; url: string } | null> {
  const key = `medline:${topic.toLowerCase()}`;
  const cached = cacheGet<{ title: string; summary: string; url: string }>(key);
  if (cached) return cached;

  // NLM guidance: 85 req/min/IP. Stay under.
  const rl = rateLimit(`medline:${ipKey}`, 80, 60_000);
  if (!rl.ok) return null;

  const base = 'https://wsearch.nlm.nih.gov/ws/query';
  const url = `${base}?db=healthTopics&term=${encodeURIComponent(topic)}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(12000) }).catch(() => null);
  if (!res?.ok) return null;

  const xml = await res.text().catch(() => '');
  const top = extractFirstResult(xml);
  if (!top) return null;

  cacheSet(key, top, MEDLINE_TTL_MS);
  return top;
}
