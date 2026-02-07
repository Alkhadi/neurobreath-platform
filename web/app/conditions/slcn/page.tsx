import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'speech and language support UK',
  'speech language communication needs SLCN',
  'communication support strategies',
  'visual supports for communication',
  'classroom language support',
  'home conversation starters',
  'confidence building communication',
  'breathing exercises for anxiety',
  'focus routines for learning',
  'SEND communication resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Speech, language and communication needs (SLCN)',
  description:
    'Educational support for speech, language and communication needs (SLCN): practical routines, visual supports, and confidence-building strategies. Includes breathing and focus tools.',
  path: '/conditions/slcn',
  keywords: KEYWORDS,
});

export default function SlcnHubPage() {
  return (
    <ConditionHubPage
      title="Speech, language and communication needs (SLCN)"
      subtitle="Communication-friendly routines and classroom supports, plus breathing exercises for anxiety and steadier focus for learning. Educational information only."
      primaryLinks={[
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools for calm communication',
          description: 'Use quick calm routines before speaking tasks or busy transitions.',
        },
        {
          href: '/tools/focus-training',
          label: 'Focus training for learning routines',
          description: 'Short sprints can support attention during language practice.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/guides/body-scan-for-stress', label: 'Body scan for stress' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['communication', 'visual supports', 'classroom support', 'confidence', 'routines']}
    />
  );
}
