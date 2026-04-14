/**
 * Central Progress Engine — Firestore-backed XP / streak / level aggregation.
 *
 * Document: `users/{uid}/progress/current`
 *
 * This is the single source of truth that the dashboard reads.
 * All tools (Focus Garden, breathing, reading, etc.) write through
 * `logSession()` which calls this engine to update aggregates.
 */

import {
  doc,
  getDoc,
  setDoc,
  type Firestore,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProgressSnapshot {
  uid: string
  totalXp: number
  level: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null   // YYYY-MM-DD (UTC)
  totalSessions: number
  totalMinutes: number
  weeklyXp: number
  weeklyMinutes: number
  weeklySessions: number
  weekStartDate: string | null    // YYYY-MM-DD — Monday of current tracking week
  badges: string[]
  updatedAt: string               // ISO 8601
}

export interface RecentSession {
  id: string
  type: string            // 'focus_garden' | 'breathing' | 'reading' | 'quiz' | ...
  label: string           // human readable
  durationSec: number
  xpAwarded: number
  occurredAt: string      // ISO 8601
  metadata?: Record<string, unknown>
}

// ── Constants ──────────────────────────────────────────────────────────────────

const XP_PER_MINUTE = 10
const STREAK_BONUS_XP = [0, 10, 25, 50, 100, 200] // index = streak day - 1
const XP_PER_LEVEL = 500

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL)
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getDb(): Firestore {
  const db = getFirebaseDb()
  if (!db) throw new Error('Firebase not configured')
  return db
}

function todayUtcKey(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function yesterdayUtcKey(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function mondayOfWeek(): string {
  const d = new Date()
  const day = d.getUTCDay()
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1)
  d.setUTCDate(diff)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

const PROGRESS_DOC = 'current'
const PROGRESS_COLLECTION = 'progress'

function progressDocRef(uid: string) {
  return doc(getDb(), 'users', uid, PROGRESS_COLLECTION, PROGRESS_DOC)
}

// ── Default ────────────────────────────────────────────────────────────────────

function defaultSnapshot(uid: string): ProgressSnapshot {
  return {
    uid,
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalSessions: 0,
    totalMinutes: 0,
    weeklyXp: 0,
    weeklyMinutes: 0,
    weeklySessions: 0,
    weekStartDate: null,
    badges: [],
    updatedAt: new Date().toISOString(),
  }
}

// ── Read ───────────────────────────────────────────────────────────────────────

export async function getProgressSnapshot(uid: string): Promise<ProgressSnapshot> {
  const snap = await getDoc(progressDocRef(uid))
  if (!snap.exists()) return defaultSnapshot(uid)
  return snap.data() as ProgressSnapshot
}

// ── Write (called after session validation) ────────────────────────────────────

export interface SessionInput {
  type: string
  label: string
  durationSec: number
  metadata?: Record<string, unknown>
}

/**
 * Award XP, update streak, bump counts.
 * Returns the XP actually awarded so the caller can show feedback.
 */
export async function recordValidatedSession(
  uid: string,
  session: SessionInput,
): Promise<{ xpAwarded: number; newStreak: number; newLevel: number }> {
  const today = todayUtcKey()
  const yesterday = yesterdayUtcKey()
  const weekStart = mondayOfWeek()

  // Read current snapshot
  const current = await getProgressSnapshot(uid)

  // Calculate XP
  const minuteXp = Math.max(1, Math.floor(session.durationSec / 60)) * XP_PER_MINUTE
  let totalXpGained = minuteXp

  // Calculate streak
  let newStreak = current.currentStreak
  if (current.lastActiveDate === yesterday) {
    newStreak += 1
    const bonusIdx = Math.min(newStreak - 1, STREAK_BONUS_XP.length - 1)
    totalXpGained += STREAK_BONUS_XP[bonusIdx]
  } else if (current.lastActiveDate !== today) {
    newStreak = 1
  }
  // Same day = streak stays

  const newLongest = Math.max(current.longestStreak, newStreak)
  const newTotalXp = current.totalXp + totalXpGained
  const newLevel = levelFromXp(newTotalXp)

  // Reset weekly if new week
  const isNewWeek = current.weekStartDate !== weekStart
  const weeklyXp = isNewWeek ? totalXpGained : current.weeklyXp + totalXpGained
  const weeklyMinutes = isNewWeek
    ? Math.floor(session.durationSec / 60)
    : current.weeklyMinutes + Math.floor(session.durationSec / 60)
  const weeklySessions = isNewWeek ? 1 : current.weeklySessions + 1

  const updatedSnapshot: ProgressSnapshot = {
    uid,
    totalXp: newTotalXp,
    level: newLevel,
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
    totalSessions: current.totalSessions + 1,
    totalMinutes: current.totalMinutes + Math.floor(session.durationSec / 60),
    weeklyXp,
    weeklyMinutes,
    weeklySessions,
    weekStartDate: weekStart,
    badges: current.badges,
    updatedAt: new Date().toISOString(),
  }

  await setDoc(progressDocRef(uid), updatedSnapshot)

  return {
    xpAwarded: totalXpGained,
    newStreak,
    newLevel,
  }
}
