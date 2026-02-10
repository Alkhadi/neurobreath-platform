import type { Metadata } from 'next';
import { TrustCitationsPage } from '@/components/trust/pages/trust-pages';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/trust/citations`;
  const alternates = getRegionAlternates('/trust/citations');

  const baseMetadata = generatePageMetadata({
    title: 'Citations & source attribution',
    description: 'How NeuroBreath displays citations, verifies sources, and keeps references consistent.',
    path,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: generateCanonicalUrl(path),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function RegionTrustCitations({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustCitationsPage region={getRegionFromKey(resolvedParams.region)} />;
}
