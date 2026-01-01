'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAutismProgress } from '@/hooks/useAutismProgress'
import { BADGES } from '@/lib/autism/evidence-base'
import { resetProgress } from '@/lib/autism/storage'
import { Trophy, Flame, Clock, Star, TrendingUp } from 'lucide-react'

export function ProgressDashboard() {
  const { progress, hydrated } = useAutismProgress()

  const handleReset = () => {
    if (confirm('Are you sure? This will clear all progress on this page (local only).')) {
      resetProgress()
      window.location.reload()
    }
  }

  if (!hydrated) {
    return (
      <section id="progress" className="scroll-mt-24 py-16 md:py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="p-8">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  const weeklyData = Object.entries(progress.weeklyMinutes)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)

  const earnedBadges = BADGES.filter(b => progress.badges.has(b.id))
  const unearnedBadges = BADGES.filter(b => !progress.badges.has(b.id))

  return (
    <section id="progress" className="scroll-mt-24 py-16 md:py-20 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Progress</p>
          <h2 className="text-3xl font-bold text-gray-900">Your progress</h2>
          <p className="text-gray-600">Local-only tracking: streaks, minutes, skills, and badges.</p>
        </div>

        <Card className="p-6 md:p-8 mb-6 bg-white/80 backdrop-blur shadow-sm">
          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
              <Flame className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-3xl font-bold text-orange-600">{progress.streak}</div>
              <div className="text-sm text-gray-700">Day streak</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-600">{progress.sessions}</div>
              <div className="text-sm text-gray-700">Total sessions</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">{progress.minutes}</div>
              <div className="text-sm text-gray-700">Total minutes</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
              <Star className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-600">{progress.skillsPracticed.size}</div>
              <div className="text-sm text-gray-700">Skills practiced</div>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map(([date, minutes]) => {
                const maxMinutes = Math.max(...weeklyData.map(([, m]) => m), 1)
                const height = (minutes / maxMinutes) * 100
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })

                return (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100%' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-2">{dayName}</div>
                    <div className="text-xs font-medium text-gray-900">{minutes}m</div>
                  </div>
                )
              })}
            </div>
            {weeklyData.length === 0 && (
              <p className="text-center text-gray-500 text-sm">No activity yet this week</p>
            )}
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Plans completed</h4>
              <div className="text-2xl font-bold text-blue-600">{progress.plansCompleted}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Last session</h4>
              <div className="text-sm text-gray-700">
                {progress.lastSessionDate
                  ? new Date(progress.lastSessionDate).toLocaleDateString()
                  : 'Not yet logged'}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Badges ({earnedBadges.length} / {BADGES.length})
            </h3>

            {earnedBadges.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Earned:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {earnedBadges.map(badge => (
                    <div
                      key={badge.id}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-lg border-2 border-yellow-300 text-center"
                      title={badge.description}
                    >
                      <div className="text-3xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-semibold text-gray-900">{badge.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unearnedBadges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Available:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {unearnedBadges.map(badge => (
                    <div
                      key={badge.id}
                      className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-center opacity-60"
                      title={`${badge.description} - ${badge.criteria}`}
                    >
                      <div className="text-3xl mb-1 grayscale">{badge.icon}</div>
                      <div className="text-xs font-medium text-gray-600">{badge.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="text-center">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-red-600 hover:text-red-700">
            Reset progress (local only)
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Progress is stored locally on this device only. No data is synced or shared.
          </p>
        </div>
      </div>
    </section>
  )
}

