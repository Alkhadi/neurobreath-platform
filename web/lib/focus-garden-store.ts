// Focus Garden Progress Store
// Centralized state management for Focus Garden gamification features
// Including: Streak Freezes, Garden Levels, Multi-day Quests, Enhanced Badges, Virtual Companion

const STORAGE_KEY = 'nb:focus-garden:v2:progress';

// ========== TYPES ==========

export type CompanionType = 'fox' | 'cat' | 'dog' | 'robot' | 'fairy';

export type CompanionMood = 
  | 'happy' // User is active, focusing well
  | 'excited' // Just achieved something
  | 'neutral' // Default state
  | 'lonely' // User hasn't been active
  | 'sleeping' // Long period of inactivity
  | 'encouraging' // During a session
  | 'proud'; // After harvest/achievement

export interface FocusGardenPlant {
  id: string;
  taskId: string;
  stage: 'seed' | 'sprout' | 'bud' | 'bloom';
  waterCount: number;
  layer: string;
  plantedAt: string;
  harvestedAt?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakFreezes: number;
  maxStreakFreezes: number;
  freezesUsedDates: string[];
  streakProtectedDates: string[];
}

export interface GardenLevel {
  level: number;
  name: string;
  description: string;
  xpRequired: number;
  unlockedFeatures: string[];
  gardenTheme: 'plot' | 'small-garden' | 'garden' | 'lush-garden' | 'paradise';
}

export interface MultiDayQuest {
  id: string;
  title: string;
  description: string;
  narrative: string;
  days: QuestDay[];
  currentDay: number;
  startedAt: string | null;
  completedAt: string | null;
  xpReward: number;
  badgeReward?: string;
  plantReward?: string;
  isActive: boolean;
  category: 'focus' | 'breathing' | 'mindfulness' | 'habit';
}

export interface QuestDay {
  day: number;
  title: string;
  description: string;
  task: string;
  completed: boolean;
  completedAt: string | null;
  xpReward: number;
}

export interface FocusGardenBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string | null;
  category: 'streak' | 'time' | 'growth' | 'resilience' | 'mastery' | 'special';
  requirement: {
    type: 'streak' | 'sessions' | 'time' | 'plants' | 'harvests' | 'level' | 'quest' | 'comeback' | 'time-of-day';
    count?: number;
    timeRange?: { start: number; end: number }; // Hours for time-of-day badges
  };
}

export interface CompanionData {
  type: CompanionType;
  name: string;
  mood: CompanionMood;
  level: number;
  xp: number;
  unlockedAccessories: string[];
  activeAccessory: string | null;
  lastInteraction: string | null;
  totalInteractions: number;
}

export interface FocusGardenProgress {
  // Core stats
  totalXP: number;
  level: number;
  totalSessions: number;
  totalMinutes: number;
  totalPlantsGrown: number;
  totalHarvests: number;

  // Garden state
  garden: FocusGardenPlant[];
  gardenLevel: number;

  // Streak system
  streak: StreakData;

  // Badges
  earnedBadges: string[];

  // Quests
  activeQuests: MultiDayQuest[];
  completedQuests: string[];

  // Session tracking
  sessionsToday: number;
  lastSessionTime: string | null;
  sessionHistory: SessionRecord[];

  // Achievements
  comebackCount: number; // Times returned after streak break
  earlyBirdSessions: number; // Sessions before 9am
  nightOwlSessions: number; // Sessions after 9pm
  deepBreathingSessions: number; // Sessions with breathing exercises
  perfectDays: number; // Days with 3+ sessions

  // Companion
  companion: CompanionData;
}

export interface SessionRecord {
  timestamp: string;
  duration: number;
  type: 'focus' | 'breathing' | 'task';
  xpEarned: number;
  plantId?: string;
}

// ========== CONSTANTS ==========

export const GARDEN_LEVELS: GardenLevel[] = [
  {
    level: 1,
    name: 'Bare Plot',
    description: 'A fresh plot of soil, ready for your first seeds',
    xpRequired: 0,
    unlockedFeatures: ['basic-plants'],
    gardenTheme: 'plot'
  },
  {
    level: 2,
    name: 'Budding Garden',
    description: 'Small sprouts emerge as your practice grows',
    xpRequired: 200,
    unlockedFeatures: ['basic-plants', 'garden-border'],
    gardenTheme: 'small-garden'
  },
  {
    level: 3,
    name: 'Growing Garden',
    description: 'A proper garden taking shape with varied plants',
    xpRequired: 500,
    unlockedFeatures: ['basic-plants', 'garden-border', 'decorations'],
    gardenTheme: 'garden'
  },
  {
    level: 4,
    name: 'Flourishing Garden',
    description: 'A lush, thriving garden full of life',
    xpRequired: 1000,
    unlockedFeatures: ['basic-plants', 'garden-border', 'decorations', 'rare-plants'],
    gardenTheme: 'lush-garden'
  },
  {
    level: 5,
    name: 'Paradise Garden',
    description: 'A magnificent garden paradise, testament to your dedication',
    xpRequired: 2000,
    unlockedFeatures: ['basic-plants', 'garden-border', 'decorations', 'rare-plants', 'special-effects'],
    gardenTheme: 'paradise'
  }
];

