/**
 * Analytics Storage Engine
 * 
 * Privacy-focused client-side analytics storage using localStorage.
 * No external tracking, all data stays on user's device.
 */

import {
  AnalyticsStore,
  AnalyticsEvent,
  AnalyticsSummary,
  createDefaultAnalyticsStore,
  ANALYTICS_STORAGE_KEY,
  MAX_EVENTS_STORED,
} from './schema';

// In-memory cache
let memoryStore: AnalyticsStore | null = null;
let isInitialized = false;

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load analytics store from localStorage
 */
function loadFromStorage(): AnalyticsStore {
  if (!isStorageAvailable()) {
    return createDefaultAnalyticsStore();
  }

  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return createDefaultAnalyticsStore();

    const parsed = JSON.parse(raw) as AnalyticsStore;
    return parsed;
  } catch (error) {
    console.error('[Analytics] Failed to load from storage:', error);
    return createDefaultAnalyticsStore();
  }
}

/**
 * Save analytics store to localStorage
 */
function saveToStorage(store: AnalyticsStore): void {
  if (!isStorageAvailable()) return;

  try {
    const serialized = JSON.stringify(store);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('[Analytics] Failed to save to storage:', error);
  }
}

/**
 * Initialize analytics store
 */
export function initializeAnalytics(): AnalyticsStore {
  if (!isInitialized) {
    memoryStore = loadFromStorage();
    isInitialized = true;
  }
  return memoryStore!;
}

/**
 * Get current analytics store
 */
export function getAnalyticsStore(): AnalyticsStore {
  if (!memoryStore) {
    return initializeAnalytics();
  }
  return memoryStore;
}

/**
 * Track an analytics event
 */
export function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
  const store = getAnalyticsStore();

  // Create full event with ID and timestamp
  const fullEvent: AnalyticsEvent = {
    ...event,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };

  // Add to events array
  store.events.push(fullEvent);

  // Keep only last MAX_EVENTS_STORED events
  if (store.events.length > MAX_EVENTS_STORED) {
    store.events = store.events.slice(-MAX_EVENTS_STORED);
  }

  // Update summary
  updateSummary(store, fullEvent);

  // Persist to storage
  saveToStorage(store);
}

/**
 * Update analytics summary based on new event
 */
function updateSummary(store: AnalyticsStore, event: AnalyticsEvent): void {
  const { summary } = store;

  // Update last active date
  summary.lastActiveDate = new Date(event.timestamp).toISOString();

  // Update type-specific counters
  switch (event.type) {
    case 'item_saved':
      summary.totalSaves++;
      // Update most used tags
      if ('tags' in event.data && Array.isArray(event.data.tags)) {
        const tags = event.data.tags as string[];
        tags.forEach(tag => {
          if (!summary.mostUsedTags.includes(tag)) {
            summary.mostUsedTags.push(tag);
          }
        });
        // Keep only top 10 tags (simplified - could track counts)
        if (summary.mostUsedTags.length > 10) {
          summary.mostUsedTags = summary.mostUsedTags.slice(0, 10);
        }
      }
      break;

    case 'journey_started':
      summary.totalJourneysStarted++;
      break;

    case 'journey_completed':
      summary.totalJourneysCompleted++;
      // Update average completion time
      if ('durationMs' in event.data && typeof event.data.durationMs === 'number') {
        const currentAvg = summary.averageJourneyCompletionTime;
        const count = summary.totalJourneysCompleted;
        summary.averageJourneyCompletionTime = 
          (currentAvg * (count - 1) + event.data.durationMs) / count;
      }
      break;

    case 'routine_updated':
      summary.totalRoutineUpdates++;
      break;

    case 'tts_used':
      summary.totalTTSUsage++;
      break;

    case 'achievement_earned':
      summary.totalAchievements++;
      break;
  }

  // Update streak
  updateStreak(store);
}

/**
 * Update streak calculation
 * Checks for consecutive days of activity
 */
function updateStreak(store: AnalyticsStore): void {
  const { events, summary } = store;
  
  // Get unique activity dates
  const activityDates = new Set<string>();
  events.forEach(event => {
    // Avoid counting passive events as engagement
    if (event.type === 'page_viewed' || event.type === 'experiment_exposure') return;
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    activityDates.add(date);
  });

  const sortedDates = Array.from(activityDates).sort().reverse();
  
  if (sortedDates.length === 0) {
    summary.currentStreak = 0;
    return;
  }

  // Calculate current streak
  let currentStreak = 1;
  const today = new Date().toISOString().split('T')[0];
  
  if (sortedDates[0] === today || 
      isYesterday(sortedDates[0], today)) {
    for (let i = 0; i < sortedDates.length - 1; i++) {
      if (isConsecutiveDays(sortedDates[i + 1], sortedDates[i])) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  summary.currentStreak = currentStreak;
  
  // Update longest streak
  if (currentStreak > summary.longestStreak) {
    summary.longestStreak = currentStreak;
  }
}

/**
 * Check if date2 is yesterday relative to date1
 */
function isYesterday(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/**
 * Check if two dates are consecutive days
 */
function isConsecutiveDays(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2Str = date2; // Keep as string for comparison
  const nextDay = new Date(d1);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0] === d2Str.split('T')[0];
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary(): AnalyticsSummary {
  const store = getAnalyticsStore();
  return store.summary;
}

/**
 * Get events by type
 */
export function getEventsByType(type: AnalyticsEvent['type']): AnalyticsEvent[] {
  const store = getAnalyticsStore();
  return store.events.filter(event => event.type === type);
}

/**
 * Get events in date range
 */
export function getEventsInRange(startDate: Date, endDate: Date): AnalyticsEvent[] {
  const store = getAnalyticsStore();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  return store.events.filter(
    event => event.timestamp >= startTime && event.timestamp <= endTime
  );
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
  memoryStore = createDefaultAnalyticsStore();
  saveToStorage(memoryStore);
}
