import { buildSitemapIndex } from '@/lib/seo/sitemap';
import { renderSitemapIndexXml } from '@/lib/seo/sitemap-xml';

export async function GET() {
  const entries = buildSitemapIndex();
  const body = renderSitemapIndexXml(entries);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
