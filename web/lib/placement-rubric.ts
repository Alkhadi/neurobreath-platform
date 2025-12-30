/**
 * NeuroBreath Placement Rubric
 * 
 * Calculates placement level from assessment skill scores.
 * Uses a weighted multi-domain approach to determine starting point.
 * 
 * NOT a diagnostic tool - training placement only.
 */

import type { ReadingProfile, SkillScore, ConfidenceLevel } from './reading-profile'
import { 
  NBLevel, 
  NB_LEVELS, 
  NB_LEVEL_ORDER, 
  LearnerGroup,
  LEARNER_GROUPS,
  getNBLevelByValue,
  PLACEMENT_DISCLAIMER,
} from './placement-levels'

// ============================================================================
// TYPES
// ============================================================================

export interface PlacementInput {
  /** Learner's age group for content filtering */
  learnerGroup: LearnerGroup
  
  /** Reading profile from assessment */
  profile: ReadingProfile
  
  /** Optional: Previous placement level for comparison */
  previousLevel?: NBLevel
}

export interface PlacementResult {
  /** Assigned NB level (NB-L0 through NB-L8) */
  level: NBLevel
  
  /** Numeric representation (0-8) */
  levelNumeric: number
  
  /** Confidence in this placement */
  confidence: ConfidenceLevel
  
  /** Learner group for content filtering */
  learnerGroup: LearnerGroup
  
  /** Skill-by-skill level determination */
  skillLevels: {
    decoding: NBLevel
    wordRecognition: NBLevel
    fluency: NBLevel
    comprehension: NBLevel
  }
  
  /** Which skills are limiting (lowest) */
  limitingSkills: string[]
  
  /** Which skills are strongest */
  strongestSkills: string[]
  
  /** Recommended focus areas based on gaps */
  recommendedFocus: string[]
  
  /** Change from previous level if provided */
  levelChange?: {
    direction: 'up' | 'down' | 'same'
    steps: number
  }
  
  /** Explanation of how placement was determined */
  explanation: string
  
