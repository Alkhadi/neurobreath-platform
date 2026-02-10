import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import type { SupportNeed } from '@/lib/tools/tools';
import { TOOLS, type ToolEntry } from '@/lib/tools/tools';
import { GUIDES } from '@/lib/guides/guides';
import { JOURNEYS } from '@/lib/journeys/journeys';

export type Audience = 'me' | 'child' | 'supporter' | 'teacher' | 'workplace';
export type Environment = 'home' | 'school' | 'work' | 'social';
export type TimePreference = 'quick' | 'short' | 'plan';
export type FormatPreference = 'tools' | 'guides' | 'printables' | 'mix';
export type Profile =
  | 'adhd'
  | 'autism'
  | 'dyslexia'
  | 'dyspraxia'
  | 'dyscalculia'
  | 'tics'
  | 'sensory-differences'
  | 'not-sure';

export interface HelpMeChooseInput {
  audience?: Audience;
  supportNeeds: SupportNeed[];
  environment: Environment[];
  timePreference?: TimePreference;
  formatPreference?: FormatPreference;
  profile?: Profile;
}

export interface RecommendationItem {
  id: string;
  title: string;
  href: string;
  reason: string;
}

export interface HelpMeChooseOutput {
  recommendedJourneyId: string;
  journey: RecommendationItem;
  tools: RecommendationItem[];
  guides: RecommendationItem[];
  trustLinks: RecommendationItem[];
}

const SUPPORT_RULES: Record<SupportNeed, { journey: string; tools: string[]; guides: string[]; reason: string }> = {
  stress: {
    journey: 'starter-calm',
    tools: ['quick-calm', 'coherent-breathing', 'stress-tools'],
    guides: ['quick-calm-in-5-minutes', 'body-scan-for-stress'],
    reason: 'Supports calm and stress regulation with short resets.',
  },
  focus: {
    journey: 'starter-focus',
    tools: ['focus-training', 'focus-tiles', 'adhd-focus-lab'],
    guides: ['focus-sprints-for-adhd', 'adhd-break-planning'],
    reason: 'Builds focus with short sprints and structure.',
  },
  sleep: {
    journey: 'starter-sleep',
    tools: ['sleep-tools'],
    guides: ['wind-down-routine', 'sleep-reset-for-shift-workers'],
    reason: 'Supports consistent sleep routines and wind‑down habits.',
  },
  sensory: {
    journey: 'starter-sensory',
    tools: ['sensory-calm', 'quick-calm'],
    guides: ['autism-sensory-reset', 'breathing-for-sensory-overload'],
    reason: 'Gentle sensory resets with predictable steps.',
  },
  reading: {
    journey: 'starter-learning',
    tools: ['reading-training'],
    guides: ['reading-routine-at-home', 'reading-confidence-in-class'],
    reason: 'Builds reading confidence with structured practice.',
  },
  'emotional-regulation': {
    journey: 'starter-emotional-regulation',
    tools: ['quick-calm', 'anxiety-tools'],
    guides: ['quick-calm-in-5-minutes', 'body-scan-for-stress'],
    reason: 'Supports emotional steadiness with calm routines.',
  },
  organisation: {
    journey: 'starter-organisation',
    tools: ['focus-tiles', 'focus-training'],
    guides: ['adhd-break-planning'],
    reason: 'Adds structure for planning and follow‑through.',
  },
};

const AUDIENCE_RULES: Record<Audience, { guides?: string[]; tools?: string[]; trust?: string[]; reason: string }> = {
  me: { reason: 'Personalised suggestions based on your needs.' },
  child: { guides: ['reading-routine-at-home', 'autism-sensory-reset'], tools: ['sensory-calm'], trust: ['safeguarding'], reason: 'Child‑friendly routines and supportive language.' },
  supporter: { guides: ['autism-sensory-reset', 'reading-routine-at-home'], tools: ['focus-tiles'], trust: ['safeguarding'], reason: 'Supporter‑friendly routines and guidance.' },
  teacher: { guides: ['reading-confidence-in-class', 'autism-transition-support'], tools: ['focus-tiles'], trust: ['safeguarding'], reason: 'Classroom strategies and safeguarding guidance.' },
  workplace: { guides: ['adhd-break-planning', 'focus-sprints-for-adhd'], tools: ['focus-tiles', 'stress-tools'], trust: ['disclaimer'], reason: 'Work‑friendly routines and stress support.' },
};

const TIME_RULES: Record<TimePreference, { toolBoost: number; guideBoost: number; journeyBoost: number }> = {
  quick: { toolBoost: 3, guideBoost: 1, journeyBoost: 0 },
  short: { toolBoost: 2, guideBoost: 2, journeyBoost: 1 },
  plan: { toolBoost: 1, guideBoost: 2, journeyBoost: 3 },
};

const FORMAT_RULES: Record<FormatPreference, { toolBoost: number; guideBoost: number }> = {
  tools: { toolBoost: 2, guideBoost: 0 },
  guides: { toolBoost: 0, guideBoost: 2 },
  printables: { toolBoost: 1, guideBoost: 1 },
  mix: { toolBoost: 0, guideBoost: 0 },
};

