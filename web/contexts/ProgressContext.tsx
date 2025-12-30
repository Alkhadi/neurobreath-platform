import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';

interface ProgressState {
  streakDays: number;
  lastPracticeDate: string | null;
  minutesToday: number;
  totalMinutes: number;
  sessionsToday: number;
  totalSessions: number;
  lettersCompleted: Set<string>;
  gamesCompleted: number;
  badgesEarned: Set<string>;
}

interface ProgressContextType extends ProgressState {
  updateProgress: (updates: Partial<ProgressState>) => void;
  addLetterCompleted: (letter: string) => void;
  incrementGameCompleted: () => void;
  addBadgeEarned: (badge: string) => void;
  addMinutes: (minutes: number) => void;
  incrementSession: () => void;
  hydrated: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'neurobreath-progress';

// Default state - ALWAYS used for SSR/initial render
const defaultState: ProgressState = {
  streakDays: 0,
  lastPracticeDate: null,
  minutesToday: 0,
  totalMinutes: 0,
  sessionsToday: 0,
  totalSessions: 0,
  lettersCompleted: new Set(),
  gamesCompleted: 0,
  badgesEarned: new Set(),
};

function saveState(state: ProgressState) {
  try {
    const toSave = {
      ...state,
      lettersCompleted: Array.from(state.lettersCompleted),
      badgesEarned: Array.from(state.badgesEarned),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Always start with default state for SSR/hydration consistency
  const [state, setState] = useState<ProgressState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage AFTER mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          ...parsed,
          lettersCompleted: new Set(parsed.lettersCompleted || []),
          badgesEarned: new Set(parsed.badgesEarned || []),
        });
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    setHydrated(true);
  }, []);

  // Save to localStorage whenever state changes (but only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [hydrated, state]);

  const updateProgress = useCallback((updates: Partial<ProgressState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addLetterCompleted = useCallback((letter: string) => {
    setState(prev => ({
      ...prev,
      lettersCompleted: new Set([...prev.lettersCompleted, letter.toUpperCase()])
    }));
  }, []);

  const incrementGameCompleted = useCallback(() => {
    setState(prev => ({ ...prev, gamesCompleted: prev.gamesCompleted + 1 }));
  }, []);

  const addBadgeEarned = useCallback((badge: string) => {
    setState(prev => ({
      ...prev,
      badgesEarned: new Set([...prev.badgesEarned, badge])
    }));
  }, []);

  const addMinutes = useCallback((minutes: number) => {
    setState(prev => ({
      ...prev,
      minutesToday: prev.minutesToday + minutes,
      totalMinutes: prev.totalMinutes + minutes
    }));
  }, []);

  const incrementSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionsToday: prev.sessionsToday + 1,
      totalSessions: prev.totalSessions + 1
    }));
  }, []);

  const value: ProgressContextType = useMemo(() => ({
    ...state,
    updateProgress,
    addLetterCompleted,
    incrementGameCompleted,
    addBadgeEarned,
    addMinutes,
    incrementSession,
    hydrated,
  }), [state, hydrated, updateProgress, addLetterCompleted, incrementGameCompleted, addBadgeEarned, addMinutes, incrementSession]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
