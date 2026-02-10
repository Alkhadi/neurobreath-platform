import type { Metadata } from 'next';
import { TrustTermsPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/terms`;
  const alternates = getRegionAlternates('/trust/terms');

  const baseMetadata = generatePageMetadata({
    title: 'Terms of use',
    description: 'Basic terms of use and acceptable use guidelines for the NeuroBreath platform.',
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

export default async function RegionTrustTerms({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustTermsPage region={getRegionFromKey(resolvedParams.region)} />;
}
