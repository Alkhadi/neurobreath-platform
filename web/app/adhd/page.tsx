import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ADHDPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breathing Tools for ADHD</h1>
          <p className="text-lg text-gray-600 mb-6">
            Short, engaging breathing exercises designed for ADHD brains. Build focus, reduce impulsivity, and create calm without boredom.
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Breathing Helps ADHD</h2>
            <p className="text-gray-700 mb-4">
              Breathing exercises help ADHD brains by activating the prefrontal cortex (executive function), reducing hyperactivity, 
              and providing a physical anchor for wandering attention. Short, varied patterns keep things interesting.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recommended Techniques</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟪 Coherent 5-5</h3>
                <p className="text-gray-700 mb-3">
                  Simple in-and-out pattern that boosts heart rate variability and steadies prefrontal attention. Perfect before focused work.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/coherent">Try Coherent Breathing</Link>
                </Button>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟩 Box Breathing</h3>
                <p className="text-gray-700 mb-3">
                  The 4-4-4-4 pattern provides structure without being too long. Great for transitions between tasks or calming hyperactivity.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/box-breathing">Try Box Breathing</Link>
                </Button>
              </div>

              <div className="bg-pink-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🆘 60-second SOS</h3>
                <p className="text-gray-700 mb-3">
                  Ultra-short reset for impulsive moments or when you can't sit still. One minute is often enough to break the pattern.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/sos">Try SOS Reset</Link>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ADHD-Friendly Tips</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Start with 1-3 minute sessions (longer isn't always better)</li>
              <li>Use visual cues and timers to maintain focus</li>
              <li>Vary techniques to prevent boredom</li>
              <li>Link breathing to existing routines or transitions</li>
              <li>Don't force it—if your brain isn't ready, try later</li>
              <li>Gamify with the challenge system and badges</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to Use</h2>
            <p className="text-gray-700">
              <strong>Before tasks:</strong> Prime your prefrontal cortex for focus.<br />
              <strong>During transitions:</strong> Reset between activities or meetings.<br />
              <strong>When overwhelmed:</strong> Quick intervention to reduce emotional intensity.<br />
              <strong>Before bed:</strong> Downshift from hyperarousal to sleep-ready state.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Link href="/">Start Practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/progress">Track Progress</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
