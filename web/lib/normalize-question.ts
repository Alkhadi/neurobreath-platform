/**
 * Server-side Question Normalization
 * 
 * Ensures "no typing" submissions and quick prompts
 * always become full, context-filled questions
 */

import type { UserContext, Topic } from '@/types/user-context'

export type SubmissionMode = 'typed' | 'quick_prompt' | 'cta'

export interface QuickPromptTemplate {
  id: string
  label: string
  template: (context: UserContext, topic: Topic) => string
}

/**
 * Quick prompt templates
 * Each expands into a full question using context + topic
 */
export const QUICK_PROMPT_TEMPLATES: QuickPromptTemplate[] = [
  {
    id: 'explain-simply',
    label: 'Explain simply',
    template: (context, topic) => {
      const ageLabel = context.ageGroup || 'someone'
      const topicLabel = topic === 'other' ? 'this wellbeing topic' : topic
      return `Explain ${topicLabel} in simple terms for ${ageLabel} in ${context.country || 'UK'}. Include what it is, common challenges, and when to seek help.`
    }
  },
  {
    id: 'daily-routines',
    label: 'Daily routines & regulation',
    template: (context, topic) => {
      const setting = context.setting || 'home'
      const ageLabel = context.ageGroup || 'someone'
      const topicLabel = topic === 'other' ? 'wellbeing' : topic
      return `Create a practical 7-day routine plan for ${ageLabel} in ${setting} in ${context.country || 'UK'} to support ${topicLabel}. Include daily scripts, visual supports, and troubleshooting tips.`
    }
  },
  {
    id: 'school-supports',
    label: 'School/classroom supports',
    template: (context, topic) => {
      const topicLabel = topic === 'other' ? 'wellbeing' : topic
      const ageLabel = context.ageGroup === 'children' ? 'primary school' : context.ageGroup === 'adolescence' ? 'secondary school' : 'school'
      return `What classroom strategies and school supports help ${ageLabel} students with ${topicLabel}? Include SENCO conversation starters, reasonable adjustments, and UK SEND Code of Practice considerations.`
    }
  },
  {
    id: 'workplace-adjustments',
    label: 'Workplace adjustments',
    template: (context, topic) => {
      const topicLabel = topic === 'other' ? 'wellbeing' : topic
      return `What reasonable workplace adjustments support employees with ${topicLabel} under UK Equality Act? Include specific strategies, Access to Work guidance, and disclosure conversation tips.`
    }
  },
  {
    id: 'assessment-pathway',
    label: 'Assessment pathway (UK)',
    template: (context, topic) => {
      const topicLabel = topic === 'other' ? 'this condition' : topic
      const ageLabel = context.ageGroup || 'someone'
      return `What is the UK NHS assessment pathway for ${topicLabel} for ${ageLabel}? Include referral process, waiting times, Right to Choose options, and private assessment alternatives.`
    }
  },
  {
    id: 'common-misunderstandings',
    label: 'Common misunderstandings',
    template: (context, topic) => {
      const topicLabel = topic === 'other' ? 'this topic' : topic
      return `What are the most common myths and misunderstandings about ${topicLabel}? Provide evidence-based corrections and practical implications.`
    }
  },
  {
    id: 'when-to-seek-help',
    label: 'When to seek help',
    template: (context, topic) => {
      const topicLabel = topic === 'other' ? 'these challenges' : topic
      const ageLabel = context.ageGroup || 'someone'
      return `When should ${ageLabel} in ${context.country || 'UK'} seek professional help for ${topicLabel}? Include red flags, who to contact (GP/NHS/crisis), and what to expect.`
    }
  }
]

/**
 * Generate question from context when user clicks CTA with empty input
 */
export function generateCTAQuestion(context: UserContext, topic: Topic): string {
  const ageLabel = context.ageGroup || 'someone'
  const setting = context.setting || 'their setting'
  const challenge = context.mainChallenge || 'wellbeing'
  const goal = context.goal || 'support'
  const country = context.country || 'UK'
  const timeframe = context.goal === 'today' ? 'today' : context.goal === 'this-week' ? 'this week' : 'the coming weeks'
  const topicLabel = topic === 'other' ? 'general wellbeing' : topic
  
  return `Create a practical 7-day plan for ${ageLabel} in ${setting} in ${country} to address ${challenge} with a focus on ${goal} related to ${topicLabel}. The plan should be actionable ${timeframe}. Include daily routines, specific scripts or prompts, visual supports where helpful, troubleshooting for common obstacles, and clear guidance on when to seek professional help.`
}

/**
 * Check if question is empty or generic label
 */
function isVagueOrEmpty(text: string): boolean {
  if (!text || text.trim().length < 3) return true
  
  // Check if it matches a quick prompt label exactly
  const labels = QUICK_PROMPT_TEMPLATES.map(t => t.label.toLowerCase())
  if (labels.includes(text.toLowerCase().trim())) return true
  
  return false
}

/**
 * Normalize question on server
 * Expands empty/vague questions into full context-aware questions
 */
export function normalizeQuestion(
  userQuestion: string | undefined,
  quickPromptId: string | undefined,
  context: UserContext,
  topic: Topic,
  mode: SubmissionMode
): string {
  // If quick prompt provided, use its template
  if (quickPromptId) {
    const template = QUICK_PROMPT_TEMPLATES.find(t => t.id === quickPromptId)
    if (template) {
      return template.template(context, topic)
    }
  }
  
  // If user typed a real question, use it
  if (userQuestion && !isVagueOrEmpty(userQuestion)) {
    return userQuestion.trim()
  }
  
  // Otherwise generate from context (CTA mode or empty submit)
  return generateCTAQuestion(context, topic)
}

/**
 * Get quick prompt template by ID
 */
export function getQuickPromptTemplate(id: string): QuickPromptTemplate | undefined {
  return QUICK_PROMPT_TEMPLATES.find(t => t.id === id)
}



