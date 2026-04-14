/**
 * Offline Queue — IndexedDB-backed queue for Firestore session writes.
 *
 * When the browser goes offline, session payloads are stored locally.
 * When connectivity returns, the queue is drained by POSTing each entry
 * to `/api/firebase-session` in order.
 *
 * Duplicate-XP protection: each queued item has a unique `clientId`
 * which the server can use as an idempotency key.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface QueuedSession {
  /** Unique client-generated ID for idempotency. */
  clientId: string
  /** Firebase UID of the user who earned this session. */
  uid: string
  type: string
  label: string
  durationSec: number
  /** ISO string — when the session actually occurred. */
  occurredAt: string
  metadata?: Record<string, unknown>
  /** Number of drain attempts so far. */
  attempts: number
  /** Timestamp when enqueued. */
  enqueuedAt: string
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DB_NAME = 'nb_offline_queue'
const DB_VERSION = 1
const STORE_NAME = 'sessions'
const MAX_ATTEMPTS = 5

// ── IndexedDB helpers ──────────────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'clientId' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** Enqueue a session for later sync. Returns the clientId. */
export async function enqueueSession(
  session: Omit<QueuedSession, 'clientId' | 'attempts' | 'enqueuedAt'>
): Promise<string> {
  const db = await openDb()
  const clientId = `${session.uid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const entry: QueuedSession = {
    ...session,
    clientId,
    attempts: 0,
    enqueuedAt: new Date().toISOString(),
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    tx.oncomplete = () => resolve(clientId)
    tx.onerror = () => reject(tx.error)
  })
}

/** Get all pending items. */
export async function getPendingItems(): Promise<QueuedSession[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result as QueuedSession[])
    req.onerror = () => reject(req.error)
  })
}

/** Remove a successfully synced item. */
async function removeItem(clientId: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(clientId)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** Increment the attempt counter for a failed item. */
async function bumpAttempts(item: QueuedSession): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const updated = { ...item, attempts: item.attempts + 1 }
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(updated)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Drain the queue — attempt to POST each pending session to
 * `/api/firebase-session`.
 *
 * @param getIdToken — async function that returns a fresh Firebase ID token
 * @returns number of successfully synced items
 */
export async function drainQueue(
  getIdToken: () => Promise<string | null>
): Promise<number> {
  const items = await getPendingItems()
  if (items.length === 0) return 0

  const token = await getIdToken()
  if (!token) return 0

  let synced = 0

  for (const item of items) {
    if (item.attempts >= MAX_ATTEMPTS) {
      // Give up on items that have failed too many times.
      await removeItem(item.clientId)
      continue
    }

    try {
      const res = await fetch('/api/firebase-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: item.uid,
          type: item.type,
          label: item.label,
          durationSec: item.durationSec,
          clientId: item.clientId,
        }),
      })

      if (res.ok) {
        await removeItem(item.clientId)
        synced++
      } else {
        await bumpAttempts(item)
      }
    } catch {
      // Network still down — stop draining.
      break
    }
  }

  return synced
}

/** Count of pending items (for UI badges). */
export async function pendingCount(): Promise<number> {
  const items = await getPendingItems()
  return items.length
}
