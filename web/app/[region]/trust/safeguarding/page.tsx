import type { Metadata } from 'next';
import { TrustSafeguardingPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/safeguarding`;
  const alternates = getRegionAlternates('/trust/safeguarding');

  const baseMetadata = generatePageMetadata({
    title: 'Safeguarding guidance',
    description: 'Safeguarding guidance with reporting routes and urgent support information for UK and US users.',
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

export default async function RegionTrustSafeguarding({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustSafeguardingPage region={getRegionFromKey(resolvedParams.region)} />;
}
