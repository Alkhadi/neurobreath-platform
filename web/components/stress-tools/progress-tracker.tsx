'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Flame, Award, Activity, Calendar, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

interface StressLog {
  level: number;
  triggers: string[];
  symptoms: string[];
  notes: string;
  timestamp: string;
}

const rewardThresholds = [
  { count: 1, name: 'First Step', icon: '🌱', description: 'Completed first activity' },
  { count: 5, name: 'Getting Started', icon: '⭐', description: '5 activities completed' },
  { count: 10, name: 'Building Habits', icon: '🔥', description: '10 activities completed' },
  { count: 25, name: 'Stress Warrior', icon: '🛡️', description: '25 activities completed' },
  { count: 50, name: 'Zen Master', icon: '🧘', description: '50 activities completed' },
  { count: 100, name: 'Mindfulness Champion', icon: '🏆', description: '100 activities completed' },
]

export function ProgressTracker() {
  const [stressLogs, setStressLogs] = useState<StressLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('stressLogs') || '[]') as StressLog[]
      setStressLogs(logs)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }, [])

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

  const totalActivities = stressLogs.length
  const avgStress = stressLogs.length > 0
    ? Math.round(stressLogs.reduce((acc, l) => acc + l.level, 0) / stressLogs.length * 10) / 10
    : 0

  // Calculate streak (consecutive days with logs)
  const getDaysSinceEpoch = (date: Date) => Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  const today = getDaysSinceEpoch(new Date())
  const logDays = new Set(stressLogs.map(log => getDaysSinceEpoch(new Date(log.timestamp))))
  let streak = 0
  for (let i = 0; i < 365; i++) {
    if (logDays.has(today - i)) {
      streak++
    } else {
      break
    }
  }

  const earnedRewards = rewardThresholds.filter(r => totalActivities >= r.count)
  const nextReward = rewardThresholds.find(r => totalActivities < r.count)

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold">Your Progress</h3>
      </div>

      {totalActivities === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-xl font-semibold mb-2">Start Your Journey</h4>
          <p className="text-muted-foreground">
            Track your stress levels to see your progress over time and earn rewards!
          </p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg text-center"
            >
              <Activity className="h-6 w-6 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-700">{totalActivities}</div>
              <div className="text-xs text-teal-600">Logs</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center"
            >
              <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{new Set(stressLogs.map(l => new Date(l.timestamp).toDateString())).size}</div>
              <div className="text-xs text-purple-600">Days Tracked</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center"
            >
              <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">{streak}</div>
              <div className="text-xs text-orange-600">Day Streak</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center"
            >
              <Trophy className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{earnedRewards.length}</div>
              <div className="text-xs text-blue-600">Rewards</div>
            </motion.div>
          </div>

          {/* Average Stress */}
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

          {/* Next Reward Progress */}
          {nextReward && (
            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Next Reward</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{nextReward.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{nextReward.name}</div>
                  <div className="text-sm text-muted-foreground">{nextReward.description}</div>
                </div>
              </div>
              <Progress value={(totalActivities / nextReward.count) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2 text-center">
                {totalActivities} / {nextReward.count} activities
              </div>
            </div>
          )}

          {/* Earned Rewards */}
          {earnedRewards.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Earned Rewards</h4>
              <div className="flex flex-wrap gap-3">
                {earnedRewards.map((r) => (
                  <motion.div
                    key={r.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2 rounded-full"
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-sm font-medium">{r.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

