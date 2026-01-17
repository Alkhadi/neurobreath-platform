'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { GlossaryTerm } from '@/lib/glossary/glossary';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { CitationList } from '@/components/trust/CitationList';
import { LastReviewedBadge } from '@/components/trust/LastReviewedBadge';

interface GlossaryTermLink {
  id: string;
  label: string;
  href: string;
}

interface GlossaryNextLinks {
  journey?: GlossaryTermLink;
  guides: GlossaryTermLink[];
  tool?: GlossaryTermLink;
}

interface GlossaryTermViewProps {
  term: GlossaryTerm;
  region: Region;
  relatedTerms: GlossaryTermLink[];
  nextLinks: GlossaryNextLinks;
}

export function GlossaryTermView({ term, region, relatedTerms, nextLinks }: GlossaryTermViewProps) {
  const [simpleOpen, setSimpleOpen] = useState(false);
  const locale = region === 'US' ? term.localeVariants.us : term.localeVariants.uk;
  const regionKey = getRegionKey(region);
  const citations = [...term.citationsByRegion.global, ...(region === 'US' ? term.citationsByRegion.us : term.citationsByRegion.uk)];

  const simpleBullets = useMemo(() => {
    return [term.whyItMattersHere, ...locale.examples].filter(Boolean).slice(0, 4);
  }, [term.whyItMattersHere, locale.examples]);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{locale.spelling}</h1>
        <p className="text-base text-slate-600 max-w-3xl">{term.plainEnglishDefinition}</p>
        <button
          type="button"
          onClick={() => setSimpleOpen(prev => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
        >
          {simpleOpen ? 'Hide simple version' : 'Show simple version'}
        </button>
        {simpleOpen && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p>{term.plainEnglishDefinition}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {simpleBullets.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Definition</h2>
        <p className="text-sm text-slate-700 leading-relaxed">{term.extendedDefinition}</p>
      </section>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Why it matters here</h2>
        <p className="mt-2 text-sm text-slate-700">{term.whyItMattersHere}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">In NeuroBreath you can use this term for…</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {nextLinks.journey && (
            <Link
              href={nextLinks.journey.href}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm hover:border-indigo-300"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">Starter journey</p>
              <p className="text-base font-semibold text-slate-900">{nextLinks.journey.label}</p>
            </Link>
          )}
          {nextLinks.tool && (
            <Link
              href={nextLinks.tool.href}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm hover:border-indigo-300"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">Tool</p>
              <p className="text-base font-semibold text-slate-900">{nextLinks.tool.label}</p>
            </Link>
          )}
        </div>
        {nextLinks.guides.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {nextLinks.guides.map(guide => (
              <Link
                key={guide.id}
                href={guide.href}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm hover:border-indigo-300"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">Guide</p>
                <p className="text-base font-semibold text-slate-900">{guide.label}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Common misunderstandings</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
          {term.commonMisunderstandings.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {relatedTerms.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Related terms</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTerms.map(related => (
              <Link
                key={related.id}
                href={related.href}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-300"
              >
                {related.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Citations & review</h2>
        <p className="text-xs text-slate-500">Educational only. External links are provided as copy‑only references.</p>
        <CitationList sources={citations} title="Citations" />
        <LastReviewedBadge reviewedAt={term.reviewedAt} reviewIntervalDays={term.reviewIntervalDays} region={region} />
        <div className="text-xs text-slate-500">
          <Link href={`/${regionKey}/trust/evidence-policy`} className="text-indigo-600 hover:underline">
            Evidence policy
          </Link>
          <span className="mx-2">·</span>
          <Link href={`/${regionKey}/trust/disclaimer`} className="text-indigo-600 hover:underline">
            Disclaimer
          </Link>
        </div>
      </section>
    </div>
  );
}
