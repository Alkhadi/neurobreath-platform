/**
 * Authoritative Evidence Source Registry
 * 
 * Canonical registry of trusted health and neurodiversity sources.
 * Used by NeuroBreath Buddy, AI Coach, Blog, and all health answer systems.
 * 
 * Tier Definitions:
 * - A: Governmental health bodies, clinical guidelines, peer-reviewed journals
 * - B: Established charities, support organizations (clearly labeled as non-clinical)
 * - C: Other reputable sources (context-dependent)
 */

export type SourceTier = 'A' | 'B' | 'C';
export type OrgType = 'government' | 'ngo' | 'charity' | 'academic' | 'journal' | 'policy';
export type Topic = 
  | 'adhd' 
  | 'autism' 
  | 'dyslexia' 
  | 'anxiety' 
  | 'depression' 
  | 'breathing' 
  | 'sleep' 
  | 'bipolar'
  | 'stress'
  | 'burnout'
  | 'safeguarding'
  | 'general';

export interface EvidenceSource {
  id: string;
  name: string;
  shortName: string;
  organization: string;
  orgType: OrgType;
  tier: SourceTier;
  domains: string[]; // Allowlist for URL validation
  baseUrl: string;
  topics: Topic[];
  citationFormat: {
    publisher: string;
    jurisdiction?: string; // e.g., "UK", "US", "International"
    type: 'clinical_guideline' | 'research' | 'support_org' | 'policy' | 'journal';
  };
  notes?: string;
}

/**
 * Canonical Evidence Source Registry
 * 
 * CRITICAL: Do NOT add sources without verification.
 * Each entry must be:
 * 1. Authoritative in its domain
 * 2. Properly tiered (A for clinical/research, B for support orgs)
 * 3. Clearly labeled (especially non-clinical sources)
 */
