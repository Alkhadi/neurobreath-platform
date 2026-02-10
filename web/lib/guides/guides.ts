import type { Region } from '@/lib/region/region';
import type { SupportNeed } from '@/lib/tools/tools';

export type GuideAudience = 'me' | 'child' | 'supporter' | 'teacher' | 'workplace';

export interface GuideEntry {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  audiences: GuideAudience[];
  supportNeeds: SupportNeed[];
  hrefs: Record<Region, string>;
  reviewedAt: string;
  citationsByRegion?: { UK?: string[]; US?: string[]; GLOBAL?: string[] };
}

export const GUIDES: GuideEntry[] = [
  {
    id: 'quick-calm-in-5-minutes',
    title: 'Quick calm in 5 minutes',
    summary: 'Short reset using breathing, grounding, and movement.',
    tags: ['stress', 'calm'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['stress', 'emotional-regulation'],
    hrefs: { UK: '/guides/quick-calm-in-5-minutes', US: '/guides/quick-calm-in-5-minutes' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'body-scan-for-stress',
    title: 'Body scan for stress relief',
    summary: 'A gentle body scan to release tension and reset attention.',
    tags: ['stress', 'calm'],
    audiences: ['me', 'supporter', 'teacher'],
    supportNeeds: ['stress', 'emotional-regulation'],
    hrefs: { UK: '/guides/body-scan-for-stress', US: '/guides/body-scan-for-stress' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'wind-down-routine',
    title: 'Wind‑down routine for better sleep',
    summary: 'Evening routine to help you settle and switch off.',
    tags: ['sleep'],
    audiences: ['me', 'child', 'supporter'],
    supportNeeds: ['sleep'],
    hrefs: { UK: '/guides/wind-down-routine', US: '/guides/wind-down-routine' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'sleep-reset-for-shift-workers',
    title: 'Sleep reset for shift workers',
    summary: 'Gentle adjustments for changing schedules.',
    tags: ['sleep'],
    audiences: ['me', 'workplace'],
    supportNeeds: ['sleep'],
    hrefs: { UK: '/guides/sleep-reset-for-shift-workers', US: '/guides/sleep-reset-for-shift-workers' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'focus-sprints-for-adhd',
    title: 'Focus sprints for ADHD',
    summary: 'Short focus blocks with recovery breaks.',
    tags: ['focus', 'adhd'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['focus', 'organisation'],
    hrefs: { UK: '/guides/focus-sprints-for-adhd', US: '/guides/focus-sprints-for-adhd' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'adhd-break-planning',
    title: 'ADHD break planning',
    summary: 'Plan movement and reset breaks to sustain focus.',
    tags: ['focus', 'adhd'],
    audiences: ['me', 'child', 'supporter', 'teacher', 'workplace'],
    supportNeeds: ['focus', 'organisation'],
    hrefs: { UK: '/guides/adhd-break-planning', US: '/guides/adhd-break-planning' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'autism-sensory-reset',
    title: 'Autism sensory reset',
    summary: 'A gentle plan for sensory overload moments.',
    tags: ['sensory', 'autism'],
    audiences: ['me', 'child', 'supporter', 'teacher'],
    supportNeeds: ['sensory', 'emotional-regulation'],
    hrefs: { UK: '/guides/autism-sensory-reset', US: '/guides/autism-sensory-reset' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'breathing-for-sensory-overload',
    title: 'Breathing for sensory overload',
    summary: 'Gentle breathing steps for sensory overwhelm.',
    tags: ['sensory', 'calm'],
    audiences: ['me', 'child', 'supporter', 'teacher'],
    supportNeeds: ['sensory', 'stress'],
    hrefs: { UK: '/guides/breathing-for-sensory-overload', US: '/guides/breathing-for-sensory-overload' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'autism-transition-support',
    title: 'Autism transition support',
    summary: 'Predictable steps for smoother transitions.',
    tags: ['sensory', 'autism', 'routines'],
    audiences: ['child', 'supporter', 'teacher'],
    supportNeeds: ['sensory', 'organisation'],
    hrefs: { UK: '/guides/autism-transition-support', US: '/guides/autism-transition-support' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'reading-routine-at-home',
    title: 'Reading routine at home',
    summary: 'Short daily reading routines for dyslexia support.',
    tags: ['reading', 'dyslexia'],
    audiences: ['child', 'supporter', 'teacher'],
    supportNeeds: ['reading'],
    hrefs: { UK: '/guides/reading-routine-at-home', US: '/guides/reading-routine-at-home' },
    reviewedAt: '2026-01-17',
  },
  {
    id: 'reading-confidence-in-class',
    title: 'Reading confidence in class',
    summary: 'Classroom strategies to support reading confidence.',
    tags: ['reading', 'school'],
    audiences: ['child', 'supporter', 'teacher'],
    supportNeeds: ['reading'],
    hrefs: { UK: '/guides/reading-confidence-in-class', US: '/guides/reading-confidence-in-class' },
    reviewedAt: '2026-01-17',
  },
];

export const getGuideById = (id: string) => GUIDES.find(guide => guide.id === id);
