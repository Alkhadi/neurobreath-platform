/**
 * Guest Progress Schema & Utilities
 * 
 * Centralized guest mode progress tracking for NeuroBreath.
 * Privacy-first, offline-capable, no forced authentication.
 * 
 * Storage Key: neurobreath:guestProgress
 */

// ============================================================================
// TYPES
// ============================================================================

export interface GuestSession {
  id: string
  timestamp: string // ISO 8601
  technique: string
  label: string
  minutes: number
  breaths: number
  rounds: number
  category?: string // calm, focus, sleep, school, mood
}

export interface GuestAssessment {
  id: string
  timestamp: string
  assessmentType: string // fullCheckIn, orf, wordList, etc.
  levelBandResult?: string
  placementLevel?: string
  scores: {
    decoding?: number
    wordRecognition?: number
    fluency?: number
    comprehension?: number
  }
}

export interface GuestBadge {
  key: string
  name: string
  icon: string
  unlockedAt: string // ISO 8601
}

export interface GuestProgress {
  // Metadata
  version: number
  createdAt: string // ISO 8601
  lastUpdated: string // ISO 8601
  
  // Core stats
  totalSessions: number
  totalMinutes: number
  totalBreaths: number
  currentStreak: number
  longestStreak: number
  lastSessionDate?: string // YYYY-MM-DD
  
  // Activity data
  sessions: GuestSession[]
  assessments: GuestAssessment[]
  badges: GuestBadge[]
  
  // Placement
  currentPlacement?: {
    level: string // NB-L0 through NB-L8
    confidence: string
    placedAt: string
  }
  
  // UI state
  seenAccountPrompt: boolean // 7-session prompt dismissed
  accountPromptDismissedAt?: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const GUEST_PROGRESS_KEY = 'neurobreath:guestProgress'
export const CURRENT_VERSION = 1
export const ACCOUNT_PROMPT_SESSION_THRESHOLD = 7

// ============================================================================
// DEFAULT STATE
// ============================================================================

export function createDefaultGuestProgress(): GuestProgress {
  return {
    version: CURRENT_VERSION,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    totalSessions: 0,
    totalMinutes: 0,
    totalBreaths: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessions: [],
    assessments: [],
    badges: [],
    seenAccountPrompt: false,
  }
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Load guest progress from localStorage
 * SSR-safe - returns null on server
 */
export function loadGuestProgress(): GuestProgress | null {
  if (typeof window === 'undefined') return null
  
  try {
    const raw = localStorage.getItem(GUEST_PROGRESS_KEY)
    if (!raw) return createDefaultGuestProgress()
    
    const parsed = JSON.parse(raw) as GuestProgress
    
    // Version migration if needed
    if (parsed.version !== CURRENT_VERSION) {
      return migrateGuestProgress(parsed)
    }
    
    return parsed
  } catch (error) {
    console.error('[GuestProgress] Failed to load:', error)
    return createDefaultGuestProgress()
  }
}

/**
 * Save guest progress to localStorage
 * SSR-safe - no-op on server
 */
export function saveGuestProgress(progress: GuestProgress): void {
  if (typeof window === 'undefined') return
  
  try {
    progress.lastUpdated = new Date().toISOString()
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('[GuestProgress] Failed to save:', error)
  }
}

/**
 * Clear all guest progress (used for export/reset)
 */
export function clearGuestProgress(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(GUEST_PROGRESS_KEY)
  } catch (error) {
    console.error('[GuestProgress] Failed to clear:', error)
  }
}

// ============================================================================
// HELPER OPERATIONS
// ============================================================================

/**
 * Add a session to guest progress
 */
export function addGuestSession(
  session: Omit<GuestSession, 'id' | 'timestamp'>
): GuestProgress | null {
  const progress = loadGuestProgress()
  if (!progress) return null
  
  const newSession: GuestSession = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...session,
  }
  
  progress.sessions.push(newSession)
  progress.totalSessions += 1
  progress.totalMinutes += session.minutes
  progress.totalBreaths += session.breaths
  
  // Update streak
  const today = new Date().toISOString().split('T')[0]
  const yesterday = getYesterday()
  
  if (progress.lastSessionDate === yesterday) {
    progress.currentStreak += 1
  } else if (progress.lastSessionDate !== today) {
    progress.currentStreak = 1
  }
  
