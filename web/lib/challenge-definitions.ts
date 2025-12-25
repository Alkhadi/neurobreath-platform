/**
 * Challenge definitions
 */

export interface ChallengeDefinition {
  key: string
  name: string
  description: string
  category: 'calm' | 'focus' | 'sleep' | 'school' | 'mood'
  targetSessions: number
  recommendedTechnique: string
  minutes: number
  icon: string
  why: string
}

export const challengeDefinitions: ChallengeDefinition[] = [
  {
    key: 'dailyCalm',
    name: 'Daily Calm',
    description: '3-minute Box Breathing for morning or evening calm',
    category: 'calm',
    targetSessions: 7,
    recommendedTechnique: 'box-4444',
    minutes: 3,
    icon: '🟩',
    why: 'Box breathing steadies your nervous system and builds a predictable calm routine'
  },
  {
    key: 'morningFocus',
    name: 'Morning Focus',
    description: '5-minute Coherent 5-5 to prime attention for the day',
    category: 'focus',
    targetSessions: 5,
    recommendedTechnique: 'coherent-55',
    minutes: 5,
    icon: '🟪',
    why: 'Coherent 5-5 boosts heart-rate variability and steadies prefrontal attention for upcoming tasks'
  },
  {
    key: 'sleepReset',
    name: 'Sleep Reset',
    description: '5-minute 4-7-8 wind-down before bed',
    category: 'sleep',
    targetSessions: 4,
    recommendedTechnique: 'four-7-8',
    minutes: 5,
    icon: '🟦',
    why: 'Extended exhale activates the relaxation response and eases sleep onset'
  },
  {
    key: 'schoolCalm',
    name: 'School Calm',
    description: '2-minute SOS reset for school transitions',
    category: 'school',
    targetSessions: 10,
    recommendedTechnique: 'sos-1m',
    minutes: 2,
    icon: '🎒',
    why: 'Quick resets help manage sensory overload and transitions between classes'
  },
  {
    key: 'moodLift',
    name: 'Mood Lift',
    description: '3-minute breathing to lift mood and reduce stress',
    category: 'mood',
    targetSessions: 5,
    recommendedTechnique: 'box-4444',
    minutes: 3,
    icon: '😊',
    why: 'Regular practice helps regulate emotions and build resilience'
  }
]

export function getChallengeByKey(key: string): ChallengeDefinition | undefined {
  return challengeDefinitions.find(c => c.key === key)
}
