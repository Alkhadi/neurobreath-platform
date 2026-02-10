/**
 * Legal Configuration
 * 
 * Centralized configuration for legal pages, contact details, and compliance info.
 * Update this file when organization details change or after legal review.
 */

export const LEGAL_CONFIG = {
  // Organization Details
  organizationName: 'NeuroBreath',
  organizationStatus: 'NeuroBreath is currently an initiative and intends to register with Companies House; details will be published once registered.',
  location: 'Southwark, London, United Kingdom',
  
  // Contact Information
  privacyEmail: 'privacy@neurobreath.co.uk',
  supportEmail: 'support@neurobreath.co.uk',
  contactEmail: 'contact@neurobreath.co.uk',
  
  // Legal Dates (update after solicitor review or significant changes)
  lastUpdated: {
    privacy: '2026-01-23',
    terms: '2026-01-23',
    cookies: '2026-01-23',
    accessibility: '2026-01-23',
    disclaimer: '2026-01-23',
  },
  
  // Website Details
  siteUrl: 'https://neurobreath.co.uk',
  ukUrl: 'https://neurobreath.co.uk/uk',
  usUrl: 'https://neurobreath.co.uk/us',
  
  // Data Protection
  dataRetention: {
    accounts: '2 years of inactivity',
    progressData: 'Until deletion requested or 3 years of inactivity',
    passwordResetTokens: '1 hour',
    contactFormData: 'Email only, not stored in database',
    analytics: 'Local device only, no server storage',
  },
  
  // Key Statements
  statements: {
    noHealthData: 'We do not collect health data, biometric data, or any sensitive categories of personal data.',
    noEmailMarketing: 'We do not use your email address for marketing purposes. We do not operate a newsletter or marketing automation.',
    educationalOnly: 'Educational information only. Not medical advice. No diagnosis. No medical claims.',
    dataLocation: 'Data is stored on secure servers in the European Economic Area (EEA). For UK users, data remains subject to UK GDPR.',
  },
  
  // Lawful Bases (UK GDPR Article 6)
  lawfulBases: {
    accountCreation: 'Performance of contract (Article 6(1)(b))',
    progressSync: 'Legitimate interests (Article 6(1)(f)) - providing service functionality',
    essentialCookies: 'Legitimate interests (Article 6(1)(f)) - site functionality and security',
    analytics: 'Consent (Article 6(1)(a)) - if enabled by user',
    contactForm: 'Legitimate interests (Article 6(1)(f)) - responding to inquiries',
  },
  
  // Cookie Categories
  cookieCategories: {
    essential: {
      name: 'Essential Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      examples: ['Session management', 'Security', 'Region preference'],
    },
    functional: {
      name: 'Functional Cookies',
      description: 'Enable enhanced features like saving your progress locally.',
      examples: ['Guest progress tracking', 'Device profiles', 'TTS preferences'],
    },
    analytics: {
      name: 'Analytics Cookies',
      description: 'Help us understand how you use the site. Currently not used, but available for future use.',
      examples: ['Page views', 'Feature usage', 'Error tracking'],
    },
  },
  
  // Compliance Flags
  compliance: {
    gdprCompliant: true,
    ccpaCompliant: true,
    childrenUnder13: false, // Site not intended for children under 13
    sellPersonalData: false, // We do not sell personal data
    crossContextAds: false, // We do not serve cross-context behavioral ads
  },
} as const;

export type LegalConfigType = typeof LEGAL_CONFIG;
