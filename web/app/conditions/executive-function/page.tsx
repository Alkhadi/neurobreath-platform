import type { Metadata } from 'next';
import { ConditionHubPage } from '@/components/conditions/ConditionHubPage';
import { generateConditionMetadata } from '@/lib/seo/metadata';

const KEYWORDS = [
  'executive function support strategies',
  'task initiation help routines',
  'planning and organisation support',
  'working memory support tips',
  'time blindness strategies',
  'checklists for routines',
  'focus training for productivity',
  'breathing exercises for stress',
  'reasonable adjustments workplace',
  'SEND executive function resources',
];

export const metadata: Metadata = generateConditionMetadata({
  condition: 'Executive function challenges',
  description:
    'Educational support for executive function challenges: planning prompts, checklists, routines, and task-starting strategies. Includes focus training and breathing tools.',
  path: '/conditions/executive-function',
  keywords: KEYWORDS,
});

export default function ExecutiveFunctionHubPage() {
  return (
    <ConditionHubPage
      title="Executive function challenges"
      subtitle="Planning, organisation and task-starting support with practical routines — plus focus training and breathing exercises to reduce stress and improve momentum. Educational information only."
      primaryLinks={[
        {
          href: '/tools/focus-training',
          label: 'Focus training (sprints + recovery)',
          description: 'Use structured sprints to support task initiation and follow-through.',
        },
        {
          href: '/tools/breath-tools',
          label: 'Breathing tools (stress reset)',
          description: 'Quick calm routines can reduce stress and help you re-engage.',
        },
      ]}
      secondaryLinks={[
        { href: '/guides/focus-start', label: 'Focus starter guide' },
        { href: '/guides/quick-calm-in-5-minutes', label: 'Quick calm guide' },
        { href: '/uk/conditions', label: 'Browse all conditions (UK)' },
        { href: '/us/conditions', label: 'Browse all conditions (US)' },
      ]}
      relatedTags={['planning', 'organisation', 'task initiation', 'routines', 'workplace support']}
    />
  );
}
