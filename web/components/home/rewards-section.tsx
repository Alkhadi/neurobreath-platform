'use client'

import { useEffect, useState, useCallback } from 'react'
import { getDeviceId } from '@/lib/device-id'
import RewardTutorial from './reward-tutorial'
import HomeCardGrid from './home-card-grid'
import { Sparkles } from 'lucide-react'

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

interface Badge {
  badgeKey: string
  badgeName: string
  description: string
  icon: string
  isUnlocked: boolean
  unlockedAt?: string
}

export default function RewardsSection() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBadges = useCallback(async () => {
    try {
      const deviceId = getDeviceId()
      const response = await fetchWithRetry(`/api/badges?deviceId=${deviceId}`)
      if (response?.ok) {
        const data = await response.json()
        setBadges(data?.badges ?? [])
      }
    } catch (error) {
      console.debug('Badges unavailable:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBadges()
  }, [fetchBadges])

  return (
    <section
      id="rewards-lab"
      className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Rewards & Milestones
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Badges celebrate consistency, curiosity, and kindness to yourself. Nothing here is a competition.
            </p>
          </div>

          <RewardTutorial />

          {loading ? (
            <HomeCardGrid>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 dark:bg-slate-700/50 rounded-3xl p-6 animate-pulse min-h-[180px]"
                />
              ))}
            </HomeCardGrid>
          ) : (
            <HomeCardGrid>
              {badges.map((badge) => (
                <div
                  key={badge.badgeKey}
                  className={`rounded-3xl p-6 text-center transition-all duration-300 ${
                    badge.isUnlocked
                      ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/30 border-2 border-green-400 dark:border-green-600 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60'
                      : 'bg-gray-100 dark:bg-slate-700/30 border-2 border-dashed border-gray-300 dark:border-slate-600 opacity-60'
                  }`}
                >
                  <div
                    className={`text-5xl mb-3 ${
                      badge.isUnlocked ? 'animate-bounce' : 'opacity-40'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      badge.isUnlocked ? 'text-green-900' : 'text-gray-500'
                    }`}
                  >
                    {badge.badgeName}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${
                      badge.isUnlocked ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {badge.description}
                  </p>
                  <div
                    className={`text-sm font-semibold ${
                      badge.isUnlocked ? 'text-green-700' : 'text-gray-500'
                    }`}
                  >
                    {badge.isUnlocked ? (
                      <span className="flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Unlocked
                      </span>
                    ) : (
                      'Locked'
                    )}
                  </div>
                  {badge.isUnlocked && badge.unlockedAt && (
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(badge.unlockedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </HomeCardGrid>
          )}

          <p className="text-center text-gray-600 dark:text-slate-300 mt-8">
            Badges unlock gently and stay visible even if you take a break. You can reset them any time in
            the progress section.
          </p>
        </div>
      </div>
    </section>
  )
}
