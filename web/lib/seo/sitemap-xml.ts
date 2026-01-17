import type { SitemapUrlEntry } from './sitemap';

export function renderSitemapXml(entries: SitemapUrlEntry[]) {
  const urls = entries
    .map(entry => {
      const lastmod = entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : '';
      return `<url><loc>${entry.url}</loc>${lastmod}</url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function renderSitemapIndexXml(entries: SitemapUrlEntry[]) {
  const maps = entries
    .map(entry => {
      const lastmod = entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : '';
      return `<sitemap><loc>${entry.url}</loc>${lastmod}</sitemap>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${maps}</sitemapindex>`;
}
