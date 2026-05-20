import type { Metadata } from 'next';

import AccessToWorkClient from './AccessToWorkClient';

export const metadata: Metadata = {
  title: 'Access to Work & Legal Rights Hub · NeuroBreath',
  description:
    'Plain-language educational hub on workplace adjustments, Access to Work (UK), reasonable adjustments, and copyable templates. General information only — not legal advice.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <AccessToWorkClient />;
}
