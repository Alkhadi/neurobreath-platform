import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'hyperlexia support UK',
  'hyperlexic reading comprehension support',
  'balance reading strengths with communication',
  'comprehension routines for learners',
  'conversation support strategies',
  'visual schedules for routines',
  'school communication supports',
  'focus training for learning',
  'breathing exercises for calm',
  'SEND hyperlexia resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Hyperlexia',
  description:
    'Educational support for hyperlexia: comprehension routines, communication supports, and balanced learning strategies. Includes focus training and breathing tools.',
  path: '/conditions/hyperlexia',
  keywords: KEYWORDS,
});

export default function HyperlexiaHubPage() {
  return (
    <ConditionHubPage
      title="Hyperlexia support"
      subtitle="Support comprehension routines and communication alongside reading strengths, with focus training and breathing exercises for calmer learning. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training for learning routines',
          description: 'Short sprints can support comprehension and follow-through.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for calm and regulation',
          description: 'Use quick calm routines before language-heavy tasks.',
        },
      ]}
      secondaryLinks={[
        { href: '/dyslexia-reading-training', label: 'Reading training hub' },
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['reading', 'comprehension', 'communication', 'routines', 'school support']}
    />
  );
}
