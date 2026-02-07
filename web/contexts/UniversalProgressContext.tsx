'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getSession } from 'next-auth/react'

import { useConsent } from '@/lib/consent/useConsent'
import { trackProgress } from '@/lib/progress/track'
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
  openSavingConsent: () => void
}

const STORAGE_KEY = 'nb_progress_v1'
const SESSION_DECLINED_KEY = 'nb_progress_saving_declined'

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
  const { consent, updateConsent } = useConsent()
  const functionalEnabled = !!consent.functional

  const storeRef = useRef<UniversalProgressStore>({})

  const [serverProgressConsent, setServerProgressConsent] = useState<{ value: '1' | '0' | null; granted: boolean }>(() => {
    if (typeof window === 'undefined') return { value: null, granted: false }
    try {
      const declined = window.sessionStorage.getItem(SESSION_DECLINED_KEY) === '1'
      return { value: declined ? '0' : null, granted: false }
    } catch {
      return { value: null, granted: false }
    }
  })

  const savingEnabled = functionalEnabled && serverProgressConsent.granted

  const [store, setStore] = useState<UniversalProgressStore>(() => {
    if (typeof window === 'undefined') return {}
    if (!savingEnabled) return {}
    return normaliseStore(safeParse<UniversalProgressStore>(localStorage.getItem(STORAGE_KEY)))
  })

  useEffect(() => {
    storeRef.current = store
  }, [store])

  const mergeAttemptedRef = useRef(false)

  const [consentModalOpen, setConsentModalOpen] = useState(false)
  const [declinedThisSession, setDeclinedThisSession] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return window.sessionStorage.getItem(SESSION_DECLINED_KEY) === '1'
    } catch {
      return false
    }
  })
  const declinedThisSessionRef = useRef(declinedThisSession)
  const savingOffNoticeShownRef = useRef(false)

  const lastEventRef = useRef<{
    activityType: UniversalProgressActivityType
    activityId: string
    meta?: UniversalProgressMeta
  } | null>(null)

  const pendingEventRef = useRef<{
    activityType: UniversalProgressActivityType
    activityId: string
    meta?: UniversalProgressMeta
  } | null>(null)

  const modalCopyRef = useRef<{ title: string; body: React.ReactNode }>({
    title: 'Save your progress?',
    body: (
      <>
        <p>If you enable this, NeuroBreath will save your completed lessons and exercises on this device.</p>
        <p>If you later create an account or sign in, we can move this progress into your account.</p>
        <p>You can reset or delete saved progress at any time.</p>
      </>
    ),
  })

  // Fetch server-side progress-consent state (does not create identifiers).
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const res = await fetch('/api/progress', { method: 'GET' }).catch(() => null)
      if (!res || !res.ok) return

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; consent?: { value?: '1' | '0' | null; granted?: boolean } }
        | null

      if (cancelled) return
      const value = data?.ok ? (data?.consent?.value ?? null) : null
      const granted = data?.ok ? data?.consent?.granted === true : false
      setServerProgressConsent({ value, granted })
    })().catch(() => null)

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    declinedThisSessionRef.current = declinedThisSession
  }, [declinedThisSession])

  // If saving becomes enabled later, hydrate from localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!savingEnabled) return

    const next = normaliseStore(safeParse<UniversalProgressStore>(localStorage.getItem(STORAGE_KEY)))
    setStore((prev) => ({ ...next, ...prev }))
  }, [savingEnabled])

  // Persist to localStorage only when saving is enabled.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!savingEnabled) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // ignore storage failures
    }
  }, [store, savingEnabled])

  const refreshFromServer = useCallback(async () => {
    if (!savingEnabled) return

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
  }, [savingEnabled])

  // Best-effort merge after login: call once per page load when consent is enabled.
  useEffect(() => {
    if (!savingEnabled) return
    if (mergeAttemptedRef.current) return
    mergeAttemptedRef.current = true

    ;(async () => {
      const session = await getSession().catch(() => null)
      if (!session) return

      const mergeRes = await fetch('/api/progress/merge', { method: 'POST' }).catch(() => null)
      if (mergeRes && mergeRes.ok) {
        await refreshFromServer()
      }
    })().catch(() => null)
  }, [refreshFromServer, savingEnabled])

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
      copy?: { title?: string; body?: React.ReactNode }
    ) => {
      pendingEventRef.current = event
      modalCopyRef.current = {
        title: copy?.title || 'Save your progress?',
        body:
          copy?.body || (
            <>
              <p>If you enable this, NeuroBreath will save your completed lessons and exercises on this device.</p>
              <p>If you later create an account or sign in, we can move this progress into your account.</p>
              <p>You can reset or delete saved progress at any time.</p>
            </>
          ),
      }
      setConsentModalOpen(true)
    },
    []
  )

  const openConsentModal = useCallback((copy?: { title?: string; body?: React.ReactNode }) => {
    pendingEventRef.current = null
    modalCopyRef.current = {
      title: copy?.title || 'Save your progress?',
      body:
        copy?.body || (
          <>
            <p>If you enable this, NeuroBreath will save your completed lessons and exercises on this device.</p>
            <p>If you later create an account or sign in, we can move this progress into your account.</p>
            <p>You can reset or delete saved progress at any time.</p>
          </>
        ),
    }
    setConsentModalOpen(true)
  }, [])

  const showSavingOffNotice = useCallback(() => {
    if (savingOffNoticeShownRef.current) return
    savingOffNoticeShownRef.current = true

    toast.message('Progress is not being saved on this device.', {
      description: 'You can enable saving at any time.',
      action: {
        label: 'Enable saving',
        onClick: () => {
          const last = lastEventRef.current
          if (last) {
            openConsentModalFor(last)
            return
          }
          openConsentModal()
        },
      },
    })
  }, [openConsentModal, openConsentModalFor])

  const persistEventToServer = useCallback(
    async (activityType: UniversalProgressActivityType, activityId: string, meta?: UniversalProgressMeta) => {
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
        openConsentModalFor({ activityType, activityId, meta })
        return
      }

      if (res.ok) {
        const path = typeof window !== 'undefined' ? window.location.pathname : undefined
        if (activityType === 'lesson') {
          void trackProgress({
            type: 'lesson_completed',
            metadata: {
              lessonId: activityId,
              ...(typeof meta?.durationSeconds === 'number' ? { durationSeconds: meta.durationSeconds } : {}),
            },
            path,
          })
        } else if (activityType === 'quiz') {
          void trackProgress({
            type: 'quiz_completed',
            metadata: {
              quizId: activityId,
              ...(typeof meta?.score === 'number' ? { score: meta.score } : {}),
            },
            path,
          })
        } else if (activityType === 'challenge') {
          void trackProgress({ type: 'challenge_completed', metadata: { challengeId: activityId }, path })
        } else if (activityType === 'technique') {
          void trackProgress({
            type: 'breathing_completed',
            metadata: {
              techniqueId: activityId,
              ...(typeof meta?.durationSeconds === 'number' ? { durationSeconds: meta.durationSeconds } : {}),
            },
            path,
          })
        }
      }
    },
    [openConsentModalFor]
  )

  const markComplete = useCallback(
    async (activityType: UniversalProgressActivityType, activityId: string, meta?: UniversalProgressMeta) => {
      lastEventRef.current = { activityType, activityId, meta }

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

      if (!savingEnabled) {
        const previouslyDeclined = serverProgressConsent.value === '0'
        if (!previouslyDeclined && !declinedThisSessionRef.current) {
          openConsentModalFor({ activityType, activityId, meta })
          return
        }

        showSavingOffNotice()
        return
      }

      await persistEventToServer(activityType, activityId, meta)
    },
    [openConsentModalFor, persistEventToServer, savingEnabled, serverProgressConsent.value, showSavingOffNotice]
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
        setServerProgressConsent({ value: '0', granted: false })
        declinedThisSessionRef.current = true
        setDeclinedThisSession(true)

        try {
          window.sessionStorage.setItem(SESSION_DECLINED_KEY, '1')
        } catch {
          // ignore
        }
      }

      toast.success('Progress cleared')
    },
    []
  )

  const onAcceptConsent = useCallback(async () => {
    setConsentModalOpen(false)
    declinedThisSessionRef.current = false
    setDeclinedThisSession(false)
    savingOffNoticeShownRef.current = false

    try {
      window.sessionStorage.removeItem(SESSION_DECLINED_KEY)
    } catch {
      // ignore
    }

    updateConsent({ essential: true, functional: true, analytics: consent.analytics })

    await fetch('/api/progress/consent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: true }),
    }).catch(() => null)

    setServerProgressConsent({ value: '1', granted: true })

    // Ensure progress is immediately persisted for the current page load,
    // so a fast reload still shows completed state.
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storeRef.current))
      } catch {
        // ignore
      }
    }

    const pending = pendingEventRef.current
    pendingEventRef.current = null
    if (pending) {
      await persistEventToServer(pending.activityType, pending.activityId, pending.meta)
    }
  }, [consent.analytics, persistEventToServer, updateConsent])

  const onDeclineConsent = useCallback(async () => {
    setConsentModalOpen(false)
    declinedThisSessionRef.current = true
    setDeclinedThisSession(true)

    try {
      window.sessionStorage.setItem(SESSION_DECLINED_KEY, '1')
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }

    await fetch('/api/progress/consent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
    }).catch(() => null)

    setServerProgressConsent({ value: '0', granted: false })

    pendingEventRef.current = null
    showSavingOffNotice()
  }, [showSavingOffNotice])

  const onCloseConsentModal = useCallback(() => {
    // Treat dismiss as a one-session decline: don't re-prompt repeatedly.
    setConsentModalOpen(false)
    declinedThisSessionRef.current = true
    setDeclinedThisSession(true)

    try {
      window.sessionStorage.setItem(SESSION_DECLINED_KEY, '1')
    } catch {
      // ignore
    }
    pendingEventRef.current = null
    showSavingOffNotice()
  }, [showSavingOffNotice])

  const value = useMemo<UniversalProgressContextValue>(
    () => ({
      isComplete,
      markComplete,
      resetProgress,
      getCompletedIds,
      openSavingConsent: () => openConsentModal(),
    }),
    [getCompletedIds, isComplete, markComplete, openConsentModal, resetProgress]
  )

  return (
    <UniversalProgressContext.Provider value={value}>
      {children}
      <ProgressConsentModal
        open={consentModalOpen}
        title={modalCopyRef.current.title}
        body={modalCopyRef.current.body}
        onAccept={onAcceptConsent}
        onDecline={onDeclineConsent}
        onClose={onCloseConsentModal}
      />
    </UniversalProgressContext.Provider>
  )
}

export function useUniversalProgress() {
  const ctx = useContext(UniversalProgressContext)
  if (!ctx) throw new Error('useUniversalProgress must be used within a UniversalProgressProvider')
  return ctx
}
