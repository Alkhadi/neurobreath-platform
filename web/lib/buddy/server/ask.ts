import type { NextRequest } from 'next/server';
import {
  checkQuerySafety,
  generateEmergencyResponse,
  sanitizeInput,
} from '@/lib/ai/core/safety';
import { routeQuery } from '@/lib/ai/core/answerRouter';
import { createMedlinePlusCitation, createNHSCitation, createPubMedCitation } from '@/lib/ai/core/citations';
import type { BuddyAskResponse, BuddySource, BuddySafetyLevel } from './types';
import { extractTopicCandidates } from './text';
import { fetchMedlinePlus } from './medlineplus';
import { fetchPubMed } from './pubmed';
import { fetchResolvedNhsPage, resolveNhsTopic } from './nhs';

function truncate(text: string, max = 1200) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

function getClientIpKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function wantsResearch(question: string): boolean {
  return /(study|studies|evidence|research|trial|paper|papers|meta-analysis)/i.test(question);
}

function buildNhsSections(text: string): Array<{ heading: string; markdown: string }> {
  // Minimal restructuring: split by common NHS module headings if present.
  const blocks = text.split(/\n\n+/g).map((b) => b.trim()).filter(Boolean);
  const sections: Array<{ heading: string; markdown: string }> = [];

  const summary = blocks.slice(0, 2).join('\n\n');
  if (summary) sections.push({ heading: 'Summary', markdown: summary });

  const rest = blocks.slice(2).join('\n\n');
  if (rest) sections.push({ heading: 'Key information', markdown: truncate(rest, 900) });

  return sections;
}

function buildFallbackSections(topic: string): Array<{ heading: string; markdown: string }> {
  return [
    {
      heading: 'What I can say right now',
      markdown:
        `I couldn’t reach external health sources right now, so this is general educational guidance about **${topic}** (not medical advice or a diagnosis).`,
    },
    {
      heading: 'What you can do next',
      markdown:
        `If this is urgent or you’re worried: **call NHS 111** (or 999 in an emergency).\n\nIf you tell me whether you want **definition**, **symptoms**, **treatment**, or **when to get help**, I can tailor the structure safely.`,
    },
  ];
}

