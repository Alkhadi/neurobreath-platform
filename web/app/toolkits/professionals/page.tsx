import type { Metadata } from 'next';

import { ToolkitView } from '@/components/shared/ToolkitView';
import { getToolkit } from '@/data/phase2/persona-toolkits';

export const metadata: Metadata = {
  title: 'Professional Toolkit · NeuroBreath',
  description:
    'Practical work-day routines, adjustment checklists, and self-advocacy resources for neurodivergent professionals. Educational guidance only.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ToolkitView toolkit={getToolkit('professionals')} />;
}
