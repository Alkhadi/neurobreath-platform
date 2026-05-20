import type { Metadata } from 'next';

import { ToolkitView } from '@/components/shared/ToolkitView';
import { getToolkit } from '@/data/phase2/persona-toolkits';

export const metadata: Metadata = {
  title: 'Parent Toolkit · NeuroBreath',
  description:
    'Practical routines and starting points for parents and carers supporting a neurodivergent child or teen. Educational guidance only.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ToolkitView toolkit={getToolkit('parents')} />;
}
