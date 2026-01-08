import { ProgressData, DailyQuest, Achievement, SkillMastery, CalmSession, SkillPracticeSession, MoodRating, UserLevel, PersonalBest, Milestone, ComboTracker } from './types';

const STORAGE_KEY = 'nb:autism:v2:progress';
const PREFERENCES_KEY = 'nb:autism:v2:preferences';

// XP required for each level (exponential growth)
const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Level titles
const getLevelTitle = (level: number): string => {
  if (level < 5) return 'Beginner';
  if (level < 10) return 'Explorer';
  if (level < 15) return 'Practitioner';
  if (level < 20) return 'Expert';
  if (level < 30) return 'Master';
  return 'Legend';
};

// Mastery level names
export const getMasteryLevelName = (level: number): string => {
  const levels = ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
  return levels[Math.min(level, 5)] || 'Novice';
};

// Default progress data
const getDefaultProgress = (): ProgressData => ({
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  skillsPracticed: new Set<string>(),
  plansCompleted: 0,
  lastActivityDate: null,
  earnedBadges: [],
  weeklyActivity: {},
  totalXP: 0,
  currentLevel: 1,
  dailyQuests: [],
  achievements: [],
  skillMastery: {},
  calmSessions: [],
  skillSessions: [],
  streakProtections: 0,
  favoriteSkills: [],
  favoriteExercises: [],
  personalBests: {
    longestSession: 0,
    mostXPInDay: 0,
    mostSessionsInDay: 0,
    highestCombo: 0,
    fastestLevelUp: 0,
    perfectWeek: false
  },
  milestones: [],
  comboTracker: {
    currentCombo: 0,
    longestCombo: 0,
    todayActivities: 0,
    lastComboDate: null
  },
  totalStars: 0,
  consecutivePerfectSessions: 0,
  moodImprovementCount: 0
});

// Load progress from localStorage
export const loadProgress = (): ProgressData => {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultProgress();
    }

    const parsed = JSON.parse(stored);
    const defaults = getDefaultProgress();
    return {
      ...defaults,
      ...parsed,
      skillsPracticed: new Set(parsed?.skillsPracticed ?? []),
      skillMastery: parsed?.skillMastery ?? {},
      calmSessions: parsed?.calmSessions ?? [],
      skillSessions: parsed?.skillSessions ?? [],
      dailyQuests: parsed?.dailyQuests ?? [],
      achievements: parsed?.achievements ?? [],
      favoriteSkills: parsed?.favoriteSkills ?? [],
      favoriteExercises: parsed?.favoriteExercises ?? [],
      personalBests: parsed?.personalBests ?? defaults.personalBests,
      milestones: parsed?.milestones ?? defaults.milestones,
      comboTracker: parsed?.comboTracker ?? defaults.comboTracker,
      totalStars: parsed?.totalStars ?? 0,
      consecutivePerfectSessions: parsed?.consecutivePerfectSessions ?? 0,
      moodImprovementCount: parsed?.moodImprovementCount ?? 0
    };
  } catch (error) {
    console.error('Failed to load progress:', error);
    return getDefaultProgress();
  }
};

