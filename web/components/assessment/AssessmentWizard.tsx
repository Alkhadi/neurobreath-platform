'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  FileText,
  Sparkles,
  Brain,
  Activity,
  MessageSquare,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ORFReading } from './ORFReading'
import { WordListReading } from './WordListReading'
import { ComprehensionReading } from './ComprehensionReading'
import { AssessmentResult } from '@/components/assessment/AssessmentResult'
import {
  buildReadingProfile,
  ReadingProfile,
  ORFMetrics,
  ErrorMark,
  TRAINING_DISCLAIMER,
  LevelBand,
} from '@/lib/reading-profile'
import { getDeviceId } from '@/lib/device-id'
import {
  LearnerGroup,
  LEARNER_GROUPS,
  LEARNER_GROUP_ORDER,
} from '@/lib/placement-levels'
import { calculatePlacement, PlacementResult } from '@/lib/placement-rubric'
import { generatePlacementPlan, PlacementPlan } from '@/lib/placement-plan'

// Types
interface Passage {
  id: string
  title: string
  text: string
  wordCount: number
  levelBand: string
}

interface WordList {
  id: string
  title: string
  words: string[]
  levelBand: string
  category?: string
}

interface ComprehensionQuestion {
  id: string
  prompt: string
  choices: { index: number; text: string }[]
  correctChoiceIndex: number
  explanation?: string
  questionType: 'literal' | 'inferential' | 'vocab' | 'sequence' | 'main-idea'
  difficulty: string
}

interface AssessmentData {
  orf?: {
    passageId: string
    metrics: ORFMetrics
    errors: ErrorMark[]
    durationSeconds: number
  }
  wordList?: {
    wordListId: string
    responses: { itemText: string; isCorrect: boolean; responseTimeMs?: number }[]
    totalItems: number
    correctItems: number
    durationSeconds: number
  }
  pseudowords?: {
    wordListId: string
    responses: { itemText: string; isCorrect: boolean; responseTimeMs?: number }[]
    totalItems: number
    correctItems: number
    durationSeconds: number
  }
  comprehension?: {
    passageId: string
    responses: { questionId: string; selectedIndex: number; isCorrect: boolean; questionType: string }[]
    totalQuestions: number
    correctAnswers: number
    byType: Record<string, { correct: number; total: number }>
  }
}

type AssessmentPart = 'orf' | 'wordList' | 'pseudowords' | 'comprehension'
type WizardPhase = 'setup' | 'running' | 'result'

interface AssessmentWizardProps {
  passages: Passage[]
  wordLists: WordList[]
  pseudowordLists: WordList[]
  questionsMap: Record<string, ComprehensionQuestion[]>
  onComplete?: (profile: ReadingProfile, data: AssessmentData, placement?: PlacementResult, plan?: PlacementPlan) => void
  onCancel?: () => void
}

const PARTS_CONFIG: { key: AssessmentPart; label: string; icon: React.ElementType; description: string; minMinutes: number }[] = [
  { key: 'orf', label: 'Oral Reading Fluency', icon: Activity, description: 'Timed passage reading with error marking', minMinutes: 2 },
  { key: 'wordList', label: 'Word Recognition', icon: FileText, description: 'Read real words accurately', minMinutes: 1 },
  { key: 'pseudowords', label: 'Decoding', icon: Brain, description: 'Decode made-up words using phonics', minMinutes: 1 },
  { key: 'comprehension', label: 'Comprehension', icon: MessageSquare, description: 'Answer questions about the passage', minMinutes: 2 },
]

