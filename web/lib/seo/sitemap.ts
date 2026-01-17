import { SITE_URL, LOCALES, type LocaleKey } from './site-config';
import { isSitemapAllowed } from './indexability';
import { loadRouteInventory, expandRoutePattern } from './route-registry';
import { resolveLastmod } from './lastmod';

export interface SitemapUrlEntry {
  url: string;
  lastModified?: string;
}

const SORTER = new Intl.Collator('en', { sensitivity: 'base' });

const LOCALIZED_PREFIXES = ['/', '/trust', '/guides', '/help-me-choose', '/glossary', '/printables', '/journeys', '/about', '/editorial'];

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(uk|us)(?=\/|$)/, '') || '/';
}

function isLocalizedRoute(pathname: string): boolean {
  const cleaned = stripLocale(pathname);
  return LOCALIZED_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`));
}

function withLocale(pathname: string, locale: LocaleKey): string {
  const cleaned = stripLocale(pathname);
  if (cleaned === '/') return `/${locale}`;
  return `/${locale}${cleaned}`;
}

export async function buildLocaleSitemap(locale: LocaleKey) {
  const { routes, missingFixtures } = await loadRouteInventory();
  const indexableRoutes = routes.flatMap(route => {
    if (!route.isDynamic) return [{ path: route.url, filePath: route.filePath }];
    return expandRoutePattern(route.pattern).map(pathname => ({ path: pathname, filePath: route.filePath }));
  });

  const entries: SitemapUrlEntry[] = [];

  for (const route of indexableRoutes) {
    const cleaned = stripLocale(route.path);
    if (!isSitemapAllowed(cleaned)) continue;

    const localePath = isLocalizedRoute(cleaned) ? withLocale(cleaned, locale) : cleaned;
    const lastModified = await resolveLastmod(cleaned, route.filePath);

    entries.push({
      url: `${SITE_URL}${localePath}`,
      ...(lastModified ? { lastModified } : {}),
    });
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
