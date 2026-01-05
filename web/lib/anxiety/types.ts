// Type definitions for anxiety management app

export interface BreathingSession {
  id: string
  type: 'box' | '4-7-8' | 'coherent' | 'sos-60'
  duration: number // in seconds
  breathCount: number
  completedAt: string // ISO date
}

export interface ThoughtRecord {
  id: string
  createdAt: string // ISO date
  situation: string
  automaticThought: string
  emotion: string
  emotionIntensity: number // 0-10
  cognitiveDistortion: string
  evidenceFor: string
  evidenceAgainst: string
  balancedThought: string
  newEmotionIntensity: number // 0-10
}

export interface WorryEntry {
  id: string
  content: string
  createdAt: string // ISO date
  category: 'actionable' | 'not-in-control' | 'pending'
  action?: string
  resolved: boolean
  archivedAt?: string
}

export interface WorrySchedule {
  enabled: boolean
  startTime: string // HH:MM format
  duration: number // minutes
}

export interface ExposureStep {
  id: string
  description: string
  anxietyLevel: number // 0-10
  order: number
  completed: boolean
}

export interface ExposureAttempt {
  id: string
  stepId: string
  date: string // ISO date
  anxietyBefore: number
  anxietyDuring: number
  anxietyAfter: number
  duration: number // minutes
  notes: string
}

export interface ExposureLadder {
  id: string
  name: string
  createdAt: string
  steps: ExposureStep[]
  attempts: ExposureAttempt[]
}

export interface MoodEntry {
  id: string
  date: string // YYYY-MM-DD format
  anxietyLevel: number // 0-10
  mood: string
  tags: string[]
  notes: string
}

export interface GroundingSession {
  id: string
  completedAt: string // ISO date
  duration: number // seconds
  items: {
    see: string[]
    touch: string[]
    hear: string[]
    smell: string[]
    taste: string[]
  }
}

export interface PMRSession {
  id: string
  completedAt: string // ISO date
  duration: number // seconds
  muscleGroupsCompleted: number
}

export interface BodyScanSession {
  id: string
  completedAt: string // ISO date
  duration: number // seconds
}

export interface GratitudeEntry {
  id: string
  date: string // YYYY-MM-DD format
  gratitudes: Array<{
    item: string
    reason?: string
  }>
  mood?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: string // ISO date
  category: 'breathing' | 'grounding' | 'cbt' | 'exposure' | 'mood' | 'gratitude' | 'general' | 'streak'
  requirement: {
    type: 'count' | 'streak' | 'all-tools' | 'time-based'
    target: number
  }
}

export interface UserProgress {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string // YYYY-MM-DD format
  achievements: Achievement[]
  stats: {
    breathingSessions: number
    thoughtRecords: number
    groundingSessions: number
    pmrSessions: number
    bodyScanSessions: number
    moodEntries: number
    gratitudeEntries: number
    exposureAttempts: number
  }
}

export interface WeeklyGoal {
  id: string
  description: string
  target: number
  current: number
  category: string
}
