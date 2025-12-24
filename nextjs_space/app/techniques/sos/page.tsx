'use client'

import { BreathingExercise } from '@/components/BreathingExercise'
import { breathingTechniques } from '@/lib/breathing-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SOSPage() {
  const technique = breathingTechniques['sos-1m']

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🆘</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{technique?.name ?? '60-second SOS'}</h1>
            <p className="text-lg text-gray-600">{technique?.description ?? ''}</p>
          </div>

          <BreathingExercise initialPattern="sos" />
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
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-700 mb-4">
            The 60-second SOS reset is designed for moments when you need immediate relief. 
            Using a simple box breathing pattern, it provides a quick intervention for anxiety, overwhelm, or transition stress.
          </p>
          <p className="text-gray-700 mb-4">
            In just one minute, you can signal to your nervous system that it's safe to slow down. 
            This technique is perfect for school transitions, workplace stress, or any moment of acute distress.
          </p>
          <p className="text-gray-700">
            <strong>When to use:</strong> Panic moments, school transitions, between meetings, or anytime you feel overwhelmed.
          </p>
        </div>
      </div>
    </div>
  )
}
