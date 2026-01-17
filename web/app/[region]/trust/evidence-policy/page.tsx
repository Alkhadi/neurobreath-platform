import type { Metadata } from 'next';
import { TrustEvidencePolicyPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/evidence-policy`;
  const alternates = getRegionAlternates('/trust/evidence-policy');

  const baseMetadata = generatePageMetadata({
    title: 'Evidence policy',
    description: 'How NeuroBreath selects, reviews, and updates evidence sources for wellbeing and neurodiversity guidance.',
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

export default async function RegionTrustEvidencePolicy({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustEvidencePolicyPage region={getRegionFromKey(resolvedParams.region)} />;
}
