/**
 * Hook for managing Word Family Sorting game progress in localStorage
 */

'use client';

import { useState, useEffect } from 'react';
import type { DifficultyLevel } from '@/lib/games/wordFamilyData';

export interface GameSession {
  date: string;
  difficulty: DifficultyLevel;
  score: number;
  accuracy: number;
  timeTaken: number;
  wordsMissed: Array<{ word: string; correctFamily: string }>;
}

export interface WordFamilyProgress {
  bestScores: {
    beginner: number;
    intermediate: number;
  };
  lastPlayed: string | null;
  totalSessions: number;
  sessionHistory: GameSession[];
}

const STORAGE_KEY = 'neurobreath_word_family_progress';
const MAX_HISTORY = 10;

const defaultProgress: WordFamilyProgress = {
  bestScores: {
    beginner: 0,
    intermediate: 0
  },
  lastPlayed: null,
  totalSessions: 0,
  sessionHistory: []
};

export function useWordFamilyProgress() {
  const [progress, setProgress] = useState<WordFamilyProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress(parsed);
      }
    } catch (error) {
      console.error('Failed to load word family progress:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save progress helper
  const saveProgress = (newProgress: WordFamilyProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save word family progress:', error);
    }
  };

  // Record a new session
  const recordSession = (session: GameSession) => {
    const newProgress: WordFamilyProgress = {
      bestScores: {
        ...progress.bestScores,
        [session.difficulty]: Math.max(
          progress.bestScores[session.difficulty],
          session.score
        )
      },
      lastPlayed: session.date,
      totalSessions: progress.totalSessions + 1,
      sessionHistory: [
        session,
        ...progress.sessionHistory.slice(0, MAX_HISTORY - 1)
      ]
    };

    saveProgress(newProgress);
  };

  // Get average accuracy
  const getAverageAccuracy = (): number => {
    if (progress.sessionHistory.length === 0) return 0;
    
    const total = progress.sessionHistory.reduce((sum, session) => sum + session.accuracy, 0);
    return Math.round(total / progress.sessionHistory.length);
  };

  // Reset progress
  const resetProgress = () => {
    saveProgress(defaultProgress);
  };

  return {
    progress,
    isLoaded,
    recordSession,
    getAverageAccuracy,
    resetProgress
  };
}
