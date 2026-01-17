import type { Metadata } from 'next';
import { TrustDisclaimerPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/disclaimer`;
  const alternates = getRegionAlternates('/trust/disclaimer');

  const baseMetadata = generatePageMetadata({
    title: 'Educational disclaimer',
    description: 'Educational disclaimer explaining what NeuroBreath can and cannot do, and how to use the platform safely.',
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

export default async function RegionTrustDisclaimer({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustDisclaimerPage region={getRegionFromKey(resolvedParams.region)} />;
}
