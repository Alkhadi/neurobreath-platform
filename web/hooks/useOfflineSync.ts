'use client'

/**
 * useOfflineSync — drains the IndexedDB session queue when the browser
 * comes back online. Also exposes a `queueSession` helper that attempts
 * a direct POST first and falls back to the queue when offline.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import { getFirebaseAuth } from '@/lib/firebase'
import {
  enqueueSession,
  drainQueue,
  pendingCount,
  type QueuedSession,
} from '@/lib/firebase/offline-queue'

async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user) return null
  return user.getIdToken()
}

export function useOfflineSync() {
  const { uid } = useAuth()
  const [pending, setPending] = useState(0)
  const draining = useRef(false)

  // Refresh pending count periodically.
  const refreshPending = useCallback(async () => {
    try {
      const n = await pendingCount()
      setPending(n)
    } catch {
      // IndexedDB unavailable — silent
    }
  }, [])

  // Drain and refresh.
  const drain = useCallback(async () => {
    if (draining.current) return
    draining.current = true
    try {
      await drainQueue(getIdToken)
    } finally {
      draining.current = false
      await refreshPending()
    }
  }, [refreshPending])

  // Listen for online events.
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.addEventListener('online', drain)
    void refreshPending()

    return () => {
      window.removeEventListener('online', drain)
    }
  }, [drain, refreshPending])

  // On mount (and when uid changes), try draining.
  useEffect(() => {
    if (uid) void drain()
  }, [uid, drain])

  /**
   * Submit a session — tries the server first, falls back to the queue.
   * Returns `{ queued: true }` when the session was stored offline.
   */
  const queueSession = useCallback(
    async (
      session: Omit<QueuedSession, 'clientId' | 'attempts' | 'enqueuedAt' | 'uid'>
    ): Promise<{ ok: boolean; queued: boolean; xpAwarded?: number }> => {
      if (!uid) return { ok: false, queued: false }

      // Try direct POST first.
      if (navigator.onLine) {
        try {
          const token = await getIdToken()
          if (token) {
            const res = await fetch('/api/firebase-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                uid,
                type: session.type,
                label: session.label,
                durationSec: session.durationSec,
              }),
            })
            if (res.ok) {
              const data = await res.json()
              return { ok: true, queued: false, xpAwarded: data.xpAwarded }
            }
          }
        } catch {
          // Fall through to queue.
        }
      }

      // Offline or request failed — enqueue.
      await enqueueSession({
        uid,
        type: session.type,
        label: session.label,
        durationSec: session.durationSec,
        occurredAt: new Date().toISOString(),
        metadata: session.metadata,
      })
      await refreshPending()
      return { ok: true, queued: true }
    },
    [uid, refreshPending]
  )

  return { pending, queueSession, drain }
}
