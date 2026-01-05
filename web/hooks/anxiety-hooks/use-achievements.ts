'use client'

import { useEffect } from 'react'
import { useLocalStorage } from './use-local-storage'
import { Achievement, UserProgress } from '@/lib/types'
import { toast } from 'sonner'

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first breathing session',
    icon: '🌱',
    category: 'breathing',
    requirement: { type: 'count', target: 1 }
  },
  {
    id: 'breathing-pro',
    name: 'Breathing Pro',
    description: 'Complete 50 breathing sessions',
    icon: '💨',
    category: 'breathing',
    requirement: { type: 'count', target: 50 }
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    category: 'streak',
    requirement: { type: 'streak', target: 7 }
  },
  {
    id: 'calm-collector',
    name: 'Calm Collector',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    category: 'streak',
    requirement: { type: 'streak', target: 30 }
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Complete 100 total sessions',
    icon: '💯',
    category: 'general',
    requirement: { type: 'count', target: 100 }
  },
  {
    id: 'grounding-master',
    name: 'Grounding Master',
    description: 'Complete 10 grounding exercises',
    icon: '🌍',
    category: 'grounding',
    requirement: { type: 'count', target: 10 }
  },
  {
    id: 'thought-challenger',
    name: 'Thought Challenger',
    description: 'Complete 5 thought records',
    icon: '🧠',
    category: 'cbt',
    requirement: { type: 'count', target: 5 }
  },
  {
    id: 'exposure-explorer',
    name: 'Exposure Explorer',
    description: 'Complete your first exposure step',
    icon: '🚀',
    category: 'exposure',
    requirement: { type: 'count', target: 1 }
  },
  {
    id: 'ladder-climber',
    name: 'Ladder Climber',
    description: 'Complete a full exposure ladder',
    icon: '🪜',
    category: 'exposure',
    requirement: { type: 'count', target: 1 }
  },
  {
    id: 'mindful-month',
    name: 'Mindful Month',
    description: 'Practice for 30 days',
    icon: '🌙',
    category: 'general',
    requirement: { type: 'streak', target: 30 }
  },
  {
    id: 'wellness-champion',
    name: 'Wellness Champion',
    description: 'Use all 9 interactive tools',
    icon: '👑',
    category: 'general',
    requirement: { type: 'all-tools', target: 9 }
  },
  {
    id: 'gratitude-guru',
    name: 'Gratitude Guru',
    description: 'Log 30 gratitude entries',
    icon: '🙏',
    category: 'gratitude',
    requirement: { type: 'count', target: 30 }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Practice before 9am (5 times)',
    icon: '🌅',
    category: 'general',
    requirement: { type: 'time-based', target: 5 }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Practice after 9pm (5 times)',
    icon: '🦉',
    category: 'general',
    requirement: { type: 'time-based', target: 5 }
  }
]

export function useAchievements() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('neurobreath_progress', {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    achievements: ACHIEVEMENTS.map(a => ({ ...a })),
    stats: {
      breathingSessions: 0,
      thoughtRecords: 0,
      groundingSessions: 0,
      pmrSessions: 0,
      bodyScanSessions: 0,
      moodEntries: 0,
      gratitudeEntries: 0,
      exposureAttempts: 0
    }
  })

  const checkAchievements = () => {
    const newAchievements = [...(progress?.achievements ?? ACHIEVEMENTS)]
    let hasNewAchievement = false

    newAchievements?.forEach((achievement, index) => {
      if (achievement?.earnedAt) return // Already earned

      let earned = false

      switch (achievement?.id) {
        case 'first-step':
          earned = (progress?.stats?.breathingSessions ?? 0) >= 1
          break
        case 'breathing-pro':
          earned = (progress?.stats?.breathingSessions ?? 0) >= 50
          break
        case 'week-warrior':
          earned = (progress?.currentStreak ?? 0) >= 7
          break
        case 'calm-collector':
        case 'mindful-month':
          earned = (progress?.currentStreak ?? 0) >= 30
          break
        case 'century-club':
          earned = (progress?.totalSessions ?? 0) >= 100
          break
        case 'grounding-master':
          earned = (progress?.stats?.groundingSessions ?? 0) >= 10
          break
        case 'thought-challenger':
          earned = (progress?.stats?.thoughtRecords ?? 0) >= 5
          break
        case 'exposure-explorer':
          earned = (progress?.stats?.exposureAttempts ?? 0) >= 1
          break
        case 'gratitude-guru':
          earned = (progress?.stats?.gratitudeEntries ?? 0) >= 30
          break
        case 'wellness-champion':
          const toolsUsed = [
            (progress?.stats?.breathingSessions ?? 0) > 0,
            (progress?.stats?.groundingSessions ?? 0) > 0,
            (progress?.stats?.thoughtRecords ?? 0) > 0,
            (progress?.stats?.exposureAttempts ?? 0) > 0,
            (progress?.stats?.moodEntries ?? 0) > 0,
            (progress?.stats?.gratitudeEntries ?? 0) > 0,
            (progress?.stats?.pmrSessions ?? 0) > 0,
            (progress?.stats?.bodyScanSessions ?? 0) > 0
          ].filter(Boolean).length
          earned = toolsUsed >= 9
          break
      }

      if (earned) {
        newAchievements[index] = {
          ...achievement,
          earnedAt: new Date().toISOString()
        }
        hasNewAchievement = true
        
        // Show toast notification
        toast.success(`Achievement Unlocked! ${achievement?.icon}`, {
          description: achievement?.name ?? ''
        })
      }
    })

    if (hasNewAchievement) {
      setProgress(prev => ({
        ...prev,
        achievements: newAchievements
      }))
    }
  }

  useEffect(() => {
    checkAchievements()
  }, [
    progress?.stats?.breathingSessions,
    progress?.stats?.thoughtRecords,
    progress?.stats?.groundingSessions,
    progress?.stats?.exposureAttempts,
    progress?.stats?.gratitudeEntries,
    progress?.currentStreak,
    progress?.totalSessions
  ])

  return { progress, setProgress, checkAchievements, allAchievements: ACHIEVEMENTS }
}
