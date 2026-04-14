'use client'

/**
 * useUserProfile — reads/writes the Firestore user profile document.
 *
 * Auto-creates the profile on first sign-in (including anonymous).
 */

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  type UserProfile,
} from '@/lib/firebase/user-profile'

interface UseUserProfileReturn {
  profile: UserProfile | null
  loading: boolean
  /** Update writable fields and refresh local state. */
  update: (patch: Partial<Pick<UserProfile, 'displayName' | 'conditionTags' | 'region' | 'onboardingComplete' | 'activeHabitId'>>) => Promise<void>
  refresh: () => Promise<void>
}

export function useUserProfile(): UseUserProfileReturn {
  const { user, uid } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!uid) {
      setProfile(null)
      setLoading(false)
      return
    }
    try {
      let p = await getUserProfile(uid)
      if (!p) {
        await createUserProfile(uid, {
          displayName: user?.displayName ?? null,
          email: user?.email ?? null,
          isAnonymous: user?.isAnonymous ?? true,
          region: 'uk',
        })
        p = await getUserProfile(uid)
      }
      setProfile(p)
    } catch (err) {
      console.error('[useUserProfile] Error:', err)
    } finally {
      setLoading(false)
    }
  }, [uid, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const update = useCallback(
    async (patch: Partial<Pick<UserProfile, 'displayName' | 'conditionTags' | 'region' | 'onboardingComplete' | 'activeHabitId'>>) => {
      if (!uid) return
      await updateUserProfile(uid, patch)
      await refresh()
    },
    [uid, refresh],
  )

  return { profile, loading, update, refresh }
}
