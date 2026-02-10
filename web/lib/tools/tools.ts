export type ToolAudience = 'me' | 'child' | 'supporter' | 'teacher' | 'workplace';
export type SupportNeed =
  | 'focus'
  | 'stress'
  | 'sleep'
  | 'sensory'
  | 'reading'
  | 'emotional-regulation'
  | 'organisation';

export interface ToolEntry {
  id: string;
  title: string;
  href: string;
  summary: string;
  tags: string[];
  audiences: ToolAudience[];
  supportNeeds: SupportNeed[];
  reviewedAt: string;
  citationsByRegion?: { UK?: string[]; US?: string[]; GLOBAL?: string[] };
}

export const TOOLS: ToolEntry[] = [
  {
    id: 'quick-calm',
    title: 'Quick calm reset',
    href: '/tools/roulette',
    summary: 'One‑minute breathing resets for stress and overwhelm.',
    tags: ['stress', 'breathing', 'reset'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['stress', 'emotional-regulation', 'sensory'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'coherent-breathing',
    title: 'Coherent breathing',
    href: '/techniques/coherent',
    summary: 'Slow, steady breathing for calm and clarity.',
    tags: ['breathing', 'calm', 'focus'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['stress', 'emotional-regulation'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'box-breathing',
    title: 'Box breathing',
    href: '/techniques/box-breathing',
    summary: 'Balanced breathing counts to steady attention.',
    tags: ['breathing', 'focus'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['stress', 'focus'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'focus-training',
    title: 'Focus training',
    href: '/tools/focus-training',
    summary: 'Guided focus routines with short sprints.',
    tags: ['focus', 'attention', 'routine'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['focus', 'organisation'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'focus-tiles',
    title: 'Focus tiles',
    href: '/tools/focus-tiles',
    summary: 'Situation‑specific resets for home, school, and work.',
    tags: ['focus', 'context'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['focus', 'organisation'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'adhd-focus-lab',
    title: 'ADHD Focus Lab',
    href: '/tools/adhd-focus-lab',
    summary: 'Short focus games and breathing cues.',
    tags: ['focus', 'adhd'],
    audiences: ['me', 'child', 'supporter'],
    supportNeeds: ['focus', 'organisation'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'sleep-tools',
    title: 'Sleep tools',
    href: '/tools/sleep-tools',
    summary: 'Gentle wind‑down tools and sleep support.',
    tags: ['sleep', 'routine'],
    audiences: ['me', 'child', 'supporter'],
    supportNeeds: ['sleep', 'stress'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'stress-tools',
    title: 'Stress tools',
    href: '/tools/stress-tools',
    summary: 'Calming routines and grounding tools.',
    tags: ['stress', 'calm'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['stress', 'emotional-regulation'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'anxiety-tools',
    title: 'Anxiety tools',
    href: '/tools/anxiety-tools',
    summary: 'Grounding prompts and breathing support.',
    tags: ['anxiety', 'grounding'],
    audiences: ['me', 'child', 'supporter'],
    supportNeeds: ['stress', 'emotional-regulation'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'sensory-calm',
    title: 'Colour‑path breathing',
    href: '/tools/colour-path',
    summary: 'Visual breathing cues for sensory calming.',
    tags: ['sensory', 'visual', 'breathing'],
    audiences: ['me', 'child', 'supporter', 'teacher'],
    supportNeeds: ['sensory', 'stress'],
    reviewedAt: '2026-01-17',
  },
  {
    id: 'reading-training',
    title: 'Reading training',
    href: '/dyslexia-reading-training',
    summary: 'Structured reading practice for confidence.',
    tags: ['reading', 'dyslexia'],
    audiences: ['child', 'supporter', 'teacher'],
    supportNeeds: ['reading'],
    reviewedAt: '2026-01-17',
  },
];

export const getToolById = (id: string) => TOOLS.find(tool => tool.id === id);
