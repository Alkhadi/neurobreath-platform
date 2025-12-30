/**
 * Unit tests for the Placement Plan Generator
 * 
 * Run with: node --import=tsx lib/__tests__/placement-plan.test.ts
 */

import { strict as assert } from 'assert'
import { 
  generatePlacementPlan,
  LESSON_CATALOG,
} from '../placement-plan'
import type { PlacementResult } from '../placement-rubric'
import { 
  NB_LEVELS, 
  NB_LEVEL_ORDER,
  LearnerGroup,
} from '../placement-levels'

// ============================================================================
// TEST HELPERS
// ============================================================================

function createMockPlacement(overrides: Partial<PlacementResult> = {}): PlacementResult {
  return {
    level: 'NB-L3',
    levelNumeric: 3,
    confidence: 'high',
    learnerGroup: 'youth',
    skillLevels: {
      decoding: 'NB-L3',
      wordRecognition: 'NB-L3',
      fluency: 'NB-L3',
      comprehension: 'NB-L2',
    },
    limitingSkills: ['Comprehension'],
    strongestSkills: ['Decoding', 'Word Recognition', 'Fluency'],
    recommendedFocus: ['Reading comprehension strategies'],
    explanation: 'Mock placement for testing',
    disclaimer: 'This is a training placement only.',
    ...overrides,
  }
}

let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    passed++
    console.log(`✓ ${name}`)
  } catch (err) {
    failed++
    console.error(`✗ ${name}`)
    console.error(`  ${err instanceof Error ? err.message : err}`)
  }
}

function describe(name: string, fn: () => void) {
  console.log(`\n${name}`)
  console.log('='.repeat(name.length))
  fn()
}

// ============================================================================
// TESTS: Lesson Catalog
// ============================================================================

describe('Lesson Catalog', () => {
  test('should have lessons for all NB levels', () => {
    for (const level of NB_LEVEL_ORDER) {
      const lessons = LESSON_CATALOG[level]
      assert.ok(lessons, `Missing lessons for ${level}`)
      assert.ok(lessons.length >= 3, `${level} should have at least 3 lessons, got ${lessons.length}`)
    }
  })
  
  test('each lesson should have required fields', () => {
    for (const level of NB_LEVEL_ORDER) {
      for (const lesson of LESSON_CATALOG[level]) {
        assert.ok(lesson.slug, `Lesson missing slug in ${level}`)
        assert.ok(lesson.title, `Lesson missing title in ${level}`)
        assert.ok(lesson.skillFocus.length > 0, `Lesson missing skillFocus in ${level}`)
        assert.ok(lesson.durationMinutes > 0, `Lesson missing duration in ${level}`)
        assert.ok(['lesson', 'practice', 'game', 'worksheet'].includes(lesson.lessonType))
      }
    }
  })
  
  test('lesson slugs should be unique within each level', () => {
    for (const level of NB_LEVEL_ORDER) {
      const slugs = LESSON_CATALOG[level].map(l => l.slug)
      const uniqueSlugs = new Set(slugs)
      assert.equal(slugs.length, uniqueSlugs.size, `Duplicate slugs found in ${level}`)
    }
  })
  
  test('total lessons should be at least 40', () => {
    let total = 0
    for (const level of NB_LEVEL_ORDER) {
      total += LESSON_CATALOG[level].length
    }
    assert.ok(total >= 40, `Expected at least 40 lessons, got ${total}`)
  })
})

// ============================================================================
// TESTS: Plan Generation - Basic Structure
// ============================================================================

describe('Plan Generation - Basic Structure', () => {
  test('should generate a plan with correct level info', () => {
    const placement = createMockPlacement({ level: 'NB-L4', levelNumeric: 4 })
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.level, 'NB-L4')
    assert.equal(plan.levelLabel, NB_LEVELS['NB-L4'].label)
    assert.ok(plan.levelDescription)
  })
  
  test('should include learner group info', () => {
    const placement = createMockPlacement({ learnerGroup: 'adult' })
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.learnerGroup, 'adult')
    assert.equal(plan.learnerGroupLabel, 'Adult')
  })
  
  test('should include starting lesson', () => {
    const placement = createMockPlacement({ level: 'NB-L2' })
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.startingLesson)
    assert.ok(plan.startingLesson!.slug)
    assert.ok(plan.startingLesson!.title)
  })
  
  test('should include lesson path for the level', () => {
    const placement = createMockPlacement({ level: 'NB-L3' })
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.lessonPath.length > 0)
    assert.deepEqual(plan.lessonPath, LESSON_CATALOG['NB-L3'])
  })
  
  test('should include disclaimer', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.disclaimer)
    assert.ok(plan.disclaimer.length > 0)
  })
  
  test('should include generated timestamp', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.generatedAt)
    const date = new Date(plan.generatedAt)
    assert.ok(!isNaN(date.getTime()), 'generatedAt should be a valid ISO date')
  })
})

