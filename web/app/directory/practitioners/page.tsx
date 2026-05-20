import type { Metadata } from 'next';

import PractitionerDirectoryClient from './PractitionerDirectoryClient';

export const metadata: Metadata = {
  title: 'Practitioner Directory · NeuroBreath',
  description:
    'A read-only directory of neurodiversity-aware practitioners. Listings must be independently checked before publication. Educational signposting only.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PractitionerDirectoryClient />;
}
