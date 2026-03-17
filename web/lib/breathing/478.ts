/**
 * Canonical constants for the 4-7-8 breathing technique.
 *
 * Cycle = 4s inhale + 7s hold + 8s exhale = 19 seconds.
 * Default recommendation = 4 cycles = 76 seconds.
 */

export const FOUR_SEVEN_EIGHT_PHASES = [
  { name: 'Inhale', durationSeconds: 4 },
  { name: 'Hold', durationSeconds: 7 },
  { name: 'Exhale', durationSeconds: 8 },
] as const

export const FOUR_SEVEN_EIGHT_CYCLE_SECONDS = 19 // 4 + 7 + 8

export const FOUR_SEVEN_EIGHT_PRESETS = [
  { label: 'Recommended • 4 cycles', cycles: 4, seconds: 76 },
  { label: '1 minute • ~3 cycles', cycles: 3, seconds: 60 },
  { label: '2 minutes • ~6 cycles', cycles: 6, seconds: 120 },
  { label: '3 minutes • ~9 cycles', cycles: 9, seconds: 180 },
  { label: '5 minutes • ~15 cycles', cycles: 15, seconds: 300 },
] as const

export const FOUR_SEVEN_EIGHT_DEFAULT_PRESET = FOUR_SEVEN_EIGHT_PRESETS[0]

export const FOUR_SEVEN_EIGHT_ROUTE = '/techniques/4-7-8' as const

export const FOUR_SEVEN_EIGHT_COPY = {
  title: '4–7–8 Breathing',
  subtitle: 'A guided relaxation practice using a simple 4:7:8 breathing ratio.',
  description:
    'This technique is commonly associated with Dr. Andrew Weil and is often used for relaxation and stress support. Begin with four cycles if comfortable and practise consistently.',
  safetyNote:
    'Stop if you feel unwell or significantly lightheaded. If you have a respiratory, cardiovascular, or other medical condition, seek advice from a qualified clinician before starting a new breathing practice.',
  recommendationNote:
    'Begin with four cycles if comfortable. Practise at least twice daily — once in the morning and once at bedtime — for consistent benefit.',
} as const
