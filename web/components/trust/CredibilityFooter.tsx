'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import type { PageEditorial } from '@/lib/editorial/pageEditorial';
import { nextReviewDate } from '@/lib/review/review';
import { getEditorialPersonById } from '@/lib/editorial/people';

interface CredibilityFooterProps {
  editorial?: PageEditorial | null;
  region?: Region;
  className?: string;
}

const COPY = {
  UK: {
    disclaimer: 'Educational information only — not medical advice.',
    evidenceLabel: 'Evidence & sources',
    updateHistoryLabel: 'Update history',
    lastReviewedLabel: 'Last reviewed',
    nextReviewLabel: 'Next review due',
    updatedLabel: 'Updated',
    rolesSummary:
      'Editorial roles: Author drafts content · Reviewer checks clarity and safety language · Evidence reviewer checks source quality · Accessibility reviewer checks readability.',
  },
  US: {
    disclaimer: 'Educational information only — not medical advice.',
    evidenceLabel: 'Evidence & sources',
    updateHistoryLabel: 'Update history',
    lastReviewedLabel: 'Last reviewed',
    nextReviewLabel: 'Next review due',
    updatedLabel: 'Updated',
    rolesSummary:
      'Editorial roles: Author drafts content · Reviewer checks clarity and safety language · Evidence reviewer checks source quality · Accessibility reviewer checks readability.',
  },
};

export function CredibilityFooter({ editorial, region, className }: CredibilityFooterProps) {
  if (!editorial) return null;

  const locale = region === 'US' ? 'US' : 'UK';
  const regionKey = region ? getRegionKey(region) : null;
  const trustBase = regionKey ? `/${regionKey}/trust` : '/trust';
  const editorialBase = regionKey ? `/${regionKey}/editorial` : '/editorial';

  const author = getEditorialPersonById(editorial.authorId);
  const reviewer = getEditorialPersonById(editorial.reviewerId);

  const reviewedDate = new Date(editorial.reviewedAt);
  const updatedDate = new Date(editorial.updatedAt);
  const nextReview = nextReviewDate(editorial.reviewedAt, editorial.reviewIntervalDays);

  const citationsSummary = editorial.citationsSummary
    ? `${editorial.citationsSummary.count} sources · tiers ${editorial.citationsSummary.sourceTiersPresent.join(', ')}`
    : 'Sources listed on this page';

  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className ?? ''}`.trim()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 text-sm text-slate-600">
          <div className="flex flex-wrap gap-2">
            <span className="font-semibold text-slate-700">Written by:</span>
            <span>{author?.displayName ?? 'NeuroBreath Editorial Team'}</span>
            {author?.roleTitle ? <span className="text-slate-400">·</span> : null}
            {author?.roleTitle ? <span>{author.roleTitle}</span> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="font-semibold text-slate-700">Reviewed by:</span>
            <span>{reviewer?.displayName ?? 'NeuroBreath Editorial Team'}</span>
            {reviewer?.roleTitle ? <span className="text-slate-400">·</span> : null}
            {reviewer?.roleTitle ? <span>{reviewer.roleTitle}</span> : null}
          </div>
          <div className="text-xs text-slate-500">
            {COPY[locale].rolesSummary}{' '}
            <Link href={`${editorialBase}`} className="text-indigo-600 hover:underline">
              Meet the editorial team
            </Link>
            .
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{COPY[locale].lastReviewedLabel}</p>
            <p className="font-semibold text-slate-800">{format(reviewedDate, 'dd MMM yyyy')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{COPY[locale].nextReviewLabel}</p>
            <p className="font-semibold text-slate-800">{format(nextReview, 'dd MMM yyyy')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{COPY[locale].updatedLabel}</p>
            <p className="font-semibold text-slate-800">{format(updatedDate, 'dd MMM yyyy')}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-700">{COPY[locale].evidenceLabel}</p>
              <p className="text-xs text-slate-500">{citationsSummary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`${trustBase}/evidence-policy`}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
              >
                Evidence policy
              </Link>
              <Link
                href={`${trustBase}/citations`}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
              >
                Citations
              </Link>
              <Link
                href={`${trustBase}/last-reviewed`}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
              >
                Last reviewed
              </Link>
            </div>
          </div>
        </div>

        <details className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            {COPY[locale].updateHistoryLabel}
          </summary>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            {editorial.changeLog.map(entry => (
              <li key={`${entry.date}-${entry.summary}`} className="flex flex-wrap gap-2">
                <span className="font-semibold text-slate-700">{format(new Date(entry.date), 'dd MMM yyyy')}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                  {entry.type}
                </span>
                <span>{entry.summary}</span>
              </li>
            ))}
          </ul>
        </details>

        <p className="text-xs text-slate-500">
          {COPY[locale].disclaimer}{' '}
          <Link href={`${trustBase}/disclaimer`} className="text-indigo-600 hover:underline">
            Read the disclaimer
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
