/**
 * Unit tests for the Placement Rubric
 * 
 * Run with: npx tsx lib/__tests__/placement-rubric.test.ts
 */

import { strict as assert } from 'assert'
import { 
  calculatePlacement, 
  quickPlacement, 
  scoreToNBLevel 
} from '../placement-rubric'
import { 
  NB_LEVELS, 
  NB_LEVEL_ORDER,
  getNBLevelByValue,
  getNextLevel,
  getPreviousLevel,
  isHigherLevel,
  legacyBandToNBLevel,
  nbLevelToLegacyBand,
} from '../placement-levels'
import type { ReadingProfile } from '../reading-profile'

// ============================================================================
// TEST HELPERS
// ============================================================================

function createMockProfile(scores: {
  decoding: number
  wordRecognition: number
  fluency: number
  comprehension: number
}): ReadingProfile {
  return {
    decoding: {
      score: scores.decoding,
      band: scores.decoding >= 80 ? 'advanced' : scores.decoding >= 60 ? 'intermediate' : scores.decoding >= 40 ? 'elementary' : 'beginner',
      itemsAssessed: 20,
      minItemsRequired: 15,
    },
    wordRecognition: {
      score: scores.wordRecognition,
      band: scores.wordRecognition >= 80 ? 'advanced' : scores.wordRecognition >= 60 ? 'intermediate' : scores.wordRecognition >= 40 ? 'elementary' : 'beginner',
      itemsAssessed: 25,
      minItemsRequired: 20,
    },
    fluency: {
      score: scores.fluency,
      band: scores.fluency >= 80 ? 'advanced' : scores.fluency >= 60 ? 'intermediate' : scores.fluency >= 40 ? 'elementary' : 'beginner',
      itemsAssessed: 100,
      minItemsRequired: 50,
    },
    comprehension: {
      score: scores.comprehension,
      band: scores.comprehension >= 80 ? 'advanced' : scores.comprehension >= 60 ? 'intermediate' : scores.comprehension >= 40 ? 'elementary' : 'beginner',
      itemsAssessed: 8,
      minItemsRequired: 6,
    },
    overallBand: 'intermediate',
    confidence: 'high',
    strengths: [],
    needs: [],
    suggestedFocus: '',
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
// TESTS: NB Level Configuration
// ============================================================================

describe('NB Level Configuration', () => {
  test('should have 9 levels (NB-L0 through NB-L8)', () => {
    assert.equal(NB_LEVEL_ORDER.length, 9)
    assert.equal(NB_LEVEL_ORDER[0], 'NB-L0')
    assert.equal(NB_LEVEL_ORDER[8], 'NB-L8')
  })
  
  test('each level should have sequential numericValue', () => {
    NB_LEVEL_ORDER.forEach((level, idx) => {
      assert.equal(NB_LEVELS[level].numericValue, idx)
    })
  })
  
  test('skill thresholds should increase with level', () => {
    let prevDecoding = -1
    for (const level of NB_LEVEL_ORDER) {
      const threshold = NB_LEVELS[level].skillThresholds.decodingMin
      assert.ok(threshold >= prevDecoding, `${level} decoding threshold should be >= previous`)
      prevDecoding = threshold
    }
  })
})

// ============================================================================
// TESTS: Level Helper Functions
// ============================================================================

describe('Level Helper Functions', () => {
  test('getNBLevelByValue should return correct level', () => {
    assert.equal(getNBLevelByValue(0), 'NB-L0')
    assert.equal(getNBLevelByValue(4), 'NB-L4')
    assert.equal(getNBLevelByValue(8), 'NB-L8')
  })
  
  test('getNBLevelByValue should clamp out-of-range values', () => {
    assert.equal(getNBLevelByValue(-5), 'NB-L0')
    assert.equal(getNBLevelByValue(100), 'NB-L8')
  })
  
  test('getNextLevel should return next level or null', () => {
    assert.equal(getNextLevel('NB-L0'), 'NB-L1')
    assert.equal(getNextLevel('NB-L7'), 'NB-L8')
    assert.equal(getNextLevel('NB-L8'), null)
  })
  
  test('getPreviousLevel should return previous level or null', () => {
    assert.equal(getPreviousLevel('NB-L8'), 'NB-L7')
    assert.equal(getPreviousLevel('NB-L1'), 'NB-L0')
    assert.equal(getPreviousLevel('NB-L0'), null)
  })
  
  test('isHigherLevel should compare levels correctly', () => {
    assert.ok(isHigherLevel('NB-L5', 'NB-L3'))
    assert.ok(!isHigherLevel('NB-L2', 'NB-L4'))
    assert.ok(!isHigherLevel('NB-L3', 'NB-L3'))
  })
})

// ============================================================================
// TESTS: Legacy Band Mapping
// ============================================================================

describe('Legacy Band Mapping', () => {
  test('legacyBandToNBLevel should map correctly', () => {
    assert.equal(legacyBandToNBLevel('beginner'), 'NB-L1')
    assert.equal(legacyBandToNBLevel('elementary'), 'NB-L3')
    assert.equal(legacyBandToNBLevel('intermediate'), 'NB-L5')
    assert.equal(legacyBandToNBLevel('advanced'), 'NB-L7')
  })
  
  test('nbLevelToLegacyBand should map correctly', () => {
    assert.equal(nbLevelToLegacyBand('NB-L0'), 'beginner')
    assert.equal(nbLevelToLegacyBand('NB-L1'), 'beginner')
    assert.equal(nbLevelToLegacyBand('NB-L2'), 'elementary')
    assert.equal(nbLevelToLegacyBand('NB-L3'), 'elementary')
    assert.equal(nbLevelToLegacyBand('NB-L4'), 'intermediate')
    assert.equal(nbLevelToLegacyBand('NB-L5'), 'intermediate')
    assert.equal(nbLevelToLegacyBand('NB-L6'), 'advanced')
    assert.equal(nbLevelToLegacyBand('NB-L8'), 'advanced')
  })
})

// ============================================================================
// TESTS: Score to Level Mapping
// ============================================================================

describe('Score to NB Level Mapping', () => {
  test('very low scores should map to NB-L0', () => {
    assert.equal(scoreToNBLevel(0), 'NB-L0')
    assert.equal(scoreToNBLevel(10), 'NB-L0')
  })
  
  test('mid-range scores should map to middle levels', () => {
    const midLevel = scoreToNBLevel(50)
    const numericValue = NB_LEVELS[midLevel].numericValue
    assert.ok(numericValue >= 2 && numericValue <= 5, `Score 50 should map to L2-L5, got ${midLevel}`)
  })
  
  test('high scores should map to high levels', () => {
    const highLevel = scoreToNBLevel(95)
    const numericValue = NB_LEVELS[highLevel].numericValue
    assert.ok(numericValue >= 6, `Score 95 should map to L6+, got ${highLevel}`)
  })
})

// ============================================================================
// TESTS: Placement Calculation - Edge Cases
// ============================================================================

describe('Placement Calculation - Edge Cases', () => {
  test('all zeros should place at NB-L0', () => {
    const profile = createMockProfile({
      decoding: 0,
      wordRecognition: 0,
      fluency: 0,
      comprehension: 0,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'children',
      profile,
    })
    
    assert.equal(result.level, 'NB-L0')
  })
  
  test('all 100s should place at high level', () => {
    const profile = createMockProfile({
      decoding: 100,
      wordRecognition: 100,
      fluency: 100,
      comprehension: 100,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'adult',
      profile,
    })
    
    assert.ok(result.levelNumeric >= 6, `All 100s should place at L6+, got ${result.level}`)
  })
  
  test('one very low skill should anchor placement', () => {
    const profile = createMockProfile({
      decoding: 10, // Very low
      wordRecognition: 90,
      fluency: 90,
      comprehension: 90,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'youth',
      profile,
    })
    
    // Should not place more than 1 level above lowest skill
    assert.ok(result.levelNumeric <= 2, `Low decoding should anchor placement, got ${result.level}`)
    assert.ok(result.limitingSkills.includes('Decoding'))
  })
})

// ============================================================================
// TESTS: Placement by Learner Group
// ============================================================================

describe('Placement by Learner Group', () => {
  const uniformScores = {
    decoding: 60,
    wordRecognition: 60,
    fluency: 60,
    comprehension: 60,
  }
  
  test('placement should work for children group', () => {
    const profile = createMockProfile(uniformScores)
    const result = calculatePlacement({
      learnerGroup: 'children',
      profile,
    })
    
    assert.equal(result.learnerGroup, 'children')
    assert.ok(result.level)
    assert.ok(result.explanation.includes('children'))
  })
  
  test('placement should work for youth group', () => {
    const profile = createMockProfile(uniformScores)
    const result = calculatePlacement({
      learnerGroup: 'youth',
      profile,
    })
    
    assert.equal(result.learnerGroup, 'youth')
  })
  
  test('placement should work for adolescence group', () => {
    const profile = createMockProfile(uniformScores)
    const result = calculatePlacement({
      learnerGroup: 'adolescence',
      profile,
    })
    
    assert.equal(result.learnerGroup, 'adolescence')
  })
  
  test('placement should work for adult group', () => {
    const profile = createMockProfile(uniformScores)
    const result = calculatePlacement({
      learnerGroup: 'adult',
      profile,
    })
    
    assert.equal(result.learnerGroup, 'adult')
    assert.ok(result.explanation.includes('adult'))
  })
})

// ============================================================================
// TESTS: Skill Level Detection
// ============================================================================

describe('Skill Level Detection', () => {
  test('should identify limiting skills correctly', () => {
    const profile = createMockProfile({
      decoding: 80,
      wordRecognition: 80,
      fluency: 30, // Lowest
      comprehension: 80,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'children',
      profile,
    })
    
    assert.ok(result.limitingSkills.includes('Fluency'))
  })
  
  test('should identify strongest skills correctly', () => {
    const profile = createMockProfile({
      decoding: 30,
      wordRecognition: 30,
      fluency: 30,
      comprehension: 90, // Highest
    })
    
    const result = calculatePlacement({
      learnerGroup: 'adult',
      profile,
    })
    
    assert.ok(result.strongestSkills.includes('Comprehension'))
  })
  
  test('should identify multiple limiting skills when tied', () => {
    const profile = createMockProfile({
      decoding: 20,
      wordRecognition: 20,
      fluency: 80,
      comprehension: 80,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'youth',
      profile,
    })
    
    assert.ok(result.limitingSkills.length >= 2)
  })
})

// ============================================================================
// TESTS: Level Change Tracking
// ============================================================================

describe('Level Change Tracking', () => {
  test('should detect level increase', () => {
    const profile = createMockProfile({
      decoding: 70,
      wordRecognition: 70,
      fluency: 70,
      comprehension: 70,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'children',
      profile,
      previousLevel: 'NB-L1',
    })
    
    if (result.levelNumeric > 1) {
      assert.equal(result.levelChange?.direction, 'up')
      assert.ok(result.levelChange!.steps > 0)
    }
  })
  
  test('should detect level decrease', () => {
    const profile = createMockProfile({
      decoding: 30,
      wordRecognition: 30,
      fluency: 30,
      comprehension: 30,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'adult',
      profile,
      previousLevel: 'NB-L6',
    })
    
    assert.equal(result.levelChange?.direction, 'down')
    assert.ok(result.levelChange!.steps > 0)
  })
  
  test('should detect no change', () => {
    const profile = createMockProfile({
      decoding: 50,
      wordRecognition: 50,
      fluency: 50,
      comprehension: 50,
    })
    
    // First, get the baseline level
    const baseline = calculatePlacement({
      learnerGroup: 'youth',
      profile,
    })
    
    // Then run again with that level as previous
    const result2 = calculatePlacement({
      learnerGroup: 'youth',
      profile,
      previousLevel: baseline.level,
    })
    
    assert.equal(result2.levelChange?.direction, 'same')
    assert.equal(result2.levelChange?.steps, 0)
  })
})

// ============================================================================
// TESTS: Quick Placement
// ============================================================================

describe('Quick Placement', () => {
  test('should work with raw scores', () => {
    const result = quickPlacement({
      learnerGroup: 'adult',
      decodingScore: 75,
      wordRecognitionScore: 70,
      fluencyScore: 80,
      comprehensionScore: 65,
    })
    
    assert.ok(result.level)
    assert.equal(result.learnerGroup, 'adult')
  })
  
  test('should use provided confidence', () => {
    const result = quickPlacement({
      learnerGroup: 'children',
      decodingScore: 50,
      wordRecognitionScore: 50,
      fluencyScore: 50,
      comprehensionScore: 50,
      confidence: 'low',
    })
    
    assert.equal(result.confidence, 'low')
  })
})

// ============================================================================
// TESTS: Disclaimer Presence
// ============================================================================

describe('Disclaimer Presence', () => {
  test('result should always include disclaimer', () => {
    const profile = createMockProfile({
      decoding: 50,
      wordRecognition: 50,
      fluency: 50,
      comprehension: 50,
    })
    
    const result = calculatePlacement({
      learnerGroup: 'children',
      profile,
    })
    
    assert.ok(result.disclaimer)
    assert.ok(result.disclaimer.includes('training'))
    assert.ok(result.disclaimer.toLowerCase().includes('not'))
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
