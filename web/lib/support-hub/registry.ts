export type SupportDomain =
  | 'focus'
  | 'calm'
  | 'sleep'
  | 'learning'
  | 'routines'
  | 'social'
  | 'mood'
  | 'parenting'
  | 'school'
  | 'workplace'
  | 'tracking'
  | 'ai_coach';

export interface SupportHubEntry {
  route: string;
  title: string;
  summary: string;
  domains: SupportDomain[];
  conditions: Array<'adhd' | 'autism' | 'dyslexia' | 'anxiety' | 'stress' | 'mood' | 'sleep' | 'general'>;
  audiences: Array<'individual' | 'parent' | 'teacher' | 'carer' | 'professional'>;
  tags: string[];
  keySections?: string[];
}

/**
 * High-signal, curated map of the “Focus Garden” ecosystem.
 *
 * Purpose:
 * - Give Buddy a single source of truth for how tools/pages connect.
 * - Provide better tags + summaries for internal search routing.
 * - Keep import-safe (pure data; no env, no IO).
 */
export const SUPPORT_HUB_ENTRIES: SupportHubEntry[] = [
  {
    route: '/my-plan',
    title: 'My Plan (Focus Garden Roadmap)',
    summary:
      'A unified place to save tools, track journeys, build a routine, and generate a weekly plan across focus, learning, and wellbeing.',
    domains: ['tracking', 'routines', 'ai_coach'],
    conditions: ['general'],
    audiences: ['individual', 'parent', 'teacher', 'carer', 'professional'],
    tags: ['plan', 'roadmap', 'weekly plan', 'routine', 'saved items', 'progress', 'focus garden'],
    keySections: ['Saved', 'Journeys', 'Routine', 'Recommended', 'Achievements', 'Focus Garden'],
  },
  {
    route: '/coach',
    title: 'AI Coach',
    summary:
      'Zero-typing, context-driven AI Coach that generates practical 7-day action plans with evidence links and recommended NeuroBreath tools.',
    domains: ['ai_coach', 'tracking'],
    conditions: ['general'],
    audiences: ['individual', 'parent', 'teacher', 'carer', 'professional'],
    tags: ['ai', 'coach', '7-day plan', 'weekly plan', 'tailored', 'evidence', 'nhs', 'nice', 'pubmed'],
  },
  {
    route: '/adhd',
    title: 'ADHD Hub',
    summary: 'Focus routines, daily quests, and ADHD-friendly tools with evidence-informed guidance.',
    domains: ['focus', 'routines', 'tracking'],
    conditions: ['adhd'],
    audiences: ['individual', 'parent', 'teacher', 'carer'],
    tags: ['adhd', 'focus', 'timer', 'quests', 'executive function', 'school'],
  },
  {
    route: '/dyslexia-reading-training',
    title: 'Dyslexia Reading Training',
    summary: 'Structured decoding, phonics, and fluency practice with short sessions and progress tracking.',
    domains: ['learning', 'routines', 'tracking'],
    conditions: ['dyslexia'],
    audiences: ['individual', 'parent', 'teacher'],
    tags: ['dyslexia', 'reading', 'phonics', 'fluency', 'practice', 'school'],
  },
  {
    route: '/anxiety',
    title: 'Anxiety Hub',
    summary: 'Evidence-informed coping skills, grounding, and regulation routines for anxiety and panic.',
    domains: ['calm', 'mood', 'routines'],
    conditions: ['anxiety'],
    audiences: ['individual', 'parent', 'teacher', 'carer'],
    tags: ['anxiety', 'panic', 'coping', 'grounding', 'breathing', 'worry'],
  },
  {
    route: '/autism',
    title: 'Autism Hub',
    summary: 'Neurodiversity-affirming supports, calming tools, skills library, and education/workplace guides.',
    domains: ['calm', 'social', 'school', 'workplace', 'tracking'],
    conditions: ['autism'],
    audiences: ['individual', 'parent', 'teacher', 'carer', 'professional'],
    tags: ['autism', 'sensory', 'communication', 'meltdown', 'routine', 'ehcp', 'iep', 'workplace'],
  },
  {
    route: '/breathing',
    title: 'Breathing',
    summary: 'Guided breathing techniques for fast calming and ongoing nervous-system regulation.',
    domains: ['calm', 'sleep'],
    conditions: ['anxiety', 'stress', 'mood', 'general'],
    audiences: ['individual', 'parent', 'teacher', 'carer'],
    tags: ['breathing', 'calm', 'stress', 'panic', 'sleep', 'regulation'],
  },
];

export function getSupportHubEntries(): SupportHubEntry[] {
  return SUPPORT_HUB_ENTRIES;
}
