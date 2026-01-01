/**
 * User Context Types
 * 
 * Defines the structure for capturing user's situation to enable
 * highly tailored AI Coach responses.
 */

export type AgeGroup = 'children' | 'adolescence' | 'youth' | 'adult' | 'parent-caregiver' | 'teacher'
export type Setting = 'home' | 'school' | 'workplace' | 'clinic' | 'community'
export type MainChallenge = 
  | 'routines' 
  | 'meltdowns' 
  | 'anxiety' 
  | 'sleep' 
  | 'focus' 
  | 'communication' 
  | 'behaviour' 
  | 'learning' 
  | 'sensory'
export type Goal = 
  | 'reduce-stress' 
  | 'improve-routines' 
  | 'improve-sleep' 
  | 'improve-focus' 
  | 'support-learning' 
  | 'de-escalation' 
  | 'better-communication'
  | 'today'
  | 'this-week'
  | 'long-term'
export type Country = 'UK' | 'US' | 'other'
export type Topic = 'autism' | 'adhd' | 'dyslexia' | 'anxiety' | 'sleep' | 'mood' | 'stress' | 'other'
export type Timeframe = 'today' | 'this-week' | 'long-term'

export interface UserContext {
  ageGroup?: AgeGroup
  setting?: Setting
  mainChallenge?: MainChallenge
  goal?: Goal
  country?: Country
  topic?: Topic
}

export interface PageContext {
  pageKey: string
  pageType: 'blog' | 'reading' | 'breathing' | 'focus' | 'generic'
  pathname: string
  title: string
}

export interface StructuredPromptInput {
  message: string
  quickPrompt?: string
  userContext: UserContext
  pageContext: PageContext
  audienceMode?: string
}

