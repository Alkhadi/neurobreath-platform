/**
 * Per-Condition Schema.org Structured Data
 *
 * Generates MedicalWebPage and HealthTopicContent schemas for
 * condition-specific pages (ADHD, autism, dyslexia, anxiety, etc.)
 *
 * Also provides a WebApplication schema for the PWA.
 */

import { SITE_CONFIG } from './site-seo'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ConditionSchemaConfig {
  condition: string
  /** Display name, e.g. "ADHD" */
  conditionName: string
  /** Full page URL */
  url: string
  /** Page title */
  name: string
  /** Page description */
  description: string
  /** Keywords for this condition page */
  keywords?: string[]
  /** Date the page was published */
  datePublished?: string
  /** Date the page was last updated */
  dateModified?: string
}

// ── Condition page schema ──────────────────────────────────────────────────────

/**
 * Generate a MedicalWebPage schema for condition-specific pages.
 * This tells Google the page covers a specific health topic.
 */
export function generateConditionPageSchema(config: ConditionSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    url: config.url,
    name: config.name,
    description: config.description,
    about: {
      '@type': 'MedicalCondition',
      name: config.conditionName,
      alternateName: config.condition,
    },
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 5,
      healthCondition: {
        '@type': 'MedicalCondition',
        name: config.conditionName,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.canonicalBase}/#website`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.organisation.name,
      url: SITE_CONFIG.organisation.url,
      logo: {
        '@type': 'ImageObject',
        url: SITE_CONFIG.organisation.logo,
      },
    },
    inLanguage: SITE_CONFIG.language,
    ...(config.datePublished && { datePublished: config.datePublished }),
    ...(config.dateModified && { dateModified: config.dateModified }),
    ...(config.keywords?.length && { keywords: config.keywords.join(', ') }),
  }
}

// ── WebApplication schema ──────────────────────────────────────────────────────

/**
 * Generate a WebApplication schema for the PWA listing.
 * Helps search engines present the app in app-like results.
 */
export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.canonicalBase,
    description: SITE_CONFIG.brandDescription,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
    },
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.organisation.name,
      url: SITE_CONFIG.organisation.url,
    },
    featureList: [
      'Breathing exercises',
      'Focus tools',
      'Progress tracking',
      'Offline support',
      'ADHD support',
      'Autism support',
      'Dyslexia support',
      'Anxiety management',
    ],
  }
}

// ── Condition registry ─────────────────────────────────────────────────────────

/** Pre-built condition metadata for quick schema generation. */
export const CONDITION_REGISTRY: Record<
  string,
  { conditionName: string; keywords: string[] }
> = {
  adhd: {
    conditionName: 'Attention Deficit Hyperactivity Disorder',
    keywords: [
      'ADHD',
      'attention deficit',
      'hyperactivity',
      'ADHD tools',
      'ADHD support',
      'neurodivergent',
    ],
  },
  autism: {
    conditionName: 'Autism Spectrum Disorder',
    keywords: [
      'autism',
      'ASD',
      'autism support',
      'sensory tools',
      'focus garden',
      'neurodivergent',
    ],
  },
  dyslexia: {
    conditionName: 'Dyslexia',
    keywords: [
      'dyslexia',
      'reading support',
      'dyslexia tools',
      'literacy',
      'neurodivergent',
    ],
  },
  anxiety: {
    conditionName: 'Anxiety Disorder',
    keywords: [
      'anxiety',
      'anxiety management',
      'breathing exercises',
      'calm',
      'mental health',
    ],
  },
  depression: {
    conditionName: 'Depression',
    keywords: [
      'depression',
      'low mood',
      'mental health',
      'mood tracking',
      'wellbeing',
    ],
  },
}
