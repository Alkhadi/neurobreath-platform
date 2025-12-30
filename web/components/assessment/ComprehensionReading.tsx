'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Lightbulb,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHORT_DISCLAIMER } from '@/lib/reading-profile'

interface ComprehensionQuestion {
  id: string
  prompt: string
  choices: { index: number; text: string }[]
  correctChoiceIndex: number
  explanation?: string
  questionType: 'literal' | 'inferential' | 'vocab' | 'sequence' | 'main-idea'
  difficulty: string
}

interface QuestionResponse {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
  questionType: string
}

interface ComprehensionReadingProps {
  passage: {
    id: string
    title: string
    text: string
    levelBand: string
  }
  questions: ComprehensionQuestion[]
  onComplete: (data: {
    passageId: string
    responses: QuestionResponse[]
    totalQuestions: number
    correctAnswers: number
    byType: Record<string, { correct: number; total: number }>
  }) => void
  onCancel: () => void
}

const QUESTION_TYPE_LABELS: Record<string, { label: string; color: string; description: string }> = {
  literal: {
    label: 'Literal',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    description: 'Information directly stated in the text',
  },
  inferential: {
    label: 'Inferential',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    description: 'Reading between the lines',
  },
  vocab: {
    label: 'Vocabulary',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    description: 'Word meaning in context',
  },
  sequence: {
    label: 'Sequence',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
    description: 'Order of events',
  },
  'main-idea': {
    label: 'Main Idea',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200',
    description: 'Central theme or message',
  },
}

