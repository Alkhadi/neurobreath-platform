export type ProgressEventType =
  | 'breathing_completed'
  | 'lesson_completed'
  | 'meditation_completed'
  | 'quiz_completed'
  | 'focus_garden_completed'
  | 'challenge_completed'
  | 'quest_completed'
  | 'streak_milestone'
  | 'achievement_unlocked'

export type TrackProgressInput = {
  type: ProgressEventType
  metadata?: Record<string, unknown>
  path?: string
}

type QueuedEvent = {
  body: {
    type: ProgressEventType
    path?: string
    metadata?: Record<string, unknown>
    subjectId: string
  }
  timestamp: number
}

const QUEUE_KEY = 'nb_progress_queue_v1'
const MAX_QUEUE_SIZE = 200
const FLUSH_INITIALIZED_KEY = 'nb_progress_flush_init'

function emitProgressRecorded(detail: {
  subjectId: string
  eventType?: ProgressEventType
}): void {
  if (typeof window === 'undefined') return

  // Broadcast to other tabs (legacy/shared channel)
  const channel = getBroadcastChannel()
  if (channel) {
    try {
      channel.postMessage({
        type: 'progress:event',
        subjectId: detail.subjectId,
        eventType: detail.eventType,
        ts: Date.now(),
      })
    } catch {
      // ignore
    }
  }

  // Dedicated real-time channel (spec)
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const realtimeChannel = new BroadcastChannel('nb_progress')
      realtimeChannel.postMessage({ type: 'event_recorded', timestamp: Date.now() })
      realtimeChannel.close()
    } catch {
      // BroadcastChannel not supported
    }
  }

  // localStorage ping for cross-tab signal (works even when BroadcastChannel doesn't)
  try {
    window.localStorage?.setItem('nb_progress_ping', String(Date.now()))
  } catch {
    // ignore
  }

  // CustomEvent fallback
  try {
    window.dispatchEvent(
      new CustomEvent('nb_progress_event_recorded', {
        detail: { type: detail.eventType, timestamp: Date.now() },
      }),
    )
  } catch {
    // ignore
  }
}

let broadcastChannel: BroadcastChannel | null = null
function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel('nb_progress_channel')
    } catch {
      return null
    }
  }
  return broadcastChannel
}

function getQueue(): QueuedEvent[] {
  try {
    const raw = window.localStorage?.getItem(QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_QUEUE_SIZE) : []
  } catch {
    return []
  }
}

function setQueue(queue: QueuedEvent[]): void {
  try {
    const capped = queue.slice(0, MAX_QUEUE_SIZE)
    window.localStorage?.setItem(QUEUE_KEY, JSON.stringify(capped))
  } catch {
    // ignore
  }
}

function enqueueEvent(body: QueuedEvent['body']): void {
  const queue = getQueue()
  queue.push({ body, timestamp: Date.now() })
  setQueue(queue)
}

async function flushQueue(): Promise<void> {
  if (typeof window === 'undefined') return
  const queue = getQueue()
  if (queue.length === 0) return

  for (let i = 0; i < queue.length; i++) {
    const event = queue[i]
    try {
      const res = await fetch('/api/progress/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(event.body),
        keepalive: true,
        credentials: 'include',
      })

      if (!res.ok) {
        // Stop on first failure - preserve order
        setQueue(queue.slice(i))
        return
      }

      emitProgressRecorded({ subjectId: event.body.subjectId, eventType: event.body.type })
    } catch {
      // Network error - stop and keep remaining events
      setQueue(queue.slice(i))
      return
    }
  }

  // All flushed successfully
  setQueue([])
}

function initFlushTriggers(): void {
  if (typeof window === 'undefined') return
  
  const alreadyInit = window.sessionStorage?.getItem(FLUSH_INITIALIZED_KEY)
  if (alreadyInit) return

  try {
    window.sessionStorage?.setItem(FLUSH_INITIALIZED_KEY, '1')
  } catch {
    // ignore
  }

  // Flush on app start (after short delay to avoid blocking)
  setTimeout(() => void flushQueue(), 2000)

  // Flush when coming back online
  window.addEventListener('online', () => void flushQueue())

  // Flush when tab becomes visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void flushQueue()
  })

  // Best-effort flush on unload (sendBeacon)
  window.addEventListener('beforeunload', () => {
    const queue = getQueue()
    if (queue.length === 0) return

    for (const event of queue) {
      try {
        navigator.sendBeacon('/api/progress/events', JSON.stringify(event.body))
      } catch {
        // ignore
      }
    }
  })
}

export async function trackProgress(input: TrackProgressInput): Promise<void> {
  try {
    if (typeof window === 'undefined') return

    // DEV: Log tracking attempt
    if (process.env.NODE_ENV === 'development') {
      console.log('[trackProgress] Attempting to track:', input)
    }

    // Initialize flush triggers on first call
    initFlushTriggers()

    const stored = window.localStorage?.getItem('nb_active_subject')
    const activeSubjectId = typeof stored === 'string' && stored.trim() ? stored.trim() : 'me'

    const body = {
      type: input.type,
      ...(input.path ? { path: input.path } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      subjectId: activeSubjectId,
    }

    // DEV: Log request body
    if (process.env.NODE_ENV === 'development') {
      console.log('[trackProgress] POST body:', JSON.stringify(body, null, 2))
    }

    // Try immediate POST
    const res = await fetch('/api/progress/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'include',
      cache: 'no-store',
    }).catch((err) => {
      // DEV: Log fetch error
      if (process.env.NODE_ENV === 'development') {
        console.error('[trackProgress] Fetch error:', err)
      }
      return null
    })

    // DEV: Log response
    if (process.env.NODE_ENV === 'development') {
      console.log('[trackProgress] Response status:', res?.status)
      if (res && !res.ok) {
        res.clone().json().then((data) => {
          console.error('[trackProgress] Error response:', data)
        }).catch(() => {
          console.error('[trackProgress] Failed to parse error response')
        })
      }
    }

    if (res?.ok) {
      emitProgressRecorded({ subjectId: activeSubjectId, eventType: input.type })
      // DEV: Log success
      if (process.env.NODE_ENV === 'development') {
        console.log('[trackProgress] ✅ Event recorded successfully')
      }
    } else {
      // Failed - queue for retry
      enqueueEvent(body)
      // DEV: Log queuing
      if (process.env.NODE_ENV === 'development') {
        console.log('[trackProgress] ⚠️  Event queued for retry')
      }
    }
  } catch (err) {
    // DEV: Log catch error
    if (process.env.NODE_ENV === 'development') {
      console.error('[trackProgress] Exception:', err)
    }
    // Network error - queue event
    try {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage?.getItem('nb_active_subject')
        const activeSubjectId = typeof stored === 'string' && stored.trim() ? stored.trim() : 'me'
        enqueueEvent({
          type: input.type,
          ...(input.path ? { path: input.path } : {}),
          ...(input.metadata ? { metadata: input.metadata } : {}),
          subjectId: activeSubjectId,
        })
      }
    } catch {
      // ignore
    }
  }
}
