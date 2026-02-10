import type { SupportNeed } from '@/lib/tools/tools';
import type { Region } from '@/lib/region/region';

export type JourneyAudience = 'me' | 'child' | 'supporter' | 'teacher' | 'workplace';

export interface JourneyEntry {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  supportNeeds: SupportNeed[];
  audiences: JourneyAudience[];
  hrefs: Record<Region, string>;
  keyTerms: string[];
}

export const JOURNEYS: JourneyEntry[] = [
  {
    id: 'starter-calm',
    title: 'Calm starter journey',
    summary: 'A gentle path to reduce stress and find a steady baseline.',
    tags: ['calm', 'stress', 'breathing'],
    supportNeeds: ['stress', 'emotional-regulation', 'sensory'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    hrefs: {
      UK: '/uk/guides/breathing-exercises-for-stress',
      US: '/us/guides/breathing-exercises-for-stress',
    },
    keyTerms: ['grounding', 'coherent-breathing', 'stress', 'calm-routine'],
  },
  {
    id: 'starter-focus',
    title: 'Focus starter journey',
    summary: 'Short, practical steps to start tasks and build focus.',
    tags: ['focus', 'attention', 'routine'],
    supportNeeds: ['focus', 'organisation'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    hrefs: {
      UK: '/uk/guides/focus-start',
      US: '/us/guides/focus-start',
    },
    keyTerms: ['executive-function', 'task-initiation', 'time-blindness', 'focus-sprints'],
  },
  {
    id: 'starter-sleep',
    title: 'Sleep reset journey',
    summary: 'Wind‑down routines and sleep support for steadier nights.',
    tags: ['sleep', 'routine'],
    supportNeeds: ['sleep', 'stress'],
    audiences: ['me', 'child', 'supporter'],
    hrefs: {
      UK: '/tools/sleep-tools',
      US: '/tools/sleep-tools',
    },
    keyTerms: ['sleep-hygiene', 'sleep-routine', 'extended-exhale'],
  },
  {
    id: 'starter-learning',
    title: 'Learning confidence journey',
    summary: 'Reading and learning routines that build confidence.',
    tags: ['reading', 'learning'],
    supportNeeds: ['reading'],
    audiences: ['child', 'supporter', 'teacher'],
    hrefs: {
      UK: '/conditions/dyslexia',
      US: '/conditions/dyslexia',
    },
    keyTerms: ['phonics', 'reading-confidence', 'multisensory-learning'],
  },
  {
    id: 'starter-sensory',
    title: 'Sensory support journey',
    summary: 'Grounding tools and sensory‑friendly routines.',
    tags: ['sensory', 'calm'],
    supportNeeds: ['sensory', 'emotional-regulation'],
    audiences: ['me', 'child', 'supporter', 'teacher'],
    hrefs: {
      UK: '/guides/breathing-for-sensory-overload',
      US: '/guides/breathing-for-sensory-overload',
    },
    keyTerms: ['sensory-overload', 'sensory-regulation', 'sensory-kit'],
  },
  {
    id: 'starter-organisation',
    title: 'Organisation & routines journey',
    summary: 'Simple systems for planning, pacing, and follow‑through.',
    tags: ['organisation', 'planning'],
    supportNeeds: ['organisation', 'focus'],
    audiences: ['me', 'supporter', 'teacher', 'workplace'],
    hrefs: {
      UK: '/guides/adhd-break-planning',
      US: '/guides/adhd-break-planning',
    },
    keyTerms: ['organisation', 'time-management', 'checklists'],
  },
  {
    id: 'starter-emotional-regulation',
    title: 'Emotional regulation journey',
    summary: 'Short calming routines and supportive language tools.',
    tags: ['emotional-regulation', 'calm'],
    supportNeeds: ['emotional-regulation', 'stress'],
    audiences: ['me', 'child', 'supporter', 'teacher'],
    hrefs: {
      UK: '/guides/quick-calm-in-5-minutes',
      US: '/guides/quick-calm-in-5-minutes',
    },
    keyTerms: ['emotional-regulation', 'co-regulation', 'grounding'],
  },
];

export const getJourneyById = (id: string) => JOURNEYS.find(journey => journey.id === id);
