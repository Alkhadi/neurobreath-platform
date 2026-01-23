import { SITE_URL, LOCALES, type LocaleKey } from './site-config';
import { isSitemapAllowed } from './indexability';
import { loadRouteInventory, expandRoutePattern } from './route-registry';
import { resolveLastmod } from './lastmod';

export interface SitemapUrlEntry {
  url: string;
  lastModified?: string;
}

const SORTER = new Intl.Collator('en', { sensitivity: 'base' });

const normalisePath = (pathname: string): string => {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeadingSlash !== '/' && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.replace(/\/+$/, '');
  }
  return withLeadingSlash;
};

const GLOBAL_EXCLUDED_PATHS = new Set([
  '/trust/editorial-policy',
  '/trust/sources',
]);

function isGlobalExcluded(path: string): boolean {
  const cleaned = stripLocale(path);
  return GLOBAL_EXCLUDED_PATHS.has(cleaned);
}

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(uk|us)(?=\/|$)/, '') || '/';
}

function withLocale(pathname: string, locale: LocaleKey): string {
  const cleaned = stripLocale(pathname);
  if (cleaned === '/') return `/${locale}`;
  return `/${locale}${cleaned}`;
}

export async function buildLocaleSitemap(locale: LocaleKey) {
  const { routes, missingFixtures } = await loadRouteInventory();
  const indexableRoutes = routes.flatMap(route => {
    const paths = route.isDynamic ? expandRoutePattern(route.pattern) : [route.url];
    return paths.map(pathname => ({
      path: normalisePath(pathname),
      filePath: route.filePath,
      hasRegionParam: route.pattern.includes(':region'),
      pattern: route.pattern,
    }));
  });

  const entries: SitemapUrlEntry[] = [];
  const seen = new Set<string>();

  for (const route of indexableRoutes) {
    const cleaned = stripLocale(route.path);
    if (cleaned.includes(':')) continue;
    if (isGlobalExcluded(cleaned)) continue;

    const targetPath = route.hasRegionParam ? withLocale(cleaned, locale) : cleaned;
    if (!isSitemapAllowed(targetPath)) continue;
    if (seen.has(targetPath)) continue;

    const lastModified = await resolveLastmod(cleaned, route.filePath);

    entries.push({
      url: `${SITE_URL}${targetPath}`,
      ...(lastModified ? { lastModified } : {}),
    });

    seen.add(targetPath);
  }

  entries.sort((a, b) => SORTER.compare(a.url, b.url));

  if (missingFixtures.length) {
    console.warn(`Missing route fixtures for patterns: ${missingFixtures.join(', ')}`);
  }

  return { entries, missingFixtures };
}

export function buildSitemapIndex(): SitemapUrlEntry[] {
  return LOCALES.map(locale => ({
    url: `${SITE_URL}/sitemap-${locale}.xml`,
    lastModified: new Date().toISOString(),
  }));
}
