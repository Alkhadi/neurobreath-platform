export type BuddySafetyLevel = 'none' | 'caution' | 'urgent' | 'emergency';

export type BuddyCitationProvider = 'NeuroBreath' | 'NHS' | 'MedlinePlus' | 'PubMed';

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
  };
}
