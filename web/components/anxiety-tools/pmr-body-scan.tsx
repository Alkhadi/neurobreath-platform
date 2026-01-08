'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useAchievements } from '@/hooks/use-achievements'
import { PMRSession, BodyScanSession } from '@/lib/types'
import { toast } from 'sonner'

const PMR_MUSCLE_GROUPS = [
  'Hands and Forearms', 'Upper Arms', 'Shoulders', 'Neck', 'Face and Jaw',
  'Chest', 'Abdomen', 'Lower Back', 'Hips and Buttocks', 'Thighs',
  'Calves', 'Feet and Toes'
]

const BODY_SCAN_AREAS = [
  'Feet and Toes', 'Ankles and Calves', 'Knees and Thighs', 'Hips and Pelvis',
  'Lower Back', 'Abdomen', 'Chest', 'Upper Back', 'Shoulders',
  'Hands and Fingers', 'Arms', 'Neck', 'Face', 'Head and Scalp'
]

interface Props {
  mode: 'pmr' | 'bodyscan'
}

export function PMRBodyScan({ mode }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'tense' | 'relax' | 'pause'>('pause')
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [timePerArea, setTimePerArea] = useState(mode === 'pmr' ? 15 : 60)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const [pmrSessions, setPmrSessions] = useLocalStorage<PMRSession[]>('neurobreath_pmr', [])
  const [bodyScanSessions, setBodyScanSessions] = useLocalStorage<BodyScanSession[]>('neurobreath_bodyscan', [])
  const { progress, setProgress } = useAchievements()
  
  const areas = mode === 'pmr' ? PMR_MUSCLE_GROUPS : BODY_SCAN_AREAS
  const currentArea = areas?.[currentIndex]
  
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1)
        setPhaseTimeLeft(prev => {
          if (prev <= 1) {
            if (mode === 'pmr') {
              if (phase === 'tense') {
                setPhase('relax')
                return 10
              } else if (phase === 'relax') {
                if (currentIndex < areas.length - 1) {
                  setCurrentIndex(prev => prev + 1)
                  setPhase('tense')
                  return 5
                } else {
                  setIsPlaying(false)
                  handleComplete()
                  return 0
                }
              }
            } else {
              if (currentIndex < areas.length - 1) {
                setCurrentIndex(prev => prev + 1)
                return timePerArea
              } else {
                setIsPlaying(false)
                handleComplete()
                return 0
              }
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, phase, currentIndex, mode, timePerArea, areas.length])
  
  const handleStart = () => {
    setIsPlaying(true)
    if (sessionTime === 0) {
      setPhase(mode === 'pmr' ? 'tense' : 'pause')
      setPhaseTimeLeft(mode === 'pmr' ? 5 : timePerArea)
    }
  }
  
  const handlePause = () => {
    setIsPlaying(false)
  }
  
  const handleReset = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
    setPhase('pause')
    setPhaseTimeLeft(0)
    setSessionTime(0)
  }
  
  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0]
    const wasToday = progress?.lastActivityDate === today
    const newStreak = wasToday ? progress?.currentStreak ?? 0 : (progress?.currentStreak ?? 0) + 1
    
    if (mode === 'pmr') {
      const newSession: PMRSession = {
        id: Date.now().toString(),
        completedAt: new Date().toISOString(),
        duration: sessionTime,
        muscleGroupsCompleted: currentIndex + 1
      }
      setPmrSessions([...(pmrSessions ?? []), newSession])
      
      setProgress({
        ...progress,
        totalSessions: (progress?.totalSessions ?? 0) + 1,
        totalMinutes: (progress?.totalMinutes ?? 0) + Math.floor(sessionTime / 60),
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
        lastActivityDate: today,
        stats: {
          ...(progress?.stats ?? {}),
          pmrSessions: (progress?.stats?.pmrSessions ?? 0) + 1
        }
      })
    } else {
      const newSession: BodyScanSession = {
        id: Date.now().toString(),
        completedAt: new Date().toISOString(),
        duration: sessionTime
      }
      setBodyScanSessions([...(bodyScanSessions ?? []), newSession])
      
      setProgress({
        ...progress,
        totalSessions: (progress?.totalSessions ?? 0) + 1,
        totalMinutes: (progress?.totalMinutes ?? 0) + Math.floor(sessionTime / 60),
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0),
        lastActivityDate: today,
        stats: {
          ...(progress?.stats ?? {}),
          bodyScanSessions: (progress?.stats?.bodyScanSessions ?? 0) + 1
        }
      })
    }
    
    toast.success(`${mode === 'pmr' ? 'PMR' : 'Body Scan'} session completed!`, {
      description: 'Great work on your relaxation practice'
    })
  }
  
  const getInstructions = () => {
    if (mode === 'pmr') {
      if (phase === 'tense') return `Tense your ${currentArea} for 5 seconds...`
      if (phase === 'relax') return `Now release and relax your ${currentArea} for 10 seconds. Notice the difference.`
      return 'Ready to begin'
    } else {
      return `Bring your awareness to your ${currentArea}. Notice any sensations without judgment...`
    }
  }
  
  const sessions = mode === 'pmr' ? pmrSessions : bodyScanSessions
  const totalMinutes = Math.floor((sessions?.reduce((sum, s) => sum + (s?.duration ?? 0), 0) ?? 0) / 60)
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            {mode === 'pmr' ? 'Progressive Muscle Relaxation' : 'Body Scan Meditation'}
          </h2>
        </div>
        <p className="text-muted-foreground">
          {mode === 'pmr' 
            ? 'Systematically tense and release muscle groups to achieve deep relaxation.' 
            : 'Mindfully scan through your body, bringing awareness to each area without judgment.'}
        </p>
      </Card>
      
      {mode === 'bodyscan' && (
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">Time per body area (seconds)</label>
          <Select value={timePerArea.toString()} onValueChange={(v) => setTimePerArea(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 seconds (Quick - 7 min total)</SelectItem>
              <SelectItem value="60">60 seconds (Standard - 14 min total)</SelectItem>
              <SelectItem value="120">120 seconds (Deep - 28 min total)</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      )}
      
      <Card className="p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Progress */}
          <div className="w-full">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{currentIndex + 1} / {areas.length}</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                style={{ width: `${((currentIndex + 1) / areas.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Current Area */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-4">
              {phaseTimeLeft > 0 ? phaseTimeLeft : ''}
            </div>
            <div className="text-xl font-semibold mb-2">{currentArea}</div>
            <div className="text-muted-foreground max-w-md">
              {getInstructions()}
            </div>
            {mode === 'pmr' && phase !== 'pause' && (
              <div className="mt-4 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium">
                {phase === 'tense' ? 'TENSE' : 'RELAX'}
              </div>
            )}
          </div>
          
          {/* Session Time */}
          <div className="text-2xl font-bold text-muted-foreground">
            {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}
          </div>
          
          {/* Controls */}
          <div className="flex gap-4">
            {!isPlaying ? (
              <Button size="lg" onClick={handleStart} className="px-8">
                <Play className="mr-2 h-5 w-5" />
                {sessionTime === 0 ? 'Start' : 'Resume'}
              </Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={handlePause} className="px-8">
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={handleReset} className="px-8">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Your Practice</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{sessions?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
            <div className="text-sm text-muted-foreground">Total Minutes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{progress?.currentStreak ?? 0}</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
