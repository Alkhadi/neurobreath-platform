import { NextRequest, NextResponse } from 'next/server';
import {
  checkQuerySafety,
  generateEmergencyResponse,
  sanitizeInput,
  wrapAnswerWithSafety,
} from '@/lib/ai/core/safety';
import { routeQuery, type QueryType } from '@/lib/ai/core/answerRouter';
import {
  createMedlinePlusCitation,
  createNHSCitation,
  createPubMedCitation,
  deduplicateCitations,
  formatCitationGroup,
  groupCitations,
  type Citation,
} from '@/lib/ai/core/citations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RecommendedAction {
  id: string;
  type: 'navigate' | 'scroll' | 'start_exercise' | 'open_tool' | 'download';
  label: string;
  description?: string;
  icon?: 'target' | 'play' | 'book' | 'timer' | 'file' | 'heart' | 'brain' | 'sparkles' | 'map';
  target?: string;
  primary?: boolean;
}

interface Reference {
  title: string;
  url: string;
  sourceLabel?: string;
  updatedAt?: string;
  isExternal: boolean;
}

interface RequestPayload {
  // Preferred "Buddy" shape
  question?: string;
  pathname?: string;
  locale?: string;

  // Back-compat with unified assistant payload
  query?: string;
  messages?: Message[];
  jurisdiction?: 'UK' | 'US' | 'EU';
}

interface ResponsePayload {
  answer: string;
  recommendedActions: RecommendedAction[];
  references: Reference[];
  citations?: string;
  safety?: {
    level: string;
    signposting?: string;
  };
}

const DEFAULT_CITATIONS: Citation[] = [
  createNHSCitation(
    'NHS: Breathing exercises for stress',
    'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
    '2024-01-01'
  ),
  createNHSCitation('NHS Every Mind Matters', 'https://www.nhs.uk/every-mind-matters/', '2024-01-01'),
].filter((c): c is Citation => c !== null);

function citationToReference(citation: Citation): Reference {
  return {
    title: citation.title,
    url: citation.url,
    sourceLabel: citation.sourceLabel,
    updatedAt: citation.updatedAt,
    isExternal: citation.isExternal,
  };
}

function truncate(text: string, max = 1600) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

function slugifyTopic(topic: string) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractTextFromNhsJson(json: unknown): string | null {
  const obj = json as Record<string, unknown>;
  const parts = Array.isArray(obj?.hasPart) ? (obj.hasPart as Array<Record<string, unknown>>) : [];
  const textBits: string[] = [];

  if (typeof obj?.description === 'string') textBits.push(obj.description);

  for (const p of parts) {
    if (typeof p?.text === 'string') textBits.push(p.text);
    if (typeof p?.name === 'string' && typeof p?.text === 'string') {
      textBits.push(`${p.name}\n${p.text}`);
    }
  }

  const out = textBits.join('\n\n').trim();
  return out.length > 0 ? out : null;
}

