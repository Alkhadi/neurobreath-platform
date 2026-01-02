// ADHD Progress Store
// Centralised state management with namespaced localStorage keys
// Migrates from legacy keys: adhd_quest_progress, adhd_practiced_skills, adhd_pomodoro_stats

// Namespace: nb:adhd:v2:*
const STORAGE_KEYS = {
  PROGRESS: 'nb:adhd:v2:progress',
  PREFS: 'nb:adhd:v2:prefs',
  LOGS: 'nb:adhd:v2:logs',
} as const;

// Legacy keys for migration
const LEGACY_KEYS = {
  QUEST_PROGRESS: 'adhd_quest_progress',
  PRACTICED_SKILLS: 'adhd_practiced_skills',
  POMODORO_STATS: 'adhd_pomodoro_stats',
} as const;

export interface ADHDProgress {
  quests: {
    completedToday: string[];
    completedAll: string[];
    currentStreak: number;
    longestStreak: number;
    lastCompletionDate: string | null;
    totalXP: number;
    level: number;
  };
  skills: {
    practiced: Set<string>;
    practiceLog: Array<{
      skillId: string;
      timestamp: number;
      duration?: number;
    }>;
  };
  focus: {
    totalPomodoros: number;
    totalFocusMinutes: number;
    sessionsToday: number;
    lastSessionDate: string | null;
    stats: Array<{
      timestamp: number;
      duration: number;
      type: 'work' | 'break';
    }>;
  };
}

export interface ADHDPreferences {
  audience: 'adult' | 'parent' | 'teacher' | 'employer' | 'teen';
  region: 'UK' | 'US' | 'EU';
  showTutorial: boolean;
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

// Migration function (runs once on first load)
function migrateFromLegacyKeys(): void {
  if (typeof window === 'undefined') return;
  
  const migrationFlag = 'nb:adhd:migration_complete';
  if (localStorage.getItem(migrationFlag)) return; // Already migrated
  
  console.log('[ADHD Store] Migrating from legacy keys...');
  
  try {
    // Migrate quest progress
    const oldQuestProgress = localStorage.getItem(LEGACY_KEYS.QUEST_PROGRESS);
    if (oldQuestProgress) {
      const parsed = JSON.parse(oldQuestProgress);
      const currentProgress = getDefaultProgress();
      currentProgress.quests = { ...currentProgress.quests, ...parsed };
      setStorage(STORAGE_KEYS.PROGRESS, currentProgress);
    }
    
    // Migrate practiced skills
    const oldPracticedSkills = localStorage.getItem(LEGACY_KEYS.PRACTICED_SKILLS);
    if (oldPracticedSkills) {
      const parsed = JSON.parse(oldPracticedSkills);
      const currentProgress = getProgress();
      currentProgress.skills.practiced = new Set(parsed);
      setStorage(STORAGE_KEYS.PROGRESS, currentProgress);
    }
    
    // Migrate pomodoro stats
    const oldPomodoroStats = localStorage.getItem(LEGACY_KEYS.POMODORO_STATS);
    if (oldPomodoroStats) {
      const parsed = JSON.parse(oldPomodoroStats);
      const currentProgress = getProgress();
      currentProgress.focus = { ...currentProgress.focus, ...parsed };
      setStorage(STORAGE_KEYS.PROGRESS, currentProgress);
    }
    
    // Mark migration complete
    localStorage.setItem(migrationFlag, 'true');
    console.log('[ADHD Store] Migration complete');
  } catch (error) {
    console.error('[ADHD Store] Migration failed:', error);
  }
}

// Default values
function getDefaultProgress(): ADHDProgress {
  return {
    quests: {
      completedToday: [],
      completedAll: [],
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      totalXP: 0,
      level: 1,
    },
    skills: {
      practiced: new Set<string>(),
      practiceLog: [],
    },
    focus: {
      totalPomodoros: 0,
      totalFocusMinutes: 0,
      sessionsToday: 0,
      lastSessionDate: null,
      stats: [],
    },
  };
}

function getDefaultPreferences(): ADHDPreferences {
  return {
    audience: 'adult',
    region: 'UK',
    showTutorial: true,
  };
}

// Public API
export function initADHDStore(): void {
  migrateFromLegacyKeys();
}

export function getProgress(): ADHDProgress {
  const progress = getStorage(STORAGE_KEYS.PROGRESS, getDefaultProgress());
  // Convert practiced Set (stored as array)
  if (Array.isArray(progress.skills.practiced)) {
    progress.skills.practiced = new Set(progress.skills.practiced);
  }
  return progress;
}

export function setProgress(progress: ADHDProgress): void {
  // Convert Set to array for storage
  const storageProgress = {
    ...progress,
    skills: {
      ...progress.skills,
      practiced: Array.from(progress.skills.practiced),
    },
  };
  setStorage(STORAGE_KEYS.PROGRESS, storageProgress);
}

export function getPreferences(): ADHDPreferences {
  return getStorage(STORAGE_KEYS.PREFS, getDefaultPreferences());
}

export function setPreferences(prefs: ADHDPreferences): void {
  setStorage(STORAGE_KEYS.PREFS, prefs);
}

// Quest helpers
export function completeQuest(questId: string, xpReward: number): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if quest already completed today
  if (progress.quests.completedToday.includes(questId)) return;
  
