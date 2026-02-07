import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'dysgraphia support UK',
  'handwriting support strategies',
  'writing fatigue support',
  'assistive technology for writing',
  'sentence planning routines',
  'dysgraphia classroom adjustments',
  'fine motor breaks',
  'focus training for writing tasks',
  'breathing exercises for stress',
  'SEND writing support resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Dysgraphia',
  description:
    'Educational support for dysgraphia: writing routines, reduced fatigue strategies, planning prompts, and classroom adjustments. Includes breathing and focus tools.',
  path: '/conditions/dysgraphia',
  keywords: KEYWORDS,
});

export default function DysgraphiaHubPage() {
  return (
    <ConditionHubPage
      title="Dysgraphia support"
      subtitle="Practical writing routines, planning prompts, and classroom adjustments to reduce fatigue — plus breathing exercises for stress and steadier focus. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training for writing tasks',
          description: 'Use short sprints with recovery breaks to support stamina.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for calm and regulation',
          description: 'Reset before writing and between practice blocks.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/focus-start', label: 'Focus starter guide' },
        { href: '/guides/body-scan-for-stress', label: 'Body scan for stress' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['writing support', 'routines', 'assistive tools', 'fine motor breaks', 'classroom support']}
    />
  );
}
