/**
 * Central SEO Configuration for NeuroBreath Platform
 * 
 * This file contains all core SEO settings, metadata defaults, and structured data
 * configuration used across the entire site.
 */

import { Metadata } from 'next';
import { IS_PUBLIC_DEPLOYMENT, SITE_URL } from './site-config';

export const SITE_CONFIG = {
  // Core brand identity
  siteName: 'NeuroBreath',
  siteSlogan: 'Embrace Your Unique Mind',
  brandDescription: 'NeuroBreath provides evidence-based tools, resources, and support for neurodivergent individuals, including those with ADHD, autism, dyslexia, anxiety, and other conditions. Our platform offers breathing exercises, focus tools, educational resources, and professional support for children, young people, parents, teachers, and carers.',
  
  // Domain configuration
  canonicalBase: SITE_URL,
  
  // Default Open Graph image
  defaultOGImage: '/og-image.png',
  
  // Organisation information for structured data
  organisation: {
    name: 'NeuroBreath',
    legalName: 'NeuroBreath Ltd',
    url: 'https://neurobreath.co.uk',
    logo: 'https://neurobreath.co.uk/favicon.svg',
    description: 'Evidence-based neurodiversity support platform providing tools and resources for ADHD, autism, dyslexia, anxiety, and other conditions.',
    foundingDate: '2023',
    
    // Social media profiles
    sameAs: [
      'https://twitter.com/neurobreath',
      'https://www.facebook.com/neurobreath',
      'https://www.linkedin.com/company/neurobreath',
      'https://www.instagram.com/neurobreath',
    ],
    
    // Contact information
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@neurobreath.co.uk',
      availableLanguage: ['en-GB', 'en-US'],
    },
  },
  
  // Default metadata
  defaultTitle: 'NeuroBreath | Embrace Your Unique Mind',
  defaultDescription: 'Evidence-based tools and resources for ADHD, autism, dyslexia and anxiety, plus breathing and focus support for families, teachers and carers across the UK.',
  titleTemplate: '%s | NeuroBreath',
  
  // Keywords (UK English spelling)
  defaultKeywords: [
    'neurodiversity support',
    'ADHD tools',
    'autism resources',
    'dyslexia support',
    'anxiety management',
    'breathing exercises',
    'focus tools',
    'mental health',
    'educational resources',
    'SEND support',
    'UK neurodiversity',
  ] as string[],
  
  // Language and locale
  language: 'en-GB',
  locale: 'en_GB',
  alternateLocales: ['en_US', 'en'] as string[],
  
  // Twitter configuration
  twitter: {
    handle: '@neurobreath',
    site: '@neurobreath',
    cardType: 'summary_large_image' as const,
  },
  
  // Theme colour (Synthwave magenta)
  themeColor: '#ff00ff',
} as const;

/**
 * Route configuration for indexing
 * Determines which routes should be indexed by search engines
 */
export const ROUTE_CONFIG = {
  // Public indexable routes
  indexable: [
    '/',
    '/about',
    '/about-us',
    '/adhd',
    '/anxiety',
    '/autism',
    '/breathing',
    '/blog',
    '/coach',
    '/conditions',
    '/contact',
    '/downloads',
    '/dyslexia-reading-training',
    '/get-started',
    '/guides',
    '/resources',
    '/rewards',
    '/schools',
    '/sleep',
    '/stress',
    '/support-us',
    '/trust',
    '/trust/disclaimer',
    '/trust/evidence-policy',
    '/trust/safeguarding',
    '/trust/accessibility',
    '/trust/privacy',
    '/trust/terms',
    '/trust/contact',
    '/teacher-quick-pack',
    '/techniques',
    '/tools',
  ],
  
  // Routes that should not be indexed
  noindex: [
    '/api',
    '/parent',
    '/teacher/dashboard',
    '/progress',
    '/send-report',
  ],
} as const;

/**
 * Generate page title with template
 */
export function generatePageTitle(title?: string): string {
  if (!title) return SITE_CONFIG.defaultTitle;
  return title.includes('NeuroBreath') ? title : `${title} | NeuroBreath`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.canonicalBase}${cleanPath}`;
}

/**
 * Check if route should be indexed
 */
export function shouldIndexRoute(pathname: string): boolean {
  // Check if explicitly noindexed
  const isNoindex = ROUTE_CONFIG.noindex.some(route => 
    pathname.startsWith(route)
  );
  
  if (isNoindex) return false;
  
  // Check if indexable or starts with indexable route
  return ROUTE_CONFIG.indexable.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Generate robots meta tag
 */
export function generateRobotsMeta(pathname: string): string {
  return shouldIndexRoute(pathname) 
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, nofollow';
}

/**
 * Default metadata object for Next.js
 */
export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_CONFIG.canonicalBase),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: SITE_CONFIG.titleTemplate,
  },
  description: SITE_CONFIG.defaultDescription,
  keywords: SITE_CONFIG.defaultKeywords,
  authors: [{ name: SITE_CONFIG.organisation.name }],
  creator: SITE_CONFIG.organisation.name,
  publisher: SITE_CONFIG.organisation.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    alternateLocale: SITE_CONFIG.alternateLocales,
    url: SITE_CONFIG.canonicalBase,
    siteName: SITE_CONFIG.siteName,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    images: [
      {
        url: SITE_CONFIG.defaultOGImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.siteName} - ${SITE_CONFIG.siteSlogan}`,
      },
    ],
  },
  twitter: {
    card: SITE_CONFIG.twitter.cardType,
    site: SITE_CONFIG.twitter.site,
    creator: SITE_CONFIG.twitter.handle,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    images: [SITE_CONFIG.defaultOGImage],
  },
  robots: IS_PUBLIC_DEPLOYMENT
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
      },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: SITE_CONFIG.themeColor,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};
