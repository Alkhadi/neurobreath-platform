import type { FocusProgress } from './types';

const STORAGE_KEY = 'nb:focus:v1:progress';

const getDefaultProgress = (): FocusProgress => ({
  practiceCount: 0,
  totalFocusMinutes: 0,
  drillsCompleted: 0,
  lastPracticeDate: null,
  weeklyActivity: {},
});

const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const loadFocusProgress = (): FocusProgress => {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultProgress();
    }

    const parsed = JSON.parse(stored);
    return {
      ...getDefaultProgress(),
      ...parsed,
    };
  } catch (error) {
    console.error('Error loading focus progress:', error);
    return getDefaultProgress();
  }
};

export const saveFocusProgress = (progress: FocusProgress): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving focus progress:', error);
  }
};

export const incrementPracticeCount = (): FocusProgress => {
  const progress = loadFocusProgress();
  const todayKey = getTodayKey();

  const updated: FocusProgress = {
    ...progress,
    practiceCount: progress.practiceCount + 1,
    lastPracticeDate: todayKey,
    weeklyActivity: {
      ...progress.weeklyActivity,
      [todayKey]: (progress.weeklyActivity[todayKey] || 0) + 1,
    },
  };

  saveFocusProgress(updated);
  return updated;
};

export const logFocusDrill = (minutes: number): FocusProgress => {
  const progress = loadFocusProgress();
  const todayKey = getTodayKey();

  const updated: FocusProgress = {
    ...progress,
    totalFocusMinutes: progress.totalFocusMinutes + minutes,
    drillsCompleted: progress.drillsCompleted + 1,
    lastPracticeDate: todayKey,
    weeklyActivity: {
      ...progress.weeklyActivity,
      [todayKey]: (progress.weeklyActivity[todayKey] || 0) + 1,
    },
  };

  saveFocusProgress(updated);
  return updated;
};

export const resetFocusProgress = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting focus progress:', error);
  }
};
