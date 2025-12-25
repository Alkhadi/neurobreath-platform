'use client'

import { BreathingExercise } from '@/components/BreathingExercise'
import { breathingTechniques } from '@/lib/breathing-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BoxBreathingPage() {
  const technique = breathingTechniques['box-4444']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🟩</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{technique?.name ?? 'Box Breathing'}</h1>
            <p className="text-lg text-gray-600">{technique?.description ?? ''}</p>
          </div>

          <BreathingExercise initialPattern="box" />
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
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Box breathing, also called square breathing or four-square breathing, is a powerful stress-relief technique. 
            The equal pattern of 4-4-4-4 (inhale 4, hold 4, exhale 4, hold 4) helps regulate the autonomic nervous system.
          </p>
          <p className="text-gray-700 mb-4">
            This technique is used by Navy SEALs and other high-performance teams to maintain calm under pressure. 
            The equal timing creates a balanced rhythm that steadies heart rate and reduces anxiety.
          </p>
          <p className="text-gray-700">
            <strong>When to use:</strong> Morning routines, before meetings, during anxiety spikes, or whenever you need to center yourself.
          </p>
        </div>
      </div>
    </div>
  )
}
