'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Hand, Ear, Wind as Smell, Cookie, CheckCircle2, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  { sense: 'See', count: 5, icon: Eye, prompt: 'Name 5 things you can see', color: 'bg-blue-500' },
  { sense: 'Touch', count: 4, icon: Hand, prompt: 'Name 4 things you can feel', color: 'bg-green-500' },
  { sense: 'Hear', count: 3, icon: Ear, prompt: 'Name 3 things you can hear', color: 'bg-yellow-500' },
  { sense: 'Smell', count: 2, icon: Smell, prompt: 'Name 2 things you can smell', color: 'bg-orange-500' },
  { sense: 'Taste', count: 1, icon: Cookie, prompt: 'Name 1 thing you can taste', color: 'bg-red-500' },
]

export function GroundingExercise() {
  const [currentStep, setCurrentStep] = useState(0)
  const [inputs, setInputs] = useState<string[][]>(steps.map((s) => Array(s.count).fill('')))
  const [completed, setCompleted] = useState(false)

  const step = steps[currentStep] ?? steps[0]
  const Icon = step?.icon ?? Eye

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    const stepInputs = [...(newInputs[currentStep] ?? [])]
    stepInputs[index] = value
    newInputs[currentStep] = stepInputs
    setInputs(newInputs)
  }

  const canProceed = (inputs[currentStep] ?? []).filter((i) => i?.trim?.()).length >= (step?.count ?? 1)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setInputs(steps.map((s) => Array(s.count).fill('')))
    setCompleted(false)
  }

  if (completed) {
    return (
      <Card className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Well Done!</h3>
          <p className="text-muted-foreground mb-6">
            You've completed the 5-4-3-2-1 grounding exercise. Take a moment to notice how you feel.
          </p>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" /> Start Again
          </Button>
        </motion.div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">5-4-3-2-1 Grounding</h3>
        <div className="flex gap-1">
          {steps.map((s, idx) => (
            <div
              key={s.sense}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx < currentStep ? 'bg-green-500' : idx === currentStep ? s.color : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className={`${step?.color ?? 'bg-blue-500'} text-white p-6 rounded-lg mb-6`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon className="h-8 w-8" />
              <span className="text-3xl font-bold">{step?.count ?? 5}</span>
            </div>
            <p className="text-lg">{step?.prompt ?? ''}</p>
          </div>

          <div className="space-y-3">
            {(inputs[currentStep] ?? []).map((value, idx) => (
              <input
                key={idx}
                type="text"
                value={value ?? ''}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                placeholder={`${step?.sense ?? 'Item'} ${idx + 1}...`}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}
