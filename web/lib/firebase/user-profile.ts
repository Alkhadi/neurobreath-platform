/**
 * Firebase User Profile — Firestore document model + CRUD helpers.
 *
 * Collection: `users/{uid}`
 *
 * This is the site-wide user identity document. Every tool, page, and the
 * dashboard reads from this single source of truth.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
  type FieldValue,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string
  displayName: string | null
  email: string | null
  isAnonymous: boolean
  conditionTags: string[]       // e.g. ['adhd','autism','dyslexia']
  region: 'uk' | 'us'
  tier: 'free' | 'premium'
  createdAt: string             // ISO 8601
  lastSeenAt: string            // ISO 8601
  onboardingComplete: boolean
  activeHabitId: string | null  // FK to habits subcollection
}

/** Firestore-compatible shape (serverTimestamp for write, string for read). */
type UserProfileWrite = Omit<UserProfile, 'createdAt' | 'lastSeenAt'> & {
  createdAt: FieldValue | string
  lastSeenAt: FieldValue | string
}

// ── CRUD ───────────────────────────────────────────────────────────────────────

const COLLECTION = 'users'

function getDb(): Firestore {
  const db = getFirebaseDb()
  if (!db) throw new Error('Firebase not configured')
  return db
}

/** Fetch profile or null if it doesn't exist yet. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getDb(), COLLECTION, uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

/** Create profile on first sign-in (anonymous or authenticated). */
export async function createUserProfile(
  uid: string,
  init: Partial<Pick<UserProfile, 'displayName' | 'email' | 'isAnonymous' | 'region'>>,
): Promise<void> {
  const data: UserProfileWrite = {
    uid,
    displayName: init.displayName ?? null,
    email: init.email ?? null,
    isAnonymous: init.isAnonymous ?? true,
    conditionTags: [],
    region: init.region ?? 'uk',
    tier: 'free',
    createdAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
    onboardingComplete: false,
    activeHabitId: null,
  }
  await setDoc(doc(getDb(), COLLECTION, uid), data, { merge: true })
}

/** Patch any writable fields. */
export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserProfile, 'displayName' | 'email' | 'isAnonymous' | 'conditionTags' | 'region' | 'tier' | 'onboardingComplete' | 'activeHabitId'>>,
): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTION, uid), {
    ...patch,
    lastSeenAt: serverTimestamp(),
  })
}

/** Touch lastSeenAt without changing anything else. */
export async function touchLastSeen(uid: string): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTION, uid), {
    lastSeenAt: serverTimestamp(),
  })
}
