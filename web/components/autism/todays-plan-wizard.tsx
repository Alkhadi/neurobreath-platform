'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AgeBand, SettingType, Plan } from '@/types/autism'
import { savePlan, completePlan } from '@/lib/autism/storage'
import { useAutismProgress } from '@/hooks/useAutismProgress'
import { toast } from 'sonner'

const MAIN_NEEDS = [
  'Transitions',
  'Sensory overwhelm',
  'Communication',
  'Anxiety',
  'Sleep',
  'School refusal',
  'Workplace stress',
  'Social situations'
]

export function TodaysPlanWizard() {
  const [step, setStep] = useState(0)
  const [ageBand, setAgeBand] = useState<AgeBand>('primary')
  const [mainNeed, setMainNeed] = useState('')
  const [setting, setSetting] = useState<SettingType>('home')
  const [plan, setPlan] = useState<Plan | null>(null)
  const { logSession } = useAutismProgress()

  const generatePlan = () => {
    const planId = `plan-${Date.now()}`
    const created = new Date().toISOString()

    // Generate contextual plan based on inputs
    const newPlan: Plan = {
      id: planId,
      title: `${mainNeed} support plan`,
      created,
      ageBand,
      mainNeed,
      setting,
      doNow: generateDoNow(mainNeed, ageBand, setting),
      buildThisWeek: generateBuildThisWeek(mainNeed, ageBand, setting),
      measurement: generateMeasurement(mainNeed)
    }

    setPlan(newPlan)
    savePlan(newPlan)
    setStep(3)
  }

  const handleComplete = () => {
    if (plan) {
      completePlan(plan.id)
      logSession(5, 'plan-completion')
    }
    toast.success('Plan saved', {
      description: 'You can track your progress below (stored locally on this device).'
    })
    reset()
  }

  const reset = () => {
    setStep(0)
    setPlan(null)
    setAgeBand('primary')
    setMainNeed('')
    setSetting('home')
  }

  return (
    <section id="todays-plan" className="scroll-mt-24 py-16 md:py-20 bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Quick start</p>
          <h2 className="text-3xl font-bold text-gray-900">Today's plan</h2>
          <p className="text-gray-600">A practical 3-step plan with do-now actions, a weekly build, and a simple measure.</p>
        </div>

        <Card className="p-6 md:p-8 bg-white/80 backdrop-blur shadow-sm">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age band:</label>
                <Select value={ageBand} onValueChange={(v) => setAgeBand(v as AgeBand)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early-years">Early years (0-5)</SelectItem>
                    <SelectItem value="primary">Primary (5-11)</SelectItem>
                    <SelectItem value="secondary">Secondary (11-18)</SelectItem>
                    <SelectItem value="adult">Adult (18+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setStep(1)} className="w-full">Next</Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main need right now:</label>
                <Select value={mainNeed} onValueChange={setMainNeed}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_NEEDS.map(need => (
                      <SelectItem key={need} value={need}>{need}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} disabled={!mainNeed} className="flex-1">Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Setting:</label>
                <Select value={setting} onValueChange={(v) => setSetting(v as SettingType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="classroom">Classroom</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="workplace">Workplace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={generatePlan} className="flex-1">Generate Plan</Button>
              </div>
            </div>
          )}

          {step === 3 && plan && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-sm text-gray-600">Created: {new Date(plan.created).toLocaleDateString()}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">✅ Do now (under 5 min):</h4>
                <ul className="space-y-2">
                  {plan.doNow.map(step => (
                    <li key={step.id} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{step.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🔨 Build this week:</h4>
                <ul className="space-y-2">
                  {plan.buildThisWeek.map(step => (
                    <li key={step.id} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{step.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">📊 Measure:</h4>
                <p className="text-sm text-gray-700">{plan.measurement}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleComplete} className="flex-1">Mark Complete & Save</Button>
                <Button variant="outline" onClick={reset}>Start New Plan</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}

// Helper functions to generate contextual plans
function generateDoNow(need: string, age: AgeBand, setting: SettingType) {
  const base = [
    { id: '1', title: 'Take 3 slow breaths (belly breathing)', description: '', duration: '1 min', completed: false },
    { id: '2', title: 'Identify one trigger or early sign to watch for', description: '', duration: '2 min', completed: false },
    { id: '3', title: 'Choose one small support to try today', description: '', duration: '2 min', completed: false }
  ]
  
  if (need.includes('Sensory')) {
    base[2].title = 'Create a mini calm kit (3 items: fidget, headphones, weighted item)'
  } else if (need.includes('Transitions')) {
    base[2].title = 'Make a simple Now/Next visual (2 pictures)'
  } else if (need.includes('Communication')) {
    base[2].title = 'Write down 5 core words/symbols to model today'
  }
  
  return base
}

function generateBuildThisWeek(need: string, age: AgeBand, setting: SettingType) {
  const base = [
    { id: 'w1', title: 'Practice the "do now" actions daily', description: '', duration: '', completed: false },
    { id: 'w2', title: 'Observe and note what helps most', description: '', duration: '', completed: false },
    { id: 'w3', title: 'Share your approach with one other person (co-parent, teacher, colleague)', description: '', duration: '', completed: false }
  ]
  
  if (need.includes('Visual')) {
    base[1].title = 'Expand visual schedule to include 5-7 daily activities'
  } else if (need.includes('Anxiety')) {
    base[1].title = 'Build a "calm menu" with 5 regulation strategies'
  }
  
  return base
}

function generateMeasurement(need: string) {
  if (need.includes('Transitions')) {
    return 'Count successful transitions this week (no meltdown/refusal). Target: 50% improvement.'
  } else if (need.includes('Anxiety')) {
    return 'Rate anxiety 1-10 before/after trying a calm strategy. Track daily.'
  } else if (need.includes('Sensory')) {
    return 'Note how many times calm corner/kit is used. Does it help prevent escalation?'
  }
  return 'Track frequency of target behaviour. Note any patterns or improvements.'
}

