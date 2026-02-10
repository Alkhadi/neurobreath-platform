import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'dyspraxia support UK',
  'developmental coordination disorder DCD strategies',
  'coordination difficulties classroom support',
  'dyspraxia routines for daily life',
  'movement breaks for coordination',
  'planning checklists for dyspraxia',
  'dyspraxia confidence building',
  'breathing exercises for stress',
  'focus training for routines',
  'reasonable adjustments at school',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Dyspraxia / DCD',
  description:
    'Educational support for dyspraxia (DCD): coordination-friendly routines, planning prompts, movement breaks, and confidence building. Includes breathing and focus tools.',
  path: '/conditions/dyspraxia',
  keywords: KEYWORDS,
});

export default function DyspraxiaHubPage() {
  return (
    <ConditionHubPage
      title="Dyspraxia / DCD support"
      subtitle="Practical routines for coordination and confidence, plus breathing exercises for stress regulation and focus support. Educational information only — not medical advice or diagnosis."
      primaryLinks={[
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools (quick calm + steady focus)',
          description: 'Use a low-friction breathing routine to reduce overwhelm and reset attention.',
        },
        {
          href: '/tools/focus-training',
          label: 'Focus training (short sprints + recovery)',
          description: 'Try paced focus sprints to support planning, task starting, and momentum.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/guides/focus-start', label: 'Getting started with focus' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['routines', 'motor coordination', 'movement breaks', 'confidence', 'school support']}
    />
  );
}
