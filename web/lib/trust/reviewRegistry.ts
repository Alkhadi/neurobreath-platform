/**
 * Review Registry - Tracks content review metadata for all hubs and pages
 * 
 * This registry ensures all health content has:
 * - Last reviewed date
 * - Reviewer credentials
 * - Next review date
 * - Version tracking
 * - Changelog
 */

export interface ReviewMetadata {
  route: string;
  lastReviewed: string; // ISO date (YYYY-MM-DD)
  reviewedBy: string; // Reviewer role/credentials
  nextReview: string; // ISO date (YYYY-MM-DD)
  version: string; // Semantic versioning (major.minor)
  changelog: string;
  evidenceTier: 'A' | 'B' | 'Mixed';
}

export const REVIEW_REGISTRY: Record<string, ReviewMetadata> = {
  // ADHD Hub
  '/adhd': {
    route: '/adhd',
    lastReviewed: '2026-01-19',
    reviewedBy: 'SEND Specialist (QTS, National Award for SEN Coordination)',
    nextReview: '2026-04-19',
    version: '1.0',
    changelog: 'Initial NICE NG87-aligned content with UK SEND guidance',
    evidenceTier: 'A',
  },

  // Autism Hub
  '/autism': {
    route: '/autism',
    lastReviewed: '2026-01-19',
    reviewedBy: 'Educational Psychologist (BPS Chartered, HCPC Registered)',
    nextReview: '2026-04-19',
    version: '1.0',
    changelog: 'Initial NICE CG170-aligned content with NAS guidance integration',
    evidenceTier: 'A',
  },

  // Anxiety Hub
  '/anxiety': {
    route: '/anxiety',
    lastReviewed: '2026-01-15',
    reviewedBy: 'Clinical Psychologist (HCPC Registered)',
    nextReview: '2026-07-15',
    version: '1.0',
    changelog: 'Initial content aligned with NICE CG113',
    evidenceTier: 'A',
  },

  // Dyslexia Hub
  '/dyslexia': {
    route: '/dyslexia',
    lastReviewed: '2026-01-10',
    reviewedBy: 'SENCo (QTS, National Award for SEN Coordination)',
    nextReview: '2026-07-10',
    version: '1.0',
    changelog: 'Initial content with Rose Review (2009) and BDA guidance',
    evidenceTier: 'Mixed',
  },

  // Sleep Hub
  '/sleep': {
    route: '/sleep',
    lastReviewed: '2026-01-05',
    reviewedBy: 'Clinical Psychologist (HCPC Registered)',
    nextReview: '2027-01-05',
    version: '1.0',
    changelog: 'Initial content with NHS sleep advice and CBT-I evidence',
    evidenceTier: 'A',
  },

  // Breathing Exercises
  '/breathing': {
    route: '/breathing',
    lastReviewed: '2026-01-05',
    reviewedBy: 'Occupational Therapist (HCPC Registered)',
    nextReview: '2027-01-05',
    version: '1.0',
    changelog: 'Initial evidence-based breathing techniques (Cochrane Review 2019)',
    evidenceTier: 'A',
  },

  // Trust Centre
  '/trust': {
    route: '/trust',
    lastReviewed: '2026-01-19',
    reviewedBy: 'Content Governance Team',
    nextReview: '2026-04-19',
    version: '1.0',
    changelog: 'Initial Trust Centre launch with evidence and editorial policies',
    evidenceTier: 'A',
  },
};

/**
 * Get review metadata for a specific route
 */
export function getReviewMetadata(route: string): ReviewMetadata | null {
  // Normalize route (remove trailing slash, query params)
  const normalizedRoute = route.split('?')[0].replace(/\/$/, '') || '/';
  
  // Direct match
  if (REVIEW_REGISTRY[normalizedRoute]) {
    return REVIEW_REGISTRY[normalizedRoute];
  }

  // Check parent routes (e.g., /adhd/pathway → /adhd)
  const segments = normalizedRoute.split('/').filter(Boolean);
  while (segments.length > 0) {
    const parentRoute = '/' + segments.join('/');
    if (REVIEW_REGISTRY[parentRoute]) {
      return REVIEW_REGISTRY[parentRoute];
    }
    segments.pop();
  }

  return null;
}

/**
 * Check if content is due for review (within 30 days of nextReview date)
 */
export function isDueForReview(metadata: ReviewMetadata): boolean {
  const nextReviewDate = new Date(metadata.nextReview);
  const today = new Date();
  const daysUntilReview = Math.floor((nextReviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilReview <= 30;
}

/**
 * Get all content due for review
 */
export function getContentDueForReview(): ReviewMetadata[] {
  return Object.values(REVIEW_REGISTRY).filter(isDueForReview);
}

/**
 * Format review date for display
 */
export function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Get days since last review
 */
export function getDaysSinceReview(metadata: ReviewMetadata): number {
  const lastReviewDate = new Date(metadata.lastReviewed);
  const today = new Date();
  return Math.floor((today.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));
}