const PROFILE_RULES: Partial<Record<Profile, { guides?: string[]; tools?: string[]; journey?: string }>> = {
  adhd: { guides: ['focus-sprints-for-adhd', 'adhd-break-planning'], tools: ['adhd-focus-lab'], journey: 'starter-focus' },
  autism: { guides: ['autism-sensory-reset', 'autism-transition-support'], tools: ['sensory-calm'], journey: 'starter-sensory' },
  dyslexia: { guides: ['reading-routine-at-home', 'reading-confidence-in-class'], tools: ['reading-training'], journey: 'starter-learning' },
  dyscalculia: { guides: ['reading-confidence-in-class'], tools: ['focus-tiles'], journey: 'starter-learning' },
  dyspraxia: { guides: ['adhd-break-planning'], tools: ['focus-tiles'], journey: 'starter-organisation' },
  'sensory-differences': { guides: ['breathing-for-sensory-overload'], tools: ['sensory-calm'], journey: 'starter-sensory' },
  tics: { guides: ['quick-calm-in-5-minutes'], tools: ['quick-calm'], journey: 'starter-calm' },
};

const addScore = (map: Map<string, number>, id: string, value: number) => {
  map.set(id, (map.get(id) || 0) + value);
};

const pickTop = <T extends { id: string; title: string; href: string }>(
  entries: T[],
  scores: Map<string, number>,
  limit: number,
  fallbackReason: string,
) => {
  return entries
    .filter(entry => scores.has(entry.id))
    .sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0))
    .slice(0, limit)
    .map(entry => ({
      id: entry.id,
      title: entry.title,
      href: entry.href,
      reason: fallbackReason,
    }));
};

const buildTrustLinks = (region: Region, audience?: Audience, environment?: Environment[]) => {
  const regionKey = getRegionKey(region);
  const base = [
    {
      id: 'evidence-policy',
      title: 'Evidence policy',
      href: `/${regionKey}/trust/evidence-policy`,
      reason: 'How we review and cite evidence.',
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      href: `/${regionKey}/trust/disclaimer`,
      reason: 'Educational guidance only.',
    },
  ];

  if (audience === 'teacher' || audience === 'supporter' || environment?.includes('school')) {
    base.push({
      id: 'safeguarding',
      title: 'Safeguarding',
      href: `/${regionKey}/trust/safeguarding`,
      reason: 'Safety guidance and escalation routes.',
    });
  }

  base.push({
    id: 'privacy',
    title: 'Privacy',
    href: `/${regionKey}/trust/privacy`,
    reason: 'Local‑only storage and privacy stance.',
  });

  return base;
};

export function getHelpMeChooseRecommendations(input: HelpMeChooseInput, region: Region): HelpMeChooseOutput {
  const supportNeeds: SupportNeed[] = input.supportNeeds.length ? input.supportNeeds : ['stress', 'focus'];

  const journeyScores = new Map<string, number>();
  const toolScores = new Map<string, number>();
  const guideScores = new Map<string, number>();

  supportNeeds.forEach(need => {
    const rule = SUPPORT_RULES[need];
    addScore(journeyScores, rule.journey, 4);
    rule.tools.forEach(toolId => addScore(toolScores, toolId, 3));
    rule.guides.forEach(guideId => addScore(guideScores, guideId, 2));
  });

  if (input.audience) {
    const rule = AUDIENCE_RULES[input.audience];
    rule.tools?.forEach(toolId => addScore(toolScores, toolId, 2));
    rule.guides?.forEach(guideId => addScore(guideScores, guideId, 2));
  }

  if (input.timePreference) {
    const timeRule = TIME_RULES[input.timePreference];
    journeyScores.forEach((score, id) => addScore(journeyScores, id, timeRule.journeyBoost));
    toolScores.forEach((score, id) => addScore(toolScores, id, timeRule.toolBoost));
    guideScores.forEach((score, id) => addScore(guideScores, id, timeRule.guideBoost));
  }

  if (input.formatPreference) {
    const formatRule = FORMAT_RULES[input.formatPreference];
    toolScores.forEach((score, id) => addScore(toolScores, id, formatRule.toolBoost));
    guideScores.forEach((score, id) => addScore(guideScores, id, formatRule.guideBoost));
  }

  if (input.profile && input.profile !== 'not-sure') {
    const profileRule = PROFILE_RULES[input.profile];
    if (profileRule?.journey) addScore(journeyScores, profileRule.journey, 3);
    profileRule?.tools?.forEach(toolId => addScore(toolScores, toolId, 2));
    profileRule?.guides?.forEach(guideId => addScore(guideScores, guideId, 2));
  }

  const journey = JOURNEYS
    .map(entry => ({ entry, score: journeyScores.get(entry.id) || 0 }))
    .sort((a, b) => b.score - a.score)
    .find(item => item.score > 0)?.entry || JOURNEYS[0];

  const tools = pickTop(
    TOOLS as Array<ToolEntry>,
    toolScores,
    4,
    'Recommended based on your support needs.',
  );

  const guideOptions = GUIDES.map(guide => ({
    id: guide.id,
    title: guide.title,
    href: guide.hrefs[region],
  }));

  const guides = pickTop(
    guideOptions,
    guideScores,
    6,
    'Suggested for practical next steps.',
  );

  const trustLinks = buildTrustLinks(region, input.audience, input.environment).map(link => ({
    id: link.id,
    title: link.title,
    href: link.href,
    reason: link.reason,
  }));

  return {
    recommendedJourneyId: journey.id,
    journey: {
      id: journey.id,
      title: journey.title,
      href: journey.hrefs[region],
      reason: 'Best starter journey based on your answers.',
    },
    tools,
    guides,
    trustLinks,
  };
}
