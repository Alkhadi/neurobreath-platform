'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, ExternalLink, AlertTriangle, BookOpen, FileText, ShieldCheck } from 'lucide-react'
import type { AICoachAnswer, AudienceType } from '@/types/ai-coach'
import { useUserContext } from '@/hooks/useUserContext'
import { extractContextFromQuestion } from '@/lib/context-extractor'
import { mergeContext, buildStructuredPrompt } from '@/lib/prompt-builder'
import ContextChips from '@/components/ai-coach/context-chips'
import AudienceToggle from './audience-toggle'
import PromptChips from './prompt-chips'
import EvidenceSnapshot from './evidence-snapshot'
import VisualLearningCards from './visual-learning-cards'
import AnswerCoverageBar from './answer-coverage-bar'
import UrgentHelpPanel from './urgent-help-panel'
import HowToAskGuide from './how-to-ask-guide'
import RecommendationsDisplay from './recommendations-display'
import SevenDayPlan from './seven-day-plan'
import ThirtyDayChallenge from './thirty-day-challenge'
import InternalLinksDisplay from './internal-links-display'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  answer?: AICoachAnswer
  coverage?: { nhs: boolean; nice: boolean; pubmed: boolean }
}

export default function AICoachChat() {
  const pathname = usePathname()
  const { context, updateContext, resetContext, summary, isLoaded } = useUserContext()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! Ask me anything about autism, ADHD, breathing routines, sleep hygiene, or workplace supports. I will cite reliable UK & US sources and keep things easy to digest.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [audience, setAudience] = useState<AudienceType | undefined>()
  const [topic, setTopic] = useState<string>('')
  const [selectedQuickPrompt, setSelectedQuickPrompt] = useState<string | undefined>()

  const submitQuestion = async (questionText: string, quickPrompt?: string) => {
    if (!questionText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: questionText.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Extract context from question
      const extractedContext = extractContextFromQuestion(questionText, context)
      
      // Merge explicit (chip) context with inferred context
      // Explicit always overrides inferred
      const mergedContext = mergeContext(context, extractedContext)
      
      // Build structured prompt
      const structuredPrompt = buildStructuredPrompt({
        message: questionText,
        quickPrompt,
        userContext: mergedContext,
        pageContext: {
          pageKey: 'blog',
          pageType: 'blog',
          pathname: pathname || '/blog',
          title: 'AI Blog & Q&A'
        },
        audienceMode: audience
      })

      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          structuredPrompt,
          userContext: mergedContext,
          topic: topic || undefined,
          audience: audience || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer.title,
        answer: data.answer,
        coverage: data.meta.coverage
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ])
    } finally {
      setIsLoading(false)
      setSelectedQuickPrompt(undefined)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitQuestion(input, selectedQuickPrompt)
  }

  const handlePromptSelect = async (prompt: string) => {
    setSelectedQuickPrompt(prompt)
    setInput(prompt)
    // Auto-submit when quick prompt is selected
    await submitQuestion(prompt, prompt)
  }

  return (
    <Card id="ai-chat" className="scroll-mt-20">
      <CardHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <CardTitle className="text-2xl">Ask the AI Coach</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Evidence-led answers with NHS/NICE first (UK). Citations are provided for factual claims; if evidence is uncertain or mixed, we will say so.
            </p>
            <ul className="list-disc list-inside text-xs text-muted-foreground mt-4 space-y-1">
              <li>Scope: educational info only, not medical advice</li>
              <li>Escalation: prompts crisis help for self-harm/safety concerns</li>
              <li>Sources: prioritises Google Scholar, PubMed, NHS, NICE, CDC, NIH, APA, university centres</li>
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
                <Badge variant="secondary">Ready for real-time Q&A</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Answers include: plain-English summary, practical actions, internal links, and optional clinician notes.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Context Chips */}
        {isLoaded && (
          <ContextChips
            context={context}
            onUpdate={updateContext}
            onReset={resetContext}
            summary={summary}
          />
        )}

        {/* Audience Toggle */}
        <AudienceToggle value={audience} onChange={setAudience} />

        {/* Prompt Chips */}
        <PromptChips onSelect={handlePromptSelect} />

        {/* Topic Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="topic-select-filter" className="text-sm font-medium">Topic:</label>
          <select
            id="topic-select-filter"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
            aria-label="Select topic filter"
          >
            <option value="">All topics</option>
            <option value="autism">Autism</option>
            <option value="adhd">ADHD</option>
            <option value="dyslexia">Dyslexia</option>
            <option value="anxiety">Anxiety</option>
            <option value="depression">Depression</option>
            <option value="stress">Stress</option>
            <option value="sleep">Sleep</option>
            <option value="breathing">Breathing</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="mood">Mood</option>
          </select>
        </div>

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
                      <AnswerDisplay answer={message.answer} coverage={message.coverage} />
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

        {/* How to Ask Guide */}
        <HowToAskGuide />

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="ai-question-input" className="sr-only">
            Your question
          </label>
          <Input
            id="ai-question-input"
            name="question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Type your question for the AI Coach"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </form>

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
  coverage?: { nhs: boolean; nice: boolean; pubmed: boolean }
}

function AnswerDisplay({ answer, coverage }: AnswerDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold">{answer.title}</h3>

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

      {/* Best-Fit Recommendations (NEW) */}
      {answer.recommendations && answer.recommendations.length > 0 && (
        <RecommendationsDisplay recommendations={answer.recommendations} />
      )}

      {/* Internal Links (NEW) */}
      {answer.internalLinks && answer.internalLinks.length > 0 && (
        <InternalLinksDisplay links={answer.internalLinks} />
      )}

      {/* 7-Day Plan (NEW) */}
      {answer.sevenDayPlan && answer.sevenDayPlan.length > 0 && (
        <SevenDayPlan plan={answer.sevenDayPlan} />
      )}

      {/* 30-Day Challenge (NEW) */}
      {answer.thirtyDayChallenge && (
        <ThirtyDayChallenge challenge={answer.thirtyDayChallenge} />
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

      {/* Optional NeuroBreath Tools */}
      {answer.neurobreathTools.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Optional NeuroBreath Tools You May Find Useful
          </h4>
          <div className="space-y-2">
            {answer.neurobreathTools.map((tool, idx) => (
              <div key={idx} className="text-sm">
                <Link href={tool.url} className="text-blue-600 hover:underline font-medium">
                  {tool.title}
                </Link>
                <p className="text-muted-foreground text-xs">{tool.why}</p>
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

      {/* Follow-Up Questions (NEW) */}
      {answer.followUpQuestions && answer.followUpQuestions.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-2">Need more specific guidance?</h4>
          <div className="space-y-2">
            {answer.followUpQuestions.map((question, idx) => (
              <Badge key={idx} variant="outline" className="text-xs mr-2">
                {question}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            💡 Answer these to get more tailored recommendations
          </p>
        </div>
      )}
    </div>
  )
}
