import type { FocusProtocol, FocusGame, FocusEvidence } from './types';
import type { Region } from '@/lib/region/region';

export const focusProtocols: FocusProtocol[] = [
  {
    id: '2min',
    name: '2-minute reset',
    duration: '2 min',
    description: '4 Box cycles + eyes on a single point.',
    colorClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600',
  },
  {
    id: '5min',
    name: '5-minute',
    duration: '5 min',
    description: 'Coherent 5-5 + brief stretch.',
    colorClass: 'bg-purple-100',
    iconColorClass: 'text-purple-600',
  },
  {
    id: '10min',
    name: '10-minute',
    duration: '10 min',
    description: '2x Coherent 5-5 + 1-minute quiet.',
    colorClass: 'bg-indigo-100',
    iconColorClass: 'text-indigo-600',
  },
];

export const focusGames: FocusGame[] = [
  {
    id: 'focus-quest',
    name: 'Focus Quest',
    emoji: '🎯',
    icon: 'Target',
    iconColor: 'text-blue-600',
    href: '/breathing/training/focus-garden',
  },
  {
    id: 'spot-target',
    name: 'Spot the Target',
    emoji: '🔍',
    icon: 'Eye',
    iconColor: 'text-purple-600',
    href: '/breathing/training/focus-garden',
  },
  {
    id: 'reaction-challenge',
    name: 'Reaction Challenge',
    emoji: '⚡',
    icon: 'Zap',
    iconColor: 'text-amber-600',
    href: '/breathing/training/focus-garden',
  },
];

export const focusEvidenceByRegion: Record<Region, FocusEvidence> = {
  UK: {
    region: 'UK',
    links: [
      {
        title: 'Acas — Adjustments for neurodiversity',
        url: 'https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity',
        source: 'Acas',
      },
      {
        title: 'NHS — Talking therapies (work stress)',
        url: 'https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/',
        source: 'NHS',
      },
    ],
  },
  US: {
    region: 'US',
    links: [
      {
        title: 'NIMH — ADHD Resources',
        url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
        source: 'NIMH',
      },
      {
        title: 'CDC — ADHD Treatment',
        url: 'https://www.cdc.gov/ncbddd/adhd/treatment.html',
        source: 'CDC',
      },
      {
        title: 'CHADD — Workplace accommodations',
        url: 'https://chadd.org/for-adults/workplace-issues/',
        source: 'CHADD',
      },
    ],
  },
};
