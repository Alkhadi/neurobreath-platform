export type BuddySafetyLevel = 'none' | 'caution' | 'urgent' | 'emergency';

export type BuddyCitationProvider = 'NeuroBreath' | 'NHS' | 'NICE' | 'PubMed';

export type BuddyIntentClass = 'navigation' | 'tool_help' | 'general';

export interface BuddyTimingsMs {
  t_internalSearch_ms?: number;
  t_internalAssemble_ms?: number;
  t_externalManifestSearch_ms?: number;
  t_externalFetch_ms?: number;
  t_linkValidation_ms?: number;
  t_total_ms?: number;
}

export interface BuddyCacheSummary {
  internalIndex?: 'hit' | 'miss';
  nhsManifest?: 'hit' | 'miss';
  externalFetch?: 'hit' | 'miss';
  linkValidation?: 'hit' | 'miss';
}

export interface BuddyLinkValidationSummary {
  totalLinks: number;
  validLinks: number;
  removedLinks: number;
  removed?: Array<{
    provider?: BuddyCitationProvider;
    url: string;
    status?: number;
    reason: string;
  }>;
}

export interface BuddyAnswerSection {
  heading: string;
  text: string;
}

export interface BuddyAnswer {
  title: string;
  summary: string;
  sections: BuddyAnswerSection[];
  safety: {
    level: BuddySafetyLevel;
    message?: string;
  };
}

export interface BuddyCitation {
  provider: BuddyCitationProvider;
  title: string;
  url: string;
  lastReviewed?: string;
}

export interface BuddyAskResponse {
  answer: BuddyAnswer;
  citations: BuddyCitation[];
  meta: {
    usedInternal: boolean;
    usedExternal: boolean;
    internalCoverage: 'high' | 'partial' | 'none';

    // User-facing + support diagnostics
    usedProviders?: BuddyCitationProvider[];
    verifiedLinks?: BuddyLinkValidationSummary;

    // Observability / dev diagnostics (safe: no raw question text)
    requestId?: string;
    intentClass?: BuddyIntentClass;
    timingsMs?: BuddyTimingsMs;
    cache?: BuddyCacheSummary;
    warnings?: string[];
    dev?: {
      matchedTopic?: string;
    };
  };
}
