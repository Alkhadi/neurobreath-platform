import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  FocusHero,
  FocusProtocolsCard,
  FocusProgressTracker,
  FocusGamesSection,
  FocusDrill,
  FocusEvidence,
  FocusEmergencyHelp,
} from '@/components/focus';
import { getRegionFromKey, getRegionKey, getRegionAlternates } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface FocusPageProps {
  params: Promise<{ region: string }>;
}

export function generateStaticParams() {
  return [{ region: 'uk' }, { region: 'us' }];
}

export async function generateMetadata({ params }: FocusPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/breathing/focus`;
  const alternates = getRegionAlternates('/breathing/focus');

  const base = generatePageMetadata({
    title: 'Focus — Sprints with Recovery',
    description:
      'Evidence-based focus techniques with breathing exercises. Short sprints, clear goals, and recovery breaks for ADHD and neurodivergent adults.',
    path,
  });

  return {
    ...base,
    alternates: {
      canonical: generateCanonicalUrl(path),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function FocusPage({ params }: FocusPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <section id="main-content" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <FocusHero />
          <FocusProtocolsCard region={region} />
          <FocusProgressTracker />
          <FocusGamesSection region={region} />
          <FocusDrill />
          <FocusEvidence region={region} />
          <FocusEmergencyHelp region={region} />
        </div>
      </section>
    </main>
  );
}
