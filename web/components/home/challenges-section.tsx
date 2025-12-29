'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { getDeviceId } from '@/lib/device-id'
import { challengeDefinitions } from '@/lib/challenge-definitions'
import { toast } from 'sonner'
import ChallengeTutorial from './challenge-tutorial'
import ProgressCard from './progress-card'
import CoachNote from './coach-note'
import ChallengeCard from './challenge-card'
import { Clock, Target, Flame, TrendingUp } from 'lucide-react'
import { useBreathingSession, mapTechniqueToSession } from '@/contexts/BreathingSessionContext'

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

interface Challenge {
  challengeKey: string
  challengeName: string
  category: string
  targetSessions: number
  currentSessions: number
  isCompleted: boolean
}

interface Stats {
  totalMinutes: number
  totalSessions: number
  currentStreak: number
  last7Days: number
}

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [stats, setStats] = useState<Stats>({
    totalMinutes: 0,
    totalSessions: 0,
    currentStreak: 0,
    last7Days: 0
  })
  const [loading, setLoading] = useState(true)
  const { launchSession } = useBreathingSession()

  // Define stat items configuration
  const statItems = [
    {
      icon: Clock,
      value: stats.totalMinutes,
      label: 'Total minutes',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Target,
      value: stats.totalSessions,
      label: 'Sessions',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Flame,
      value: stats.currentStreak,
      label: 'Day streak',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      value: stats.last7Days,
      label: 'Last 7 days',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ]

  const fetchChallenges = useCallback(async () => {
    try {
      const deviceId = getDeviceId()
      const response = await fetchWithRetry(`/api/challenges?deviceId=${deviceId}`)
      if (response?.ok) {
        const data = await response.json()
        setChallenges(data?.challenges ?? [])
      }
    } catch (error) {
      console.debug('Challenges unavailable:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const deviceId = getDeviceId()
      const response = await fetchWithRetry(`/api/progress?deviceId=${deviceId}`)
      if (response?.ok) {
        const data = await response.json()
        setStats({
          totalMinutes: data?.totalMinutes ?? 0,
          totalSessions: data?.totalSessions ?? 0,
          currentStreak: data?.currentStreak ?? 0,
          last7Days: data?.last7Days ?? 0
        })
      }
    } catch (error) {
      console.debug('Stats unavailable:', error)
    }
  }, [])

  useEffect(() => {
    fetchChallenges()
    fetchStats()
  }, [fetchChallenges, fetchStats])

  const handleMarkComplete = async (challengeKey: string) => {
    try {
      const deviceId = getDeviceId()
      const def = challengeDefinitions.find(c => c.key === challengeKey)
      
      // Log session first
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          technique: def?.recommendedTechnique ?? 'box-4444',
          label: def?.name ?? 'Challenge',
          minutes: def?.minutes ?? 3,
          breaths: 0,
          rounds: 0,
          category: def?.category ?? 'calm'
        })
      })

      // Update challenge
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          challengeKey,
          minutes: def?.minutes ?? 3,
          technique: def?.recommendedTechnique ?? 'box-4444',
          category: def?.category ?? 'calm'
        })
      })

      if (response?.ok) {
        toast.success('✅ Challenge progress updated!')
        fetchChallenges()
      }
    } catch (error) {
      console.error('Failed to mark challenge complete:', error)
      toast.error('Failed to update challenge')
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500">Loading challenges...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="breathing-challenges" className="py-16 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Breathing challenges & quests
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Measured, neuro-inclusive quests with proof you can show to families, teachers, or clinicians.
              Data is saved on your device only.
            </p>
          </div>

          <ChallengeTutorial />

          <div className="space-y-6">
            {/* Progress Card - Full Width */}
            <ProgressCard statItems={statItems} />

            {/* Coach Note - Full Width */}
            <CoachNote
              message="Log even a single minute when you try a cue. Micro wins keep streaks alive and unlock badges faster."
            />

            {/* Challenges Section */}
            <div>
              <p className="text-gray-600 mb-6">
                Pick the quest that fits today. Each card logs locally so you can evidence care without pressure.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {challenges?.map((challenge) => {
                  const def = challengeDefinitions.find(c => c.key === challenge?.challengeKey)

                  return (
                    <ChallengeCard
                      key={challenge.challengeKey}
                      challenge={challenge}
                      definition={def}
                      onStart={() => {
                        // Launch the appropriate breathing session for this challenge
                        const technique = def?.recommendedTechnique ?? 'box-4444'
                        const sessionType = mapTechniqueToSession(technique)
                        launchSession(sessionType, challenge.challengeKey)
                      }}
                      onMarkComplete={() => handleMarkComplete(challenge.challengeKey)}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-8">
            You can stop at any time. Challenges log locally so you can evidence effort without shame or pressure.
          </p>
        </div>
      </div>
    </section>
  )
}
