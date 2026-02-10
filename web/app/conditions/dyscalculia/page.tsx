import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'dyscalculia support UK',
  'number sense support strategies',
  'maths anxiety calming techniques',
  'dyscalculia classroom adjustments',
  'maths routines for learners',
  'visual aids for dyscalculia',
  'homework steps for maths support',
  'focus training for study routines',
  'breathing exercises for anxiety',
  'SEND maths support resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Dyscalculia',
  description:
    'Educational support for dyscalculia: number sense routines, maths anxiety support, classroom adjustments, and practical study prompts. Includes breathing and focus tools.',
  path: '/conditions/dyscalculia',
  keywords: KEYWORDS,
});

export default function DyscalculiaHubPage() {
  return (
    <ConditionHubPage
      title="Dyscalculia support"
      subtitle="Practical, educator-informed support for number sense and maths routines, plus breathing exercises to reduce anxiety and steadier focus for study. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training for study routines',
          description: 'Use short, structured sprints to build momentum without overwhelm.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for maths anxiety',
          description: 'Try a quick calm routine before practice or tests.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/focus-start', label: 'Focus starter guide' },
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['math support', 'routines', 'confidence', 'exam prep', 'classroom support']}
    />
  );
}
