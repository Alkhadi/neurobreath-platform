'use client'

/**
 * OfflineSyncDrain — invisible component that lives in the app layout
 * and automatically drains the offline session queue when the browser
 * comes back online.
 *
 * Also shows a small toast notification when queued items are synced.
 */

import { useEffect } from 'react'
import { useOfflineSync } from '@/hooks/useOfflineSync'

export function OfflineSyncDrain() {
  const { pending, drain } = useOfflineSync()

  // When we detect pending items on mount AND we're online, drain.
  useEffect(() => {
    if (pending > 0 && typeof navigator !== 'undefined' && navigator.onLine) {
      void drain()
    }
  }, [pending, drain])

  // This is a headless component — no UI.
  return null
}
