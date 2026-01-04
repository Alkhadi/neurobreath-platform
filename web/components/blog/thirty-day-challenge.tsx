'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, Star } from 'lucide-react'
import Link from 'next/link'
import type { ThirtyDayChallengeTrack } from '@/types/ai-coach'

interface ThirtyDayChallengeProps {
  challenge: ThirtyDayChallengeTrack
}

export default function ThirtyDayChallenge({ challenge }: ThirtyDayChallengeProps) {
  if (!challenge) return null

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h4 className="font-semibold text-base">🏆 30-Day Calm Challenge (Optional)</h4>
        </div>
        
        {/* Challenge Rule */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-md border border-amber-100 dark:border-amber-900 mb-4">
          <p className="text-sm font-medium mb-1">Your Challenge:</p>
          <p className="text-base font-semibold text-amber-900 dark:text-amber-100">
            {challenge.rule}
          </p>
        </div>

        {/* Badge Milestones */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium mb-2">Badge Milestones:</p>
          {challenge.badgeMilestones.map((milestone, idx) => {
            const Icon = idx === 0 ? Flame : idx === 1 ? Star : Trophy
            return (
              <div key={idx} className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-900/50 rounded-md">
                <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="flex-1">
                  <Badge variant="outline" className="text-xs">
                    Day {milestone.days}
                  </Badge>
                  <span className="text-sm ml-2">{milestone.badge}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tracking Link */}
        <Link href={challenge.trackingLink}>
          <Button size="sm" variant="outline" className="w-full">
            Start Tracking Your Challenge
          </Button>
        </Link>

        <p className="text-xs text-muted-foreground mt-3 italic">
          💡 Track your daily progress and earn badges. Your streak grows one day at a time.
        </p>
      </CardContent>
    </Card>
  )
}





