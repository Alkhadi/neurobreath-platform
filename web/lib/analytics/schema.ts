/**
 * Analytics Schema
 * 
 * Privacy-focused client-side analytics for user behavior tracking.
 * All data stored locally in localStorage, no external tracking.
 */

import type { SavedItemType } from '../user-preferences/schema';

export type AnalyticsEventType =
  | 'item_saved'
  | 'item_removed'
  | 'journey_started'
  | 'journey_progress'
  | 'journey_completed'
  | 'routine_updated'
  | 'reading_level_changed'
  | 'tts_used'
  | 'page_viewed'
  | 'achievement_earned';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface ItemSavedEvent extends AnalyticsEvent {
  type: 'item_saved';
  data: {
    itemType: SavedItemType;
    itemId: string;
    itemTitle: string;
    tags?: string[];
  };
}

export interface JourneyProgressEvent extends AnalyticsEvent {
  type: 'journey_progress';
  data: {
    journeyId: string;
    journeyTitle: string;
    progress: number;
    currentStep: number;
    totalSteps: number;
  };
}

export interface JourneyCompletedEvent extends AnalyticsEvent {
  type: 'journey_completed';
  data: {
    journeyId: string;
    journeyTitle: string;
    startedAt: number;
    completedAt: number;
    durationMs: number;
  };
}

export interface ReadingLevelChangedEvent extends AnalyticsEvent {
  type: 'reading_level_changed';
  data: {
    from: string;
    to: string;
  };
}

export interface TTSUsedEvent extends AnalyticsEvent {
  type: 'tts_used';
  data: {
    textLength: number;
    voice: string;
    rate: number;
  };
}

export interface AchievementEarnedEvent extends AnalyticsEvent {
  type: 'achievement_earned';
  data: {
    achievementId: string;
    achievementTitle: string;
    category: string;
  };
}

/**
 * Analytics Summary
 * Aggregated statistics for quick access
 */
export interface AnalyticsSummary {
  totalSaves: number;
  totalJourneysStarted: number;
  totalJourneysCompleted: number;
  totalRoutineUpdates: number;
  totalTTSUsage: number;
  totalAchievements: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  mostUsedTags: string[];
  averageJourneyCompletionTime: number; // milliseconds
}

/**
 * Analytics Store
 */
export interface AnalyticsStore {
  version: number;
  events: AnalyticsEvent[];
  summary: AnalyticsSummary;
}

export const ANALYTICS_SCHEMA_VERSION = 1;
export const ANALYTICS_STORAGE_KEY = 'neurobreath_analytics_v1';
export const MAX_EVENTS_STORED = 1000; // Keep last 1000 events

/**
 * Default analytics summary
 */
export function createDefaultAnalyticsSummary(): AnalyticsSummary {
  return {
    totalSaves: 0,
    totalJourneysStarted: 0,
    totalJourneysCompleted: 0,
    totalRoutineUpdates: 0,
    totalTTSUsage: 0,
    totalAchievements: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString(),
    mostUsedTags: [],
    averageJourneyCompletionTime: 0,
  };
}

/**
 * Create default analytics store
 */
export function createDefaultAnalyticsStore(): AnalyticsStore {
  return {
    version: ANALYTICS_SCHEMA_VERSION,
    events: [],
    summary: createDefaultAnalyticsSummary(),
  };
}
