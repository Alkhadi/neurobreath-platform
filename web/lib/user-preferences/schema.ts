/**
 * Unified User Preferences Schema
 * 
 * Combines Guest Profile (preferences, accessibility settings) and My Plan (saved items, progress)
 * into a single versioned schema with safe migrations.
 * 
 * Privacy: All data stored locally only. No sensitive health/diagnostic data.
 */

export const CURRENT_SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'neurobreath.userprefs.v1';

// Legacy keys for migration
export const LEGACY_KEYS = {
  guestProfile: 'neurobreath.guestProfile.v1',
  myPlan: 'neurobreath.myplan.v1',
};

// Region/locale preferences
export type RegionPreference = 'uk' | 'us' | 'auto';
export type Region = 'uk' | 'us';

// Reading complexity levels
export type ReadingLevel = 'simple' | 'standard' | 'detailed';

// Accessibility preferences
export type ReducedMotionPreference = 'system' | 'on' | 'off';
export type TextSizePreference = 'system' | 'large' | 'xlarge';
export type ContrastPreference = 'system' | 'high' | 'normal';

// TTS (Text-to-Speech) Settings
export interface TTSSettings {
  enabled: boolean;
  autoSpeak: boolean;
  rate: number; // 0.8 - 1.2, default 1.0
  voice: string | 'system';
  filterNonAlphanumeric: boolean; // Remove emojis/symbols
  preferUKVoice: boolean;
}

// Guest Profile (Preferences + Accessibility)
export interface GuestPreferences {
  regionPreference: RegionPreference;
  readingLevel: ReadingLevel;
  dyslexiaMode: boolean;
  reducedMotion: ReducedMotionPreference;
  textSize: TextSizePreference;
  contrast: ContrastPreference;
  tts: TTSSettings;
}

// My Plan: Saved Items
export type SavedItemType = 'tool' | 'guide' | 'condition' | 'journey' | 'printable';

export interface SavedItem {
  id: string; // unique identifier
  type: SavedItemType;
  title: string;
  href: string; // relative path
  tags: string[];
  region: Region;
  savedAt: string; // ISO timestamp
  note?: string;
}

// My Plan: Journey Progress
export interface JourneyProgress {
  journeyId: string;
  currentStep: number;
  totalSteps: number;
  startedAt: string;
  updatedAt: string;
  completed: boolean;
}

// My Plan: Routine Planner
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface RoutineSlot {
  day: DayOfWeek;
  timeOfDay: TimeOfDay;
  itemRef: string; // SavedItem id
  duration?: number; // optional duration in minutes
}

export interface RoutinePlan {
  slots: RoutineSlot[];
  presetName?: string; // e.g., "Work focus", "After school wind-down"
}

// My Plan State
export interface MyPlanState {
  savedItems: SavedItem[];
  journeyProgress: Record<string, JourneyProgress>; // journeyId -> progress
  routinePlan: RoutinePlan;
}

// Root State
export interface UserPreferencesState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  preferences: GuestPreferences;
  myPlan: MyPlanState;
}

// Default values
export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  enabled: false,
  autoSpeak: false,
  rate: 1.0,
  voice: 'system',
  filterNonAlphanumeric: true,
  preferUKVoice: false,
};

export const DEFAULT_GUEST_PREFERENCES: GuestPreferences = {
  regionPreference: 'auto',
  readingLevel: 'standard',
  dyslexiaMode: false,
  reducedMotion: 'system',
  textSize: 'system',
  contrast: 'system',
  tts: DEFAULT_TTS_SETTINGS,
};

export const DEFAULT_MY_PLAN_STATE: MyPlanState = {
  savedItems: [],
  journeyProgress: {},
  routinePlan: {
    slots: [],
  },
};

export const DEFAULT_USER_PREFERENCES_STATE: UserPreferencesState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  preferences: DEFAULT_GUEST_PREFERENCES,
  myPlan: DEFAULT_MY_PLAN_STATE,
};

// Type guards
export function isValidRegion(value: unknown): value is Region {
  return value === 'uk' || value === 'us';
}

export function isValidReadingLevel(value: unknown): value is ReadingLevel {
  return value === 'simple' || value === 'standard' || value === 'detailed';
}

export function isValidSavedItemType(value: unknown): value is SavedItemType {
  return (
    value === 'tool' ||
    value === 'guide' ||
    value === 'condition' ||
    value === 'journey' ||
    value === 'printable'
  );
}
