// Focus Garden Progress Store
// Centralized state management for Focus Garden gamification features
// Including: Streak Freezes, Garden Levels, Multi-day Quests, Enhanced Badges, Virtual Companion

const STORAGE_KEY = 'nb:focus-garden:v2:progress';

const LONDON_TIMEZONE = 'Europe/London';

export function getLondonDateKey(date: Date = new Date()): string {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = dtf.formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  if (!year || !month || !day) return new Date().toISOString().split('T')[0];
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const [year, month, day] = dateKey.split('-').map(n => Number(n));
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const parsed = parseDateKey(dateKey);
  if (!parsed) return dateKey;
  const utc = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days));
  return `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, '0')}-${String(utc.getUTCDate()).padStart(2, '0')}`;
}

function getYesterdayDateKey(todayKey: string): string {
  return addDaysToDateKey(todayKey, -1);
}

function getLondonHourMinute(date: Date = new Date()): { hour: number; minute: number } {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = dtf.formatToParts(date);
  const hour = Number(parts.find(p => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find(p => p.type === 'minute')?.value ?? '0');
  return { hour, minute };
}

function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toLondonDateKey(value: string | null): string | null {
  if (!value) return null;
  if (isDateKey(value)) return value;
  try {
    return getLondonDateKey(new Date(value));
  } catch {
    return null;
  }
}

function normalizeDailyRecord(input: unknown): DailyRecord | null {
  if (!input || typeof input !== 'object') return null;
  const maybe = input as { status?: unknown; at?: unknown };
  const status = maybe.status;
  if (status !== 'watered' && status !== 'missed' && status !== 'frozen') return null;
  const at = typeof maybe.at === 'string' ? maybe.at : undefined;
  return { status, at };
}

function normalizeDailyRecords(input: unknown): Record<string, DailyRecord> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};

  const result: Record<string, DailyRecord> = {};
  for (const [rawKey, rawValue] of Object.entries(input as Record<string, unknown>)) {
    const dateKey = toLondonDateKey(rawKey);
    if (!dateKey) continue;

    const record = normalizeDailyRecord(rawValue);
    if (!record) continue;
    result[dateKey] = record;
  }
  return result;
}

function diffDays(fromDateKey: string, toDateKey: string): number {
  const fromParsed = parseDateKey(fromDateKey);
  const toParsed = parseDateKey(toDateKey);
  if (!fromParsed || !toParsed) return 0;
  const fromUTC = Date.UTC(fromParsed.year, fromParsed.month - 1, fromParsed.day);
  const toUTC = Date.UTC(toParsed.year, toParsed.month - 1, toParsed.day);
  return Math.round((toUTC - fromUTC) / (1000 * 60 * 60 * 24));
}

function stageFromCycle(cycleConsecutiveWatered: number): 'seed' | 'sprout' | 'bud' | 'bloom' {
  if (cycleConsecutiveWatered >= 4) return 'bloom';
  if (cycleConsecutiveWatered >= 2) return 'bud';
  if (cycleConsecutiveWatered >= 1) return 'sprout';
  return 'seed';
}

function normalizeCategory(input: unknown): GardenCategory {
  const raw = String(input ?? '').trim();
  if (raw === 'Health') return 'Health';
  if (raw === 'Mindfulness') return 'Mindfulness';
  if (raw === 'Learning') return 'Learning';
  if (raw === 'Productivity') return 'Productivity';
  if (raw === 'Self-Care' || raw === 'Self Care') return 'Self-Care';
  return 'Productivity';
}

function getUnlockedPlotCount(level: number): number {
  if (level >= 8) return 5;
  if (level >= 6) return 4;
  if (level >= 4) return 3;
  if (level >= 2) return 2;
  return 1;
}

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

export type GardenCategory = 'Health' | 'Mindfulness' | 'Learning' | 'Productivity' | 'Self-Care';

export interface DailyRecord {
  status: 'watered' | 'missed' | 'frozen';
  at?: string; // ISO timestamp
}

export interface FocusGardenPlant {
  id: string;
  // Legacy identifiers (kept for backward compatibility)
  taskId: string;
  layer: string;

  // Habit seed details
  title: string;
  category: GardenCategory;
  cue: string;
  reminderTime?: string;