// ============================================================================
// TESTS: Practice Configuration by Age Group
// ============================================================================

describe('Practice Configuration by Age Group', () => {
  const groups: LearnerGroup[] = ['children', 'youth', 'adolescence', 'adult']
  
  test('children should have shorter daily practice', () => {
    const placement = createMockPlacement({ learnerGroup: 'children' })
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.recommendedMinutesPerDay <= 20, 
      `Children should have ≤20 min/day, got ${plan.recommendedMinutesPerDay}`)
  })
  
  test('adults should have longer daily practice', () => {
    const placement = createMockPlacement({ learnerGroup: 'adult' })
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.recommendedMinutesPerDay >= 25, 
      `Adults should have ≥25 min/day, got ${plan.recommendedMinutesPerDay}`)
  })
  
  test('all groups should have reasonable practice days', () => {
    for (const group of groups) {
      const placement = createMockPlacement({ learnerGroup: group })
      const plan = generatePlacementPlan(placement)
      
      assert.ok(plan.recommendedDaysPerWeek >= 3, 
        `${group} should practice ≥3 days/week`)
      assert.ok(plan.recommendedDaysPerWeek <= 7, 
        `${group} should practice ≤7 days/week`)
    }
  })
  
  test('total weeks should be 4 for all groups', () => {
    for (const group of groups) {
      const placement = createMockPlacement({ learnerGroup: group })
      const plan = generatePlacementPlan(placement)
      
      assert.equal(plan.totalWeeks, 4, `${group} plan should be 4 weeks`)
    }
  })
})

// ============================================================================
// TESTS: Daily Practice Schedule
// ============================================================================

describe('Daily Practice Schedule', () => {
  test('should generate daily practice for the week', () => {
    const placement = createMockPlacement({ learnerGroup: 'youth' })
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.dailyPractice.length > 0)
    assert.ok(plan.dailyPractice.length <= 7)
  })
  
  test('each day should have activities', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    for (const day of plan.dailyPractice) {
      assert.ok(day.dayNumber > 0)
      assert.ok(day.dayLabel)
      assert.ok(day.activities.length > 0, `Day ${day.dayNumber} should have activities`)
      assert.ok(day.focusArea)
    }
  })
  
  test('daily time should not exceed target by too much', () => {
    const placement = createMockPlacement({ learnerGroup: 'children' })
    const plan = generatePlacementPlan(placement)
    
    for (const day of plan.dailyPractice) {
      // Allow 5 minutes over target
      const maxAllowed = plan.recommendedMinutesPerDay + 5
      assert.ok(day.totalMinutes <= maxAllowed, 
        `Day ${day.dayNumber} is ${day.totalMinutes} min, max ${maxAllowed}`)
    }
  })
  
  test('first activity each day should be required', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    for (const day of plan.dailyPractice) {
      if (day.activities.length > 0) {
        assert.ok(day.activities[0].isRequired, 
          `First activity on ${day.dayLabel} should be required`)
      }
    }
  })
})

// ============================================================================
// TESTS: Weekly Goals
// ============================================================================

