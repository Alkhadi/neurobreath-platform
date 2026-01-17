import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrintActions } from '@/components/printables/PrintActions';
import { CitationList } from '@/components/trust/CitationList';
import { LastReviewedBadge } from '@/components/trust/LastReviewedBadge';
import { PRINTABLES, getPrintableById, getPrintableCitationsForRegion, getPrintableSummary, getPrintableTitle } from '@/lib/printables/printables';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getJourneyById } from '@/lib/journeys/journeys';
import { getGuideById } from '@/lib/guides/guides';
import { getToolById } from '@/lib/tools/tools';
import { canonicalPagesBySlug } from '@/lib/content/pages';

interface PrintableDetailPageProps {
  params: Promise<{ region: string; slug: string }>;
}

export function generateStaticParams() {
  return PRINTABLES.flatMap(printable => [
    { region: 'uk', slug: printable.id },
    { region: 'us', slug: printable.id },
  ]);
}

export async function generateMetadata({ params }: PrintableDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const printable = getPrintableById(resolved.slug);
  if (!printable) return {};

  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/printables/${printable.id}`;
  const alternates = getRegionAlternates(`/printables/${printable.id}`);

  const baseMetadata = generatePageMetadata({
    title: `${getPrintableTitle(printable, region)} | Printables`,
    description: getPrintableSummary(printable, region),
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

const AUDIENCE_LABELS: Record<string, string> = {
  'parent-carer': 'Parents & carers',
  teacher: 'Teachers',
  workplace: 'Workplace support',
  individual: 'Individuals',
};

const TYPE_LABELS: Record<string, string> = {
  checklist: 'Checklist',
  template: 'Template',
  worksheet: 'Worksheet',
  plan: 'Plan',
  'prompt-card': 'Prompt card',
  'classroom-resource': 'Classroom resource',
  'workplace-resource': 'Workplace resource',
};

function resolveGuideLink(value: string, region: 'UK' | 'US', regionKey: string) {
  const guide = getGuideById(value);
  if (guide) {
    return { label: guide.title, href: guide.hrefs[region] };
  }

  const canonicalPage = canonicalPagesBySlug[value];
  if (canonicalPage) {
    return { label: canonicalPage.h1?.base ?? value, href: `/${regionKey}/guides/${value}` };
  }

  if (value.startsWith('/')) {
    const href = value.startsWith(`/${regionKey}/`) ? value : `/${regionKey}${value}`;
    return { label: value.replace('/guides/', '').replace(/-/g, ' '), href };
  }

  return null;
}

export default async function PrintableDetailPage({ params }: PrintableDetailPageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const printable = getPrintableById(resolved.slug);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  if (!printable) return notFound();

  const title = getPrintableTitle(printable, region);
  const summary = getPrintableSummary(printable, region);
  const citations = getPrintableCitationsForRegion(printable, region).map(source => ({
    label: source.label,
    url: source.url,
  }));

  const journeys = printable.internalLinks.relatedJourneys
    .map(id => getJourneyById(id))
    .filter(Boolean)
    .map(journey => ({
      id: journey!.id,
      label: journey!.title,
      href: journey!.hrefs[region],
    }));

  const tools = printable.internalLinks.relatedTools
    .map(id => getToolById(id))
    .filter(Boolean)
    .map(tool => ({
      id: tool!.id,
      label: tool!.title,
      href: tool!.href,
    }));

  const guides = printable.internalLinks.relatedGuides
    .map(value => resolveGuideLink(value, region, regionKey))
    .filter(Boolean)
    .slice(0, 6)
    .map(guide => ({
      label: guide!.label,
      href: guide!.href,
    }));

  const glossaryTerms = (printable.internalLinks.relatedGlossaryTerms || []).map(term => ({
    id: term,
    href: `/${regionKey}/glossary/${term}`,
  }));

  const pdfUrl = printable.formatOptions.pdf ? `/${regionKey}/printables/${printable.id}/pdf` : undefined;
  const canonicalUrl = generateCanonicalUrl(`/${regionKey}/printables/${printable.id}`);
  const hubUrl = generateCanonicalUrl(`/${regionKey}/printables`);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Printables',
        item: hubUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: summary,
    url: canonicalUrl,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white printable-page">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <div className="text-sm text-slate-500 print-hide">
          <Link href={`/${regionKey}/printables`} className="hover:text-slate-700">Printables</Link> / {title}
        </div>

        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{summary}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-1">{AUDIENCE_LABELS[printable.audience]}</span>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">{TYPE_LABELS[printable.type]}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{printable.estimatedTimeToUse}</span>
          </div>
        </header>

        <PrintActions pdfUrl={pdfUrl} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Who this is for</h2>
          <p className="mt-2 text-sm text-slate-600">
            {AUDIENCE_LABELS[printable.audience]} looking for practical, educational support.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {printable.conditionTags.map(tag => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {tag}
              </span>
            ))}
            {printable.supportNeedsTags.map(tag => (
              <span key={tag} className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">
                {tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">How to use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {printable.howToUse.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          {printable.sections.map(section => (
            <div
              key={section.heading}
              className={`rounded-2xl border border-slate-200 bg-white p-5 ${section.pageBreakBefore ? 'page-break' : ''}`}
            >
              <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
              <div className="mt-3 space-y-4 text-sm text-slate-700 printable-content">
                {section.blocks.map((block, index) => {
                  if (block.type === 'paragraph') {
                    return <p key={`${section.heading}-p-${index}`}>{block.text}</p>;
                  }
                  if (block.type === 'bullets') {
                    return (
                      <ul key={`${section.heading}-b-${index}`} className="list-disc space-y-2 pl-5">
                        {block.items.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === 'steps') {
                    return (
                      <ol key={`${section.heading}-s-${index}`} className="list-decimal space-y-2 pl-5">
                        {block.steps.map(step => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    );
                  }
                  if (block.type === 'table') {
                    return (
                      <div key={`${section.heading}-t-${index}`} className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr>
                              {block.table.headers.map(header => (
                                <th key={header} className="border border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-600">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.table.rows.map((row, rowIndex) => (
                              <tr key={`${section.heading}-row-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                  <td key={`${section.heading}-cell-${rowIndex}-${cellIndex}`} className="border border-slate-200 px-3 py-2 text-sm text-slate-700">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Related resources</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {journeys.slice(0, 2).map(journey => (
              <Link key={journey.id} href={journey.href} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm hover:border-indigo-300">
                <p className="text-xs uppercase tracking-wide text-slate-500">Journey</p>
                <p className="text-base font-semibold text-slate-900">{journey.label}</p>
              </Link>
            ))}
            {tools.slice(0, 2).map(tool => (
              <Link key={tool.id} href={tool.href} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm hover:border-indigo-300">
                <p className="text-xs uppercase tracking-wide text-slate-500">Tool</p>
                <p className="text-base font-semibold text-slate-900">{tool.label}</p>
              </Link>
            ))}
          </div>
          {guides.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {guides.map(guide => (
                <Link key={guide.href} href={guide.href} className="rounded-xl border border-slate-200 bg-white p-4 text-sm hover:border-indigo-300">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Guide</p>
                  <p className="text-base font-semibold text-slate-900">{guide.label}</p>
                </Link>
              ))}
            </div>
          )}
          {glossaryTerms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {glossaryTerms.map(term => (
                <Link
                  key={term.id}
                  href={term.href}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-300"
                >
                  {term.id.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Trust & evidence</h2>
          <p className="text-xs text-slate-500">Educational resource — not medical advice.</p>
          <CitationList sources={citations} title="Citations" />
          <LastReviewedBadge reviewedAt={printable.reviewedAt} reviewIntervalDays={printable.reviewIntervalDays} region={region} />
          <div className="text-xs text-slate-500">
            <Link href={`/${regionKey}/trust/evidence-policy`} className="text-indigo-600 hover:underline">
              Evidence policy
            </Link>
            <span className="mx-2">·</span>
            <Link href={`/${regionKey}/trust/citations`} className="text-indigo-600 hover:underline">
              Citations policy
            </Link>
            {(printable.audience === 'teacher' || printable.audience === 'parent-carer') && (
              <>
                <span className="mx-2">·</span>
                <Link href={`/${regionKey}/trust/safeguarding`} className="text-indigo-600 hover:underline">
                  Safeguarding
                </Link>
              </>
            )}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
