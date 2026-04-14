/**
 * Reminder Settings — Firestore model for user notification preferences.
 *
 * Document: `users/{uid}/settings/reminders`
 *
 * This stores the user's preferred reminder schedule.
 * Actual delivery is handled externally (Zapier webhook / Proton Mail compatible).
 */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type FieldValue,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'

// ── Types ──────────────────────────────────────────────────────────────────────

export type ReminderChannel = 'push' | 'email'

export interface ReminderSettings {
  enabled: boolean
  /** Channels the user opted into. */
  channels: ReminderChannel[]
  /** 24-hour format, e.g. "09:00". */
  preferredTime: string
  /** IANA timezone, e.g. "Europe/London". */
  timezone: string
  /** Days of week (0 = Sunday … 6 = Saturday). */
  activeDays: number[]
  /** Optional email for email-based reminders. */
  email?: string
  updatedAt: FieldValue | string
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: Omit<ReminderSettings, 'updatedAt'> = {
  enabled: false,
  channels: [],
  preferredTime: '09:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London',
  activeDays: [1, 2, 3, 4, 5], // Mon–Fri
}

// ── Reads ──────────────────────────────────────────────────────────────────────

export async function getReminderSettings(
  uid: string
): Promise<ReminderSettings | null> {
  const db = getFirebaseDb()
  if (!db) return null
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'reminders'))
  return snap.exists() ? (snap.data() as ReminderSettings) : null
}

// ── Writes ─────────────────────────────────────────────────────────────────────

export async function saveReminderSettings(
  uid: string,
  settings: Partial<Omit<ReminderSettings, 'updatedAt'>>
): Promise<void> {
  const db = getFirebaseDb()
  if (!db) return
  const ref = doc(db, 'users', uid, 'settings', 'reminders')
  const existing = await getDoc(ref)
  const base = existing.exists()
    ? (existing.data() as ReminderSettings)
    : { ...DEFAULT_SETTINGS, updatedAt: '' }

  await setDoc(ref, {
    ...base,
    ...settings,
    updatedAt: serverTimestamp(),
  })
}
