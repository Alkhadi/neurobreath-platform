// Core types for Autism Hub

export type AudienceType = 'teacher' | 'parent' | 'autistic' | 'employer';
export type CountryType = 'UK' | 'US' | 'EU';
export type AgeBand = 'early-years' | 'primary' | 'secondary' | 'adult';
export type SettingType = 'home' | 'classroom' | 'community' | 'workplace';

export interface Skill {
  id: string;
  title: string;
  description: string;
  tags: string[];
  whyItHelps: string;
  howToDo: string[];
  commonPitfalls: string[];
  ageAdaptations: Record<AgeBand, string>;
  evidenceLinks: EvidenceLink[];
  audienceRelevance?: AudienceType[];
}

export interface EvidenceLink {
  text: string;
  url: string;
  source: 'NICE' | 'NHS' | 'GOV.UK' | 'CDC' | 'PubMed' | 'AET' | 'EEF' | 'Autism-Europe' | 'EASNIE';
  pmid?: string;
}

export interface BreathingExercise {
  id: string;
  name: string;
  shortName: string;
  description: string;
  pattern: string;
  inhale: number;
  hold?: number;
  exhale: number;
  holdAfterExhale?: number;
  duration: number;
  ageMin?: number;
  warnings?: string[];
}

export interface CalmingTechnique {
  id: string;
  name: string;
  description: string;
  steps: string[];
  duration: number;
  tags: string[];
  ageAdaptations: Record<AgeBand, string>;
}

export interface CrisisResource {
  country: CountryType;
  name: string;
  phone: string;
  description: string;
  url?: string;
  hours?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: 'streak' | 'sessions' | 'skills' | 'first' | 'milestone' | 'xp' | 'quest' | 'plan' | 'tools' | 'workplace' | 'research' | 'pathways' | 'ai-chat';
    count?: number;
  };
  xpReward?: number;
}

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface CalmSession {
  timestamp: string;
  exerciseId: string;
  duration: number;
  moodBefore?: MoodRating;
  moodAfter?: MoodRating;
  notes?: string;
}

export interface SkillPracticeSession {
  timestamp: string;
  skillId: string;
  duration: number;
  masteryLevel: number;
  notes?: string;
  completed: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: 'calm' | 'skill' | 'streak' | 'time';
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  date: string;
}

export interface SkillMastery {
  skillId: string;
  level: number; // 0-5 (Novice, Beginner, Intermediate, Advanced, Expert, Master)
  practiceCount: number;
  totalMinutes: number;
  lastPracticed: string | null;
  notes: string[];
  isFavorite: boolean;
}

export interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  xpReward: number;
}

export interface PersonalBest {
  longestSession: number; // minutes
  mostXPInDay: number;
  mostSessionsInDay: number;
  highestCombo: number;
  fastestLevelUp: number; // hours
  perfectWeek: boolean; // All 7 days active
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedAt?: string;
  category: 'sessions' | 'time' | 'skills' | 'streak' | 'xp' | 'level';
}

export interface ComboTracker {
  currentCombo: number; // Consecutive days
  longestCombo: number;
  todayActivities: number;
  lastComboDate: string | null;
}

export interface ProgressData {
  // Basic stats
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  skillsPracticed: Set<string>;
  plansCompleted: number;
  lastActivityDate: string | null;
  earnedBadges: string[];
  weeklyActivity: Record<string, number>;
  
  // Gamification
  totalXP: number;
  currentLevel: number;
  dailyQuests: DailyQuest[];
  achievements: Achievement[];
  
  // Skill mastery tracking
  skillMastery: Record<string, SkillMastery>;
  
  // Session history
  calmSessions: CalmSession[];
  skillSessions: SkillPracticeSession[];
  
  // Streak protection (earned through quests/achievements)
  streakProtections: number;
  
  // Preferences
  favoriteSkills: string[];
  favoriteExercises: string[];
  
  // Advanced Gamification
  personalBests: PersonalBest;
  milestones: Milestone[];
  comboTracker: ComboTracker;
  totalStars: number; // Earned from perfect sessions
  consecutivePerfectSessions: number;
  moodImprovementCount: number; // Times mood improved after session
}

export interface PlanInput {
  audience: AudienceType;
  ageBand: AgeBand;
  mainNeed: string;
  setting: SettingType;
}

export interface GeneratedPlan {
  doNow: string[];
  buildThisWeek: string[];
  measurementSuggestion: string;
  resources: EvidenceLink[];
}

export interface MythFact {
  myth: string;
  fact: string;
  sources: EvidenceLink[];
}
