/**
 * NeuroBreath Placement Level System
 * 
 * Internal reading levels (NB-L0 through NB-L8) for placement into 
 * lessons and practice activities. NOT a diagnostic tool.
 * 
 * These are NeuroBreath-internal indices and should NOT be compared 
 * to standardized assessments or national norms.
 */

// ============================================================================
// LEARNER AGE GROUPS
// ============================================================================

export type LearnerGroup = 'children' | 'youth' | 'adolescence' | 'adult'

export interface LearnerGroupConfig {
  id: LearnerGroup
  label: string
  ageRange: string
  description: string
  contentTone: string
  /** Topics/themes appropriate for this group */
  topicTags: string[]
  /** UI color theme */
  color: string
}

export const LEARNER_GROUPS: Record<LearnerGroup, LearnerGroupConfig> = {
  children: {
    id: 'children',
    label: 'Children',
    ageRange: '6–10',
    description: 'Primary school age learners',
    contentTone: 'playful, encouraging, simple language',
    topicTags: ['animals', 'adventure', 'fantasy', 'nature', 'school', 'family'],
    color: 'emerald',
  },
  youth: {
    id: 'youth',
    label: 'Youth',
    ageRange: '11–13',
    description: 'Upper primary / early secondary learners',
    contentTone: 'friendly, age-appropriate, relatable',
    topicTags: ['sports', 'technology', 'music', 'animals', 'science', 'mystery'],
    color: 'blue',
  },
  adolescence: {
    id: 'adolescence',
    label: 'Adolescence',
    ageRange: '14–17',
    description: 'Secondary school learners',
    contentTone: 'respectful, mature, relevant to teen life',
    topicTags: ['current-events', 'careers', 'relationships', 'sports', 'science', 'social-issues'],
    color: 'violet',
  },
  adult: {
    id: 'adult',
    label: 'Adult',
    ageRange: '18+',
    description: 'Adult learners',
    contentTone: 'professional, practical, dignity-preserving',
    topicTags: ['work', 'finance', 'health', 'news', 'life-skills', 'community'],
    color: 'slate',
  },
}

export const LEARNER_GROUP_ORDER: LearnerGroup[] = ['children', 'youth', 'adolescence', 'adult']

// ============================================================================
// NB LEVEL SCALE (NB-L0 through NB-L8)
// ============================================================================

export type NBLevel = 'NB-L0' | 'NB-L1' | 'NB-L2' | 'NB-L3' | 'NB-L4' | 'NB-L5' | 'NB-L6' | 'NB-L7' | 'NB-L8'

export interface NBLevelConfig {
  id: NBLevel
  numericValue: number // 0-8 for calculations
  label: string
  shortLabel: string
  description: string
  /** Skills/concepts at this level */
  skillFocus: string[]
  /** Example lesson types */
  lessonTypes: string[]
  /** Thresholds for placement (see PlacementRubric) */
  skillThresholds: {
    decodingMin: number
    wordRecognitionMin: number
    fluencyMin: number // WCPM or score
    comprehensionMin: number
  }
  /** Color for UI */
  color: string
  bgColor: string
}

