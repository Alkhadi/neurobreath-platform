'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { BreathingSession } from '@/lib/types'
import { getBreathingSnapshotAtElapsedMs } from '@/lib/breathing/engineSnapshot'
import { toast } from 'sonner'

type BreathingType = 'box' | '4-7-8' | 'coherent' | 'sos-60'

interface BreathingTechnique {
  id: BreathingType
  name: string
  description: string
  phases: Array<{ name: string; duration: number; color: string }>
  totalCycle: number
}

const TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4-4-4-4 pattern for stabilizing the nervous system',
    phases: [
      { name: 'Inhale', duration: 4, color: 'from-blue-400 to-blue-500' },
      { name: 'Hold', duration: 4, color: 'from-purple-400 to-purple-500' },
      { name: 'Exhale', duration: 4, color: 'from-green-400 to-green-500' },
      { name: 'Hold', duration: 4, color: 'from-yellow-400 to-yellow-500' }
    ],
    totalCycle: 16
  },
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Extended exhale for deep relaxation',
    phases: [
      { name: 'Inhale', duration: 4, color: 'from-blue-400 to-blue-500' },
      { name: 'Hold', duration: 7, color: 'from-purple-400 to-purple-500' },
      { name: 'Exhale', duration: 8, color: 'from-green-400 to-green-500' }
    ],
    totalCycle: 19
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5-5 pattern for heart rate variability',
    phases: [
      { name: 'Inhale', duration: 5, color: 'from-blue-400 to-blue-500' },
      { name: 'Exhale', duration: 5, color: 'from-green-400 to-green-500' }
    ],
    totalCycle: 10
  },
  {
    id: 'sos-60',
    name: 'SOS 60-Second Reset',
    description: 'Quick calming technique for acute anxiety',
    phases: [
      { name: 'Inhale', duration: 4, color: 'from-blue-400 to-blue-500' },
      { name: 'Hold', duration: 2, color: 'from-purple-400 to-purple-500' },
      { name: 'Exhale', duration: 6, color: 'from-green-400 to-green-500' }
    ],
    totalCycle: 12
  }
]

