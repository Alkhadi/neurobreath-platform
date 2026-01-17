import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrimaryCtaBlock } from '@/components/growth/PrimaryCtaBlock';
import { RelatedResources } from '@/components/growth/RelatedResources';
import { TrustMiniPanel } from '@/components/trust/TrustMiniPanel';
import { TrackClick } from '@/components/analytics/TrackClick';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import { getLocaleCopy } from '@/lib/i18n/localeCopy';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface RegionToolsPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionToolsPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/tools`;
  const alternates = getRegionAlternates('/tools');
  const copy = getLocaleCopy(region);

  const base = generatePageMetadata({
    title: region === 'US' ? 'Tools for calm, focus, sleep, and routines' : 'Tools for calm, focus, sleep, and routines',
    description: `${copy.educationOnly} Interactive tools grouped by support need, with clear next steps into journeys and guides.`,
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

export default async function RegionToolsPage({ params }: RegionToolsPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const copy = getLocaleCopy(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const path = `/${regionKey}/tools`;
  const url = generateCanonicalUrl(path);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Tools',
        item: url,
      },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Tools',
    description: 'Interactive tools grouped by support need, with safe guidance and next steps.',
    url,
  };

  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and tool signposting.',
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 180,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Tools hub added with support-need grouping.', 'content'),
    ]),
    citationsSummary: createCitationsSummary(12, ['A', 'B']),
  });

  const groups: Array<{ id: string; title: string; description: string; tools: Array<{ label: string; href: string; summary: string }> }> = [
    {
      id: 'calm',
      title: 'Calm',
      description: 'Short resets and breathing tools for moments of overwhelm.',
      tools: [
        { label: 'SOS 60-second calm', href: '/techniques/sos', summary: 'One-minute guided reset.' },
        { label: 'Breath tools', href: '/tools/breath-tools', summary: 'Guided breathing patterns and timers.' },
        { label: 'Stress tools', href: '/tools/stress-tools', summary: 'Tools designed for stress support.' },
      ],
    },
    {
      id: 'focus',
      title: 'Focus',
      description: 'Reduce friction and start a task with simple structure.',
      tools: [
        { label: 'Focus tiles', href: '/tools/focus-tiles', summary: 'Pick a context, get a suggested reset.' },
        { label: 'Focus training', href: '/tools/focus-training', summary: 'Structured focus routines and prompts.' },
        { label: 'ADHD focus lab', href: '/tools/adhd-focus-lab', summary: 'Support for attention, planning, and routines.' },
      ],
    },
    {
      id: 'sleep',
      title: 'Sleep',
      description: 'Wind-down and consistency supports for bedtime routines.',
      tools: [
        { label: 'Sleep tools', href: '/tools/sleep-tools', summary: 'Sleep prompts and calming tools.' },
        { label: 'Breathing for sleep', href: '/guides/sleep', summary: 'Guides for building a wind-down routine.' },
      ],
    },
    {
      id: 'reading',
      title: 'Reading',
      description: 'Structured reading practice support and routines.',
      tools: [
        { label: 'Reading training', href: '/dyslexia-reading-training', summary: 'Reading training hub for practice.' },
      ],
    },
    {
      id: 'sensory',
      title: 'Sensory',
      description: 'Environmental changes and sensory-friendly routines.',
      tools: [
        { label: 'Autism tools', href: '/tools/autism-tools', summary: 'Tools and routines for sensory needs.' },
      ],
    },
    {
      id: 'routines',
      title: 'Routines',
      description: 'Build consistency with small, repeatable steps.',
      tools: [
        { label: 'Starter journeys', href: `/${regionKey}/journeys`, summary: 'Short paths combining tools and guides.' },
        { label: 'Help me choose', href: `/${regionKey}/help-me-choose`, summary: 'Get a safe starting plan.' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-500">Tools</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Tools you can try today</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Practical, low-friction tools grouped by support need. {copy.educationOnly}
          </p>

          <PrimaryCtaBlock
            region={region}
            title="Not sure where to start?"
            description="Use Help Me Choose for a quick plan, or start a journey that combines tools and guides."
            primary={{ label: 'Help me choose', href: `/${regionKey}/help-me-choose` }}
            secondary={{ label: 'Starter journeys', href: `/${regionKey}/journeys` }}
          />
        </header>

        <TrustMiniPanel region={region} compact />

        <section className="space-y-6">
          {groups.map(group => (
            <section key={group.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900" id={group.id}>{group.title}</h2>
                  <p className="mt-1 text-sm text-slate-600 max-w-3xl">{group.description}</p>
                </div>
                <Link
                  href={`/${regionKey}/conditions`}
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  Match a tool to a condition
                </Link>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.tools.map(tool => (
                  <TrackClick key={tool.href + tool.label} event="tool_try_now_click" payload={{ href: tool.href, label: tool.label, source: path }}>
                    <Link
                      href={tool.href}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                      <div className="text-base font-semibold text-slate-900 group-hover:text-slate-950">{tool.label}</div>
                      <p className="mt-2 text-sm text-slate-600">{tool.summary}</p>
                      <div className="mt-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Try now</div>
                    </Link>
                  </TrackClick>
                ))}
              </div>

              <div className="mt-6">
                <RelatedResources region={region} tags={[group.id]} title="Next steps" maxPerGroup={4} />
              </div>
            </section>
          ))}
        </section>

        <CredibilityFooter editorial={editorial} region={region} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