export const FOCUS_GARDEN_BADGES: FocusGardenBadge[] = [
  // Streak badges
  {
    id: 'first-streak',
    name: 'First Steps',
    description: 'Complete your first focus session',
    icon: '🌱',
    color: '#4CAF50',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'sessions', count: 1 }
  },
  {
    id: 'three-day-focus',
    name: '3-Day Focus',
    description: 'Maintain a 3-day focus streak',
    icon: '🔥',
    color: '#FF5722',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'streak', count: 3 }
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day focus streak',
    icon: '⚔️',
    color: '#9C27B0',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'streak', count: 7 }
  },
  {
    id: 'fortnight-focus',
    name: 'Fortnight Focus',
    description: 'Maintain a 14-day focus streak',
    icon: '🏆',
    color: '#FFD700',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'streak', count: 14 }
  },
  {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day focus streak',
    icon: '👑',
    color: '#E91E63',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'streak', count: 30 }
  },

  // Time-of-day badges
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 5 sessions before 9am',
    icon: '🌅',
    color: '#FF9800',
    earnedAt: null,
    category: 'time',
    requirement: { type: 'time-of-day', count: 5, timeRange: { start: 5, end: 9 } }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 5 sessions after 9pm',
    icon: '🦉',
    color: '#3F51B5',
    earnedAt: null,
    category: 'time',
    requirement: { type: 'time-of-day', count: 5, timeRange: { start: 21, end: 24 } }
  },

  // Growth badges
  {
    id: 'first-bloom',
    name: 'First Bloom',
    description: 'Grow your first plant to full bloom',
    icon: '🌸',
    color: '#E91E63',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 1 }
  },
  {
    id: 'garden-starter',
    name: 'Garden Starter',
    description: 'Harvest 5 fully bloomed plants',
    icon: '🌻',
    color: '#FFC107',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 5 }
  },
  {
    id: 'master-gardener',
    name: 'Master Gardener',
    description: 'Harvest 25 fully bloomed plants',
    icon: '🌺',
    color: '#9C27B0',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 25 }
  },
  {
    id: 'garden-guru',
    name: 'Garden Guru',
    description: 'Harvest 100 fully bloomed plants',
    icon: '🏵️',
    color: '#FFD700',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 100 }
  },

  // Resilience badges
  {
    id: 'resilience',
    name: 'Resilience',
    description: 'Return after a streak break and start again',
    icon: '💪',
    color: '#2196F3',
    earnedAt: null,
    category: 'resilience',
    requirement: { type: 'comeback', count: 1 }
  },
  {
    id: 'bounce-back',
    name: 'Bounce Back',
    description: 'Return after a streak break 3 times',
    icon: '🦋',
    color: '#00BCD4',
    earnedAt: null,
    category: 'resilience',
    requirement: { type: 'comeback', count: 3 }
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Return after a streak break 5 times - nothing stops you!',
    icon: '🔮',
    color: '#673AB7',
    earnedAt: null,
    category: 'resilience',
    requirement: { type: 'comeback', count: 5 }
  },

  // Mastery badges
  {
    id: 'deep-breather',
    name: 'Deep Breather',
    description: 'Complete 10 breathing exercises',
    icon: '🌬️',
    color: '#00BCD4',
    earnedAt: null,
    category: 'mastery',
    requirement: { type: 'sessions', count: 10 }
  },
  {
    id: 'focus-apprentice',
    name: 'Focus Apprentice',
    description: 'Accumulate 60 minutes of focus time',
    icon: '📚',
    color: '#795548',
    earnedAt: null,
    category: 'mastery',
    requirement: { type: 'time', count: 60 }
  },
  {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Accumulate 500 minutes of focus time',
    icon: '🎓',
    color: '#607D8B',
    earnedAt: null,
    category: 'mastery',
    requirement: { type: 'time', count: 500 }
  },

  // Level badges
  {
    id: 'garden-level-2',
    name: 'Budding Gardener',
    description: 'Reach Garden Level 2',
    icon: '🌿',
    color: '#8BC34A',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'level', count: 2 }
  },
  {
    id: 'garden-level-3',
    name: 'Skilled Gardener',
    description: 'Reach Garden Level 3',
    icon: '🌳',
    color: '#4CAF50',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'level', count: 3 }
  },
  {
    id: 'garden-level-4',
    name: 'Expert Gardener',
    description: 'Reach Garden Level 4',
    icon: '🌴',
    color: '#388E3C',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'level', count: 4 }
  },
  {
    id: 'garden-level-5',
    name: 'Legendary Gardener',
    description: 'Reach Garden Level 5 - Paradise!',
    icon: '🏝️',
    color: '#FFD700',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'level', count: 5 }
  },

  // Quest badges
  {
    id: 'quest-complete',
    name: 'Quest Complete',
    description: 'Complete your first multi-day quest',
    icon: '📜',
    color: '#FF9800',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'quest', count: 1 }
  },
  {
    id: 'quest-master',
    name: 'Quest Master',
    description: 'Complete 5 multi-day quests',
    icon: '🗺️',
    color: '#F44336',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'quest', count: 5 }
  }
];

