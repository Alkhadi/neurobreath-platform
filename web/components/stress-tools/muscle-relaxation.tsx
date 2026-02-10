'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Play, Pause, SkipForward, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useUniversalProgress } from '@/contexts/UniversalProgressContext'

const bodyParts = [
  { name: 'Hands', instruction: 'Make a fist with both hands. Squeeze tightly for 5 seconds, then release and relax for 10 seconds.' },
  { name: 'Arms', instruction: 'Bend your elbows and tense your biceps. Hold for 5 seconds, then release and let your arms hang loose.' },
  { name: 'Shoulders', instruction: 'Raise your shoulders up to your ears. Hold the tension for 5 seconds, then drop them down and relax.' },
  { name: 'Forehead', instruction: 'Raise your eyebrows as high as you can. Hold for 5 seconds, then let them drop and smooth out your forehead.' },
  { name: 'Eyes', instruction: 'Squeeze your eyes tightly shut. Hold for 5 seconds, then relax and keep them gently closed.' },
  { name: 'Jaw', instruction: 'Clench your jaw firmly. Hold for 5 seconds, then let your mouth fall open slightly and relax.' },
  { name: 'Neck', instruction: 'Press your head back gently. Hold for 5 seconds, then return to center and relax.' },
  { name: 'Chest', instruction: 'Take a deep breath and hold it while tensing your chest. Hold for 5 seconds, then exhale slowly and relax.' },
  { name: 'Stomach', instruction: 'Tighten your abdominal muscles. Hold for 5 seconds, then release and let your belly be soft.' },
  { name: 'Legs', instruction: 'Tense your thighs and calves by straightening your legs. Hold for 5 seconds, then release and relax.' },
  { name: 'Feet', instruction: 'Curl your toes downward tightly. Hold for 5 seconds, then release and wiggle them gently.' },
]

export function MuscleRelaxation() {
  const { isComplete, markComplete } = useUniversalProgress()

  const [isActive, setIsActive] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)
  const [phase, setPhase] = useState<'tense' | 'release'>('tense')
  const [countdown, setCountdown] = useState(5)
  const [completed, setCompleted] = useState(false)

  const activityType = 'technique' as const
  const activityId = 'stress:muscle_relaxation'
  const persistedComplete = isComplete(activityType, activityId)

  useEffect(() => {
    if (!completed) return
    void markComplete(activityType, activityId)
  }, [activityId, activityType, completed, markComplete])

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (phase === 'tense') {
            setPhase('release')
            return 10
          } else {
            if (currentPart < bodyParts.length - 1) {
              setCurrentPart((p) => p + 1)
              setPhase('tense')
              return 5
            } else {
              setIsActive(false)
              setCompleted(true)
              return 0
            }
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase, currentPart])

  const handleStart = () => {
    setIsActive(true)
    setCurrentPart(0)
    setPhase('tense')
    setCountdown(5)
    setCompleted(false)
  }

  const handleSkip = () => {
    if (currentPart < bodyParts.length - 1) {
      setCurrentPart((p) => p + 1)
      setPhase('tense')
      setCountdown(5)
    } else {
      setIsActive(false)
      setCompleted(true)
    }
  }

  const handleReset = () => {
    setIsActive(false)
    setCurrentPart(0)
    setPhase('tense')
    setCountdown(5)
    setCompleted(false)
  }

  const part = bodyParts[currentPart] ?? bodyParts[0]

  if (completed) {
    return (
      <Card className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
          <p className="text-muted-foreground mb-6">
            You've completed the progressive muscle relaxation exercise.
            Notice how your body feels more relaxed.
          </p>
          <Button onClick={handleReset} className="bg-teal-600 hover:bg-teal-700">
            Start Again
          </Button>
        </motion.div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold">Progressive Muscle Relaxation</h3>
        {persistedComplete ? (
          <Badge
            variant="secondary"
            className="ml-auto gap-1"
            data-testid="nb-universal-progress-completed-badge"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </Badge>
        ) : null}
      </div>

      {!isActive ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-6">
            This technique involves tensing and relaxing different muscle groups
            to release physical tension. Find a comfortable position and follow along.
          </p>
          <Button onClick={handleStart} size="lg" className="bg-teal-600 hover:bg-teal-700">
            <Play className="h-5 w-5 mr-2" /> Begin Session
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPart}-${phase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {bodyParts.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    idx < currentPart ? 'bg-green-500' : idx === currentPart ? 'bg-teal-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Current Part */}
            <div className={`p-6 rounded-lg mb-6 ${
              phase === 'tense' 
                ? 'bg-gradient-to-r from-orange-100 to-red-100' 
                : 'bg-gradient-to-r from-green-100 to-teal-100'
            }`}>
              <div className="text-center mb-4">
                <div className="text-sm uppercase tracking-wide text-muted-foreground mb-1">
                  {currentPart + 1} of {bodyParts.length}
                </div>
                <h4 className="text-2xl font-bold">{part?.name ?? ''}</h4>
              </div>

              <p className="text-center mb-6">{part?.instruction ?? ''}</p>

              <div className="text-center">
                <div className={`text-lg font-semibold mb-2 ${
                  phase === 'tense' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {phase === 'tense' ? 'TENSE' : 'RELAX'}
                </div>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold"
                >
                  {countdown}
                </motion.div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setIsActive(false)}>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </Button>
              <Button variant="outline" onClick={handleSkip}>
                <SkipForward className="h-4 w-4 mr-2" /> Skip
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </Card>
  )
}

