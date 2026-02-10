'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Flame } from 'lucide-react'
import Link from 'next/link'

interface ChallengeData {
  streak: number
  lastCompletedDate: string | null
  badgesEarned: string[]
}

const STORAGE_KEY = 'neurobreath.calmChallenge'

const BADGES = [
  { id: '3-day', name: '3 Day Calm Streak', icon: '🔥', threshold: 3, description: "You're building a habit." },
  { id: '7-day', name: 'Week Warrior', icon: '📅', threshold: 7, description: '7 days of practice.' },
  { id: '30-day', name: 'Month Master', icon: '👑', threshold: 30, description: 'Complete the 30-day challenge.' },
]

export default function CalmChallenge() {
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    streak: 0,
    lastCompletedDate: null,
    badgesEarned: []
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadChallengeData()
  }, [])

  const loadChallengeData = () => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setChallengeData(data)
      }
    } catch (error) {
      console.error('Failed to load challenge data:', error)
    }
  }

  const getEarnedBadges = () => {
    return BADGES.filter(badge => challengeData.streak >= badge.threshold)
  }

  const getNextBadge = () => {
    return BADGES.find(badge => challengeData.streak < badge.threshold)
  }

  const earnedBadges = getEarnedBadges()
  const nextBadge = getNextBadge()

  if (!mounted) {
    // Show loading skeleton during SSR to avoid hydration mismatch
    return (
      <Card id="calm-challenge" className="scroll-mt-20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌟</span>
            <CardTitle className="text-2xl">30-Day Calm Challenge</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Join our community challenge: practice one calming activity every day for 30 days.
          </p>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="calm-challenge" className="scroll-mt-20">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌟</span>
          <CardTitle className="text-2xl">30-Day Calm Challenge</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Join our community challenge: practice one calming activity every day for 30 days.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* How it works */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-6">1.</span>
                <span><strong className="text-foreground">Choose your activity:</strong> Any breathing exercise, focus game, or mindfulness practice counts.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-6">2.</span>
                <span><strong className="text-foreground">Practice daily:</strong> Even just 1 minute counts. Consistency is key.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-6">3.</span>
                <span><strong className="text-foreground">Track your progress:</strong> Use the Progress Dashboard to see your streak grow.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-6">4.</span>
                <span><strong className="text-foreground">Earn badges:</strong> Unlock special challenge badges as you progress.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground min-w-6">5.</span>
                <span><strong className="text-foreground">Share your journey:</strong> Use #NeuroBreathChallenge on social media (optional).</span>
              </li>
            </ol>
          </div>

          {/* Challenge Status & Badges */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Your Progress
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">{challengeData.streak}</div>
                <div className="text-sm text-muted-foreground">
                  day{challengeData.streak !== 1 ? 's' : ''} streak
                </div>
              </div>
              {nextBadge && (
                <p className="text-sm text-muted-foreground">
                  {nextBadge.threshold - challengeData.streak} more day{nextBadge.threshold - challengeData.streak !== 1 ? 's' : ''} until <strong>{nextBadge.name}</strong>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Challenge badges</h3>
              <ul className="space-y-2">
                {BADGES.map(badge => {
                  const isEarned = earnedBadges.some(b => b.id === badge.id)
                  return (
                    <li key={badge.id} className={`flex items-start gap-2 ${isEarned ? '' : 'opacity-50'}`}>
                      <span className="text-lg">{badge.icon}</span>
                      <div className="text-sm">
                        <div className="font-medium flex items-center gap-2">
                          {badge.name}
                          {isEarned && <Badge variant="secondary" className="text-xs">Earned</Badge>}
                        </div>
                        <div className="text-muted-foreground">{badge.description}</div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/progress">
                <Button className="w-full">Start tracking your progress</Button>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/breathing/techniques" className="w-full">
                  <Button variant="outline" className="w-full">Try breathing</Button>
                </Link>
                <Link href="/autism/focus-garden" className="w-full">
                  <Button variant="outline" className="w-full">Try focus</Button>
                </Link>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2 border-t">
              Remember: This is about progress, not perfection. Every day you practice is a win.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