// Save progress to localStorage
export const saveProgress = (progress: ProgressData): void => {
  if (typeof window === 'undefined') return;

  try {
    const toStore = {
      ...progress,
      skillsPracticed: Array.from(progress?.skillsPracticed ?? [])
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Award XP and check for level up
export const awardXP = (amount: number, reason: string): { progress: ProgressData; leveledUp: boolean; newAchievements: Achievement[] } => {
  const progress = loadProgress();
  progress.totalXP += amount;
  
  let leveledUp = false;
  const newAchievements: Achievement[] = [];
  
  // Check for level up
  const xpNeeded = getXPForLevel(progress.currentLevel + 1);
  const currentXP = progress.totalXP;
  
  // Calculate current level based on total XP
  let calculatedLevel = 1;
  let xpForThisLevel = 0;
  while (currentXP >= getXPForLevel(calculatedLevel + 1)) {
    xpForThisLevel += getXPForLevel(calculatedLevel + 1);
    calculatedLevel++;
  }
  
  if (calculatedLevel > progress.currentLevel) {
    leveledUp = true;
    progress.currentLevel = calculatedLevel;
    
    // Award level up achievement
    if (calculatedLevel % 5 === 0) {
      const achievement: Achievement = {
        id: `level-${calculatedLevel}`,
        name: `Level ${calculatedLevel} ${getLevelTitle(calculatedLevel)}`,
        description: `Reached level ${calculatedLevel}!`,
        icon: '🏆',
        earnedAt: new Date().toISOString(),
        category: 'general',
        requirement: {
          type: 'count',
          target: calculatedLevel
        }
      };
      progress.achievements.push(achievement);
      newAchievements.push(achievement);
    }
  }
  
  saveProgress(progress);
  return { progress, leveledUp, newAchievements };
};

// Get current level info
export const getLevelInfo = (progress: ProgressData): UserLevel => {
  const xpForNextLevel = getXPForLevel(progress.currentLevel + 1);
  const xpForCurrentLevel = progress.currentLevel > 1 ? getXPForLevel(progress.currentLevel) : 0;
  const currentXP = progress.totalXP - xpForCurrentLevel;
  const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
  
  return {
    level: progress.currentLevel,
    currentXP,
    xpToNextLevel,
    title: getLevelTitle(progress.currentLevel)
  };
};

// Log a calm/breathing session with mood tracking
export const logCalmSession = (
  exerciseId: string,
  minutes: number,
  moodBefore?: MoodRating,
  moodAfter?: MoodRating,
  notes?: string
): { progress: ProgressData; xpAwarded: number; leveledUp: boolean; questsCompleted: DailyQuest[]; starsEarned: number; comboInfo: { increased: boolean; current: number }; milestonesCompleted: Milestone[] } => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];

  // Create session record
  const session: CalmSession = {
    timestamp: new Date().toISOString(),
    exerciseId,
    duration: minutes,
    moodBefore,
    moodAfter,
    notes
  };
  progress.calmSessions.push(session);
  
  // Keep only last 100 sessions
  if (progress.calmSessions.length > 100) {
    progress.calmSessions = progress.calmSessions.slice(-100);
  }

  // Update basic stats
  progress.totalSessions += 1;
  progress.totalMinutes += minutes;

  // Update weekly activity
  progress.weeklyActivity[today] = (progress?.weeklyActivity?.[today] ?? 0) + minutes;

  // Update streak
  updateStreak(progress, today);

  // Calculate XP
  let xpAwarded = 10 + Math.floor(minutes * 2);
  let starsEarned = 0;
  let isPerfectSession = false;
  
  if (moodBefore && moodAfter && moodAfter > moodBefore) {
    xpAwarded += 5; // Bonus for mood improvement
    trackMoodImprovement(moodBefore, moodAfter);
    starsEarned += 1;
    isPerfectSession = true;
  }
  
  // Bonus for longer sessions
  if (minutes >= 10) {
    xpAwarded += 10;
    starsEarned += 1;
  }
  
  // Update daily quests
  const questsCompleted = updateDailyQuests(progress, 'calm', 1);
  
  // Update combo tracker
  const comboInfo = updateComboTracker();
  if (comboInfo.current >= 3) {
    xpAwarded += comboInfo.current * 2; // Combo bonus
  }
  
  // Award stars
  if (starsEarned > 0) {
    awardStars(starsEarned, isPerfectSession);
  }
  
  // Update personal bests
  updatePersonalBests({ longestSession: minutes });
  const dailyXP = getDailyXP() + xpAwarded;
  updatePersonalBests({ mostXPInDay: dailyXP });
  const todaySessions = getTodaySessionCount() + 1;
  updatePersonalBests({ mostSessionsInDay: todaySessions });
  
  saveProgress(progress);
  
  const { leveledUp } = awardXP(xpAwarded, 'calm session');
  
  // Update and check milestones
  const { newlyCompleted } = updateMilestones();

  return { progress, xpAwarded, leveledUp, questsCompleted, starsEarned, comboInfo, milestonesCompleted: newlyCompleted };
};

// Log a skill practice session
export const logSkillPractice = (
  skillId: string,
  minutes: number,
  notes?: string,
  completed: boolean = true
): { progress: ProgressData; xpAwarded: number; leveledUp: boolean; masteryLevelUp: boolean; questsCompleted: DailyQuest[] } => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];

  // Initialize skill mastery if not exists
  if (!progress.skillMastery[skillId]) {
    progress.skillMastery[skillId] = {
      skillId,
      level: 0,
      practiceCount: 0,
      totalMinutes: 0,
      lastPracticed: null,
      notes: [],
      isFavorite: false
    };
  }
  
  const mastery = progress.skillMastery[skillId];
  const previousLevel = mastery.level;
  
  // Update mastery
  mastery.practiceCount += 1;
  mastery.totalMinutes += minutes;
  mastery.lastPracticed = today;
  
  if (notes) {
    mastery.notes.push(`${today}: ${notes}`);
    if (mastery.notes.length > 20) {
      mastery.notes = mastery.notes.slice(-20);
    }
  }
  
  // Calculate mastery level based on practice count
  // 0: Novice, 1: Beginner (3+), 2: Intermediate (7+), 3: Advanced (15+), 4: Expert (30+), 5: Master (50+)
  if (mastery.practiceCount >= 50) mastery.level = 5;
  else if (mastery.practiceCount >= 30) mastery.level = 4;
  else if (mastery.practiceCount >= 15) mastery.level = 3;
  else if (mastery.practiceCount >= 7) mastery.level = 2;
  else if (mastery.practiceCount >= 3) mastery.level = 1;
  
  const masteryLevelUp = mastery.level > previousLevel;
  
  // Create session record
  const session: SkillPracticeSession = {
    timestamp: new Date().toISOString(),
    skillId,
    duration: minutes,
    masteryLevel: mastery.level,
    notes,
    completed
  };
  progress.skillSessions.push(session);
  
  if (progress.skillSessions.length > 100) {
    progress.skillSessions = progress.skillSessions.slice(-100);
  }

  // Update basic stats
  progress.totalSessions += 1;
  progress.totalMinutes += minutes;
  progress.skillsPracticed.add(skillId);

  // Update weekly activity
  progress.weeklyActivity[today] = (progress?.weeklyActivity?.[today] ?? 0) + minutes;

  // Update streak
  updateStreak(progress, today);

  // Calculate XP
  let xpAwarded = 15 + Math.floor(minutes * 3);
  if (masteryLevelUp) {
    xpAwarded += 50; // Big bonus for mastery level up
  }
  if (completed) {
    xpAwarded += 10;
  }
  
  // Update daily quests
  const questsCompleted = updateDailyQuests(progress, 'skill', 1);
  
  saveProgress(progress);
  
  const { leveledUp } = awardXP(xpAwarded, 'skill practice');

  return { progress, xpAwarded, leveledUp, masteryLevelUp, questsCompleted };
};

