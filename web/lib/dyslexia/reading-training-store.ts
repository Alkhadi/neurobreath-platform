/**
 * Reading Training Store
 * Persists assessment placement + plan to localStorage so the training plan
 * page can display a fully personalised programme without a server round-trip.
 * All data is private — nothing is sent to any external server.
 */

import type { PlacementResult } from '@/lib/placement-rubric'
import type { PlacementPlan } from '@/lib/placement-plan'

// ─────────────────────────────────────────────────────────────────────────────
// Stored result shape
// ─────────────────────────────────────────────────────────────────────────────
export interface SavedTrainingResult {
  placement: PlacementResult
  plan: PlacementPlan
  savedAt: string  // ISO string
}

const TRAINING_RESULT_KEY = 'nb_reading_training_result'
const SESSION_PROGRESS_KEY = 'nb_reading_session_progress'

// ─────────────────────────────────────────────────────────────────────────────
// Placement + Plan
// ─────────────────────────────────────────────────────────────────────────────

export function saveTrainingResult(placement: PlacementResult, plan: PlacementPlan): void {
  if (typeof window === 'undefined') return
  try {
    const payload: SavedTrainingResult = { placement, plan, savedAt: new Date().toISOString() }
    localStorage.setItem(TRAINING_RESULT_KEY, JSON.stringify(payload))
  } catch {
    // Silently ignore (private/incognito mode)
  }
}

export function loadTrainingResult(): SavedTrainingResult | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TRAINING_RESULT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedTrainingResult
  } catch {
    return null
  }
}

export function clearTrainingResult(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(TRAINING_RESULT_KEY)
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Session / lesson progress
// ─────────────────────────────────────────────────────────────────────────────
export interface SessionProgress {
  completedSlugs: string[]
  lastUpdatedDate: string  // YYYY-MM-DD
  streakDays: number
  totalLessonsCompleted: number
  currentWeek: number
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function loadSessionProgress(): SessionProgress {
  const empty: SessionProgress = {
    completedSlugs: [],
    lastUpdatedDate: todayStr(),
    streakDays: 0,
    totalLessonsCompleted: 0,
    currentWeek: 1,
  }
  if (typeof window === 'undefined') return empty
  try {
    const raw = localStorage.getItem(SESSION_PROGRESS_KEY)
    if (!raw) return empty
    const data = JSON.parse(raw) as SessionProgress
    const today = todayStr()
    // If a new day has started, reset daily completedSlugs but keep totals
    if (data.lastUpdatedDate !== today) {
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
      const streak = data.lastUpdatedDate === yesterday ? data.streakDays + 1 : 1
      return { ...data, completedSlugs: [], lastUpdatedDate: today, streakDays: streak }
    }
    return data
  } catch {
    return empty
  }
}

export function saveSessionProgress(progress: SessionProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

export function markLessonComplete(slug: string): void {
  const progress = loadSessionProgress()
  if (progress.completedSlugs.includes(slug)) return
  const updated: SessionProgress = {
    ...progress,
    completedSlugs: [...progress.completedSlugs, slug],
    totalLessonsCompleted: progress.totalLessonsCompleted + 1,
    lastUpdatedDate: todayStr(),
  }
  saveSessionProgress(updated)
}
