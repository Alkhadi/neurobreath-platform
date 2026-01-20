import type { NextRequest } from 'next/server';
import { checkQuerySafety, generateEmergencyResponse, sanitizeInput } from '@/lib/ai/core/safety';
import { routeQuery } from '@/lib/ai/core/answerRouter';
import type { BuddyAskResponse, BuddyCitation, BuddySafetyLevel } from './types';
import { extractTopicCandidates, normalizeQuery } from './text';
import { fetchMedlinePlus } from './medlineplus';
import { fetchPubMed } from './pubmed';
import { fetchResolvedNhsPage, resolveNhsTopic } from './nhs';
import { searchInternalKb, type InternalCoverage, isValidInternalRoute } from './internalKb';
import { validateExternalUrl } from './linkValidation';

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

function stripMarkdown(input: string): string {
  return String(input || '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function topicLabel(question: string): string {
  const candidates = extractTopicCandidates(question);
  const primary = candidates[0] || question;
  const cleaned = primary
    .replace(/^what\s+is\s+/i, '')
    .replace(/^tell\s+me\s+about\s+/i, '')
    .replace(/\?+$/g, '')
    .trim();
  return cleaned || 'this topic';
}

function buildUkSignposting(level: BuddySafetyLevel): string | undefined {
  if (level === 'none') return undefined;
  if (level === 'caution') {
    return 'If you’re worried or symptoms are worsening, consider speaking to a GP or calling NHS 111 for advice.';
  }
  if (level === 'urgent') {
    return 'Urgent help: call NHS 111. If there is immediate danger, call 999.';
  }
  return 'Emergency: call 999. If you can’t keep yourself safe, seek urgent help immediately.';
}

async function addInternalCitations(hits: Array<{ page: { route: string; title: string } }>): Promise<BuddyCitation[]> {
  const citations: BuddyCitation[] = [];
  for (const h of hits.slice(0, 3)) {
    const route = h.page.route;
    if (!(await isValidInternalRoute(route))) continue;
    citations.push({
      provider: 'NeuroBreath',
      title: h.page.title,
      url: route,
    });
  }
  return citations;
}

async function addExternalCitation(input: BuddyCitation | null): Promise<BuddyCitation | null> {
  if (!input?.url) return null;
  const verdict = await validateExternalUrl(input.url);
  if (!verdict.ok) return null;
  return input;
}

function internalBlueprint(topic: string, coverage: InternalCoverage, internalRoutes: string[]): { title: string; summary: string; sections: Array<{ heading: string; text: string }> } {
  const t = topic;
  const known = normalizeQuery(t);

  // Short, safe, educational-only overviews. No diagnosis, no medication instructions.
  const baseOverviews: Record<string, { title: string; overview: string; signs: string; next: string }> = {
    adhd: {
      title: 'ADHD (overview)',
      overview:
        'ADHD (attention deficit hyperactivity disorder) is a neurodevelopmental condition involving differences in attention regulation, activity level, and impulse control. It can affect school, work, relationships, and daily routines.',
      signs:
        'Common experiences can include distractibility, time-blindness, difficulty starting tasks, restlessness, and impulsive decisions. Presentation varies widely by person and context.',
      next:
        'If you’re exploring ADHD, NeuroBreath can help with focus routines, structured plans, and skills you can practise daily. If symptoms are causing significant impairment, a clinician can discuss assessment and support options.',
    },
    autism: {
      title: 'Autism (overview)',
      overview:
        'Autism is a lifelong neurodevelopmental difference that can involve differences in social communication and sensory processing, and a preference for routines or specific interests. Many autistic people also have strengths in pattern recognition and deep focus on interests.',
      signs:
        'Common experiences include sensory sensitivities, differences in social interaction, and needing predictability. Support needs vary and can change over time.',
      next:
        'NeuroBreath tools can support regulation (calming routines), planning, and accommodations. If you want formal assessment or support, start with your GP or local autism service pathway.',
    },
    anxiety: {
      title: 'Anxiety (overview)',
      overview:
        'Anxiety is a state of heightened worry or fear that can show up in thoughts, body sensations (like racing heart), and behaviour (like avoidance). It becomes a problem when it’s persistent and interferes with daily life.',
      signs:
        'People may notice restlessness, difficulty sleeping, muscle tension, intrusive worries, or panic symptoms. Triggers can be specific or hard to pinpoint.',
      next:
        'NeuroBreath can help with breathing and grounding routines and practical next-step plans. If anxiety is severe, persistent, or linked to self-harm thoughts, seek professional support promptly.',
    },
    sleep: {
      title: 'Sleep (practical overview)',
      overview:
        'Sleep problems can include difficulty falling asleep, waking often, or waking too early. Sleep is affected by stress, routines, light exposure, caffeine, and mental health.',
      signs:
        'If you feel unrefreshed, irritable, foggy, or you’re relying on naps or stimulants to function, it may help to review sleep habits and underlying stressors.',
      next:
        'NeuroBreath can support wind-down routines and structured habit building. If you suspect sleep apnoea (snoring + daytime sleepiness) or severe insomnia, talk to a clinician.',
    },
    breathing: {
      title: 'Breathing tools (overview)',
      overview:
        'Slow, steady breathing can reduce physiological arousal and help with stress and panic symptoms. It’s a regulation tool you can practise anywhere.',
      signs:
        'If you feel keyed-up, shaky, or stuck in a stress response, a brief breathing routine can help you reset and regain control.',
      next:
        'Use NeuroBreath breathing timers and guided techniques to build a consistent regulation habit. If breathing symptoms are new or severe (e.g., chest pain), seek urgent medical advice.',
    },
    stress: {
      title: 'Stress (overview)',
      overview:
        'Stress is the body’s response to demands or threats. Short-term stress can be motivating, but chronic stress can affect sleep, mood, focus, and physical health.',
      signs:
        'Common signs include irritability, tension, headaches, sleep disruption, and difficulty concentrating.',
      next:
        'NeuroBreath can help you use calming routines and build small, sustainable habits. If stress is overwhelming or linked to safety concerns, seek support promptly.',
    },
    dyslexia: {
      title: 'Dyslexia (overview)',
      overview:
        'Dyslexia is a learning difference that can affect reading accuracy/fluency, spelling, and working memory for language. It is not linked to intelligence, and people often have strengths in problem-solving and big-picture thinking.',
      signs:
        'People may notice slow reading, difficulty decoding unfamiliar words, or fatigue when reading for long periods.',
      next:
        'NeuroBreath offers reading training tools and practice routines. If you want formal support in school or work, ask about a dyslexia assessment and accommodations.',
    },
  };

  const entry = baseOverviews[known];
  const summary = entry?.overview || `Here’s what NeuroBreath can share about ${t}.`;

  const sections: Array<{ heading: string; text: string }> = [];

  if (entry) {
    sections.push({ heading: 'Key signs or experiences', text: entry.signs });
  }

  if (coverage !== 'none') {
    sections.push({
      heading: 'What NeuroBreath can do for this',
      text:
        internalRoutes.length > 0
          ? `Recommended internal pages: ${internalRoutes.join(', ')}.`
          : 'NeuroBreath includes tools and guides that can support daily routines and regulation.',
    });
  }

  sections.push({ heading: 'What to do next', text: entry?.next || 'If you share what you’re trying to achieve (understand symptoms, build routines, or find support), I can tailor next steps.' });

  return {
    title: entry?.title || `${t} (NeuroBreath guidance)`,
    summary,
    sections,
  };
}

export async function buddyAsk(
  req: NextRequest,
  payload: { question: string; pathname?: string; jurisdiction?: 'UK' | 'US' | 'EU' }
): Promise<BuddyAskResponse> {
  const pathname = payload.pathname || '/';
  const jurisdiction: 'UK' | 'US' | 'EU' = payload.jurisdiction || 'UK';

  const question = sanitizeInput(payload.question.trim());
  const topic = topicLabel(question);

  const safetyCheck = checkQuerySafety(question, jurisdiction);
  const safetyLevel = (safetyCheck.level as BuddySafetyLevel) || 'none';

  // Emergency-only path: short and unambiguous.
  if (safetyCheck.action === 'escalate_only') {
    const emergencyResponse = generateEmergencyResponse(safetyCheck.level as 'emergency' | 'safeguarding', jurisdiction);

    return {
      answer: {
        title: 'Get help now',
        summary: stripMarkdown(emergencyResponse),
        sections: [],
        safety: {
          level: safetyLevel,
          message: buildUkSignposting(safetyLevel) || stripMarkdown(safetyCheck.signposting || ''),
        },
      },
      citations: [],
      meta: {
        usedInternal: true,
        usedExternal: false,
        internalCoverage: 'none',
      },
    };
  }

  // Navigation/tool routing stays internal-only.
  const routing = routeQuery(question, { pagePath: pathname, jurisdiction, role: 'buddy' });
  if (routing.queryType === 'navigation' || routing.queryType === 'tool_help') {
    const internalOk = await isValidInternalRoute(pathname);
    return {
      answer: {
        title: 'NeuroBreath navigation help',
        summary: `You’re on: ${pathname}. Tell me what you want to do (e.g., “start a tour”, “show breathing”), and I’ll guide you step-by-step.`,
        sections: [
          {
            heading: 'Quick actions',
            text: 'Use the Page Tour, jump to a section, or open a tool from this page.',
          },
        ],
        safety: { level: 'none' },
      },
      citations: internalOk
        ? [{ provider: 'NeuroBreath', title: 'Current page', url: pathname }]
        : [],
      meta: {
        usedInternal: true,
        usedExternal: false,
        internalCoverage: 'high',
      },
    };
  }

  // 1) Internal-first retrieval
  const internal = await searchInternalKb(question, 5);
  const internalRoutes = internal.hits.slice(0, 3).map((h) => h.page.route);
  const internalCitations = await addInternalCitations(internal.hits);

  // 2) Build internal answer skeleton
  const blueprint = internalBlueprint(topic, internal.coverage, internalRoutes);

  const answerSections: Array<{ heading: string; text: string }> = [...blueprint.sections];
  const citations: BuddyCitation[] = [...internalCitations];

  let usedExternal = false;
  let externalAdded = false;

  // 3) External sources only if internal is partial/none
  const ipKey = getClientIpKey(req);
  const primaryTopic = extractTopicCandidates(question)[0] || topic;

  if (internal.coverage !== 'high') {
    // NHS (preferred) if configured
    const nhsEntry = await resolveNhsTopic(question);
    if (nhsEntry) {
      const nhsPage = await fetchResolvedNhsPage(nhsEntry);
      if (nhsPage?.text) {
        const humanUrl = nhsPage.publicUrl || nhsEntry.webUrl;
        const c = await addExternalCitation(
          humanUrl
            ? {
                provider: 'NHS',
                title: nhsPage.title,
                url: humanUrl,
                lastReviewed: nhsPage.lastReviewed,
              }
            : null
        );

        if (c) {
          citations.push(c);
          usedExternal = true;
          externalAdded = true;
          answerSections.unshift({
            heading: 'Verified external overview',
            text: truncate(stripMarkdown(nhsPage.text), 800),
          });
        }
      }
    }

    // MedlinePlus fallback
    if (!externalAdded) {
      const medline = await fetchMedlinePlus(primaryTopic, ipKey);
      if (medline?.summary && medline?.url) {
        const c = await addExternalCitation({
          provider: 'MedlinePlus',
          title: medline.title,
          url: medline.url,
        });

        if (c) {
          citations.push(c);
          usedExternal = true;
          externalAdded = true;
          answerSections.unshift({
            heading: 'Verified external overview',
            text: truncate(stripMarkdown(medline.summary), 800),
          });
        }
      }
    }
  }

  // 4) Optional research citations (never replaces patient guidance)
  if (wantsResearch(question)) {
    const pubs = await fetchPubMed(primaryTopic, ipKey);
    const pubmedCitations: BuddyCitation[] = [];

    for (const p of pubs.slice(0, 3)) {
      const c = await addExternalCitation({
        provider: 'PubMed',
        title: p.title,
        url: p.url,
        lastReviewed: p.year ? String(p.year) : undefined,
      });
      if (c) pubmedCitations.push(c);
    }

    if (pubmedCitations.length > 0) {
      citations.push(...pubmedCitations);
      usedExternal = true;
      answerSections.push({
        heading: 'Research evidence (optional)',
        text: 'These research citations are for context, not personal medical guidance.',
      });
    }
  }

  // 5) Verified-data unavailable: be specific and actionable.
  if (internal.coverage === 'none' && !externalAdded) {
    answerSections.unshift({
      heading: 'Verified data unavailable',
      text:
        `No internal NeuroBreath module currently covers ${topic} in detail, and I couldn’t retrieve a verified external page at the moment. I won’t provide unverified links.`,
    });
    answerSections.push({
      heading: 'What you can do next',
      text:
        'If this is about symptoms or safety concerns, consider speaking with a clinician. If you’re in the UK and need urgent advice, call NHS 111; for emergencies call 999.\n\nSuggested search terms: “' +
        `${topic} NHS”, “${topic} symptoms”, “${topic} treatment options”.`,
    });
  }

  return {
    answer: {
      title: blueprint.title,
      summary: blueprint.summary,
      sections: answerSections,
      safety: {
        level: safetyLevel,
        message: buildUkSignposting(safetyLevel) || stripMarkdown(safetyCheck.signposting || ''),
      },
    },
    citations: citations.filter((c) => c.url && c.title),
    meta: {
      usedInternal: internalCitations.length > 0,
      usedExternal,
      internalCoverage: internal.coverage,
    },
  };
}
