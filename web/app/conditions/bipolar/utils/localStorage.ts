// localStorage utilities for persisting user data
import {
  MoodEntry,
  Streak,
  Achievement,
  InteractiveToolData,
  LocalStorageData,
} from '../types';

const STORAGE_KEY = 'bipolar_page_data';

// Initialize default achievements
const defaultAchievements: Achievement[] = [
  {
    id: 'first_entry',
    name: 'Getting Started',
    description: 'Log your first mood entry',
    icon: '🌟',
    milestone: 1,
    unlocked: false,
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Log your mood for 3 consecutive days',
    icon: '🔥',
    milestone: 3,
    unlocked: false,
  },
  {
    id: 'streak_7',
    name: 'One Week Strong',
    description: 'Maintain a 7-day logging streak',
    icon: '⭐',
    milestone: 7,
    unlocked: false,
  },
  {
    id: 'streak_14',
    name: 'Two Weeks Champion',
    description: 'Keep tracking for 14 consecutive days',
    icon: '💪',
    milestone: 14,
    unlocked: false,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Complete a full month of mood tracking',
    icon: '🏆',
    milestone: 30,
    unlocked: false,
  },
  {
    id: 'streak_60',
    name: '60-Day Warrior',
    description: 'Track your mood for 60 consecutive days',
    icon: '👑',
    milestone: 60,
    unlocked: false,
  },
  {
    id: 'streak_90',
    name: 'Quarter Year Hero',
    description: 'Achieve a 90-day streak',
    icon: '🌈',
    milestone: 90,
    unlocked: false,
  },
  {
    id: 'entries_50',
    name: 'Data Collector',
    description: 'Log 50 total mood entries',
    icon: '📊',
    milestone: 50,
    unlocked: false,
  },
  {
    id: 'entries_100',
    name: 'Century Club',
    description: 'Reach 100 total mood entries',
    icon: '💯',
    milestone: 100,
    unlocked: false,
  },
  {
    id: 'tool_explorer',
    name: 'Tool Explorer',
    description: 'Try all interactive management tools',
    icon: '🎯',
    milestone: 1,
    unlocked: false,
  },
];

// Get all data from localStorage
export const getAllData = (): LocalStorageData => {
  if (typeof window === 'undefined') {
    return {
      moodEntries: [],
      streak: { current: 0, longest: 0, lastEntryDate: '' },
      achievements: defaultAchievements,
      languagePreference: { language: 'en-GB', autoDetected: true },
      interactiveTools: [],
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...data,
        achievements: data.achievements || defaultAchievements,
      };
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }

  return {
    moodEntries: [],
    streak: { current: 0, longest: 0, lastEntryDate: '' },
    achievements: defaultAchievements,
    languagePreference: { language: 'en-GB', autoDetected: true },
    interactiveTools: [],
  };
};

// Save all data to localStorage
export const saveAllData = (data: LocalStorageData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

// Save a mood entry
export const saveMoodEntry = (entry: MoodEntry): void => {
  const data = getAllData();
  
  // Check if entry for this date already exists
  const existingIndex = data.moodEntries.findIndex(e => e.date === entry.date);
  
  if (existingIndex >= 0) {
    data.moodEntries[existingIndex] = entry;
  } else {
    data.moodEntries.push(entry);
  }
  
  // Sort by date (most recent first)
  data.moodEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Update streak
  data.streak = calculateStreak(data.moodEntries);
  
  // Check for new achievements
  data.achievements = updateAchievements(data);
  
  saveAllData(data);
};

// Calculate current and longest streak
export const calculateStreak = (entries: MoodEntry[]): Streak => {
  if (entries.length === 0) {
    return { current: 0, longest: 0, lastEntryDate: '' };
  }

  // Sort entries by date (most recent first)
  const sorted = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastEntryDate = sorted[0].date;
  const lastEntry = new Date(lastEntryDate);
  lastEntry.setHours(0, 0, 0, 0);
  
  // Check if the last entry is today or yesterday
  const dayDiff = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  if (dayDiff <= 1) {
    // Calculate current streak
    currentStreak = 1;
    const checkDate = new Date(lastEntry);
    
    for (let i = 1; i < sorted.length; i++) {
      checkDate.setDate(checkDate.getDate() - 1);
      const entryDate = new Date(sorted[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === checkDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak
  tempStreak = 1;
  longestStreak = 1;
  
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);
  
  return {
    current: currentStreak,
    longest: longestStreak,
    lastEntryDate,
  };
};

// Update achievements based on current data
export const updateAchievements = (data: LocalStorageData): Achievement[] => {
  const achievements = [...data.achievements];
  const now = new Date().toISOString();
  
  achievements.forEach(achievement => {
    if (achievement.unlocked) return;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first_entry':
        shouldUnlock = data.moodEntries.length >= 1;
        break;
      case 'streak_3':
        shouldUnlock = data.streak.current >= 3;
        break;
      case 'streak_7':
        shouldUnlock = data.streak.current >= 7;
        break;
      case 'streak_14':
        shouldUnlock = data.streak.current >= 14;
        break;
      case 'streak_30':
        shouldUnlock = data.streak.current >= 30;
        break;
      case 'streak_60':
        shouldUnlock = data.streak.current >= 60;
        break;
      case 'streak_90':
        shouldUnlock = data.streak.current >= 90;
        break;
      case 'entries_50':
        shouldUnlock = data.moodEntries.length >= 50;
        break;
      case 'entries_100':
        shouldUnlock = data.moodEntries.length >= 100;
        break;
      case 'tool_explorer':
        shouldUnlock = data.interactiveTools.length >= 3;
        break;
    }
    
    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedDate = now;
    }
  });
  
  return achievements;
};

// Track interactive tool usage
export const trackToolUsage = (toolId: string, toolName: string): void => {
  const data = getAllData();
  
  const existingTool = data.interactiveTools.find(t => t.id === toolId);
  
  if (existingTool) {
    existingTool.completionCount++;
    existingTool.lastCompleted = new Date().toISOString();
  } else {
    data.interactiveTools.push({
      id: toolId,
      name: toolName,
      description: '',
      evidenceBase: '',
      completionCount: 1,
      lastCompleted: new Date().toISOString(),
    });
  }
  
  // Update achievements
  data.achievements = updateAchievements(data);
  
  saveAllData(data);
};

// Export mood data as CSV
export const exportMoodDataAsCSV = (): string => {
  const data = getAllData();
  
  if (data.moodEntries.length === 0) {
    return 'No data to export';
  }
  
  const headers = ['Date', 'Mood (1-10)', 'Mood State', 'Sleep Hours', 'Medications Taken', 'Triggers', 'Notes'];
  const rows = data.moodEntries.map(entry => [
    entry.date,
    entry.mood.toString(),
    entry.moodState,
    entry.sleepHours?.toString() || '',
    entry.medications ? 'Yes' : 'No',
    entry.triggers?.join('; ') || '',
    entry.notes || '',
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csv;
};

// Export mood data as JSON
export const exportMoodDataAsJSON = (): string => {
  const data = getAllData();
  return JSON.stringify(data, null, 2);
};
