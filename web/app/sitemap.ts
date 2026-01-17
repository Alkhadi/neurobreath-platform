import { MetadataRoute } from 'next';
import { buildSitemapIndex } from '@/lib/seo/sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = buildSitemapIndex();
  return entries.map(entry => ({
    url: entry.url,
    lastModified: entry.lastModified,
  }));
}
