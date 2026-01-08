/**
 * Activity Recording Helper
 * 
 * Simplified helper to record activities for the active profile.
 * Used across practice/training routes.
 */

import { getActiveProfileId } from '@/lib/onboarding/deviceProfileStore'
import { recordActivity as recordActivityInStore } from '@/lib/progress/progressStore'
import { toast } from 'sonner'

/**
 * Record an activity for the currently active profile
 * 
 * @param activityKey - Unique key for the activity (e.g., 'dyslexia-reading', 'breathing-sos')
 * @param durationSec - Duration in seconds
 * @param metrics - Optional metrics (accuracy, wpm, score, etc.)
 * @returns true if recorded successfully, false otherwise
 */
export function recordUserActivity(
  activityKey: string,
  durationSec: number,
  metrics?: {
    accuracy?: number
    wpm?: number
    score?: number
    [key: string]: any
  }
): boolean {
  try {
    const profileId = getActiveProfileId()
    
    // If no active profile, skip recording (guest mode)
    if (!profileId) {
      return false
    }
    
    // Record the activity
    const progress = recordActivityInStore(profileId, activityKey, durationSec, metrics)
    
    // Show XP toast
    const xpEarned = Math.floor(durationSec / 60) * 10 // XP_PER_MINUTE = 10
    if (xpEarned > 0) {
      toast.success(`+${xpEarned} XP earned!`, {
        duration: 2000,
      })
    }
    
    return true
  } catch (error) {
    console.error('[ActivityRecorder] Failed to record activity:', error)
    return false
  }
}

/**
 * Activity key constants for common activities
 */
export const ACTIVITY_KEYS = {
  // Breathing
  BREATHING_SOS: 'breathing-sos',
  BREATHING_BOX: 'breathing-box-breathing',
  BREATHING_478: 'breathing-4-7-8',
  BREATHING_COHERENT: 'breathing-coherent',
  BREATHING_MINDFULNESS: 'breathing-mindfulness',
  BREATHING_FOCUS_GARDEN: 'breathing-focus-garden',
  
  // Dyslexia Reading
  DYSLEXIA_READING: 'dyslexia-reading-training',
  PHONICS_SOUNDS: 'phonics-sounds-lab',
  WORD_CONSTRUCTION: 'word-construction',
  VOCABULARY_BUILDER: 'vocabulary-builder',
  BLENDING_SEGMENTING: 'blending-segmenting-lab',
  LETTER_REVERSAL: 'letter-reversal-training',
  SYLLABLE_SPLITTER: 'syllable-splitter',
  RAPID_NAMING: 'rapid-naming',
  FLUENCY_PACER: 'fluency-pacer',
  PRONUNCIATION_PRACTICE: 'pronunciation-practice',
  
  // Focus Tools
  FOCUS_TILES: 'focus-tiles',
  FOCUS_TRAINING: 'focus-training',
  COLOUR_PATH: 'colour-path',
  BREATH_LADDER: 'breath-ladder',
  ADHD_FOCUS_LAB: 'adhd-focus-lab',
  
  // Games
  ROULETTE: 'roulette',
  
  // Assessments
  READING_ASSESSMENT: 'reading-assessment',
  READING_CHECKIN: 'reading-checkin',
} as const

/**
 * Example usage:
 * 
 * // After completing a breathing session:
 * recordUserActivity(ACTIVITY_KEYS.BREATHING_SOS, 120, { rounds: 2 })
 * 
 * // After dyslexia reading practice:
 * recordUserActivity(ACTIVITY_KEYS.DYSLEXIA_READING, 300, { wordsRead: 45, accuracy: 0.92 })
 * 
 * // After focus training:
 * recordUserActivity(ACTIVITY_KEYS.FOCUS_TILES, 180, { score: 850, level: 5 })
 */

