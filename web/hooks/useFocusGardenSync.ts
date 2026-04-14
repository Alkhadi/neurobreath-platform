'use client'

/**
 * useFocusGardenSync — bridges Focus Garden (localStorage) to the
 * central Firestore progress engine.
 *
 * Call `syncWater()` / `syncHarvest()` after the local store completes.
 * The hook uses the server-validated `/api/firebase-session` route so
 * XP cannot be faked client-side.
 */

import { useCallback } from 'react'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import { getFirebaseAuth } from '@/lib/firebase'

interface SyncResult {
  ok: boolean
  xpAwarded?: number
  reason?: string
}

async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user) return null
  return user.getIdToken()
}

async function postFirebaseSession(body: {
  uid: string
  idToken: string
  type: string
  label: string
  durationSec: number
  metadata?: Record<string, unknown>
}): Promise<SyncResult> {
  try {
    const res = await fetch('/api/firebase-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok || !json.ok) {
      return { ok: false, reason: json.message ?? 'API error' }
    }
    return { ok: true, xpAwarded: json.xpAwarded }
  } catch (err) {
    return { ok: false, reason: String(err) }
  }
}

export function useFocusGardenSync() {
  const { uid } = useAuth()

  /** Sync a water action (counts as a ~60s micro-session). */
  const syncWater = useCallback(
    async (plantId: string, category: string, xpFromLocal: number): Promise<SyncResult> => {
      if (!uid) return { ok: false, reason: 'No uid' }
      const idToken = await getIdToken()
      if (!idToken) return { ok: false, reason: 'No ID token' }

      return postFirebaseSession({
        uid,
        idToken,
        type: 'focus_garden',
        label: `Focus Garden: watered (${category})`,
        durationSec: 60, // micro-session baseline
        metadata: { action: 'water', plantId, category, localXp: xpFromLocal },
      })
    },
    [uid],
  )

  /** Sync a harvest action (counts as a ~120s milestone session). */
  const syncHarvest = useCallback(
    async (plantId: string, category: string): Promise<SyncResult> => {
      if (!uid) return { ok: false, reason: 'No uid' }
      const idToken = await getIdToken()
      if (!idToken) return { ok: false, reason: 'No ID token' }

      return postFirebaseSession({
        uid,
        idToken,
        type: 'focus_garden',
        label: `Focus Garden: harvested bloom (${category})`,
        durationSec: 120,
        metadata: { action: 'harvest', plantId, category },
      })
    },
    [uid],
  )

  return { syncWater, syncHarvest }
}