  progress.longestStreak = Math.max(progress.currentStreak, progress.longestStreak)
  progress.lastSessionDate = today
  
  saveGuestProgress(progress)
  return progress
}

/**
 * Add an assessment to guest progress
 */
export function addGuestAssessment(
  assessment: Omit<GuestAssessment, 'id' | 'timestamp'>
): GuestProgress | null {
  const progress = loadGuestProgress()
  if (!progress) return null
  
  const newAssessment: GuestAssessment = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...assessment,
  }
  
  progress.assessments.push(newAssessment)
  
  // Update placement if provided
  if (assessment.placementLevel) {
    progress.currentPlacement = {
      level: assessment.placementLevel,
      confidence: 'medium',
      placedAt: new Date().toISOString(),
    }
  }
  
  saveGuestProgress(progress)
  return progress
}

/**
 * Unlock a badge for guest user
 */
export function unlockGuestBadge(badge: Omit<GuestBadge, 'unlockedAt'>): GuestProgress | null {
  const progress = loadGuestProgress()
  if (!progress) return null
  
  // Check if already unlocked
  const exists = progress.badges.find(b => b.key === badge.key)
  if (exists) return progress
  
  progress.badges.push({
    ...badge,
    unlockedAt: new Date().toISOString(),
  })
  
  saveGuestProgress(progress)
  return progress
}

/**
 * Check if should show account prompt (7+ sessions, not dismissed)
 */
export function shouldShowAccountPrompt(): boolean {
  const progress = loadGuestProgress()
  if (!progress) return false
  
  return (
    progress.totalSessions >= ACCOUNT_PROMPT_SESSION_THRESHOLD &&
    !progress.seenAccountPrompt
  )
}

/**
 * Dismiss account prompt permanently
 */
export function dismissAccountPrompt(): void {
  const progress = loadGuestProgress()
  if (!progress) return
  
  progress.seenAccountPrompt = true
  progress.accountPromptDismissedAt = new Date().toISOString()
  
  saveGuestProgress(progress)
}

/**
 * Export guest progress as .nbx file
 * Returns JSON string ready for download
 */
export function exportGuestProgressAsJSON(): string {
  const progress = loadGuestProgress()
  if (!progress) return '{}'
  
  const exportData = {
    ...progress,
    exportedAt: new Date().toISOString(),
    exportVersion: CURRENT_VERSION,
    appName: 'NeuroBreath',
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Import guest progress from .nbx file
 */
export function importGuestProgress(jsonString: string): boolean {
  try {
    const imported = JSON.parse(jsonString) as GuestProgress
    
    // Validate structure
    if (!imported.version || !imported.sessions) {
      console.error('[GuestProgress] Invalid import format')
      return false
    }
    
    // Merge with existing (optional - could also replace)
    const existing = loadGuestProgress()
    if (existing) {
      // Simple merge: combine sessions, keep higher stats
      imported.sessions = [...existing.sessions, ...imported.sessions]
      imported.totalSessions = Math.max(existing.totalSessions, imported.totalSessions)
      imported.totalMinutes = Math.max(existing.totalMinutes, imported.totalMinutes)
    }
    
    saveGuestProgress(imported)
    return true
  } catch (error) {
    console.error('[GuestProgress] Failed to import:', error)
    return false
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generate a simple unique ID (client-side only)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
function getYesterday(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

/**
 * Migrate old guest progress to new version
 */
function migrateGuestProgress(old: any): GuestProgress {
  // v0 → v1 migration (if needed in future)
  console.warn('[GuestProgress] Migrating old version:', old.version)
  
  const migrated = createDefaultGuestProgress()
  
  // Preserve what we can
  if (old.sessions) migrated.sessions = old.sessions
  if (old.assessments) migrated.assessments = old.assessments
  if (old.badges) migrated.badges = old.badges
  if (typeof old.totalSessions === 'number') migrated.totalSessions = old.totalSessions
  if (typeof old.totalMinutes === 'number') migrated.totalMinutes = old.totalMinutes
  
  return migrated
}

// ============================================================================
// EXPORTS
// ============================================================================

// Types are already exported inline above
// No additional exports needed

