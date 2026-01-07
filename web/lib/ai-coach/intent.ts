export type IntentType =
  | 'definition'
  | 'management'
  | 'school'
  | 'workplace'
  | 'sleep'
  | 'assessment'
  | 'crisis'
  | 'general'

export interface ParsedIntent {
  primary: IntentType
  secondary?: IntentType
  topic?: string
  needsCrisisResponse: boolean
}

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'self-harm',
  'hurt myself', 'want to die', 'no point living', 'end it all'
]

const INTENT_PATTERNS: Record<IntentType, string[]> = {
  definition: ['what is', 'define', 'explain', 'meaning of', 'tell me about'],
  management: ['how to manage', 'coping with', 'dealing with', 'handle', 'strategies for', 'help with'],
  school: ['school', 'classroom', 'teacher', 'SENCO', 'education', 'learning', 'homework'],
  workplace: ['work', 'job', 'workplace', 'employer', 'career', 'employment', 'adjustments at work'],
  sleep: ['sleep', 'insomnia', 'bedtime', 'wake up', 'tired', 'rest'],
  assessment: ['assessment', 'diagnosis', 'diagnosed', 'evaluation', 'testing', 'referral'],
  crisis: CRISIS_KEYWORDS,
  general: []
}

export function parseIntent(question: string): ParsedIntent {
  const questionLower = question.toLowerCase()
  
  // Check crisis first
  const needsCrisisResponse = CRISIS_KEYWORDS.some(keyword =>
    questionLower.includes(keyword)
  )
  
  if (needsCrisisResponse) {
    return {
      primary: 'crisis',
      needsCrisisResponse: true
    }
  }
  
  // Score each intent
  const scores: Record<IntentType, number> = {
    definition: 0,
    management: 0,
    school: 0,
    workplace: 0,
    sleep: 0,
    assessment: 0,
    crisis: 0,
    general: 0
  }
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'general' || intent === 'crisis') continue
    for (const pattern of patterns) {
      if (questionLower.includes(pattern)) {
        scores[intent as IntentType] += 1
      }
    }
  }
  
  // Find top 2 intents
  const sortedIntents = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([_, a], [__, b]) => b - a)
  
  const primary = sortedIntents[0]?.[0] as IntentType || 'general'
  const secondary = sortedIntents[1]?.[0] as IntentType | undefined
  
  // Extract topic
  const topics = ['autism', 'adhd', 'dyslexia', 'anxiety', 'depression', 'bipolar', 'stress', 'sleep', 'breathing', 'mindfulness']
  const topic = topics.find(t => questionLower.includes(t))
  
  return {
    primary,
    secondary,
    topic,
    needsCrisisResponse: false
  }
}