export function BreathingSuite() {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingType>('box')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [sessions, setSessions] = useLocalStorage<BreathingSession[]>('neurobreath_breathing', [])
  const { progress, setProgress } = useAchievements()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionTimeRef = useRef(0)

  const technique = TECHNIQUES.find(t => t?.id === selectedTechnique) ?? TECHNIQUES[0]
  const currentPhase = technique?.phases?.[currentPhaseIndex] ?? technique?.phases?.[0]

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const syncFromElapsedSeconds = (elapsedSeconds: number) => {
      const snapshot = getBreathingSnapshotAtElapsedMs({
        phases: (technique?.phases ?? []).map((p) => ({ name: p.name, durationSeconds: p.duration })),
        elapsedMs: elapsedSeconds * 1000,
        totalMs: undefined,
      })

      setCurrentPhaseIndex(snapshot.phaseIndex)
      setPhaseTimeLeft(Math.max(0, Math.ceil(snapshot.phaseMsRemaining / 1000)))
      setBreathCount(snapshot.cyclesCompleted)

      return snapshot
    }

    // Ensure UI is synced immediately on start/resume.
    syncFromElapsedSeconds(sessionTimeRef.current)

    timerRef.current = setInterval(() => {
      const newTime = sessionTimeRef.current + 1
      sessionTimeRef.current = newTime
      setSessionTime(newTime)
      syncFromElapsedSeconds(newTime)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, technique])

  useEffect(() => {
    sessionTimeRef.current = sessionTime
  }, [sessionTime])

  const handleStart = () => {
    setIsPlaying(true)
    if (sessionTime === 0) {
      setPhaseTimeLeft(currentPhase?.duration ?? 4)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    if (sessionTime > 0) {
      // Save session
      const newSession: BreathingSession = {
        id: Date.now().toString(),
        type: selectedTechnique,
        duration: sessionTime,
        breathCount,
        completedAt: new Date().toISOString()
      }
      setSessions([...(sessions ?? []), newSession])

      // Update progress
      const today = new Date().toISOString().split('T')[0]
      const wasToday = progress?.lastActivityDate === today
      const newStreak = wasToday ? progress?.currentStreak ?? 0 : (progress?.currentStreak ?? 0) + 1

      setProgress({
        ...progress,
        totalSessions: (progress?.totalSessions ?? 0) + 1,
        totalMinutes: (progress?.totalMinutes ?? 0) + Math.floor(sessionTime / 60),
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
        lastActivityDate: today,
        stats: {
          ...(progress?.stats ?? {}),
          breathingSessions: (progress?.stats?.breathingSessions ?? 0) + 1
        }
      })

      toast.success('Breathing session saved!', {
        description: `${breathCount} breaths completed in ${Math.floor(sessionTime / 60)}m ${sessionTime % 60}s`
      })
    }

    setIsPlaying(false)
    setCurrentPhaseIndex(0)
    setPhaseTimeLeft(0)
    setSessionTime(0)
    sessionTimeRef.current = 0
    setBreathCount(0)
  }

  const handleTechniqueChange = (type: BreathingType) => {
    if (isPlaying) handlePause()
    setSelectedTechnique(type)
    setCurrentPhaseIndex(0)
    setPhaseTimeLeft(0)
  }

  const totalBreaths = sessions?.reduce?.((sum, s) => sum + (s?.breathCount ?? 0), 0) ?? 0
  const totalMinutes = Math.floor((sessions?.reduce?.((sum, s) => sum + (s?.duration ?? 0), 0) ?? 0) / 60)

  // Calculate scale for breathing animation
  const phaseProgress = phaseTimeLeft > 0 ? 1 - (phaseTimeLeft / (currentPhase?.duration ?? 1)) : 0
  const scale = currentPhase?.name === 'Inhale' ? 1 + phaseProgress * 0.3 : 
               currentPhase?.name === 'Exhale' ? 1.3 - phaseProgress * 0.3 : 1.15

  return (
    <div className="space-y-6">
      {/* Technique Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TECHNIQUES.map(tech => (
          <Card
            key={tech?.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedTechnique === tech?.id ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => handleTechniqueChange(tech?.id ?? 'box')}
          >
            <h3 className="font-semibold text-sm mb-1">{tech?.name}</h3>
            <p className="text-xs text-muted-foreground">{tech?.description}</p>
          </Card>
        ))}
      </div>

      {/* Main Breathing Visualization */}
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Breathing Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${
                currentPhase?.color ?? 'from-blue-400 to-blue-500'
              } transition-all duration-1000 ease-in-out`}
              data-scale={isPlaying ? scale : 1}
              data-breathing-active={isPlaying}
            />
            <div className="relative z-10 text-center text-white">
              <div className="text-3xl font-bold mb-2">
                {phaseTimeLeft > 0 ? phaseTimeLeft : currentPhase?.duration ?? 0}
              </div>
              <div className="text-lg font-medium">
                {isPlaying ? currentPhase?.name ?? 'Ready' : 'Ready'}
              </div>
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{breathCount}</div>
              <div className="text-sm text-muted-foreground">Breaths</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{sessions?.length ?? 0}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {!isPlaying ? (
              <Button size="lg" onClick={handleStart} className="px-8">
                <Play className="mr-2 h-5 w-5" />
                Start
              </Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={handlePause} className="px-8">
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={handleReset} className="px-8">
              <RotateCcw className="mr-2 h-5 w-5" />
              {sessionTime > 0 ? 'Finish & Save' : 'Reset'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Lifetime Stats */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wind className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Lifetime Statistics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{sessions?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
            <div className="text-sm text-muted-foreground">Total Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalBreaths}</div>
            <div className="text-sm text-muted-foreground">Total Breaths</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{progress?.currentStreak ?? 0}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
