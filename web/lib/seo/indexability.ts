import { getIndexingDecision } from './indexing-policy';

export const EXCLUDED_PREFIXES = [
  '/api',
  '/admin',
  '/login',
  '/_next',
  '/parent',
  '/teacher',
  '/progress',
  '/send-report',
];

export const CRITICAL_ALLOWLIST = new Set([
  '/uk',
  '/us',
  '/uk/trust',
  '/us/trust',
  '/uk/printables',
  '/us/printables',
  '/uk/journeys',
  '/us/journeys',
  '/uk/guides',
  '/us/guides',
  '/uk/help-me-choose',
  '/us/help-me-choose',
  '/uk/glossary',
  '/us/glossary',
]);

export function isExcludedByPrefix(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isIndexableRoute(pathname: string): boolean {
  if (isExcludedByPrefix(pathname)) return false;
  return getIndexingDecision(pathname).index;
}

export function isSitemapAllowed(pathname: string): boolean {
  if (isExcludedByPrefix(pathname)) return false;
  return getIndexingDecision(pathname).includeInSitemap;
}
