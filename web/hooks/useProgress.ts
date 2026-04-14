'use client'

/**
 * useProgress — hook for reading / writing the central Firestore-backed
 * progress snapshot from any page or tool.
 *
 * Depends on FirebaseAuthContext being mounted (it is, in root layout).
 */

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import {
  getProgressSnapshot,
  levelFromXp,
  xpToNextLevel,
  type ProgressSnapshot,
} from '@/lib/firebase/progress-engine'
import { logSession, getRecentSessions, type LogSessionResult, type LogSessionInput } from '@/lib/firebase/session-logger'
import type { RecentSession } from '@/lib/firebase/progress-engine'

interface UseProgressReturn {
  /** Current progress snapshot (null while loading, or if Firebase is off). */
  progress: ProgressSnapshot | null
  /** Most recent sessions. */
  recentSessions: RecentSession[]
  /** Whether the initial load is still in flight. */
  loading: boolean
  /** Convenience: current level. */
  level: number
  /** Convenience: XP remaining to next level. */
  xpToNext: number
  /** Refresh snapshot from Firestore. */
  refresh: () => Promise<void>
  /** Log a validated session and refresh. */
  submitSession: (input: Omit<LogSessionInput, 'uid'>) => Promise<LogSessionResult>
}

export function useProgress(): UseProgressReturn {
  const { uid } = useAuth()
  const [progress, setProgress] = useState<ProgressSnapshot | null>(null)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!uid) {
      setProgress(null)
      setRecentSessions([])
      setLoading(false)
      return
    }
    try {
      const [snap, sessions] = await Promise.all([
        getProgressSnapshot(uid),
        getRecentSessions(uid, 10),
      ])
      setProgress(snap)
      setRecentSessions(sessions)
    } catch (err) {
      console.error('[useProgress] Failed to load:', err)
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    refresh()
  }, [refresh])

  const submitSession = useCallback(
    async (input: Omit<LogSessionInput, 'uid'>): Promise<LogSessionResult> => {
      if (!uid) {
        return { ok: false, xpAwarded: 0, newStreak: 0, newLevel: 0, reason: 'Not signed in' }
      }
      const result = await logSession({ ...input, uid })
      if (result.ok) {
        // Refresh in background
        refresh().catch(() => {})
      }
      return result
    },
    [uid, refresh],
  )

  const level = progress ? levelFromXp(progress.totalXp) : 1
  const xpToNext = progress ? xpToNextLevel(progress.totalXp) : 500

  return {
    progress,
    recentSessions,
    loading,
    level,
    xpToNext,
    refresh,
    submitSession,
  }
}
