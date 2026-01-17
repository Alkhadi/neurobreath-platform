import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HelpMeChooseResults } from '@/components/help/HelpMeChooseResults';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface HelpMeChooseResultsPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: HelpMeChooseResultsPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/help-me-choose/results`;
  const alternates = getRegionAlternates('/help-me-choose/results');

  const baseMetadata = generatePageMetadata({
    title: 'Help me choose — results',
    description: 'Your personalised educational plan. Stored locally on your device.',
    path,
    noindex: true,
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

export default async function HelpMeChooseResultsPage({ params }: HelpMeChooseResultsPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Help me choose</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Your personalised plan</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Educational guidance only. Your answers are stored locally on your device.
          </p>
        </header>

        <HelpMeChooseResults region={region} />
      </div>
    </main>
  );
}
