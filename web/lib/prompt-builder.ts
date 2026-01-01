import type { UserContext } from '@/types/user-context'
import type { StructuredPromptInput } from '@/types/user-context'

/**
 * System prompt for AI Coach with UK-first, context-aware tailoring
 */
export const AI_COACH_SYSTEM_PROMPT = `You are "NeuroBreath AI Coach": UK-first, neuro-inclusive, evidence-informed guidance for autism, ADHD, dyslexia, sleep, stress, anxiety, mood, workplace wellbeing.

SCOPE & SAFETY
- Educational info only, not medical advice or diagnosis.
- If self-harm/suicide/immediate danger: stop normal flow and give urgent help guidance.
- UK-first crisis line footer:
  Emergency: 999 (UK) / 911 (US). Urgent mental health: NHS 111 (UK), call GP, or use NHS urgent mental health services.
- Privacy: do not request names/addresses/phone numbers/identifiable records.

HARD REQUIREMENT: TAILORING
You MUST tailor the answer to the provided userContext.
Start by echoing your understanding in one line:
"Context I'm using: {ageGroup}, {setting}, main challenge: {mainChallenge}, goal: {goal}, country: {country}."
If any field is unknown, say "not specified" and ask only if essential.

WHEN GOAL IS "THIS WEEK"
You MUST provide a 7-day practical plan that fits the setting and age group.
For teens at home: teen-appropriate, low-conflict, autonomy-respecting language.
For children at school: teacher-friendly, classroom-compatible strategies.
For adults at work: professional, discreet, workplace-appropriate.

OUTPUT FORMAT (MUST FOLLOW)
1) Context I'm using (1 line)
2) Plain-English summary (bullets, 5–8 points)
3) What to do this week (7-day plan if goal is this-week; otherwise practical steps)
4) Do's and don'ts (specific to age group and setting)
5) When to seek help (UK-specific: NHS, GP, CAMHS for children/teens, 111, crisis services)
6) Sources/Evidence notes (only cite if you have real sources; otherwise say "Evidence notes unavailable")

STYLE
- Dyslexia-friendly: short paragraphs, bullets, clear headings.
- Be specific: "what to do today", "what to do this week".
- Keep language appropriate for the age group.`

/**
 * Build structured prompt for AI Coach
 * Merges user question, context, and quick prompt into a single coherent request
 */
export function buildStructuredPrompt(input: StructuredPromptInput): string {
  const { message, quickPrompt, userContext, pageContext } = input
  
  const contextParts: string[] = []
  if (userContext.ageGroup) contextParts.push(`Age: ${userContext.ageGroup}`)
  if (userContext.setting) contextParts.push(`Setting: ${userContext.setting}`)
  if (userContext.mainChallenge) contextParts.push(`Challenge: ${userContext.mainChallenge}`)
  if (userContext.goal) contextParts.push(`Goal: ${userContext.goal}`)
  if (userContext.country) contextParts.push(`Country: ${userContext.country}`)
  if (userContext.topic) contextParts.push(`Topic: ${userContext.topic}`)
  
  const contextString = contextParts.length > 0 
    ? contextParts.join(', ') 
    : 'No specific context provided'
  
  let prompt = ''
  
  // Add quick prompt context if selected
  if (quickPrompt) {
    prompt += `Quick Prompt Selected: "${quickPrompt}"\n\n`
  }
  
  // Add user context
  prompt += `User Context: ${contextString}\n\n`
  
  // Add page context
  prompt += `Current Page: ${pageContext.title} (${pageContext.pageType})\n\n`
  
  // Add user question
  prompt += `User Question: ${message}\n\n`
  
  // Add instructions
  prompt += `Please provide a tailored response following the output format in your system prompt. Remember to:\n`
  prompt += `1. Echo the context you're using\n`
  prompt += `2. Tailor all advice to the specified age group, setting, and challenge\n`
  
  if (userContext.goal === 'this-week') {
    prompt += `3. Provide a specific 7-day plan for THIS WEEK\n`
  }
  
  if (userContext.country === 'UK') {
    prompt += `4. Include UK-specific pathways (NHS, GP, CAMHS if relevant)\n`
  } else if (userContext.country === 'US') {
    prompt += `4. Include US-specific pathways where relevant\n`
  }
  
  return prompt
}

/**
 * Merge explicit user selections with auto-extracted context
 * Explicit selections ALWAYS override inferred values
 */
export function mergeContext(
  explicit: UserContext,
  inferred: UserContext
): UserContext {
  return {
    country: explicit.country || inferred.country || 'UK',
    ageGroup: explicit.ageGroup || inferred.ageGroup,
    setting: explicit.setting || inferred.setting,
    mainChallenge: explicit.mainChallenge || inferred.mainChallenge,
    goal: explicit.goal || inferred.goal,
    topic: explicit.topic || inferred.topic
  }
}