  // Add to completed
  progress.quests.completedToday.push(questId);
  if (!progress.quests.completedAll.includes(questId)) {
    progress.quests.completedAll.push(questId);
  }
  
  // Update XP and level
  progress.quests.totalXP += xpReward;
  progress.quests.level = Math.floor(progress.quests.totalXP / 500) + 1;
  
  // Update streak
  if (progress.quests.lastCompletionDate === today) {
    // Already completed a quest today, streak continues
  } else if (progress.quests.lastCompletionDate) {
    const lastDate = new Date(progress.quests.lastCompletionDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      progress.quests.currentStreak++;
    } else if (diffDays > 1) {
      progress.quests.currentStreak = 1;
    }
  } else {
    progress.quests.currentStreak = 1;
  }
  
  progress.quests.lastCompletionDate = today;
  progress.quests.longestStreak = Math.max(progress.quests.longestStreak, progress.quests.currentStreak);
  
  setProgress(progress);
}

export function resetDailyQuests(): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (progress.quests.lastCompletionDate !== today) {
    progress.quests.completedToday = [];
    setProgress(progress);
  }
}

// Skill helpers
export function logSkillPractice(skillId: string, duration?: number): void {
  const progress = getProgress();
  
  progress.skills.practiced.add(skillId);
  progress.skills.practiceLog.push({
    skillId,
    timestamp: Date.now(),
    duration,
  });
  
  setProgress(progress);
}

// Focus helpers
export function logFocusSession(duration: number, type: 'work' | 'break'): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (type === 'work') {
    progress.focus.totalPomodoros++;
    progress.focus.totalFocusMinutes += duration;
    
    if (progress.focus.lastSessionDate === today) {
      progress.focus.sessionsToday++;
    } else {
      progress.focus.sessionsToday = 1;
    }
    
    progress.focus.lastSessionDate = today;
  }
  
  progress.focus.stats.push({
    timestamp: Date.now(),
    duration,
    type,
  });
  
  // Keep only last 100 sessions
  if (progress.focus.stats.length > 100) {
    progress.focus.stats = progress.focus.stats.slice(-100);
  }
  
  setProgress(progress);
}

// Reset helper
export function resetADHDProgress(): void {
  if (typeof window === 'undefined') return;
  
  if (confirm('Are you sure you want to reset all ADHD progress? This cannot be undone.')) {
    setStorage(STORAGE_KEYS.PROGRESS, getDefaultProgress());
    window.location.reload();
  }
}
