'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Play,
  History,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Clock,
  CheckCircle2,
  Activity,
  FileText,
  Brain,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssessmentWizard } from './assessment/AssessmentWizard'
import { SHORT_DISCLAIMER, ReadingProfile, getBandDisplay } from '@/lib/reading-profile'
import { getDeviceId } from '@/lib/device-id'

// Sample data - in production this would come from the database
import {
  SAMPLE_PASSAGES,
  SAMPLE_WORD_LISTS,
  COMPREHENSION_QUESTIONS,
} from '@/lib/reading-assessment-seed'

// Type definitions for expanded data
interface ExpandedPassage {
  id: string
  title: string
  levelBand: string
  text: string
  wordCount: number
  license: string
  sourceAttribution: string
  tags: string[]
}

interface ExpandedWordList {
  id: string
  title: string
  levelBand: string
  category?: string
  words: string[]
  license: string
}

interface ExpandedQuestion {
  id: string
  passageId: string
  prompt: string
  choices: string[]
  correctChoiceIndex: number
  difficulty: string
  questionType: string
  explanation: string
}

// Initialize with empty arrays - will be populated if module loads
let EXPANDED_PASSAGES: ExpandedPassage[] = []
let EXPANDED_WORD_LISTS: ExpandedWordList[] = []
let EXPANDED_COMPREHENSION_QUESTIONS: ExpandedQuestion[] = []

// Try to load expanded data (workaround for TS server caching)
if (typeof window !== 'undefined' || typeof process !== 'undefined') {
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    /* eslint-disable @typescript-eslint/no-var-requires */
    const expanded = require('../lib/reading-assessment-seed-expanded')
    /* eslint-enable @typescript-eslint/no-require-imports */
    /* eslint-enable @typescript-eslint/no-var-requires */
    EXPANDED_PASSAGES = expanded.EXPANDED_PASSAGES || []
    EXPANDED_WORD_LISTS = expanded.EXPANDED_WORD_LISTS || []
    EXPANDED_COMPREHENSION_QUESTIONS = expanded.EXPANDED_COMPREHENSION_QUESTIONS || []
  } catch {
    // Module not available, use empty arrays
  }
}

interface RecentAttempt {
  id: string
  assessmentType: string
  levelBandResult: string | null
  confidence: string | null
  accuracyPct: number
  wcpm: number
  comprehensionScore: number
  durationSeconds: number
  createdAt: string
}

