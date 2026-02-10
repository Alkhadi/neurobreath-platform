import type { Metadata } from 'next';
import { TrustHubPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust`;
  const alternates = getRegionAlternates('/trust');

  const baseMetadata = generatePageMetadata({
    title: 'Trust Centre',
    description: 'Trust, safety, and evidence standards for NeuroBreath, including safeguarding, privacy, accessibility, and contact routes.',
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

export default async function RegionTrustPage({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustHubPage region={getRegionFromKey(resolvedParams.region)} />;
}
