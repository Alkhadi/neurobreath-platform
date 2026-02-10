import type { UserContext, AgeGroup, Setting, MainChallenge, Goal, Country, Topic } from '@/types/user-context'

/**
 * Deterministic Context Extractor
 * 
 * Parses common phrases from user's raw question and sets userContext fields.
 * Only sets when high-confidence terms appear. Conservative approach.
 */

// Age group patterns
const AGE_PATTERNS: Record<AgeGroup, RegExp[]> = {
  children: [
    /\b(child|children|kid|kids|young child|primary school|5[ -]?year|6[ -]?year|7[ -]?year|8[ -]?year|9[ -]?year|10[ -]?year|11[ -]?year)\b/i
  ],
  adolescence: [
    /\b(teen|teenager|adolescent|youth|secondary school|high school|12[ -]?year|13[ -]?year|14[ -]?year|15[ -]?year|16[ -]?year|17[ -]?year|18[ -]?year)\b/i
  ],
  youth: [
    /\b(young adult|youth|college|university student|18[ -]?year|19[ -]?year|20[ -]?year|21[ -]?year)\b/i
  ],
  adult: [
    /\b(adult|grown[ -]?up|workplace|work|job|career)\b/i
  ],
  'parent-caregiver': [
    /\b(parent|mum|dad|mother|father|carer|caregiver|my child|my teen)\b/i
  ],
  teacher: [
    /\b(teacher|educator|SENCO|teaching|classroom|as a teacher)\b/i
  ]
}

// Setting patterns
const SETTING_PATTERNS: Record<Setting, RegExp[]> = {
  home: [
    /\bat home\b/i,
    /\bin the home\b/i,
    /\bhome routine/i,
    /\bfamily\b/i,
    /\bparenting\b/i
  ],
  school: [
    /\bat school\b/i,
    /\bin school\b/i,
    /\bin class\b/i,
    /\bclassroom\b/i,
    /\bteacher\b/i,
    /\bSENCO\b/i,
    /\bSEN\b/i,
    /\bacademic\b/i
  ],
  workplace: [
    /\bat work\b/i,
    /\bworkplace\b/i,
    /\bin the office\b/i,
    /\bjob\b/i,
    /\bcareer\b/i,
    /\bemployer\b/i,
    /\bemployment\b/i
  ],
  clinic: [
    /\bclinic\b/i,
    /\bhospital\b/i,
    /\btherapy session\b/i,
    /\bappointment\b/i
  ],
  community: [
    /\bcommunity\b/i,
    /\bpublic\b/i,
    /\boutside\b/i,
    /\bsocial setting\b/i
  ]
}

// Main challenge patterns
const CHALLENGE_PATTERNS: Record<MainChallenge, RegExp[]> = {
  routines: [
    /\broutine/i,
    /\bschedule/i,
    /\bstructure/i,
    /\borganis/i,
    /\borganiz/i,
    /\btransition/i
  ],
  meltdowns: [
    /\bmeltdown/i,
    /\btantrum/i,
    /\boutburst/i,
    /\bexplosion/i
  ],
  anxiety: [
    /\banxiety\b/i,
    /\banxious\b/i,
    /\bworry\b/i,
    /\bworried\b/i,
    /\bpanic\b/i,
    /\bnervous\b/i
  ],
  sleep: [
    /\bsleep/i,
    /\binsomnia\b/i,
    /\bbedtime\b/i,
    /\bnight[ -]?time\b/i,
    /\btired\b/i
  ],
  focus: [
    /\bfocus\b/i,
    /\battention\b/i,
    /\bconcentrat/i,
    /\bdistract/i,
    /\bADHD\b/i
  ],
  communication: [
    /\bcommunication\b/i,
    /\bspeaking\b/i,
    /\btalking\b/i,
    /\bverbal\b/i,
    /\bexpress/i
  ],
  behaviour: [
    /\bbehaviour\b/i,
    /\bbehavior\b/i,
    /\bacting out\b/i,
    /\bchalleng.*behav/i
  ],
  learning: [
    /\blearning\b/i,
    /\bstudy\b/i,
    /\bhomework\b/i,
    /\bacademic\b/i
  ],
  sensory: [
    /\bsensory/i,
    /\bnoise/i,
    /\bloud/i,
    /\bbright light/i,
    /\btexture/i,
    /\boverload\b/i,
    /\boverwhelm/i
  ]
}

