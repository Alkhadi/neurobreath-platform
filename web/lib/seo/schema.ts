/**
 * JSON-LD Structured Data Schema Helpers
 * 
 * Generates schema.org structured data for improved search engine understanding
 * and potential rich results in search.
 */

import { SITE_CONFIG } from './site-seo';
import type { Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article, WithContext } from 'schema-dts';

/**
 * Generate Organization schema (use globally in layout)
 */
export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.organisation.name,
    // Help search engines associate the on-site slogan with the brand.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slogan: SITE_CONFIG.siteSlogan as any,
    legalName: SITE_CONFIG.organisation.legalName,
    url: SITE_CONFIG.organisation.url,
    logo: SITE_CONFIG.organisation.logo,
    description: SITE_CONFIG.organisation.description,
    foundingDate: SITE_CONFIG.organisation.foundingDate,
    sameAs: SITE_CONFIG.organisation.sameAs,
    contactPoint: SITE_CONFIG.organisation.contactPoint,
  };
}

/**
 * Generate WebSite schema with search action (use globally in layout)
 */
export function generateWebSiteSchema(languageOverride?: string): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.siteName,
    description: SITE_CONFIG.brandDescription,
    url: SITE_CONFIG.canonicalBase,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.canonicalBase}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    inLanguage: languageOverride || SITE_CONFIG.language,
  };
}

/**
 * Generate WebPage schema for individual pages
 */
export function generateWebPageSchema(config: {
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  languageOverride?: string;
}): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: config.url,
    name: config.name,
    description: config.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.canonicalBase}/#website`,
    },
    inLanguage: config.languageOverride || SITE_CONFIG.language,
    ...(config.datePublished && { datePublished: config.datePublished }),
    ...(config.dateModified && { dateModified: config.dateModified }),
    ...(config.image && { 
      image: {
        '@type': 'ImageObject',
        url: config.image,
      }
    }),
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema (for blog posts)
 */
export function generateArticleSchema(config: {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  authorUrl?: string;
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    image: config.image,
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    author: {
      '@type': 'Person',
      name: config.author || SITE_CONFIG.organisation.name,
      ...(config.authorUrl && { url: config.authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.organisation.name,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.organisation.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
    inLanguage: SITE_CONFIG.language,
  };
}

/**
 * Render JSON-LD script tag (for use in components)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderJsonLd(data: WithContext<any>): string {
  return JSON.stringify(data);
}

/**
 * Generate multiple schemas combined
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateCombinedSchema(...schemas: any[]): string {
  if (schemas.length === 1) {
    return renderJsonLd(schemas[0]);
  }
  
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas.map(schema => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { '@context': _, ...rest } = schema;
      return rest;
    }),
  });
}

/**
 * Helper to generate breadcrumbs from pathname
 */
export function generateBreadcrumbsFromPath(pathname: string): Array<{ name: string; url: string }> {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ name: string; url: string }> = [
    { name: 'Home', url: SITE_CONFIG.canonicalBase },
  ];
  
  let currentPath = '';
  for (const path of paths) {
    currentPath += `/${path}`;
    const name = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      name,
      url: `${SITE_CONFIG.canonicalBase}${currentPath}`,
    });
  }
  
  return breadcrumbs;
}
