/**
 * Route Fixtures
 *
 * Provides concrete example URLs for dynamic routes.
 * Each key must match the pattern from route-registry output.
 */

import { SEO_GUIDES } from '@/content/seo-guides';
import { listClusterParams, listPillarKeys } from '@/lib/content/content-seo-map';
import { canonicalPages } from '@/lib/content/pages';
import { GLOSSARY_TERMS } from '@/lib/glossary/glossary';

const regionKeys = ['uk', 'us'] as const;

const guideSlugs = SEO_GUIDES.map(guide => guide.slug);
const pillarKeys = listPillarKeys();
const clusterParams = listClusterParams();
const canonicalGuideSlugs = canonicalPages.flatMap(page => [page.slugs.UK, page.slugs.US]);
const glossaryTermIds = GLOSSARY_TERMS.map(term => term.id);

export const routeFixtures: Record<string, string[]> = {
  "/parent/:parentCode": [
    "/parent/demo-parent-123",
    "/parent/test-parent",
  ],
  "/guides/seo/:slug": guideSlugs.map(slug => `/guides/seo/${slug}`),
  "/guides/:pillar": pillarKeys.map(pillar => `/guides/${pillar}`),
  "/guides/:pillar/:slug": clusterParams.map(param => `/guides/${param.pillar}/${param.slug}`),
  "/:region/guides": regionKeys.map(region => `/${region}/guides`),
  "/:region/guides/:slug": regionKeys.flatMap(region => canonicalGuideSlugs.map(slug => `/${region}/guides/${slug}`)),
  "/:region/help-me-choose": regionKeys.map(region => `/${region}/help-me-choose`),
  "/:region/help-me-choose/results": regionKeys.map(region => `/${region}/help-me-choose/results`),
  "/:region/glossary": regionKeys.map(region => `/${region}/glossary`),
  "/:region/glossary/:term": regionKeys.flatMap(region => glossaryTermIds.map(term => `/${region}/glossary/${term}`)),
  "/:region/trust": regionKeys.map(region => `/${region}/trust`),
  "/:region/trust/:slug": regionKeys.flatMap(region => [
    `/${region}/trust/disclaimer`,
    `/${region}/trust/evidence-policy`,
    `/${region}/trust/safeguarding`,
    `/${region}/trust/accessibility`,
    `/${region}/trust/privacy`,
    `/${region}/trust/terms`,
    `/${region}/trust/contact`,
  ]),
  "/:region": regionKeys.map(region => `/${region}`),
};

/**
 * Get all concrete URLs for a given route pattern
 */
export function getFixtures(pattern: string): string[] {
  return routeFixtures[pattern] || [];
}

/**
 * Check if a pattern has fixtures defined
 */
export function hasFixtures(pattern: string): boolean {
  const fixtures = routeFixtures[pattern];
  return fixtures !== undefined && fixtures.length > 0;
}

/**
 * Get all patterns that need fixtures
 */
export function getMissingFixtures(patterns: string[]): string[] {
  return patterns.filter(pattern => !hasFixtures(pattern));
}
