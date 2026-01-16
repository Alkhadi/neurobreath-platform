/**
 * Dynamic Robots.txt Generation
 * 
 * Generates robots.txt with proper rules for search engine crawlers
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/site-seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.canonicalBase;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/parent/',
          '/teacher/dashboard',
          '/progress/',
          '/send-report/',
          '/_next/',
          '/static/',
        ],
      },
      // Allow Google to crawl everything except private areas
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/parent/',
          '/teacher/dashboard',
          '/progress/',
          '/send-report/',
        ],
      },
      // Allow Bingbot similar access
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/parent/',
          '/teacher/dashboard',
          '/progress/',
          '/send-report/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
