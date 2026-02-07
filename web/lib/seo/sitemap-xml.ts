import type { SitemapUrlEntry } from './sitemap';

export function renderSitemapXml(entries: SitemapUrlEntry[]) {
  const urls = entries
    .map(entry => {
      const lastmod = entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : '';
      return `<url><loc>${entry.url}</loc>${lastmod}</url>`;
    })
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
}

export function renderSitemapIndexXml(entries: SitemapUrlEntry[]) {
  const maps = entries
    .map(entry => {
      const lastmod = entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : '';
      return `<sitemap><loc>${entry.url}</loc>${lastmod}</sitemap>`;
    })
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${maps}\n` +
    `</sitemapindex>\n`
  );
}
