'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { getDeviceId } from '@/lib/device-id'

// Retry fetch with exponential backoff
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (response?.ok) return response
    } catch {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i)))
      }
    }
  }
  return null
}

export default function QuestPassPill() {
  const [questData, setQuestData] = useState({ quests: 0, points: 0 })

  const fetchQuestData = useCallback(async () => {
    try {
      const deviceId = getDeviceId()
      const response = await fetchWithRetry(`/api/quests/today?deviceId=${deviceId}`)
      if (response?.ok) {
        const data = await response.json()
        setQuestData({
          quests: data?.completedQuests ?? 0,
          points: data?.totalPoints ?? 0
        })
      }
    } catch (error) {
      // Silently fail - the UI will show default values
      console.debug('Quest data unavailable:', error)
    }
  }, [])

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
