export type BuddySafetyLevel = 'none' | 'caution' | 'urgent' | 'emergency';

export type BuddySourceProvider = 'NHS' | 'MedlinePlus' | 'PubMed' | 'NeuroBreath';

export interface BuddyAnswerSection {
  heading: string;
  markdown: string;
}

export interface BuddyAnswer {
  title: string;
  summaryMarkdown: string;
  sections: BuddyAnswerSection[];
  safety: {
    level: BuddySafetyLevel;
    messageMarkdown?: string;
  };
  tailoredQuestions?: string[];
}

export interface BuddySource {
  provider: BuddySourceProvider;
  title: string;
  url: string;
  dateLabel?: string;
  lastReviewed?: string;
  reliabilityBadge?: 'Primary' | 'Secondary';
}

export interface BuddyAskResponse {
  answer: BuddyAnswer;
  sources: BuddySource[];
  recommendedActions?: Array<{
    id: string;
    type: 'navigate' | 'scroll' | 'start_exercise' | 'open_tool' | 'download';
    label: string;
    description?: string;
    icon?: 'target' | 'play' | 'book' | 'timer' | 'file' | 'heart' | 'brain' | 'sparkles' | 'map';
    target?: string;
    primary?: boolean;
  }>;
  debug?: {
    matchedTopic?: string;
    providerUsed?: BuddySourceProvider;
  };
}
