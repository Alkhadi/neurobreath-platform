'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface BreathingStats {
  todayMinutes: number
  sessions: number
  lifetimeMinutes: number
  lifetimeHours: number
  averageSession: number
  currentStreak?: number
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
    // Load stats from localStorage and calculate streak
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('nb-breathing-stats')
      const lastSessionDate = localStorage.getItem('nb-last-session-date')

      if (savedStats) {
        const parsedStats = JSON.parse(savedStats)

        // Calculate streak
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        let streakInfo = {
          streak: 'No streak yet',
          message: 'Complete any 1-minute challenge to start your streak. Small, regular practice helps your nervous system learn a predictable calm pattern.',
          awards: 'Log a quick session to unlock your first badge.'
        }

        if (lastSessionDate) {
          const lastDate = new Date(lastSessionDate).toDateString()
          const currentStreak = parsedStats.currentStreak || 0

          if (lastDate === today && currentStreak > 0) {
            streakInfo = calculateStreakInfo(currentStreak, parsedStats.sessions)
          } else if (lastDate === yesterday && currentStreak > 0) {
            streakInfo = calculateStreakInfo(currentStreak, parsedStats.sessions)
          } else if (currentStreak === 0 && parsedStats.sessions > 0) {
            streakInfo = {
              streak: '1 day',
              message: 'Great start! Practice again tomorrow to build your streak.',
              awards: parsedStats.sessions >= 5 ? '🥉 Bronze badge unlocked!' : `${parsedStats.sessions}/5 sessions to Bronze badge`
            }
          }
        }

        setStats({ ...parsedStats, ...streakInfo })
      }
    }
  }, [])

  const calculateStreakInfo = (streak: number, sessions: number) => {
    let message = ''
    let awards = ''

    if (streak >= 30) {
      message = '🔥 Outstanding! 30+ days of consistent practice. Your nervous system is building lasting calm patterns.'
      awards = '🏆 Diamond streak! All badges unlocked.'
    } else if (streak >= 14) {
      message = '🌟 Two weeks strong! Consistent practice is rewiring your stress response.'
      awards = '🥇 Gold badge + Silver + Bronze unlocked!'
    } else if (streak >= 7) {
      message = '💪 One week streak! You\'re building a powerful daily habit.'
      awards = '🥈 Silver badge + Bronze unlocked!'
    } else if (streak >= 3) {
      message = '✨ Nice momentum! Keep this up for proven nervous system benefits.'
      awards = sessions >= 5 ? '🥉 Bronze badge unlocked!' : `${sessions}/5 sessions to Bronze`
    } else {
      message = 'Building your streak. Each session strengthens your calm response.'
      awards = sessions >= 5 ? '🥉 Bronze badge unlocked!' : `${sessions}/5 sessions to Bronze`
    }

    return {
      streak: `${streak} day${streak !== 1 ? 's' : ''}`,
      message,
      awards
    }
  }

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

    // Update stats with streak tracking
    const sessionMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000)
    if (sessionMinutes > 0) {
      const today = new Date().toDateString()
      const lastSessionDate = typeof window !== 'undefined' ? localStorage.getItem('nb-last-session-date') : null
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      let currentStreak = stats.currentStreak || 0

      if (!lastSessionDate || lastSessionDate !== today) {
        // First session today
        if (lastSessionDate === yesterday) {
          currentStreak += 1 // Continue streak
        } else if (!lastSessionDate || currentStreak === 0) {
          currentStreak = 1 // Start new streak
        } else {
          currentStreak = 1 // Reset streak after break
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('nb-last-session-date', today)
        }
      }

      const totalSessions = stats.sessions + 1
      const totalMinutes = stats.lifetimeMinutes + sessionMinutes

      const newStats = {
        ...stats,
        todayMinutes: stats.todayMinutes + sessionMinutes,
        sessions: totalSessions,
        lifetimeMinutes: totalMinutes,
        lifetimeHours: parseFloat((totalMinutes / 60).toFixed(1)),
        averageSession: Math.round(totalMinutes / totalSessions),
        currentStreak,
        ...calculateStreakInfo(currentStreak, totalSessions)
      }

      saveStats(newStats)
    }
  }

  const animateBreathing = () => {
    // Using 4-6 breathing pattern (4s inhale, 6s exhale) - 60-second SOS technique
    const phases = [
      { name: 'Inhale' as Phase, duration: 4000 },
      { name: 'Exhale' as Phase, duration: 6000 }
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

        {/* Orb - Using CSS custom properties for dynamic animation positioning */}
        <div
          className="orbit-orb"
          style={{
            ['--orb-x' as string]: `${orbPosition.x}%`,
            ['--orb-y' as string]: `${orbPosition.y}%`,
          }}
        />

        {/* Phase label */}
        <div className="orbit-phase-label">{phase}</div>
      </div>

      {/* Phase indicators */}
      <div className="orbit-phase-indicators">
        <div className={cn("orbit-phase-pill", phase === 'Inhale' && 'active')}>
          <span className="orbit-phase-dot orbit-phase-dot-inhale" />
          <span>INHALE (4s)</span>
        </div>
        <div className={cn("orbit-phase-pill", phase === 'Exhale' && 'active')}>
          <span className="orbit-phase-dot orbit-phase-dot-exhale" />
          <span>EXHALE (6s)</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="orbit-controls">
        {!isRunning && (
          <button onClick={startBreathing} className="orbit-btn orbit-btn-start" aria-label="Start breathing exercise">
            🎧 Start
          </button>
        )}
        {isRunning && !isPaused && (
          <button onClick={pauseBreathing} className="orbit-btn orbit-btn-pause" aria-label="Pause breathing exercise">
            ⏸ Pause
          </button>
        )}
        {isRunning && isPaused && (
          <button onClick={resumeBreathing} className="orbit-btn orbit-btn-resume" aria-label="Resume breathing exercise">
            ▶ Resume
          </button>
        )}
        {isRunning && (
          <button onClick={stopBreathing} className="orbit-btn orbit-btn-stop" aria-label="Stop breathing exercise">
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Breathing Guidance - Hidden on mobile via CSS */}
      <div className="orbit-guidance-box">
        🆘 60-second SOS breathing: Inhale for 4 seconds, exhale for 6 seconds. Six complete cycles provide immediate calm. Today&apos;s focused minutes display above.
      </div>
    </div>
  )
}