export const EVIDENCE_SOURCES: Record<string, EvidenceSource> = {
  // ============================================================================
  // TIER A: UK Government & Clinical Authorities
  // ============================================================================
  nhs: {
    id: 'nhs',
    name: 'National Health Service',
    shortName: 'NHS',
    organization: 'UK National Health Service',
    orgType: 'government',
    tier: 'A',
    domains: ['nhs.uk', 'www.nhs.uk'],
    baseUrl: 'https://www.nhs.uk',
    topics: ['adhd', 'autism', 'dyslexia', 'anxiety', 'depression', 'sleep', 'bipolar', 'general'],
    citationFormat: {
      publisher: 'NHS',
      jurisdiction: 'UK',
      type: 'clinical_guideline',
    },
  },

  nice: {
    id: 'nice',
    name: 'National Institute for Health and Care Excellence',
    shortName: 'NICE',
    organization: 'NICE (UK)',
    orgType: 'government',
    tier: 'A',
    domains: ['nice.org.uk', 'www.nice.org.uk'],
    baseUrl: 'https://www.nice.org.uk',
    topics: ['adhd', 'autism', 'anxiety', 'depression', 'bipolar', 'general'],
    citationFormat: {
      publisher: 'NICE',
      jurisdiction: 'UK',
      type: 'clinical_guideline',
    },
    notes: 'Evidence-based clinical practice guidelines for the NHS',
  },

  gov_uk: {
    id: 'gov_uk',
    name: 'GOV.UK',
    shortName: 'GOV.UK',
    organization: 'UK Government',
    orgType: 'government',
    tier: 'A',
    domains: ['gov.uk', 'www.gov.uk'],
    baseUrl: 'https://www.gov.uk',
    topics: ['safeguarding', 'general'],
    citationFormat: {
      publisher: 'UK Government',
      jurisdiction: 'UK',
      type: 'policy',
    },
    notes: 'Policy, safeguarding, education (SEND) guidance',
  },

  rcpsych: {
    id: 'rcpsych',
    name: 'Royal College of Psychiatrists',
    shortName: 'RCPsych',
    organization: 'Royal College of Psychiatrists (UK)',
    orgType: 'academic',
    tier: 'A',
    domains: ['rcpsych.ac.uk', 'www.rcpsych.ac.uk'],
    baseUrl: 'https://www.rcpsych.ac.uk',
    topics: ['adhd', 'autism', 'anxiety', 'depression', 'bipolar', 'general'],
    citationFormat: {
      publisher: 'Royal College of Psychiatrists',
      jurisdiction: 'UK',
      type: 'clinical_guideline',
    },
    notes: 'Professional body for psychiatrists in the UK',
  },

  // ============================================================================
  // TIER A: International Clinical & Research
  // ============================================================================
  pubmed: {
    id: 'pubmed',
    name: 'PubMed',
    shortName: 'PubMed',
    organization: 'US National Library of Medicine',
    orgType: 'academic',
    tier: 'A',
    domains: ['pubmed.ncbi.nlm.nih.gov', 'ncbi.nlm.nih.gov'],
    baseUrl: 'https://pubmed.ncbi.nlm.nih.gov',
    topics: ['adhd', 'autism', 'dyslexia', 'anxiety', 'depression', 'breathing', 'sleep', 'bipolar', 'stress', 'general'],
    citationFormat: {
      publisher: 'US National Library of Medicine',
      jurisdiction: 'International',
      type: 'research',
    },
    notes: 'Peer-reviewed biomedical literature (35M+ citations)',
  },

  medlineplus: {
    id: 'medlineplus',
    name: 'MedlinePlus',
    shortName: 'MedlinePlus',
    organization: 'US National Library of Medicine',
    orgType: 'academic',
    tier: 'A',
    domains: ['medlineplus.gov', 'www.medlineplus.gov'],
    baseUrl: 'https://medlineplus.gov',
    topics: ['adhd', 'autism', 'dyslexia', 'anxiety', 'depression', 'breathing', 'sleep', 'bipolar', 'stress', 'general'],
    citationFormat: {
      publisher: 'US National Library of Medicine',
      jurisdiction: 'International',
      type: 'clinical_guideline',
    },
    notes: 'Evidence-informed health topic summaries (not a substitute for clinical advice)',
  },

  cochrane: {
    id: 'cochrane',
    name: 'Cochrane Library',
    shortName: 'Cochrane',
    organization: 'Cochrane Collaboration',
    orgType: 'academic',
    tier: 'A',
    domains: ['cochranelibrary.com', 'www.cochranelibrary.com'],
    baseUrl: 'https://www.cochranelibrary.com',
    topics: ['adhd', 'autism', 'anxiety', 'depression', 'general'],
    citationFormat: {
      publisher: 'Cochrane',
      jurisdiction: 'International',
      type: 'research',
    },
    notes: 'Systematic reviews and meta-analyses (gold standard evidence)',
  },

  who: {
    id: 'who',
    name: 'World Health Organization',
    shortName: 'WHO',
    organization: 'WHO',
    orgType: 'government',
    tier: 'A',
    domains: ['who.int', 'www.who.int'],
    baseUrl: 'https://www.who.int',
    topics: ['general', 'safeguarding'],
    citationFormat: {
      publisher: 'World Health Organization',
      jurisdiction: 'International',
      type: 'clinical_guideline',
    },
  },

  cdc: {
    id: 'cdc',
    name: 'Centers for Disease Control and Prevention',
    shortName: 'CDC',
    organization: 'US CDC',
    orgType: 'government',
    tier: 'A',
    domains: ['cdc.gov', 'www.cdc.gov'],
    baseUrl: 'https://www.cdc.gov',
    topics: ['adhd', 'autism', 'general'],
    citationFormat: {
      publisher: 'CDC',
      jurisdiction: 'US',
      type: 'clinical_guideline',
    },
    notes: 'US public health authority (relevant for international context)',
  },

  // ============================================================================
  // TIER B: UK Support Organizations (Clearly Labeled as Non-Clinical)
  // ============================================================================
  nas: {
    id: 'nas',
    name: 'National Autistic Society',
    shortName: 'NAS',
    organization: 'National Autistic Society (UK)',
    orgType: 'charity',
    tier: 'B',
    domains: ['autism.org.uk', 'www.autism.org.uk'],
    baseUrl: 'https://www.autism.org.uk',
    topics: ['autism'],
    citationFormat: {
      publisher: 'National Autistic Society',
      jurisdiction: 'UK',
      type: 'support_org',
    },
    notes: 'Leading UK autism charity (support and advocacy; not clinical authority)',
  },

  adhd_foundation: {
    id: 'adhd_foundation',
    name: 'ADHD Foundation',
    shortName: 'ADHD Foundation',
    organization: 'ADHD Foundation (UK)',
    orgType: 'charity',
    tier: 'B',
    domains: ['adhdfoundation.org.uk', 'www.adhdfoundation.org.uk'],
    baseUrl: 'https://www.adhdfoundation.org.uk',
    topics: ['adhd'],
    citationFormat: {
      publisher: 'ADHD Foundation',
      jurisdiction: 'UK',
      type: 'support_org',
    },
    notes: 'ADHD charity (neurodiversity week, resources; not clinical authority)',
  },

  mind: {
    id: 'mind',
    name: 'Mind',
    shortName: 'Mind',
    organization: 'Mind (UK)',
    orgType: 'charity',
    tier: 'B',
    domains: ['mind.org.uk', 'www.mind.org.uk'],
    baseUrl: 'https://www.mind.org.uk',
    topics: ['anxiety', 'depression', 'bipolar', 'stress', 'general'],
    citationFormat: {
      publisher: 'Mind',
      jurisdiction: 'UK',
      type: 'support_org',
    },
    notes: 'Mental health charity (information and support; not clinical authority)',
  },

  young_minds: {
    id: 'young_minds',
    name: 'YoungMinds',
    shortName: 'YoungMinds',
    organization: 'YoungMinds (UK)',
    orgType: 'charity',
    tier: 'B',
    domains: ['youngminds.org.uk', 'www.youngminds.org.uk'],
    baseUrl: 'https://www.youngminds.org.uk',
    topics: ['anxiety', 'depression', 'general'],
    citationFormat: {
      publisher: 'YoungMinds',
      jurisdiction: 'UK',
      type: 'support_org',
    },
    notes: 'Children and young people\'s mental health charity',
  },

  british_dyslexia: {
    id: 'british_dyslexia',
    name: 'British Dyslexia Association',
    shortName: 'BDA',
    organization: 'British Dyslexia Association',
    orgType: 'charity',
    tier: 'B',
    domains: ['bdadyslexia.org.uk', 'www.bdadyslexia.org.uk'],
    baseUrl: 'https://www.bdadyslexia.org.uk',
    topics: ['dyslexia'],
    citationFormat: {
      publisher: 'British Dyslexia Association',
      jurisdiction: 'UK',
      type: 'support_org',
    },
    notes: 'Dyslexia support and advocacy organization',
  },
};

