export const nextReviewDate = (reviewedAt: string, intervalDays: number) => {
  const reviewedDate = new Date(reviewedAt);
  const nextReview = new Date(reviewedDate);
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview;
};

export const isReviewDue = (reviewedAt: string, intervalDays: number, now: Date = new Date()) => {
  const nextReview = nextReviewDate(reviewedAt, intervalDays);
  return now >= nextReview;
};
