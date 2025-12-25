/**
 * Breathing technique definitions and patterns
 */

export interface BreathingPhase {
  name: string
  duration: number // in seconds
  color: string
}

export interface BreathingTechnique {
  id: string
  name: string
  label: string
  phases: BreathingPhase[]
  description: string
  benefits: string[]
  category: string
}

export const breathingTechniques: Record<string, BreathingTechnique> = {
  'box-4444': {
    id: 'box-4444',
    name: 'Box Breathing',
    label: 'Box Breathing · 4-4-4-4',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Hold', duration: 4, color: '#FF9149' },
      { name: 'Exhale', duration: 4, color: '#FF9898' },
      { name: 'Hold', duration: 4, color: '#A19AD3' }
    ],
    description: 'Equal 4-4-4-4 pattern for calm and focus',
    benefits: ['Reduces stress', 'Improves focus', 'Steadies heart rate'],
    category: 'calm'
  },
  'coherent-55': {
    id: 'coherent-55',
    name: 'Coherent Breathing',
    label: 'Coherent Breathing · 5-5',
    phases: [
      { name: 'Inhale', duration: 5, color: '#60B5FF' },
      { name: 'Exhale', duration: 5, color: '#FF9898' }
    ],
    description: 'Simple 5-5 pattern for heart rate variability',
    benefits: ['Boosts HRV', 'Enhances focus', 'Calms nervous system'],
    category: 'focus'
  },
  'four-7-8': {
    id: 'four-7-8',
    name: '4-7-8 Breathing',
    label: '4-7-8 Reset',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Hold', duration: 7, color: '#FF9149' },
      { name: 'Exhale', duration: 8, color: '#FF9898' }
    ],
    description: 'Extended exhale for sleep and relaxation',
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Deepens relaxation'],
    category: 'sleep'
  },
  'sos-1m': {
    id: 'sos-1m',
    name: '60-second SOS',
    label: 'SOS Reset · 60s',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Exhale', duration: 6, color: '#FF9898' }
    ],
    description: 'Quick 60-second reset: 4s inhale, 6s exhale. 6 cycles for immediate calm.',
    benefits: ['60-second emergency reset', 'Reduces panic quickly', 'Perfect for transitions'],
    category: 'transition'
  }
}

export function getTechniqueById(id: string): BreathingTechnique | undefined {
  return breathingTechniques[id]
}

export function calculateTotalCycleDuration(technique: BreathingTechnique): number {
  return technique?.phases?.reduce((sum, phase) => sum + (phase?.duration ?? 0), 0) ?? 0
}

export function calculateRoundsForMinutes(technique: BreathingTechnique, minutes: number): number {
  const cycleDuration = calculateTotalCycleDuration(technique)
  if (cycleDuration === 0) return 0
  return Math.floor((minutes * 60) / cycleDuration)
}
