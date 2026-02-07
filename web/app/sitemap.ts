import { MetadataRoute } from 'next';
import { buildLocaleSitemap } from '@/lib/seo/sitemap';
import { LOCALES } from '@/lib/seo/site-config';

type SitemapItem = MetadataRoute.Sitemap[number];

function newerLastModified(a?: string | Date, b?: string | Date): string | Date | undefined {
  if (!a) return b;
  if (!b) return a;

  const aTime = typeof a === 'string' ? Date.parse(a) : a.getTime();
  const bTime = typeof b === 'string' ? Date.parse(b) : b.getTime();

  return bTime > aTime ? b : a;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localeResults = await Promise.all(LOCALES.map(locale => buildLocaleSitemap(locale)));

  const byUrl = new Map<string, SitemapItem>();
  for (const result of localeResults) {
    for (const entry of result.entries) {
      const existing = byUrl.get(entry.url);
      if (!existing) {
        byUrl.set(entry.url, {
          url: entry.url,
          ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
        });
        continue;
      }

      const lastModified = newerLastModified(existing.lastModified, entry.lastModified);
      byUrl.set(entry.url, {
        ...existing,
        ...(lastModified ? { lastModified } : {}),
      });
    }
  }

  return Array.from(byUrl.values());
}
