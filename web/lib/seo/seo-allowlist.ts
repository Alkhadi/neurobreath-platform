/**
 * SEO Allowlist
 *
 * Use this list to allow known, justified exceptions in automated SEO checks.
 * Keep entries minimal and include a clear justification.
 */

export interface SeoAllowlistEntry {
  route: string;
  issue: 'multiple-h1' | 'missing-h1' | 'missing-canonical' | 'missing-og' | 'schema-error';
  justification: string;
}

export const SEO_ALLOWLIST: SeoAllowlistEntry[] = [
  // Example:
  // { route: '/legacy/example', issue: 'multiple-h1', justification: 'Legacy embedded content requires two H1s.' },
];
