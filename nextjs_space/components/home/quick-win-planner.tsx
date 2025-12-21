'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'

const goalMap = {
  calm: { technique: 'box-4444', label: 'Box Breathing', learn: '/techniques/box-breathing' },
  focus: { technique: 'coherent-55', label: 'Coherent 5-5', learn: '/techniques/coherent' },
  sleep: { technique: 'four-7-8', label: '4-7-8 Breathing', learn: '/techniques/4-7-8' },
  transition: { technique: 'sos-1m', label: '60-second SOS', learn: '/techniques/sos' }
}

const roleText = {
  self: 'you',
  child: 'your child',
  student: 'your student/classroom',
  client: 'your client',
  team: 'your team'
}

const goalText = {
  calm: 'settle the body and reduce stress response',
  focus: 'prime attention and start the next task',
  sleep: 'downshift for sleep onset',
  transition: 'reset between transitions'
}

export default function QuickWinPlanner() {
  const [role, setRole] = useState('self')
  const [goal, setGoal] = useState('calm')
  const [minutes, setMinutes] = useState(1)
  const [plan, setPlan] = useState('')

  const buildPlan = () => {
    const map = goalMap[goal as keyof typeof goalMap] ?? goalMap.calm
    const r = roleText[role as keyof typeof roleText] ?? 'you'
    const g = goalText[goal as keyof typeof goalText] ?? 'settle'

    const step3 =
      goal === 'focus' ? 'Open the task and work for 3 minutes (no perfection).' :
      goal === 'sleep' ? 'Lights low, phone away, water sip, then settle.' :
      goal === 'transition' ? 'Name one safe "next step" and take it slowly.' :
      'Choose one small thing that would make the next 10 minutes easier.'

    const planText = `Plan for ${r} to ${g}:\n\n1. Reduce stimulation for 30–60 seconds (brightness down, softer noise, steady posture).\n2. Do ${minutes} minute(s) of ${map.label} in the Daily Player below.\n3. Next right action: ${step3}`

    setPlan(planText)
    return map
  }

  const handleLoadPlayer = () => {
    const map = buildPlan()
    // Scroll to daily practice section
    const dailyPractice = document.getElementById('daily-practice')
    if (dailyPractice) {
      dailyPractice.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    toast.success(`Loaded ${map.label} in Daily Player`)
  }

  const handleMarkComplete = async () => {
    try {
      const deviceId = getDeviceId()
      const map = goalMap[goal as keyof typeof goalMap]
      
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          technique: map?.technique ?? 'box-4444',
          label: 'Quick Win • Daily Support Planner',
          minutes,
          breaths: 0,
          rounds: 0,
          category: goal
        })
      })

      toast.success('✅ Session logged successfully!')
    } catch (error) {
      console.error('Failed to log session:', error)
      toast.error('Failed to log session')
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">Quick Win • 2–5 minutes</span>
              <span className="px-3 py-1 bg-yellow-100 rounded-full text-xs font-medium text-yellow-800">Counts toward streak</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Support Planner (Instant)</h2>
            <p className="text-gray-600">
              Choose who you are supporting, pick a goal, and we will load the right technique into your Daily Player.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label htmlFor="qwRole" className="block text-sm font-medium text-gray-700 mb-2">Who are you supporting?</label>
                <select
                  id="qwRole"
                  value={role}
                  onChange={(e) => setRole(e?.target?.value ?? 'self')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="self">Myself</option>
                  <option value="child">My child</option>
                  <option value="student">A student / classroom</option>
                  <option value="client">A client / patient</option>
                  <option value="team">A team at work</option>
                </select>
              </div>

              <div>
                <label htmlFor="qwGoal" className="block text-sm font-medium text-gray-700 mb-2">Goal right now</label>
                <select
                  id="qwGoal"
                  value={goal}
                  onChange={(e) => setGoal(e?.target?.value ?? 'calm')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="calm">Calm / settle</option>
                  <option value="focus">Focus / start work</option>
                  <option value="sleep">Sleep / wind-down</option>
                  <option value="transition">Transition / reset</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time available</label>
                <div className="flex gap-2">
                  {[1, 3, 5].map(m => (
                    <Button
                      key={m}
                      variant={minutes === m ? 'default' : 'outline'}
                      onClick={() => setMinutes(m)}
                      size="sm"
                    >
                      {m} min
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleLoadPlayer} className="bg-purple-600 hover:bg-purple-700">
                  Load in Daily Player
                </Button>
                <Button onClick={handleMarkComplete} variant="outline">
                  ✅ Mark complete
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Coach note: this is designed for low friction. Even 1 minute counts.
              </p>
            </div>

            {/* Output */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your plan</h3>
              {plan ? (
                <div className="text-sm text-gray-600 whitespace-pre-line">{plan}</div>
              ) : (
                <p className="text-sm text-gray-500">Choose your options, then click "Load in Daily Player".</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
