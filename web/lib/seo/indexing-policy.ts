export type PageType =
  | 'pillar'
  | 'guide'
  | 'trust'
  | 'tool'
  | 'blog'
  | 'utility'
  | 'other';

export interface IndexingDecision {
  path: string;
  pageType: PageType;
  index: boolean;
  includeInSitemap: boolean;
  reason: string;
}

const INDEXABLE_PILLARS = new Set([
  '/',
  '/conditions',
  '/adhd',
  '/autism',
  '/anxiety',
  '/dyslexia-reading-training',
  '/sleep',
  '/stress',
  '/breathing',
]);

const INDEXABLE_INFO = new Set([
  '/about',
  '/about-us',
  '/contact',
  '/resources',
  '/get-started',
  '/schools',
  '/support-us',
  '/teacher-quick-pack',
]);

const INDEXABLE_TRUST_PREFIXES = ['/trust'];

const INDEXABLE_GUIDE_PREFIXES = ['/guides'];

const INDEXABLE_HELP_PREFIXES = ['/help-me-choose'];

const INDEXABLE_PRINTABLES_PREFIXES = ['/printables'];

const INDEXABLE_JOURNEYS_PREFIXES = ['/journeys'];

const INDEXABLE_GLOSSARY_PREFIXES = ['/glossary'];

const INDEXABLE_TOOL_ALLOWLIST = new Set([
  '/tools',
  '/tools/adhd-tools',
  '/tools/autism-tools',
  '/tools/anxiety-tools',
  '/tools/depression-tools',
  '/tools/sleep-tools',
  '/tools/stress-tools',
  '/tools/breath-tools',
  '/breathing',
  '/breathing/breath',
  '/breathing/focus',
  '/breathing/mindfulness',
  '/breathing/techniques/sos-60',
  '/breathing/training/focus-garden',
  '/techniques/4-7-8',
  '/techniques/box-breathing',
  '/techniques/coherent',
  '/techniques/sos',
]);

const UTILITY_PREFIXES = [
  '/api',
  '/parent',
  '/progress',
  '/send-report',
  '/teacher',
  '/login',
  '/_next',
  '/admin',
  '/auth',
  '/rewards',
  '/downloads',
];

const BLOG_PREFIXES = ['/blog'];

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(uk|us)(?=\/|$)/, '') || '/';
}

export function getIndexingDecision(pathname: string): IndexingDecision {
  const cleaned = stripLocale(pathname);

  if (cleaned.startsWith('/help-me-choose/results')) {
    return {
      path: cleaned,
      pageType: 'utility',
      index: false,
      includeInSitemap: false,
      reason: 'Results page is privacy-sensitive and thin content',
    };
  }

  if (UTILITY_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'utility',
      index: false,
      includeInSitemap: false,
      reason: 'Utility or authenticated route',
    };
  }

  if (INDEXABLE_TRUST_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'trust',
      index: true,
      includeInSitemap: true,
      reason: 'Trust centre content',
    };
  }

  if (INDEXABLE_PRINTABLES_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    if (cleaned.endsWith('/pdf')) {
      return {
        path: cleaned,
        pageType: 'utility',
        index: false,
        includeInSitemap: false,
        reason: 'Printable PDF downloads should not be indexed',
      };
    }
    return {
      path: cleaned,
      pageType: 'other',
      index: true,
      includeInSitemap: true,
      reason: 'Printable resources with explanatory content',
    };
  }

  if (INDEXABLE_JOURNEYS_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'other',
      index: true,
      includeInSitemap: true,
      reason: 'Starter journeys hub',
    };
  }

  if (INDEXABLE_HELP_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'other',
      index: true,
      includeInSitemap: true,
      reason: 'Help-me-choose wizard with explanatory content',
    };
  }

  if (INDEXABLE_GLOSSARY_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'other',
      index: true,
      includeInSitemap: true,
      reason: 'Glossary hub and term pages',
    };
  }

  if (INDEXABLE_GUIDE_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'guide',
      index: true,
      includeInSitemap: true,
      reason: 'Guide content',
    };
  }

  if (BLOG_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) {
    return {
      path: cleaned,
      pageType: 'blog',
      index: true,
      includeInSitemap: true,
      reason: 'Blog content',
    };
  }

  if (INDEXABLE_PILLARS.has(cleaned)) {
    return {
      path: cleaned,
      pageType: 'pillar',
      index: true,
      includeInSitemap: true,
      reason: 'Pillar hub content',
    };
  }

  if (INDEXABLE_INFO.has(cleaned)) {
    return {
      path: cleaned,
      pageType: 'other',
      index: true,
      includeInSitemap: true,
      reason: 'Core informational page',
    };
  }

  if (cleaned.startsWith('/tools') || cleaned.startsWith('/breathing') || cleaned.startsWith('/techniques')) {
    const isIndexable = INDEXABLE_TOOL_ALLOWLIST.has(cleaned);
    return {
      path: cleaned,
      pageType: 'tool',
      index: isIndexable,
      includeInSitemap: isIndexable,
      reason: isIndexable
        ? 'Tool hub or guide with sufficient context'
        : 'Tool page requires more explanatory content',
    };
  }

  return {
    path: cleaned,
    pageType: 'other',
    index: false,
    includeInSitemap: false,
    reason: 'Not in indexing policy allowlist',
  };
}

export function isIndexableByPolicy(pathname: string): boolean {
  return getIndexingDecision(pathname).index;
}

export function isSitemapEligible(pathname: string): boolean {
  return getIndexingDecision(pathname).includeInSitemap;
}
