import Link from 'next/link';
import type { Metadata } from 'next';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { PrimaryCtaBlock } from '@/components/growth/PrimaryCtaBlock';
import { RelatedResources } from '@/components/growth/RelatedResources';
import { TrustMiniPanel } from '@/components/trust/TrustMiniPanel';
import { canonicalPages } from '@/lib/content/pages';
import { PILLARS } from '@/lib/content/content-seo-map';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

interface RegionGuidesPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionGuidesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const region = getRegionFromKey(resolvedParams.region);
  const alternates = getRegionAlternates('/guides');

  return {
    title: region === 'US' ? 'Guides (topics, routines, and tools)' : 'Guides (topics, routines, and tools)',
    description: 'Topic clusters and practical guides with evidence-informed, educational next steps (not medical advice).',
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
  const regionKey = getRegionKey(region);

  const path = `/${regionKey}/guides`;
  const url = generateCanonicalUrl(path);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Guides',
        item: url,
      },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Guides',
    description: 'Topic clusters and practical guides with educational next steps.',
    url,
  };

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and guide signposting.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Guides hub upgraded with topic clusters.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(PILLARS.length + canonicalPages.length, ['A', 'B']),
  });

  const featuredGuides = canonicalPages.map(page => {
    const slug = region === 'US' ? page.slugs.US : page.slugs.UK;
    const title = region === 'US' ? page.h1.US : page.h1.UK;
    const description = region === 'US' ? page.seo.description.US : page.seo.description.UK;
    return { slug, title, description };
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Guides</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Guides by topic cluster</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Practical, educational guidance for calm, focus, sleep, and learning routines. Not medical advice.
          </p>
          <PrimaryCtaBlock
            region={region}
            title="Start with a safe next step"
            description="Use Help Me Choose for a quick plan, or start a journey that combines tools and guides."
            primary={{ label: 'Help me choose', href: `/${regionKey}/help-me-choose` }}
            secondary={{ label: 'Starter journeys', href: `/${regionKey}/journeys` }}
          />
        </header>

        <TrustMiniPanel region={region} compact />

        {featuredGuides.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Featured guides</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {featuredGuides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/${regionKey}/guides/${guide.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Browse topic clusters</h2>
          <p className="text-sm text-slate-600">Each cluster includes a “start here” tool and a set of focused guides.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {PILLARS.map(pillar => (
              <Link
                key={pillar.key}
                href={`/guides/${pillar.key}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <div className="text-lg font-semibold text-slate-900">{pillar.title}</div>
                <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pillar.clusters.slice(0, 3).map(cluster => (
                    <span key={cluster.slug} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {cluster.title}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <RelatedResources region={region} tags={['calm', 'focus', 'sleep', 'reading']} title="Recommended next steps" maxPerGroup={5} />

        <CredibilityFooter editorial={editorial} region={region} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