describe('Weekly Goals', () => {
  test('should generate 4 weekly goals', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.weeklyGoals.length, 4)
  })
  
  test('each week should have required fields', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    for (const week of plan.weeklyGoals) {
      assert.ok(week.weekNumber >= 1 && week.weekNumber <= 4)
      assert.ok(week.goalDescription)
      assert.ok(week.targetSkills.length > 0)
      assert.ok(week.milestones.length > 0)
    }
  })
  
  test('week numbers should be sequential', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    for (let i = 0; i < plan.weeklyGoals.length; i++) {
      assert.equal(plan.weeklyGoals[i].weekNumber, i + 1)
    }
  })
  
  test('week 4 should mention reassessment', () => {
    const placement = createMockPlacement({ level: 'NB-L5' })
    const plan = generatePlacementPlan(placement)
    
    const week4 = plan.weeklyGoals[3]
    const hasReassess = week4.milestones.some(m => 
      m.toLowerCase().includes('reassess') || m.toLowerCase().includes('progress')
    )
    assert.ok(hasReassess, 'Week 4 should mention reassessment or progress check')
  })
})

// ============================================================================
// TESTS: Focus Areas
// ============================================================================

describe('Focus Areas', () => {
  test('should include primary focus skills', () => {
    const placement = createMockPlacement({
      limitingSkills: ['Decoding'],
      recommendedFocus: ['Phonics and decoding practice'],
    })
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.primaryFocus.length > 0)
  })
  
  test('should use level skillFocus if no limiting skills', () => {
    const placement = createMockPlacement({
      limitingSkills: [],
      recommendedFocus: [],
    })
    const plan = generatePlacementPlan(placement)
    
    const levelConfig = NB_LEVELS[placement.level]
    assert.ok(plan.primaryFocus.length > 0)
    // Primary focus should come from level's skillFocus
    assert.ok(plan.primaryFocus.length <= levelConfig.skillFocus.length)
  })
})

// ============================================================================
// TESTS: Reassessment Criteria
// ============================================================================

describe('Reassessment Criteria', () => {
  test('should set reassessment after 4 weeks', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.reassessAfterWeeks, 4)
  })
  
  test('should include reassessment criteria', () => {
    const placement = createMockPlacement()
    const plan = generatePlacementPlan(placement)
    
    assert.ok(plan.reassessmentCriteria.length > 0)
    assert.ok(plan.reassessmentCriteria.length >= 2, 'Should have at least 2 criteria')
  })
})

// ============================================================================
// TESTS: Edge Cases
// ============================================================================

describe('Edge Cases', () => {
  test('should handle NB-L0 placement', () => {
    const placement = createMockPlacement({ level: 'NB-L0', levelNumeric: 0 })
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.level, 'NB-L0')
    assert.ok(plan.lessonPath.length > 0)
    assert.ok(plan.weeklyGoals.length === 4)
  })
  
  test('should handle NB-L8 placement (highest level)', () => {
    const placement = createMockPlacement({ level: 'NB-L8', levelNumeric: 8 })
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.level, 'NB-L8')
    assert.ok(plan.lessonPath.length > 0)
    
    // Week 4 goal should handle no next level gracefully
    const week4 = plan.weeklyGoals[3]
    assert.ok(week4.goalDescription.includes('Master') || week4.goalDescription.includes('NB-L8'))
  })
  
  test('should handle all learner groups at all levels', () => {
    const groups: LearnerGroup[] = ['children', 'youth', 'adolescence', 'adult']
    
    for (const group of groups) {
      for (const level of NB_LEVEL_ORDER) {
        const placement = createMockPlacement({ 
          level, 
          levelNumeric: NB_LEVELS[level].numericValue,
          learnerGroup: group,
        })
        
        // Should not throw
        const plan = generatePlacementPlan(placement)
        assert.ok(plan.level === level)
        assert.ok(plan.learnerGroup === group)
      }
    }
  })
})

// ============================================================================
// TESTS: Integration with Placement Result
// ============================================================================

describe('Integration with Placement Result', () => {
  test('should preserve confidence from placement', () => {
    const placement = createMockPlacement({ confidence: 'low' })
    const plan = generatePlacementPlan(placement)
    
    assert.equal(plan.confidence, 'low')
  })
  
  test('should use recommended focus from placement', () => {
    const placement = createMockPlacement({
      limitingSkills: ['Fluency'],
      recommendedFocus: ['Reading fluency and expression', 'Repeated reading practice'],
    })
    const plan = generatePlacementPlan(placement)
    
    assert.deepEqual(plan.primaryFocus, placement.recommendedFocus)
  })
})

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(50))
console.log(`Tests: ${passed} passed, ${failed} failed`)
console.log('='.repeat(50))

if (failed > 0) {
  process.exit(1)
}