async function fetchNhsContent(topic: string): Promise<{ text: string; citation?: Citation } | null> {
  const apiKey = process.env.NHS_WEBSITE_CONTENT_API_KEY;
  if (!apiKey) return null;

  const base = process.env.NHS_WEBSITE_CONTENT_BASE_URL || 'https://api.service.nhs.uk/nhs-website-content';
  const slug = slugifyTopic(topic);

  const candidates = [
    `${base}/conditions/${slug}/?modules=true`,
    `${base}/medicines/${slug}/?modules=true`,
    `${base}/mental-health/conditions/${slug}/overview/?modules=true`,
    `${base}/mental-health/conditions/${slug}/?modules=true`,
  ];

  for (const url of candidates) {
    const res = await fetch(url, {
      headers: { apikey: apiKey },
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);

    if (!res?.ok) continue;

    const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    if (!json) continue;

    const extracted = extractTextFromNhsJson(json);
    if (!extracted) continue;

    const title = (typeof json?.name === 'string' && json.name.trim()) ||
      (typeof json?.headline === 'string' && json.headline.trim()) ||
      'NHS topic';

    const publicUrl =
      (typeof json?.url === 'string' && json.url.startsWith('http') && json.url) ||
      `https://www.nhs.uk/search/results?query=${encodeURIComponent(topic)}`;

    const citation = createNHSCitation(title, publicUrl);

    return { text: extracted, citation: citation ?? undefined };
  }

  return null;
}

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractFirstMedlinePlusResult(xml: string): { title: string; summary: string; url: string } | null {
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

async function fetchMedlinePlus(topic: string): Promise<{ text: string; citation?: Citation } | null> {
  const base = 'https://wsearch.nlm.nih.gov/ws/query';
  const url = `${base}?db=healthTopics&term=${encodeURIComponent(topic)}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!res?.ok) return null;

  const xml = await res.text().catch(() => '');
  const top = extractFirstMedlinePlusResult(xml);
  if (!top) return null;

  const citation = createMedlinePlusCitation(top.title, top.url);
  return {
    text: `${top.title}\n\n${top.summary}`,
    citation: citation ?? undefined,
  };
}

async function fetchPubMedCitations(query: string): Promise<Citation[]> {
  const tool = process.env.NCBI_TOOL || 'neurobreath';
  const email = process.env.NCBI_EMAIL || 'contact@example.com';

  const esearch = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=3&sort=relevance&tool=${encodeURIComponent(
    tool
  )}&email=${encodeURIComponent(email)}&term=${encodeURIComponent(query)}`;

  const sRes = await fetch(esearch, { signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!sRes?.ok) return [];

  const sJson = (await sRes.json().catch(() => null)) as Record<string, unknown> | null;
  const idList = (sJson?.esearchresult as { idlist?: string[] } | undefined)?.idlist || [];
  if (!idList.length) return [];

  const esummary = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&tool=${encodeURIComponent(
    tool
  )}&email=${encodeURIComponent(email)}&id=${idList.join(',')}`;

  const sumRes = await fetch(esummary, { signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!sumRes?.ok) return [];

  const sumJson = (await sumRes.json().catch(() => null)) as Record<string, unknown> | null;
  const result = (sumJson?.result as Record<string, Record<string, unknown>> | undefined) || {};

  const citations: Citation[] = [];
  for (const uid of idList) {
    const entry = result[uid];
    if (!entry) continue;

    const title = typeof entry.title === 'string' ? entry.title : 'PubMed record';
    const year = typeof entry.pubdate === 'string' ? Number.parseInt(entry.pubdate.slice(0, 4), 10) : undefined;
    const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/${uid}/`;

    const citation = createPubMedCitation(title, pubmedUrl, Number.isFinite(year) ? year : undefined);
    if (citation) citations.push(citation);
  }

  return citations;
}

function generateRecommendedActions(queryType: QueryType): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (queryType === 'health_evidence') {
    actions.push({
      id: 'breathing',
      type: 'navigate',
      label: 'Breathing Exercises',
      description: 'Try a calming technique',
      icon: 'heart',
      target: '/breathing',
      primary: true,
    });
  }

  actions.push({
    id: 'tour',
    type: 'scroll',
    label: 'Page Tour',
    description: 'Get a guided walkthrough',
    icon: 'sparkles',
    target: '#',
  });

  return actions;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as RequestPayload | null;

  const rawQuestion = String(body?.question || body?.query || '').trim();
  const pathname = String(body?.pathname || '/');
  const jurisdiction: 'UK' | 'US' | 'EU' = body?.jurisdiction || 'UK';

  if (!rawQuestion) {
    const citations = DEFAULT_CITATIONS;
    return NextResponse.json(
      {
        answer: 'Please ask me a question!',
        recommendedActions: [],
        references: citations.map(citationToReference),
        citations: formatCitationGroup(groupCitations(citations)),
      } satisfies ResponsePayload,
      { status: 400 }
    );
  }

  const question = sanitizeInput(rawQuestion);

  // Safety check first
  const safetyCheck = checkQuerySafety(question, jurisdiction);
  if (safetyCheck.action === 'escalate_only') {
    const emergencyResponse = generateEmergencyResponse(
      safetyCheck.level as 'emergency' | 'safeguarding',
      jurisdiction
    );

    return NextResponse.json({
      answer: emergencyResponse,
      recommendedActions: generateRecommendedActions('health_evidence'),
      references: [],
      citations: '',
      safety: {
        level: safetyCheck.level,
        signposting: safetyCheck.signposting,
      },
    } satisfies ResponsePayload);
  }

  // Decide how to answer
  const routing = routeQuery(question, { pagePath: pathname, jurisdiction, role: 'buddy' });

  const citations: Citation[] = [...DEFAULT_CITATIONS];
  let answerCore = '';

  if (routing.queryType === 'navigation' || routing.queryType === 'tool_help') {
    answerCore =
      `You’re on: **${pathname}**\n\n` +
      `Tell me what you want to do (e.g., “show breathing”, “take me to ADHD hub”, “start a tour”), and I’ll guide you step-by-step.`;

    return NextResponse.json({
      answer: wrapAnswerWithSafety(answerCore, safetyCheck, jurisdiction),
      recommendedActions: generateRecommendedActions(routing.queryType),
      references: [
        {
          title: 'NeuroBreath internal navigation',
          url: pathname,
          isExternal: false,
          sourceLabel: 'Internal',
        },
      ],
      citations: formatCitationGroup(groupCitations(citations)),
      safety: {
        level: safetyCheck.level,
        signposting: safetyCheck.signposting,
      },
    } satisfies ResponsePayload);
  }

  // Health/info mode: attempt authoritative summaries
  const topicGuess = question
    .replace(/^what is\s+/i, '')
    .replace(/\?+$/, '')
    .slice(0, 120)
    .trim();

  const [nhs, medline, pubmed] = await Promise.all([
    fetchNhsContent(topicGuess),
    fetchMedlinePlus(topicGuess),
    fetchPubMedCitations(topicGuess),
  ]);

  if (nhs?.citation) citations.push(nhs.citation);
  if (medline?.citation) citations.push(medline.citation);
  citations.push(...pubmed);

  const deduped = deduplicateCitations(citations);

  const summaryText = nhs?.text || medline?.text || '';

  answerCore =
    `Educational information only — not a diagnosis.\n\n` +
    (summaryText
      ? `**About:** ${topicGuess}\n\n${truncate(summaryText)}\n\n`
      : `I couldn’t retrieve a reliable summary for “${topicGuess}” right now.\n\n`) +
    `If you tell me:\n` +
    `• whether this is general info or symptoms\n` +
    `• how long it’s been going on\n` +
    `• your age group (child/teen/adult)\n` +
    `…I can tailor safe guidance more precisely.`;

  const safeAnswer = wrapAnswerWithSafety(answerCore, safetyCheck, jurisdiction);
  const citationGroup = groupCitations(deduped);

  return NextResponse.json({
    answer: safeAnswer,
    recommendedActions: generateRecommendedActions(routing.queryType),
    references: deduped.map(citationToReference),
    citations: formatCitationGroup(citationGroup),
    safety: {
      level: safetyCheck.level,
      signposting: safetyCheck.signposting,
    },
  } satisfies ResponsePayload);
}
