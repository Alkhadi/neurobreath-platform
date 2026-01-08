/**
 * Progress Store (v1)
 * 
 * Per-profile progress tracking with streak engine.
 * Supports multiple profiles, timezone-safe streaks, XP/coins/badges.
 * 
 * Storage Key: nb:progress:v1
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ActivityRecord {
  id: string
  timestamp: string // ISO 8601
  activityKey: string // e.g., 'dyslexia-reading', 'breathing-sos', 'focus-tiles'
  durationSec: number
  metrics?: {
    accuracy?: number
    wpm?: number
    score?: number
    [key: string]: any
  }
}

export interface ProfileProgress {
  profileId: string
  totalXp: number
  totalCoins: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null // YYYY-MM-DD (local date)
  activities: ActivityRecord[]
  badges: string[] // badge keys
  dailyQuestCompleted: boolean
  lastDailyQuestDate: string | null // YYYY-MM-DD
  createdAt: string
  lastUpdated: string
}

export interface ProgressStore {
  version: number
  profiles: Record<string, ProfileProgress> // profileId -> ProfileProgress
  createdAt: string
  lastUpdated: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'nb:progress:v1'
const CURRENT_VERSION = 1

// XP/Coin rewards
const XP_PER_MINUTE = 10
const COINS_PER_ACTIVITY = 5
const STREAK_BONUS_XP = [0, 10, 25, 50, 100, 200] // days 1-5+

// ============================================================================
// DEFAULT STATE
// ============================================================================

function createDefaultProgressStore(): ProgressStore {
  return {
    version: CURRENT_VERSION,
    profiles: {},
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }
}

function createDefaultProfileProgress(profileId: string): ProfileProgress {
  return {
    profileId,
    totalXp: 0,
    totalCoins: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    activities: [],
    badges: [],
    dailyQuestCompleted: false,
    lastDailyQuestDate: null,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Load progress store from localStorage
 * SSR-safe - returns null on server
 */
function loadProgressStore(): ProgressStore | null {
  if (typeof window === 'undefined') return null
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultProgressStore()
    
    const parsed = JSON.parse(raw) as ProgressStore
    
    // Version migration if needed
    if (parsed.version !== CURRENT_VERSION) {
      return migrateProgressStore(parsed)
    }
    
    return parsed
  } catch (error) {
    console.error('[ProgressStore] Failed to load:', error)
    return createDefaultProgressStore()
  }
}

/**
 * Save progress store to localStorage
 * SSR-safe - no-op on server
 */
function saveProgressStore(store: ProgressStore): void {
  if (typeof window === 'undefined') return
  
  try {
    store.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (error) {
    console.error('[ProgressStore] Failed to save:', error)
  }
}

/**
 * Get or create profile progress
 */
function getOrCreateProfileProgress(profileId: string): ProfileProgress {
  const store = loadProgressStore()
  if (!store) throw new Error('Cannot access progress store on server')
  
  if (!store.profiles[profileId]) {
    store.profiles[profileId] = createDefaultProfileProgress(profileId)
    saveProgressStore(store)
  }
  
  return store.profiles[profileId]
}

// ============================================================================
// ACTIVITY TRACKING
// ============================================================================

/**
 * Record an activity for a profile
 */
export function recordActivity(
  profileId: string,
  activityKey: string,
  durationSec: number,
  metrics?: ActivityRecord['metrics']
): ProfileProgress {
  const store = loadProgressStore()
  if (!store) throw new Error('Cannot record activity on server')
  
  const progress = getOrCreateProfileProgress(profileId)
  
  // Create activity record
  const activity: ActivityRecord = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    activityKey,
    durationSec,
    metrics,
  }
  
  progress.activities.push(activity)
  
  // Award XP and coins
  const xp = Math.floor(durationSec / 60) * XP_PER_MINUTE
  progress.totalXp += xp
  progress.totalCoins += COINS_PER_ACTIVITY
  
  // Update streak
  const today = getLocalDate()
  const yesterday = getYesterday()
  
  if (progress.lastActiveDate === yesterday) {
    // Continue streak
    progress.currentStreak += 1
    
    // Award streak bonus
    const bonusIndex = Math.min(progress.currentStreak - 1, STREAK_BONUS_XP.length - 1)
    progress.totalXp += STREAK_BONUS_XP[bonusIndex]
  } else if (progress.lastActiveDate !== today) {
    // Start new streak
    progress.currentStreak = 1
  }
  // If lastActiveDate === today, streak stays the same (multiple activities today)
  
  progress.longestStreak = Math.max(progress.currentStreak, progress.longestStreak)
  progress.lastActiveDate = today
  progress.lastUpdated = new Date().toISOString()
  
  saveProgressStore(store)
  return progress
}

/**
 * Get all activities for a profile
 */
export function getActivities(profileId: string, limit?: number): ActivityRecord[] {
  const progress = getOrCreateProfileProgress(profileId)
  const activities = [...progress.activities].reverse() // most recent first
  
  return limit ? activities.slice(0, limit) : activities
}

/**
 * Get activities for a specific date
 */
export function getDailyCompletion(profileId: string, date: string): ActivityRecord[] {
  const progress = getOrCreateProfileProgress(profileId)
  
  return progress.activities.filter(activity => {
    const activityDate = new Date(activity.timestamp).toISOString().split('T')[0]
    return activityDate === date
  })
}

