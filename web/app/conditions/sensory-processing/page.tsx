import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'sensory processing support UK',
  'sensory overload regulation strategies',
  'sensory-friendly routines',
  'calm corner setup',
  'classroom sensory adjustments',
  'sensory checklist for triggers',
  'transition plans for overwhelm',
  'breathing exercises for calm',
  'grounding techniques for stress',
  'SEND sensory support resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Sensory processing differences',
  description:
    'Educational support for sensory processing differences: sensory-friendly routines, calm corner planning, classroom adjustments, and overload recovery. Includes breathing and stress tools.',
  path: '/conditions/sensory-processing',
  keywords: KEYWORDS,
});

export default function SensoryProcessingHubPage() {
  return (
    <ConditionHubPage
      title="Sensory processing differences"
      subtitle="Sensory-friendly routines and environment tweaks to reduce overload, plus breathing exercises and grounding tools for quick calm. Educational information only."
      primaryLinks={[
        {
          href: '/tools/stress-tools',
          label: 'Stress tools (grounding + reset)',
          description: 'Try grounding prompts and micro-resets after overload.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools (steady regulation)',
          description: 'Use gentle breathing routines to support nervous system regulation.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/body-scan-for-stress', label: 'Body scan for stress' },
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['sensory', 'routines', 'transitions', 'calm corner', 'classroom adjustments']}
    />
  );
}