export const NB_LEVELS: Record<NBLevel, NBLevelConfig> = {
  'NB-L0': {
    id: 'NB-L0',
    numericValue: 0,
    label: 'Foundations',
    shortLabel: 'L0',
    description: 'Letter-sound foundations, pre-reading skills',
    skillFocus: [
      'Letter recognition',
      'Sound-symbol correspondence',
      'Phonemic awareness',
      'Print concepts',
    ],
    lessonTypes: [
      'Letter sounds',
      'Rhyme recognition',
      'Initial sound matching',
      'Environmental print',
    ],
    skillThresholds: {
      decodingMin: 0,
      wordRecognitionMin: 0,
      fluencyMin: 0,
      comprehensionMin: 0,
    },
    color: 'text-stone-700 dark:text-stone-300',
    bgColor: 'bg-stone-100 dark:bg-stone-800/50',
  },
  'NB-L1': {
    id: 'NB-L1',
    numericValue: 1,
    label: 'CVC Decoding',
    shortLabel: 'L1',
    description: 'CVC decoding + high-frequency words',
    skillFocus: [
      'CVC word decoding (cat, sit, hop)',
      'High-frequency sight words (the, is, a)',
      'Simple blending',
      'Word-by-word reading',
    ],
    lessonTypes: [
      'CVC word families',
      'Blending practice',
      'Sight word flashcards',
      'Decodable sentences',
    ],
    skillThresholds: {
      decodingMin: 20,
      wordRecognitionMin: 15,
      fluencyMin: 10,
      comprehensionMin: 20,
    },
    color: 'text-lime-700 dark:text-lime-300',
    bgColor: 'bg-lime-100 dark:bg-lime-800/50',
  },
  'NB-L2': {
    id: 'NB-L2',
    numericValue: 2,
    label: 'Consonant Blends',
    shortLabel: 'L2',
    description: 'CVCC/CCVC patterns + simple sentences',
    skillFocus: [
      'Initial blends (bl, cr, st)',
      'Final blends (nd, mp, sk)',
      'Digraphs (sh, ch, th)',
      'Simple sentence reading',
    ],
    lessonTypes: [
      'Blend sorting',
      'Digraph practice',
      'Sentence fluency',
      'Expanded sight words',
    ],
    skillThresholds: {
      decodingMin: 35,
      wordRecognitionMin: 30,
      fluencyMin: 25,
      comprehensionMin: 30,
    },
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-800/50',
  },
  'NB-L3': {
    id: 'NB-L3',
    numericValue: 3,
    label: 'Vowel Teams',
    shortLabel: 'L3',
    description: 'Vowel teams, silent-e, longer sentences',
    skillFocus: [
      'Vowel teams (ea, ai, oa, ee)',
      'Silent-e patterns',
      'R-controlled vowels',
      'Multi-sentence passages',
    ],
    lessonTypes: [
      'Vowel team sorts',
      'Silent-e words',
      'Fluency phrases',
      'Short paragraph reading',
    ],
    skillThresholds: {
      decodingMin: 50,
      wordRecognitionMin: 45,
      fluencyMin: 40,
      comprehensionMin: 40,
    },
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-100 dark:bg-teal-800/50',
  },
  'NB-L4': {
    id: 'NB-L4',
    numericValue: 4,
    label: 'Multisyllable',
    shortLabel: 'L4',
    description: 'Multisyllable decoding + basic morphology',
    skillFocus: [
      'Syllable division',
      'Common prefixes (un-, re-)',
      'Common suffixes (-ing, -ed, -er)',
      'Compound words',
    ],
    lessonTypes: [
      'Syllable splitting',
      'Prefix/suffix cards',
      'Compound word building',
      'Paragraph fluency',
    ],
    skillThresholds: {
      decodingMin: 60,
      wordRecognitionMin: 55,
      fluencyMin: 55,
      comprehensionMin: 50,
    },
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'bg-cyan-100 dark:bg-cyan-800/50',
  },
  'NB-L5': {
    id: 'NB-L5',
    numericValue: 5,
    label: 'Morphology & Fluency',
    shortLabel: 'L5',
    description: 'Morphology, irregular words, paragraph fluency',
    skillFocus: [
      'Advanced morphology',
      'Irregular high-frequency words',
      'Connected text fluency',
      'Expression and phrasing',
    ],
    lessonTypes: [
      'Root word study',
      'Irregular word patterns',
      'Repeated reading',
      'Prosody practice',
    ],
    skillThresholds: {
      decodingMin: 70,
      wordRecognitionMin: 65,
      fluencyMin: 70,
      comprehensionMin: 60,
    },
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-800/50',
  },
  'NB-L6': {
    id: 'NB-L6',
    numericValue: 6,
    label: 'Complex Text',
    shortLabel: 'L6',
    description: 'Complex syntax, vocabulary-in-context, inference',
    skillFocus: [
      'Complex sentence structures',
      'Vocabulary from context',
      'Making inferences',
      'Text structure awareness',
    ],
    lessonTypes: [
      'Sentence parsing',
      'Context clue strategies',
      'Inference practice',
      'Expository text',
    ],
    skillThresholds: {
      decodingMin: 80,
      wordRecognitionMin: 75,
      fluencyMin: 85,
      comprehensionMin: 70,
    },
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-100 dark:bg-indigo-800/50',
  },
  'NB-L7': {
    id: 'NB-L7',
    numericValue: 7,
    label: 'Academic Language',
    shortLabel: 'L7',
    description: 'Academic language, summarising, analysis',
    skillFocus: [
      'Academic vocabulary',
      'Summarizing main ideas',
      'Critical analysis',
      'Multi-paragraph fluency',
    ],
    lessonTypes: [
      'Academic word lists',
      'Summary writing',
      'Critical reading',
      'Extended passages',
    ],
    skillThresholds: {
      decodingMin: 88,
      wordRecognitionMin: 85,
      fluencyMin: 100,
      comprehensionMin: 80,
    },
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-800/50',
  },
  'NB-L8': {
    id: 'NB-L8',
    numericValue: 8,
    label: 'Advanced',
    shortLabel: 'L8',
    description: 'Advanced comprehension, efficient fluency, synthesis',
    skillFocus: [
      'Advanced comprehension strategies',
      'Efficient silent reading',
      'Synthesis across texts',
      'Metacognitive monitoring',
    ],
    lessonTypes: [
      'Strategy instruction',
      'Challenging texts',
      'Cross-text comparison',
      'Self-monitoring practice',
    ],
    skillThresholds: {
      decodingMin: 94,
      wordRecognitionMin: 92,
      fluencyMin: 120,
      comprehensionMin: 90,
    },
    color: 'text-fuchsia-700 dark:text-fuchsia-300',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-800/50',
  },
}