// Goal patterns
const GOAL_PATTERNS: Record<Goal, RegExp[]> = {
  'reduce-stress': [
    /\breduce.*stress\b/i,
    /\bstress.*management\b/i,
    /\bcalm.*down\b/i
  ],
  'improve-routines': [
    /\bimprove.*routine/i,
    /\bbetter.*routine/i,
    /\broutine.*help/i
  ],
  'improve-sleep': [
    /\bimprove.*sleep/i,
    /\bbetter.*sleep/i,
    /\bsleep.*help/i
  ],
  'improve-focus': [
    /\bimprove.*focus/i,
    /\bbetter.*focus/i,
    /\bfocus.*help/i,
    /\bconcentrat/i
  ],
  'support-learning': [
    /\bsupport.*learning/i,
    /\bhelp.*learn/i,
    /\bacademic.*support/i
  ],
  'de-escalation': [
    /\bde-escalat/i,
    /\bcalm.*down/i,
    /\bmeltdown.*prevent/i
  ],
  'better-communication': [
    /\bimprove.*communication/i,
    /\bbetter.*communication/i,
    /\bcommunication.*help/i
  ],
  'today': [
    /\btoday\b/i,
    /\bright now\b/i,
    /\bimmediately\b/i,
    /\bthis moment\b/i
  ],
  'this-week': [
    /\bthis week\b/i,
    /\bthis coming week\b/i,
    /\bnext 7 days\b/i,
    /\bnext few days\b/i
  ],
  'long-term': [
    /\blong[ -]?term\b/i,
    /\bmonths\b/i,
    /\byears\b/i,
    /\bfuture\b/i,
    /\bgradually\b/i
  ]
}

// Country patterns
const COUNTRY_PATTERNS: Record<Country, RegExp[]> = {
  UK: [
    /\bUK\b/,
    /\bU\.K\./,
    /\bUnited Kingdom\b/i,
    /\bBritain\b/i,
    /\bBritish\b/i,
    /\bNHS\b/,
    /\bGP\b/,
    /\bCAMHS\b/i,
    /\bNICE\b/,
    /\bSENCO\b/i
  ],
  US: [
    /\bUS\b/,
    /\bU\.S\./,
    /\bUSA\b/,
    /\bUnited States\b/i,
    /\bAmerica/i,
    /\bIEP\b/,
    /\b504\b/
  ],
  other: []
}

// Topic patterns
const TOPIC_PATTERNS: Record<Topic, RegExp[]> = {
  autism: [
    /\bautis/i,
    /\bASD\b/,
    /\bAsperger/i
  ],
  adhd: [
    /\bADHD\b/,
    /\bADD\b/,
    /\battention deficit\b/i,
    /\bhyperactiv/i
  ],
  dyslexia: [
    /\bdyslex/i,
    /\bread.*difficult/i
  ],
  anxiety: [
    /\banxiety\b/i,
    /\bpanic\b/i,
    /\bphobia\b/i
  ],
  sleep: [
    /\bsleep.*problem/i,
    /\binsomnia\b/i
  ],
  mood: [
    /\bdepression\b/i,
    /\bmood\b/i,
    /\bbipolar\b/i
  ],
  stress: [
    /\bstress\b/i,
    /\bstressed\b/i,
    /\bburnout\b/i
  ],
  other: []
}

function matchPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(text))
}

function extractField<T extends string>(
  text: string,
  patterns: Record<T, RegExp[]>
): T | undefined {
  for (const [key, regexes] of Object.entries(patterns) as [T, RegExp[]][]) {
    if (matchPattern(text, regexes)) {
      return key
    }
  }
  return undefined
}

/**
 * Extract context from raw user question
 * Only sets fields with high confidence
 * Does not override existing user selections
 */
export function extractContextFromQuestion(
  question: string,
  existingContext: UserContext = {}
): UserContext {
  const extracted: UserContext = { ...existingContext }
  
  // Only extract if not already set by user
  if (!extracted.ageGroup) {
    extracted.ageGroup = extractField(question, AGE_PATTERNS)
  }
  
  if (!extracted.setting) {
    extracted.setting = extractField(question, SETTING_PATTERNS)
  }
  
  if (!extracted.mainChallenge) {
    extracted.mainChallenge = extractField(question, CHALLENGE_PATTERNS)
  }
  
  if (!extracted.goal) {
    extracted.goal = extractField(question, GOAL_PATTERNS)
  }
  
  if (!extracted.country) {
    extracted.country = extractField(question, COUNTRY_PATTERNS)
  }
  
  if (!extracted.topic) {
    extracted.topic = extractField(question, TOPIC_PATTERNS)
  }
  
  return extracted
}

/**
 * Format context for display
 */
export function formatContext(context: UserContext): string {
  const parts: string[] = []
  
  if (context.ageGroup) parts.push(context.ageGroup)
  if (context.setting) parts.push(context.setting)
  if (context.mainChallenge) parts.push(context.mainChallenge)
  if (context.goal) parts.push(context.goal)
  if (context.country) parts.push(context.country)
  
  return parts.join(' / ') || 'No context set'
}