  // Growth & streak
  stage: 'seed' | 'sprout' | 'bud' | 'bloom';
  cycleConsecutiveWatered: number; // consecutive *watered* days in current cycle (0-4)
  currentStreak: number;
  bestStreak: number;
  lastWateredDateKey: string | null; // Europe/London day key
  bloomsHarvested: number;

  // Daily records (Europe/London day key)
  daily: Record<string, DailyRecord>;

  // Legacy (may exist in older saves)
  waterCount?: number;
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
  freezeReward?: number;
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
    type: 'streak' | 'sessions' | 'time' | 'plants' | 'harvests' | 'level' | 'quest' | 'comeback' | 'time-of-day' | 'categories' | 'freeze-used';
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
  lastCheckedDate: string | null; // Europe/London day key

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

function normalizePlant(input: unknown): FocusGardenPlant {
  const p = (input ?? {}) as Partial<FocusGardenPlant> & Record<string, unknown>;
  const nowIso = new Date().toISOString();

  const category = normalizeCategory(p.category ?? p.layer);

  const cycleRaw = p.cycleConsecutiveWatered;
  const cycleConsecutiveWatered =
    typeof cycleRaw === 'number'
      ? Math.max(0, Math.min(4, cycleRaw))
      : typeof p.waterCount === 'number'
          ? Math.max(0, Math.min(4, p.waterCount))
          : 0;

  const stage =
    p.stage === 'seed' || p.stage === 'sprout' || p.stage === 'bud' || p.stage === 'bloom'
      ? p.stage
      : stageFromCycle(cycleConsecutiveWatered);

  const daily = normalizeDailyRecords(p.daily);

  return {
    id: typeof p.id === 'string' ? p.id : `plant-${Date.now()}`,
    taskId: typeof p.taskId === 'string' ? p.taskId : '',
    layer: typeof p.layer === 'string' ? p.layer : category,
    title: typeof p.title === 'string' && p.title.trim() ? p.title.trim() : (typeof p.taskId === 'string' && p.taskId ? p.taskId : 'New seed'),
    category,
    cue: typeof p.cue === 'string' ? p.cue : '',
    reminderTime: typeof p.reminderTime === 'string' && p.reminderTime ? p.reminderTime : undefined,
    stage,
    cycleConsecutiveWatered,
    currentStreak: typeof p.currentStreak === 'number' ? Math.max(0, p.currentStreak) : 0,
    bestStreak: typeof p.bestStreak === 'number' ? Math.max(0, p.bestStreak) : 0,
    lastWateredDateKey: toLondonDateKey(p.lastWateredDateKey ?? null),
    bloomsHarvested: typeof p.bloomsHarvested === 'number' ? Math.max(0, p.bloomsHarvested) : 0,
    daily,
    waterCount: typeof p.waterCount === 'number' ? p.waterCount : undefined,
    plantedAt: typeof p.plantedAt === 'string' ? p.plantedAt : nowIso,
    harvestedAt: typeof p.harvestedAt === 'string' ? p.harvestedAt : undefined
  };
}

function applyDailyRollover(progress: FocusGardenProgress, todayKey: string): void {
  const lastCheckedKey = toLondonDateKey(progress.lastCheckedDate) ?? todayKey;
  if (lastCheckedKey === todayKey) return;

  // If lastCheckedKey is in the future (clock skew), just snap to today.
  if (diffDays(lastCheckedKey, todayKey) < 0) {
    progress.lastCheckedDate = todayKey;
    return;
  }

  // Backfill days between last checked and today (excluding today).
  let cursor = addDaysToDateKey(lastCheckedKey, 1);
  const streakProtected = new Set(progress.streak.streakProtectedDates ?? []);

  while (cursor !== todayKey) {
    const dayStatus: DailyRecord['status'] = streakProtected.has(cursor) ? 'frozen' : 'missed';

    for (const plant of progress.garden) {
      const plantedKey = toLondonDateKey(plant.plantedAt) ?? cursor;
      if (diffDays(plantedKey, cursor) < 0) continue;
      if (plant.daily[cursor]) continue;
      plant.daily[cursor] = { status: dayStatus };
    }

    cursor = addDaysToDateKey(cursor, 1);
  }

  progress.lastCheckedDate = todayKey;
}

function normalizeProgress(input: FocusGardenProgress): FocusGardenProgress {
  const progress = input;
  const todayKey = getLondonDateKey();

  progress.lastCheckedDate = toLondonDateKey(progress.lastCheckedDate) ?? todayKey;
  progress.streak.lastActivityDate = toLondonDateKey(progress.streak.lastActivityDate);

  // Spec: start 1, max 2
  progress.streak.maxStreakFreezes = 2;
  progress.streak.streakFreezes = Math.max(0, Math.min(progress.streak.streakFreezes ?? 0, progress.streak.maxStreakFreezes));
  progress.streak.freezesUsedDates = (progress.streak.freezesUsedDates ?? []).map(d => toLondonDateKey(d)).filter(Boolean) as string[];
  progress.streak.streakProtectedDates = (progress.streak.streakProtectedDates ?? []).map(d => toLondonDateKey(d)).filter(Boolean) as string[];

  progress.garden = (progress.garden ?? []).map(p => normalizePlant(p));

  applyDailyRollover(progress, todayKey);

  const calculated = calculateGardenLevel(progress.totalXP ?? 0).level;
  progress.gardenLevel = calculated;
  progress.level = calculated;

  const plotCap = getUnlockedPlotCount(progress.gardenLevel);
  if (progress.garden.length > plotCap) {
    progress.garden = progress.garden.slice(0, plotCap);
  }

  return progress;
}

// ========== CONSTANTS ==========

export const GARDEN_LEVELS: GardenLevel[] = [
  {
    level: 1,
    name: 'Bare Plot',
    description: 'A fresh plot of soil, ready for your first seed',
    xpRequired: 0,
    unlockedFeatures: ['1 plot'],
    gardenTheme: 'plot'
  },
  {
    level: 2,
    name: 'Sprout Patch',
    description: 'You’re building a routine that can grow',
    xpRequired: 150,
    unlockedFeatures: ['2 plots'],
    gardenTheme: 'small-garden'
  },
  {
    level: 3,
    name: 'Garden Bed',
    description: 'Consistency is taking root',
    xpRequired: 350,
    unlockedFeatures: ['2 plots', 'decor'],
    gardenTheme: 'garden'
  },
  {
    level: 4,
    name: 'Bloom Lane',
    description: 'More space for gentle habits',
    xpRequired: 650,
    unlockedFeatures: ['3 plots'],
    gardenTheme: 'lush-garden'
  },
  {
    level: 5,
    name: 'Canopy Grove',
    description: 'Your garden is becoming a system',
    xpRequired: 1000,
    unlockedFeatures: ['3 plots', 'decor+'],
    gardenTheme: 'paradise'
  },
  {
    level: 6,
    name: 'Greenhouse',
    description: 'You cultivate consistency with gentleness and honesty',
    xpRequired: 1350,
    unlockedFeatures: ['4 plots'],
    gardenTheme: 'paradise'
  },
  {
    level: 7,
    name: 'Bloomstead',
    description: 'Your garden supports ambitious goals in small steps',
    xpRequired: 1750,
    unlockedFeatures: ['4 plots', 'decor++'],
    gardenTheme: 'paradise'
  },
  {
    level: 8,
    name: 'Harvest Haven',
    description: 'A thriving garden built through repeatable routines',
    xpRequired: 2250,
    unlockedFeatures: ['5 plots'],
    gardenTheme: 'paradise'
  }
];

export const FOCUS_GARDEN_BADGES: FocusGardenBadge[] = [
  {
    id: 'first-bloom',
    name: 'First Bloom',
    description: 'Harvest your first bloom',
    icon: '🌸',
    color: '#9C27B0',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 1 }
  },
  {
    id: 'harvest-3',
    name: 'Harvest Hand',
    description: 'Harvest 3 blooms',
    icon: '🧺',
    color: '#4CAF50',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 3 }
  },
  {
    id: 'harvest-10',
    name: 'Seasoned Harvester',
    description: 'Harvest 10 blooms',
    icon: '🍯',
    color: '#FF9800',
    earnedAt: null,
    category: 'growth',
    requirement: { type: 'harvests', count: 10 }
  },
  {
    id: 'seven-day-streak',
    name: '7-Day Streak',
    description: 'Maintain a 7-day garden streak',
    icon: '🔥',
    color: '#FF5722',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'streak', count: 7 }
  },
  {
    id: 'fourteen-day-streak',
    name: '14-Day Streak',
    description: 'Maintain a 14-day garden streak',
    icon: '🏮',
    color: '#FF7043',
    earnedAt: null,
    category: 'streak',
    requirement: { type: 'streak', count: 14 }
  },
  {
    id: 'level-2',
    name: 'Second Plot',
    description: 'Reach Garden Level 2',
    icon: '🪴',
    color: '#2E7D32',
    earnedAt: null,
    category: 'mastery',
    requirement: { type: 'level', count: 2 }
  },
  {
    id: 'level-8',
    name: 'Garden Architect',
    description: 'Reach Garden Level 8',
    icon: '🏛️',
    color: '#3F51B5',
    earnedAt: null,
    category: 'mastery',
    requirement: { type: 'level', count: 8 }
  },
  {
    id: 'balanced-garden',
    name: 'Balanced Garden',
    description: 'Plant seeds across all 5 categories',
    icon: '🌈',
    color: '#E91E63',
    earnedAt: null,
    category: 'special',
    requirement: { type: 'categories', count: 5 }
  },
  {
    id: 'frost-guard',
    name: 'Frost Guard',
    description: 'Protect a missed day with Frost Guard',
    icon: '❄️',
    color: '#00BCD4',
    earnedAt: null,
    category: 'resilience',
    requirement: { type: 'freeze-used', count: 1 }
  },
  {
    id: 'comeback-bloom',
    name: 'Comeback Bloom',
    description: 'Return after a break and harvest again',
    icon: '🌷',
    color: '#8BC34A',
    earnedAt: null,
    category: 'resilience',
    requirement: { type: 'comeback', count: 1 }
  }
];

