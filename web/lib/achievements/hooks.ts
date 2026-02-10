/**
 * Achievement Hooks
 * 
 * React hooks for accessing user achievements
 */

import { useMemo } from 'react';
import { useUserPreferencesState } from '../user-preferences/useUserPreferences';
import {
  checkAchievements,
  getAchievementProgress,
  getAchievementsByCategory,
  type Achievement,
} from './engine';

/**
 * Hook to get all achievements
 */
export function useAchievements(): Achievement[] {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return [];
    return checkAchievements(myPlan.savedItems);
  }, [myPlan.savedItems, isLoaded]);
}

/**
 * Hook to get earned achievements
 */
export function useEarnedAchievements(): Achievement[] {
  const achievements = useAchievements();
  return useMemo(() => achievements.filter(a => a.earned), [achievements]);
}

/**
 * Hook to get achievement progress percentage
 */
export function useAchievementProgress(): number {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return 0;
    return getAchievementProgress(myPlan.savedItems);
  }, [myPlan.savedItems, isLoaded]);
}

/**
 * Hook to get achievements organized by category
 */
export function useAchievementsByCategory(): Record<string, Achievement[]> {
  const { myPlan, isLoaded } = useUserPreferencesState();

  return useMemo(() => {
    if (!isLoaded) return {};
    return getAchievementsByCategory(myPlan.savedItems);
  }, [myPlan.savedItems, isLoaded]);
}
