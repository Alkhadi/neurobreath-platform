/**
 * Session Logger — writes individual sessions to Firestore.
 *
 * Collection: `users/{uid}/sessions/{auto-id}`
 *
 * Client calls this after a tool completes, then the progress engine
 * updates the aggregate snapshot.
 */

import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  type Firestore,
  type FieldValue,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { recordValidatedSession, type SessionInput, type RecentSession } from './progress-engine'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SessionDoc {
  uid: string
  type: string
  label: string
  durationSec: number
  xpAwarded: number
  validated: boolean
  occurredAt: FieldValue | string
  metadata?: Record<string, unknown>
}

// ── Constants ──────────────────────────────────────────────────────────────────

/** Minimum session duration in seconds to be considered valid. */
const MIN_SESSION_DURATION_SEC = 30

/** Maximum session duration in seconds (24 hours — safety cap). */
const MAX_SESSION_DURATION_SEC = 86_400

// ── Helpers ────────────────────────────────────────────────────────────────────

function getDb(): Firestore {
  const db = getFirebaseDb()
  if (!db) throw new Error('Firebase not configured')
  return db
}

// ── Client-side session submission ─────────────────────────────────────────────

export interface LogSessionInput {
  uid: string
  type: string
  label: string
  durationSec: number
  metadata?: Record<string, unknown>
}

export interface LogSessionResult {
  ok: boolean
  xpAwarded: number
  newStreak: number
  newLevel: number
  reason?: string
}

/**
 * Validate and log a session client-side.
 *
 * 1. Validates duration bounds
 * 2. Writes session doc to Firestore
 * 3. Updates aggregate progress snapshot
 *
 * For anti-cheat: the server-side validate-session route should be used
 * for high-value rewards. This client path is acceptable for standard
 * session tracking because Firestore security rules limit write frequency
 * and the progress engine caps XP per session.
 */
export async function logSession(input: LogSessionInput): Promise<LogSessionResult> {
  const { uid, type, label, durationSec, metadata } = input

  // ── Validation ──
  if (durationSec < MIN_SESSION_DURATION_SEC) {
    return { ok: false, xpAwarded: 0, newStreak: 0, newLevel: 0, reason: 'Session too short' }
  }
  if (durationSec > MAX_SESSION_DURATION_SEC) {
    return { ok: false, xpAwarded: 0, newStreak: 0, newLevel: 0, reason: 'Session too long' }
  }

  // ── Write session doc ──
  const sessionData: SessionDoc = {
    uid,
    type,
    label,
    durationSec,
    xpAwarded: 0, // will be updated after engine calc
    validated: true,
    occurredAt: serverTimestamp(),
    metadata,
  }

  const sessionsCol = collection(getDb(), 'users', uid, 'sessions')
  const sessionRef = await addDoc(sessionsCol, sessionData)

  // ── Update aggregates ──
  const sessionInput: SessionInput = { type, label, durationSec, metadata }
  const result = await recordValidatedSession(uid, sessionInput)

  // Patch session doc with actual XP awarded
  // (non-critical — skip await to avoid blocking UX)
  import('firebase/firestore').then(({ updateDoc }) => {
    updateDoc(sessionRef, { xpAwarded: result.xpAwarded }).catch(() => {})
  })

  return {
    ok: true,
    xpAwarded: result.xpAwarded,
    newStreak: result.newStreak,
    newLevel: result.newLevel,
  }
}

// ── Read recent sessions ───────────────────────────────────────────────────────

export async function getRecentSessions(uid: string, count: number = 10): Promise<RecentSession[]> {
  const sessionsCol = collection(getDb(), 'users', uid, 'sessions')
  const q = query(sessionsCol, orderBy('occurredAt', 'desc'), limit(count))
  const snap = await getDocs(q)

  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      type: data.type ?? '',
      label: data.label ?? '',
      durationSec: data.durationSec ?? 0,
      xpAwarded: data.xpAwarded ?? 0,
      occurredAt: data.occurredAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      metadata: data.metadata,
    }
  })
}
