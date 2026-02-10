import type { Metadata } from 'next';
import { TrustEditorialStandardsPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/editorial-standards`;
  const alternates = getRegionAlternates('/trust/editorial-standards');

  const baseMetadata = generatePageMetadata({
    title: 'Editorial standards',
    description: 'Editorial standards for tone, claims, localisation, and content quality on NeuroBreath.',
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

export default async function RegionTrustEditorialStandards({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustEditorialStandardsPage region={getRegionFromKey(resolvedParams.region)} />;
}
