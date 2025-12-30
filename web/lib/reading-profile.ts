/**
 * Reading Profile Calculation Utilities
 * 
 * Implements a multi-skill rubric for realistic reading assessment
 * that produces skill bands with confidence levels.
 * 
 * IMPORTANT: This is a training/monitoring tool only.
 * NOT for diagnosis. Formal assessment by qualified professionals is required.
 */

export type LevelBand = 'beginner' | 'elementary' | 'intermediate' | 'advanced'
export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface SkillScore {
  score: number // 0-100
  band: LevelBand
  itemsAssessed: number
  minItemsRequired: number
}

export interface ReadingProfile {
  decoding: SkillScore
  wordRecognition: SkillScore
  fluency: SkillScore
  comprehension: SkillScore
  
  overallBand: LevelBand
  confidence: ConfidenceLevel
  
  strengths: string[]
  needs: string[]
  suggestedFocus: string
}

export interface ORFMetrics {
  totalWords: number
  wordsCorrect: number
  errorsTotal: number
  selfCorrections: number
  durationSeconds: number
  accuracyPct: number
  wcpm: number
  errorRate: number
}

export interface ErrorMark {
  wordIndex: number
  wordText: string
  errorType: 'substitution' | 'omission' | 'insertion' | 'reversal' | 'hesitation' | 'unknown'
  corrected: boolean // Self-corrected within 3 seconds
}

/**
 * Calculate ORF metrics from marking data
 * 
 * Formula:
 * - Total Words (TW) = passage word count
 * - Errors Total (E) = errors NOT corrected within 3 seconds
 * - Words Correct (WC) = TW - E (insertions add error but don't change TW)
 * - WCPM = WC / (TS / 60)
 * - Accuracy = (WC / TW) * 100
 */
export function calculateORFMetrics(
  passageWordCount: number,
  errors: ErrorMark[],
  durationSeconds: number
): ORFMetrics {
  // Count uncorrected errors (excluding self-corrections)
  const uncorrectedErrors = errors.filter(e => !e.corrected)
  
  // Count insertions separately - they add errors but don't affect total word count
  const insertions = uncorrectedErrors.filter(e => e.errorType === 'insertion').length
  const otherErrors = uncorrectedErrors.filter(e => e.errorType !== 'insertion').length
  
  // Self-corrections count
  const selfCorrections = errors.filter(e => e.corrected).length
  
  // Calculate metrics
  const totalWords = passageWordCount
  const errorsTotal = uncorrectedErrors.length
  const wordsCorrect = Math.max(0, totalWords - otherErrors) // Insertions don't reduce correct words
  
  const timeMinutes = durationSeconds / 60
  const wcpm = timeMinutes > 0 ? Math.round((wordsCorrect / timeMinutes) * 10) / 10 : 0
  const accuracyPct = totalWords > 0 ? Math.round((wordsCorrect / totalWords) * 1000) / 10 : 0
  const errorRate = totalWords > 0 ? Math.round((errorsTotal / totalWords) * 1000) / 10 : 0
  
  return {
    totalWords,
    wordsCorrect,
    errorsTotal,
    selfCorrections,
    durationSeconds,
    accuracyPct,
    wcpm,
    errorRate,
  }
}

/**
 * Determine skill band from accuracy percentage
 */
function bandFromAccuracy(accuracy: number): LevelBand {
  if (accuracy >= 96) return 'advanced'
  if (accuracy >= 90) return 'intermediate'
  if (accuracy >= 80) return 'elementary'
  return 'beginner'
}

/**
 * Determine fluency band from WCPM
 * These are approximate internal benchmarks, NOT national norms
 */
function bandFromWCPM(wcpm: number): LevelBand {
  if (wcpm >= 120) return 'advanced'
  if (wcpm >= 80) return 'intermediate'
  if (wcpm >= 45) return 'elementary'
  return 'beginner'
}

/**
 * Calculate skill score from accuracy and items assessed
 */
function calculateSkillScore(
  accuracy: number,
  itemsAssessed: number,
  minItemsRequired: number
): SkillScore {
  return {
    score: Math.round(accuracy),
    band: bandFromAccuracy(accuracy),
    itemsAssessed,
    minItemsRequired,
  }
}

/**
 * Calculate fluency skill score combining WCPM and accuracy
 */