/**
 * Get sources by topic
 */
export function getSourcesByTopic(topic: Topic, tier?: SourceTier): EvidenceSource[] {
  return Object.values(EVIDENCE_SOURCES).filter((source) => {
    const topicMatch = source.topics.includes(topic) || source.topics.includes('general');
    const tierMatch = tier ? source.tier === tier : true;
    return topicMatch && tierMatch;
  });
}

/**
 * Get source by ID
 */
export function getSourceById(id: string): EvidenceSource | undefined {
  return EVIDENCE_SOURCES[id];
}

/**
 * Validate URL against source allowlist
 */
export function validateSourceUrl(url: string, sourceId: string): boolean {
  const source = getSourceById(sourceId);
  if (!source) return false;

  try {
    const urlObj = new URL(url);
    return source.domains.some((domain) => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

/**
 * Get all Tier A (clinical/research) sources
 */
export function getClinicalSources(): EvidenceSource[] {
  return Object.values(EVIDENCE_SOURCES).filter((source) => source.tier === 'A');
}

/**
 * Get UK-specific sources
 */
export function getUKSources(): EvidenceSource[] {
  return Object.values(EVIDENCE_SOURCES).filter(
    (source) => source.citationFormat.jurisdiction === 'UK'
  );
}

/**
 * Get US-specific sources
 */
export function getUSSources(): EvidenceSource[] {
  return Object.values(EVIDENCE_SOURCES).filter(
    (source) => source.citationFormat.jurisdiction === 'US'
  );
}
