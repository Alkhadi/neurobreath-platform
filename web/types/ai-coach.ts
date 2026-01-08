export type AudienceType = 'parents' | 'young_people' | 'teachers' | 'adults' | 'workplace'

export interface UserContext {
  ageGroup?: 'child' | 'teen' | 'adult'
  setting?: 'home' | 'school' | 'work'
  mainGoal?: string
  mainSymptoms?: string[]
  sensoryTriggers?: string[]
  sleepIssues?: string[]
  focusIssues?: string[]
  readingDifficulty?: boolean
  diagnosisStatus?: 'diagnosed' | 'seeking' | 'not_diagnosed' | 'prefer_not_to_say'
  timeAvailablePerDay?: number // minutes
  preferredStyle?: 'simple' | 'detailed' | 'visual'
  country?: 'UK' | 'US' | 'other'
}

export interface AICoachRequest {
  question: string
  topic?: string
  audience?: AudienceType
  context?: UserContext
}

export interface VisualLearningCard {
  id: string
  title: string
  lines: string[]
  audienceTag?: string
  iconKey: string
  emoji?: string
  back?: {
    title?: string
    lines: string[]
  }
}

export interface EvidenceSource {
  title: string
  url: string
  kind: 'NHS' | 'NICE' | 'pubmed' | 'CDC' | 'NIH' | 'APA' | 'University' | 'other'
  pmid?: string
  year?: string
  journal?: string
}

export interface RecommendedResource {
  category: 'primary' | 'backup' | 'add-on'
  title: string
  whoItsFor: string
  howToDoIt: string
  exactSettings: string
  whenToUse: string
  path: string
  ctaLabel: string
}

export interface DayPlanItem {
  day: number
  activity: string
  duration: string
  notes?: string
}

export interface ThirtyDayChallengeTrack {
  rule: string
  badgeMilestones: Array<{ days: number; badge: string }>
  trackingLink: string
}

export interface AICoachAnswer {
  title: string
  plainEnglishSummary: string[]
  recommendations: RecommendedResource[]
  internalLinks: Array<{
    title: string
    path: string
    reason: string
    ctaLabel: string
  }>
  sevenDayPlan?: DayPlanItem[]
  thirtyDayChallenge?: ThirtyDayChallengeTrack
  evidenceSnapshot: {
    nhsNice: string[]
    research: string[]
    practicalSupports: string[]
    whenToSeekHelp: string[]
  }
  tailoredGuidance: {
    parents?: string[]
    young_people?: string[]
    teachers?: string[]
    adults?: string[]
    workplace?: string[]
  }
  practicalActions: string[]
  mythsAndMisunderstandings?: string[]
  clinicianNotes?: string[]
  visualLearningCards: VisualLearningCard[]
  neurobreathTools: Array<{
    title: string
    url: string
    why: string
  }>
  evidence: {
    nhsOrNice: EvidenceSource[]
    pubmed: EvidenceSource[]
    other?: EvidenceSource[]
  }
  sourceTrace: {
    [key: string]: string[] // Maps claim IDs to source IDs
  }
  safetyNotice: string
  followUpQuestions?: string[]
}

export interface AICoachResponse {
  answer: AICoachAnswer
  meta: {
    cached: boolean
    queryKey: string
    coverage: {
      nhs: boolean
      nice: boolean
      pubmed: boolean
    }
    generatedAtISO: string
  }
}

export interface PubMedArticle {
  id: string
  title: string
  authors?: string[]
  journal?: string
  pubDate?: string
  year?: string
  url: string
  pmid: string
  abstract?: string
}

export interface KnowledgeBaseEntry {
  keywords: string[]
  summary: string[]
  actions: string[]
  clinicianNotes?: string[]
  internalLinks: Array<{ title: string; url: string; why: string }>
  nhsLinks: Array<{ title: string; url: string }>
  niceLinks: Array<{ title: string; url: string }>
}

export interface CacheEntry {
  data: AICoachResponse
  timestamp: number
}

export interface CardExportRequest {
  title: string
  cards: VisualLearningCard[]
  theme?: string
}
