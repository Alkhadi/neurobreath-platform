import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'visual processing difficulties support',
  'reduce visual fatigue strategies',
  'reading-friendly routines',
  'workspace setup for visual processing',
  'colour contrast tips for learning',
  'classroom adjustments visual processing',
  'homework routines for visual support',
  'focus training for study',
  'breathing exercises for stress',
  'SEND visual processing resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Visual processing difficulties',
  description:
    'Educational support for visual processing difficulties: reading-friendly routines, workspace setup tips, and classroom adjustments to reduce fatigue. Includes focus and breathing tools.',
  path: '/conditions/visual-processing',
  keywords: KEYWORDS,
});

export default function VisualProcessingHubPage() {
  return (
    <ConditionHubPage
      title="Visual processing difficulties"
      subtitle="Reading-friendly routines, workspace setup tips, and classroom adjustments — plus focus training and breathing exercises to reduce stress. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training for study routines',
          description: 'Use short sprints and breaks to reduce fatigue.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for calm and regulation',
          description: 'Quick resets can help before reading or homework blocks.',
        },
      ]}
      secondaryLinks={[
        { href: '/dyslexia-reading-training', label: 'Reading training hub' },
        { href: '/guides/focus-start', label: 'Focus starter guide' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['reading support', 'visual comfort', 'routines', 'classroom adjustments', 'homework support']}
    />
  );
}
