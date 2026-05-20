import type { Metadata } from 'next';

import { ToolkitView } from '@/components/shared/ToolkitView';
import { getToolkit } from '@/data/phase2/persona-toolkits';

export const metadata: Metadata = {
  title: 'Paediatrician Toolkit · NeuroBreath',
  description:
    'Plain-language signposting and non-diagnostic NeuroBreath resources for paediatricians and family-health professionals. Educational guidance only.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ToolkitView toolkit={getToolkit('paediatricians')} />;
}
