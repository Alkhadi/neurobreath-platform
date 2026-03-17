'use client'

import { BreathingExercise } from '@/components/BreathingExercise'

/**
 * Dedicated 4-7-8 breathing player.
 *
 * Pre-selects the 4-7-8 pattern and the recommended 4-cycle default
 * (76 seconds). Delegates all timer, audio, and progress logic to the
 * shared BreathingExercise component to avoid duplicating state machines.
 */
export function Breathing478Player() {
  return <BreathingExercise initialPattern="4-7-8" />
}
