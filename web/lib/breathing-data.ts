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
  'box-breathing': {
    id: 'box-breathing',
    name: '🟩 Box Breathing',
    label: '🟩 Box Breathing · 4-4-4-4',
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
  // Alias for backward compatibility
  'box-4444': {
    id: 'box-breathing',
    name: '🟩 Box Breathing',
    label: '🟩 Box Breathing · 4-4-4-4',
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
  '4-7-8': {
    id: '4-7-8',
    name: '🟦 4-7-8 Breathing',
    label: '🟦 4-7-8 Reset',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Hold', duration: 7, color: '#FF9149' },
      { name: 'Exhale', duration: 8, color: '#FF9898' }
    ],
    description: 'Extended exhale for sleep and relaxation',
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Deepens relaxation'],
    category: 'sleep'
  },
  // Alias for backward compatibility
  'four-7-8': {
    id: '4-7-8',
    name: '🟦 4-7-8 Breathing',
    label: '🟦 4-7-8 Reset',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Hold', duration: 7, color: '#FF9149' },
      { name: 'Exhale', duration: 8, color: '#FF9898' }
    ],
    description: 'Extended exhale for sleep and relaxation',
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Deepens relaxation'],
    category: 'sleep'
  },
  'coherent': {
    id: 'coherent',
    name: '🟪 Coherent 5-5',
    label: '🟪 Coherent Breathing · 5-5',
    phases: [
      { name: 'Inhale', duration: 5, color: '#60B5FF' },
      { name: 'Exhale', duration: 5, color: '#FF9898' }
    ],
    description: 'Simple 5-5 pattern for heart rate variability',
    benefits: ['Boosts HRV', 'Enhances focus', 'Calms nervous system'],
    category: 'focus'
  },
  // Alias for backward compatibility
  'coherent-55': {
    id: 'coherent',
    name: '🟪 Coherent 5-5',
    label: '🟪 Coherent Breathing · 5-5',
    phases: [
      { name: 'Inhale', duration: 5, color: '#60B5FF' },
      { name: 'Exhale', duration: 5, color: '#FF9898' }
    ],
    description: 'Simple 5-5 pattern for heart rate variability',
    benefits: ['Boosts HRV', 'Enhances focus', 'Calms nervous system'],
    category: 'focus'
  },
  'sos': {
    id: 'sos',
    name: '🆘 60-second SOS',
    label: '🆘 SOS Reset · 60s',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Exhale', duration: 6, color: '#FF9898' }
    ],
    description: 'Quick 60-second reset: 4s inhale, 6s exhale. 6 cycles for immediate calm.',
    benefits: ['60-second emergency reset', 'Reduces panic quickly', 'Perfect for transitions'],
    category: 'transition'
  },
  // Alias for backward compatibility
  'sos-1m': {
    id: 'sos',
    name: '🆘 60-second SOS',
    label: '🆘 SOS Reset · 60s',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Exhale', duration: 6, color: '#FF9898' }
    ],
    description: 'Quick 60-second reset: 4s inhale, 6s exhale. 6 cycles for immediate calm.',
    benefits: ['60-second emergency reset', 'Reduces panic quickly', 'Perfect for transitions'],
    category: 'transition'
  },
  'triangle': {
    id: 'triangle',
    name: '🔺 Triangle Breathing',
    label: '🔺 Triangle · 4-4-4',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Hold', duration: 4, color: '#FF9149' },
      { name: 'Exhale', duration: 4, color: '#FF9898' }
    ],
    description: 'Simple 4-4-4 triangle pattern for beginners',
    benefits: ['Easy to learn', 'Gentle stress relief', 'Good for beginners'],
    category: 'calm'
  },
  'relaxing': {
    id: 'relaxing',
    name: '🌙 Relaxing Breath',
    label: '🌙 Relaxing · 4-2-6',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Hold', duration: 2, color: '#FF9149' },
      { name: 'Exhale', duration: 6, color: '#FF9898' }
    ],
    description: 'Extended exhale promotes parasympathetic response',
    benefits: ['Deep relaxation', 'Activates rest response', 'Reduces tension'],
    category: 'sleep'
  },
  'energizing': {
    id: 'energizing',
    name: '⚡ Energizing Breath',
    label: '⚡ Energizing · 4-0-2',
    phases: [
      { name: 'Inhale', duration: 4, color: '#60B5FF' },
      { name: 'Exhale', duration: 2, color: '#FF9898' }
    ],
    description: 'Quick powerful breaths to boost energy and alertness',
    benefits: ['Increases energy', 'Improves alertness', 'Wakes you up'],
    category: 'energy'
  },
  'physiological-sigh': {
    id: 'physiological-sigh',
    name: '😮‍💨 Physiological Sigh',
    label: '😮‍💨 Double Inhale Sigh',
    phases: [
      { name: 'Inhale', duration: 2, color: '#60B5FF' },
      { name: 'Inhale More', duration: 1, color: '#4A9FE8' },
      { name: 'Exhale Slowly', duration: 6, color: '#FF9898' }
    ],
    description: 'Double inhale followed by long exhale - scientifically proven to reduce stress fast',
    benefits: ['Fastest stress relief', 'Science-backed', 'Works in 1-3 breaths'],
    category: 'calm'
  },
  'wim-hof': {
    id: 'wim-hof',
    name: '🧊 Wim Hof Style',
    label: '🧊 Power Breathing',
    phases: [
      { name: 'Deep Inhale', duration: 2, color: '#60B5FF' },
      { name: 'Let Go', duration: 2, color: '#FF9898' }
    ],
    description: 'Powerful rhythmic breathing for energy and cold tolerance',
    benefits: ['Boosts immune system', 'Increases energy', 'Builds mental resilience'],
    category: 'energy'
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