export function AssessmentWizard({
  passages,
  wordLists,
  pseudowordLists,
  questionsMap,
  onComplete,
  onCancel,
}: AssessmentWizardProps) {
  const [phase, setPhase] = useState<WizardPhase>('setup')
  const [learnerGroup, setLearnerGroup] = useState<LearnerGroup>('youth')
  const [targetBand, setTargetBand] = useState<LevelBand>('elementary')
  const [selectedParts, setSelectedParts] = useState<AssessmentPart[]>(['orf', 'wordList', 'pseudowords', 'comprehension'])
  const [currentPartIdx, setCurrentPartIdx] = useState(0)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({})
  const [readingProfile, setReadingProfile] = useState<ReadingProfile | null>(null)
  const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null)
  const [placementPlan, setPlacementPlan] = useState<PlacementPlan | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Get content for current band
  const currentPassage = passages.find(p => p.levelBand === targetBand) || passages[0]
  const currentWordList = wordLists.find(w => w.levelBand === targetBand) || wordLists[0]
  const currentPseudowordList = pseudowordLists.find(p => p.levelBand === targetBand) || pseudowordLists[0]
  const currentQuestions = questionsMap[currentPassage?.id] || []
  
  const currentPart = selectedParts[currentPartIdx]
  const progress = phase === 'running' ? ((currentPartIdx + 1) / selectedParts.length) * 100 : 0
  
  const togglePart = useCallback((part: AssessmentPart) => {
    setSelectedParts(prev => {
      if (prev.includes(part)) {
        return prev.filter(p => p !== part)
      } else {
        return [...prev, part]
      }
    })
  }, [])
  
  const estimatedTime = selectedParts.reduce((sum, part) => {
    const config = PARTS_CONFIG.find(c => c.key === part)
    return sum + (config?.minMinutes || 1)
  }, 0)
  
  const startAssessment = useCallback(() => {
    if (selectedParts.length === 0) return
    setPhase('running')
    setCurrentPartIdx(0)
    setAssessmentData({})
  }, [selectedParts])
  
  const handlePartComplete = useCallback((partKey: AssessmentPart, data: unknown) => {
    setAssessmentData(prev => ({
      ...prev,
      [partKey]: data,
    }))
    
    if (currentPartIdx < selectedParts.length - 1) {
      setCurrentPartIdx(prev => prev + 1)
    } else {
      // All parts complete - calculate profile
      const updatedData = { ...assessmentData, [partKey]: data }
      
      const profile = buildReadingProfile({
        decodingCorrect: updatedData.pseudowords?.correctItems,
        decodingTotal: updatedData.pseudowords?.totalItems,
        wordRecognitionCorrect: updatedData.wordList?.correctItems,
        wordRecognitionTotal: updatedData.wordList?.totalItems,
        orfMetrics: updatedData.orf?.metrics,
        comprehensionCorrect: updatedData.comprehension?.correctAnswers,
        comprehensionTotal: updatedData.comprehension?.totalQuestions,
      })
      
      // Calculate placement result
      const placement = calculatePlacement({
        learnerGroup,
        profile,
      })
      
      // Generate placement plan
      const plan = generatePlacementPlan(placement)
      
      setReadingProfile(profile)
      setPlacementResult(placement)
      setPlacementPlan(plan)
      setAssessmentData(updatedData)
      void saveAssessment(profile, updatedData, placement, plan)
      setPhase('result')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPartIdx, selectedParts, assessmentData, learnerGroup])
  
  const handlePartCancel = useCallback(() => {
    // Allow skipping a part
    if (currentPartIdx < selectedParts.length - 1) {
      setCurrentPartIdx(prev => prev + 1)
    } else {
      // All parts done (or skipped) - show results with what we have
      const profile = buildReadingProfile({
        decodingCorrect: assessmentData.pseudowords?.correctItems,
        decodingTotal: assessmentData.pseudowords?.totalItems,
        wordRecognitionCorrect: assessmentData.wordList?.correctItems,
        wordRecognitionTotal: assessmentData.wordList?.totalItems,
        orfMetrics: assessmentData.orf?.metrics,
        comprehensionCorrect: assessmentData.comprehension?.correctAnswers,
        comprehensionTotal: assessmentData.comprehension?.totalQuestions,
      })
      
      // Calculate placement even with partial data
      const placement = calculatePlacement({
        learnerGroup,
        profile,
      })
      const plan = generatePlacementPlan(placement)
      
      setReadingProfile(profile)
      setPlacementResult(placement)
      setPlacementPlan(plan)
      void saveAssessment(profile, assessmentData, placement, plan)
      setPhase('result')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPartIdx, selectedParts, assessmentData, learnerGroup])
  
  const saveAssessment = async (
    profile: ReadingProfile, 
    data: AssessmentData,
    placement?: PlacementResult,
    plan?: PlacementPlan
  ) => {
    setIsSaving(true)
    try {
      const deviceId = getDeviceId()
      
      // Calculate total duration
      const totalDuration = (data.orf?.durationSeconds || 0) +
        (data.wordList?.durationSeconds || 0) +
        (data.pseudowords?.durationSeconds || 0)
      
      const response = await fetch('/api/assessment/save-full-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          assessmentType: 'fullCheckIn',
          learnerGroup,
          levelBandTarget: targetBand,
          levelBandResult: profile.overallBand,
          confidence: profile.confidence,
          durationSeconds: totalDuration,
          
          // ORF data
          passageId: data.orf?.passageId,
          totalWords: data.orf?.metrics.totalWords || 0,
          wordsCorrect: data.orf?.metrics.wordsCorrect || 0,
          errorsTotal: data.orf?.metrics.errorsTotal || 0,
          accuracyPct: data.orf?.metrics.accuracyPct || 0,
          wcpm: data.orf?.metrics.wcpm || 0,
          selfCorrections: data.orf?.metrics.selfCorrections || 0,
          errorDetails: data.orf?.errors || [],
          
          // Word list data
          wordListId: data.wordList?.wordListId,
          wordResponses: data.wordList?.responses?.map(r => ({
            itemType: 'word',
            itemText: r.itemText,
            isCorrect: r.isCorrect,
            responseTimeMs: r.responseTimeMs,
          })) || [],
          
          // Pseudoword data
          pseudowordListId: data.pseudowords?.wordListId,
          pseudowordResponses: data.pseudowords?.responses?.map(r => ({
            itemType: 'pseudoword',
            itemText: r.itemText,
            isCorrect: r.isCorrect,
            responseTimeMs: r.responseTimeMs,
          })) || [],
          
          // Comprehension data
          comprehensionCorrect: data.comprehension?.correctAnswers || 0,
          comprehensionTotal: data.comprehension?.totalQuestions || 0,
          comprehensionResponses: data.comprehension?.responses || [],
          
          // Profile
          readingProfile: {
            decoding: profile.decoding,
            wordRecognition: profile.wordRecognition,
            fluency: profile.fluency,
            comprehension: profile.comprehension,
          },
          strengthsNeeds: {
            strengths: profile.strengths,
            needs: profile.needs,
            suggestedFocus: profile.suggestedFocus,
          },
          readingLevelBand: profile.overallBand,
          
          // Placement data (new)
          placementLevel: placement?.level,
          placementConfidence: placement?.confidence,
          placementPlanJson: plan,
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setAttemptId(result.attempt?.id)
      }
    } catch (error) {
      console.error('Error saving assessment:', error)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleFinish = useCallback(() => {
    if (onComplete && readingProfile) {
      onComplete(readingProfile, assessmentData, placementResult ?? undefined, placementPlan ?? undefined)
    }
  }, [onComplete, readingProfile, assessmentData, placementResult, placementPlan])
  
  // Setup Phase
  if (phase === 'setup') {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Reading Check-In
          </CardTitle>
          <CardDescription>
            A multi-part assessment to evaluate your reading skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Disclaimer */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Training & Monitoring Only</p>
                <p>{TRAINING_DISCLAIMER}</p>
              </div>
            </div>
          </div>
          
          {/* Learner Group Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <label className="font-medium">Who is this assessment for?</label>
            </div>
            <p className="text-sm text-muted-foreground">
              Select the age group to ensure content is appropriate and placement is weighted correctly.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LEARNER_GROUP_ORDER.map(group => {
                const config = LEARNER_GROUPS[group]
                return (
                  <Button
                    key={group}
                    variant={learnerGroup === group ? 'default' : 'outline'}
                    onClick={() => setLearnerGroup(group)}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs opacity-80">{config.ageRange}</span>
                  </Button>
                )
              })}
            </div>
          </div>
          
          {/* Target Level */}
          <div className="space-y-3">
            <label className="font-medium">Starting Level</label>
            <p className="text-sm text-muted-foreground">
              Choose your estimated reading level. The assessment will adjust if needed.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['beginner', 'elementary', 'intermediate', 'advanced'] as LevelBand[]).map(band => (
                <Button
                  key={band}
                  variant={targetBand === band ? 'default' : 'outline'}
                  onClick={() => setTargetBand(band)}
                  className="capitalize"
                >
                  {band}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Parts Selection */}
          <div className="space-y-3">
            <label className="font-medium">Assessment Parts</label>
            <p className="text-sm text-muted-foreground">
              Select which parts to include. All parts are recommended for a complete profile.
            </p>
            <div className="space-y-2">
              {PARTS_CONFIG.map(part => {
                const Icon = part.icon
                const isSelected = selectedParts.includes(part.key)
                
                return (
                  <button
                    key={part.key}
                    onClick={() => togglePart(part.key)}
                    className={cn(
                      'w-full p-4 rounded-lg border-2 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{part.label}</div>
                        <div className="text-sm text-muted-foreground">{part.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">~{part.minMinutes} min</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Time Estimate */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Estimated Time</span>
              </div>
              <span className="text-lg font-bold">{estimatedTime}-{estimatedTime + 4} minutes</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              onClick={startAssessment}
              disabled={selectedParts.length === 0}
              className="gap-2 ml-auto"
            >
              <Play className="w-4 h-4" />
              Begin Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Running Phase - Show current part
  if (phase === 'running') {
    return (
      <div className="space-y-4">
        {/* Progress Header */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Part {currentPartIdx + 1} of {selectedParts.length}
                </span>
                <Badge variant="outline" className="capitalize">{targetBand}</Badge>
              </div>
              <div className="flex gap-1">
                {selectedParts.map((part, idx) => {
                  const config = PARTS_CONFIG.find(c => c.key === part)
                  const Icon = config?.icon || BookOpen
                  const isDone = idx < currentPartIdx || (idx === currentPartIdx && !!assessmentData[part])
                  const isCurrent = idx === currentPartIdx
                  
                  return (
                    <div
                      key={part}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        isDone && 'bg-green-100 text-green-600 dark:bg-green-900/30',
                        isCurrent && !isDone && 'bg-primary text-primary-foreground',
                        !isDone && !isCurrent && 'bg-muted text-muted-foreground'
                      )}
                      title={config?.label}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                  )
                })}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
        
        {/* Current Part Component */}
        {currentPart === 'orf' && currentPassage && (
          <ORFReading
            passage={currentPassage}
            onComplete={(data) => handlePartComplete('orf', data)}
            onCancel={handlePartCancel}
          />
        )}
        
        {currentPart === 'wordList' && currentWordList && (
          <WordListReading
            wordList={currentWordList}
            itemType="word"
            onComplete={(data) => handlePartComplete('wordList', data)}
            onCancel={handlePartCancel}
          />
        )}
        
        {currentPart === 'pseudowords' && currentPseudowordList && (
          <WordListReading
            wordList={currentPseudowordList}
            itemType="pseudoword"
            onComplete={(data) => handlePartComplete('pseudowords', data)}
            onCancel={handlePartCancel}
          />
        )}
        
        {currentPart === 'comprehension' && currentPassage && currentQuestions.length > 0 && (
          <ComprehensionReading
            passage={currentPassage}
            questions={currentQuestions}
            onComplete={(data) => handlePartComplete('comprehension', data)}
            onCancel={handlePartCancel}
          />
        )}
      </div>
    )
  }
  
  // Result Phase
  if (phase === 'result' && readingProfile) {
    return (
      <AssessmentResult
        profile={readingProfile}
        data={assessmentData}
        attemptId={attemptId}
        isSaving={isSaving}
        placement={placementResult ?? undefined}
        plan={placementPlan ?? undefined}
        onFinish={handleFinish}
        onStartPlan={() => {
          // Navigate to training/lessons page
          window.location.href = '/dyslexia-reading-training'
        }}
      />
    )
  }
  
  return null
}
