/**
 * Metadata Generation Utilities
 * 
 * Helper functions for generating Next.js metadata objects for pages
 */

import { Metadata } from 'next';
import { SITE_CONFIG, generateCanonicalUrl, generatePageTitle } from './site-seo';
import { getIndexingDecision } from './indexing-policy';

export interface PageMetadataConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/**
 * Generate complete metadata object for a page
 */
export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const {
    title,
    description,
    path,
    keywords = [],
    image = SITE_CONFIG.defaultOGImage,
    noindex,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
  } = config;

  const fullTitle = generatePageTitle(title);
  const canonical = generateCanonicalUrl(path);
  const fullImageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.canonicalBase}${image}`;
  
  const allKeywords = [...SITE_CONFIG.defaultKeywords, ...keywords];

  const resolvedNoindex = noindex ?? !getIndexingDecision(path).index;

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: author ? [{ name: author }] : [{ name: SITE_CONFIG.organisation.name }],
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: SITE_CONFIG.locale,
      url: canonical,
      siteName: SITE_CONFIG.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: SITE_CONFIG.twitter.cardType,
      site: SITE_CONFIG.twitter.site,
      creator: SITE_CONFIG.twitter.handle,
      title: fullTitle,
      description,
      images: [fullImageUrl],
    },
    robots: resolvedNoindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Generate metadata for condition/topic pages (ADHD, Autism, etc.)
 */
export function generateConditionMetadata(config: {
  condition: string;
  audience?: 'general' | 'parent' | 'teacher' | 'carer';
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const { condition, audience = 'general', description, path, keywords = [] } = config;
  
  let title = condition;
  if (audience !== 'general') {
    const audienceLabel = audience.charAt(0).toUpperCase() + audience.slice(1);
    title = `${condition} ${audienceLabel} Support Hub`;
  }

  return generatePageMetadata({
    title,
    description,
    path,
    keywords: [...keywords, condition.toLowerCase(), `${condition.toLowerCase()} support`, `${condition.toLowerCase()} resources`],
  });
}

/**
 * Generate metadata for tool pages
 */
export function generateToolMetadata(config: {
  toolName: string;
  description: string;
  path: string;
  category?: string;
}): Metadata {
  const { toolName, description, path, category } = config;
  
  const keywords = [
    `${toolName.toLowerCase()}`,
    'neurodiversity tools',
    'interactive tools',
  ];
  
  if (category) {
    keywords.push(`${category.toLowerCase()} tools`);
  }

  return generatePageMetadata({
    title: toolName,
    description,
    path,
    keywords,
  });
}

/**
 * Generate metadata for blog articles
 */
export function generateBlogMetadata(config: {
  title: string;
  description: string;
  slug: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const {
    title,
    description,
    slug,
    publishedTime,
    modifiedTime,
    author,
    image,
    keywords = [],
  } = config;

  return generatePageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    keywords: [...keywords, 'neurodiversity blog', 'mental health'],
    image,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
  });
}

/**
 * Generate metadata for breathing technique pages
 */
export function generateBreathingTechniqueMetadata(config: {
  techniqueName: string;
  description: string;
  slug: string;
  duration?: string;
  benefits?: string[];
}): Metadata {
  const { techniqueName, description, slug, duration, benefits = [] } = config;
  
  let enhancedDescription = description;
  if (duration) {
    enhancedDescription += ` Duration: ${duration}.`;
  }
  if (benefits.length > 0) {
    enhancedDescription += ` Benefits: ${benefits.join(', ')}.`;
  }

  return generatePageMetadata({
    title: `${techniqueName} Breathing Technique`,
    description: enhancedDescription,
    path: `/techniques/${slug}`,
    keywords: [
      'breathing techniques',
      'breathing exercises',
      'calm breathing',
      'stress relief',
      `${techniqueName.toLowerCase()}`,
    ],
  });
}

/**
 * Generate metadata for resource pages
 */
export function generateResourceMetadata(config: {
  resourceType: string;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { resourceType, title, description, path } = config;

  return generatePageMetadata({
    title,
    description,
    path,
    keywords: [
      `${resourceType.toLowerCase()}`,
      'educational resources',
      'neurodiversity resources',
      'downloadable resources',
    ],
  });
}

/**
 * Quick helper for noindex pages (dashboards, private areas)
 */
export function generateNoindexMetadata(title: string, description: string): Metadata {
  return {
    title: generatePageTitle(title),
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}
