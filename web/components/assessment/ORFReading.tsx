'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  Play,
  Pause,
  Square,
  RotateCcw,
  ChevronRight,
  Volume2,
  Clock,
  CheckCircle2,
  XCircle,
  Undo2,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ErrorMark, calculateORFMetrics, ORFMetrics, SHORT_DISCLAIMER } from '@/lib/reading-profile'

interface ORFReadingProps {
  passage: {
    id: string
    title: string
    text: string
    wordCount: number
    levelBand: string
  }
  onComplete: (data: {
    passageId: string
    metrics: ORFMetrics
    errors: ErrorMark[]
    durationSeconds: number
  }) => void
  onCancel: () => void
}

type ErrorType = 'substitution' | 'omission' | 'insertion' | 'reversal' | 'hesitation' | 'unknown'

interface WordState {
  text: string
  index: number
  marked: boolean
  errorType?: ErrorType
  corrected: boolean
}

const ERROR_TYPES: { value: ErrorType; label: string; shortLabel: string; color: string }[] = [
  { value: 'substitution', label: 'Substitution', shortLabel: 'Sub', color: 'bg-red-500' },
  { value: 'omission', label: 'Omission', shortLabel: 'Om', color: 'bg-orange-500' },
  { value: 'insertion', label: 'Insertion', shortLabel: 'Ins', color: 'bg-purple-500' },
  { value: 'reversal', label: 'Reversal', shortLabel: 'Rev', color: 'bg-pink-500' },
  { value: 'hesitation', label: 'Hesitation (>3s)', shortLabel: 'Hes', color: 'bg-yellow-500' },
  { value: 'unknown', label: 'Unknown', shortLabel: 'Unk', color: 'bg-gray-500' },
]

