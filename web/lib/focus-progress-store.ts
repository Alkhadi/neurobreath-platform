// Focus Progress Store
// Client-side localStorage for focus sprint tracking
// Namespace: nb:focus:v1:*

const STORAGE_KEY = 'nb:focus:v1:progress' as const;

export interface FocusProgress {
  completedBlocks: number;
  totalMinutes: number;
  completedToday: number;
  bestRun: number; // longest single session in minutes
  currentStreak: number; // consecutive days
  lastSessionDate: string | null;
  sessions: Array<{
    timestamp: number;
    duration: number;
    type: '2min' | '5min' | '10min' | 'drill';
    completed: boolean;
  }>;
}

// SSR-safe storage helper
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
  }
}

// Default values
function getDefaultProgress(): FocusProgress {
  return {
    completedBlocks: 0,
    totalMinutes: 0,
    completedToday: 0,
    bestRun: 0,
    currentStreak: 0,
    lastSessionDate: null,
    sessions: [],
  };
}

// Public API
export function getProgress(): FocusProgress {
  return getStorage(STORAGE_KEY, getDefaultProgress());
}

export function setProgress(progress: FocusProgress): void {
  setStorage(STORAGE_KEY, progress);
}

// Log a completed focus session
export function logFocusBlock(duration: number, type: '2min' | '5min' | '10min' | 'drill'): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  // Update stats
  progress.completedBlocks++;
  progress.totalMinutes += duration;
  
  // Update best run
  if (duration > progress.bestRun) {
    progress.bestRun = duration;
  }
  
  // Update daily count
  if (progress.lastSessionDate === today) {
    progress.completedToday++;
  } else {
    progress.completedToday = 1;
    
    // Update streak
    if (progress.lastSessionDate) {
      const lastDate = new Date(progress.lastSessionDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        progress.currentStreak++;
      } else if (diffDays > 1) {
        progress.currentStreak = 1;
      }
    } else {
      progress.currentStreak = 1;
    }
  }
  
  progress.lastSessionDate = today;
  
  // Add session log
  progress.sessions.push({
    timestamp: Date.now(),
    duration,
    type,
    completed: true,
  });
  
  // Keep only last 50 sessions
  if (progress.sessions.length > 50) {
    progress.sessions = progress.sessions.slice(-50);
  }
  
  setProgress(progress);
}

// Reset all progress
export function resetFocusProgress(): void {
  if (typeof window === 'undefined') return;
  
  if (confirm('Are you sure you want to reset all focus progress? This cannot be undone.')) {
    setStorage(STORAGE_KEY, getDefaultProgress());
    window.location.reload();
  }
}
