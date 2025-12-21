'use client'

import BreathingOrbit from '@/components/breathing-orbit'
import { breathingTechniques } from '@/lib/breathing-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'

export default function CoherentBreathingPage() {
  const technique = breathingTechniques['coherent-55']

  const handleSessionComplete = async (breaths: number, rounds: number) => {
    try {
      const deviceId = getDeviceId()
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          technique: 'coherent-55',
          label: 'Coherent Breathing Session',
          minutes: Math.ceil((breaths * 10) / 60),
          breaths,
          rounds,
          category: 'focus'
        })
      })
      toast.success('✅ Session logged successfully!')
    } catch (error) {
      console.error('Failed to log session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🟪</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{technique?.name ?? 'Coherent Breathing'}</h1>
            <p className="text-lg text-gray-600">{technique?.description ?? ''}</p>
          </div>

          <BreathingOrbit technique={technique!} onSessionComplete={handleSessionComplete} />
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
          <ul className="space-y-2">
            {technique?.benefits?.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="text-green-500">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Coherent breathing at 5 breaths per minute (5 seconds in, 5 seconds out) is scientifically shown to maximize heart rate variability (HRV), 
            a marker of nervous system balance and resilience.
          </p>
          <p className="text-gray-700 mb-4">
            This simple pattern helps synchronize your heart, lungs, and brain, creating a state of coherence that enhances focus and emotional regulation.
          </p>
          <p className="text-gray-700">
            <strong>When to use:</strong> Before focused work, during task transitions, or to prepare for important conversations.
          </p>
        </div>
      </div>
    </div>
  )
}
