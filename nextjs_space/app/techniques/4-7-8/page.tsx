'use client'

import BreathingOrbit from '@/components/breathing-orbit'
import { breathingTechniques } from '@/lib/breathing-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'

export default function FourSevenEightPage() {
  const technique = breathingTechniques['four-7-8']

  const handleSessionComplete = async (breaths: number, rounds: number) => {
    try {
      const deviceId = getDeviceId()
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          technique: 'four-7-8',
          label: '4-7-8 Breathing Session',
          minutes: Math.ceil((breaths * 19) / 60),
          breaths,
          rounds,
          category: 'sleep'
        })
      })
      toast.success('✅ Session logged successfully!')
    } catch (error) {
      console.error('Failed to log session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🟦</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{technique?.name ?? '4-7-8 Breathing'}</h1>
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
        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Developed by Dr. Andrew Weil, the 4-7-8 breathing technique acts as a natural tranquilizer for the nervous system. 
            The extended exhale activates the parasympathetic nervous system, promoting deep relaxation.
          </p>
          <p className="text-gray-700 mb-4">
            The pattern (inhale 4, hold 7, exhale 8) forces you to slow down and focus on your breath, 
            which helps quiet racing thoughts and prepare your body for rest.
          </p>
          <p className="text-gray-700">
            <strong>When to use:</strong> Before bed, during insomnia, or any time you need to downshift from high alert to calm.
          </p>
        </div>
      </div>
    </div>
  )
}
