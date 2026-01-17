import Link from 'next/link';
import type { Metadata } from 'next';
import { canonicalPages } from '@/lib/content/pages';
import { resolveSEO, resolveH1 } from '@/lib/content/localise';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

interface RegionGuidesPageProps {
  params: { region: string };
}

export function generateMetadata({ params }: RegionGuidesPageProps): Metadata {
  const region = getRegionFromKey(params.region);
  const alternates = getRegionAlternates('/guides');

  return {
    title: region === 'US' ? 'Guides' : 'Guides',
    description: 'Localised guides with evidence-informed routines and practical support.',
    alternates: {
      canonical: generateCanonicalUrl(`/${getRegionKey(region)}/guides`),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default function RegionGuidesPage({ params }: RegionGuidesPageProps) {
  const region = getRegionFromKey(params.region);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Guides</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Practical, localised guidance for calm, focus, and wellbeing routines.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {canonicalPages.map(page => {
            const slug = region === 'US' ? page.slugs.US : page.slugs.UK;
            return (
              <Link
                key={page.id}
                href={`/${getRegionKey(region)}/guides/${slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
              >
                <h2 className="text-lg font-semibold text-slate-900">{resolveH1(page.h1, region)}</h2>
                <p className="mt-2 text-sm text-slate-600">{resolveSEO(page.seo, region).description}</p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
