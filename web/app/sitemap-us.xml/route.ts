import { buildLocaleSitemap } from '@/lib/seo/sitemap';
import { renderSitemapXml } from '@/lib/seo/sitemap-xml';

export async function GET() {
  const { entries } = await buildLocaleSitemap('us');
  const body = renderSitemapXml(entries);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