export const MULTI_DAY_QUESTS: MultiDayQuest[] = [
  {
    id: '7-day-focus-challenge',
    title: '7-Day Focus Challenge',
    description: 'Build a strong foundation for focus through a week of guided practice',
    narrative: 'Begin your journey to mastery. Each day brings a new challenge to strengthen your focus and grow your garden.',
    days: [
      {
        day: 1,
        title: 'Plant Your First Seed',
        description: 'Every great garden starts with a single seed',
        task: 'Plant and water one task in your Focus Garden',
        completed: false,
        completedAt: null,
        xpReward: 20
      },
      {
        day: 2,
        title: 'Nurture Growth',
        description: 'Consistent care helps your garden flourish',
        task: 'Water 2 plants to help them grow',
        completed: false,
        completedAt: null,
        xpReward: 25
      },
      {
        day: 3,
        title: 'Expand Your Garden',
        description: 'A diverse garden is a resilient garden',
        task: 'Plant a task from a different category',
        completed: false,
        completedAt: null,
        xpReward: 30
      },
      {
        day: 4,
        title: 'Deep Roots',
        description: 'Strong roots lead to beautiful blooms',
        task: 'Complete a 5-minute breathing exercise',
        completed: false,
        completedAt: null,
        xpReward: 35
      },
      {
        day: 5,
        title: 'First Harvest',
        description: 'Reap the rewards of your dedication',
        task: 'Harvest your first fully bloomed plant',
        completed: false,
        completedAt: null,
        xpReward: 40
      },
      {
        day: 6,
        title: 'Growing Strong',
        description: 'Your garden thrives with consistent attention',
        task: 'Complete 3 focus tasks in one day',
        completed: false,
        completedAt: null,
        xpReward: 45
      },
      {
        day: 7,
        title: 'Garden Celebration',
        description: 'Celebrate a week of growth and focus',
        task: 'Have 3 or more plants growing simultaneously',
        completed: false,
        completedAt: null,
        xpReward: 50
      }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 200,
    badgeReward: 'quest-complete',
    plantReward: 'golden-flower',
    isActive: false,
    category: 'focus'
  },
  {
    id: 'calm-mind-journey',
    title: 'Calm Mind Journey',
    description: 'Master the art of calm through breathing and mindfulness',
    narrative: 'A peaceful mind is a focused mind. This journey will teach you the foundations of calm.',
    days: [
      {
        day: 1,
        title: 'First Breath',
        description: 'Begin with the basics of breathing',
        task: 'Complete a box breathing exercise',
        completed: false,
        completedAt: null,
        xpReward: 25
      },
      {
        day: 2,
        title: 'Morning Calm',
        description: 'Start your day with intention',
        task: 'Complete a breathing exercise before 10am',
        completed: false,
        completedAt: null,
        xpReward: 30
      },
      {
        day: 3,
        title: 'Zone Awareness',
        description: 'Learn to recognize your emotional state',
        task: 'Complete a Zone Check-In task',
        completed: false,
        completedAt: null,
        xpReward: 30
      },
      {
        day: 4,
        title: 'Calm Tools',
        description: 'Discover what helps you find calm',
        task: 'Use a Calm Tool task to regulate',
        completed: false,
        completedAt: null,
        xpReward: 35
      },
      {
        day: 5,
        title: 'Mindful Moment',
        description: 'Practice presence and awareness',
        task: 'Complete a mindfulness exercise',
        completed: false,
        completedAt: null,
        xpReward: 40
      }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 150,
    badgeReward: 'deep-breather',
    isActive: false,
    category: 'breathing'
  },
  {
    id: 'structure-builder',
    title: 'Structure Builder',
    description: 'Create routines that support your success',
    narrative: 'Structure is the foundation of achievement. Build systems that work for you.',
    days: [
      {
        day: 1,
        title: 'Morning Foundation',
        description: 'Start with a morning routine',
        task: 'Complete a Morning Routine task',
        completed: false,
        completedAt: null,
        xpReward: 25
      },
      {
        day: 2,
        title: 'Visual Planning',
        description: 'See your day laid out before you',
        task: 'Follow your Visual Schedule',
        completed: false,
        completedAt: null,
        xpReward: 25
      },
      {
        day: 3,
        title: 'Transition Mastery',
        description: 'Smooth transitions lead to better flow',
        task: 'Use a Transition Timer for activity changes',
        completed: false,
        completedAt: null,
        xpReward: 30
      },
      {
        day: 4,
        title: 'Break It Down',
        description: 'Big tasks become manageable with small steps',
        task: 'Complete a Task Breakdown exercise',
        completed: false,
        completedAt: null,
        xpReward: 35
      },
      {
        day: 5,
        title: 'Chain Reaction',
        description: 'Link your routines into a powerful chain',
        task: 'Complete a full Routine Chain',
        completed: false,
        completedAt: null,
        xpReward: 40
      },
      {
        day: 6,
        title: 'Week in View',
        description: 'Plan for long-term success',
        task: 'Create and follow a Weekly Planner',
        completed: false,
        completedAt: null,
        xpReward: 45
      }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 175,
    plantReward: 'structured-tree',
    isActive: false,
    category: 'habit'
  },
  {
    id: 'communication-quest',
    title: 'Communication Quest',
    description: 'Build confidence in expressing yourself',
    narrative: 'Your voice matters. Learn to communicate your needs and connect with others.',
    days: [
      {
        day: 1,
        title: 'Reach Out',
        description: 'Practice asking for what you need',
        task: 'Complete an Ask for Help task',
        completed: false,
        completedAt: null,
        xpReward: 25
      },
      {
        day: 2,
        title: 'Hello World',
        description: 'Small greetings make big connections',
        task: 'Practice a Greeting',
        completed: false,
        completedAt: null,
        xpReward: 25
      },
      {
        day: 3,
        title: 'Express Yourself',
        description: 'Let others know how you feel',
        task: 'Express a Feeling to someone',
        completed: false,
        completedAt: null,
        xpReward: 30
      },
      {
        day: 4,
        title: 'Back and Forth',
        description: 'Conversations are a two-way street',
        task: 'Practice Conversation Turns',
        completed: false,
        completedAt: null,
        xpReward: 35
      },
      {
        day: 5,
        title: 'Story Time',
        description: 'Learn through social narratives',
        task: 'Read and practice a Social Story',
        completed: false,
        completedAt: null,
        xpReward: 40
      }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 150,
    badgeReward: 'communicator',
    isActive: false,
    category: 'habit'
  }
];

// ========== HELPER FUNCTIONS ==========

function getDefaultProgress(): FocusGardenProgress {
  return {
    totalXP: 0,
    level: 1,
    totalSessions: 0,
    totalMinutes: 0,
    totalPlantsGrown: 0,
    totalHarvests: 0,
    garden: [],
    gardenLevel: 1,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakFreezes: 2, // Start with 2 streak freezes
      maxStreakFreezes: 3,
      freezesUsedDates: [],
      streakProtectedDates: []
    },
    earnedBadges: [],
    activeQuests: [],
    completedQuests: [],
    sessionsToday: 0,
    lastSessionTime: null,
    sessionHistory: [],
    comebackCount: 0,
    earlyBirdSessions: 0,
    nightOwlSessions: 0,
    deepBreathingSessions: 0,
    perfectDays: 0,
    companion: {
      type: 'fox', // Default companion
      name: 'Buddy',
      mood: 'neutral',
      level: 1,
      xp: 0,
      unlockedAccessories: [],
      activeAccessory: null,
      lastInteraction: null,
      totalInteractions: 0
    }
  };
}

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

function isToday(dateString: string | null): boolean {
  if (!dateString) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateString.split('T')[0] === today;
}

function isYesterday(dateString: string | null): boolean {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return dateString.split('T')[0] === yesterdayStr;
}

function getCurrentHour(): number {
  return new Date().getHours();
}

// ========== PUBLIC API ==========

export function loadFocusGardenProgress(): FocusGardenProgress {
  return getStorage(STORAGE_KEY, getDefaultProgress());
}

export function saveFocusGardenProgress(progress: FocusGardenProgress): void {
  setStorage(STORAGE_KEY, progress);
}

// Calculate garden level based on total XP
export function calculateGardenLevel(totalXP: number): GardenLevel {
  for (let i = GARDEN_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= GARDEN_LEVELS[i].xpRequired) {
      return GARDEN_LEVELS[i];
    }
  }
  return GARDEN_LEVELS[0];
}

// Get XP progress to next level
export function getGardenLevelProgress(totalXP: number): { current: number; required: number; percentage: number } {
  const currentLevel = calculateGardenLevel(totalXP);
  const currentLevelIndex = GARDEN_LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = GARDEN_LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return { current: totalXP, required: totalXP, percentage: 100 };
  }

  const xpInCurrentLevel = totalXP - currentLevel.xpRequired;
  const xpRequiredForNext = nextLevel.xpRequired - currentLevel.xpRequired;

  return {
    current: xpInCurrentLevel,
    required: xpRequiredForNext,
    percentage: Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100))
  };
}

