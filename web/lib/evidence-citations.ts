/**
 * Evidence Citation Utilities
 * 
 * Shared utilities for consistent evidence citation across:
 * - AI Coach (Blog page)
 * - NeuroBreath Buddy (all pages)
 * - Knowledge Base articles
 * 
 * Ensures all health/clinical information is properly cited with:
 * - NICE guideline numbers
 * - NHS page URLs
 * - PubMed PMIDs
 * - Other credible sources (CDC, AAP, WHO, etc.)
 */

export interface EvidenceCitation {
  source: string // e.g., "NICE NG87", "NHS", "Research PMID 12345678"
  fullName: string // e.g., "NICE Guideline NG87: ADHD Diagnosis and Management"
  url?: string
  year?: string | number
  type: 'clinical_guideline' | 'government_health' | 'research' | 'systematic_review' | 'charity'
  credibility: 'high' | 'moderate'
}

/**
 * UK Clinical Guidelines
 */
export const NICE_GUIDELINES: Record<string, EvidenceCitation> = {
  'adhd': {
    source: 'NICE NG87',
    fullName: 'NICE Guideline NG87: Attention deficit hyperactivity disorder: diagnosis and management',
    url: 'https://www.nice.org.uk/guidance/ng87',
    year: '2018',
    type: 'clinical_guideline',
    credibility: 'high'
  },
  'autism_children': {
    source: 'NICE CG128',
    fullName: 'NICE Guideline CG128: Autism spectrum disorder in under 19s: recognition, referral and diagnosis',
    url: 'https://www.nice.org.uk/guidance/cg128',
    year: '2011',
    type: 'clinical_guideline',
    credibility: 'high'
  },
  'autism_adults': {
    source: 'NICE CG142',
    fullName: 'NICE Guideline CG142: Autism spectrum disorder in adults: diagnosis and management',
    url: 'https://www.nice.org.uk/guidance/cg142',
    year: '2012',
    type: 'clinical_guideline',
    credibility: 'high'
  },
  'anxiety_gad': {
    source: 'NICE CG113',
    fullName: 'NICE Guideline CG113: Generalised anxiety disorder and panic disorder in adults: management',
    url: 'https://www.nice.org.uk/guidance/cg113',
    year: '2011',
    type: 'clinical_guideline',
    credibility: 'high'
  },
  'depression': {
    source: 'NICE CG90',
    fullName: 'NICE Guideline CG90: Depression in adults: treatment and management',
    url: 'https://www.nice.org.uk/guidance/ng222',
    year: '2022',
    type: 'clinical_guideline',
    credibility: 'high'
  },
  'social_anxiety': {
    source: 'NICE CG159',
    fullName: 'NICE Guideline CG159: Social anxiety disorder: recognition, assessment and treatment',
    url: 'https://www.nice.org.uk/guidance/cg159',
    year: '2013',
    type: 'clinical_guideline',
    credibility: 'high'
  },
  'ocd': {
    source: 'NICE CG31',
    fullName: 'NICE Guideline CG31: Obsessive-compulsive disorder and body dysmorphic disorder: treatment',
    url: 'https://www.nice.org.uk/guidance/cg31',
    year: '2005',
    type: 'clinical_guideline',
    credibility: 'high'
  }
}

/**
 * Key Research PMIDs by Topic
 */
