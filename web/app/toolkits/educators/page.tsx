import type { Metadata } from 'next';

import { ToolkitView } from '@/components/shared/ToolkitView';
import { getToolkit } from '@/data/phase2/persona-toolkits';

export const metadata: Metadata = {
  title: 'Educator Toolkit · NeuroBreath',
  description:
    'Neuro-affirming classroom routines and short, practical strategies for teachers and learning-support staff. Educational guidance only.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ToolkitView toolkit={getToolkit('educators')} />;
}
