import type { Metadata } from 'next';
import { TrustPrivacyPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/privacy`;
  const alternates = getRegionAlternates('/trust/privacy');

  const baseMetadata = generatePageMetadata({
    title: 'Privacy notice (plain language)',
    description: 'Plain-language privacy notice explaining how NeuroBreath handles data and user choices.',
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

export default async function RegionTrustPrivacy({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustPrivacyPage region={getRegionFromKey(resolvedParams.region)} />;
}
