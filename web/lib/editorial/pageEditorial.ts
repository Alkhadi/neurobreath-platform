export type ChangeLogType = 'content' | 'safety' | 'evidence' | 'ux' | 'typo';

export interface EditorialChangeLogEntry {
  date: string;
  summary: string;
  type: ChangeLogType;
}

export interface CitationsSummary {
  count: number;
  sourceTiersPresent: Array<'A' | 'B' | 'C'>;
}

export interface PageDisclaimers {
  educationalOnly: true;
  notMedicalAdvice: true;
}

export interface PageEditorial {
  authorId: string;
  reviewerId: string;
  editorialRoleNotes?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string;
  reviewIntervalDays: number;
  changeLog: EditorialChangeLogEntry[];
  citationsSummary?: CitationsSummary;
  disclaimers: PageDisclaimers;
}

export const DEFAULT_DISCLAIMERS: PageDisclaimers = {
  educationalOnly: true,
  notMedicalAdvice: true,
};

export const createCitationsSummary = (count: number, sourceTiersPresent: Array<'A' | 'B' | 'C'>): CitationsSummary => ({
  count,
  sourceTiersPresent,
});

export const createEditorialMeta = (meta: Omit<PageEditorial, 'disclaimers'> & { disclaimers?: PageDisclaimers }): PageEditorial => ({
  ...meta,
  disclaimers: meta.disclaimers ?? DEFAULT_DISCLAIMERS,
});
