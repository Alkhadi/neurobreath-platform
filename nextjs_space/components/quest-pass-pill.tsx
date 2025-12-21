'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDeviceId } from '@/lib/device-id'

export default function QuestPassPill() {
  const [questData, setQuestData] = useState({ quests: 0, points: 0 })

  useEffect(() => {
    const fetchQuestData = async () => {
      try {
        const deviceId = getDeviceId()
        const response = await fetch(`/api/quests/today?deviceId=${deviceId}`)
        if (response?.ok) {
          const data = await response.json()
          setQuestData({
            quests: data?.completedQuests ?? 0,
            points: data?.totalPoints ?? 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch quest data:', error)
      }
    }

    fetchQuestData()

    // Update every minute
    const interval = setInterval(fetchQuestData, 60000)
    return () => clearInterval(interval)
  }, [])

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
