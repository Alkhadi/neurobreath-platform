/**
 * POST /api/firebase-session
 *
 * Server-side session validation endpoint.
 * Verifies the Firebase ID token, checks duration bounds, then writes
 * the validated session to Firestore via Admin SDK.
 *
 * This is the secure path for high-value XP awards (e.g., Focus Garden).
 * The client should call this instead of writing directly when anti-cheat
 * matters.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MIN_DURATION_SEC = 30
const MAX_DURATION_SEC = 86_400
const XP_PER_MINUTE = 10
const STREAK_BONUS_XP = [0, 10, 25, 50, 100, 200]
const XP_PER_LEVEL = 500

interface SessionBody {
  uid: string
  idToken: string
  type: string
  label: string
  durationSec: number
  metadata?: Record<string, unknown>
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, code, message }, { status })
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

export async function POST(request: NextRequest) {
  const adminDb = getAdminFirestore()
  if (!adminDb) {
    return jsonError(500, 'CONFIG_ERROR', 'Firebase Admin not configured')
  }

  let body: SessionBody
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'INVALID_JSON', 'Request body must be valid JSON')
  }

  const { uid, idToken, type, label, durationSec, metadata } = body

  // ── Input validation ──
  if (!uid || typeof uid !== 'string') {
    return jsonError(400, 'INVALID_UID', 'uid is required')
  }
  if (!idToken || typeof idToken !== 'string') {
    return jsonError(400, 'INVALID_TOKEN', 'idToken is required')
  }
  if (!type || typeof type !== 'string' || type.length > 50) {
    return jsonError(400, 'INVALID_TYPE', 'type is required and must be ≤50 chars')
  }
  if (!label || typeof label !== 'string' || label.length > 200) {
    return jsonError(400, 'INVALID_LABEL', 'label is required and must be ≤200 chars')
  }
  if (typeof durationSec !== 'number' || durationSec < MIN_DURATION_SEC || durationSec > MAX_DURATION_SEC) {
    return jsonError(400, 'INVALID_DURATION', `durationSec must be ${MIN_DURATION_SEC}-${MAX_DURATION_SEC}`)
  }

  // ── Verify Firebase ID token ──
  let verifiedUid: string
  try {
    const { getAuth } = await import('firebase-admin/auth')
    const decoded = await getAuth().verifyIdToken(idToken)
    verifiedUid = decoded.uid
  } catch {
    return jsonError(401, 'TOKEN_INVALID', 'Firebase ID token verification failed')
  }

  if (verifiedUid !== uid) {
    return jsonError(403, 'UID_MISMATCH', 'Token uid does not match request uid')
  }

  // ── Read current progress ──
  const progressRef = adminDb.doc(`users/${uid}/progress/current`)
  const progressSnap = await progressRef.get()
  const current = progressSnap.exists ? progressSnap.data() : null

  const today = todayUtcKey()
  const yesterday = yesterdayUtcKey()
  const weekStart = mondayOfWeek()

  // ── Calculate XP ──
  const minuteXp = Math.max(1, Math.floor(durationSec / 60)) * XP_PER_MINUTE
  let totalXpGained = minuteXp

  // ── Calculate streak ──
  const prevStreak = current?.currentStreak ?? 0
  const prevLastActive = current?.lastActiveDate ?? null
  let newStreak = prevStreak

  if (prevLastActive === yesterday) {
    newStreak += 1
    const bonusIdx = Math.min(newStreak - 1, STREAK_BONUS_XP.length - 1)
    totalXpGained += STREAK_BONUS_XP[bonusIdx]
  } else if (prevLastActive !== today) {
    newStreak = 1
  }

  const newTotalXp = (current?.totalXp ?? 0) + totalXpGained
  const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1
  const newLongest = Math.max(current?.longestStreak ?? 0, newStreak)

  // Weekly reset
  const isNewWeek = (current?.weekStartDate ?? null) !== weekStart
  const weeklyXp = isNewWeek ? totalXpGained : (current?.weeklyXp ?? 0) + totalXpGained
  const weeklyMinutes = isNewWeek
    ? Math.floor(durationSec / 60)
    : (current?.weeklyMinutes ?? 0) + Math.floor(durationSec / 60)
  const weeklySessions = isNewWeek ? 1 : (current?.weeklySessions ?? 0) + 1

  // ── Write session doc ──
  const { FieldValue } = await import('firebase-admin/firestore')
  const sessionsCol = adminDb.collection(`users/${uid}/sessions`)
  await sessionsCol.add({
    uid,
    type,
    label,
    durationSec,
    xpAwarded: totalXpGained,
    validated: true,
    occurredAt: FieldValue.serverTimestamp(),
    metadata: metadata ?? null,
  })

  // ── Update progress snapshot ──
  await progressRef.set(
    {
      uid,
      totalXp: newTotalXp,
      level: newLevel,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
      totalSessions: (current?.totalSessions ?? 0) + 1,
      totalMinutes: (current?.totalMinutes ?? 0) + Math.floor(durationSec / 60),
      weeklyXp,
      weeklyMinutes,
      weeklySessions,
      weekStartDate: weekStart,
      badges: current?.badges ?? [],
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  )

  return NextResponse.json({
    ok: true,
    xpAwarded: totalXpGained,
    newStreak,
    newLevel,
    totalXp: newTotalXp,
  })
}
