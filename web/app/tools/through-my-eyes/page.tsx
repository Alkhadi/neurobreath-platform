import type { Metadata } from 'next';

import ThroughMyEyesClient from './ThroughMyEyesClient';

export const metadata: Metadata = {
  title: 'Through My Eyes · Sensory Simulators · NeuroBreath',
  description:
    'Optional, manual-start simulations that hint at sensory overwhelm, focus drift, and reading effort. Educational only. Stop any simulation at any time.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ThroughMyEyesClient />;
}
