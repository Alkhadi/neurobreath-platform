'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BreathingStats {
  todayMinutes: number
  sessions: number
  lifetimeMinutes: number
  lifetimeHours: number
  averageSession: number
  streak: string
  message: string
  awards: string
}

type Phase = 'Inhale' | 'Hold' | 'Exhale' | 'Ready'

export function HeroBreathingOrbit() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phase, setPhase] = useState<Phase>('Ready')
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 50 }) // Start on left middle
  const [stats, setStats] = useState<BreathingStats>({
    todayMinutes: 0,
    sessions: 0,
    lifetimeMinutes: 0,
    lifetimeHours: 0,
    averageSession: 0,
    streak: 'No streak yet',
    message: 'Complete any 1-minute challenge to start your streak. Small, regular practice helps your nervous system learn a predictable calm pattern.',
    awards: 'Log a quick session to unlock your first badge.'
  })

  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    // Load stats from localStorage
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('nb-breathing-stats')
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    }
  }, [])

  const saveStats = (newStats: BreathingStats) => {
    setStats(newStats)
    if (typeof window !== 'undefined') {
      localStorage.setItem('nb-breathing-stats', JSON.stringify(newStats))
    }
  }

  const startBreathing = () => {
    setIsRunning(true)
    setIsPaused(false)
    startTimeRef.current = Date.now() - pausedTimeRef.current
    animateBreathing()
  }

  const pauseBreathing = () => {
    setIsPaused(true)
    pausedTimeRef.current = Date.now() - startTimeRef.current
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const resumeBreathing = () => {
    setIsPaused(false)
    startTimeRef.current = Date.now() - pausedTimeRef.current
    animateBreathing()
  }

  const stopBreathing = () => {
    setIsRunning(false)
    setIsPaused(false)
    setPhase('Ready')
    setOrbPosition({ x: 0, y: 50 })
    pausedTimeRef.current = 0
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Update stats
    const sessionMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000)
    if (sessionMinutes > 0) {
      const newStats = {
        ...stats,
        todayMinutes: stats.todayMinutes + sessionMinutes,
        sessions: stats.sessions + 1,
        lifetimeMinutes: stats.lifetimeMinutes + sessionMinutes,
        lifetimeHours: parseFloat(((stats.lifetimeMinutes + sessionMinutes) / 60).toFixed(1)),
        averageSession: Math.round((stats.lifetimeMinutes + sessionMinutes) / (stats.sessions + 1))
      }
      saveStats(newStats)
    }
  }

  const animateBreathing = () => {
    const phases = [
      { name: 'Inhale' as Phase, duration: 4000 },
      { name: 'Hold' as Phase, duration: 2000 },
      { name: 'Exhale' as Phase, duration: 6000 },
      { name: 'Hold' as Phase, duration: 2000 }
    ]

    const totalCycle = phases.reduce((sum, p) => sum + p.duration, 0)
    const elapsed = Date.now() - startTimeRef.current
    const cyclePosition = elapsed % totalCycle

    let currentPhase = phases[0]
    let phaseStart = 0
    let progress = 0

    for (let i = 0; i < phases.length; i++) {
      const p = phases[i]
      if (cyclePosition >= phaseStart && cyclePosition < phaseStart + p.duration) {
        currentPhase = p
        progress = (cyclePosition - phaseStart) / p.duration
        break
      }
      phaseStart += p.duration
    }

    setPhase(currentPhase.name)

    // Calculate orb position on the pill-shaped track
    const trackProgress = (cyclePosition / totalCycle) * 100
    const position = calculateOrbPosition(trackProgress)
    setOrbPosition(position)

    animationRef.current = requestAnimationFrame(animateBreathing)
  }

  // Calculate position on pill-shaped track (rounded rectangle)
  const calculateOrbPosition = (progress: number): { x: number; y: number } => {
    // Track is a pill shape (rounded rectangle): left semicircle -> top line -> right semicircle -> bottom line
    const normalized = progress / 100

    // Divide the track into 4 segments
    if (normalized < 0.25) {
      // Left semicircle (bottom to top)
      const angle = (normalized * 4) * Math.PI
      return {
        x: 20 - Math.cos(angle) * 20,
        y: 50 + Math.sin(angle) * 30
      }
    } else if (normalized < 0.5) {
      // Top line (left to right)
      const lineProgress = (normalized - 0.25) * 4
      return {
        x: 20 + lineProgress * 60,
        y: 20
      }
    } else if (normalized < 0.75) {
      // Right semicircle (top to bottom)
      const angle = ((normalized - 0.5) * 4) * Math.PI
      return {
        x: 80 + Math.cos(angle) * 20,
        y: 50 - Math.sin(angle) * 30
      }
    } else {
      // Bottom line (right to left)
      const lineProgress = (normalized - 0.75) * 4
      return {
        x: 80 - lineProgress * 60,
        y: 80
      }
    }
  }

  const resetStats = () => {
    if (confirm('Are you sure you want to reset these stats? This cannot be undone.')) {
      const resetStats: BreathingStats = {
        todayMinutes: 0,
        sessions: 0,
        lifetimeMinutes: 0,
        lifetimeHours: 0,
        averageSession: 0,
        streak: 'No streak yet',
        message: 'Complete any 1-minute challenge to start your streak.',
        awards: 'Log a quick session to unlock your first badge.'
      }
      saveStats(resetStats)
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="orbit-container">
      {/* Title */}
      <h3 className="orbit-title">Inhale Hold Exhale</h3>

      {/* Today's Focused Minutes Card */}
      <div className="orbit-stats-card">
        <div className="orbit-stats-label">TODAY'S FOCUSED MINUTES</div>
        <div className="orbit-stats-value">{stats.todayMinutes} min</div>
      </div>

      {/* Main Orbit Visualization */}
      <div className="orbit-visual-wrapper">
        {/* Dashed outer circle */}
        <svg className="orbit-outer-circle" viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="40"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Inner track (pill shape) */}
        <div className="orbit-track"></div>

        {/* Orb */}
        <div
          className="orbit-orb"
          style={{
            left: `${orbPosition.x}%`,
            top: `${orbPosition.y}%`,
          }}
        />

        {/* Phase label */}
        <div className="orbit-phase-label">{phase}</div>
      </div>

      {/* Phase indicators */}
      <div className="orbit-phase-indicators">
        <div className={cn("orbit-phase-pill", phase === 'Inhale' && 'active')}>
          <span className="orbit-phase-dot orbit-phase-dot-inhale" />
          <span>INHALE</span>
        </div>
        <div className={cn("orbit-phase-pill", phase === 'Hold' && 'active')}>
          <span className="orbit-phase-dot orbit-phase-dot-hold" />
          <span>HOLD</span>
        </div>
        <div className={cn("orbit-phase-pill", phase === 'Exhale' && 'active')}>
          <span className="orbit-phase-dot orbit-phase-dot-exhale" />
          <span>EXHALE</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="orbit-controls">
        {!isRunning && (
          <button onClick={startBreathing} className="orbit-btn orbit-btn-start">
            🎧 Start
          </button>
        )}
        {isRunning && !isPaused && (
          <button onClick={pauseBreathing} className="orbit-btn orbit-btn-pause">
            ⏸ Pause
          </button>
        )}
        {isRunning && isPaused && (
          <button onClick={resumeBreathing} className="orbit-btn orbit-btn-resume">
            ▶ Resume
          </button>
        )}
        {isRunning && (
          <button onClick={stopBreathing} className="orbit-btn orbit-btn-stop">
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Breathing Guidance */}
      <div className="orbit-guidance-box" aria-hidden={typeof window !== 'undefined' && window.innerWidth <= 900 ? 'true' : 'false'}>
        Breathing guidance: inhale for four counts, hold for two counts, and exhale for six counts. Today's focused minutes display above.
      </div>

      {/* Measured Relief Tracker */}
      <div className="orbit-tracker-card" aria-hidden={typeof window !== 'undefined' && window.innerWidth <= 900 ? 'true' : 'false'}>
        <div className="orbit-tracker-header">
          <span className="orbit-tracker-title">Measured relief tracker</span>
          <span className="orbit-tracker-pill">
            <span className="orbit-tracker-dot">●</span>
            <span>{stats.streak}</span>
          </span>
        </div>

        <p className="orbit-tracker-message">{stats.message}</p>

        <div className="orbit-tracker-awards">
          <div className="orbit-tracker-awards-title">Score awards</div>
          <p>{stats.awards}</p>
        </div>

        {/* Stats Grid */}
        <div className="orbit-stats-grid">
          <div className="orbit-stat-pill">
            <div className="orbit-stat-label">Sessions</div>
            <div className="orbit-stat-number">{stats.sessions}</div>
          </div>
          <div className="orbit-stat-pill">
            <div className="orbit-stat-label">Lifetime min</div>
            <div className="orbit-stat-number">{stats.lifetimeMinutes}</div>
          </div>
          <div className="orbit-stat-pill">
            <div className="orbit-stat-label">Lifetime hrs</div>
            <div className="orbit-stat-number">{stats.lifetimeHours}</div>
          </div>
          <div className="orbit-stat-pill">
            <div className="orbit-stat-label">Avg session</div>
            <div className="orbit-stat-number">{stats.averageSession} min</div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="orbit-reset-section">
          <button onClick={resetStats} className="orbit-reset-btn">
            ↻ Reset these stats
          </button>
          <p className="orbit-reset-note">Only clears this page's record on this device.</p>
        </div>
      </div>
    </div>
  )
}