export function ReadingCheckIn() {
  const [isAssessmentActive, setIsAssessmentActive] = useState(false)
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([])
  const [, setIsLoading] = useState(true)
  
  // Load recent attempts
  useEffect(() => {
    async function loadRecentAttempts() {
      try {
        const deviceId = getDeviceId()
        const response = await fetch(
          `/api/assessment/save-full-attempt?deviceId=${deviceId}&limit=5`,
          {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          }
        )
        
        const data = await response.json()
        
        // Check if DB is unavailable (now returns 200 with flag)
        if (data?.dbUnavailable) {
          setRecentAttempts([])
          return
        }
        
        setRecentAttempts(data.attempts || [])
      } catch (error) {
        // Silently handle errors in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('[ReadingCheckIn] Assessment data unavailable (this is normal without a database)')
        }
        setRecentAttempts([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadRecentAttempts()
  }, [isAssessmentActive])
  
  // Prepare assessment data
  // Combine sample and expanded data
  const allPassages = [...SAMPLE_PASSAGES, ...(EXPANDED_PASSAGES || [])].map(p => ({
    id: p.id,
    title: p.title,
    text: p.text,
    wordCount: p.wordCount,
    levelBand: p.levelBand,
  }))
  
  const allWordLists = [...SAMPLE_WORD_LISTS, ...(EXPANDED_WORD_LISTS || [])].map(w => ({
    id: w.id,
    title: w.title,
    words: w.words,
    levelBand: w.levelBand,
    category: (w as { category?: string }).category,
  }))
  
  // Generate pseudoword lists based on patterns
  const pseudowordLists = [
    {
      id: 'pseudo-beginner',
      title: 'CVC Pseudowords',
      levelBand: 'beginner',
      words: ['bim', 'dop', 'feg', 'gat', 'hib', 'jom', 'kep', 'laf', 'mip', 'nud', 
              'pog', 'rab', 'sif', 'tem', 'vop', 'wab', 'yem', 'zat', 'bun', 'cav'],
    },
    {
      id: 'pseudo-elementary',
      title: 'CVCC/CCVC Pseudowords',
      levelBand: 'elementary',
      words: ['blap', 'crem', 'drif', 'flom', 'glab', 'plim', 'smod', 'treb', 'clad', 'frop',
              'brip', 'slan', 'grom', 'plet', 'stig', 'flad', 'clob', 'trin', 'spem', 'glan'],
    },
    {
      id: 'pseudo-intermediate',
      title: 'Multi-syllable Pseudowords',
      levelBand: 'intermediate',
      words: ['tobling', 'frample', 'stindor', 'blempish', 'crandel', 'frondic', 'glimper', 'stramble',
              'trindel', 'plomber', 'crindish', 'flomple', 'grindel', 'strample', 'blondic', 'trimble',
              'frondel', 'clomber', 'stindish', 'grample'],
    },
    {
      id: 'pseudo-advanced',
      title: 'Complex Pseudowords',
      levelBand: 'advanced',
      words: ['strindication', 'fromplexity', 'blomplication', 'trindishment', 'clomprehensive',
              'strindological', 'frompetition', 'blombistrious', 'grindelicious', 'stramplective',
              'frondamental', 'climberdation', 'strindification', 'blompositive', 'grinderminate',
              'fromplishment', 'strimplexity', 'clondemption', 'trindercation', 'blompetence'],
    },
  ]
  
  // Build questions map
  const allQuestions = [...COMPREHENSION_QUESTIONS, ...(EXPANDED_COMPREHENSION_QUESTIONS || [])]
  const questionsMap: Record<string, {
    id: string
    prompt: string
    choices: { index: number; text: string }[]
    correctChoiceIndex: number
    explanation?: string
    questionType: 'literal' | 'inferential' | 'vocab' | 'sequence' | 'main-idea'
    difficulty: string
  }[]> = {}
  
  for (const q of allQuestions) {
    if (!questionsMap[q.passageId]) {
      questionsMap[q.passageId] = []
    }
    questionsMap[q.passageId].push({
      id: q.id,
      prompt: q.prompt,
      choices: q.choices.map((text: string, index: number) => ({ index, text })),
      correctChoiceIndex: q.correctChoiceIndex,
      explanation: q.explanation,
      questionType: ((q as { questionType?: string }).questionType || 'literal') as 'literal' | 'inferential' | 'vocab' | 'sequence' | 'main-idea',
      difficulty: q.difficulty,
    })
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCompleteAssessment = useCallback((_profile: ReadingProfile) => {
    setIsAssessmentActive(false)
    // Refresh recent attempts
  }, [])
  
  const handleCancelAssessment = useCallback(() => {
    setIsAssessmentActive(false)
  }, [])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Show assessment wizard when active
  if (isAssessmentActive) {
    return (
      <AssessmentWizard
        passages={allPassages}
        wordLists={allWordLists}
        pseudowordLists={pseudowordLists}
        questionsMap={questionsMap}
        onComplete={handleCompleteAssessment}
        onCancel={handleCancelAssessment}
      />
    )
  }

  // Show dashboard
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Reading Check-In
        </CardTitle>
        <CardDescription>
          A comprehensive assessment of your reading skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Start Assessment CTA */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Take a Reading Check-In</h3>
              <p className="text-sm text-muted-foreground">
                Assess your reading across fluency, decoding, word recognition, and comprehension.
                Takes 6-12 minutes.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  6-12 min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  4 parts
                </span>
              </div>
            </div>
            <Button 
              type="button"
              onClick={() => {
                console.log('Start Check-In clicked!')
                setIsAssessmentActive(true)
              }} 
              size="lg" 
              className="gap-2 relative z-10"
            >
              <Play className="w-5 h-5" />
              Start Check-In
            </Button>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Training & Monitoring Only.</strong> {SHORT_DISCLAIMER} For formal diagnosis, consult a qualified professional.
            </p>
          </div>
        </div>
        
        {/* Recent Results */}
        {recentAttempts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Check-Ins
            </h4>
            <div className="space-y-2">
              {recentAttempts.slice(0, 3).map(attempt => {
                const bandDisplay = attempt.levelBandResult 
                  ? getBandDisplay(attempt.levelBandResult as 'beginner' | 'elementary' | 'intermediate' | 'advanced')
                  : null
                
                return (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        bandDisplay?.bgColor || 'bg-muted'
                      )}>
                        {bandDisplay ? (
                          <CheckCircle2 className={cn('w-5 h-5', bandDisplay.color)} />
                        ) : (
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {bandDisplay && (
                            <Badge className={cn(bandDisplay.bgColor, bandDisplay.color, 'border-0')}>
                              {bandDisplay.label}
                            </Badge>
                          )}
                          {attempt.confidence && (
                            <span className="text-xs text-muted-foreground">
                              ({attempt.confidence} confidence)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(attempt.createdAt)} • {formatTime(attempt.durationSeconds)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{Math.round(attempt.accuracyPct)}% accuracy</div>
                      {attempt.wcpm > 0 && (
                        <div className="text-muted-foreground">{Math.round(attempt.wcpm)} WCPM</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {recentAttempts.length > 3 && (
              <Button variant="outline" className="w-full gap-2">
                View All History
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* What's Assessed */}
        <div className="space-y-3">
          <h4 className="font-medium">What's Assessed</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Oral Reading', desc: 'Timed passage reading', icon: Activity, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
              { label: 'Word Recognition', desc: 'Real word reading', icon: FileText, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
              { label: 'Decoding', desc: 'Pseudoword reading', icon: Brain, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
              { label: 'Comprehension', desc: 'Understanding questions', icon: MessageSquare, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="p-4 border rounded-lg text-center space-y-2 hover:border-primary/50 transition-colors">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mx-auto', item.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
