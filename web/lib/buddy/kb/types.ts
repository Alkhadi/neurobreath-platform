/**
 * Internal Knowledge Base Types for NeuroBreath Buddy
 * Used for RAG-like deterministic content indexing
 */

export interface InternalPageMetadata {
  path: string;
  title: string;
  description?: string;
  headings: {
    text: string;
    id: string;
    level: number;
  }[];
  anchors: string[];
  audiences: string[]; // e.g., ['neurodivergent', 'parents', 'teachers', 'carers']
  keyTopics: string[]; // e.g., ['PTSD', 'grounding', 'trauma', 'triggers']
  toolLinks?: {
    toolId: string;
    toolName: string;
    description?: string;
  }[];
  regionSpecific?: {
    regions: ('uk' | 'us')[];
    canonical?: string;
  };
  lastUpdated: string;
  isPublished: boolean;
}

export interface InternalIndex {
  version: string;
  generatedAt: string;
  pages: InternalPageMetadata[];
}

export interface QuickIntent {
  id: string;
  label: string;
  intentType: 'navigation' | 'information' | 'tool' | 'support';
  primaryInternalPaths: string[];
  anchorHints?: string[];
  audiences: string[];
  fallbackExternalQuery?: string;
  description?: string;
}

export interface BuddyAnswerContext {
  question: string;
  currentPath?: string;
  region?: 'uk' | 'us';
  detectedSections?: {
    id: string;
    title: string;
  }[];
}

export interface BuddyQueryResult {
  question: string;
  answerHtml: string;
  internalLinks: {
    url: string;
    text: string;
    anchor?: string;
    relevance: number;
  }[];
  externalCitations?: {
    url: string;
    title: string;
    publisher: string;
    dateAccessed?: string;
  }[];
  coverage: 'internal-only' | 'hybrid' | 'external-only' | 'none';
  debug?: {
    internalMatches: number;
    externalSourcesUsed: string[];
    timingMs?: {
      total: number;
      internalSearchMs?: number;
      externalFetchMs?: number;
    };
    provider?: 'internal-index' | 'evidence-ingest' | 'live-fetch';
  };
}

export interface EvidenceReference {
  title: string;
  url: string;
  publisher: string;
  dateAccessed: string;
  keyFindings?: string[];
  pmid?: string;
  doi?: string;
  levelOfEvidence?: 'high' | 'moderate' | 'low';
}

export interface AnswerTemplate {
  whatThisMeans: string;
  canDoOnNeurobreath: {
    url: string;
    text: string;
    anchor?: string;
  }[];
  recommendedNextSteps: string[];
  references?: EvidenceReference[];
}