function calculateFluencyScore(
  wcpm: number,
  accuracy: number,
  itemsAssessed: number
): SkillScore {
  // Fluency score combines WCPM band with accuracy
  const wcpmBand = bandFromWCPM(wcpm)
  const accBand = bandFromAccuracy(accuracy)
  
  // Use the lower of the two bands for fluency
  const bandOrder: LevelBand[] = ['beginner', 'elementary', 'intermediate', 'advanced']
  const wcpmIdx = bandOrder.indexOf(wcpmBand)
  const accIdx = bandOrder.indexOf(accBand)
  const finalBand = bandOrder[Math.min(wcpmIdx, accIdx)]
  
  // Score is weighted: 60% WCPM contribution, 40% accuracy
  const wcpmScore = Math.min(100, (wcpm / 150) * 100) // 150 WCPM = 100 score
  const score = Math.round(wcpmScore * 0.6 + accuracy * 0.4)
  
  return {
    score,
    band: finalBand,
    itemsAssessed,
    minItemsRequired: 50, // Minimum words for reliable fluency
  }
}

/**
 * Determine confidence level based on evidence quantity
 */
function calculateConfidence(profile: {
  decoding: SkillScore
  wordRecognition: SkillScore
  fluency: SkillScore
  comprehension: SkillScore
}): ConfidenceLevel {
  let sufficientComponents = 0
  
  if (profile.decoding.itemsAssessed >= profile.decoding.minItemsRequired) sufficientComponents++
  if (profile.wordRecognition.itemsAssessed >= profile.wordRecognition.minItemsRequired) sufficientComponents++
  if (profile.fluency.itemsAssessed >= profile.fluency.minItemsRequired) sufficientComponents++
  if (profile.comprehension.itemsAssessed >= profile.comprehension.minItemsRequired) sufficientComponents++
  
  if (sufficientComponents >= 3) return 'high'
  if (sufficientComponents >= 2) return 'medium'
  return 'low'
}

/**
 * Determine overall band by combining component bands
 */
function calculateOverallBand(profile: {
  decoding: SkillScore
  wordRecognition: SkillScore
  fluency: SkillScore
  comprehension: SkillScore
}): LevelBand {
  const bandOrder: LevelBand[] = ['beginner', 'elementary', 'intermediate', 'advanced']
  
  // Weight: decoding (25%), word recognition (25%), fluency (30%), comprehension (20%)
  const weights = {
    decoding: 0.25,
    wordRecognition: 0.25,
    fluency: 0.30,
    comprehension: 0.20,
  }
  
  let weightedSum = 0
  weightedSum += bandOrder.indexOf(profile.decoding.band) * weights.decoding
  weightedSum += bandOrder.indexOf(profile.wordRecognition.band) * weights.wordRecognition
  weightedSum += bandOrder.indexOf(profile.fluency.band) * weights.fluency
  weightedSum += bandOrder.indexOf(profile.comprehension.band) * weights.comprehension
  
  const roundedIdx = Math.round(weightedSum)
  return bandOrder[Math.min(3, Math.max(0, roundedIdx))]
}

/**
 * Analyze strengths and needs based on component scores
 */
function analyzeStrengthsNeeds(profile: {
  decoding: SkillScore
  wordRecognition: SkillScore
  fluency: SkillScore
  comprehension: SkillScore
}): { strengths: string[]; needs: string[]; suggestedFocus: string } {
  const strengths: string[] = []
  const needs: string[] = []
  
  const components = [
    { name: 'Decoding', score: profile.decoding, label: 'decoding and phonics' },
    { name: 'Word Recognition', score: profile.wordRecognition, label: 'sight word recognition' },
    { name: 'Fluency', score: profile.fluency, label: 'reading fluency and speed' },
    { name: 'Comprehension', score: profile.comprehension, label: 'reading comprehension' },
  ]
  
  // Find highest and lowest
  const sorted = [...components].sort((a, b) => b.score.score - a.score.score)
  
  // Top performers are strengths
  for (const comp of sorted.slice(0, 2)) {
    if (comp.score.band === 'intermediate' || comp.score.band === 'advanced') {
      strengths.push(`${comp.name} skills are at ${comp.score.band} level`)
    }
  }
  
  // Lower performers are needs
  for (const comp of sorted.slice(-2)) {
    if (comp.score.band === 'beginner' || comp.score.band === 'elementary') {
      needs.push(`${comp.name} could benefit from more practice`)
    }
  }
  
  // Determine focus based on lowest component
  const lowest = sorted[sorted.length - 1]
  let suggestedFocus = `Focus on ${lowest.label}`
  
  // Check for specific patterns
  const decodingLow = profile.decoding.band === 'beginner' || profile.decoding.band === 'elementary'
  const compHigh = profile.comprehension.band === 'intermediate' || profile.comprehension.band === 'advanced'
  
  if (decodingLow && compHigh) {
    suggestedFocus = 'Decoding skills lag behind comprehension → Focus on phonics and decoding practice'
  } else if (!decodingLow && !compHigh) {
    suggestedFocus = 'Decoding is stronger than comprehension → Focus on comprehension strategies'
  }
  
  return { strengths, needs, suggestedFocus }
}

