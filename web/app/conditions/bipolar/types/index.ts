// TypeScript types and interfaces for the Bipolar page

export type Language = 'en-GB' | 'en-US';

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: number; // 1-10 scale
  moodState: 'depressive' | 'normal' | 'hypomanic' | 'manic' | 'mixed';
  notes?: string;
  sleepHours?: number;
  triggers?: string[];
  medications?: boolean;
}

export interface Streak {
  current: number;
  longest: number;
  lastEntryDate: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  milestone: number;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface ProgressStats {
  totalEntries: number;
  averageMood: number;
  streakData: Streak;
  moodTrends: {
    week: number[];
    month: number[];
    year: number[];
  };
  mostCommonTriggers: string[];
}

export interface InteractiveToolData {
  id: string;
  name: string;
  description: string;
  evidenceBase: string;
  completionCount: number;
  lastCompleted?: string;
}

export interface LanguagePreference {
  language: Language;
  autoDetected: boolean;
}

export interface LocalStorageData {
  moodEntries: MoodEntry[];
  streak: Streak;
  achievements: Achievement[];
  languagePreference: LanguagePreference;
  interactiveTools: InteractiveToolData[];
}

export interface ResearchData {
  metadata: any;
  diagnosis: any;
  treatment_options: any;
  management_strategies: any;
  support_resources: any;
  intervention_skills_and_tactics: any;
  evidence_based_interactive_management_tools: any;
  statistics_and_epidemiology: any;
  references_and_citations: any;
  language_considerations: any;
}
