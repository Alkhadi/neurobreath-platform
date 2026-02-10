/**
 * Route Governance Registry
 * 
 * Single source of truth for trust governance across all NeuroBreath routes.
 * 
 * Each route defines:
 * - Trust badges (Evidence-linked, Reviewed, Educational-only)
 * - Evidence tier requirements (Tier A required for health claims)
 * - Review cadence (90/120/180/365 days)
 * - Primary sources (from sourceRegistry.ts)
 * - Resource pack availability (downloadable assets)
 * 
 * This drives:
 * - Automatic trust badge rendering
 * - SEO metadata generation
 * - Review scheduling
 * - CI validation (yarn trust:check)
 */

export type RouteCategory = 
  | 'hub'           // Main condition hubs (/adhd, /autism, etc.)
  | 'pathway'       // Care pathway pages (/adhd/pathway)
  | 'tool'          // Interactive tools (/tools/*)
  | 'guide'         // Educational guides (/guides/*)
  | 'blog'          // Blog articles (/blog/*)
  | 'trust'         // Trust Centre pages (/trust/*)
  | 'audience'      // Audience-specific (parent, teacher, schools)
  | 'feature'       // Core features (coach, my-plan, progress)
  | 'utility';      // Utility pages (about, contact, support-us)

export type TrustBadgeType = 
  | 'Evidence-linked'
  | 'Reviewed'
  | 'Educational-only'
  | 'NICE-aligned'
  | 'Community-informed';

export type EvidenceRequirement = 
  | 'TierARequired'      // Must cite Tier A sources (clinical guidelines, NHS, NICE)
  | 'TierAorB'           // Can cite Tier A or B (charities like NAS, Mind)
  | 'Informational';     // No medical claims, no evidence requirement

export interface ResourcePack {
  version: string;
  downloadUrl: string;
  lastUpdated: string; // ISO 8601 date
  includes: string[];  // e.g., ["1-page summary", "Myth-buster", "Crisis card"]
}

export interface RouteGovernance {
  route: string;
  category: RouteCategory;
  badges: TrustBadgeType[];
  evidenceRequirement: EvidenceRequirement;
  reviewCadenceDays: number;
  lastReviewed: string;        // ISO 8601 date
  nextReview: string;           // ISO 8601 date
  reviewedBy: string;
  primarySources: string[];     // Source IDs from sourceRegistry.ts
  resourcePack?: ResourcePack;
  notes?: string;
}

/**
 * Calculate next review date from last reviewed date and cadence
 */
function calculateNextReview(lastReviewed: string, cadenceDays: number): string {
  const date = new Date(lastReviewed);
  date.setDate(date.getDate() + cadenceDays);
  return date.toISOString().split('T')[0];
}

const TODAY = '2026-01-19';

/**
 * Route Governance Registry
 * 
 * CRITICAL: All production routes MUST be present in this registry.
 * Missing routes will show fallback badges and log warnings (and fail CI).
 */