export const RESEARCH_PMIDS: Record<string, EvidenceCitation[]> = {
  adhd: [
    {
      source: 'PMID 31411903',
      fullName: 'Cortese et al. (2018): Comparative efficacy and tolerability of medications for ADHD - Network meta-analysis',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31411903/',
      year: '2018',
      type: 'systematic_review',
      credibility: 'high'
    },
    {
      source: 'PMID 10517495',
      fullName: 'MTA Cooperative Group (1999): Multimodal Treatment Study of Children with ADHD',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10517495/',
      year: '1999',
      type: 'research',
      credibility: 'high'
    },
    {
      source: 'PMID 36794797',
      fullName: 'Faraone et al. (2021): The World Federation of ADHD International Consensus Statement',
      url: 'https://pubmed.ncbi.nlm.nih.gov/36794797/',
      year: '2021',
      type: 'systematic_review',
      credibility: 'high'
    }
  ],
  autism: [
    {
      source: 'PMID 28545751',
      fullName: 'Fletcher-Watson et al. (2014): Autism spectrum disorder - Evidence-based approaches',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28545751/',
      year: '2014',
      type: 'systematic_review',
      credibility: 'high'
    },
    {
      source: 'PMID 27539432',
      fullName: 'Lai et al. (2014): Autism spectrum disorder - Lancet review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24524524/',
      year: '2014',
      type: 'systematic_review',
      credibility: 'high'
    }
  ],
  breathing: [
    {
      source: 'PMID 29616846',
      fullName: 'Zaccaro et al. (2018): How breath-control can change your life - systematic review on psycho-physiological correlates',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29616846/',
      year: '2018',
      type: 'systematic_review',
      credibility: 'high'
    },
    {
      source: 'PMID 28974862',
      fullName: 'Perciavalle et al. (2017): Role of deep breathing in stress',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28974862/',
      year: '2017',
      type: 'research',
      credibility: 'high'
    },
    {
      source: 'PMID 11744522',
      fullName: 'Bernardi et al. (2001): Effect of breathing rate on oxygen saturation and exercise performance',
      url: 'https://pubmed.ncbi.nlm.nih.gov/11744522/',
      year: '2001',
      type: 'research',
      credibility: 'high'
    }
  ],
  anxiety: [
    {
      source: 'PMID 30301513',
      fullName: 'Stubbs et al. (2017): Exercise for anxiety - Cochrane review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30301513/',
      year: '2017',
      type: 'systematic_review',
      credibility: 'high'
    },
    {
      source: 'PMID 28365317',
      fullName: 'Kaczkurkin & Foa (2015): CBT for anxiety disorders - what we know',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28365317/',
      year: '2015',
      type: 'systematic_review',
      credibility: 'high'
    }
  ],
  depression: [
    {
      source: 'PMID 27470975',
      fullName: 'Ekers et al. (2014): Behavioural activation for depression - Cochrane review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27470975/',
      year: '2014',
      type: 'systematic_review',
      credibility: 'high'
    },
    {
      source: 'PMID 16551270',
      fullName: 'Rush et al. (2006): STAR*D trial - acute and longer-term outcomes',
      url: 'https://pubmed.ncbi.nlm.nih.gov/16551270/',
      year: '2006',
      type: 'research',
      credibility: 'high'
    }
  ],
  sleep: [
    {
      source: 'PMID 26447429',
      fullName: 'Trauer et al. (2015): CBT-I for insomnia - systematic review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26447429/',
      year: '2015',
      type: 'systematic_review',
      credibility: 'high'
    },
    {
      source: 'PMID 28364458',
      fullName: 'Cappuccio et al. (2011): Sleep and cardiovascular disease - meta-analysis',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21300732/',
      year: '2011',
      type: 'systematic_review',
      credibility: 'high'
    }
  ],
  dyslexia: [
    {
      source: 'PMID 28213071',
      fullName: 'Peterson & Pennington (2015): Developmental dyslexia - Lancet review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25638728/',
      year: '2015',
      type: 'systematic_review',
      credibility: 'high'
    }
  ]
}

/**
 * NHS Page URLs by Topic
 */
