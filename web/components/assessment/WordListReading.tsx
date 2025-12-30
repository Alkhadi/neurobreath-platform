'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  CheckCircle2,
  XCircle,
  SkipForward,
  Clock,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHORT_DISCLAIMER } from '@/lib/reading-profile'

interface WordResponse {
  itemText: string
  isCorrect: boolean
  responseTimeMs?: number
}

interface WordListReadingProps {
  wordList: {
    id: string
    title: string
    words: string[]
    levelBand: string
    category?: string
  }
  itemType: 'word' | 'pseudoword'
  onComplete: (data: {
    wordListId: string
    responses: WordResponse[]
    totalItems: number
    correctItems: number
    durationSeconds: number
  }) => void
  onCancel: () => void
}

export function WordListReading({ wordList, itemType, onComplete, onCancel }: WordListReadingProps) {
  const [phase, setPhase] = useState<'instructions' | 'reading' | 'review'>('instructions')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<WordResponse[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [itemStartTime, setItemStartTime] = useState<number>(0)
  
  // Settings
  const [fontSize, setFontSize] = useState<'large' | 'xlarge' | 'xxlarge'>('xlarge')
  const [showTimer, setShowTimer] = useState(true)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
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
  
  const currentWord = wordList.words[currentIndex]
  const progress = (currentIndex / wordList.words.length) * 100
  
  const startReading = useCallback(() => {
    setPhase('reading')
    setIsRunning(true)
    setCurrentIndex(0)
    setResponses([])
    setElapsedSeconds(0)
    setItemStartTime(Date.now())
  }, [])
  
  const recordResponse = useCallback((isCorrect: boolean) => {
    const responseTimeMs = Date.now() - itemStartTime
    
    setResponses(prev => [
      ...prev,
      {
        itemText: currentWord,
        isCorrect,
        responseTimeMs,
      }
    ])
    
    if (currentIndex < wordList.words.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setItemStartTime(Date.now())
    } else {
      // Finished all words
      setIsRunning(false)
      setPhase('review')
    }
  }, [currentIndex, currentWord, itemStartTime, wordList.words.length])
  
  const skipWord = useCallback(() => {
    recordResponse(false)
  }, [recordResponse])
  
  const handleComplete = useCallback(() => {
    const correctItems = responses.filter(r => r.isCorrect).length
    
    onComplete({
      wordListId: wordList.id,
      responses,
      totalItems: wordList.words.length,
      correctItems,
      durationSeconds: elapsedSeconds,
    })
  }, [responses, wordList.id, wordList.words.length, elapsedSeconds, onComplete])
  
  const restartReading = useCallback(() => {
    setPhase('instructions')
    setCurrentIndex(0)
    setResponses([])
    setElapsedSeconds(0)
  }, [])
  
  // Calculate stats for review
  const correctCount = responses.filter(r => r.isCorrect).length
  const incorrectCount = responses.filter(r => !r.isCorrect).length
  const accuracy = responses.length > 0 ? Math.round((correctCount / responses.length) * 100) : 0
  
  // Font size classes
  const fontSizeClass = {
    large: 'text-4xl',
    xlarge: 'text-5xl',
    xxlarge: 'text-6xl',
  }[fontSize]

  // Instructions Phase
  if (phase === 'instructions') {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            {itemType === 'word' ? 'Word Reading' : 'Pseudoword Decoding'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-lg mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Read each {itemType}:</strong> Say the {itemType} aloud</li>
              <li><strong>Mark your response:</strong> Tap ✓ if correct, ✗ if incorrect</li>
              <li><strong>Continue:</strong> Move through all {wordList.words.length} items</li>
            </ol>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">{wordList.title}</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{wordList.levelBand}</Badge>
              {wordList.category && <Badge variant="secondary">{wordList.category}</Badge>}
              <Badge variant="outline">{wordList.words.length} items</Badge>
            </div>
          </div>
          
          {itemType === 'pseudoword' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Pseudowords are made-up words that follow English spelling patterns.
                They test your ability to decode unfamiliar words using phonics rules.
              </p>
            </div>
          )}
          
          {/* Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Display Settings</h4>
            <div className="flex gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Word Size</label>
                <div className="flex gap-2 mt-1">
                  {(['large', 'xlarge', 'xxlarge'] as const).map(size => (
                    <Button
                      key={size}
                      variant={fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFontSize(size)}
                    >
                      {size === 'large' ? 'A' : size === 'xlarge' ? 'A+' : 'A++'}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Show Timer</label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={showTimer ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowTimer(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={!showTimer ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowTimer(false)}
                  >
                    No
                  </Button>
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
              Start
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
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Progress Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {wordList.words.length}
                </span>
                {showTimer && (
                  <div className="flex items-center gap-1 text-sm font-mono">
                    <Clock className="w-4 h-4" />
                    {formatTime(elapsedSeconds)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✓ {correctCount}</span>
                <span className="text-red-600">✗ {incorrectCount}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
        
        {/* Word Display */}
        <Card className="bg-gradient-to-b from-primary/5 to-primary/10">
          <CardContent className="py-16 text-center">
            <div className={cn(
              'font-serif font-bold tracking-wide',
              fontSizeClass
            )}>
              {currentWord}
            </div>
          </CardContent>
        </Card>
        
        {/* Response Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-20 text-lg border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
            onClick={() => recordResponse(false)}
          >
            <XCircle className="w-8 h-8 mr-2 text-red-500" />
            Incorrect
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-20 text-lg border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={skipWord}
          >
            <SkipForward className="w-8 h-8 mr-2 text-gray-500" />
            Skip
          </Button>
          
          <Button
            size="lg"
            className="h-20 text-lg bg-green-600 hover:bg-green-700"
            onClick={() => recordResponse(true)}
          >
            <CheckCircle2 className="w-8 h-8 mr-2" />
            Correct
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Read the word aloud, then mark your response
        </p>
      </div>
    )
  }

  // Review Phase
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            {itemType === 'word' ? 'Word Reading' : 'Pseudoword Decoding'} Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold">{formatTime(elapsedSeconds)}</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>
          
          {/* Items per minute */}
          {elapsedSeconds > 0 && (
            <div className="p-4 bg-primary/5 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((responses.length / elapsedSeconds) * 60)} items/min
              </div>
              <div className="text-sm text-muted-foreground">Reading Rate</div>
            </div>
          )}
          
          {/* Response Details */}
          <div>
            <h4 className="font-medium mb-3">Response Details</h4>
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">{itemType === 'word' ? 'Word' : 'Pseudoword'}</th>
                    <th className="text-center p-2">Result</th>
                    <th className="text-right p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 text-muted-foreground">{idx + 1}</td>
                      <td className="p-2 font-medium">{r.itemText}</td>
                      <td className="p-2 text-center">
                        {r.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 inline" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 inline" />
                        )}
                      </td>
                      <td className="p-2 text-right text-muted-foreground">
                        {r.responseTimeMs ? `${(r.responseTimeMs / 1000).toFixed(1)}s` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={restartReading} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
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