export const NB_LEVEL_ORDER: NBLevel[] = [
  'NB-L0', 'NB-L1', 'NB-L2', 'NB-L3', 'NB-L4', 
  'NB-L5', 'NB-L6', 'NB-L7', 'NB-L8'
]

// ============================================================================
// LEGACY BAND TO NB LEVEL MAPPING
// ============================================================================

/**
 * Map old 4-band system to new NB levels (approximate)
 * Used for backward compatibility with existing data
 */
export function legacyBandToNBLevel(band: string): NBLevel {
  switch (band) {
    case 'beginner':
      return 'NB-L1'
    case 'elementary':
      return 'NB-L3'
    case 'intermediate':
      return 'NB-L5'
    case 'advanced':
      return 'NB-L7'
    default:
      return 'NB-L1'
  }
}

/**
 * Map NB level to legacy band for backward compatibility
 */
export function nbLevelToLegacyBand(level: NBLevel): string {
  const numericValue = NB_LEVELS[level].numericValue
  if (numericValue <= 1) return 'beginner'
  if (numericValue <= 3) return 'elementary'
  if (numericValue <= 5) return 'intermediate'
  return 'advanced'
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get NBLevel by numeric value (0-8)
 */
export function getNBLevelByValue(value: number): NBLevel {
  const clamped = Math.max(0, Math.min(8, Math.round(value)))
  return NB_LEVEL_ORDER[clamped]
}

/**
 * Get the next level (for progression)
 */
export function getNextLevel(current: NBLevel): NBLevel | null {
  const idx = NB_LEVEL_ORDER.indexOf(current)
  if (idx < NB_LEVEL_ORDER.length - 1) {
    return NB_LEVEL_ORDER[idx + 1]
  }
  return null
}

/**
 * Get the previous level (for regression/review)
 */
export function getPreviousLevel(current: NBLevel): NBLevel | null {
  const idx = NB_LEVEL_ORDER.indexOf(current)
  if (idx > 0) {
    return NB_LEVEL_ORDER[idx - 1]
  }
  return null
}

/**
 * Check if level A is higher than level B
 */
export function isHigherLevel(a: NBLevel, b: NBLevel): boolean {
  return NB_LEVELS[a].numericValue > NB_LEVELS[b].numericValue
}

/**
 * Get display color class for a learner group
 */
export function getLearnerGroupColorClass(group: LearnerGroup): string {
  const config = LEARNER_GROUPS[group]
  return `text-${config.color}-600 dark:text-${config.color}-400`
}

// ============================================================================
// DISCLAIMERS
// ============================================================================

export const PLACEMENT_DISCLAIMER = `This placement is for training purposes only and indicates a suggested starting point 
within NeuroBreath's lesson library. It is NOT a diagnostic assessment and should not be compared to standardized 
grade levels, reading ages, or national percentiles. For formal evaluation of reading difficulties, please consult 
a qualified educational professional.`

export const SHORT_PLACEMENT_DISCLAIMER = 'Training placement only. Not a diagnosis or grade-level equivalence.'