// Update streak logic
const updateStreak = (progress: ProgressData, today: string): void => {
  if (progress?.lastActivityDate === today) {
    // Same day, streak continues
  } else if (isYesterday(progress?.lastActivityDate ?? '')) {
    progress.currentStreak += 1;
  } else if (progress.streakProtections > 0 && progress.lastActivityDate) {
    // Use streak protection
    progress.streakProtections -= 1;
    progress.currentStreak += 1;
  } else {
    // Streak broken
    progress.currentStreak = 1;
  }

  progress.lastActivityDate = today;
  progress.longestStreak = Math.max(progress?.longestStreak ?? 0, progress?.currentStreak ?? 0);
};

// Generate daily quests
export const generateDailyQuests = (): DailyQuest[] => {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      id: 'daily-calm',
      title: 'Daily Calm',
      description: 'Complete 1 breathing exercise today',
      type: 'calm',
      target: 1,
      current: 0,
      xpReward: 50,
      completed: false,
      date: today
    },
    {
      id: 'skill-practice',
      title: 'Skill Practice',
      description: 'Practice 2 different skills today',
      type: 'skill',
      target: 2,
      current: 0,
      xpReward: 75,
      completed: false,
      date: today
    },
    {
      id: 'time-investment',
      title: 'Time Investment',
      description: 'Spend 15 minutes practicing today',
      type: 'time',
      target: 15,
      current: 0,
      xpReward: 100,
      completed: false,
      date: today
    }
  ];
};

