'use client'

import { Award, TrendingUp, Calendar, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAchievements } from '@/hooks/use-achievements'
import { motion } from 'framer-motion'

const WIDTH_CLASS_BY_PERCENT: Record<number, string> = {
  0: 'w-0',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-1/4',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-2/5',
  45: 'w-[45%]',
  50: 'w-1/2',
  55: 'w-[55%]',
  60: 'w-3/5',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-3/4',
  80: 'w-4/5',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-full'
}

function percentToWidthClass(percent: number): string {
  const clamped = Math.max(0, Math.min(100, percent))
  const rounded = Math.round(clamped / 5) * 5
  return WIDTH_CLASS_BY_PERCENT[rounded] ?? 'w-0'
}

export function ProgressDashboard() {
  const { progress, allAchievements } = useAchievements()
  
  const earnedAchievements = progress?.achievements?.filter(a => a?.earnedAt) ?? []
  const percentComplete = Math.round(((earnedAchievements?.length ?? 0) / (allAchievements?.length ?? 1)) * 100)
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{progress?.totalSessions ?? 0}</div>
              <div className="text-xs text-muted-foreground">Total Sessions</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">🔥 {progress?.currentStreak ?? 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{progress?.totalMinutes ?? 0}</div>
              <div className="text-xs text-muted-foreground">Total Minutes</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{earnedAchievements?.length ?? 0}/{allAchievements?.length ?? 0}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Achievements Gallery */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Achievement Badges</h3>
          <div className="text-sm text-muted-foreground">{percentComplete}% Complete</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {allAchievements?.map(achievement => {
            const earned = progress?.achievements?.find(a => a?.id === achievement?.id)?.earnedAt
            return (
              <motion.div
                key={achievement?.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  earned 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
                    : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{achievement?.icon}</div>
                <div className="text-xs font-semibold">{achievement?.name}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{achievement?.description}</div>
                {earned && (
                  <div className="text-xs text-green-600 font-medium mt-2">
                    ✓ Earned {new Date(earned).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </Card>
      
      {/* Tool Usage Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tool Usage</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Breathing Exercises</span>
              <span className="font-bold">{progress?.stats?.breathingSessions ?? 0}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full bg-blue-500 ${percentToWidthClass(((progress?.stats?.breathingSessions ?? 0) / 50) * 100)}`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Thought Records</span>
              <span className="font-bold">{progress?.stats?.thoughtRecords ?? 0}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full bg-purple-500 ${percentToWidthClass(((progress?.stats?.thoughtRecords ?? 0) / 10) * 100)}`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Grounding Sessions</span>
              <span className="font-bold">{progress?.stats?.groundingSessions ?? 0}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full bg-green-500 ${percentToWidthClass(((progress?.stats?.groundingSessions ?? 0) / 10) * 100)}`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mood Entries</span>
              <span className="font-bold">{progress?.stats?.moodEntries ?? 0}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full bg-pink-500 ${percentToWidthClass(((progress?.stats?.moodEntries ?? 0) / 30) * 100)}`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Gratitude Entries</span>
              <span className="font-bold">{progress?.stats?.gratitudeEntries ?? 0}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full bg-yellow-500 ${percentToWidthClass(((progress?.stats?.gratitudeEntries ?? 0) / 30) * 100)}`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exposure Attempts</span>
              <span className="font-bold">{progress?.stats?.exposureAttempts ?? 0}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full bg-orange-500 ${percentToWidthClass(((progress?.stats?.exposureAttempts ?? 0) / 10) * 100)}`}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
