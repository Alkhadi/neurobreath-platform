import Link from 'next/link';
import { format } from 'date-fns';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { isReviewDue, nextReviewDate } from '@/lib/review/review';

interface LastReviewedBadgeProps {
  reviewedAt: string;
  reviewIntervalDays: number;
  region?: Region;
}

export function LastReviewedBadge({ reviewedAt, reviewIntervalDays, region }: LastReviewedBadgeProps) {
  const reviewedDate = new Date(reviewedAt);
  const nextReview = nextReviewDate(reviewedAt, reviewIntervalDays);
  const now = new Date();
  const daysUntilReview = Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const showReviewDue = isReviewDue(reviewedAt, reviewIntervalDays, now) || daysUntilReview <= 30;
  const trustHref = region ? `/${getRegionKey(region)}/trust/last-reviewed` : '/trust/last-reviewed';

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-700">Last reviewed:</span>
        <span>{format(reviewedDate, 'dd MMM yyyy')}</span>
        {showReviewDue ? (
          <>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700">Review due:</span>
            <span>{format(nextReview, 'dd MMM yyyy')}</span>
          </>
        ) : null}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Content freshness is tracked across the platform.{' '}
        <Link href={trustHref} className="text-indigo-600 hover:underline">
          Learn how reviews work
        </Link>
        .
      </p>
    </section>
  );
}
