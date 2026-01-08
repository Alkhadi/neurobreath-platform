/**
 * Core Progress Types
 * 
 * Brand-agnostic progress tracking types
 */

export interface Session {
  id: string
  timestamp: string // ISO 8601
  technique: string
  label: string
  minutes: number
  breaths: number
  rounds: number
  category?: string
}

export interface Assessment {
  id: string
  timestamp: string
  assessmentType: string
  levelBandResult?: string
  placementLevel?: string
  scores: {
    decoding?: number
    wordRecognition?: number
    fluency?: number
    comprehension?: number
  }
}

export interface Badge {
  key: string
  name: string
  icon: string
  unlockedAt: string // ISO 8601
}

export interface Progress {
  version: number
  createdAt: string
  lastUpdated: string
  totalSessions: number
  totalMinutes: number
  totalBreaths: number
  currentStreak: number
  longestStreak: number
  lastSessionDate?: string // YYYY-MM-DD
  sessions: Session[]
  assessments: Assessment[]
  badges: Badge[]
}

