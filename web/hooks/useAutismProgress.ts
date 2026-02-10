'use client'

import { useState, useEffect } from 'react'
import type { ProgressStats, UserContext } from '@/types/autism'
import { getProgress, getUserContext, saveProgress, saveUserContext, logSession as logSessionStorage } from '@/lib/autism/storage'

export function useAutismProgress() {
  const [progress, setProgress] = useState<ProgressStats>(getProgress())
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage after mount
  useEffect(() => {
    setProgress(getProgress())
    setHydrated(true)

    // Listen for updates from other tabs/components
    const handleUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ progress: ProgressStats }>
      setProgress(custom.detail.progress)
    }

    window.addEventListener('nb:autism:progress-updated', handleUpdate)

    return () => {
      window.removeEventListener('nb:autism:progress-updated', handleUpdate)
    }
  }, [])

  const logSession = (minutes: number, skillId?: string) => {
    logSessionStorage(minutes, skillId)
    setProgress(getProgress())
  }

  const updateProgress = (updates: Partial<ProgressStats>) => {
    const current = getProgress()
    const updated = { ...current, ...updates }
    saveProgress(updated)
    setProgress(updated)
  }

  return {
    progress,
    hydrated,
    logSession,
    updateProgress
  }
}

export function useUserContext() {
  const [context, setContext] = useState<UserContext>(getUserContext())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setContext(getUserContext())
    setHydrated(true)
  }, [])

  const updateContext = (updates: Partial<UserContext>) => {
    const updated = { ...context, ...updates }
    saveUserContext(updated)
    setContext(updated)
  }

  return {
    context,
    hydrated,
    updateContext
  }
}