// Update daily quests
const updateDailyQuests = (progress: ProgressData, type: string, amount: number): DailyQuest[] => {
  const today = new Date().toISOString().split('T')[0];
  
  // Reset quests if new day
  if (!progress.dailyQuests.length || progress.dailyQuests[0]?.date !== today) {
    progress.dailyQuests = generateDailyQuests();
  }
  
  const completedQuests: DailyQuest[] = [];
  
  progress.dailyQuests.forEach(quest => {
    if (!quest.completed && quest.type === type) {
      quest.current += amount;
      if (quest.current >= quest.target) {
        quest.completed = true;
        completedQuests.push(quest);
        // Award quest XP immediately
        progress.totalXP += quest.xpReward;
      }
    }
  });
  
  return completedQuests;
};

// Toggle favorite skill
export const toggleFavoriteSkill = (skillId: string): ProgressData => {
  const progress = loadProgress();
  
  const index = progress.favoriteSkills.indexOf(skillId);
  if (index > -1) {
    progress.favoriteSkills.splice(index, 1);
  } else {
    progress.favoriteSkills.push(skillId);
  }
  
  // Also update in mastery if exists
  if (progress.skillMastery[skillId]) {
    progress.skillMastery[skillId].isFavorite = !progress.skillMastery[skillId].isFavorite;
  }
  
  saveProgress(progress);
  return progress;
};

// Toggle favorite exercise
export const toggleFavoriteExercise = (exerciseId: string): ProgressData => {
  const progress = loadProgress();
  
  const index = progress.favoriteExercises.indexOf(exerciseId);
  if (index > -1) {
    progress.favoriteExercises.splice(index, 1);
  } else {
    progress.favoriteExercises.push(exerciseId);
  }
  
  saveProgress(progress);
  return progress;
};

// Award a badge
export const awardBadge = (badgeId: string, xpReward: number = 50): ProgressData => {
  const progress = loadProgress();

  if (!progress?.earnedBadges?.includes(badgeId)) {
    progress.earnedBadges.push(badgeId);
    awardXP(xpReward, `badge: ${badgeId}`);
    saveProgress(progress);
  }

  return progress;
};

// Check if a date is yesterday
const isYesterday = (dateString: string): boolean => {
  if (!dateString) return false;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return dateString === yesterdayStr;
};

// Reset progress
export const resetProgress = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
};

// Get analytics
export const getAnalytics = (progress: ProgressData) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  const weeklyData = last7Days.map(date => ({
    date,
    minutes: progress.weeklyActivity[date] || 0
  }));
  
  // Mood trend from last 10 calm sessions
  const recentCalmSessions = progress.calmSessions.slice(-10);
  const moodImprovement = recentCalmSessions.filter(
    s => s.moodBefore && s.moodAfter && s.moodAfter > s.moodBefore
  ).length;
  
  // Most practiced skills
  const skillStats = Object.values(progress.skillMastery)
    .sort((a, b) => b.practiceCount - a.practiceCount)
    .slice(0, 5);
  
  return {
    weeklyData,
    moodImprovementRate: recentCalmSessions.length > 0 ? (moodImprovement / recentCalmSessions.length) * 100 : 0,
    topSkills: skillStats,
    totalPracticeTime: progress.totalMinutes,
    averageSessionLength: progress.totalSessions > 0 ? progress.totalMinutes / progress.totalSessions : 0
  };
};

// Preferences (audience and country)
export interface Preferences {
  audience: 'teacher' | 'parent' | 'autistic' | 'employer';
  country: 'UK' | 'US' | 'EU';
}

export const loadPreferences = (): Preferences => {
  if (typeof window === 'undefined') {
    return { audience: 'teacher', country: 'UK' };
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) {
      return { audience: 'teacher', country: 'UK' };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return { audience: 'teacher', country: 'UK' };
  }
};

export const savePreferences = (preferences: Preferences): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

// ========== ADVANCED GAMIFICATION FEATURES ==========

