'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, AlertTriangle, Sparkles, ShieldCheck, Bug } from 'lucide-react'
import type { AICoachAnswer } from '@/types/ai-coach'
import type { UserContext, Topic } from '@/types/user-context'
import { loadContext, saveContext } from '@/lib/user-context-storage'
import { extractContextFromQuestion } from '@/lib/context-extractor'
import { mergeContext } from '@/lib/prompt-builder'
import ContextSelector from '@/components/ai/ContextSelector'
import TopicSelector from '@/components/ai/TopicSelector'
import QuickPrompts from '@/components/ai/QuickPrompts'
import RecommendedResources, { type RecommendedResourceDisplay } from '@/components/ai/RecommendedResources'
import UrgentHelpPanel from './urgent-help-panel'
import AnswerCoverageBar from './answer-coverage-bar'
import EvidenceSnapshot from './evidence-snapshot'
import VisualLearningCards from './visual-learning-cards'
import { ExternalLink, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  answer?: AICoachAnswer
  resources?: RecommendedResourceDisplay[]
  coverage?: { nhs: boolean; nice: boolean; pubmed: boolean }
  debugInfo?: DebugInfo
}

interface DebugInfo {
  mode: 'typed' | 'quick_prompt' | 'cta'
  mergedContext: UserContext
  normalizedQuestion: string
  apiRoute: string
  timestamp: string
  quickPromptId?: string
}

type RecommendationPayload = {
  path: string
  title: string
  whoItsFor?: string
  whenToUse?: string
  howToDoIt?: string
}

function isRecommendationPayload(value: unknown): value is RecommendationPayload {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.path === 'string' && typeof v.title === 'string'
}

