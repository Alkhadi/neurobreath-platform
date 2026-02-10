'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'
import { trackProgress } from '@/lib/progress/track'

const rungs = [
  { level: 1, pattern: '3-3-3-3', duration: 12 },
  { level: 2, pattern: '4-4-4-4', duration: 16 },
  { level: 3, pattern: '4-5-4-5', duration: 18 },
  { level: 4, pattern: '5-5-5-5', duration: 20 },
  { level: 5, pattern: '5-6-5-6', duration: 22 }
]

export default function BreathLadderPage() {
  const [currentRung, setCurrentRung] = useState(0)
  const [completedRungs, setCompletedRungs] = useState<number[]>([])

  const handleComplete = async () => {
    const rung = rungs[currentRung]
    if (!rung) return

    try {
      const deviceId = getDeviceId()
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          technique: 'ladder',
          label: `Breath Ladder • Level ${rung?.level ?? 0}`,
          minutes: 2,
          breaths: 0,
          rounds: 0,
          category: 'calm'
        })
      })

      void trackProgress({
        type: 'breathing_completed',
        metadata: { techniqueId: 'ladder', durationSeconds: 120, category: 'calm' },
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })

      setCompletedRungs(prev => [...prev, currentRung])
      toast.success(`✅ Level ${rung?.level ?? 0} completed!`)
      
      if (currentRung < rungs.length - 1) {
        setCurrentRung(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to log session:', error)
      toast.error('Failed to log session')
    }
  }

  const currentLevel = rungs[currentRung]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/tools/breath-tools"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Breath Tools</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChevronUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Breath Ladder</h1>
            <p className="text-lg text-gray-600">
              Climb progressively from 3-3-3-3 to 5-5-5-5. Each rung builds capacity and confidence.
            </p>
          </div>

          {/* Current Level */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 mb-8">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600 mb-2">Level {currentLevel?.level ?? 1}</p>
              <p className="text-5xl font-bold text-gray-900 mb-4">{currentLevel?.pattern ?? '3-3-3-3'}</p>
              <p className="text-gray-600">Practice this pattern for 2 minutes</p>
            </div>
          </div>

          {/* Ladder Visualization */}
          <div className="space-y-3 mb-8">
            {rungs?.map((rung, idx) => {
              const isCompleted = completedRungs.includes(idx)
              const isCurrent = idx === currentRung
              
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-500'
                      : isCurrent
                      ? 'bg-purple-50 border-purple-500 shadow-lg'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">Level {rung?.level ?? 0}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">{rung?.pattern ?? ''}</span>
                    </div>
                    {isCompleted && <span className="text-green-600 font-medium">✔ Complete</span>}
                    {isCurrent && <span className="text-purple-600 font-medium">➡ Current</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleComplete} size="lg" className="bg-purple-600 hover:bg-purple-700">
              Mark Level {currentLevel?.level ?? 1} Complete
            </Button>
            {currentRung > 0 && (
              <Button
                onClick={() => setCurrentRung(prev => Math.max(0, prev - 1))}
                variant="outline"
                size="lg"
              >
                Go Back to Level {rungs[currentRung - 1]?.level ?? 1}
              </Button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Use</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Start at Level 1 (3-3-3-3 pattern)</li>
            <li>Practice each pattern for 2 minutes</li>
            <li>Mark complete when you feel comfortable</li>
            <li>Progress to the next level</li>
            <li>Take your time - there's no rush!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