// Update combo tracker
export const updateComboTracker = (): { increased: boolean; current: number } => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (progress.comboTracker.lastComboDate === today) {
    // Already updated today, just increment activity count
    progress.comboTracker.todayActivities++;
    saveProgress(progress);
    return { increased: false, current: progress.comboTracker.currentCombo };
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (progress.comboTracker.lastComboDate === yesterdayStr) {
    // Consecutive day - increase combo
    progress.comboTracker.currentCombo++;
    progress.comboTracker.todayActivities = 1;
  } else {
    // Combo broken - reset
    progress.comboTracker.currentCombo = 1;
    progress.comboTracker.todayActivities = 1;
  }
  
  progress.comboTracker.lastComboDate = today;
  
  // Update longest combo
  if (progress.comboTracker.currentCombo > progress.comboTracker.longestCombo) {
    progress.comboTracker.longestCombo = progress.comboTracker.currentCombo;
  }
  
  // Update personal best
  if (progress.comboTracker.currentCombo > progress.personalBests.highestCombo) {
    progress.personalBests.highestCombo = progress.comboTracker.currentCombo;
  }
  
  saveProgress(progress);
  return { increased: true, current: progress.comboTracker.currentCombo };
};

// Award stars for perfect sessions
export const awardStars = (count: number = 1, isPerfect: boolean = false): number => {
  const progress = loadProgress();
  progress.totalStars += count;
  
  if (isPerfect) {
    progress.consecutivePerfectSessions++;
  } else {
    progress.consecutivePerfectSessions = 0;
  }
  
  saveProgress(progress);
  return progress.totalStars;
};

// Update personal bests
export const updatePersonalBests = (updates: Partial<PersonalBest>): PersonalBest => {
  const progress = loadProgress();
  
  if (updates.longestSession && updates.longestSession > progress.personalBests.longestSession) {
    progress.personalBests.longestSession = updates.longestSession;
  }
  if (updates.mostXPInDay && updates.mostXPInDay > progress.personalBests.mostXPInDay) {
    progress.personalBests.mostXPInDay = updates.mostXPInDay;
  }
  if (updates.mostSessionsInDay && updates.mostSessionsInDay > progress.personalBests.mostSessionsInDay) {
    progress.personalBests.mostSessionsInDay = updates.mostSessionsInDay;
  }
  if (updates.perfectWeek !== undefined) {
    progress.personalBests.perfectWeek = updates.perfectWeek || progress.personalBests.perfectWeek;
  }
  
  saveProgress(progress);
  return progress.personalBests;
};

// Track mood improvement
export const trackMoodImprovement = (moodBefore: MoodRating, moodAfter: MoodRating): boolean => {
  const progress = loadProgress();
  
  if (moodAfter > moodBefore) {
    progress.moodImprovementCount++;
    saveProgress(progress);
    return true;
  }
  
  return false;
};

