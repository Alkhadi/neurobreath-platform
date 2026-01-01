// Autism Hub Types

export type AudienceType = 'teacher' | 'parent' | 'autistic' | 'employer'
export type CountryType = 'uk' | 'us' | 'eu'
export type AgeBand = 'early-years' | 'primary' | 'secondary' | 'adult'
export type SettingType = 'home' | 'classroom' | 'community' | 'workplace'

export interface UserContext {
  audience: AudienceType
  country: CountryType
  ageBand?: AgeBand
  setting?: SettingType
}

export interface ProgressStats {
  streak: number
  sessions: number
  minutes: number
  skillsPracticed: Set<string>
  plansCompleted: number
  lastSessionDate: string | null
  badges: Set<string>
  weeklyMinutes: Record<string, number> // YYYY-MM-DD -> minutes
}

export interface PlanStep {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
}

export interface Plan {
  id: string
  title: string
  created: string
  ageBand: AgeBand
  mainNeed: string
  setting: SettingType
  doNow: PlanStep[]
  buildThisWeek: PlanStep[]
  measurement: string
}

export interface Skill {
  id: string
  title: string
  category: string
  tags: string[]
  whyItHelps: string
  howToSteps: string[]
  pitfalls: string[]
  adaptations: Record<AgeBand, string>
  evidenceLinks: EvidenceLink[]
  audience: AudienceType[]
}

export interface EvidenceLink {
  type: 'NICE' | 'GOV' | 'NHS' | 'PubMed' | 'CDC' | 'Other'
  title: string
  url: string
  citation?: string
}

export interface PubMedArticle {
  pmid: string
  title: string
  journal: string
  year: string
  authors: string[]
  abstract: string
  url: string
}

export interface Quest {
  id: string
  title: string
  description: string
  icon: string
  audience: AudienceType[]
  xpReward: number
  badgeId?: string
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  criteria: string
}

export interface CalmTechnique {
  id: string
  name: string
  duration: number // minutes
  description: string
  ageAdaptations: string
  warnings: string[]
  steps: string[]
}

