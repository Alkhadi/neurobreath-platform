import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'visual stress support UK',
  'Irlen syndrome like visual stress',
  'pattern glare reading support',
  'reduce visual strain strategies',
  'lighting and contrast tips',
  'reading layout adjustments',
  'visual breaks routine',
  'classroom adjustments for visual stress',
  'focus training for study',
  'breathing exercises for calm',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Irlen-like visual stress',
  description:
    'Educational support for visual stress: reading layout tweaks, lighting tips, visual breaks, and classroom adjustments to reduce strain. Includes focus and breathing tools.',
  path: '/conditions/visual-stress',
  keywords: KEYWORDS,
});

export default function VisualStressHubPage() {
  return (
    <ConditionHubPage
      title="Irlen-like visual stress support"
      subtitle="Reading-friendly layout tips, lighting tweaks, and visual break routines — plus focus training and breathing exercises for calmer study. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training for paced study',
          description: 'Use sprints and breaks to reduce visual fatigue.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for calm and regulation',
          description: 'Quick resets can help when reading feels intense.',
        },
      ]}
      secondaryLinks={[
        { href: '/dyslexia-reading-training', label: 'Reading training hub' },
        { href: '/guides/body-scan-for-stress', label: 'Body scan for stress' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['reading support', 'visual comfort', 'lighting tips', 'classroom adjustments', 'break routines']}
    />
  );
}
