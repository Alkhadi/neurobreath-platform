/**
 * Achievement System
 * 
 * Defines and tracks user achievements/badges
 */

import { getAnalyticsSummary, trackEvent } from '../analytics/engine';
import type { SavedItem } from '../user-preferences/schema';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'getting-started' | 'consistency' | 'completion' | 'exploration';
  requirement: string;
  earned: boolean;
  earnedAt?: number;
}

/**
 * Check which achievements have been earned
 */
export function checkAchievements(savedItems: SavedItem[]): Achievement[] {
  const summary = getAnalyticsSummary();
  const savedCount = savedItems?.length ?? 0;

  const achievements: Achievement[] = [
    // Getting Started
    {
      id: 'first-save',
      title: 'First Save',
      description: 'Saved your first item to My Plan',
      icon: '📌',
      category: 'getting-started',
      requirement: 'Save 1 item',
      earned: savedCount >= 1,
    },
    {
      id: 'started-journey',
      title: 'Journey Begins',
      description: 'Started your first journey',
      icon: '🚀',
      category: 'getting-started',
      requirement: 'Start 1 journey',
      earned: summary.totalJourneysStarted >= 1,
    },
    {
      id: 'routine-builder',
      title: 'Routine Builder',
      description: 'Created your first routine',
      icon: '📅',
      category: 'getting-started',
      requirement: 'Update routine 1 time',
      earned: summary.totalRoutineUpdates >= 1,
    },

    // Consistency
    {
      id: 'three-day-streak',
      title: '3-Day Streak',
      description: 'Used NeuroBreath for 3 consecutive days',
      icon: '🔥',
      category: 'consistency',
      requirement: '3-day streak',
      earned: summary.longestStreak >= 3,
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      icon: '⚡',
      category: 'consistency',
      requirement: '7-day streak',
      earned: summary.longestStreak >= 7,
    },
    {
      id: 'dedication',
      title: 'Dedicated User',
      description: 'Achieved a 30-day streak',
      icon: '🏆',
      category: 'consistency',
      requirement: '30-day streak',
      earned: summary.longestStreak >= 30,
    },

    // Completion
    {
      id: 'first-completion',
      title: 'Journey Complete',
      description: 'Finished your first journey',
      icon: '✅',
      category: 'completion',
      requirement: 'Complete 1 journey',
      earned: summary.totalJourneysCompleted >= 1,
    },
    {
      id: 'three-journeys',
      title: 'Explorer',
      description: 'Completed 3 journeys',
      icon: '🗺️',
      category: 'completion',
      requirement: 'Complete 3 journeys',
      earned: summary.totalJourneysCompleted >= 3,
    },
    {
      id: 'five-journeys',
      title: 'Master Explorer',
      description: 'Completed 5 journeys',
      icon: '🌟',
      category: 'completion',
      requirement: 'Complete 5 journeys',
      earned: summary.totalJourneysCompleted >= 5,
    },

    // Exploration
    {
      id: 'five-saves',
      title: 'Collector',
      description: 'Saved 5 items to My Plan',
      icon: '🎯',
      category: 'exploration',
      requirement: 'Save 5 items',
      earned: savedCount >= 5,
    },
    {
      id: 'ten-saves',
      title: 'Curator',
      description: 'Saved 10 items to My Plan',
      icon: '📚',
      category: 'exploration',
      requirement: 'Save 10 items',
      earned: savedCount >= 10,
    },
    {
      id: 'tts-user',
      title: 'Voice User',
      description: 'Used text-to-speech feature',
      icon: '🔊',
      category: 'exploration',
      requirement: 'Use TTS 1 time',
      earned: summary.totalTTSUsage >= 1,
    },
  ];

  // Add earned timestamp for earned achievements
  achievements.forEach(achievement => {
    if (achievement.earned && !achievement.earnedAt) {
      achievement.earnedAt = Date.now();
    }
  });

  return achievements;
}

/**
 * Get newly earned achievements (not yet notified)
 */
export function getNewAchievements(savedItems: SavedItem[], lastChecked: number): Achievement[] {
  const allAchievements = checkAchievements(savedItems);
  return allAchievements.filter(
    a => a.earned && a.earnedAt && a.earnedAt > lastChecked
  );
}

/**
 * Track achievement earned event
 */
export function trackAchievement(achievement: Achievement): void {
  trackEvent({
    type: 'achievement_earned',
    data: {
      achievementId: achievement.id,
      achievementTitle: achievement.title,
      category: achievement.category,
    },
  });
}

/**
 * Get achievement progress (percentage of achievements earned)
 */
export function getAchievementProgress(savedItems: SavedItem[]): number {
  const achievements = checkAchievements(savedItems);
  const earned = achievements.filter(a => a.earned).length;
  return Math.round((earned / achievements.length) * 100);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(
  savedItems: SavedItem[]
): Record<string, Achievement[]> {
  const achievements = checkAchievements(savedItems);
  
  return achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
}
