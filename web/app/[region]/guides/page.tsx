import Link from 'next/link';
import type { Metadata } from 'next';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { canonicalPages } from '@/lib/content/pages';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { resolveSEO, resolveH1 } from '@/lib/content/localise';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

interface RegionGuidesPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionGuidesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const region = getRegionFromKey(resolvedParams.region);
  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and guide coverage.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Guides hub refreshed with current content.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(canonicalPages.length, ['A', 'B']),
  });
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

export default async function RegionGuidesPage({ params }: RegionGuidesPageProps) {
  const resolvedParams = await params;
  const region = getRegionFromKey(resolvedParams.region);

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

        <CredibilityFooter editorial={editorial} region={region} />
      </div>
    </main>
  );
}