export default function AICoachChatV2() {
  const [context, setContext] = useState<UserContext>({ country: 'UK' })
  const [topic, setTopic] = useState<Topic>('other')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! Select your situation and topic below, then click "Get tailored plan" or choose a quick action. You can also type your own question.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  // Load context on mount
  useEffect(() => {
    const loaded = loadContext()
    setContext(loaded)
  }, [])

  // Save context when changed
  useEffect(() => {
    saveContext(context)
  }, [context])

  const updateContext = (updates: Partial<UserContext>) => {
    setContext(prev => ({ ...prev, ...updates }))
  }

  const resetContext = () => {
    setContext({ country: 'UK' })
  }

  const submitQuestion = async (
    userQuestion: string,
    quickPromptId?: string,
    mode: 'typed' | 'quick_prompt' | 'cta' = 'typed'
  ) => {
    // Allow empty submit for CTA and quick prompts
    if (mode === 'typed' && !userQuestion.trim()) return
    if (isLoading) return

    const displayContent = userQuestion.trim() || `[${mode === 'cta' ? 'Get tailored plan' : 'Quick action'}]`

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: displayContent
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Extract context from typed question (if provided)
      let finalContext = context
      if (userQuestion.trim()) {
        const extractedContext = extractContextFromQuestion(userQuestion, context)
        finalContext = mergeContext(context, extractedContext)
      }

      // Add topic to context
      finalContext = { ...finalContext, topic }

      const apiRoute = '/api/ai-coach'
      const payload = {
        userQuestion: userQuestion || undefined,
        quickPromptId,
        mode,
        userContext: finalContext,
        topic
      }

      // DEV-ONLY: Log payload before sending
      if (process.env.NODE_ENV === 'development') {
        console.debug('🚀 Client Payload:', payload)
      }

      const response = await fetch(apiRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store' // Prevent stale responses
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      // Extract recommended resources from answer
      const recommendationsUnknown: unknown = data?.answer?.recommendations
      const resources: RecommendedResourceDisplay[] = Array.isArray(recommendationsUnknown)
        ? recommendationsUnknown
            .filter(isRecommendationPayload)
            .map((r) => ({
              id: r.path,
              title: r.title,
              type: 'resource',
              url: r.path,
              whyThisFits: r.whoItsFor || r.whenToUse,
              howToUseThisWeek: r.howToDoIt || r.whenToUse
            }))
        : []

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer.title,
        answer: data.answer,
        resources,
        coverage: data.meta.coverage,
        debugInfo: {
          mode,
          mergedContext: finalContext,
          normalizedQuestion: userQuestion || `[${mode} mode]`,
          apiRoute,
          timestamp: new Date().toISOString(),
          quickPromptId
        }
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitQuestion(input, undefined, 'typed')
  }

  const handleCTAClick = async () => {
    await submitQuestion('', undefined, 'cta')
  }

  const handleQuickPromptSelect = async (promptId: string, label: string) => {
    await submitQuestion(label, promptId, 'quick_prompt')
  }

  return (
    <Card id="ai-chat" className="scroll-mt-20">
      <CardHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <CardTitle className="text-2xl">Ask the AI Coach</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Get tailored plans without typing. Select your situation and topic, then click "Get tailored plan" or choose a quick action.
            </p>
            <ul className="list-disc list-inside text-xs text-muted-foreground mt-4 space-y-1">
              <li>No typing required: context + topic = tailored plan</li>
              <li>Quick actions expand into full questions with your context</li>
              <li>Or type your own question for personalized answers</li>
            </ul>

            {/* Urgent Help Panel */}
            <div className="mt-4">
              <UrgentHelpPanel />
            </div>

            {/* Privacy Notice */}
            <div className="mt-4 flex items-start gap-2 p-3 bg-muted/50 rounded-md border">
              <ShieldCheck className="w-4 h-4 shrink-0 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong className="font-medium text-foreground">Privacy:</strong> Please do not share names, addresses, phone numbers, or identifiable medical records.
              </p>
            </div>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="pt-6 space-y-2">
              <div className="text-sm flex items-center gap-2">
                <strong>Status:</strong>
                <Badge variant="secondary">Ready · Zero-typing enabled</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Select context + topic, then click "Get tailored plan" to get a complete 7-day action plan without typing a word.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Context Selector */}
        <ContextSelector
          context={context}
          onUpdate={updateContext}
          onReset={resetContext}
        />

        {/* Topic Selector */}
        <TopicSelector topic={topic} onSelect={setTopic} />

        {/* Quick Prompts */}
        <QuickPrompts onSelect={handleQuickPromptSelect} />

        {/* Chat Messages */}
        <div className="border rounded-lg p-4 space-y-6 max-h-[600px] overflow-y-auto bg-muted/20">
          {messages.map(message => (
            <div key={message.id}>
              {message.type === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-primary text-primary-foreground rounded-lg p-4 shadow-sm">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-full bg-background rounded-lg p-4 shadow-sm space-y-4">
                    <p className="text-xs text-muted-foreground">AI Coach · now</p>

                    {message.answer ? (
                      <AnswerDisplay
                        answer={message.answer}
                        resources={message.resources}
                        coverage={message.coverage}
                        debugInfo={message.debugInfo}
                        showDebug={showDebug}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background rounded-lg p-4 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* DEV-ONLY: Debug Toggle */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="w-full"
          >
            <Bug className="w-4 h-4 mr-2" />
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </Button>
        )}

        {/* CTA Button + Chat Input */}
        <div className="space-y-2">
          <Button
            onClick={handleCTAClick}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get tailored plan
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or type your question
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="ai-question-input" className="sr-only">
              Your question
            </label>
            <Input
              id="ai-question-input"
              name="question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or type your own question..."
              disabled={isLoading}
              className="flex-1"
              aria-label="Type your question for the AI Coach"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </form>
        </div>

        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            This AI provides general educational information, not medical advice. In emergencies call 999 (UK) / 911 (US) or use NHS 111 / 988 Lifeline.
            Talk to your GP, paediatrician, SENCO, or licensed clinician for personalised care.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

interface AnswerDisplayProps {
  answer: AICoachAnswer
  resources?: RecommendedResourceDisplay[]
  coverage?: { nhs: boolean; nice: boolean; pubmed: boolean }
  debugInfo?: DebugInfo
  showDebug?: boolean
}

function AnswerDisplay({ answer, resources, coverage, debugInfo, showDebug }: AnswerDisplayProps) {
  return (
    <div className="space-y-4">
      {/* DEV-ONLY: Debug Panel */}
      {showDebug && debugInfo && process.env.NODE_ENV === 'development' && (
        <details className="border border-yellow-500 rounded p-3 bg-yellow-50 dark:bg-yellow-950">
          <summary className="cursor-pointer font-semibold text-sm flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug Info
          </summary>
          <div className="mt-2 space-y-2 text-xs font-mono">
            <div>
              <strong>Mode:</strong> {debugInfo.mode}
            </div>
            {debugInfo.quickPromptId && (
              <div>
                <strong>Quick Prompt ID:</strong> {debugInfo.quickPromptId}
              </div>
            )}
            <div>
              <strong>API Route:</strong> {debugInfo.apiRoute}
            </div>
            <div>
              <strong>Timestamp:</strong> {debugInfo.timestamp}
            </div>
            <div>
              <strong>Merged Context:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(debugInfo.mergedContext, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Normalized Question:</strong>
              <p className="mt-1 p-2 bg-muted rounded">{debugInfo.normalizedQuestion}</p>
            </div>
          </div>
        </details>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold whitespace-pre-wrap">{answer.title}</h3>

      {/* Coverage Bar */}
      {coverage && <AnswerCoverageBar coverage={coverage} />}

      {/* Plain English Summary */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Summary</h4>
        <div className="space-y-2">
          {answer.plainEnglishSummary.map((line, idx) => (
            <p key={idx} className="text-sm">{line}</p>
          ))}
        </div>
      </div>

      {/* Recommended Resources */}
      {resources && resources.length > 0 && (
        <RecommendedResources resources={resources} />
      )}

      {/* Evidence Snapshot */}
      <EvidenceSnapshot snapshot={answer.evidenceSnapshot} />

      {/* Tailored Guidance */}
      {Object.keys(answer.tailoredGuidance).length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Tailored Guidance</h4>
          {Object.entries(answer.tailoredGuidance).map(([aud, lines]) => (
            lines && lines.length > 0 && (
              <div key={aud} className="mb-3">
                <Badge variant="outline" className="mb-1">
                  {aud.replace('_', ' ')}
                </Badge>
                <ul className="text-sm space-y-1 ml-4">
                  {lines.map((line, idx) => (
                    <li key={idx}>• {line}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      )}

      {/* Practical Actions */}
      {answer.practicalActions.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Practical Actions</h4>
          <ul className="text-sm space-y-1">
            {answer.practicalActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Myths & Misunderstandings */}
      {answer.mythsAndMisunderstandings && answer.mythsAndMisunderstandings.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">Common Misunderstandings</h4>
          <ul className="text-sm space-y-1">
            {answer.mythsAndMisunderstandings.map((myth, idx) => (
              <li key={idx}>{myth}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Visual Learning Cards */}
      {answer.visualLearningCards.length > 0 && (
        <VisualLearningCards cards={answer.visualLearningCards} title={answer.title} />
      )}

      {/* Evidence & Sources */}
      {(answer.evidence.nhsOrNice.length > 0 || answer.evidence.pubmed.length > 0) && (
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Evidence & Sources
          </h4>
          <div className="space-y-3">
            {answer.evidence.nhsOrNice.map((source, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="text-xs shrink-0">
                  {source.kind}
                </Badge>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{source.title}</span>
                </a>
              </div>
            ))}
            {answer.evidence.pubmed.map((source, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="text-xs shrink-0">
                  PubMed
                </Badge>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>
                    {source.title}
                    {source.year && ` (${source.year})`}
                    {source.journal && ` · ${source.journal}`}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinician Notes (expandable) */}
      {answer.clinicianNotes && answer.clinicianNotes.length > 0 && (
        <details className="text-sm">
          <summary className="font-semibold cursor-pointer">Clinician Notes (expand)</summary>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {answer.clinicianNotes.map((note, idx) => (
              <li key={idx}>• {note}</li>
            ))}
          </ul>
        </details>
      )}

      {/* Safety Notice */}
      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription className="text-xs">{answer.safetyNotice}</AlertDescription>
      </Alert>
    </div>
  )
}

