/**
 * SEND Report Rules Engine
 * 
 * Deterministic rules-based analysis for when AI is unavailable
 * Provides pattern detection and recommendations without AI
 * 
 * NOT A DIAGNOSTIC TOOL - Training recommendations only
 */

interface AssessmentData {
  id: string
  assessmentType: string
  scores: {
    decoding?: number
    wordRecognition?: number
    fluency?: number
    comprehension?: number
  }
  timestamp: string
}

interface SessionData {
  id: string
  technique: string
  minutes: number
  category?: string
  timestamp: string
}

interface RulesAnalysis {
  patternSummary: string
  strengths: string[]
  challenges: string[]
  recommendations: string[]
  confidence: 'low' | 'medium' | 'high'
}

/**
 * Analyze assessment and session data using deterministic rules
 */
export function analyzeWithRules(
  assessments: AssessmentData[],
  sessions: SessionData[]
): RulesAnalysis {
  const strengths: string[] = []
  const challenges: string[] = []
  const recommendations: string[] = []
  
  // Analyze assessments
  if (assessments.length > 0) {
    const latest = assessments[0]
    const scores = latest.scores
    
    // Decoding analysis
    if (scores.decoding !== undefined) {
      if (scores.decoding >= 80) {
        strengths.push('Strong phonics and decoding skills')
      } else if (scores.decoding >= 60) {
        strengths.push('Developing decoding abilities')
        recommendations.push('Continue phonics practice with focus on complex patterns')
      } else {
        challenges.push('Decoding skills need support')
        recommendations.push('Intensive phonics instruction recommended')
        recommendations.push('Focus on letter-sound correspondence and blending')
      }
    }
    
    // Word Recognition analysis
    if (scores.wordRecognition !== undefined) {
      if (scores.wordRecognition >= 80) {
        strengths.push('Excellent sight word recognition')
      } else if (scores.wordRecognition >= 60) {
        recommendations.push('Build sight word vocabulary with high-frequency words')
      } else {
        challenges.push('Limited sight word vocabulary')
        recommendations.push('Daily sight word practice recommended')
        recommendations.push('Use multi-sensory approaches for word learning')
      }
    }
    
    // Fluency analysis
    if (scores.fluency !== undefined) {
      if (scores.fluency >= 80) {
        strengths.push('Reading fluency is well-developed')
      } else if (scores.fluency >= 60) {
        recommendations.push('Practice repeated reading for fluency building')
      } else {
        challenges.push('Reading fluency needs development')
        recommendations.push('Focus on accuracy before speed')
        recommendations.push('Use echo reading and choral reading techniques')
      }
    }
    
    // Comprehension analysis
    if (scores.comprehension !== undefined) {
      if (scores.comprehension >= 80) {
        strengths.push('Strong reading comprehension')
      } else if (scores.comprehension >= 60) {
        recommendations.push('Practice comprehension strategies (predict, question, summarize)')
      } else {
        challenges.push('Comprehension skills require support')
        recommendations.push('Teach explicit comprehension strategies')
        recommendations.push('Use graphic organizers and visual aids')
      }
    }
    
    // Pattern detection across skills
    const allScores = [
      scores.decoding,
      scores.wordRecognition,
      scores.fluency,
      scores.comprehension
    ].filter((s): s is number => s !== undefined)
    
    if (allScores.length > 0) {
      const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length
      const variance = allScores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / allScores.length
      
      if (variance > 400) { // High variance (20+ point differences)
        challenges.push('Uneven skill development across reading domains')
        recommendations.push('Focus on weakest areas while maintaining strengths')
      }
    }
  }
  
  // Analyze session consistency
  if (sessions.length > 0) {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0)
    const avgMinutes = totalMinutes / sessions.length
    
    if (sessions.length >= 10) {
      strengths.push(`Consistent practice with ${sessions.length} sessions completed`)
    }
    
    if (avgMinutes >= 10) {
      strengths.push('Good session duration maintained')
    } else if (avgMinutes < 5) {
      recommendations.push('Aim for longer practice sessions (10-15 minutes)')
    }
    
    // Check for gaps in practice
    const dates = sessions.map(s => new Date(s.timestamp).toISOString().split('T')[0])
    const uniqueDates = new Set(dates)
    const daysCovered = uniqueDates.size
    
    if (daysCovered < sessions.length * 0.5) {
      recommendations.push('Spread practice across more days for better retention')
    }
  } else {
    recommendations.push('Regular practice sessions recommended for skill development')
  }
  
  // Generate summary
  const patternSummary = generateSummary(strengths, challenges, assessments.length, sessions.length)
  
  // Determine confidence
  const confidence = determineConfidence(assessments.length, sessions.length)
  
  // Ensure we have at least some content
  if (strengths.length === 0) {
    strengths.push('Engagement with learning activities')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue regular practice across all skill areas')
  }
  
  return {
    patternSummary,
    strengths,
    challenges,
    recommendations,
    confidence
  }
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  strengths: string[],
  challenges: string[],
  assessmentCount: number,
  sessionCount: number
): string {
  let summary = `Analysis based on ${assessmentCount} assessment(s) and ${sessionCount} practice session(s). `
  
  if (strengths.length > 0) {
    summary += `Key strengths include: ${strengths.slice(0, 2).join(' and ')}. `
  }
  
  if (challenges.length > 0) {
    summary += `Areas for development: ${challenges.slice(0, 2).join(' and ')}. `
  }
  
  summary += 'This analysis provides training recommendations only and is not a diagnostic assessment.'
  
  return summary
}

/**
 * Determine confidence level based on data quantity
 */
function determineConfidence(
  assessmentCount: number,
  sessionCount: number
): 'low' | 'medium' | 'high' {
  if (assessmentCount >= 3 && sessionCount >= 10) {
    return 'high'
  } else if (assessmentCount >= 1 && sessionCount >= 5) {
    return 'medium'
  } else {
    return 'low'
  }
}

/**
 * Compare two assessments to show progress
 */
export function compareAssessments(
  earlier: AssessmentData,
  later: AssessmentData
): {
  improvements: string[]
  declines: string[]
  stable: string[]
} {
  const improvements: string[] = []
  const declines: string[] = []
  const stable: string[] = []
  
  const skills = ['decoding', 'wordRecognition', 'fluency', 'comprehension'] as const
  
  skills.forEach(skill => {
    const earlierScore = earlier.scores[skill]
    const laterScore = later.scores[skill]
    
    if (earlierScore !== undefined && laterScore !== undefined) {
      const diff = laterScore - earlierScore
      
      if (diff >= 10) {
        improvements.push(`${formatSkillName(skill)} improved by ${diff} points`)
      } else if (diff <= -10) {
        declines.push(`${formatSkillName(skill)} decreased by ${Math.abs(diff)} points`)
      } else {
        stable.push(`${formatSkillName(skill)} remained stable`)
      }
    }
  })
  
  return { improvements, declines, stable }
}

function formatSkillName(skill: string): string {
  switch (skill) {
    case 'decoding': return 'Decoding'
    case 'wordRecognition': return 'Word Recognition'
    case 'fluency': return 'Fluency'
    case 'comprehension': return 'Comprehension'
    default: return skill
  }
}