export function ORFReading({ passage, onComplete, onCancel }: ORFReadingProps) {
  // Phase: 'instructions' | 'reading' | 'marking' | 'review'
  const [phase, setPhase] = useState<'instructions' | 'reading' | 'marking' | 'review'>('instructions')
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Word marking state
  const [words, setWords] = useState<WordState[]>([])
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null)
  const [activeErrorType, setActiveErrorType] = useState<ErrorType>('substitution')
  
  // Settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large')
  const [lineSpacing, setLineSpacing] = useState<'normal' | 'relaxed' | 'loose'>('relaxed')
  const [bgTint, setBgTint] = useState<'white' | 'cream' | 'blue' | 'green'>('cream')
  
  // Initialize words from passage
  useEffect(() => {
    const passageWords = passage.text.split(/\s+/).filter(w => w.length > 0)
    setWords(passageWords.map((text, index) => ({
      text,
      index,
      marked: false,
      corrected: false,
    })))
  }, [passage.text])
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const startReading = useCallback(() => {
    setPhase('reading')
    setIsRunning(true)
    setElapsedSeconds(0)
  }, [])
  
  const pauseReading = useCallback(() => {
    setIsRunning(false)
  }, [])
  
  const resumeReading = useCallback(() => {
    setIsRunning(true)
  }, [])
  
  const finishReading = useCallback(() => {
    setIsRunning(false)
    setPhase('marking')
  }, [])
  
  const handleWordClick = useCallback((idx: number) => {
    if (phase !== 'marking') return
    
    setWords(prev => {
      const updated = [...prev]
      const word = updated[idx]
      
      if (word.marked && word.errorType === activeErrorType && !word.corrected) {
        // Toggle off
        updated[idx] = { ...word, marked: false, errorType: undefined }
      } else if (word.marked && word.errorType === activeErrorType && word.corrected) {
        // Remove correction
        updated[idx] = { ...word, corrected: false }
      } else if (word.marked) {
        // Change error type
        updated[idx] = { ...word, errorType: activeErrorType, corrected: false }
      } else {
        // Mark as error
        updated[idx] = { ...word, marked: true, errorType: activeErrorType }
      }
      
      return updated
    })
    
    setSelectedWordIdx(idx)
  }, [phase, activeErrorType])
  
  const toggleSelfCorrection = useCallback((idx: number) => {
    setWords(prev => {
      const updated = [...prev]
      if (updated[idx].marked) {
        updated[idx] = { ...updated[idx], corrected: !updated[idx].corrected }
      }
      return updated
    })
  }, [])
  
  const clearMarking = useCallback((idx: number) => {
    setWords(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], marked: false, errorType: undefined, corrected: false }
      return updated
    })
    setSelectedWordIdx(null)
  }, [])
  
  const clearAllMarkings = useCallback(() => {
    setWords(prev => prev.map(w => ({ ...w, marked: false, errorType: undefined, corrected: false })))
    setSelectedWordIdx(null)
  }, [])
  
  const proceedToReview = useCallback(() => {
    setPhase('review')
  }, [])
  
  const goBackToMarking = useCallback(() => {
    setPhase('marking')
  }, [])
  
  const handleComplete = useCallback(() => {
    const errors: ErrorMark[] = words
      .filter(w => w.marked && w.errorType)
      .map(w => ({
        wordIndex: w.index,
        wordText: w.text,
        errorType: w.errorType!,
        corrected: w.corrected,
      }))
    
    const metrics = calculateORFMetrics(passage.wordCount, errors, elapsedSeconds)
    
    onComplete({
      passageId: passage.id,
      metrics,
      errors,
      durationSeconds: elapsedSeconds,
    })
  }, [words, passage.id, passage.wordCount, elapsedSeconds, onComplete])
  
  // Calculate current metrics for review
  const currentErrors = words.filter(w => w.marked && w.errorType).map(w => ({
    wordIndex: w.index,
    wordText: w.text,
    errorType: w.errorType!,
    corrected: w.corrected,
  }))
  const currentMetrics = calculateORFMetrics(passage.wordCount, currentErrors, elapsedSeconds)
  
  // Font size classes
  const fontSizeClass = {
    normal: 'text-base leading-relaxed',
    large: 'text-xl leading-relaxed',
    xlarge: 'text-2xl leading-loose',
  }[fontSize]
  
  // Line spacing classes
  const lineSpacingClass = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  }[lineSpacing]
  
  // Background tint classes
  const bgTintClass = {
    white: 'bg-white dark:bg-gray-900',
    cream: 'bg-amber-50 dark:bg-amber-950/20',
    blue: 'bg-blue-50 dark:bg-blue-950/20',
    green: 'bg-green-50 dark:bg-green-950/20',
  }[bgTint]

  // Instructions Phase
  if (phase === 'instructions') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-primary" />
            Oral Reading Fluency (ORF)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-lg mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Read aloud:</strong> Read the passage out loud at your natural pace</li>
              <li><strong>Timer runs:</strong> The timer starts when you press "Start Reading"</li>
              <li><strong>Finish:</strong> Press "Finish" when you complete the passage</li>
              <li><strong>Mark errors:</strong> Review and mark any words you read incorrectly</li>
            </ol>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Passage: {passage.title}</h4>
            <p className="text-sm text-muted-foreground">
              Level: <Badge variant="outline">{passage.levelBand}</Badge> • 
              Words: {passage.wordCount}
            </p>
          </div>
          
          {/* Accessibility Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Display Settings</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Font Size</label>
                <div className="flex gap-2 mt-1">
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
              <div>
                <label className="text-sm text-muted-foreground">Line Spacing</label>
                <div className="flex gap-2 mt-1">
                  {(['normal', 'relaxed', 'loose'] as const).map(spacing => (
                    <Button
                      key={spacing}
                      variant={lineSpacing === spacing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLineSpacing(spacing)}
                    >
                      {spacing.charAt(0).toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Background</label>
                <div className="flex gap-2 mt-1">
                  {(['white', 'cream', 'blue', 'green'] as const).map(tint => (
                    <Button
                      key={tint}
                      variant={bgTint === tint ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBgTint(tint)}
                      className="w-8 h-8 p-0"
                    >
                      <div className={cn('w-4 h-4 rounded', {
                        'bg-white border': tint === 'white',
                        'bg-amber-100': tint === 'cream',
                        'bg-blue-100': tint === 'blue',
                        'bg-green-100': tint === 'green',
                      })} />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={startReading} className="gap-2">
              <Play className="w-4 h-4" />
              Start Reading
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            {SHORT_DISCLAIMER}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Reading Phase
  if (phase === 'reading') {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Timer Bar */}
        <Card className="sticky top-0 z-10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-2xl font-mono font-bold">
                  <Clock className="w-6 h-6" />
                  {formatTime(elapsedSeconds)}
                </div>
                <Badge variant="outline">{passage.title}</Badge>
              </div>
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <Button variant="outline" onClick={pauseReading} className="gap-2">
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resumeReading} className="gap-2">
                    <Play className="w-4 h-4" />
                    Resume
                  </Button>
                )}
                <Button onClick={finishReading} className="gap-2 bg-green-600 hover:bg-green-700">
                  <Square className="w-4 h-4" />
                  Finish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Passage Display */}
        <Card className={bgTintClass}>
          <CardContent className="py-8 px-6 md:px-12">
            <p className={cn(fontSizeClass, lineSpacingClass, 'font-serif')}>
              {passage.text}
            </p>
          </CardContent>
        </Card>
        
        <p className="text-xs text-muted-foreground text-center">
          Read the passage aloud at your natural pace. Press "Finish" when done.
        </p>
      </div>
    )
  }

  // Marking Phase
  if (phase === 'marking') {
    const markedCount = words.filter(w => w.marked).length
    const selfCorrectedCount = words.filter(w => w.marked && w.corrected).length
    
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Toolbar */}
        <Card className="sticky top-0 z-10">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold">Mark Errors</h3>
                  <div className="text-sm text-muted-foreground">
                    Time: <span className="font-mono">{formatTime(elapsedSeconds)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Errors: <span className="font-bold text-red-600">{markedCount - selfCorrectedCount}</span>
                    {selfCorrectedCount > 0 && (
                      <span className="text-green-600 ml-1">
                        (+{selfCorrectedCount} corrected)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={clearAllMarkings}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                  <Button onClick={proceedToReview} className="gap-2">
                    Review Results
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Error Type Selector */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground self-center mr-2">Error Type:</span>
                {ERROR_TYPES.map(type => (
                  <Button
                    key={type.value}
                    variant={activeErrorType === type.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveErrorType(type.value)}
                    className={cn(
                      'gap-1',
                      activeErrorType === type.value && type.color.replace('bg-', 'bg-').replace('500', '600')
                    )}
                  >
                    <div className={cn('w-2 h-2 rounded-full', type.color)} />
                    {type.shortLabel}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
          <Info className="w-4 h-4 inline mr-2 text-blue-600" />
          Tap words to mark errors. Tap again to toggle self-correction (corrected within 3 seconds).
        </div>
        
        {/* Word Grid */}
        <Card className={bgTintClass}>
          <CardContent className="py-8 px-6">
            <div className={cn('flex flex-wrap gap-2', fontSizeClass)}>
              {words.map((word, idx) => {
                const errorInfo = word.marked && word.errorType
                  ? ERROR_TYPES.find(e => e.value === word.errorType)
                  : null
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(idx)}
                    className={cn(
                      'px-2 py-1 rounded transition-all cursor-pointer select-none',
                      'hover:ring-2 hover:ring-primary/50',
                      word.marked && errorInfo && !word.corrected && [
                        'text-white font-medium',
                        errorInfo.color,
                      ],
                      word.marked && word.corrected && [
                        'bg-green-100 dark:bg-green-900/30',
                        'text-green-800 dark:text-green-200',
                        'line-through',
                      ],
                      !word.marked && 'hover:bg-muted',
                      selectedWordIdx === idx && 'ring-2 ring-primary'
                    )}
                  >
                    {word.text}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Selected Word Actions */}
        {selectedWordIdx !== null && words[selectedWordIdx].marked && (
          <Card className="border-primary">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">"{words[selectedWordIdx].text}"</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    - {ERROR_TYPES.find(e => e.value === words[selectedWordIdx].errorType)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={words[selectedWordIdx].corrected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSelfCorrection(selectedWordIdx)}
                    className={cn(
                      'gap-1',
                      words[selectedWordIdx].corrected && 'bg-green-600 hover:bg-green-700'
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Self-Corrected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearMarking(selectedWordIdx)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Review Phase
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            ORF Results Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{currentMetrics.wcpm}</div>
              <div className="text-sm text-muted-foreground">WCPM</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold">{currentMetrics.accuracyPct}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">{currentMetrics.errorsTotal}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{currentMetrics.selfCorrections}</div>
              <div className="text-sm text-muted-foreground">Self-Corrections</div>
            </div>
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Words:</span>
              <span className="font-medium">{currentMetrics.totalWords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Words Correct:</span>
              <span className="font-medium">{currentMetrics.wordsCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reading Time:</span>
              <span className="font-medium">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Rate:</span>
              <span className="font-medium">{currentMetrics.errorRate}%</span>
            </div>
          </div>
          
          {/* Error Breakdown */}
          {currentErrors.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Error Breakdown</h4>
              <div className="flex flex-wrap gap-2">
                {ERROR_TYPES.map(type => {
                  const count = currentErrors.filter(e => e.errorType === type.value && !e.corrected).length
                  if (count === 0) return null
                  return (
                    <Badge key={type.value} variant="outline" className="gap-1">
                      <div className={cn('w-2 h-2 rounded-full', type.color)} />
                      {type.label}: {count}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Warning if too fast */}
          {elapsedSeconds < 30 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">Short Reading Time</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Reading time was under 30 seconds. Results may be less reliable for very short sessions.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={goBackToMarking} className="gap-2">
              <Undo2 className="w-4 h-4" />
              Back to Marking
            </Button>
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
