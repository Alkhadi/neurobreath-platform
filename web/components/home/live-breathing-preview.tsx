'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Phase = 'Ready' | 'Inhale' | 'Hold' | 'Exhale'

export function LiveBreathingPreview() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('Ready')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const lastPhaseRef = useRef<Phase>('Ready')

  // Simple 4-2-6 pattern (inhale-hold-exhale) = 12 seconds per cycle
  const phases = [
    { name: 'Inhale' as Phase, duration: 4000, color: 'sky' },
    { name: 'Hold' as Phase, duration: 2000, color: 'yellow' },
    { name: 'Exhale' as Phase, duration: 6000, color: 'green' }
  ]

  const startBreathing = () => {
    setIsActive(true)
    startTimeRef.current = Date.now()
    animateBreathing()
  }

  const stopBreathing = () => {
    setIsActive(false)
    setPhase('Ready')
    setSecondsLeft(0)
    lastPhaseRef.current = 'Ready'
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const animateBreathing = () => {
    const totalCycle = phases.reduce((sum, p) => sum + p.duration, 0)
    const elapsed = Date.now() - startTimeRef.current
    const cyclePosition = elapsed % totalCycle

    let currentPhase = phases[0]
    let phaseStart = 0
    let phaseElapsed = 0

    for (let i = 0; i < phases.length; i++) {
      const p = phases[i]
      if (cyclePosition >= phaseStart && cyclePosition < phaseStart + p.duration) {
        currentPhase = p
        phaseElapsed = cyclePosition - phaseStart
        break
      }
      phaseStart += p.duration
    }

    // Update phase if changed
    if (lastPhaseRef.current !== currentPhase.name) {
      lastPhaseRef.current = currentPhase.name
      setPhase(currentPhase.name)
    }

    // Update countdown
    const remaining = Math.ceil((currentPhase.duration - phaseElapsed) / 1000)
    setSecondsLeft(remaining)

    animationRef.current = requestAnimationFrame(animateBreathing)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="live-orbit-visualizer-card">
      {/* Visual Container */}
      <div 
        className={cn(
          "live-orbit-visual-container",
          isActive && "breathing-active",
          isActive && `phase-${phase.toLowerCase()}`
        )}
      >
        {/* Outer ring */}
        <div className="live-orbit-ring" />
        
        {/* Central orb with breathing animation */}
        <div 
          className={cn(
            "live-orbit-orb",
            isActive && "breathing",
            isActive && phase.toLowerCase()
          )}
        >
          <div className="live-orbit-orb-inner">
            {isActive ? secondsLeft : ''}
          </div>
        </div>

        {/* Phase labels */}
        <div className={cn(
          "live-orbit-label live-orbit-label--inhale",
          phase === 'Inhale' && "active"
        )}>
          <span className="live-orbit-label-dot" />
          <span>Inhale</span>
        </div>

        <div className={cn(
          "live-orbit-label live-orbit-label--hold",
          phase === 'Hold' && "active"
        )}>
          <span className="live-orbit-label-dot" />
          <span>Hold</span>
        </div>

        <div className={cn(
          "live-orbit-label live-orbit-label--exhale",
          phase === 'Exhale' && "active"
        )}>
          <span className="live-orbit-label-dot" />
          <span>Exhale</span>
        </div>
      </div>

      {/* Phase display */}
      <div className="live-orbit-minutes-display">
        <span className="live-orbit-minutes-label">
          {isActive ? 'CURRENT PHASE' : 'READY TO BEGIN'}
        </span>
        <span className="live-orbit-minutes-value">
          {isActive ? phase : 'Tap Start'}
        </span>
      </div>

      {/* Controls */}
      <div className="live-orbit-controls">
        {!isActive ? (
          <button
            onClick={startBreathing}
            className="btn live-orbit-start-btn"
            aria-label="Start breathing preview"
          >
            ▶️ Start Preview
          </button>
        ) : (
          <button
            onClick={stopBreathing}
            className="btn live-orbit-start-btn"
            aria-label="Stop breathing preview"
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Pattern info */}
      <p className="live-orbit-pattern-info">
        <strong>4-2-6 Pattern:</strong> Inhale 4s · Hold 2s · Exhale 6s
      </p>
    </div>
  )
}







