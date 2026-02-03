'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useConsent } from '@/lib/consent/useConsent'
import { ProgressConsentModal } from '@/components/progress/ProgressConsentModal'

export type UniversalProgressActivityType = 'lesson' | 'module' | 'session' | 'quiz' | 'challenge' | 'technique'

export interface UniversalProgressMeta {
  completedAt?: string
  score?: number
  durationSeconds?: number
  data?: unknown
}

type UniversalProgressStore = Record<string, Record<string, UniversalProgressMeta>>

interface UniversalProgressContextValue {
  isComplete: (activityType: UniversalProgressActivityType, activityId: string) => boolean
  markComplete: (activityType: UniversalProgressActivityType, activityId: string, meta?: UniversalProgressMeta) => Promise<void>
  resetProgress: (opts?: { withdrawConsent?: boolean }) => Promise<void>
  getCompletedIds: (activityType: UniversalProgressActivityType) => string[]
}

const STORAGE_KEY = 'nb_progress_v1'

const UniversalProgressContext = createContext<UniversalProgressContextValue | undefined>(undefined)

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function normaliseStore(input: unknown): UniversalProgressStore {
  if (!input || typeof input !== 'object') return {}
  return input as UniversalProgressStore
}

export function UniversalProgressProvider({ children }: { children: React.ReactNode }) {
  const { consent, hasSavedConsent, updateConsent } = useConsent()
  const persistenceEnabled = !!consent.functional

  const [store, setStore] = useState<UniversalProgressStore>(() => {
    if (typeof window === 'undefined') return {}
    if (!persistenceEnabled) return {}
    return normaliseStore(safeParse<UniversalProgressStore>(localStorage.getItem(STORAGE_KEY)))
  })

  const serverConsentInitialisedRef = useRef(false)
  const mergeAttemptedRef = useRef(false)

  const [consentModalOpen, setConsentModalOpen] = useState(false)
  const pendingEventRef = useRef<{
    activityType: UniversalProgressActivityType
    activityId: string
    meta?: UniversalProgressMeta
  } | null>(null)
  const modalCopyRef = useRef<{ title: string; description: string }>({
    title: 'Save your progress?',
    description:
      "We can save your progress on this device (and back it up on our servers) if you give permission. If you decline, your progress won't be saved after you close this tab.",
  })

  // If consent becomes enabled later, hydrate from localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!persistenceEnabled) return

    const next = normaliseStore(safeParse<UniversalProgressStore>(localStorage.getItem(STORAGE_KEY)))
    setStore((prev) => ({ ...next, ...prev }))
  }, [persistenceEnabled])

  // Persist to localStorage only when functional consent is enabled.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!persistenceEnabled) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // ignore storage failures
    }
  }, [store, persistenceEnabled])

  const ensureServerConsent = useCallback(async () => {
    if (!persistenceEnabled) return
    if (serverConsentInitialisedRef.current) return
    serverConsentInitialisedRef.current = true

    await fetch('/api/progress/consent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    }).catch(() => null)
  }, [persistenceEnabled])

  const refreshFromServer = useCallback(async () => {
    if (!persistenceEnabled) return

    const res = await fetch('/api/progress', { method: 'GET' }).catch(() => null)
    if (!res || !res.ok) return

    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; byType?: Record<string, string[]> }
      | null

    const byType = data?.ok ? data.byType : null
    if (!byType) return

    setStore((prev) => {
      const next: UniversalProgressStore = { ...prev }
      for (const [type, ids] of Object.entries(byType)) {
        if (!next[type]) next[type] = {}
        for (const id of ids) {
          if (!next[type]?.[id]) next[type][id] = {}
        }
      }
      return next
    })
  }, [persistenceEnabled])

  // Best-effort merge after login: call once per page load when consent is enabled.
  useEffect(() => {
    if (!persistenceEnabled) return
    if (mergeAttemptedRef.current) return
    mergeAttemptedRef.current = true

    ;(async () => {
      await ensureServerConsent()
      const mergeRes = await fetch('/api/progress/merge', { method: 'POST' }).catch(() => null)
      if (mergeRes && mergeRes.ok) {
        await refreshFromServer()
      }
    })().catch(() => null)
  }, [persistenceEnabled, ensureServerConsent, refreshFromServer])

  const isComplete = useCallback(
    (activityType: UniversalProgressActivityType, activityId: string) => {
      return !!store?.[activityType]?.[activityId]
    },
    [store]
  )

  const getCompletedIds = useCallback(
    (activityType: UniversalProgressActivityType) => {
      return Object.keys(store?.[activityType] || {})
    },
    [store]
  )

  const openConsentModalFor = useCallback(
    (
      event: {
        activityType: UniversalProgressActivityType
        activityId: string
        meta?: UniversalProgressMeta
      },
      copy?: { title?: string; description?: string }
    ) => {
      pendingEventRef.current = event
      modalCopyRef.current = {
        title: copy?.title || 'Save your progress?',
        description:
          copy?.description ||
          "We can save your progress on this device (and back it up on our servers) if you give permission. If you decline, your progress won't be saved after you close this tab.",
      }
      setConsentModalOpen(true)
    },
    []
  )

  const persistEventToServer = useCallback(
    async (activityType: UniversalProgressActivityType, activityId: string, meta?: UniversalProgressMeta) => {
      await ensureServerConsent()

      const payload = {
        activityType,
        activityId,
        completedAt: meta?.completedAt,
        score: meta?.score,
        durationSeconds: meta?.durationSeconds,
        data: meta?.data,
      }

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null)

      if (!res) return

      if (res.status === 403) {
        // Logged-in: explicit progress consent marker missing.
        openConsentModalFor(
          { activityType, activityId, meta },
          {
            title: 'Save progress to your account?',
            description:
              'If you consent, we will store your completed activities in your account so they are available across devices. You can delete this at any time in Cookie settings.',
          }
        )
        return
      }
    },
    [ensureServerConsent, openConsentModalFor]
  )

  const markComplete = useCallback(
    async (activityType: UniversalProgressActivityType, activityId: string, meta?: UniversalProgressMeta) => {
      // Always update UI state immediately.
      setStore((prev) => {
        const next: UniversalProgressStore = { ...prev }
        if (!next[activityType]) next[activityType] = {}
        next[activityType][activityId] = {
          ...(next[activityType][activityId] || {}),
          ...meta,
          completedAt: meta?.completedAt || new Date().toISOString(),
        }
        return next
      })

      if (!persistenceEnabled) {
        if (!hasSavedConsent) {
          openConsentModalFor({ activityType, activityId, meta })
          return
        }

        toast.message('Progress not saved', {
          description: 'Enable Functional storage in Cookie settings to save your progress.',
        })
        return
      }

      await persistEventToServer(activityType, activityId, meta)
    },
    [hasSavedConsent, openConsentModalFor, persistEventToServer, persistenceEnabled]
  )

  const resetProgress = useCallback(
    async (opts?: { withdrawConsent?: boolean }) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore
        }
      }

      setStore({})

      await fetch('/api/progress', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ withdrawConsent: opts?.withdrawConsent === true }),
      }).catch(() => null)

      if (opts?.withdrawConsent) {
        updateConsent({ essential: true, functional: false, analytics: consent.analytics })
      }

      toast.success('Progress cleared')
    },
    [consent.analytics, updateConsent]
  )

  const onAcceptConsent = useCallback(async () => {
    setConsentModalOpen(false)

    updateConsent({ essential: true, functional: true, analytics: consent.analytics })

    await fetch('/api/progress/consent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    }).catch(() => null)

    const pending = pendingEventRef.current
    pendingEventRef.current = null
    if (pending) {
      await persistEventToServer(pending.activityType, pending.activityId, pending.meta)
    }
  }, [consent.analytics, persistEventToServer, updateConsent])

  const onDeclineConsent = useCallback(async () => {
    setConsentModalOpen(false)

    updateConsent({ essential: true, functional: false, analytics: consent.analytics })

    await fetch('/api/progress/consent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
    }).catch(() => null)

    pendingEventRef.current = null

    toast.message('Progress will not be saved', {
      description: 'You can enable this later in Cookie settings.',
    })
  }, [consent.analytics, updateConsent])

  const value = useMemo<UniversalProgressContextValue>(
    () => ({
      isComplete,
      markComplete,
      resetProgress,
      getCompletedIds,
    }),
    [getCompletedIds, isComplete, markComplete, resetProgress]
  )

  return (
    <UniversalProgressContext.Provider value={value}>
      {children}
      <ProgressConsentModal
        open={consentModalOpen}
        title={modalCopyRef.current.title}
        description={modalCopyRef.current.description}
        onAccept={onAcceptConsent}
        onDecline={onDeclineConsent}
        onClose={() => setConsentModalOpen(false)}
      />
    </UniversalProgressContext.Provider>
  )
}

export function useUniversalProgress() {
  const ctx = useContext(UniversalProgressContext)
  if (!ctx) throw new Error('useUniversalProgress must be used within a UniversalProgressProvider')
  return ctx
}