export function ComprehensionReading({ passage, questions, onComplete, onCancel }: ComprehensionReadingProps) {
  const [phase, setPhase] = useState<'reading' | 'questions' | 'review'>('reading')
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  
  // Settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bgTint, _setBgTint] = useState<'white' | 'cream' | 'blue' | 'green'>('cream')
  
  const currentQuestion = questions[currentQuestionIdx]
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100
  
  const handleStartQuestions = useCallback(() => {
    setPhase('questions')
    setCurrentQuestionIdx(0)
    setResponses([])
  }, [])
  
  const handleSelectAnswer = useCallback((choiceIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(choiceIndex)
  }, [showFeedback])
  
  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) return
    
    const isCorrect = selectedAnswer === currentQuestion.correctChoiceIndex
    
    setResponses(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: selectedAnswer,
        isCorrect,
        questionType: currentQuestion.questionType,
      }
    ])
    
    setShowFeedback(true)
  }, [selectedAnswer, currentQuestion])
  
  const handleNextQuestion = useCallback(() => {
    setShowFeedback(false)
    setShowExplanation(false)
    setSelectedAnswer(null)
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      setPhase('review')
    }
  }, [currentQuestionIdx, questions.length])
  
  const handleComplete = useCallback(() => {
    // Calculate stats by question type
    const byType: Record<string, { correct: number; total: number }> = {}
    
    for (const response of responses) {
      if (!byType[response.questionType]) {
        byType[response.questionType] = { correct: 0, total: 0 }
      }
      byType[response.questionType].total++
      if (response.isCorrect) {
        byType[response.questionType].correct++
      }
    }
    
    const correctAnswers = responses.filter(r => r.isCorrect).length
    
    onComplete({
      passageId: passage.id,
      responses,
      totalQuestions: questions.length,
      correctAnswers,
      byType,
    })
  }, [responses, passage.id, questions.length, onComplete])
  
  // Font size classes
  const fontSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[fontSize]
  
  // Background tint classes
  const bgTintClass = {
    white: 'bg-white dark:bg-gray-900',
    cream: 'bg-amber-50 dark:bg-amber-950/20',
    blue: 'bg-blue-50 dark:bg-blue-950/20',
    green: 'bg-green-50 dark:bg-green-950/20',
  }[bgTint]

  // Reading Phase - Show passage first
  if (phase === 'reading') {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Read the Passage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{passage.title}</h3>
                <Badge variant="outline">{passage.levelBand}</Badge>
              </div>
              <div className="flex gap-2">
                {(['normal', 'large', 'xlarge'] as const).map(size => (
                  <Button
                    key={size}
                    variant={fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFontSize(size)}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={bgTintClass}>
          <CardContent className="py-8 px-6 md:px-12">
            <p className={cn(fontSizeClass, 'leading-relaxed font-serif')}>
              {passage.text}
            </p>
          </CardContent>
        </Card>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Info className="w-4 h-4 inline mr-2 text-blue-600" />
          <span className="text-sm">
            Read the passage carefully. You'll answer {questions.length} questions about it.
          </span>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleStartQuestions} className="gap-2">
            Start Questions
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          {SHORT_DISCLAIMER}
        </p>
      </div>
    )
  }

  // Questions Phase
  if (phase === 'questions') {
    const typeInfo = QUESTION_TYPE_LABELS[currentQuestion.questionType] || QUESTION_TYPE_LABELS.literal
    
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Progress */}
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>
              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
        
        {/* Question */}
        <Card>
          <CardContent className="py-6 space-y-6">
            <div>
              <p className={cn('font-medium', fontSizeClass)}>
                {currentQuestion.prompt}
              </p>
            </div>
            
            {/* Choices */}
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, idx) => {
                const isSelected = selectedAnswer === choice.index
                const isCorrect = choice.index === currentQuestion.correctChoiceIndex
                const showCorrect = showFeedback && isCorrect
                const showIncorrect = showFeedback && isSelected && !isCorrect
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(choice.index)}
                    disabled={showFeedback}
                    className={cn(
                      'w-full p-4 rounded-lg border-2 text-left transition-all',
                      fontSizeClass,
                      !showFeedback && isSelected && 'border-primary bg-primary/5',
                      !showFeedback && !isSelected && 'border-muted hover:border-primary/50',
                      showCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                      showIncorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm',
                        !showFeedback && isSelected && 'bg-primary text-primary-foreground',
                        !showFeedback && !isSelected && 'bg-muted',
                        showCorrect && 'bg-green-500 text-white',
                        showIncorrect && 'bg-red-500 text-white',
                      )}>
                        {showCorrect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : showIncorrect ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <span>{choice.text}</span>
                    </div>
                  </button>
                )
              })}
            </div>
            
            {/* Feedback */}
            {showFeedback && (
              <div className={cn(
                'p-4 rounded-lg',
                responses[responses.length - 1]?.isCorrect
                  ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {responses[responses.length - 1]?.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800 dark:text-red-200">Incorrect</span>
                    </>
                  )}
                </div>
                
                {currentQuestion.explanation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="gap-1"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>
                )}
                
                {showExplanation && currentQuestion.explanation && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="gap-2"
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="gap-2">
                  {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Review Phase
  const correctCount = responses.filter(r => r.isCorrect).length
  const accuracy = Math.round((correctCount / responses.length) * 100)
  
  // Calculate by type
  const byType: Record<string, { correct: number; total: number }> = {}
  for (const response of responses) {
    if (!byType[response.questionType]) {
      byType[response.questionType] = { correct: 0, total: 0 }
    }
    byType[response.questionType].total++
    if (response.isCorrect) {
      byType[response.questionType].correct++
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Comprehension Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-primary mb-2">
              {correctCount}/{responses.length}
            </div>
            <div className="text-xl text-muted-foreground">
              {accuracy}% Correct
            </div>
          </div>
          
          {/* By Question Type */}
          <div>
            <h4 className="font-medium mb-3">By Question Type</h4>
            <div className="space-y-2">
              {Object.entries(byType).map(([type, stats]) => {
                const typeInfo = QUESTION_TYPE_LABELS[type] || QUESTION_TYPE_LABELS.literal
                const typeAccuracy = Math.round((stats.correct / stats.total) * 100)
                
                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                      <span className="text-sm text-muted-foreground">{typeInfo.description}</span>
                    </div>
                    <div className="font-medium">
                      {stats.correct}/{stats.total} ({typeAccuracy}%)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Response Summary */}
          <div>
            <h4 className="font-medium mb-3">Question Summary</h4>
            <div className="flex flex-wrap gap-2">
              {responses.map((r, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    r.isCorrect
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  )}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleComplete} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Save & Continue
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            {SHORT_DISCLAIMER}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
