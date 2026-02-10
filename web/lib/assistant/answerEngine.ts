import 'server-only';

import type { BuddyAskResponse, BuddyAnswerSection, BuddyCitation, BuddySafetyLevel } from '@/lib/buddy/server/types';
import { getAssistantIntentById } from '@/lib/assistant/intents';
import { ensureMinimumInternalPages, searchSiteRegistry, toMarkdownInternalLinks, type AssistantRegion, type SiteRegistryPage } from '@/lib/assistant/siteRegistry';

const BANNED_PHRASES = [
  'Internal: None',
  'Verified data unavailable',
  'Verified data unavailable.',
  'Verified data unavailable:',
  "I couldn’t retrieve a verified external page",
  "I couldn't retrieve a verified external page",
  "I won’t provide unverified links",
  "I won't provide unverified links",
  'Verified data unavailable —',
];

function containsBannedPhrase(text: string): boolean {
  const hay = (text || '').toLowerCase();
  return BANNED_PHRASES.some((p) => hay.includes(p.toLowerCase()));
}

function scrubBannedPhrases(text: string): string {
  if (!containsBannedPhrase(text)) return text;

  // Deterministic replacement: never mention missing verification; pivot to internal help + links.
  return (
    'I can help with that using NeuroBreath’s internal guides and tools. ' +
    'If you tell me your goal (understand symptoms, build routines, or find support), I’ll tailor next steps.'
  );
}

export function sanitizeAssistantText(input: string): string {
  return scrubBannedPhrases(String(input || '').trim());
}

export function sanitizeBuddyResponse(resp: BuddyAskResponse): BuddyAskResponse {
  const safeTitle = sanitizeAssistantText(resp.answer.title);
  const safeSummary = sanitizeAssistantText(resp.answer.summary);

  const safeSections: BuddyAnswerSection[] = resp.answer.sections.map((s) => ({
    heading: sanitizeAssistantText(s.heading),
    text: sanitizeAssistantText(s.text),
  }));

  const safeSafetyMessage = resp.answer.safety.message ? sanitizeAssistantText(resp.answer.safety.message) : undefined;

  return {
    ...resp,
    answer: {
      ...resp.answer,
      title: safeTitle,
      summary: safeSummary,
      sections: safeSections,
      safety: {
        ...resp.answer.safety,
        message: safeSafetyMessage,
      },
    },
  };
}

function toRegion(jurisdiction?: 'UK' | 'US' | 'EU'): AssistantRegion {
  if (jurisdiction === 'US') return 'us';
  if (jurisdiction === 'UK') return 'uk';
  return undefined;
}

function linkReasonForQuestion(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('adhd')) return 'ADHD support and tools';
  if (q.includes('autism')) return 'Autism support and tools';
  if (q.includes('dyslexia')) return 'Dyslexia support and training';
  if (q.includes('sleep')) return 'Sleep support and routines';
  if (q.includes('anxiety')) return 'Anxiety support and regulation';
  if (q.includes('stress')) return 'Stress management support';
  if (q.includes('breath')) return 'Breathing techniques and practice';
  return 'Related NeuroBreath page';
}

export interface InternalFirstRequest {
  question: string;
  intentId?: string;
  pathname?: string;
  jurisdiction?: 'UK' | 'US' | 'EU';
}

export async function buildRelatedPages(req: InternalFirstRequest): Promise<SiteRegistryPage[]> {
  const region = toRegion(req.jurisdiction);
  const intent = req.intentId ? getAssistantIntentById(req.intentId) : undefined;

  const seeded: SiteRegistryPage[] = (intent?.primaryInternalPaths || []).map((p) => ({ path: p, title: p }));

  const query = intent?.label || req.question;
  const searched = query ? await searchSiteRegistry(query, { limit: 8, region }) : [];

  return ensureMinimumInternalPages([...seeded, ...searched], { min: 3, region, queryHint: req.question });
}

export async function buildRelatedOnNeuroBreathSection(req: InternalFirstRequest): Promise<BuddyAnswerSection> {
  const pages = await buildRelatedPages(req);
  return {
    heading: 'Related on NeuroBreath',
    text: toMarkdownInternalLinks(pages, 6),
  };
}

export async function buildInternalFirstBuddyResponse(
  req: InternalFirstRequest & { safetyLevel?: BuddySafetyLevel }
): Promise<Pick<BuddyAskResponse, 'answer' | 'citations' | 'meta'>> {
  const pages = await buildRelatedPages(req);

  const citations: BuddyCitation[] = pages.slice(0, 6).map((p) => ({
    provider: 'NeuroBreath',
    title: p.title,
    url: p.path,
  }));

  const relatedSection = {
    heading: 'Related on NeuroBreath',
    text: toMarkdownInternalLinks(pages, 6),
  };

  const intent = req.intentId ? getAssistantIntentById(req.intentId) : undefined;

  const title = sanitizeAssistantText(intent?.label || 'NeuroBreath guidance');
  const summary = sanitizeAssistantText(
    intent?.canonicalQuestion
      ? intent.canonicalQuestion
      : `Here’s a practical, internal-first starting point for: ${req.question}`
  );

  const sections: BuddyAnswerSection[] = [
    {
      heading: 'Next best step',
      text: 'Tell me your goal (understand, practice a skill, or find support), and what country you’re in (UK/US), and I’ll tailor this to you.',
    },
    relatedSection,
  ];

  const safetyLevel: BuddySafetyLevel = req.safetyLevel || 'none';

  return {
    answer: {
      title,
      summary,
      sections,
      safety: {
        level: safetyLevel,
        // Never add generic crisis blocks here; upstream safety layer should decide.
      },
    },
    citations,
    meta: {
      usedInternal: citations.length > 0,
      usedExternal: false,
      internalCoverage: citations.length >= 3 ? 'partial' : 'none',
      usedProviders: citations.length ? ['NeuroBreath'] : undefined,
    },
  };
}

export async function suggestInternalLinksForCoach(
  req: InternalFirstRequest,
  opts?: { limit?: number }
): Promise<Array<{ title: string; path: string; reason: string; ctaLabel: string }>> {
  const pages = await buildRelatedPages(req);
  const limit = opts?.limit ?? 6;
  const reason = linkReasonForQuestion(req.question);

  return pages.slice(0, limit).map((p) => ({
    title: p.title,
    path: p.path,
    reason,
    ctaLabel: 'Open',
  }));
}