/**
 * Build complete reading profile from assessment data
 */
export function buildReadingProfile(data: {
  // Decoding (pseudowords)
  decodingCorrect?: number
  decodingTotal?: number
  
  // Word Recognition
  wordRecognitionCorrect?: number
  wordRecognitionTotal?: number
  
  // Fluency (ORF)
  orfMetrics?: ORFMetrics
  
  // Comprehension
  comprehensionCorrect?: number
  comprehensionTotal?: number
}): ReadingProfile {
  // Calculate decoding score
  const decodingAccuracy = data.decodingTotal && data.decodingTotal > 0
    ? (data.decodingCorrect || 0) / data.decodingTotal * 100
    : 0
  const decoding = calculateSkillScore(
    decodingAccuracy,
    data.decodingTotal || 0,
    15 // Minimum 15 pseudowords
  )
  
  // Calculate word recognition score
  const wordRecAccuracy = data.wordRecognitionTotal && data.wordRecognitionTotal > 0
    ? (data.wordRecognitionCorrect || 0) / data.wordRecognitionTotal * 100
    : 0
  const wordRecognition = calculateSkillScore(
    wordRecAccuracy,
    data.wordRecognitionTotal || 0,
    20 // Minimum 20 words
  )
  
  // Calculate fluency score
  const fluency = data.orfMetrics
    ? calculateFluencyScore(
        data.orfMetrics.wcpm,
        data.orfMetrics.accuracyPct,
        data.orfMetrics.totalWords
      )
    : calculateSkillScore(0, 0, 50)
  
  // Calculate comprehension score
  const compAccuracy = data.comprehensionTotal && data.comprehensionTotal > 0
    ? (data.comprehensionCorrect || 0) / data.comprehensionTotal * 100
    : 0
  const comprehension = calculateSkillScore(
    compAccuracy,
    data.comprehensionTotal || 0,
    6 // Minimum 6 questions
  )
  
  // Build profile
  const skillProfile = { decoding, wordRecognition, fluency, comprehension }
  const confidence = calculateConfidence(skillProfile)
  const overallBand = calculateOverallBand(skillProfile)
  const { strengths, needs, suggestedFocus } = analyzeStrengthsNeeds(skillProfile)
  
  return {
    ...skillProfile,
    overallBand,
    confidence,
    strengths,
    needs,
    suggestedFocus,
  }
}

/**
 * Get band display properties
 */
export function getBandDisplay(band: LevelBand): {
  label: string
  color: string
  bgColor: string
  description: string
} {
  switch (band) {
    case 'advanced':
      return {
        label: 'Advanced',
        color: 'text-purple-700 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        description: 'Strong reading skills across components',
      }
    case 'intermediate':
      return {
        label: 'Intermediate',
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        description: 'Good reading skills with room for growth',
      }
    case 'elementary':
      return {
        label: 'Elementary',
        color: 'text-amber-700 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        description: 'Building foundational reading skills',
      }
    case 'beginner':
    default:
      return {
        label: 'Beginner',
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        description: 'Starting the reading journey',
      }
  }
}

/**
 * Get confidence display properties
 */
export function getConfidenceDisplay(confidence: ConfidenceLevel): {
  label: string
  description: string
} {
  switch (confidence) {
    case 'high':
      return {
        label: 'High Confidence',
        description: 'Multiple assessment components provide reliable evidence',
      }
    case 'medium':
      return {
        label: 'Medium Confidence',
        description: 'Some components assessed; consider completing more sections',
      }
    case 'low':
    default:
      return {
        label: 'Low Confidence',
        description: 'Limited evidence; complete more assessment components',
      }
  }
}

/**
 * Medical disclaimer text
 */
export const TRAINING_DISCLAIMER = `This is a training and monitoring tool only. It is NOT a diagnostic instrument. 
The results shown are NeuroBreath internal indices (non-normed) and should not be compared to standardized assessments. 
For formal diagnosis of reading difficulties or dyslexia, please consult a qualified educational psychologist, 
reading specialist, or other appropriately credentialed professional.`

export const SHORT_DISCLAIMER = 'Training/monitoring only. Not for diagnosis.'
