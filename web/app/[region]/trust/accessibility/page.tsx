import type { Metadata } from 'next';
import { TrustAccessibilityPage } from '@/components/trust/pages/trust-pages';
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
  const path = `/${regionKey}/trust/accessibility`;
  const alternates = getRegionAlternates('/trust/accessibility');

  const baseMetadata = generatePageMetadata({
    title: 'Accessibility statement',
    description: 'Accessibility statement outlining our WCAG-aligned commitments, known limitations, and how to report issues.',
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

export default async function RegionTrustAccessibility({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustAccessibilityPage region={getRegionFromKey(resolvedParams.region)} />;
}
