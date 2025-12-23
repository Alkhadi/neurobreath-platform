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

export function HeroBreathingOrbit() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phase, setPhase] = useState<string>('Ready')
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

  const orbRef = useRef<HTMLDivElement>(null)
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
      { name: 'Inhale', duration: 4000, transform: 'scale(1.3)' },
      { name: 'Hold', duration: 2000, transform: 'scale(1.3)' },
      { name: 'Exhale', duration: 6000, transform: 'scale(0.8)' },
      { name: 'Hold', duration: 2000, transform: 'scale(0.8)' }
    ]

    const totalCycle = phases.reduce((sum, p) => sum + p.duration, 0)
    const elapsed = Date.now() - startTimeRef.current
    const cyclePosition = elapsed % totalCycle

    let currentPhase = phases[0]
    let phaseStart = 0

    for (const p of phases) {
      if (cyclePosition >= phaseStart && cyclePosition < phaseStart + p.duration) {
        currentPhase = p
        break
      }
      phaseStart += p.duration
    }

    setPhase(currentPhase.name)

    if (orbRef.current) {
      orbRef.current.style.transform = currentPhase.transform
    }

    animationRef.current = requestAnimationFrame(animateBreathing)
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
    <aside className="nb-hero-orbit" data-nb-activity-card="1" aria-label="Breathing rhythm visual with live stats">
      <div className="nb-orbit-header">
        <h3 className="nb-orbit-title">Inhale Hold Exhale</h3>
        <div className="nb-orbit-stat" aria-live="polite">
          <span className="nb-orbit-stat-label">Today's focused minutes</span>
          <strong className="nb-orbit-stat-value">
            <b>{stats.todayMinutes}</b> min
          </strong>
        </div>
      </div>

      <div className="nb-orbit-visual" id="heroOrbitVisual" aria-hidden="true">
        <div className="nb-orbit-ring"></div>
        <div 
          ref={orbRef}
          className="nb-orbit-orb" 
          style={{ transition: 'transform 1s ease-in-out' }}
        />
        <div className="nb-orbit-phase-label" aria-live="polite">
          {phase}
        </div>
      </div>

      <div className="nb-orbit-label-row" aria-hidden="true">
        <div className="nb-orbit-label nb-orbit-label--inhale">
          <span></span> Inhale
        </div>
        <div className="nb-orbit-label nb-orbit-label--hold">
          <span></span> Hold
        </div>
        <div className="nb-orbit-label nb-orbit-label--exhale">
          <span></span> Exhale
        </div>
      </div>

      <div className="nb-orbit-controls">
        {!isRunning && (
          <Button
            onClick={startBreathing}
            className="btn btn-primary nb-orbit-start-btn"
            aria-label="Start breathing session"
          >
            🎧 Start
          </Button>
        )}
        {isRunning && !isPaused && (
          <Button
            onClick={pauseBreathing}
            className="btn nb-orbit-pause-btn"
            aria-label="Pause breathing session"
          >
            ⏸ Pause
          </Button>
        )}
        {isRunning && isPaused && (
          <Button
            onClick={resumeBreathing}
            className="btn nb-orbit-resume-btn"
            aria-label="Resume breathing session"
          >
            ▶ Resume
          </Button>
        )}
        {isRunning && (
          <Button
            onClick={stopBreathing}
            className="btn nb-orbit-stop-btn"
            aria-label="Stop breathing session"
          >
            ⏹ Stop
          </Button>
        )}
      </div>

      <p className="nb-orbit-guidance">
        Breathing guidance: inhale for four counts, hold for two counts, and exhale for six counts. Today's focused minutes display above.
      </p>

      <div className="nb-orbit-side">
        <div className="nb-orbit-side-title">
          <span>Measured relief tracker</span>
          <span className="nb-orbit-side-pill">
            <span aria-hidden="true">●</span>
            <span>{stats.streak}</span>
          </span>
        </div>

        <div className="nb-orbit-side-body">
          <p>{stats.message}</p>

          <div className="nb-orbit-score">
            <span>Score awards</span>
            <p>{stats.awards}</p>
          </div>

          <div className="nb-orbit-mini-metrics">
            <div className="nb-orbit-mini-metric">
              <span>Sessions</span>
              <b>{stats.sessions}</b>
            </div>
            <div className="nb-orbit-mini-metric">
              <span>Lifetime min</span>
              <b>{stats.lifetimeMinutes}</b>
            </div>
            <div className="nb-orbit-mini-metric">
              <span>Lifetime hrs</span>
              <b>{stats.lifetimeHours}</b>
            </div>
            <div className="nb-orbit-mini-metric">
              <span>Avg session</span>
              <b>{stats.averageSession} min</b>
            </div>
          </div>

          <div className="nb-hero-reset">
            <button 
              type="button" 
              onClick={resetStats}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ↻ Reset these stats
            </button>
            <small>Only clears this page's record on this device.</small>
          </div>
        </div>
      </div>
    </aside>
  )
}