// ============================================================================
// STREAK ENGINE
// ============================================================================

/**
 * Get current streak for a profile
 */
export function getStreak(profileId: string): { current: number; longest: number; lastActiveDate: string | null } {
  const progress = getOrCreateProfileProgress(profileId)
  
  // Check if streak is broken
  const today = getLocalDate()
  const yesterday = getYesterday()
  
  if (progress.lastActiveDate && progress.lastActiveDate !== today && progress.lastActiveDate !== yesterday) {
    // Streak is broken
    progress.currentStreak = 0
  }
  
  return {
    current: progress.currentStreak,
    longest: progress.longestStreak,
    lastActiveDate: progress.lastActiveDate,
  }
}

/**
 * Get last active date for a profile
 */
export function getLastActiveDate(profileId: string): string | null {
  const progress = getOrCreateProfileProgress(profileId)
  return progress.lastActiveDate
}

/**
 * Check if profile practiced today
 */
export function practicedToday(profileId: string): boolean {
  const progress = getOrCreateProfileProgress(profileId)
  const today = getLocalDate()
  return progress.lastActiveDate === today
}

// ============================================================================
// XP, COINS, BADGES
// ============================================================================

/**
 * Award XP/Coins to a profile
 */
export function awardXpCoins(profileId: string, xp: number, coins: number): ProfileProgress {
  const store = loadProgressStore()
  if (!store) throw new Error('Cannot award XP/coins on server')
  
  const progress = getOrCreateProfileProgress(profileId)
  
  progress.totalXp += xp
  progress.totalCoins += coins
  progress.lastUpdated = new Date().toISOString()
  
  saveProgressStore(store)
  return progress
}

/**
 * Get XP and coins for a profile
 */
export function getXpCoins(profileId: string): { xp: number; coins: number } {
  const progress = getOrCreateProfileProgress(profileId)
  return {
    xp: progress.totalXp,
    coins: progress.totalCoins,
  }
}

/**
 * Add a badge to a profile
 */
export function addBadge(profileId: string, badgeKey: string): ProfileProgress {
  const store = loadProgressStore()
  if (!store) throw new Error('Cannot add badge on server')
  
  const progress = getOrCreateProfileProgress(profileId)
  
  if (!progress.badges.includes(badgeKey)) {
    progress.badges.push(badgeKey)
    progress.lastUpdated = new Date().toISOString()
    saveProgressStore(store)
  }
  
  return progress
}

/**
 * Get badges for a profile
 */
export function getBadges(profileId: string): string[] {
  const progress = getOrCreateProfileProgress(profileId)
  return progress.badges
}

// ============================================================================
// DAILY QUEST
// ============================================================================

/**
 * Mark daily quest as completed
 */
export function completeDailyQuest(profileId: string): ProfileProgress {
  const store = loadProgressStore()
  if (!store) throw new Error('Cannot complete quest on server')
  
  const progress = getOrCreateProfileProgress(profileId)
  const today = getLocalDate()
  
  progress.dailyQuestCompleted = true
  progress.lastDailyQuestDate = today
  
  // Award bonus
  progress.totalXp += 50
  progress.totalCoins += 10
  
  progress.lastUpdated = new Date().toISOString()
  saveProgressStore(store)
  
  return progress
}

/**
 * Check if daily quest is available (resets daily)
 */
export function isDailyQuestAvailable(profileId: string): boolean {
  const progress = getOrCreateProfileProgress(profileId)
  const today = getLocalDate()
  
  // Quest resets if it's a new day
  if (progress.lastDailyQuestDate !== today) {
    progress.dailyQuestCompleted = false
  }
  
  return !progress.dailyQuestCompleted
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get comprehensive stats for a profile
 */
export function getProfileStats(profileId: string): {
  totalActivities: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  totalXp: number
  totalCoins: number
  badgeCount: number
  lastActiveDate: string | null
} {
  const progress = getOrCreateProfileProgress(profileId)
  
  const totalMinutes = progress.activities.reduce((sum, a) => sum + Math.floor(a.durationSec / 60), 0)
  
  return {
    totalActivities: progress.activities.length,
    totalMinutes,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    totalXp: progress.totalXp,
    totalCoins: progress.totalCoins,
    badgeCount: progress.badges.length,
    lastActiveDate: progress.lastActiveDate,
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generate a simple unique ID (client-side only)
 */
function generateId(): string {
  return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get local date in YYYY-MM-DD format (timezone-safe)
 */
function getLocalDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get yesterday's date in YYYY-MM-DD format (timezone-safe)
 */
function getYesterday(): string {
  const now = new Date()
  now.setDate(now.getDate() - 1)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Migrate old progress store to new version
 */
function migrateProgressStore(old: any): ProgressStore {
  console.warn('[ProgressStore] Migrating old version:', old.version)
  
  const migrated = createDefaultProgressStore()
  
  // Preserve what we can
  if (old.profiles) {
    migrated.profiles = old.profiles
  }
  
  return migrated
}

/**
 * Clear all progress (for testing or factory reset)
 */
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('[ProgressStore] Failed to clear:', error)
  }
}

