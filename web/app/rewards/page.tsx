'use client'

import { useEffect, useState } from 'react'
import { Trophy, Lock } from 'lucide-react'
import { getDeviceId } from '@/lib/device-id'
import { badgeDefinitions } from '@/lib/badge-definitions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Badge {
  badgeKey: string
  badgeName: string
  badgeIcon: string
  unlockedAt: string
}

interface ProgressData {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
}

export default function RewardsPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [progress, setProgress] = useState<ProgressData>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deviceId = getDeviceId()
        
        // Fetch badges
        const badgesRes = await fetch(`/api/badges?deviceId=${deviceId}`)
        if (badgesRes?.ok) {
          const data = await badgesRes.json()
          setBadges(data?.badges ?? [])
        }

        // Fetch progress for locked badge status
        const progressRes = await fetch(`/api/progress?deviceId=${deviceId}`)
        if (progressRes?.ok) {
          const data = await progressRes.json()
          setProgress(data)
        }
      } catch (error) {
        console.error('Failed to fetch rewards:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isBadgeUnlocked = (badgeKey: string) => {
    return badges?.some(b => b?.badgeKey === badgeKey)
  }

  const getBadgeProgress = (def: typeof badgeDefinitions[0]) => {
    const condition = def?.unlockCondition
    const current = 
      condition?.type === 'sessions' ? progress?.totalSessions :
      condition?.type === 'minutes' ? progress?.totalMinutes :
      condition?.type === 'streak' ? progress?.currentStreak :
      0
    
    return {
      current: current ?? 0,
      required: condition?.value ?? 0,
      percentage: Math.min(((current ?? 0) / (condition?.value ?? 1)) * 100, 100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading rewards...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Rewards & Badges</h1>
          <p className="text-lg text-gray-600">Unlock badges as you build your breathing practice.</p>
        </div>

        {/* Unlocked Badges Count */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 shadow-lg mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8" />
            <p className="text-5xl font-bold">{badges?.length ?? 0}/{badgeDefinitions?.length ?? 0}</p>
          </div>
          <p className="text-xl">Badges Unlocked</p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badgeDefinitions?.map((def) => {
            const unlocked = isBadgeUnlocked(def?.key ?? '')
            const progressData = getBadgeProgress(def)

            return (
              <div
                key={def?.key}
                className={`bg-white rounded-xl p-6 shadow-lg transition-all ${
                  unlocked ? 'border-2 border-yellow-400' : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">
                    {unlocked ? def?.icon : <Lock className="w-12 h-12 text-gray-400" />}
                  </div>
                  {unlocked && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      ✔ Unlocked
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{def?.name ?? ''}</h3>
                <p className="text-sm text-gray-600 mb-4">{def?.description ?? ''}</p>

                {/* Progress Bar */}
                {!unlocked && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progressData?.current ?? 0}/{progressData?.required ?? 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progressData?.percentage ?? 0, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Unlock Date */}
                {unlocked && (
                  <p className="text-xs text-gray-500 mt-4">
                    Unlocked on{' '}
                    {new Date(
                      badges?.find(b => b?.badgeKey === def?.key)?.unlockedAt ?? ''
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Keep practicing to unlock more badges and build your streak!
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">Start a Session</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/progress">View Progress</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
