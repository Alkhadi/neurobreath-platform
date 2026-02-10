/**
 * Analytics Hooks
 * 
 * React hooks for tracking user behavior and accessing analytics data.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  trackEvent,
  getAnalyticsSummary,
  getEventsByType,
  initializeAnalytics,
} from './engine';
import type { AnalyticsSummary, AnalyticsEvent } from './schema';
import type { SavedItemType } from '../user-preferences/schema';

/**
 * Hook to track analytics events
 */
export function useAnalytics() {
  const trackItemSaved = useCallback(
    (itemType: SavedItemType, itemId: string, itemTitle: string, tags?: string[]) => {
      trackEvent({
        type: 'item_saved',
        data: { itemType, itemId, itemTitle, tags },
      });
    },
    []
  );

  const trackItemRemoved = useCallback(
    (itemType: SavedItemType, itemId: string) => {
      trackEvent({
        type: 'item_removed',
        data: { itemType, itemId },
      });
    },
    []
  );

  const trackJourneyStarted = useCallback((journeyId: string, journeyTitle: string) => {
    trackEvent({
      type: 'journey_started',
      data: { journeyId, journeyTitle, startedAt: Date.now() },
    });
  }, []);

  const trackJourneyProgress = useCallback(
    (journeyId: string, journeyTitle: string, progress: number, currentStep: number, totalSteps: number) => {
      trackEvent({
        type: 'journey_progress',
        data: { journeyId, journeyTitle, progress, currentStep, totalSteps },
      });
    },
    []
  );

  const trackJourneyCompleted = useCallback(
    (journeyId: string, journeyTitle: string, startedAt: number) => {
      const completedAt = Date.now();
      const durationMs = completedAt - startedAt;
      trackEvent({
        type: 'journey_completed',
        data: { journeyId, journeyTitle, startedAt, completedAt, durationMs },
      });
    },
    []
  );

  const trackRoutineUpdated = useCallback((routineId: string, changeType: string) => {
    trackEvent({
      type: 'routine_updated',
      data: { routineId, changeType, updatedAt: Date.now() },
    });
  }, []);

  const trackReadingLevelChanged = useCallback((from: string, to: string) => {
    trackEvent({
      type: 'reading_level_changed',
      data: { from, to },
    });
  }, []);

  const trackTTSUsed = useCallback((textLength: number, voice: string, rate: number) => {
    trackEvent({
      type: 'tts_used',
      data: { textLength, voice, rate },
    });
  }, []);

  const trackAchievementEarned = useCallback(
    (achievementId: string, achievementTitle: string, category: string) => {
      trackEvent({
        type: 'achievement_earned',
        data: { achievementId, achievementTitle, category },
      });
    },
    []
  );

  const trackPageView = useCallback((page: string, region?: string) => {
    trackEvent({
      type: 'page_viewed',
      data: { page, region, viewedAt: Date.now() },
    });
  }, []);

  return {
    trackItemSaved,
    trackItemRemoved,
    trackJourneyStarted,
    trackJourneyProgress,
    trackJourneyCompleted,
    trackRoutineUpdated,
    trackReadingLevelChanged,
    trackTTSUsed,
    trackAchievementEarned,
    trackPageView,
  };
}

/**
 * Hook to access analytics summary
 */
export function useAnalyticsSummary(): AnalyticsSummary {
  const [summary, setSummary] = useState<AnalyticsSummary>(() => {
    // Initialize on mount
    initializeAnalytics();
    return getAnalyticsSummary();
  });

  useEffect(() => {
    // Refresh summary every 5 seconds to catch updates
    const interval = setInterval(() => {
      setSummary(getAnalyticsSummary());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return summary;
}

/**
 * Hook to get events by type
 */
export function useAnalyticsEvents(type: AnalyticsEvent['type']): AnalyticsEvent[] {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => getEventsByType(type));

  useEffect(() => {
    // Refresh events every 5 seconds
    const interval = setInterval(() => {
      setEvents(getEventsByType(type));
    }, 5000);

    return () => clearInterval(interval);
  }, [type]);

  return events;
}

/**
 * Hook for journey completion rate
 */
export function useJourneyCompletionRate(): number {
  const summary = useAnalyticsSummary();
  
  if (summary.totalJourneysStarted === 0) return 0;
  
  return Math.round((summary.totalJourneysCompleted / summary.totalJourneysStarted) * 100);
}

/**
 * Hook for activity trends
 */
export function useActivityTrend(days: number = 7): { date: string; count: number }[] {
  const [trend, setTrend] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const events = getEventsByType('item_saved')
      .concat(getEventsByType('journey_completed'))
      .concat(getEventsByType('routine_updated'));

    const dateMap = new Map<string, number>();
    
    // Count events per day
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    // Build trend array for last N days
    const trendData: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendData.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0,
      });
    }

    setTrend(trendData);
  }, [days]);

  return trend;
}