// ========== STREAK MANAGEMENT ==========

export interface StreakUpdateResult {
  streakMaintained: boolean;
  streakBroken: boolean;
  freezeUsed: boolean;
  newStreak: number;
  isComeback: boolean;
}

export function updateStreak(): StreakUpdateResult {
  const progress = loadFocusGardenProgress();
  const today = new Date().toISOString().split('T')[0];

  const result: StreakUpdateResult = {
    streakMaintained: false,
    streakBroken: false,
    freezeUsed: false,
    newStreak: progress.streak.currentStreak,
    isComeback: false
  };

  // If already logged activity today, streak continues
  if (isToday(progress.streak.lastActivityDate)) {
    result.streakMaintained = true;
    return result;
  }

  // If activity was yesterday, increment streak
  if (isYesterday(progress.streak.lastActivityDate)) {
    progress.streak.currentStreak += 1;
    result.streakMaintained = true;
    result.newStreak = progress.streak.currentStreak;
  } else if (progress.streak.lastActivityDate) {
    // More than one day gap - check for streak freeze
    const daysSinceActivity = Math.floor(
      (new Date(today).getTime() - new Date(progress.streak.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // If only 2 days gap and we have streak freezes, use one
    if (daysSinceActivity === 2 && progress.streak.streakFreezes > 0) {
      progress.streak.streakFreezes -= 1;
      progress.streak.freezesUsedDates.push(today);
      progress.streak.streakProtectedDates.push(progress.streak.lastActivityDate);
      progress.streak.currentStreak += 1;
      result.freezeUsed = true;
      result.streakMaintained = true;
      result.newStreak = progress.streak.currentStreak;
    } else {
      // Streak is broken
      const hadStreak = progress.streak.currentStreak > 0;
      progress.streak.currentStreak = 1;
      result.streakBroken = true;
      result.newStreak = 1;

      // Track comeback for resilience badge
      if (hadStreak) {
        progress.comebackCount += 1;
        result.isComeback = true;
      }
    }
  } else {
    // First activity ever
    progress.streak.currentStreak = 1;
    result.newStreak = 1;
  }

  // Update longest streak
  progress.streak.longestStreak = Math.max(progress.streak.longestStreak, progress.streak.currentStreak);
  progress.streak.lastActivityDate = new Date().toISOString();

  saveFocusGardenProgress(progress);
  return result;
}

// Add streak freeze (earned through achievements/quests)
export function addStreakFreeze(count: number = 1): number {
  const progress = loadFocusGardenProgress();
  progress.streak.streakFreezes = Math.min(
    progress.streak.streakFreezes + count,
    progress.streak.maxStreakFreezes
  );
  saveFocusGardenProgress(progress);
  return progress.streak.streakFreezes;
}

// ========== SESSION LOGGING ==========

export interface SessionResult {
  xpEarned: number;
  leveledUp: boolean;
  newLevel: GardenLevel | null;
  badgesEarned: string[];
  streakResult: StreakUpdateResult;
  questProgress: { questId: string; dayCompleted: number }[];
}

export function logSession(
  duration: number,
  type: 'focus' | 'breathing' | 'task',
  plantId?: string
): SessionResult {
  const progress = loadFocusGardenProgress();
  const hour = getCurrentHour();

  // Calculate XP
  let xpEarned = 10 + Math.floor(duration * 2);
  if (type === 'breathing') {
    xpEarned += 5; // Bonus for breathing exercises
    progress.deepBreathingSessions += 1;
  }

  // Update session tracking
  if (!isToday(progress.lastSessionTime)) {
    progress.sessionsToday = 0;
  }
  progress.sessionsToday += 1;
  progress.totalSessions += 1;
  progress.totalMinutes += duration;
  progress.lastSessionTime = new Date().toISOString();

  // Track time of day
  if (hour >= 5 && hour < 9) {
    progress.earlyBirdSessions += 1;
  } else if (hour >= 21 && hour < 24) {
    progress.nightOwlSessions += 1;
  }

  // Track perfect days (3+ sessions)
  if (progress.sessionsToday === 3) {
    progress.perfectDays += 1;
    xpEarned += 25; // Bonus for perfect day
  }

  // Record session
  progress.sessionHistory.push({
    timestamp: new Date().toISOString(),
    duration,
    type,
    xpEarned,
    plantId
  });

  // Keep only last 100 sessions
  if (progress.sessionHistory.length > 100) {
    progress.sessionHistory = progress.sessionHistory.slice(-100);
  }

  // Update XP and check for level up
  const oldLevel = calculateGardenLevel(progress.totalXP);
  progress.totalXP += xpEarned;
  const newLevel = calculateGardenLevel(progress.totalXP);
  const leveledUp = newLevel.level > oldLevel.level;

  if (leveledUp) {
    progress.gardenLevel = newLevel.level;
  }

  // Update streak
  const streakResult = updateStreak();

  // Check for badges
  const badgesEarned = checkAndAwardBadges(progress);

  // Update quest progress
  const questProgress = updateQuestProgress(progress, type, duration, plantId);

  saveFocusGardenProgress(progress);

  return {
    xpEarned,
    leveledUp,
    newLevel: leveledUp ? newLevel : null,
    badgesEarned,
    streakResult,
    questProgress
  };
}

// ========== BADGE SYSTEM ==========

function checkAndAwardBadges(progress: FocusGardenProgress): string[] {
  const newBadges: string[] = [];

  for (const badge of FOCUS_GARDEN_BADGES) {
    if (progress.earnedBadges.includes(badge.id)) continue;

    let earned = false;

    switch (badge.requirement.type) {
      case 'streak':
        earned = progress.streak.currentStreak >= (badge.requirement.count || 0);
        break;
      case 'sessions':
        earned = progress.totalSessions >= (badge.requirement.count || 0);
        break;
      case 'time':
        earned = progress.totalMinutes >= (badge.requirement.count || 0);
        break;
      case 'plants':
        earned = progress.totalPlantsGrown >= (badge.requirement.count || 0);
        break;
      case 'harvests':
        earned = progress.totalHarvests >= (badge.requirement.count || 0);
        break;
      case 'level':
        earned = progress.gardenLevel >= (badge.requirement.count || 0);
        break;
      case 'quest':
        earned = progress.completedQuests.length >= (badge.requirement.count || 0);
        break;
      case 'comeback':
        earned = progress.comebackCount >= (badge.requirement.count || 0);
        break;
      case 'time-of-day':
        if (badge.requirement.timeRange) {
          const { start, end: _end } = badge.requirement.timeRange;
          if (start < 12) { // Early bird type
            earned = progress.earlyBirdSessions >= (badge.requirement.count || 0);
          } else { // Night owl type
            earned = progress.nightOwlSessions >= (badge.requirement.count || 0);
          }
        }
        break;
    }

    if (earned) {
      progress.earnedBadges.push(badge.id);
      newBadges.push(badge.id);
    }
  }

  return newBadges;
}

export function getBadgeInfo(badgeId: string): FocusGardenBadge | undefined {
  return FOCUS_GARDEN_BADGES.find(b => b.id === badgeId);
}

export function getAllBadgesWithStatus(): (FocusGardenBadge & { earned: boolean })[] {
  const progress = loadFocusGardenProgress();
  return FOCUS_GARDEN_BADGES.map(badge => ({
    ...badge,
    earned: progress.earnedBadges.includes(badge.id),
    earnedAt: progress.earnedBadges.includes(badge.id) ? new Date().toISOString() : null
  }));
}

// ========== QUEST SYSTEM ==========

export function startQuest(questId: string): boolean {
  const progress = loadFocusGardenProgress();

  // Check if already active or completed
  if (progress.activeQuests.some(q => q.id === questId) || progress.completedQuests.includes(questId)) {
    return false;
  }

  // Find quest template
  const questTemplate = MULTI_DAY_QUESTS.find(q => q.id === questId);
  if (!questTemplate) return false;

  // Create active quest instance
  const activeQuest: MultiDayQuest = {
    ...JSON.parse(JSON.stringify(questTemplate)), // Deep clone
    startedAt: new Date().toISOString(),
    currentDay: 1,
    isActive: true
  };

  progress.activeQuests.push(activeQuest);
  saveFocusGardenProgress(progress);
  return true;
}

export function completeQuestDay(questId: string, dayNumber: number): { success: boolean; questCompleted: boolean; xpEarned: number } {
  const progress = loadFocusGardenProgress();
  const quest = progress.activeQuests.find(q => q.id === questId);

  if (!quest || quest.currentDay !== dayNumber) {
    return { success: false, questCompleted: false, xpEarned: 0 };
  }

  const day = quest.days.find(d => d.day === dayNumber);
  if (!day || day.completed) {
    return { success: false, questCompleted: false, xpEarned: 0 };
  }

  // Mark day complete
  day.completed = true;
  day.completedAt = new Date().toISOString();

  // Award day XP
  progress.totalXP += day.xpReward;

  // Check if quest is complete
  const allDaysComplete = quest.days.every(d => d.completed);
  let questCompleted = false;

  if (allDaysComplete) {
    quest.completedAt = new Date().toISOString();
    quest.isActive = false;
    progress.completedQuests.push(quest.id);
    progress.totalXP += quest.xpReward;
    questCompleted = true;

    // Award badge if specified
    if (quest.badgeReward && !progress.earnedBadges.includes(quest.badgeReward)) {
      progress.earnedBadges.push(quest.badgeReward);
    }

    // Remove from active quests
    progress.activeQuests = progress.activeQuests.filter(q => q.id !== questId);
  } else {
    // Move to next day
    quest.currentDay = dayNumber + 1;
  }

  saveFocusGardenProgress(progress);

  return {
    success: true,
    questCompleted,
    xpEarned: day.xpReward + (questCompleted ? quest.xpReward : 0)
  };
}

function updateQuestProgress(
  progress: FocusGardenProgress,
  sessionType: 'focus' | 'breathing' | 'task',
  _duration: number,
  _plantId?: string
): { questId: string; dayCompleted: number }[] {
  const completedDays: { questId: string; dayCompleted: number }[] = [];

  // This would be expanded to track specific task completions
  // For now, we'll track breathing sessions for the calm-mind-journey quest
  if (sessionType === 'breathing') {
    const calmQuest = progress.activeQuests.find(q => q.id === 'calm-mind-journey');
    if (calmQuest && calmQuest.isActive) {
      const currentDay = calmQuest.days.find(d => d.day === calmQuest.currentDay && !d.completed);
      if (currentDay) {
        currentDay.completed = true;
        currentDay.completedAt = new Date().toISOString();
        progress.totalXP += currentDay.xpReward;

        completedDays.push({ questId: calmQuest.id, dayCompleted: currentDay.day });

        // Check if quest complete
        if (calmQuest.days.every(d => d.completed)) {
          calmQuest.completedAt = new Date().toISOString();
          calmQuest.isActive = false;
          progress.completedQuests.push(calmQuest.id);
          progress.totalXP += calmQuest.xpReward;
          progress.activeQuests = progress.activeQuests.filter(q => q.id !== calmQuest.id);
        } else {
          calmQuest.currentDay += 1;
        }
      }
    }
  }

  return completedDays;
}

export function getAvailableQuests(): MultiDayQuest[] {
  const progress = loadFocusGardenProgress();
  return MULTI_DAY_QUESTS.filter(
    q => !progress.completedQuests.includes(q.id) && !progress.activeQuests.some(aq => aq.id === q.id)
  );
}

export function getActiveQuests(): MultiDayQuest[] {
  const progress = loadFocusGardenProgress();
  return progress.activeQuests;
}

// ========== PLANT MANAGEMENT ==========

export function plantTask(taskId: string, layer: string): FocusGardenPlant {
  const progress = loadFocusGardenProgress();

  const newPlant: FocusGardenPlant = {
    id: `plant-${Date.now()}`,
    taskId,
    stage: 'seed',
    waterCount: 0,
    layer,
    plantedAt: new Date().toISOString()
  };

  progress.garden.push(newPlant);
  progress.totalPlantsGrown += 1;
  saveFocusGardenProgress(progress);

  // Log as a session
  logSession(1, 'task', newPlant.id);

  return newPlant;
}

export function waterPlant(plantId: string): { plant: FocusGardenPlant | null; xpEarned: number; bloomed: boolean } {
  const progress = loadFocusGardenProgress();
  const plant = progress.garden.find(p => p.id === plantId);

  if (!plant || plant.stage === 'bloom') {
    return { plant: null, xpEarned: 0, bloomed: false };
  }

  plant.waterCount += 1;

  // Advance growth stage
  if (plant.waterCount === 1) plant.stage = 'sprout';
  else if (plant.waterCount === 2) plant.stage = 'bud';
  else if (plant.waterCount >= 3) plant.stage = 'bloom';

  const bloomed = plant.stage === 'bloom';
  const xpEarned = 10 + (bloomed ? 15 : 0); // Bonus XP for bloom

  progress.totalXP += xpEarned;
  saveFocusGardenProgress(progress);

  return { plant, xpEarned, bloomed };
}

export function harvestPlant(plantId: string): { success: boolean; xpEarned: number } {
  const progress = loadFocusGardenProgress();
  const plantIndex = progress.garden.findIndex(p => p.id === plantId);
  const plant = progress.garden[plantIndex];

  if (!plant || plant.stage !== 'bloom') {
    return { success: false, xpEarned: 0 };
  }

  // Remove plant and award XP
  progress.garden.splice(plantIndex, 1);
  progress.totalHarvests += 1;
  const xpEarned = 50;
  progress.totalXP += xpEarned;

  // Update garden level
  const newLevel = calculateGardenLevel(progress.totalXP);
  progress.gardenLevel = newLevel.level;

  // Check for badges
  checkAndAwardBadges(progress);

  saveFocusGardenProgress(progress);

  return { success: true, xpEarned };
}

// ========== UTILITY FUNCTIONS ==========

export function resetFocusGardenProgress(): void {
  if (typeof window === 'undefined') return;

  if (confirm('Are you sure you want to reset all Focus Garden progress? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
}

// Migrate from old storage format if needed
export function migrateOldProgress(): void {
  if (typeof window === 'undefined') return;

  const oldKey = 'focus-garden';
  const oldData = localStorage.getItem(oldKey);

  if (oldData && !localStorage.getItem(STORAGE_KEY)) {
    try {
      const parsed = JSON.parse(oldData);
      const newProgress = getDefaultProgress();

      // Migrate garden
      if (parsed.garden) {
        newProgress.garden = parsed.garden.map((p: FocusGardenPlant) => ({
          ...p,
          plantedAt: p.plantedAt || new Date().toISOString()
        }));
      }

      // Migrate XP and level
      if (parsed.xp) {
        newProgress.totalXP = parsed.xp + ((parsed.level || 1) - 1) * 100;
      }

      saveFocusGardenProgress(newProgress);
      console.log('[Focus Garden] Migrated from old storage format');
    } catch (error) {
      console.error('[Focus Garden] Migration failed:', error);
    }
  }
}

// ========== COMPANION MANAGEMENT ==========

export function changeCompanionType(newType: CompanionType): boolean {
  const progress = loadFocusGardenProgress();
  
  // Check if companion is unlocked
  // This would check COMPANION_TYPES unlock requirements
  
  progress.companion.type = newType;
  progress.companion.mood = 'happy'; // Happy about the change!
  saveFocusGardenProgress(progress);
  return true;
}

export function setCompanionName(name: string): void {
  const progress = loadFocusGardenProgress();
  progress.companion.name = name;
  saveFocusGardenProgress(progress);
}

export function interactWithCompanion(): void {
  const progress = loadFocusGardenProgress();
  progress.companion.totalInteractions += 1;
  progress.companion.lastInteraction = new Date().toISOString();
  
  // Update companion XP and level
  progress.companion.xp += 5;
  const companionLevel = Math.floor(progress.companion.xp / 50) + 1;
  progress.companion.level = Math.min(companionLevel, 10);
  
  saveFocusGardenProgress(progress);
}

export function updateCompanionMood(mood: CompanionMood): void {
  const progress = loadFocusGardenProgress();
  progress.companion.mood = mood;
  saveFocusGardenProgress(progress);
}

export function equipAccessory(accessoryId: string): void {
  const progress = loadFocusGardenProgress();
  
  if (!progress.companion.unlockedAccessories.includes(accessoryId)) {
    return; // Not unlocked
  }
  
  progress.companion.activeAccessory = accessoryId;
  saveFocusGardenProgress(progress);
}

export function unequipAccessory(): void {
  const progress = loadFocusGardenProgress();
  progress.companion.activeAccessory = null;
  saveFocusGardenProgress(progress);
}

export function checkAndUnlockAccessories(): string[] {
  const progress = loadFocusGardenProgress();
  
  // This would use getUnlockableAccessories from companion-data
  // For now, just return existing unlocked
  
  saveFocusGardenProgress(progress);
  return progress.companion.unlockedAccessories;
}