  /** Disclaimer text */
  disclaimer: string
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Weights for each skill domain in placement calculation
 * Decoding and fluency weighted higher for younger learners
 * Comprehension weighted higher for older learners
 */
const SKILL_WEIGHTS: Record<LearnerGroup, {
  decoding: number
  wordRecognition: number
  fluency: number
  comprehension: number
}> = {
  children: {
    decoding: 0.30,
    wordRecognition: 0.25,
    fluency: 0.30,
    comprehension: 0.15,
  },
  youth: {
    decoding: 0.25,
    wordRecognition: 0.25,
    fluency: 0.30,
    comprehension: 0.20,
  },
  adolescence: {
    decoding: 0.20,
    wordRecognition: 0.20,
    fluency: 0.30,
    comprehension: 0.30,
  },
  adult: {
    decoding: 0.20,
    wordRecognition: 0.20,
    fluency: 0.25,
    comprehension: 0.35,
  },
}

// ============================================================================
// CORE PLACEMENT LOGIC
// ============================================================================

/**
 * Determine NB level from a single skill score (0-100)
 */
export function scoreToNBLevel(score: number): NBLevel {
  // Work backwards from highest level to find matching threshold
  for (let i = NB_LEVEL_ORDER.length - 1; i >= 0; i--) {
    const level = NB_LEVEL_ORDER[i]
    const config = NB_LEVELS[level]
    // Use the average of skill thresholds as a general benchmark
    const avgThreshold = (
      config.skillThresholds.decodingMin +
      config.skillThresholds.wordRecognitionMin +
      config.skillThresholds.comprehensionMin
    ) / 3
    
    if (score >= avgThreshold) {
      return level
    }
  }
  return 'NB-L0'
}

/**
 * Determine NB level for a specific skill with its threshold
 */
function skillScoreToLevel(
  score: number, 
  skillType: 'decoding' | 'wordRecognition' | 'fluency' | 'comprehension'
): NBLevel {
  for (let i = NB_LEVEL_ORDER.length - 1; i >= 0; i--) {
    const level = NB_LEVEL_ORDER[i]
    const thresholds = NB_LEVELS[level].skillThresholds
    
    let threshold: number
    switch (skillType) {
      case 'decoding':
        threshold = thresholds.decodingMin
        break
      case 'wordRecognition':
        threshold = thresholds.wordRecognitionMin
        break
      case 'fluency':
        threshold = thresholds.fluencyMin
        break
      case 'comprehension':
        threshold = thresholds.comprehensionMin
        break
    }
    
    if (score >= threshold) {
      return level
    }
  }
  return 'NB-L0'
}

/**
 * Calculate placement level from reading profile
 */
export function calculatePlacement(input: PlacementInput): PlacementResult {
  const { learnerGroup, profile, previousLevel } = input
  const weights = SKILL_WEIGHTS[learnerGroup]
  
  // Determine level for each skill
  const skillLevels = {
    decoding: skillScoreToLevel(profile.decoding.score, 'decoding'),
    wordRecognition: skillScoreToLevel(profile.wordRecognition.score, 'wordRecognition'),
    fluency: skillScoreToLevel(profile.fluency.score, 'fluency'),
    comprehension: skillScoreToLevel(profile.comprehension.score, 'comprehension'),
  }
  
  // Calculate weighted average of skill levels
  const skillNumericLevels = {
    decoding: NB_LEVELS[skillLevels.decoding].numericValue,
    wordRecognition: NB_LEVELS[skillLevels.wordRecognition].numericValue,
    fluency: NB_LEVELS[skillLevels.fluency].numericValue,
    comprehension: NB_LEVELS[skillLevels.comprehension].numericValue,
  }
  
  const weightedSum = 
    skillNumericLevels.decoding * weights.decoding +
    skillNumericLevels.wordRecognition * weights.wordRecognition +
    skillNumericLevels.fluency * weights.fluency +
    skillNumericLevels.comprehension * weights.comprehension
  
  // Floor the weighted sum to be conservative (don't over-place)
  const rawLevel = Math.floor(weightedSum)
  
  // Apply the "lowest skill anchor" rule: never place more than 1 level above lowest skill
  const lowestSkillLevel = Math.min(
    skillNumericLevels.decoding,
    skillNumericLevels.wordRecognition,
    skillNumericLevels.fluency,
    skillNumericLevels.comprehension
  )
  
  const maxAllowedLevel = lowestSkillLevel + 1
  const finalLevelNumeric = Math.min(rawLevel, maxAllowedLevel)
  const level = getNBLevelByValue(finalLevelNumeric)
  
  // Find limiting and strongest skills
  const skillEntries = Object.entries(skillNumericLevels) as [string, number][]
  const sortedByLevel = [...skillEntries].sort((a, b) => a[1] - b[1])
  
  const lowestValue = sortedByLevel[0][1]
  const highestValue = sortedByLevel[sortedByLevel.length - 1][1]
  
  const limitingSkills = sortedByLevel
    .filter(([, v]) => v === lowestValue)
    .map(([k]) => formatSkillName(k))
  
  const strongestSkills = sortedByLevel
    .filter(([, v]) => v === highestValue)
    .map(([k]) => formatSkillName(k))
  
  // Generate recommended focus based on gaps
  const recommendedFocus = generateRecommendedFocus(skillNumericLevels, learnerGroup)
  
  // Calculate level change if previous level provided
  let levelChange: PlacementResult['levelChange']
  if (previousLevel) {
    const prevNumeric = NB_LEVELS[previousLevel].numericValue
    const diff = finalLevelNumeric - prevNumeric
    levelChange = {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
      steps: Math.abs(diff),
    }
  }
  
  // Generate explanation
  const explanation = generatePlacementExplanation({
    level,
    levelNumeric: finalLevelNumeric,
    skillLevels,
    limitingSkills,
    learnerGroup,
    rawLevel,
    wasAnchored: rawLevel > maxAllowedLevel,
  })
  
  return {
    level,
    levelNumeric: finalLevelNumeric,
    confidence: profile.confidence,
    learnerGroup,
    skillLevels,
    limitingSkills,
    strongestSkills,
    recommendedFocus,
    levelChange,
    explanation,
    disclaimer: PLACEMENT_DISCLAIMER,
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatSkillName(key: string): string {
  switch (key) {
    case 'decoding': return 'Decoding'
    case 'wordRecognition': return 'Word Recognition'
    case 'fluency': return 'Fluency'
    case 'comprehension': return 'Comprehension'
    default: return key
  }
}

function generateRecommendedFocus(
  skillLevels: Record<string, number>,
  learnerGroup: LearnerGroup
): string[] {
  const focus: string[] = []
  const avgLevel = (
    skillLevels.decoding + 
    skillLevels.wordRecognition + 
    skillLevels.fluency + 
    skillLevels.comprehension
  ) / 4
  
  // Identify skills significantly below average
  if (skillLevels.decoding < avgLevel - 0.5) {
    focus.push('Phonics and decoding practice')
  }
  if (skillLevels.wordRecognition < avgLevel - 0.5) {
    focus.push('Sight word recognition')
  }
  if (skillLevels.fluency < avgLevel - 0.5) {
    focus.push('Reading fluency and expression')
  }
  if (skillLevels.comprehension < avgLevel - 0.5) {
    focus.push('Reading comprehension strategies')
  }
  
  // Age-specific recommendations
  const groupConfig = LEARNER_GROUPS[learnerGroup]
  if (learnerGroup === 'adult' && focus.length === 0) {
    focus.push('Practical reading applications')
  }
  if (learnerGroup === 'children' && skillLevels.fluency < 3) {
    focus.push('Repeated reading practice')
  }
  
  // Default if no specific gaps
  if (focus.length === 0) {
    focus.push('Continue building on strengths')
  }
  
  return focus
}

interface ExplanationParams {
  level: NBLevel
  levelNumeric: number
  skillLevels: Record<string, NBLevel>
  limitingSkills: string[]
  learnerGroup: LearnerGroup
  rawLevel: number
  wasAnchored: boolean
}

function generatePlacementExplanation(params: ExplanationParams): string {
  const { level, skillLevels, limitingSkills, wasAnchored, learnerGroup } = params
  const levelConfig = NB_LEVELS[level]
  const groupConfig = LEARNER_GROUPS[learnerGroup]
  
  let explanation = `Placement at ${levelConfig.label} (${level}) `
  
  if (wasAnchored) {
    explanation += `was adjusted to ensure ${limitingSkills.join(' and ')} skills are supported. `
  } else {
    explanation += `is based on a weighted combination of all skill areas. `
  }
  
  explanation += `This starting point focuses on: ${levelConfig.skillFocus.slice(0, 2).join(', ')}. `
  explanation += `Content will be adapted for ${groupConfig.label.toLowerCase()} (${groupConfig.ageRange}).`
  
  return explanation
}

// ============================================================================
// QUICK PLACEMENT (from single scores without full profile)
// ============================================================================

export interface QuickPlacementInput {
  learnerGroup: LearnerGroup
  decodingScore: number // 0-100
  wordRecognitionScore: number // 0-100
  fluencyScore: number // 0-100 or WCPM
  comprehensionScore: number // 0-100
  confidence?: ConfidenceLevel
}

/**
 * Quick placement from raw scores (useful for API/external integration)
 */
export function quickPlacement(input: QuickPlacementInput): PlacementResult {
  // Build a minimal profile from scores
  const profile: ReadingProfile = {
    decoding: {
      score: input.decodingScore,
      band: scoreToBand(input.decodingScore),
      itemsAssessed: 20,
      minItemsRequired: 15,
    },
    wordRecognition: {
      score: input.wordRecognitionScore,
      band: scoreToBand(input.wordRecognitionScore),
      itemsAssessed: 20,
      minItemsRequired: 20,
    },
    fluency: {
      score: input.fluencyScore,
      band: scoreToBand(input.fluencyScore),
      itemsAssessed: 100,
      minItemsRequired: 50,
    },
    comprehension: {
      score: input.comprehensionScore,
      band: scoreToBand(input.comprehensionScore),
      itemsAssessed: 8,
      minItemsRequired: 6,
    },
    overallBand: 'elementary',
    confidence: input.confidence || 'medium',
    strengths: [],
    needs: [],
    suggestedFocus: '',
  }
  
  return calculatePlacement({
    learnerGroup: input.learnerGroup,
    profile,
  })
}

function scoreToBand(score: number): 'beginner' | 'elementary' | 'intermediate' | 'advanced' {
  if (score >= 85) return 'advanced'
  if (score >= 65) return 'intermediate'
  if (score >= 40) return 'elementary'
  return 'beginner'
}
