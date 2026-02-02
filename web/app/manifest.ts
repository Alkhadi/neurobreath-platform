/**
 * Web App Manifest Generation
 * 
 * Generates manifest.json for PWA capabilities and app icons
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seo/site-seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.siteName,
    short_name: SITE_CONFIG.siteName,
    description: SITE_CONFIG.brandDescription,
    start_url: '/uk',
    display: 'standalone',
    background_color: '#1a0033',
    theme_color: SITE_CONFIG.themeColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/neurobreath/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/neurobreath/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/neurobreath/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/neurobreath/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/neurobreath/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: [
      'health',
      'education',
      'lifestyle',
      'medical',
      'productivity',
    ],
    lang: SITE_CONFIG.language,
    dir: 'ltr',
    scope: '/',
  };
}
