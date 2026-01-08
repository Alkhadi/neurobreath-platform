'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { getDeviceId } from '@/lib/device-id'

// Retry fetch with exponential backoff
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        // Suppress fetch errors in console by handling them gracefully
        headers: { 'Accept': 'application/json' }
      })
      
      if (response?.ok) return response
      
      // Check if DB is unavailable (expected in dev without DB setup)
      if (response?.status === 500 || response?.status === 503) {
        const data = await response.json().catch(() => ({}))
        if (data?.dbUnavailable) {
          // DB is down - no point retrying
          return null
        }
      }
    } catch (error) {
      // Network error or fetch failed - silently handle
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i)))
      }
    }
  }
  return null
}

export default function QuestPassPill() {
  const [questData, setQuestData] = useState({ quests: 0, points: 0 })
  const [isDbAvailable, setIsDbAvailable] = useState(true)

  const fetchQuestData = useCallback(async () => {
    // Skip fetching if DB is known to be unavailable
    if (!isDbAvailable) return
    
    try {
      const deviceId = getDeviceId()
      const response = await fetchWithRetry(`/api/quests/today?deviceId=${deviceId}`)
      
      if (response) {
        const data = await response.json()
        
        // Check if DB is unavailable
        if (data?.dbUnavailable) {
          setIsDbAvailable(false)
          return
        }
        
        setQuestData({
          quests: data?.completedQuests ?? 0,
          points: data?.totalPoints ?? 0
        })
        setIsDbAvailable(true)
      }
    } catch (error) {
      // Silently fail - the UI will show default values
      // Only log in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.debug('[QuestPassPill] Quest data unavailable (this is normal without a database)')
      }
    }
  }, [isDbAvailable])

  useEffect(() => {
    fetchQuestData()

    // Update every minute
    const interval = setInterval(fetchQuestData, 60000)
    return () => clearInterval(interval)
  }, [fetchQuestData])

  return (
    <Link
      href="/progress"
      className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
    >
      <span className="text-lg" aria-hidden="true">🎯</span>
      <span className="text-sm font-medium">{questData?.quests ?? 0}/3 quests</span>
      <span className="text-sm opacity-90">{questData?.points ?? 0} pts</span>
    </Link>
  )
}
