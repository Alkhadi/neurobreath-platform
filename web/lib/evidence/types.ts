export type EvidenceRegion = 'UK' | 'US' | 'GLOBAL';

export interface EvidenceSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  region: EvidenceRegion;
  contentType?: 'guidance' | 'article' | 'reference';
  lastChecked?: string;
}

export interface EvidenceManifest {
  reviewedAt: string;
  reviewIntervalDays: number;
  citations?: string[];
  citationsByRegion?: {
    UK?: string[];
    US?: string[];
    GLOBAL?: string[];
  };
  notes?: string;
}
