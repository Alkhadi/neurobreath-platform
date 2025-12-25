'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Shuffle } from 'lucide-react'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'
import { breathingTechniques } from '@/lib/breathing-data'

const techniques = Object.values(breathingTechniques)

export default function RoulettePage() {
  const [spinning, setSpinning] = useState(false)
  const [selectedTechnique, setSelectedTechnique] = useState<typeof techniques[0] | null>(null)

  const handleSpin = () => {
    setSpinning(true)
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * techniques.length)
      setSelectedTechnique(techniques[randomIndex])
      setSpinning(false)
      toast.success('Technique selected!')
    }, 2000)
  }

  const handleComplete = async () => {
    if (!selectedTechnique) return

    try {
      const deviceId = getDeviceId()
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          technique: 'roulette',
          label: `Micro-Reset Roulette • ${selectedTechnique?.name ?? ''}`,
          minutes: 1,
          breaths: 0,
          rounds: 0,
          category: 'transition'
        })
      })
      toast.success('✅ Reset logged successfully!')
    } catch (error) {
      console.error('Failed to log session:', error)
      toast.error('Failed to log session')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/tools"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shuffle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Micro-Reset Roulette</h1>
            <p className="text-lg text-gray-600">
              Can't decide? Spin the wheel for a random 1-minute breathing reset.
            </p>
          </div>

          {/* Wheel */}
          <div className="mb-8">
            <div
              className={`aspect-square max-w-md mx-auto rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center border-8 border-white shadow-2xl transition-transform duration-2000 ${
                spinning ? 'animate-spin' : ''
              }`}
            >
              {selectedTechnique && !spinning ? (
                <div className="text-center p-8">
                  <p className="text-5xl mb-4">
                    {selectedTechnique.id === 'box-4444' ? '🟩' :
                     selectedTechnique.id === 'coherent-55' ? '🟪' :
                     selectedTechnique.id === 'four-7-8' ? '🟦' :
                     '🆘'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{selectedTechnique?.name ?? ''}</p>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-gray-500">
                  {spinning ? 'Spinning...' : 'Spin to Start'}
                </p>
              )}
            </div>
          </div>

          {/* Technique Options */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {techniques?.map((tech) => (
              <div
                key={tech?.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTechnique?.id === tech?.id
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <p className="text-center font-medium text-gray-900">{tech?.name ?? ''}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSpin}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={spinning}
            >
              {spinning ? 'Spinning...' : 'Spin the Wheel'}
            </Button>
            {selectedTechnique && !spinning && (
              <>
                <Button asChild size="lg" variant="outline">
                  <Link href={`/techniques/${selectedTechnique.id === 'box-4444' ? 'box-breathing' : selectedTechnique.id === 'four-7-8' ? '4-7-8' : selectedTechnique.id === 'coherent-55' ? 'coherent' : 'sos'}`}>
                    Go to {selectedTechnique?.name ?? ''}
                  </Link>
                </Button>
                <Button onClick={handleComplete} size="lg" variant="outline">
                  ✅ Mark as Complete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Use</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Click "Spin the Wheel" to get a random technique</li>
            <li>Practice the selected technique for 1 minute</li>
            <li>Or navigate to the full technique page</li>
            <li>Perfect for decision fatigue or variety</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
