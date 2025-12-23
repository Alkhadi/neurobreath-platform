'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getDeviceId } from '@/lib/device-id'
import { challengeDefinitions } from '@/lib/challenge-definitions'
import { toast } from 'sonner'
import ChallengeTutorial from './challenge-tutorial'
import { Clock, Target, Flame, TrendingUp } from 'lucide-react'

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

  useEffect(() => {
    fetchChallenges()
    fetchStats()
  }, [])

  const fetchChallenges = async () => {
    try {
      const deviceId = getDeviceId()
      const response = await fetch(`/api/challenges?deviceId=${deviceId}`)
      if (response?.ok) {
        const data = await response.json()
        setChallenges(data?.challenges ?? [])
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const deviceId = getDeviceId()
      const response = await fetch(`/api/progress?deviceId=${deviceId}`)
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
      console.error('Failed to fetch stats:', error)
    }
  }

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Stats Sidebar */}
            <aside className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalMinutes}</div>
                      <div className="text-xs text-gray-600">Total minutes</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
                      <div className="text-xs text-gray-600">Sessions</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
                      <div className="text-xs text-gray-600">Day streak</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.last7Days}</div>
                      <div className="text-xs text-gray-600">Last 7 days</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">💡 Coach note:</span> Log even a single minute
                  when you try a cue. Micro wins keep streaks alive and unlock badges faster.
                </p>
              </div>
            </aside>

            {/* Challenges Grid */}
            <div className="lg:col-span-3">
              <p className="text-gray-600 mb-6">
                Pick the quest that fits today. Each card logs locally so you can evidence care without pressure.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges?.map((challenge) => {
                  const def = challengeDefinitions.find(c => c.key === challenge?.challengeKey)
                  const progress = ((challenge?.currentSessions ?? 0) / (challenge?.targetSessions ?? 1)) * 100

                  return (
                    <div
                      key={challenge?.challengeKey}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {challenge?.challengeName ?? ''}
                          </h3>
                          <p className="text-xs text-gray-600">
                            Goal: {def?.minutes}min · {challenge?.targetSessions} days · {def?.category}
                          </p>
                        </div>
                        {challenge?.isCompleted && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{def?.why ?? ''}</p>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const anchor = document.querySelector('#daily-practice')
                              anchor?.scrollIntoView({ behavior: 'smooth' })
                            }}
                          >
                            Start
                          </Button>
                          <Button
                            onClick={() => handleMarkComplete(challenge?.challengeKey ?? '')}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled={challenge?.isCompleted}
                          >
                            Mark complete
                          </Button>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Day {challenge?.currentSessions ?? 0} of {challenge?.targetSessions ?? 0}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(challenge?.currentSessions ?? 0) * (def?.minutes ?? 3)} min logged
                          </div>
                        </div>
                      </div>
                    </div>
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
