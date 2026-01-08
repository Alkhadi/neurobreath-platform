'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wind, Play, Pause, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const techniques = [
  { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4, description: 'Equal phases for calm focus' },
  { name: '4-7-8 Relaxing', inhale: 4, hold1: 7, exhale: 8, hold2: 0, description: 'Extended exhale for deep relaxation' },
  { name: 'Coherent (5-5)', inhale: 5, hold1: 0, exhale: 5, hold2: 0, description: 'Optimal heart rate variability' },
  { name: 'Calm Breath', inhale: 4, hold1: 2, exhale: 6, hold2: 0, description: 'Gentle stress relief' },
]

export function BreathingExercise() {
  const [selectedTechnique, setSelectedTechnique] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [countdown, setCountdown] = useState(0)
  const [cycles, setCycles] = useState(0)

  const technique = techniques[selectedTechnique] ?? techniques[0]

  const getPhaseSeconds = useCallback((p: string) => {
    switch (p) {
      case 'inhale': return technique?.inhale ?? 4
      case 'hold1': return technique?.hold1 ?? 0
      case 'exhale': return technique?.exhale ?? 4
      case 'hold2': return technique?.hold2 ?? 0
      default: return 4
    }
  }, [technique])

  const getNextPhase = useCallback((current: string): 'inhale' | 'hold1' | 'exhale' | 'hold2' => {
    const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2']
    const idx = phases.indexOf(current as any)
    let next = (idx + 1) % 4
    while (getPhaseSeconds(phases[next] ?? 'inhale') === 0 && next !== idx) {
      if (phases[next] === 'hold2') {
        return 'inhale'
      }
      next = (next + 1) % 4
    }
    return phases[next] ?? 'inhale'
  }, [getPhaseSeconds])

  useEffect(() => {
    if (!isActive) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(phase)
          if (nextPhase === 'inhale' && phase !== 'inhale') {
            setCycles((c) => c + 1)
          }
          setPhase(nextPhase)
          return getPhaseSeconds(nextPhase)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isActive, phase, getNextPhase, getPhaseSeconds])

  const handleStart = () => {
    setIsActive(true)
    setPhase('inhale')
    setCountdown(getPhaseSeconds('inhale'))
  }

  const handleStop = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setPhase('inhale')
    setCountdown(0)
    setCycles(0)
  }

  const phaseLabel = {
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold',
  }

  const circleScale = phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.8 : 1

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wind className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold">Breathing Exercise</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="text-sm font-medium mb-2">Select Technique</div>
          <div className="grid grid-cols-2 gap-2">
            {techniques.map((t, idx) => (
              <button
                key={t.name}
                onClick={() => { setSelectedTechnique(idx); handleReset(); }}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedTechnique === idx
                    ? 'bg-teal-100 border-2 border-teal-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.description}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            {!isActive ? (
              <Button onClick={handleStart} className="flex-1 bg-teal-600 hover:bg-teal-700">
                <Play className="h-4 w-4 mr-2" /> Start
              </Button>
            ) : (
              <Button onClick={handleStop} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" /> Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {cycles > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Completed: {cycles} cycle{cycles !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-medium text-teal-700 mb-4"
            >
              {isActive ? phaseLabel[phase] : 'Ready'}
            </motion.div>
          </AnimatePresence>

          <motion.div
            animate={{ scale: isActive ? circleScale : 1 }}
            transition={{ duration: getPhaseSeconds(phase), ease: 'easeInOut' }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg"
          >
            <span className="text-4xl font-bold text-white">
              {isActive ? countdown : '—'}
            </span>
          </motion.div>

          <div className="flex gap-8 mt-6 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">Inhale</div>
              <div className="font-semibold">{technique?.inhale ?? 4}s</div>
            </div>
            {(technique?.hold1 ?? 0) > 0 && (
              <div className="text-center">
                <div className="text-muted-foreground">Hold</div>
                <div className="font-semibold">{technique?.hold1}s</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-muted-foreground">Exhale</div>
              <div className="font-semibold">{technique?.exhale ?? 4}s</div>
            </div>
            {(technique?.hold2 ?? 0) > 0 && (
              <div className="text-center">
                <div className="text-muted-foreground">Hold</div>
                <div className="font-semibold">{technique?.hold2}s</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

