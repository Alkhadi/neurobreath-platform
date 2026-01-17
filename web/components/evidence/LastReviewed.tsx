import { format } from 'date-fns';

interface LastReviewedProps {
  reviewedAt: string;
  reviewIntervalDays: number;
}

export function LastReviewed({ reviewedAt, reviewIntervalDays }: LastReviewedProps) {
  const reviewedDate = new Date(reviewedAt);
  const nextReview = new Date(reviewedDate);
  nextReview.setDate(nextReview.getDate() + reviewIntervalDays);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-700">Last reviewed:</span>
        <span>{format(reviewedDate, 'dd MMM yyyy')}</span>
        <span className="text-slate-400">•</span>
        <span className="font-semibold text-slate-700">Next review due:</span>
        <span>{format(nextReview, 'dd MMM yyyy')}</span>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        We review evidence regularly to keep guidance current and appropriate for educational use.
      </p>
    </section>
  );
}
