import type { Metadata } from 'next';
import { TrustLastReviewedPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/last-reviewed`;
  const alternates = getRegionAlternates('/trust/last-reviewed');

  const baseMetadata = generatePageMetadata({
    title: 'Last reviewed & content freshness',
    description: 'How NeuroBreath reviews content and keeps educational guidance up to date.',
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

export default async function RegionTrustLastReviewed({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustLastReviewedPage region={getRegionFromKey(resolvedParams.region)} />;
}