// Initialize default milestones
export const initializeMilestones = (): void => {
  const progress = loadProgress();
  
  if (progress.milestones.length === 0) {
    progress.milestones = [
      // Session milestones
      { id: 'sessions_10', title: 'Practice Starter', description: 'Complete 10 sessions', icon: '🎯', targetValue: 10, currentValue: 0, completed: false, category: 'sessions' },
      { id: 'sessions_50', title: 'Dedicated Practitioner', description: 'Complete 50 sessions', icon: '🏅', targetValue: 50, currentValue: 0, completed: false, category: 'sessions' },
      { id: 'sessions_100', title: 'Century Club', description: 'Complete 100 sessions', icon: '💯', targetValue: 100, currentValue: 0, completed: false, category: 'sessions' },
      { id: 'sessions_500', title: 'Practice Legend', description: 'Complete 500 sessions', icon: '👑', targetValue: 500, currentValue: 0, completed: false, category: 'sessions' },
      
      // Time milestones
      { id: 'time_60', title: 'First Hour', description: 'Practice for 60 minutes total', icon: '⏰', targetValue: 60, currentValue: 0, completed: false, category: 'time' },
      { id: 'time_300', title: '5 Hour Hero', description: 'Practice for 5 hours total', icon: '⏱️', targetValue: 300, currentValue: 0, completed: false, category: 'time' },
      { id: 'time_1000', title: 'Time Master', description: 'Practice for 1000 minutes total', icon: '⌚', targetValue: 1000, currentValue: 0, completed: false, category: 'time' },
      
      // Streak milestones
      { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', targetValue: 7, currentValue: 0, completed: false, category: 'streak' },
      { id: 'streak_30', title: 'Monthly Champion', description: 'Maintain a 30-day streak', icon: '📅', targetValue: 30, currentValue: 0, completed: false, category: 'streak' },
      { id: 'streak_100', title: 'Streak Master', description: 'Maintain a 100-day streak', icon: '⚡', targetValue: 100, currentValue: 0, completed: false, category: 'streak' },
      
      // Skills milestones
      { id: 'skills_5', title: 'Skill Explorer', description: 'Practice 5 different skills', icon: '🌟', targetValue: 5, currentValue: 0, completed: false, category: 'skills' },
      { id: 'skills_10', title: 'Skill Master', description: 'Practice all 10 skills', icon: '✨', targetValue: 10, currentValue: 0, completed: false, category: 'skills' },
      
      // XP milestones
      { id: 'xp_1000', title: 'XP Collector', description: 'Earn 1000 XP', icon: '💎', targetValue: 1000, currentValue: 0, completed: false, category: 'xp' },
      { id: 'xp_5000', title: 'XP Champion', description: 'Earn 5000 XP', icon: '💰', targetValue: 5000, currentValue: 0, completed: false, category: 'xp' },
      { id: 'xp_10000', title: 'XP Legend', description: 'Earn 10000 XP', icon: '🏆', targetValue: 10000, currentValue: 0, completed: false, category: 'xp' },
      
      // Level milestones
      { id: 'level_5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐', targetValue: 5, currentValue: 0, completed: false, category: 'level' },
      { id: 'level_10', title: 'Expert Level', description: 'Reach level 10', icon: '🌠', targetValue: 10, currentValue: 0, completed: false, category: 'level' },
      { id: 'level_20', title: 'Master Level', description: 'Reach level 20', icon: '🎖️', targetValue: 20, currentValue: 0, completed: false, category: 'level' }
    ];
    saveProgress(progress);
  }
};

// Update milestones based on current progress
export const updateMilestones = (): { completed: Milestone[]; newlyCompleted: Milestone[] } => {
  const progress = loadProgress();
  const newlyCompleted: Milestone[] = [];
  
  progress.milestones.forEach(milestone => {
    if (milestone.completed) return;
    
    // Update current value based on category
    switch (milestone.category) {
      case 'sessions':
        milestone.currentValue = progress.totalSessions;
        break;
      case 'time':
        milestone.currentValue = progress.totalMinutes;
        break;
      case 'streak':
        milestone.currentValue = progress.currentStreak;
        break;
      case 'skills':
        milestone.currentValue = progress.skillsPracticed.size;
        break;
      case 'xp':
        milestone.currentValue = progress.totalXP;
        break;
      case 'level':
        milestone.currentValue = progress.currentLevel;
        break;
    }
    
    // Check if milestone is completed
    if (milestone.currentValue >= milestone.targetValue && !milestone.completed) {
      milestone.completed = true;
      milestone.completedAt = new Date().toISOString();
      newlyCompleted.push(milestone);
    }
  });
  
  saveProgress(progress);
  
  const allCompleted = progress.milestones.filter(m => m.completed);
  return { completed: allCompleted, newlyCompleted };
};

// Get daily XP earned
export const getDailyXP = (): number => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];
  
  const todayXP = progress.calmSessions
    .filter(s => s.timestamp.startsWith(today))
    .reduce((sum, session) => sum + (session.duration * 2), 0) +
    progress.skillSessions
    .filter(s => s.timestamp.startsWith(today))
    .reduce((sum, session) => sum + (session.duration * 3), 0);
  
  return todayXP;
};

// Get today's session count
export const getTodaySessionCount = (): number => {
  const progress = loadProgress();
  const today = new Date().toISOString().split('T')[0];
  
  const todaySessions = progress.calmSessions.filter(s => s.timestamp.startsWith(today)).length +
    progress.skillSessions.filter(s => s.timestamp.startsWith(today)).length;
  
  return todaySessions;
};

// Check for perfect week
export const checkPerfectWeek = (): boolean => {
  const progress = loadProgress();
  const last7Days: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split('T')[0]);
  }
  
  const activeDays = new Set(
    [...progress.calmSessions, ...progress.skillSessions]
      .map(s => s.timestamp.split('T')[0])
      .filter(date => last7Days.includes(date))
  );
  
  const isPerfectWeek = activeDays.size === 7;
  
  if (isPerfectWeek && !progress.personalBests.perfectWeek) {
    updatePersonalBests({ perfectWeek: true });
  }
  
  return isPerfectWeek;
};
