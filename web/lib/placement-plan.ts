/**
 * NeuroBreath Placement Plan Generator
 * 
 * Creates actionable 2-4 week training plans based on placement results.
 * NOT a diagnostic tool - training placement only.
 */

import type { PlacementResult } from './placement-rubric'
import { 
  NBLevel, 
  NB_LEVELS,
  LearnerGroup,
  LEARNER_GROUPS,
  getNextLevel,
  PLACEMENT_DISCLAIMER,
} from './placement-levels'

// ============================================================================
// TYPES
// ============================================================================

export interface LessonReference {
  slug: string
  title: string
  skillFocus: string[]
  durationMinutes: number
  lessonType: 'lesson' | 'practice' | 'game' | 'worksheet'
}

export interface DailyPractice {
  dayNumber: number
  dayLabel: string // "Day 1", "Monday", etc.
  totalMinutes: number
  activities: {
    lesson: LessonReference
    order: number
    isRequired: boolean
    estimatedMinutes: number
  }[]
  focusArea: string
}

export interface WeeklyGoal {
  weekNumber: number
  goalDescription: string
  targetSkills: string[]
  lessonsToComplete: string[] // slugs
  milestones: string[]
}

export interface PlacementPlan {
  // Core placement info
  level: NBLevel
  levelLabel: string
  levelDescription: string
  learnerGroup: LearnerGroup
  learnerGroupLabel: string
  
  // Confidence and caveats
  confidence: string
  disclaimer: string
  
  // Recommended starting lesson
  startingLesson: LessonReference | null
  
  // Full lesson path for this level
  lessonPath: LessonReference[]
  
  // Daily practice structure (first week as example)
  dailyPractice: DailyPractice[]
  
  // Weekly goals for 4-week plan
  weeklyGoals: WeeklyGoal[]
  
  // Practice recommendations
  recommendedMinutesPerDay: number
  recommendedDaysPerWeek: number
  totalWeeks: number
  
  // Skills to focus on
  primaryFocus: string[]
  secondaryFocus: string[]
  
  // When ready to reassess
  reassessAfterWeeks: number
  reassessmentCriteria: string[]
  
  // Generated timestamp
  generatedAt: string
}

// ============================================================================
// LESSON CATALOG (In-memory seed until DB is populated)
// ============================================================================

