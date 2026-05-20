import type { Metadata } from 'next';

import SpikyProfileClient from './SpikyProfileClient';

export const metadata: Metadata = {
  title: 'Spiky Profile · Strengths and Support Map · NeuroBreath',
  description:
    'Reflect on focus, executive function, sensory, emotional, communication, memory, reading, and routine support needs. Educational only — this tool does not diagnose.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <SpikyProfileClient />;
}
