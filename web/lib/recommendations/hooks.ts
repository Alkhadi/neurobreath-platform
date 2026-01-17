/**
 * Recommendation Hooks
 * 
 * React hooks for accessing personalized recommendations.
 */

import { useMemo } from 'react';
import { useUserPreferencesState } from '../user-preferences/useUserPreferences';
import {
  getAllRecommendations,
  getRecommendedJourneys,
  getRecommendedGuides,
  getRecommendedTools,
  getNextSuggestedAction,
  type Recommendation,
} from './engine';

/**
 * Hook to get all recommendations
 */
export function useRecommendations(): {
  journeys: Recommendation[];
  guides: Recommendation[];
  tools: Recommendation[];
  isLoading: boolean;
} {
  const { myPlan, isLoaded } = useUserPreferencesState();

  const recommendations = useMemo(() => {
    if (!isLoaded) {
      return { journeys: [], guides: [], tools: [] };
    }
    return getAllRecommendations(myPlan.savedItems);
  }, [myPlan.savedItems, isLoaded]);

  return {
    ...recommendations,
    isLoading: !isLoaded,
  };
}

/**
 * Hook to get recommended journeys
 */
export function useRecommendedJourneys(maxResults: number = 5): Recommendation[] {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return [];
    return getRecommendedJourneys(myPlan.savedItems, maxResults);
  }, [myPlan.savedItems, isLoaded, maxResults]);
}

/**
 * Hook to get recommended guides
 */
export function useRecommendedGuides(maxResults: number = 5): Recommendation[] {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return [];
    return getRecommendedGuides(myPlan.savedItems, maxResults);
  }, [myPlan.savedItems, isLoaded, maxResults]);
}

/**
 * Hook to get recommended tools
 */
export function useRecommendedTools(maxResults: number = 3): Recommendation[] {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return [];
    return getRecommendedTools(myPlan.savedItems, maxResults);
  }, [myPlan.savedItems, isLoaded, maxResults]);
}

/**
 * Hook to get next suggested action
 */
export function useNextSuggestedAction(): Recommendation | null {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return null;
    return getNextSuggestedAction(myPlan.savedItems);
  }, [myPlan.savedItems, isLoaded]);
}
