import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JourneysHub } from '@/components/journeys/JourneysHub';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionJourneysPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionJourneysPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/journeys`;
  const alternates = getRegionAlternates('/journeys');

  const baseMetadata = generatePageMetadata({
    title: 'Starter journeys',
    description: 'Starter journeys combining guides and tools for calm, focus, sleep, and daily support. Educational only.',
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

export default async function RegionJourneysPage({ params }: RegionJourneysPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <JourneysHub region={region} />
      </div>
    </main>
  );
}