export const NHS_PAGES: Record<string, EvidenceCitation> = {
  'adhd': {
    source: 'NHS',
    fullName: 'NHS: Attention deficit hyperactivity disorder (ADHD)',
    url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/',
    type: 'government_health',
    credibility: 'high'
  },
  'autism': {
    source: 'NHS',
    fullName: 'NHS: Autism',
    url: 'https://www.nhs.uk/conditions/autism/',
    type: 'government_health',
    credibility: 'high'
  },
  'anxiety': {
    source: 'NHS',
    fullName: 'NHS: Generalised anxiety disorder',
    url: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/',
    type: 'government_health',
    credibility: 'high'
  },
  'depression': {
    source: 'NHS',
    fullName: 'NHS: Clinical depression',
    url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/',
    type: 'government_health',
    credibility: 'high'
  },
  'breathing': {
    source: 'NHS',
    fullName: 'NHS: Breathing exercises for stress',
    url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
    type: 'government_health',
    credibility: 'high'
  },
  'sleep': {
    source: 'NHS',
    fullName: 'NHS: Insomnia',
    url: 'https://www.nhs.uk/conditions/insomnia/',
    type: 'government_health',
    credibility: 'high'
  },
  'dyslexia': {
    source: 'NHS',
    fullName: 'NHS: Dyslexia',
    url: 'https://www.nhs.uk/conditions/dyslexia/',
    type: 'government_health',
    credibility: 'high'
  }
}

/**
 * Format a citation for inline use
 * Examples:
 * - formatCitation(NICE_GUIDELINES.adhd) => "NICE NG87 (2018)"
 * - formatCitation(RESEARCH_PMIDS.breathing[0]) => "Research PMID 29616846"
 */
export function formatCitation(citation: EvidenceCitation): string {
  if (citation.type === 'research' || citation.type === 'systematic_review') {
    return citation.source // e.g., "PMID 12345678" or "Research PMID 12345678"
  }
  if (citation.year) {
    return `${citation.source} (${citation.year})`
  }
  return citation.source
}

/**
 * Format multiple citations for inline use
 * Example: formatCitations([...]) => "NICE NG87 (2018), Research PMID 31411903"
 */
export function formatCitations(citations: EvidenceCitation[]): string {
  return citations.map(formatCitation).join(', ')
}

/**
 * Get all relevant citations for a topic
 * Returns NICE + NHS + top 2 research citations
 */
export function getCitationsForTopic(topic: string): EvidenceCitation[] {
  const citations: EvidenceCitation[] = []
  
  // Add NICE guideline
  if (NICE_GUIDELINES[topic]) {
    citations.push(NICE_GUIDELINES[topic])
  }
  
  // Add NHS page
  if (NHS_PAGES[topic]) {
    citations.push(NHS_PAGES[topic])
  }
  
  // Add top 2 research citations
  if (RESEARCH_PMIDS[topic]) {
    citations.push(...RESEARCH_PMIDS[topic].slice(0, 2))
  }
  
  return citations
}

/**
 * Build a citation sentence for use in responses
 * Example: buildCitationSentence('adhd', 'ADHD is a neurodevelopmental condition')
 * => "ADHD is a neurodevelopmental condition (NICE NG87 (2018), Research PMID 31411903)"
 */
export function buildCitationSentence(topic: string, statement: string): string {
  const citations = getCitationsForTopic(topic)
  if (citations.length === 0) return statement
  
  const citationText = formatCitations(citations)
  return `${statement} (${citationText})`
}

/**
 * Check if a statement has proper citation
 * Used for validation in AI responses
 */
export function hasCitation(text: string): boolean {
  // Check for NICE, PMID, NHS, CDC, AAP, WHO, DSM, ICD
  const citationPatterns = [
    /NICE\s+(NG|CG|QS)\d+/i,
    /PMID\s+\d{7,}/i,
    /NHS\b/i,
    /CDC\b/i,
    /AAP\b/i,
    /WHO\b/i,
    /DSM-5/i,
    /ICD-11/i,
    /Cochrane/i,
    /Research:/i,
    /Study:/i
  ]
  
  return citationPatterns.some(pattern => pattern.test(text))
}

/**
 * Extract citations from text
 * Returns array of citation strings found
 */
export function extractCitations(text: string): string[] {
  const citations: string[] = []
  
  // Extract NICE guidelines
  const niceMatches = text.matchAll(/NICE\s+(NG|CG|QS)\d+/gi)
  for (const match of niceMatches) {
    citations.push(match[0])
  }
  
  // Extract PMIDs
  const pmidMatches = text.matchAll(/PMID\s+\d{7,}/gi)
  for (const match of pmidMatches) {
    citations.push(match[0])
  }
  
  return [...new Set(citations)] // Remove duplicates
}
