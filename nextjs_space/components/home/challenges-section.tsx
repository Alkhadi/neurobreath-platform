'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getDeviceId } from '@/lib/device-id'
import { challengeDefinitions } from '@/lib/challenge-definitions'
import { toast } from 'sonner'

interface Challenge {
  challengeKey: string
  challengeName: string
  category: string
  targetSessions: number
  currentSessions: number
  isCompleted: boolean
}

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
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
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500">Loading challenges...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Daily Challenges</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build consistency with guided breathing challenges. Each challenge helps you establish calm, focus, or sleep routines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges?.map((challenge) => {
            const def = challengeDefinitions.find(c => c.key === challenge?.challengeKey)
            const progress = ((challenge?.currentSessions ?? 0) / (challenge?.targetSessions ?? 1)) * 100

            return (
              <div
                key={challenge?.challengeKey}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-2xl mb-2">{def?.icon ?? '🟩'}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{challenge?.challengeName ?? ''}</h3>
                  </div>
                  {challenge?.isCompleted && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      ✔ Complete
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{def?.description ?? ''}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{challenge?.currentSessions ?? 0}/{challenge?.targetSessions ?? 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    <strong>Why:</strong> {def?.why ?? ''}
                  </p>
                  <Button
                    onClick={() => handleMarkComplete(challenge?.challengeKey ?? '')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={challenge?.isCompleted}
                  >
                    Mark today complete
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
