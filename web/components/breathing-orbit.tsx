'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Play, Pause, Square } from 'lucide-react'
import { BreathingTechnique, calculateTotalCycleDuration } from '@/lib/breathing-data'

interface BreathingOrbitProps {
  technique: BreathingTechnique
  onSessionComplete?: (breaths: number, rounds: number) => void
}

export default function BreathingOrbit({ technique, onSessionComplete }: BreathingOrbitProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  const phases = technique?.phases ?? []
  const currentPhase = phases?.[currentPhaseIndex]
  const totalCycleDuration = calculateTotalCycleDuration(technique)

  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    startTimeRef.current = performance.now() - pausedTimeRef.current

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const currentPhaseDuration = (currentPhase?.duration ?? 1) * 1000
      const progress = Math.min((elapsed % currentPhaseDuration) / currentPhaseDuration, 1)

      setPhaseProgress(progress)

      if (elapsed >= currentPhaseDuration) {
        const nextIndex = (currentPhaseIndex + 1) % phases.length
        setCurrentPhaseIndex(nextIndex)
        startTimeRef.current = currentTime
        pausedTimeRef.current = 0

        // Count breath when completing exhale
        if (currentPhase?.name === 'Exhale') {
          setBreathCount(prev => prev + 1)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isPaused, currentPhaseIndex, phases, currentPhase])

  const handleStart = () => {
    setIsPlaying(true)
    setIsPaused(false)
    pausedTimeRef.current = 0
  }

  const handlePause = () => {
    setIsPaused(true)
    pausedTimeRef.current = performance.now() - startTimeRef.current
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentPhaseIndex(0)
    setPhaseProgress(0)
    pausedTimeRef.current = 0
    
    if (breathCount > 0 && onSessionComplete) {
      onSessionComplete?.(breathCount, Math.floor(breathCount / phases.length))
    }
    
    setBreathCount(0)
  }

  const orbAngle = (phaseProgress ?? 0) * 2 * Math.PI - Math.PI / 2
  const orbX = 50 + 40 * Math.cos(orbAngle)
  const orbY = 50 + 40 * Math.sin(orbAngle)

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Visualization */}
      <div className="relative aspect-square w-full mb-6" aria-hidden="true">
        {/* Ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-300"
          />
        </svg>

        {/* Orb */}
        <div
          className="absolute w-8 h-8 rounded-full transition-all duration-300"
          style={{
            left: `${orbX}%`,
            top: `${orbY}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: currentPhase?.color ?? '#60B5FF',
            boxShadow: `0 0 20px ${currentPhase?.color ?? '#60B5FF'}`
          }}
        />

        {/* Phase Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-semibold" style={{ color: currentPhase?.color ?? '#60B5FF' }}>
              {isPlaying ? (currentPhase?.name ?? 'Ready') : 'Ready'}
            </p>
            <p className="text-sm text-gray-500 mt-1">{breathCount} breaths</p>
          </div>
        </div>
      </div>

      {/* Phase Labels */}
      <div className="flex justify-around mb-6 text-sm">
        {phases?.map((phase, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 transition-opacity ${
              idx === currentPhaseIndex && isPlaying ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: phase?.color ?? '#60B5FF' }}
            />
            <span>{phase?.name ?? ''}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        {!isPlaying ? (
          <Button onClick={handleStart} className="gap-2">
            <Play className="w-4 h-4" /> Start
          </Button>
        ) : (
          <>
            {!isPaused ? (
              <Button onClick={handlePause} variant="outline" className="gap-2">
                <Pause className="w-4 h-4" /> Pause
              </Button>
            ) : (
              <Button onClick={handleResume} className="gap-2">
                <Play className="w-4 h-4" /> Resume
              </Button>
            )}
            <Button onClick={handleStop} variant="destructive" className="gap-2">
              <Square className="w-4 h-4" /> Stop
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
