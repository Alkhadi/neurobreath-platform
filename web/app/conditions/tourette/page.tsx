import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'tourette syndrome support UK',
  'tic disorder school support',
  'stress reduction for tics',
  'classroom adjustments for tics',
  'routine support for tic disorders',
  'sleep routines and tics',
  'breathing exercises for calm',
  'grounding techniques for anxiety',
  'teacher guidance tourette',
  'parent carer support tics',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Tourette syndrome / tic disorders',
  description:
    'Educational guidance for Tourette syndrome and tic disorders: routine support, stress reduction, and classroom adjustments. Includes breathing and stress tools.',
  path: '/conditions/tourette',
  keywords: KEYWORDS,
});

export default function TouretteHubPage() {
  return (
    <ConditionHubPage
      title="Tourette syndrome / tic disorders support"
      subtitle="Practical routines and stress reduction strategies that can support day-to-day coping, plus breathing exercises and grounding tools. Educational information only."
      primaryLinks={[
        {
          href: '/tools/stress-tools',
          label: 'Stress tools (grounding + reset routines)',
          description: 'Try grounding prompts and quick resets for stressful moments.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools (quick calm)',
          description: 'Use a short breathing routine to reduce stress intensity.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/sleep', label: 'Sleep support page' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['stress regulation', 'routines', 'school support', 'sleep consistency', 'communication']}
    />
  );
}
