/**
 * Reading Assessment Calculation Utilities
 * Implements standardized metrics for reading assessments
 * 
 * Metrics:
 * - WCPM (Words Correct Per Minute): (Words Correct / Time in minutes)
 * - Accuracy: (Words Correct / Total Words) * 100
 * - Error Rate: (Errors / Total Words) * 100
 * - Self-corrections are tracked separately and do not count as errors if corrected within 3 seconds
 */

export interface ReadingMetrics {
  totalWords: number
  wordsCorrect: number
  errorsTotal: number
  accuracyPct: number
  wcpm: number
  errorRate: number
  selfCorrections: number
}

export interface ReadingLevelResult {
  band: string // beginner, elementary, intermediate, advanced
  percentile: number // 0-100
  description: string
  recommendations: string[]
}

/**
 * Calculate reading metrics from raw data
 * @param totalWords Total words in passage
 * @param wordsCorrect Words read correctly
 * @param timeSeconds Time taken in seconds
 * @param selfCorrections Number of self-corrections
 * @param uncorrectedErrors Errors that were not self-corrected
 */
export function calculateReadingMetrics(
  totalWords: number,
  wordsCorrect: number,
  timeSeconds: number,
  selfCorrections: number = 0,
  uncorrectedErrors: number = 0
): ReadingMetrics {
  const timeMinutes = timeSeconds / 60
  const wcpm = timeMinutes > 0 ? Math.round(wordsCorrect / timeMinutes) : 0
  const accuracyPct = totalWords > 0 ? Math.round((wordsCorrect / totalWords) * 100) : 0
  const errorsTotal = uncorrectedErrors
  const errorRate = totalWords > 0 ? Math.round((errorsTotal / totalWords) * 100) : 0

  return {
    totalWords,
    wordsCorrect,
    errorsTotal,
    accuracyPct,
    wcpm,
    errorRate,
    selfCorrections,
  }
}

/**
 * Calculate reading level based on accuracy and WCPM
 * @param accuracy Accuracy percentage (0-100)
 * @param wcpm Words Correct Per Minute
 * @param grade Optional grade level for more specific benchmarks
 */
export function determineReadingLevel(
  accuracy: number,
  wcpm: number = 0,
  grade?: string
): ReadingLevelResult {
  // Beginner: < 80% accuracy
  if (accuracy < 80) {
    return {
      band: 'beginner',
      percentile: Math.min(100, Math.round((accuracy / 80) * 50)),
      description: 'Building foundational reading skills. Focus on letter sounds and basic word recognition.',
      recommendations: [
        'Practice letter sounds and basic phonics daily',
        'Use multisensory reading techniques (visual, auditory, kinesthetic)',
        'Build sight word vocabulary with high-frequency words',
        'Read short, simple stories with repetitive patterns',
        'Practice with 1-2 minute sessions to avoid frustration',
      ],
    }
  }
  // Elementary: 80-89% accuracy
  else if (accuracy < 90) {
    return {
      band: 'elementary',
      percentile: 50 + Math.round(((accuracy - 80) / 10) * 25),
      description: 'Basic reading comprehension with room for improvement. Good progress on foundational skills.',
      recommendations: [
        'Continue systematic phonics instruction',
        'Practice blending and decoding multisyllabic words',
        'Build reading fluency with timed reading exercises',
        'Focus on reading comprehension with guided questions',
        'Read graded readers matched to your level',
      ],
    }
  }
  // Intermediate: 90-95% accuracy
  else if (accuracy < 96) {
    return {
      band: 'intermediate',
      percentile: 75 + Math.round(((accuracy - 90) / 5) * 15),
      description: 'Good reading comprehension and decoding skills. Ready for more challenging materials.',
      recommendations: [
        'Explore more complex sentence structures',
        'Read age-appropriate chapter books',
        'Practice inferencing and deeper comprehension strategies',
        'Build vocabulary in content areas of interest',
        'Try reading strategies like predicting and summarizing',
      ],
    }
  }
  // Advanced: 96%+ accuracy
  else {
    return {
      band: 'advanced',
      percentile: Math.min(100, 90 + Math.round(((accuracy - 96) / 4) * 10)),
      description: 'Excellent comprehension and advanced reading skills. Ready for challenging texts.',
      recommendations: [
        'Explore literature and advanced texts',
        'Practice critical reading and analysis',
        'Read widely across different genres and subjects',
        'Develop specialized reading strategies for content',
        'Consider advanced reading programs or competitions',
      ],
    }
  }
}

/**
 * Calculate reading level from quick assessment score
 * (used for the interactive assessment with 15 questions)
 */
export function calculateQuickAssessmentLevel(
  score: number,
  totalQuestions: number
): ReadingLevelResult {
  const accuracy = (score / totalQuestions) * 100
  return determineReadingLevel(accuracy)
}

/**
 * Determine reading difficulty band based on various factors
 */
export function determineDifficultyBand(
  wcpm: number,
  accuracy: number,
  previousLevel?: string
): string {
  // Beginner: WCPM < 40, Accuracy < 90%
  if (wcpm < 40 && accuracy < 90) return 'beginner'
  // Elementary: WCPM 40-80, Accuracy 85-94%
  if (wcpm >= 40 && wcpm < 80 && accuracy >= 85) return 'elementary'
  // Intermediate: WCPM 80-120, Accuracy 90-97%
  if (wcpm >= 80 && wcpm < 120 && accuracy >= 90) return 'intermediate'
  // Advanced: WCPM 120+, Accuracy 96%+
  if (wcpm >= 120 && accuracy >= 96) return 'advanced'
  // Default based on accuracy
  return determineReadingLevel(accuracy).band
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: ReadingMetrics): {
  wcpm: string
  accuracy: string
  errorRate: string
} {
  return {
    wcpm: `${metrics.wcpm} wpm`,
    accuracy: `${metrics.accuracyPct}%`,
    errorRate: `${metrics.errorRate}%`,
  }
}
