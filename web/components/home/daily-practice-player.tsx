'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react'
import { breathingTechniques, calculateRoundsForMinutes, getTechniqueById } from '@/lib/breathing-data'
import { getDeviceId } from '@/lib/device-id'
import { toast } from 'sonner'

export default function DailyPracticePlayer() {
  const [technique, setTechnique] = useState('box-4444')
  const [minutes, setMinutes] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [currentPhase, setCurrentPhase] = useState('Ready')

  const selectedTechnique = getTechniqueById(technique)
  const totalRounds = calculateRoundsForMinutes(selectedTechnique!, minutes)

  useEffect(() => {
    setTimeLeft(minutes * 60)
  }, [minutes])

  useEffect(() => {
    if (!isPlaying || isPaused) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleStop()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, isPaused])

  const handleStart = () => {
    setIsPlaying(true)
    setIsPaused(false)
    setCurrentRound(0)
    setBreathCount(0)
    setTimeLeft(minutes * 60)
    setCurrentPhase('Inhale')
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentRound(0)
    setBreathCount(0)
    setTimeLeft(minutes * 60)
    setCurrentPhase('Ready')
  }

  const handleStop = async () => {
    setIsPlaying(false)
    setIsPaused(false)

    // Log session
    if (breathCount > 0) {
      try {
        const deviceId = getDeviceId()
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId,
            technique,
            label: selectedTechnique?.name ?? 'Breathing Session',
            minutes,
            breaths: breathCount,
            rounds: currentRound,
            category: selectedTechnique?.category ?? 'calm'
          })
        })
        toast.success('✅ Session logged successfully!')
      } catch (error) {
        console.error('Failed to log session:', error)
      }
    }

    setCurrentRound(0)
    setBreathCount(0)
    setTimeLeft(minutes * 60)
    setCurrentPhase('Ready')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section id="daily-practice" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-purple-600 mb-2">Coach guided</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily practice in one tap</h2>
            <p className="text-gray-600">
              Choose a breathing pattern, set minutes, and add optional voice narration. Sessions log to your progress automatically.
            </p>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="technique" className="block text-sm font-medium text-gray-700 mb-2">Technique</label>
              <select
                id="technique"
                value={technique}
                onChange={(e) => setTechnique(e?.target?.value ?? 'box-4444')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isPlaying}
              >
                <option value="box-4444">Box Breathing · 4-4-4-4</option>
                <option value="coherent-55">Coherent Breathing · 5-5</option>
                <option value="four-7-8">4-7-8 Reset</option>
                <option value="sos-1m">SOS Reset · 60s</option>
              </select>
            </div>

            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <div className="flex items-center gap-4">
                <input
                  id="minutes"
                  type="range"
                  min="1"
                  max="10"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e?.target?.value ?? 3))}
                  className="flex-1"
                  disabled={isPlaying}
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[4rem]">{minutes} min</span>
              </div>
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Round</p>
              <p className="text-2xl font-bold text-gray-900">{currentRound}/{totalRounds}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Breaths</p>
              <p className="text-2xl font-bold text-gray-900">{breathCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Time left</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(timeLeft)}</p>
            </div>
          </div>

          {/* Breathing Diagram */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 mb-8">
            <div className="aspect-square max-w-xs mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
              <p className="text-2xl font-semibold text-gray-900">{currentPhase}</p>
            </div>
          </div>

          {/* Phase Breakdown */}
          {selectedTechnique && (
            <div className="flex justify-center gap-4 mb-8">
              {selectedTechnique?.phases?.map((phase, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: phase?.color ?? '#60B5FF' }}
                  />
                  <span className="text-sm text-gray-600">
                    {phase?.name ?? ''} ({phase?.duration ?? 0}s)
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            {!isPlaying ? (
              <Button onClick={handleStart} size="lg" className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Play className="w-4 h-4" /> Start
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={handlePause} size="lg" variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" /> Pause
                  </Button>
                ) : (
                  <Button onClick={handleResume} size="lg" className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Play className="w-4 h-4" /> Resume
                  </Button>
                )}
                <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
              </>
            )}
            <Button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              size="lg"
              variant="ghost"
              className="gap-2"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Voice {voiceEnabled ? 'on' : 'off'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
