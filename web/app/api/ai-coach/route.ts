import { NextRequest, NextResponse } from 'next/server'
import type { AICoachRequest, AICoachResponse } from '@/types/ai-coach'
import type { UserContext, Topic } from '@/types/user-context'
import { parseIntent } from '@/lib/ai-coach/intent'
import { getNHSLinks, getNHSCrisisLinks } from '@/lib/ai-coach/nhs'
import { getNICELinks } from '@/lib/ai-coach/nice'
import { searchPubMed, buildPubMedQuery } from '@/lib/ai-coach/pubmed'
import { getNeuroBreathTools } from '@/lib/ai-coach/kb'
import { synthesizeAnswer } from '@/lib/ai-coach/synthesis'
import { getCached, setCached, generateQueryKey } from '@/lib/ai-coach/cache'
import { normalizeQuestion, type SubmissionMode } from '@/lib/normalize-question'
import { recommendResources } from '@/lib/recommend-resources'
import { suggestInternalLinksForCoach } from '@/lib/assistant/answerEngine'

// Force route to be dynamic (never cached)
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ExtendedAICoachRequest extends Partial<AICoachRequest> {
  question?: string
  userQuestion?: string
  quickPromptId?: string
  mode?: SubmissionMode
  userContext?: UserContext
  topic?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtendedAICoachRequest = await request.json()
    const { 
      question: legacyQuestion, 
      userQuestion, 
      quickPromptId, 
      mode = 'typed',
      userContext,
      topic: topicString,
      audience 
    } = body
    
    // Support both old and new payload structures
    const inputQuestion = userQuestion || legacyQuestion
    const context: UserContext = userContext || { country: 'UK' }
    const topic: Topic = (topicString as Topic) || context.topic || 'other'
    
    // DEV-ONLY: Log received payload
    if (process.env.NODE_ENV === 'development') {
      console.debug('🔍 AI Coach Payload:', {
        mode,
        quickPromptId,
        userQuestion: inputQuestion,
        context,
        topic
      })
    }
    
    // Normalize question (expand if empty/vague)
    const normalizedQuestion = normalizeQuestion(
      inputQuestion,
      quickPromptId,
      context,
      topic,
      mode
    )
    
    // DEV-ONLY: Log normalized question
    if (process.env.NODE_ENV === 'development') {
      console.debug('📝 Normalized Question:', normalizedQuestion)
    }
    
    // Validate normalized question
    if (!normalizedQuestion || normalizedQuestion.trim().length < 10) {
      return NextResponse.json(
        { error: 'Unable to generate question from context. Please provide more details.' },
        { status: 400 }
      )
    }
    
    // Generate cache key
    const queryKey = generateQueryKey(normalizedQuestion, topic, audience)
    
    // Check cache
    const cached = getCached(queryKey)
    if (cached) {
      // Return cached response with updated meta
      return NextResponse.json({
        ...cached,
        meta: {
          ...cached.meta,
          cached: true
        }
      })
    }
    
    // Parse intent
    const intent = parseIntent(normalizedQuestion)
    
    // Handle crisis situations immediately
    if (intent.needsCrisisResponse) {
      const crisisLinks = getNHSCrisisLinks()
      const crisisAnswer = synthesizeAnswer({
        question: normalizedQuestion,
        intent,
        nhsLinks: crisisLinks,
        niceLinks: [],
        pubmedArticles: [],
        audience,
        neurobreathTools: []
      })
      
      const response: AICoachResponse = {
        answer: crisisAnswer,
        meta: {
          cached: false,
          queryKey,
          coverage: { nhs: true, nice: false, pubmed: false },
          generatedAtISO: new Date().toISOString()
        }
      }
      
      // Don't cache crisis responses
      return NextResponse.json(response)
    }
    
    // Retrieve evidence sources in parallel
    const [nhsLinks, niceLinks, pubmedArticles, neurobreathTools] = await Promise.all([
      Promise.resolve(getNHSLinks(normalizedQuestion, topic || intent.topic)),
      Promise.resolve(getNICELinks(normalizedQuestion, topic || intent.topic)),
      searchPubMed(buildPubMedQuery(normalizedQuestion, intent, topic || intent.topic), 6),
      Promise.resolve(getNeuroBreathTools(normalizedQuestion, topic || intent.topic))
    ])
    
    // Get recommended resources
    const recommendedResources = recommendResources({
      context,
      topic,
      normalizedQuestion
    })
    
    // Synthesize comprehensive answer
    const answer = synthesizeAnswer({
      question: normalizedQuestion,
      intent,
      nhsLinks,
      niceLinks,
      pubmedArticles,
      audience,
      neurobreathTools,
      context, // Pass context for context-used echo
      topic
    })

    const internalLinks = await suggestInternalLinksForCoach({
      question: normalizedQuestion,
      intentId: quickPromptId,
      pathname: pathnameFromContext(context),
      jurisdiction: context.country === 'US' ? 'US' : 'UK'
    })
    
    // Build response with recommended resources
    const response: AICoachResponse = {
      answer: {
        ...answer,
        internalLinks,
        recommendations: recommendedResources.map(r => ({
          category: 'primary' as const,
          title: r.title,
          whoItsFor: r.whyThisFits,
          howToDoIt: r.howToUseThisWeek,
          exactSettings: '',
          whenToUse: r.howToUseThisWeek,
          path: r.url,
          ctaLabel: 'Try this'
        }))
      },
      meta: {
        cached: false,
        queryKey,
        coverage: {
          nhs: nhsLinks.length > 0,
          nice: niceLinks.length > 0,
          pubmed: pubmedArticles.length > 0
        },
        generatedAtISO: new Date().toISOString()
      }
    }
    
    // Cache the response
    setCached(queryKey, response)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Coach API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    )
  }
}

function pathnameFromContext(context: UserContext): string {
  if (context.country === 'US') return '/us'
  return '/uk'
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'AI Coach API is running. Use POST to ask questions.'
  })
}