const LESSON_CATALOG: Record<NBLevel, LessonReference[]> = {
  'NB-L0': [
    { slug: 'letter-sounds-intro', title: 'Letter Sounds Introduction', skillFocus: ['decoding'], durationMinutes: 10, lessonType: 'lesson' },
    { slug: 'letter-matching-game', title: 'Letter Matching Game', skillFocus: ['decoding'], durationMinutes: 8, lessonType: 'game' },
    { slug: 'phonemic-awareness-1', title: 'Hearing Sounds in Words', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'rhyme-time', title: 'Rhyme Time', skillFocus: ['decoding'], durationMinutes: 10, lessonType: 'practice' },
    { slug: 'print-concepts', title: 'How Books Work', skillFocus: ['fluency'], durationMinutes: 8, lessonType: 'lesson' },
  ],
  'NB-L1': [
    { slug: 'cvc-words-1', title: 'CVC Words: Short A', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'cvc-words-2', title: 'CVC Words: Short I', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'cvc-blending', title: 'Blending CVC Words', skillFocus: ['decoding', 'fluency'], durationMinutes: 10, lessonType: 'practice' },
    { slug: 'sight-words-1', title: 'Sight Words: Set 1', skillFocus: ['word-recognition'], durationMinutes: 10, lessonType: 'lesson' },
    { slug: 'decodable-sentences-1', title: 'Reading Simple Sentences', skillFocus: ['fluency'], durationMinutes: 15, lessonType: 'practice' },
  ],
  'NB-L2': [
    { slug: 'blends-initial', title: 'Initial Blends (bl, cr, st)', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'blends-final', title: 'Final Blends (nd, mp, sk)', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'digraphs-1', title: 'Digraphs: sh, ch, th', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'sight-words-2', title: 'Sight Words: Set 2', skillFocus: ['word-recognition'], durationMinutes: 10, lessonType: 'lesson' },
    { slug: 'sentence-fluency-1', title: 'Sentence Fluency Practice', skillFocus: ['fluency'], durationMinutes: 15, lessonType: 'practice' },
  ],
  'NB-L3': [
    { slug: 'vowel-teams-1', title: 'Vowel Teams: ea, ee', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'vowel-teams-2', title: 'Vowel Teams: ai, oa', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'silent-e', title: 'Silent-E Magic', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'r-controlled', title: 'R-Controlled Vowels', skillFocus: ['decoding'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'paragraph-reading-1', title: 'Reading Short Paragraphs', skillFocus: ['fluency', 'comprehension'], durationMinutes: 15, lessonType: 'practice' },
  ],
  'NB-L4': [
    { slug: 'syllable-division', title: 'Breaking Words into Syllables', skillFocus: ['decoding'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'prefixes-1', title: 'Common Prefixes: un-, re-', skillFocus: ['decoding', 'word-recognition'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'suffixes-1', title: 'Common Suffixes: -ing, -ed, -er', skillFocus: ['decoding', 'word-recognition'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'compound-words', title: 'Compound Words', skillFocus: ['word-recognition'], durationMinutes: 10, lessonType: 'lesson' },
    { slug: 'paragraph-fluency', title: 'Paragraph Fluency Practice', skillFocus: ['fluency'], durationMinutes: 15, lessonType: 'practice' },
  ],
  'NB-L5': [
    { slug: 'morphology-roots', title: 'Word Roots', skillFocus: ['decoding', 'word-recognition'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'irregular-words', title: 'Tricky Irregular Words', skillFocus: ['word-recognition'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'repeated-reading', title: 'Repeated Reading for Fluency', skillFocus: ['fluency'], durationMinutes: 15, lessonType: 'practice' },
    { slug: 'prosody-practice', title: 'Reading with Expression', skillFocus: ['fluency'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'comprehension-basics', title: 'Understanding What You Read', skillFocus: ['comprehension'], durationMinutes: 15, lessonType: 'lesson' },
  ],
  'NB-L6': [
    { slug: 'complex-sentences', title: 'Complex Sentence Structures', skillFocus: ['fluency', 'comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'context-clues', title: 'Vocabulary from Context', skillFocus: ['word-recognition', 'comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'making-inferences', title: 'Reading Between the Lines', skillFocus: ['comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'text-structure', title: 'Understanding Text Structure', skillFocus: ['comprehension'], durationMinutes: 12, lessonType: 'lesson' },
    { slug: 'expository-reading', title: 'Reading Informational Text', skillFocus: ['fluency', 'comprehension'], durationMinutes: 15, lessonType: 'practice' },
  ],
  'NB-L7': [
    { slug: 'academic-vocabulary', title: 'Academic Word Study', skillFocus: ['word-recognition', 'comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'summarizing', title: 'Summarizing Main Ideas', skillFocus: ['comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'critical-reading', title: 'Critical Reading Skills', skillFocus: ['comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'extended-passages', title: 'Extended Passage Practice', skillFocus: ['fluency', 'comprehension'], durationMinutes: 20, lessonType: 'practice' },
    { slug: 'synthesis-practice', title: 'Connecting Ideas Across Texts', skillFocus: ['comprehension'], durationMinutes: 15, lessonType: 'lesson' },
  ],
  'NB-L8': [
    { slug: 'advanced-strategies', title: 'Advanced Comprehension Strategies', skillFocus: ['comprehension'], durationMinutes: 20, lessonType: 'lesson' },
    { slug: 'efficient-reading', title: 'Efficient Silent Reading', skillFocus: ['fluency'], durationMinutes: 15, lessonType: 'practice' },
    { slug: 'cross-text-analysis', title: 'Cross-Text Comparison', skillFocus: ['comprehension'], durationMinutes: 20, lessonType: 'lesson' },
    { slug: 'metacognition', title: 'Thinking About Your Reading', skillFocus: ['comprehension'], durationMinutes: 15, lessonType: 'lesson' },
    { slug: 'challenging-texts', title: 'Challenging Text Practice', skillFocus: ['fluency', 'comprehension'], durationMinutes: 20, lessonType: 'practice' },
  ],
}

// ============================================================================
// PLAN GENERATION
// ============================================================================

/**
 * Generate a complete placement plan from placement result
 */
export function generatePlacementPlan(placement: PlacementResult): PlacementPlan {
  const levelConfig = NB_LEVELS[placement.level]
  const groupConfig = LEARNER_GROUPS[placement.learnerGroup]
  
  // Get lessons for this level
  const lessonPath = LESSON_CATALOG[placement.level] || []
  const startingLesson = lessonPath[0] || null
  
  // Calculate practice time based on age group
  const practiceConfig = getPracticeConfig(placement.learnerGroup)
  
  // Generate daily practice schedule for first week
  const dailyPractice = generateDailyPractice(lessonPath, practiceConfig)
  
  // Generate 4-week goals
  const weeklyGoals = generateWeeklyGoals(placement, lessonPath)
  
  return {
    level: placement.level,
    levelLabel: levelConfig.label,
    levelDescription: levelConfig.description,
    learnerGroup: placement.learnerGroup,
    learnerGroupLabel: groupConfig.label,
    
    confidence: placement.confidence,
    disclaimer: PLACEMENT_DISCLAIMER,
    
    startingLesson,
    lessonPath,
    dailyPractice,
    weeklyGoals,
    
    recommendedMinutesPerDay: practiceConfig.minutesPerDay,
    recommendedDaysPerWeek: practiceConfig.daysPerWeek,
    totalWeeks: 4,
    
    primaryFocus: placement.limitingSkills.length > 0 
      ? placement.recommendedFocus 
      : levelConfig.skillFocus.slice(0, 2),
    secondaryFocus: levelConfig.skillFocus.slice(2),
    
    reassessAfterWeeks: 4,
    reassessmentCriteria: [
      'Complete at least 80% of recommended lessons',
      'Practice at least 3 days per week',
      'Finish weekly milestones',
    ],
    
    generatedAt: new Date().toISOString(),
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

interface PracticeConfig {
  minutesPerDay: number
  daysPerWeek: number
  sessionsPerDay: number
}

function getPracticeConfig(group: LearnerGroup): PracticeConfig {
  switch (group) {
    case 'children':
      return { minutesPerDay: 15, daysPerWeek: 5, sessionsPerDay: 1 }
    case 'youth':
      return { minutesPerDay: 20, daysPerWeek: 5, sessionsPerDay: 1 }
    case 'adolescence':
      return { minutesPerDay: 25, daysPerWeek: 4, sessionsPerDay: 1 }
    case 'adult':
      return { minutesPerDay: 30, daysPerWeek: 4, sessionsPerDay: 1 }
    default:
      return { minutesPerDay: 20, daysPerWeek: 5, sessionsPerDay: 1 }
  }
}

function generateDailyPractice(
  lessons: LessonReference[], 
  config: PracticeConfig
): DailyPractice[] {
  const days: DailyPractice[] = []
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  
  let lessonIndex = 0
  
  for (let i = 0; i < config.daysPerWeek; i++) {
    const dayActivities: DailyPractice['activities'] = []
    let totalMinutes = 0
    let order = 1
    
    // Add lessons until we hit the daily target
    while (totalMinutes < config.minutesPerDay && lessonIndex < lessons.length) {
      const lesson = lessons[lessonIndex]
      
      if (totalMinutes + lesson.durationMinutes <= config.minutesPerDay + 5) {
        dayActivities.push({
          lesson,
          order,
          isRequired: order === 1,
          estimatedMinutes: lesson.durationMinutes,
        })
        totalMinutes += lesson.durationMinutes
        order++
        lessonIndex++
      } else {
        break
      }
    }
    
    // If we've run out of lessons, loop back
    if (lessonIndex >= lessons.length) {
      lessonIndex = 0
    }
    
    days.push({
      dayNumber: i + 1,
      dayLabel: dayLabels[i] || `Day ${i + 1}`,
      totalMinutes,
      activities: dayActivities,
      focusArea: dayActivities[0]?.lesson.skillFocus[0] || 'mixed practice',
    })
  }
  
  return days
}

function generateWeeklyGoals(
  placement: PlacementResult,
  lessons: LessonReference[]
): WeeklyGoal[] {
  const levelConfig = NB_LEVELS[placement.level]
  const nextLevel = getNextLevel(placement.level)
  
  const goals: WeeklyGoal[] = [
    {
      weekNumber: 1,
      goalDescription: `Build foundations in ${levelConfig.label}`,
      targetSkills: levelConfig.skillFocus.slice(0, 2),
      lessonsToComplete: lessons.slice(0, 3).map(l => l.slug),
      milestones: [
        'Complete initial placement assessment',
        'Finish first 2-3 lessons',
        'Establish daily practice routine',
      ],
    },
    {
      weekNumber: 2,
      goalDescription: `Strengthen core skills at ${levelConfig.label}`,
      targetSkills: levelConfig.skillFocus,
      lessonsToComplete: lessons.slice(2, 5).map(l => l.slug),
      milestones: [
        'Complete middle lessons',
        'Practice review activities',
        'Track progress in skill areas',
      ],
    },
    {
      weekNumber: 3,
      goalDescription: `Practice and consolidate ${levelConfig.label} skills`,
      targetSkills: placement.limitingSkills.length > 0 
        ? placement.limitingSkills.map(s => s.toLowerCase().replace(' ', '-'))
        : levelConfig.skillFocus,
      lessonsToComplete: lessons.slice(3, lessons.length).map(l => l.slug),
      milestones: [
        'Complete remaining core lessons',
        'Review challenging areas',
        'Prepare for progress check',
      ],
    },
    {
      weekNumber: 4,
      goalDescription: nextLevel 
        ? `Prepare for transition to ${NB_LEVELS[nextLevel].label}`
        : `Master ${levelConfig.label} skills`,
      targetSkills: levelConfig.skillFocus,
      lessonsToComplete: lessons.map(l => l.slug),
      milestones: [
        'Complete all level lessons',
        'Take progress reassessment',
        nextLevel ? `Ready for ${nextLevel}` : 'Continue advanced practice',
      ],
    },
  ]
  
  return goals
}

// ============================================================================
// EXPORTS
// ============================================================================

export { LESSON_CATALOG }