export async function buddyAsk(req: NextRequest, payload: { question: string; pathname?: string; jurisdiction?: 'UK' | 'US' | 'EU' }): Promise<BuddyAskResponse> {
  const pathname = payload.pathname || '/';
  const jurisdiction: 'UK' | 'US' | 'EU' = payload.jurisdiction || 'UK';

  const question = sanitizeInput(payload.question.trim());

  const safetyCheck = checkQuerySafety(question, jurisdiction);
  if (safetyCheck.action === 'escalate_only') {
    const emergencyResponse = generateEmergencyResponse(safetyCheck.level as 'emergency' | 'safeguarding', jurisdiction);

    return {
      answer: {
        title: 'Get help now',
        summaryMarkdown: emergencyResponse,
        sections: [],
        safety: { level: safetyCheck.level as BuddySafetyLevel, messageMarkdown: safetyCheck.signposting },
      },
      sources: [],
      recommendedActions: [
        {
          id: 'breathing',
          type: 'navigate',
          label: 'Breathing Exercises',
          description: 'Try a calming technique',
          icon: 'heart',
          target: '/breathing',
          primary: true,
        },
      ],
    };
  }

  const routing = routeQuery(question, { pagePath: pathname, jurisdiction, role: 'buddy' });

  if (routing.queryType === 'navigation' || routing.queryType === 'tool_help') {
    return {
      answer: {
        title: 'NeuroBreath navigation help',
        summaryMarkdown: `You’re on: **${pathname}**\n\nTell me what you want to do (e.g., “show breathing”, “start a tour”), and I’ll guide you step-by-step.`,
        sections: [
          {
            heading: 'Quick actions',
            markdown: `• Open the **Page Tour**\n• Go to **Breathing**\n• Jump to a section on this page`,
          },
        ],
        safety: { level: 'none' },
      },
      sources: [
        {
          provider: 'NeuroBreath',
          title: 'NeuroBreath internal navigation',
          url: pathname,
          reliabilityBadge: 'Primary',
        },
      ],
      recommendedActions: [
        {
          id: 'tour',
          type: 'scroll',
          label: 'Page Tour',
          description: 'Get a guided walkthrough',
          icon: 'sparkles',
          target: '#',
        },
        {
          id: 'breathing',
          type: 'navigate',
          label: 'Breathing Exercises',
          description: 'Try a calming technique',
          icon: 'heart',
          target: '/breathing',
          primary: true,
        },
      ],
    };
  }

  const ipKey = getClientIpKey(req);
  const topicCandidates = extractTopicCandidates(question);
  const primaryTopic = topicCandidates[0] || question;

  const sources: BuddySource[] = [];
  let providerUsed: BuddySource['provider'] | undefined;
  let title = primaryTopic;
  let summaryText = '';
  let sections: Array<{ heading: string; markdown: string }> = [];

  // 1) NHS via manifest resolver (preferred)
  const nhsEntry = await resolveNhsTopic(question);
  if (nhsEntry) {
    const nhsPage = await fetchResolvedNhsPage(nhsEntry);
    if (nhsPage?.text) {
      title = nhsPage.title;
      summaryText = nhsPage.text;
      providerUsed = 'NHS';

      const citation = createNHSCitation(title, nhsPage.publicUrl || nhsEntry.webUrl || nhsEntry.apiUrl, nhsPage.lastReviewed);
      if (citation) {
        sources.push({
          provider: 'NHS',
          title: citation.title,
          url: citation.url,
          lastReviewed: citation.updatedAt,
          reliabilityBadge: 'Primary',
        });
      }

      sections = buildNhsSections(summaryText);
    }
  }

  // 2) MedlinePlus fallback
  if (!summaryText) {
    const medline = await fetchMedlinePlus(primaryTopic, ipKey);
    if (medline) {
      title = medline.title;
      summaryText = medline.summary;
      providerUsed = 'MedlinePlus';
      const citation = createMedlinePlusCitation(medline.title, medline.url);
      if (citation) {
        sources.push({
          provider: 'MedlinePlus',
          title: citation.title,
          url: citation.url,
          reliabilityBadge: 'Primary',
        });
      }

      sections = [
        { heading: 'Summary', markdown: truncate(medline.summary, 900) },
        { heading: 'What you can do now', markdown: 'If you’d like, tell me whether you want **symptoms**, **treatment**, or **when to get help**, and I’ll tailor the next steps.' },
      ];
    }
  }

  // 3) Always provide a non-empty, helpful fallback
  if (!summaryText) {
    providerUsed = undefined;
    title = primaryTopic;
    sections = buildFallbackSections(primaryTopic);
  }

  // 4) Optional research evidence
  if (wantsResearch(question)) {
    const pubs = await fetchPubMed(primaryTopic, ipKey);
    for (const p of pubs) {
      const citation = createPubMedCitation(p.title, p.url, p.year);
      if (!citation) continue;
      sources.push({
        provider: 'PubMed',
        title: citation.title,
        url: citation.url,
        dateLabel: citation.updatedAt,
        reliabilityBadge: 'Secondary',
      });
    }

    if (pubs.length) {
      sections.push({
        heading: 'Research evidence (optional)',
        markdown: 'I’ve added a few research citations. PubMed links are for evidence context, not personal medical guidance.',
      });
    }
  }

  // 5) Safety signposting (UK)
  const safetyMessage = safetyCheck.signposting;

  return {
    answer: {
      title,
      summaryMarkdown: `Educational information only — not a diagnosis.\n\n${sections[0]?.markdown || ''}`.trim(),
      sections: sections.slice(1),
      safety: {
        level: (safetyCheck.level as BuddySafetyLevel) || 'none',
        messageMarkdown: safetyMessage,
      },
      tailoredQuestions: [
        'Do you want a definition, symptoms, treatment, or when to get help?',
        'Is this for you or someone you support?',
      ],
    },
    sources,
    recommendedActions: [
      {
        id: 'breathing',
        type: 'navigate',
        label: 'Breathing Exercises',
        description: 'Try a calming technique',
        icon: 'heart',
        target: '/breathing',
        primary: true,
      },
      {
        id: 'tour',
        type: 'scroll',
        label: 'Page Tour',
        description: 'Get a guided walkthrough',
        icon: 'sparkles',
        target: '#',
      },
    ],
    debug:
      process.env.NODE_ENV === 'development'
        ? { matchedTopic: nhsEntry?.title, providerUsed }
        : undefined,
  };
}
