import type { AICoachResponse, PubMedArticle } from '@/types/ai-coach'
import { findBestMatch } from './knowledge-base'
import { searchPubMed, buildPubMedQuery } from './pubmed'
import { getNHSLinks, getNICELinks, getCDCLinks } from './nhs-mapper'
import { getCached, setCached, generateQueryKey } from './cache'

const SAFETY_NOTICE = `This AI provides general educational information, not medical advice. In emergencies call 999 (UK) / 911 (US) or use NHS 111 / 988 Lifeline. Talk to your GP, paediatrician, SENCO, or licensed clinician for personalised care.`

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'self-harm',
  'hurt myself', 'want to die', 'no point living'
]

function isCrisisQuestion(question: string): boolean {
  const questionLower = question.toLowerCase()
  return CRISIS_KEYWORDS.some(keyword => questionLower.includes(keyword))
}

function buildCrisisResponse(): AICoachResponse {
  return {
    answer: {
      title: 'Immediate Crisis Support',
      plainEnglishSummary: [
        'If you are in immediate danger or thinking about suicide, please contact emergency services immediately.'
      ],
      recommendations: [],
      internalLinks: [],
      evidenceSnapshot: {
        nhsNice: ['NHS urgent mental health support available 24/7'],
        research: [],
        practicalSupports: [
          '🚨 UK: Call 999 or go to A&E',
          '🚨 US: Call 911 or 988 Suicide & Crisis Lifeline',
          '📞 UK: Call Samaritans on 116 123 (free, 24/7)',
          '📞 US: Text "HELLO" to 741741 (Crisis Text Line)'
        ],
        whenToSeekHelp: ['Contact your GP or local crisis team for urgent mental health support']
      },
      tailoredGuidance: {},
      practicalActions: [
        'Call 999 (UK) or 911 (US) if in immediate danger',
        'Contact Samaritans 116 123 (UK) or 988 Lifeline (US)',
        'Text HELLO to 741741 for Crisis Text Line',
        'Go to nearest A&E for urgent mental health support'
      ],
      visualLearningCards: [],
      neurobreathTools: [],
      evidence: {
        nhsOrNice: [
          { title: 'NHS: Getting urgent help for mental health', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/', kind: 'NHS', pmid: undefined, year: undefined, journal: undefined }
        ],
        pubmed: []
      },
      sourceTrace: {},
      safetyNotice: 'This is a mental health emergency. Please reach out for immediate help using the contacts above. You are not alone.'
    },
    meta: {
      cached: false,
      queryKey: `crisis-${Date.now()}`,
      coverage: { nhs: true, nice: false, pubmed: false },
      generatedAtISO: new Date().toISOString()
    }
  }
}

export async function buildResponse(
  question: string,
  topic?: string,
  audience?: string
): Promise<AICoachResponse> {
  // Check for crisis keywords first
  if (isCrisisQuestion(question)) {
    return buildCrisisResponse()
  }
  
  // Check cache
  const cacheKey = generateQueryKey(question, topic, audience)
  const cached = getCached(cacheKey)
  if (cached) {
    return {
      ...cached,
      meta: {
        ...cached.meta,
        cached: true
      }
    }
  }
  
  // Get knowledge base match
  const kbMatch = findBestMatch(question, topic)
  
  // Fetch PubMed articles (in parallel with other operations)
  let pubmedArticles: PubMedArticle[] = []
  try {
    const intent = { topic: topic || 'general', keywords: [question] } as any
    const pubmedQuery = buildPubMedQuery(question, intent, topic)
    pubmedArticles = await searchPubMed(pubmedQuery, 3)
  } catch (error) {
    console.error('PubMed search failed:', error)
  }
  
  // Get NHS/NICE/CDC links
  const nhsLinks = getNHSLinks(question, topic)
  const niceLinks = getNICELinks(question, topic)
  const cdcLinks = getCDCLinks(question)
  
  // Build combined sources
  const sources = [
    ...pubmedArticles.map(article => ({
      title: article.title,
      url: article.url,
      kind: 'pubmed' as const,
      pmid: article.pmid,
      year: article.year,
      journal: article.journal
    })),
    ...nhsLinks.map(link => ({
      title: link.title,
      url: link.url,
      kind: 'NHS' as const
    })),
    ...niceLinks.map(link => ({
      title: link.title,
      url: link.url,
      kind: 'NICE' as const
    })),
    ...cdcLinks.map(link => ({
      title: link.title,
      url: link.url,
      kind: 'CDC' as const
    })),
    ...kbMatch.nhsLinks.map(link => ({
      title: link.title,
      url: link.url,
      kind: 'NHS' as const
    })),
    ...kbMatch.niceLinks.map(link => ({
      title: link.title,
      url: link.url,
      kind: 'NICE' as const
    }))
  ]
  
  // Deduplicate sources by URL
  const uniqueSources = sources.filter((source, index, self) =>
    index === self.findIndex(s => s.url === source.url)
  )
  
  const response: AICoachResponse = {
    answer: {
      title: topic || 'General Support',
      plainEnglishSummary: kbMatch.summary,
      recommendations: [],
      internalLinks: kbMatch.internalLinks.map(l => ({
        title: l.title,
        path: l.url,
        reason: l.why,
        ctaLabel: 'Learn more'
      })),
      evidenceSnapshot: {
        nhsNice: kbMatch.summary,
        research: [],
        practicalSupports: kbMatch.actions,
        whenToSeekHelp: []
      },
      tailoredGuidance: {},
      practicalActions: kbMatch.actions,
      visualLearningCards: [],
      neurobreathTools: [],
      evidence: {
        nhsOrNice: uniqueSources.filter(s => s.kind === 'NHS' || s.kind === 'NICE'),
        pubmed: uniqueSources.filter(s => s.kind === 'pubmed')
      },
      sourceTrace: {},
      safetyNotice: SAFETY_NOTICE
    },
    meta: {
      cached: false,
      queryKey: generateQueryKey(question, topic, audience),
      coverage: {
        nhs: nhsLinks.length > 0,
        nice: niceLinks.length > 0,
        pubmed: pubmedArticles.length > 0
      },
      generatedAtISO: new Date().toISOString()
    }
  }
  
  // Cache the response
  setCached(response.meta.queryKey, response)
  
  return response
}


