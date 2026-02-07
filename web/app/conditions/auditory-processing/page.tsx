import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'auditory processing disorder support UK',
  'listening difficulties classroom strategies',
  'reduce listening fatigue routines',
  'visual backup strategies for instructions',
  'communication support for APD',
  'quiet workspace setup tips',
  'focus routines for listening tasks',
  'breathing exercises for anxiety',
  'teacher support auditory processing',
  'SEND listening support resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Auditory processing difficulties',
  description:
    'Educational support for auditory processing difficulties: listening-friendly routines, visual backup strategies, and classroom supports to reduce fatigue. Includes focus and breathing tools.',
  path: '/conditions/auditory-processing',
  keywords: KEYWORDS,
});

export default function AuditoryProcessingHubPage() {
  return (
    <ConditionHubPage
      title="Auditory processing difficulties"
      subtitle="Listening-friendly routines and classroom supports to reduce fatigue, plus focus routines and breathing exercises for calmer learning. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training for listening tasks',
          description: 'Short sprints can help with attention during instruction or practice.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for calm and regulation',
          description: 'Reset between listening blocks to reduce overwhelm.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/focus-start', label: 'Focus starter guide' },
        { href: '/guides/body-scan-for-stress', label: 'Body scan for stress' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['communication', 'focus', 'routines', 'classroom supports', 'fatigue management']}
    />
  );
}
