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

      // Broadcast success
      const channel = getBroadcastChannel()
      if (channel) {
        try {
          channel.postMessage({
            type: 'progress:event',
            subjectId: event.body.subjectId,
            eventType: event.body.type,
            ts: Date.now(),
          })
        } catch {
          // ignore
        }
      }
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

    // Try immediate POST
    const res = await fetch('/api/progress/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'include',
    }).catch(() => null)

    if (res?.ok) {
      // Success - broadcast to other tabs (existing channel)
      const channel = getBroadcastChannel()
      if (channel) {
        try {
          channel.postMessage({
            type: 'progress:event',
            subjectId: activeSubjectId,
            eventType: input.type,
            ts: Date.now(),
          })
        } catch {
          // ignore
        }
      }
      
      // Also emit on dedicated real-time channel
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const realtimeChannel = new BroadcastChannel('nb_progress')
          realtimeChannel.postMessage({ type: 'event_recorded', timestamp: Date.now() })
          realtimeChannel.close()
        } catch {
          // BroadcastChannel not supported
        }
      }
      
      // Emit window event as fallback
      try {
        window.dispatchEvent(new CustomEvent('nb_progress_event_recorded', { 
          detail: { type: input.type, timestamp: Date.now() } 
        }))
      } catch {
        // ignore
      }
    } else {
      // Failed - queue for retry
      enqueueEvent(body)
    }
  } catch {
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
