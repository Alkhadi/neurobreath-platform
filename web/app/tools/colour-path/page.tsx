'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, Square } from 'lucide-react'
import { toast } from 'sonner'
import { getDeviceId } from '@/lib/device-id'

const phases = [
  { name: 'Inhale', duration: 4, color: '#60B5FF' },
  { name: 'Hold', duration: 4, color: '#FF9149' },
  { name: 'Exhale', duration: 4, color: '#FF9898' },
  { name: 'Hold', duration: 4, color: '#A19AD3' }
]

export default function ColourPathPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [breathCount, setBreathCount] = useState(0)

  useEffect(() => {
    if (!isPlaying || isPaused) return

    const phase = phases[currentPhase]
    const timeout = setTimeout(() => {
      const nextPhase = (currentPhase + 1) % phases.length
      setCurrentPhase(nextPhase)
      if (nextPhase === 0) {
        setBreathCount(prev => prev + 1)
      }
    }, (phase?.duration ?? 4) * 1000)

    return () => clearTimeout(timeout)
  }, [isPlaying, isPaused, currentPhase])

  const handleStop = async () => {
    if (breathCount > 0) {
      try {
        const deviceId = getDeviceId()
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId,
            technique: 'colourPath',
            label: 'Colour-Path Breathing',
            minutes: Math.ceil((breathCount * 16) / 60),
            breaths: breathCount,
            rounds: breathCount,
            category: 'calm'
          })
        })
        toast.success('✅ Session logged successfully!')
      } catch (error) {
        console.error('Failed to log session:', error)
      }
    }

    setIsPlaying(false)
    setIsPaused(false)
    setCurrentPhase(0)
    setBreathCount(0)
  }

  const currentPhaseData = phases[currentPhase]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/tools"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Colour-Path Breathing</h1>
            <p className="text-lg text-gray-600">
              Follow the color trail as it lights up each breathing phase.
            </p>
          </div>

          {/* Visualization */}
          <div className="mb-8">
            <div
              className="aspect-square max-w-md mx-auto rounded-2xl transition-all duration-1000 flex items-center justify-center"
              style={{
                backgroundColor: isPlaying ? (currentPhaseData?.color ?? '#60B5FF') : '#f3f4f6',
                boxShadow: isPlaying ? `0 0 60px ${currentPhaseData?.color ?? '#60B5FF'}` : 'none'
              }}
            >
              <div className={`text-center ${isPlaying ? 'text-white' : 'text-gray-900'}`}>
                <p className="text-4xl font-bold mb-2">
                  {isPlaying ? (currentPhaseData?.name ?? 'Ready') : 'Ready'}
                </p>
                <p className="text-lg">{breathCount} breaths</p>
              </div>
            </div>
          </div>

          {/* Color Path */}
          <div className="flex justify-around mb-8">
            {phases?.map((phase, idx) => (
              <div
                key={idx}
                className={`text-center transition-opacity ${
                  idx === currentPhase && isPlaying ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: phase?.color ?? '#60B5FF' }}
                />
                <p className="text-sm font-medium text-gray-700">{phase?.name ?? ''}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isPlaying ? (
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Play className="w-4 h-4" /> Start
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={() => setIsPaused(true)} size="lg" variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" /> Pause
                  </Button>
                ) : (
                  <Button onClick={() => setIsPaused(false)} size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Play className="w-4 h-4" /> Resume
                  </Button>
                )}
                <Button onClick={handleStop} size="lg" variant="destructive" className="gap-2">
                  <Square className="w-4 h-4" /> Stop
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Watch the color change and follow the breathing phase displayed. The visual cues help anchor your attention and make timing intuitive.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Each color represents a breathing phase</li>
            <li>Follow the color changes naturally</li>
            <li>Let the visual guide your rhythm</li>
            <li>Perfect for visual processors</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