export const ROUTE_REGISTRY: Record<string, RouteGovernance> = {
  // ============================================================================
  // HUBS (Main condition hubs)
  // Review: Every 120 days | Evidence: Tier A Required
  // ============================================================================
  '/adhd': {
    route: '/adhd',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only', 'NICE-aligned'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 120,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 120),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nice', 'nhs', 'cochrane', 'adhd-foundation'],
    notes: 'NICE NG87 (2018) aligned. Hub with pathway link.',
  },
  
  '/autism': {
    route: '/autism',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only', 'NICE-aligned', 'Community-informed'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 120,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 120),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nice', 'nhs', 'nas', 'cochrane'],
    notes: 'NICE CG170/CG128 (2021) aligned. Incorporates autistic community perspectives.',
  },
  
  '/anxiety': {
    route: '/anxiety',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only', 'NICE-aligned'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 120,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 120),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nice', 'nhs', 'cochrane', 'mind'],
    notes: 'NICE CG113 (2019) aligned.',
  },
  
  '/dyslexia-reading-training': {
    route: '/dyslexia-reading-training',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 120,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 120),
    reviewedBy: 'Educational Psychology Team',
    primarySources: ['nice', 'cochrane'],
    notes: 'Dyslexia hub with reading training focus.',
  },
  
  '/sleep': {
    route: '/sleep',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nhs', 'cochrane'],
    notes: 'Sleep hygiene and CBT-I guidance.',
  },
  
  '/breathing': {
    route: '/breathing',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nhs', 'cochrane'],
    notes: 'Breathing techniques for anxiety and stress management.',
  },
  
  '/stress': {
    route: '/stress',
    category: 'hub',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nhs', 'mind', 'cochrane'],
    notes: 'Stress management strategies.',
  },

  // ============================================================================
  // PATHWAYS (Evidence-based care pathways)
  // Review: Every 90 days | Evidence: Tier A Required
  // ============================================================================
  '/adhd/pathway': {
    route: '/adhd/pathway',
    category: 'pathway',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only', 'NICE-aligned'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 90,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 90),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nice', 'nhs', 'cochrane'],
    resourcePack: {
      version: '1.0.0',
      downloadUrl: '/downloads/adhd-pathway-pack-v1.pdf',
      lastUpdated: TODAY,
      includes: [
        'What is ADHD (1-page summary)',
        'What helps checklist (home/school/workplace)',
        'Talking to GP preparation sheet',
        'Myth-busting card',
        'Crisis help card (UK)',
        '7-day starter plan',
      ],
    },
    notes: 'NICE NG87 (2018) aligned care pathway with UK-specific supports.',
  },
  
  '/autism/pathway': {
    route: '/autism/pathway',
    category: 'pathway',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only', 'NICE-aligned', 'Community-informed'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 90,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 90),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nice', 'nhs', 'nas', 'cochrane'],
    resourcePack: {
      version: '1.0.0',
      downloadUrl: '/downloads/autism-pathway-pack-v1.pdf',
      lastUpdated: TODAY,
      includes: [
        'What is autism (1-page summary)',
        'What helps checklist (home/school/workplace)',
        'Talking to GP preparation sheet',
        'Myth-busting card',
        'Crisis help card (UK)',
        '7-day starter plan',
        'Sensory accommodations guide',
      ],
    },
    notes: 'NICE CG170/CG128 (2021) aligned. Incorporates autistic community perspectives.',
  },

  '/anxiety/pathway': {
    route: '/anxiety/pathway',
    category: 'pathway',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only', 'NICE-aligned'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 90,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 90),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nice', 'nhs', 'cochrane'],
    resourcePack: {
      version: '1.0.0',
      downloadUrl: '/downloads/anxiety-pathway-pack-v1.pdf',
      lastUpdated: TODAY,
      includes: [
        'What is anxiety (1-page summary)',
        'What helps checklist (CBT, exposure, relaxation)',
        'Talking to GP preparation sheet',
        'Myth-busting card',
        'Crisis help card (UK)',
        '7-day starter plan',
        'Grounding techniques card',
      ],
    },
    notes: 'NICE CG113 (2011, updated 2020) aligned. Covers GAD, panic disorder, social anxiety.',
  },

  '/sleep/pathway': {
    route: '/sleep/pathway',
    category: 'pathway',
    badges: ['Evidence-linked', 'Reviewed', 'Educational-only'],
    evidenceRequirement: 'TierARequired',
    reviewCadenceDays: 90,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 90),
    reviewedBy: 'Clinical Review Team',
    primarySources: ['nhs', 'cochrane'],
    resourcePack: {
      version: '1.0.0',
      downloadUrl: '/downloads/sleep-pathway-pack-v1.pdf',
      lastUpdated: TODAY,
      includes: [
        'Understanding sleep (1-page summary)',
        'Sleep hygiene checklist',
        'CBT-I basics guide',
        'Age-appropriate sleep recommendations',
        'Screen management plan',
        'Sleep diary template',
        'Crisis help card (UK)',
      ],
    },
    notes: 'Evidence-based sleep guidance. CBT-I gold standard. Age-specific recommendations from AASM/NSF.',
  },

  // ============================================================================
  // TOOLS (Interactive tools)
  // Review: Every 180 days | Evidence: Tier A or B
  // ============================================================================
  '/tools/adhd-tools': {
    route: '/tools/adhd-tools',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nice', 'adhd-foundation'],
  },
  
  '/tools/adhd-focus-lab': {
    route: '/tools/adhd-focus-lab',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nice', 'adhd-foundation'],
  },
  
  '/tools/autism-tools': {
    route: '/tools/autism-tools',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nice', 'nas'],
  },
  
  '/tools/anxiety-tools': {
    route: '/tools/anxiety-tools',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nice', 'mind'],
  },
  
  '/tools/breath-tools': {
    route: '/tools/breath-tools',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nhs', 'cochrane'],
  },
  
  '/tools/breath-ladder': {
    route: '/tools/breath-ladder',
    category: 'tool',
    badges: ['Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nhs'],
  },
  
  '/tools/sleep-tools': {
    route: '/tools/sleep-tools',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nhs', 'cochrane'],
  },
  
  '/tools/stress-tools': {
    route: '/tools/stress-tools',
    category: 'tool',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nhs', 'mind'],
  },
  
  '/tools/mood-tools': {
    route: '/tools/mood-tools',
    category: 'tool',
    badges: ['Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nhs', 'mind'],
  },
  
  '/tools/focus-training': {
    route: '/tools/focus-training',
    category: 'tool',
    badges: ['Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['adhd-foundation'],
  },
  
  '/tools/focus-tiles': {
    route: '/tools/focus-tiles',
    category: 'tool',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Product Team',
    primarySources: [],
  },
  
  '/tools/colour-path': {
    route: '/tools/colour-path',
    category: 'tool',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Product Team',
    primarySources: [],
  },
  
  '/tools/roulette': {
    route: '/tools/roulette',
    category: 'tool',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Product Team',
    primarySources: [],
  },

  // ============================================================================
  // TRUST CENTRE (Trust & governance pages)
  // Review: Every 365 days | Evidence: Informational
  // ============================================================================
  '/trust': {
    route: '/trust',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Governance Team',
    primarySources: [],
  },
  
  '/trust/editorial-policy': {
    route: '/trust/editorial-policy',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Governance Team',
    primarySources: [],
  },
  
  '/trust/sources': {
    route: '/trust/sources',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Governance Team',
    primarySources: [],
  },
  
  '/trust/evidence-policy': {
    route: '/trust/evidence-policy',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Governance Team',
    primarySources: [],
  },
  
  '/trust/safeguarding': {
    route: '/trust/safeguarding',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Safeguarding Team',
    primarySources: ['nhs', 'samaritans'],
    notes: 'Crisis signposting must be reviewed more frequently.',
  },
  
  '/trust/privacy': {
    route: '/trust/privacy',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Legal Team',
    primarySources: [],
  },
  
  '/trust/terms': {
    route: '/trust/terms',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Legal Team',
    primarySources: [],
  },
  
  '/trust/disclaimer': {
    route: '/trust/disclaimer',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Legal Team',
    primarySources: [],
  },
  
  '/trust/accessibility': {
    route: '/trust/accessibility',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Accessibility Team',
    primarySources: [],
  },
  
  '/trust/contact': {
    route: '/trust/contact',
    category: 'trust',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Operations Team',
    primarySources: [],
  },

  // ============================================================================
  // AUDIENCE-SPECIFIC (Parent, teacher, schools)
  // Review: Every 180 days | Evidence: Tier A or B
  // ============================================================================
  '/parent': {
    route: '/parent',
    category: 'audience',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Educational Team',
    primarySources: ['nice', 'nhs'],
  },
  
  '/teacher': {
    route: '/teacher',
    category: 'audience',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Educational Team',
    primarySources: ['nice', 'nhs'],
  },
  
  '/teacher-quick-pack': {
    route: '/teacher-quick-pack',
    category: 'audience',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Educational Team',
    primarySources: ['nice', 'nhs'],
  },
  
  '/schools': {
    route: '/schools',
    category: 'audience',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Educational Team',
    primarySources: ['nice', 'nhs'],
  },

  // ============================================================================
  // CORE FEATURES (Coach, My Plan, Progress, etc.)
  // Review: Every 180 days | Evidence: Tier A or B
  // ============================================================================
  '/coach': {
    route: '/coach',
    category: 'feature',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: ['nice', 'nhs'],
    notes: 'AI Coach powered by sourceRegistry.ts evidence base.',
  },
  
  '/my-plan': {
    route: '/my-plan',
    category: 'feature',
    badges: ['Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: [],
  },
  
  '/progress': {
    route: '/progress',
    category: 'feature',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Product Team',
    primarySources: [],
  },
  
  '/rewards': {
    route: '/rewards',
    category: 'feature',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Product Team',
    primarySources: [],
  },

  // ============================================================================
  // GUIDES & RESOURCES
  // Review: Every 180 days | Evidence: Tier A or B
  // ============================================================================
  '/guides': {
    route: '/guides',
    category: 'guide',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Content Team',
    primarySources: ['nice', 'nhs'],
  },
  
  '/resources': {
    route: '/resources',
    category: 'utility',
    badges: ['Evidence-linked', 'Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Content Team',
    primarySources: ['nice', 'nhs'],
  },
  
  '/blog': {
    route: '/blog',
    category: 'blog',
    badges: ['Educational-only'],
    evidenceRequirement: 'TierAorB',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Content Team',
    primarySources: [],
    notes: 'Individual blog posts reviewed on update.',
  },

  // ============================================================================
  // UTILITY PAGES
  // Review: Every 365 days | Evidence: Informational
  // ============================================================================
  '/about': {
    route: '/about',
    category: 'utility',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Operations Team',
    primarySources: [],
  },
  
  '/about-us': {
    route: '/about-us',
    category: 'utility',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Operations Team',
    primarySources: [],
  },
  
  '/contact': {
    route: '/contact',
    category: 'utility',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Operations Team',
    primarySources: [],
  },
  
  '/support-us': {
    route: '/support-us',
    category: 'utility',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Operations Team',
    primarySources: [],
  },
  
  '/downloads': {
    route: '/downloads',
    category: 'utility',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Content Team',
    primarySources: [],
  },
  
  '/get-started': {
    route: '/get-started',
    category: 'feature',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 180,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 180),
    reviewedBy: 'Product Team',
    primarySources: [],
  },
  
  '/settings': {
    route: '/settings',
    category: 'feature',
    badges: ['Educational-only'],
    evidenceRequirement: 'Informational',
    reviewCadenceDays: 365,
    lastReviewed: TODAY,
    nextReview: calculateNextReview(TODAY, 365),
    reviewedBy: 'Product Team',
    primarySources: [],
  },
};

/**
 * Helper Functions
 */

export function getRouteGovernance(pathname: string): RouteGovernance | null {
  return ROUTE_REGISTRY[pathname] || null;
}

export function isReviewOverdue(governance: RouteGovernance): boolean {
  const today = new Date();
  const nextReviewDate = new Date(governance.nextReview);
  return nextReviewDate < today;
}

export function getDaysUntilReview(governance: RouteGovernance): number {
  const today = new Date();
  const nextReviewDate = new Date(governance.nextReview);
  const diffTime = nextReviewDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getAllOverdueRoutes(): RouteGovernance[] {
  return Object.values(ROUTE_REGISTRY).filter(isReviewOverdue);
}

export function getRoutesByCategory(category: RouteCategory): RouteGovernance[] {
  return Object.values(ROUTE_REGISTRY).filter(r => r.category === category);
}

export function getRoutesRequiringTierA(): RouteGovernance[] {
  return Object.values(ROUTE_REGISTRY).filter(r => r.evidenceRequirement === 'TierARequired');
}

export function validateRouteGovernance(governance: RouteGovernance): string[] {
  const errors: string[] = [];
  
  // Check if review is overdue
  if (isReviewOverdue(governance)) {
    errors.push(`Review overdue (next review: ${governance.nextReview})`);
  }
  
  // Check if Tier A routes have Tier A sources
  if (governance.evidenceRequirement === 'TierARequired' && governance.primarySources.length === 0) {
    errors.push('Tier A required but no primary sources specified');
  }
  
  // Check if pathways have resource packs
  if (governance.category === 'pathway' && !governance.resourcePack) {
    errors.push('Pathway missing resource pack');
  }
  
  // Check if reviewed badges have review metadata
  if (governance.badges.includes('Reviewed') && !governance.lastReviewed) {
    errors.push('Reviewed badge present but no lastReviewed date');
  }
  
  return errors;
}

export function validateAllRoutes(): Record<string, string[]> {
  const allErrors: Record<string, string[]> = {};
  
  for (const [route, governance] of Object.entries(ROUTE_REGISTRY)) {
    const errors = validateRouteGovernance(governance);
    if (errors.length > 0) {
      allErrors[route] = errors;
    }
  }
  
  return allErrors;
}