export const MULTI_DAY_QUESTS: MultiDayQuest[] = [
  {
    id: 'roots-week',
    title: 'Roots Week',
    description: 'Build a 7-day foundation with gentle consistency',
    narrative: 'Strong roots come from small, repeatable actions you can do even on hard days.',
    days: [
      { day: 1, title: 'Plant One Seed', description: 'Start small and specific', task: 'Plant one seed with a clear cue (when/where/how)', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: 'Water Once', description: 'One meaningful action', task: 'Water a seed (once today)', completed: false, completedAt: null, xpReward: 20 },
      { day: 3, title: 'Make It Easier', description: 'Reduce friction', task: 'Update a cue to be simpler or more realistic', completed: false, completedAt: null, xpReward: 20 },
      { day: 4, title: 'Breathe & Reset', description: 'Support your nervous system', task: 'Complete a short breathing session', completed: false, completedAt: null, xpReward: 25 },
      { day: 5, title: 'Keep the Chain', description: 'Consistency over intensity', task: 'Water a seed again today', completed: false, completedAt: null, xpReward: 20 },
      { day: 6, title: 'Notice the Win', description: 'Name the benefit', task: 'Write one sentence: “This helps because ___.”', completed: false, completedAt: null, xpReward: 20 },
      { day: 7, title: 'Celebrate', description: 'Mark the week', task: 'Harvest if a bloom is ready, or water once and celebrate progress', completed: false, completedAt: null, xpReward: 30 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 150,
    isActive: false,
    category: 'habit'
  },
  {
    id: 'calm-mind-5',
    title: 'Calm Mind (5 Days)',
    description: 'Use breath as a reliable reset',
    narrative: 'A calmer baseline makes focus easier to access. Practice a little each day.',
    days: [
      { day: 1, title: 'First Breath', description: 'Start here', task: 'Do a 2–5 minute breathing session', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: 'Same Time', description: 'Make it predictable', task: 'Do a breathing session around the same time as yesterday', completed: false, completedAt: null, xpReward: 25 },
      { day: 3, title: 'After Stress', description: 'Use it when it matters', task: 'Do a breathing session after a stress cue', completed: false, completedAt: null, xpReward: 30 },
      { day: 4, title: 'Before a Task', description: 'Prime your attention', task: 'Do a breathing session before a focus task', completed: false, completedAt: null, xpReward: 30 },
      { day: 5, title: 'Keep the Habit', description: 'Lock it in', task: 'Do a breathing session and note one benefit', completed: false, completedAt: null, xpReward: 35 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 120,
    isActive: false,
    category: 'breathing'
  },
  {
    id: 'two-plot-unlock',
    title: 'Unlock a Second Plot',
    description: 'Grow into a second habit lane',
    narrative: 'You don’t need more motivation — you need a second gentle option.',
    days: [
      { day: 1, title: 'Pick a Category', description: 'Choose what matters most', task: 'Plant a seed in a new category', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: 'Water Today', description: 'Keep it alive', task: 'Water a seed (once)', completed: false, completedAt: null, xpReward: 20 },
      { day: 3, title: 'Protect Consistency', description: 'Learn Frost Guard', task: 'Check Frost Guard and decide when you’d use it', completed: false, completedAt: null, xpReward: 25 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 80,
    freezeReward: 1,
    isActive: false,
    category: 'habit'
  },
  {
    id: 'learning-lane-4',
    title: 'Learning Lane (4 Days)',
    description: 'Turn learning into a tiny daily lane',
    narrative: 'Learning grows best with repetition. Keep it tiny and frequent.',
    days: [
      { day: 1, title: 'Choose a Topic', description: 'One small topic', task: 'Plant a Learning seed with a clear cue', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: '5 Minutes', description: 'Tiny on purpose', task: 'Do 5 minutes of your learning action', completed: false, completedAt: null, xpReward: 20 },
      { day: 3, title: 'Make a Note', description: 'Capture the win', task: 'Write one sentence summary', completed: false, completedAt: null, xpReward: 20 },
      { day: 4, title: 'Repeat', description: 'Repetition is progress', task: 'Water the Learning seed today', completed: false, completedAt: null, xpReward: 25 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 90,
    isActive: false,
    category: 'habit'
  },
  {
    id: 'mindful-moment-4',
    title: 'Mindful Moment (4 Days)',
    description: 'Practice noticing without fixing',
    narrative: 'Mindfulness is not perfection — it’s returning gently, again and again.',
    days: [
      { day: 1, title: 'One Minute', description: 'Start extremely small', task: 'Do a 1-minute mindful check-in', completed: false, completedAt: null, xpReward: 20 },
      { day: 2, title: 'Body Scan', description: 'Notice sensations', task: 'Do a short body scan', completed: false, completedAt: null, xpReward: 25 },
      { day: 3, title: 'Name It', description: 'Label helps', task: 'Name your current emotion (no judgment)', completed: false, completedAt: null, xpReward: 25 },
      { day: 4, title: 'Return', description: 'Build the return reflex', task: 'Do another mindful check-in', completed: false, completedAt: null, xpReward: 25 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 80,
    isActive: false,
    category: 'mindfulness'
  },
  {
    id: 'self-care-buffer-3',
    title: 'Self-Care Buffer (3 Days)',
    description: 'Build a small buffer against overload',
    narrative: 'A little self-care can prevent a big crash. Keep it realistic.',
    days: [
      { day: 1, title: 'Pick One Buffer', description: 'One tiny buffer action', task: 'Plant a Self-Care seed with a cue', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: 'Do It Tiny', description: 'Minimum viable self-care', task: 'Do the action for 2 minutes', completed: false, completedAt: null, xpReward: 20 },
      { day: 3, title: 'Repeat', description: 'Repeat builds trust', task: 'Water the Self-Care seed today', completed: false, completedAt: null, xpReward: 25 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 70,
    isActive: false,
    category: 'habit'
  },
  {
    id: 'productivity-gentle-4',
    title: 'Gentle Productivity (4 Days)',
    description: 'Make progress without the crash',
    narrative: 'A good system makes doing easier than not doing. Keep it gentle.',
    days: [
      { day: 1, title: 'Define Done', description: 'Make success clear', task: 'Plant a Productivity seed with a measurable target', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: 'Start Line', description: 'Begin the action', task: 'Do the first 2 minutes', completed: false, completedAt: null, xpReward: 20 },
      { day: 3, title: 'Reduce Friction', description: 'Prepare your environment', task: 'Set up your workspace / materials', completed: false, completedAt: null, xpReward: 20 },
      { day: 4, title: 'Repeat', description: 'Consistency wins', task: 'Water the Productivity seed today', completed: false, completedAt: null, xpReward: 25 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 90,
    isActive: false,
    category: 'focus'
  },
  {
    id: 'health-hydration-3',
    title: 'Health: Hydration (3 Days)',
    description: 'Anchor a simple health habit',
    narrative: 'Small health habits support your attention and mood. Pick something realistic.',
    days: [
      { day: 1, title: 'Pick the Habit', description: 'One small health action', task: 'Plant a Health seed with a cue', completed: false, completedAt: null, xpReward: 25 },
      { day: 2, title: 'Do It', description: 'Follow the cue once', task: 'Do the health action once today', completed: false, completedAt: null, xpReward: 20 },
      { day: 3, title: 'Repeat', description: 'Make it a pattern', task: 'Water the Health seed today', completed: false, completedAt: null, xpReward: 25 }
    ],
    currentDay: 0,
    startedAt: null,
    completedAt: null,
    xpReward: 70,
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
    lastCheckedDate: null,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakFreezes: 1, // Start with 1 Frost Guard
      maxStreakFreezes: 2,
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
  const todayKey = getLondonDateKey();
  const asKey = toLondonDateKey(dateString);
  return asKey === todayKey;
}

function getCurrentHour(): number {
  return getLondonHourMinute().hour;
}

// ========== PUBLIC API ==========

export function loadFocusGardenProgress(): FocusGardenProgress {
  const raw = getStorage(STORAGE_KEY, getDefaultProgress());
  const normalized = normalizeProgress(raw);
  setStorage(STORAGE_KEY, normalized);
  return normalized;
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
  const todayKey = getLondonDateKey();
  const yesterdayKey = getYesterdayDateKey(todayKey);
  const lastActivityKey = toLondonDateKey(progress.streak.lastActivityDate);

  const result: StreakUpdateResult = {
    streakMaintained: false,
    streakBroken: false,
    freezeUsed: false,
    newStreak: progress.streak.currentStreak,
    isComeback: false
  };

  // If already logged activity today, streak continues
  if (lastActivityKey && lastActivityKey === todayKey) {
    result.streakMaintained = true;
    return result;
  }

  // If activity was yesterday, increment streak
  if (lastActivityKey && lastActivityKey === yesterdayKey) {
    progress.streak.currentStreak += 1;
    result.streakMaintained = true;
    result.newStreak = progress.streak.currentStreak;
  } else if (lastActivityKey) {
    const daysSinceActivity = diffDays(lastActivityKey, todayKey);

    // If exactly one missed day (gap of 2), auto-use Frost Guard if available
    if (daysSinceActivity === 2 && progress.streak.streakFreezes > 0) {
      progress.streak.streakFreezes -= 1;
      progress.streak.freezesUsedDates.push(yesterdayKey);
      progress.streak.streakProtectedDates.push(yesterdayKey);
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
  progress.streak.lastActivityDate = todayKey;

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
    progress.level = newLevel.level;
  }

  // Update streak
  const streakResult = (() => {
    const todayKey = getLondonDateKey();
    const yesterdayKey = getYesterdayDateKey(todayKey);
    const lastActivityKey = toLondonDateKey(progress.streak.lastActivityDate);

    const result: StreakUpdateResult = {
      streakMaintained: false,
      streakBroken: false,
      freezeUsed: false,
      newStreak: progress.streak.currentStreak,
      isComeback: false
    };

    if (lastActivityKey && lastActivityKey === todayKey) {
      result.streakMaintained = true;
      return result;
    }

    if (lastActivityKey && lastActivityKey === yesterdayKey) {
      progress.streak.currentStreak += 1;
      result.streakMaintained = true;
      result.newStreak = progress.streak.currentStreak;
    } else if (lastActivityKey) {
      const daysSinceActivity = diffDays(lastActivityKey, todayKey);
      if (daysSinceActivity === 2 && progress.streak.streakFreezes > 0) {
        progress.streak.streakFreezes -= 1;
        progress.streak.freezesUsedDates.push(yesterdayKey);
        progress.streak.streakProtectedDates.push(yesterdayKey);
        progress.streak.currentStreak += 1;
        result.freezeUsed = true;
        result.streakMaintained = true;
        result.newStreak = progress.streak.currentStreak;
      } else {
        const hadStreak = progress.streak.currentStreak > 0;
        progress.streak.currentStreak = 1;
        result.streakBroken = true;
        result.newStreak = 1;
        if (hadStreak) {
          progress.comebackCount += 1;
          result.isComeback = true;
        }
      }
    } else {
      progress.streak.currentStreak = 1;
      result.newStreak = 1;
    }

    progress.streak.longestStreak = Math.max(progress.streak.longestStreak, progress.streak.currentStreak);
    progress.streak.lastActivityDate = todayKey;
    return result;
  })();

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
      case 'categories': {
        const unique = new Set(progress.garden.map(p => normalizeCategory(p.category ?? p.layer)));
        earned = unique.size >= (badge.requirement.count || 0);
        break;
      }
      case 'freeze-used':
        earned = (progress.streak.freezesUsedDates?.length ?? 0) >= (badge.requirement.count || 0);
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

    // Award Frost Guard if specified
    if (quest.freezeReward && quest.freezeReward > 0) {
      progress.streak.streakFreezes = Math.min(
        progress.streak.streakFreezes + quest.freezeReward,
        progress.streak.maxStreakFreezes
      );
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
  // Backward-compatible wrapper
  const planted = plantSeed({
    title: taskId,
    category: normalizeCategory(layer),
    cue: 'When/where/how: __'
  });
  return planted ?? normalizePlant({ id: `plant-${Date.now()}`, taskId, layer, plantedAt: new Date().toISOString() });
}

export function plantSeed(input: { title: string; category: GardenCategory; cue: string; reminderTime?: string }): FocusGardenPlant | null {
  const progress = loadFocusGardenProgress();
  const plotCap = getUnlockedPlotCount(progress.gardenLevel);
  if (progress.garden.length >= plotCap) return null;

  const nowIso = new Date().toISOString();
  const title = input.title.trim();
  const cue = input.cue.trim();
  const category = normalizeCategory(input.category);
  const reminderTime = input.reminderTime?.trim() ? input.reminderTime.trim() : undefined;

  const newPlant: FocusGardenPlant = {
    id: `plant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    taskId: `seed:${Date.now()}`,
    layer: category,
    title,
    category,
    cue,
    reminderTime,
    stage: 'seed',
    cycleConsecutiveWatered: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastWateredDateKey: null,
    bloomsHarvested: 0,
    daily: {},
    plantedAt: nowIso
  };

  progress.garden.push(newPlant);
  progress.totalPlantsGrown += 1;
  saveFocusGardenProgress(progress);
  return newPlant;
}

export function waterPlant(plantId: string): { plant: FocusGardenPlant | null; xpEarned: number; bloomed: boolean } {
  const progress = loadFocusGardenProgress();
  const plant = progress.garden.find(p => p.id === plantId);

  if (!plant || plant.stage === 'bloom') {
    return { plant: null, xpEarned: 0, bloomed: false };
  }

  const todayKey = getLondonDateKey();
  if (plant.daily[todayKey]?.status === 'watered') {
    return { plant, xpEarned: 0, bloomed: false };
  }

  const nowIso = new Date().toISOString();
  plant.daily[todayKey] = { status: 'watered', at: nowIso };

  const yesterdayKey = getYesterdayDateKey(todayKey);
  const wateredYesterday = plant.daily[yesterdayKey]?.status === 'watered';
  plant.cycleConsecutiveWatered = wateredYesterday ? Math.min(4, plant.cycleConsecutiveWatered + 1) : 1;
  plant.stage = stageFromCycle(plant.cycleConsecutiveWatered);
  plant.lastWateredDateKey = todayKey;

  plant.currentStreak = wateredYesterday ? plant.currentStreak + 1 : 1;
  plant.bestStreak = Math.max(plant.bestStreak, plant.currentStreak);
  plant.waterCount = plant.cycleConsecutiveWatered;

  const bloomed = plant.stage === 'bloom';
  const xpEarned = 10 + (bloomed ? 15 : 0);

  progress.totalXP += xpEarned;
  const newLevel = calculateGardenLevel(progress.totalXP);
  progress.gardenLevel = newLevel.level;
  progress.level = newLevel.level;

  checkAndAwardBadges(progress);
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

  // Harvest awards XP and resets cycle; the plant persists
  progress.totalHarvests += 1;
  const xpEarned = 50;
  progress.totalXP += xpEarned;

  plant.bloomsHarvested += 1;
  plant.harvestedAt = new Date().toISOString();
  plant.stage = 'seed';
  plant.cycleConsecutiveWatered = 0;
  plant.currentStreak = 0;
  plant.lastWateredDateKey = null;
  plant.waterCount = 0;

  // Update garden level
  const newLevel = calculateGardenLevel(progress.totalXP);
  progress.gardenLevel = newLevel.level;
  progress.level = newLevel.level;

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
        newProgress.garden = (parsed.garden as unknown[]).map(p => normalizePlant(p));
      }

      // Migrate XP and level
      if (parsed.xp) {
        newProgress.totalXP = parsed.xp + ((parsed.level || 1) - 1) * 100;
      }

      newProgress.gardenLevel = calculateGardenLevel(newProgress.totalXP).level;
      newProgress.level = newProgress.gardenLevel;

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
