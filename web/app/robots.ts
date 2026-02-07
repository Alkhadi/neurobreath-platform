/**
 * Dynamic Robots.txt Generation
 * 
 * Generates robots.txt with proper rules for search engine crawlers
 */

import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

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
          '/settings',
          '/my-plan',
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
          '/settings',
          '/my-plan',
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
          '/settings',
          '/my-plan',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
