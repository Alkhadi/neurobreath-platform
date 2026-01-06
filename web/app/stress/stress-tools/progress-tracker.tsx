'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Flame, Award, Activity, Calendar, Trophy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

interface ProgressData {
  stressLogs: Array<{ id: string; level: number; createdAt: string }>
  activityLogs: Array<{ id: string; activityType: string; duration: number; createdAt: string }>
  streaks: Array<{ activityType: string; currentCount: number; longestCount: number }>
  rewards: Array<{ rewardType: string; earnedAt: string }>
  stats: { totalActivities: number; totalMinutes: number }
}

const rewardInfo: Record<string, { name: string; icon: string; description: string }> = {
  first_step: { name: 'First Step', icon: '🌱', description: 'Completed first activity' },
  getting_started: { name: 'Getting Started', icon: '⭐', description: '5 activities completed' },
  building_habits: { name: 'Building Habits', icon: '🔥', description: '10 activities completed' },
  stress_warrior: { name: 'Stress Warrior', icon: '🛡️', description: '25 activities completed' },
  zen_master: { name: 'Zen Master', icon: '🧘', description: '50 activities completed' },
  mindfulness_champion: { name: 'Mindfulness Champion', icon: '🏆', description: '100 activities completed' },
}

export function ProgressTracker() {
  const { data: session } = useSession() || {}
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const res = await fetch('/api/progress')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.user])

  if (!session?.user) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
          <p className="text-muted-foreground">
            Sign in to track your stress management journey, earn rewards, and build streaks.
          </p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        </div>
      </Card>
    )
  }

  const stats = data?.stats ?? { totalActivities: 0, totalMinutes: 0 }
  const streaks = data?.streaks ?? []
  const rewards = data?.rewards ?? []
  const stressLogs = data?.stressLogs ?? []

  const avgStress = stressLogs.length > 0
    ? Math.round(stressLogs.reduce((acc, l) => acc + (l.level ?? 0), 0) / stressLogs.length * 10) / 10
    : 0

  const nextReward = Object.entries(rewardInfo).find(
    ([key]) => !rewards.some((r) => r.rewardType === key)
  )

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold">Your Progress</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg text-center"
        >
          <Activity className="h-6 w-6 text-teal-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-teal-700">{stats.totalActivities}</div>
          <div className="text-xs text-teal-600">Activities</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center"
        >
          <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-700">{stats.totalMinutes}</div>
          <div className="text-xs text-purple-600">Minutes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center"
        >
          <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-700">
            {streaks.reduce((max, s) => Math.max(max, s.currentCount ?? 0), 0)}
          </div>
          <div className="text-xs text-orange-600">Best Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center"
        >
          <Trophy className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">{rewards.length}</div>
          <div className="text-xs text-blue-600">Rewards</div>
        </motion.div>
      </div>

      {/* Average Stress */}
      {stressLogs.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Average Stress Level</span>
            <span className={`font-bold ${
              avgStress <= 4 ? 'text-green-600' : avgStress <= 6 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {avgStress}/10
            </span>
          </div>
          <Progress value={avgStress * 10} className="h-3" />
        </div>
      )}

      {/* Next Reward Progress */}
      {nextReward && (
        <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span className="font-medium">Next Reward</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{rewardInfo[nextReward[0]]?.icon ?? '🎯'}</span>
            <div className="flex-1">
              <div className="font-semibold">{rewardInfo[nextReward[0]]?.name ?? 'Unknown'}</div>
              <div className="text-sm text-muted-foreground">{rewardInfo[nextReward[0]]?.description ?? ''}</div>
            </div>
          </div>
        </div>
      )}

      {/* Earned Rewards */}
      {rewards.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Earned Rewards</h4>
          <div className="flex flex-wrap gap-3">
            {rewards.map((r) => (
              <motion.div
                key={r.rewardType}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2 rounded-full"
              >
                <span className="text-xl">{rewardInfo[r.rewardType]?.icon ?? '🎯'}</span>
                <span className="text-sm font-medium">{rewardInfo[r.rewardType]?.name ?? r.rewardType}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
