
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ArrowLeft, Sprout, Trophy, TrendingUp, Star, Sparkles, Info,
  Flame, Shield, Gift, ScrollText, ChevronRight, Lock, Check,
  Snowflake, Award, Clock, Music, Vibrate
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Companion, CompactCompanion, CompanionInSession } from '@/components/focus/companion'
import { CompanionCustomizationModal } from '@/components/focus/companion-customization-modal'
import { getUnlockableAccessories } from '@/lib/focus/companion-data'
import {
  loadFocusGardenProgress,
  saveFocusGardenProgress,
  calculateGardenLevel,
  getGardenLevelProgress,
  logSession,
  plantTask as storePlantTask,
  waterPlant as storeWaterPlant,
  harvestPlant as storeHarvestPlant,
  migrateOldProgress,
  interactWithCompanion,
  updateCompanionMood,
  changeCompanionType,
  setCompanionName,
  equipAccessory,
  unequipAccessory,
  GARDEN_LEVELS,
  FOCUS_GARDEN_BADGES,
  MULTI_DAY_QUESTS,
  startQuest,
  completeQuestDay,
  getAvailableQuests,
  getActiveQuests,
  getBadgeInfo,
  type FocusGardenProgress,
  type MultiDayQuest
} from '@/lib/focus-garden-store'

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function vibrate(pattern: number | number[]) {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav: any = navigator
  if (nav?.vibrate) {
    nav.vibrate(pattern)
  }
}

async function fireConfettiBurst(options?: { particleCount?: number; spread?: number; startVelocity?: number }) {
  if (typeof window === 'undefined') return
  const confetti = (await import('canvas-confetti')).default
  confetti({
    particleCount: options?.particleCount ?? 90,
    spread: options?.spread ?? 70,
    startVelocity: options?.startVelocity ?? 30,
    origin: { y: 0.65 }
  })
}

type SensorySettings = {
  hapticsEnabled: boolean
  confettiEnabled: boolean
}

const SENSORY_SETTINGS_KEY = 'nb:focus-garden:v2:sensory'

function loadSensorySettings(): SensorySettings {
  if (typeof window === 'undefined') return { hapticsEnabled: true, confettiEnabled: true }
  try {
    const raw = window.localStorage.getItem(SENSORY_SETTINGS_KEY)
    if (!raw) return { hapticsEnabled: true, confettiEnabled: true }
    const parsed = JSON.parse(raw) as Partial<SensorySettings>
    return {
      hapticsEnabled: parsed.hapticsEnabled ?? true,
      confettiEnabled: parsed.confettiEnabled ?? true
    }
  } catch {
    return { hapticsEnabled: true, confettiEnabled: true }
  }
}

function saveSensorySettings(next: SensorySettings) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SENSORY_SETTINGS_KEY, JSON.stringify(next))
  } catch {
    // ignore storage failures
  }
}

function hapticPulse(kind: 'minor' | 'major' | 'unlock') {
  if (kind === 'minor') return vibrate(10)
  if (kind === 'unlock') return vibrate([15, 20, 15, 20, 30])
  return vibrate([25, 30, 25])
}

type AmbienceType =
  | 'none'
  | 'cosmic'
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'birds'
  | 'tibetan'
  | 'meditation'
  | 'spiritual'

const AMBIENCE_OPTIONS: Array<{ value: AmbienceType; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'rain', label: 'Soft rain' },
  { value: 'ocean', label: 'Ocean waves' },
  { value: 'forest', label: 'Forest hush' },
  { value: 'cosmic', label: 'Cosmic hum' },
  { value: 'tibetan', label: 'Tibetan bowls' },
  { value: 'meditation', label: 'Meditation tones' },
  { value: 'spiritual', label: 'Harmonic tones' },
  { value: 'birds', label: 'Birdsong' }
]

class AmbientSoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private noiseNode: AudioBufferSourceNode | null = null

  constructor() {
    if (typeof window === 'undefined') return
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextClass) return
    this.audioContext = new AudioContextClass()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.connect(this.audioContext.destination)
  }

  setVolume(volume: number) {
    if (!this.masterGain) return
    this.masterGain.gain.setValueAtTime(
      Math.max(0, Math.min(1, volume)),
      this.audioContext?.currentTime || 0
    )
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    const ctx = this.audioContext
    if (!ctx) throw new Error('AudioContext not available')

    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = buffer.getChannelData(0)

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1

      if (type === 'white') {
        output[i] = white * 0.5
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        output[i] =
          (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      } else {
        output[i] = (b0 = (b0 + 0.02 * white) / 1.02) * 3.5
      }
    }
    return buffer
  }

  private createOscillator(
    freq: number,
    type: OscillatorType,
    gain: number
  ): OscillatorNode {
    const ctx = this.audioContext
    if (!ctx || !this.masterGain) throw new Error('AudioContext not available')
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    oscGain.gain.setValueAtTime(gain, ctx.currentTime)
    osc.connect(oscGain)
    oscGain.connect(this.masterGain)
    return osc
  }

  play(type: AmbienceType) {
    if (!this.audioContext || !this.masterGain || type === 'none') return

    this.stop()

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {})
    }

    switch (type) {
      case 'cosmic': {
        const freqs = [55, 110, 165, 220]
        freqs.forEach((f) => {
          const osc = this.createOscillator(f, 'sine', 0.03)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'rain': {
        const noiseBuffer = this.createNoiseBuffer('pink')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = noiseBuffer
        this.noiseNode.loop = true
        const filter = this.audioContext.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime)
        this.noiseNode.connect(filter)
        filter.connect(this.masterGain)
        this.noiseNode.start()
        break
      }
      case 'ocean': {
        const noiseBuffer = this.createNoiseBuffer('brown')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = noiseBuffer
        this.noiseNode.loop = true
        const filter = this.audioContext.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime)
        this.noiseNode.connect(filter)
        filter.connect(this.masterGain)
        this.noiseNode.start()
        break
      }
      case 'forest': {
        const noiseBuffer = this.createNoiseBuffer('pink')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = noiseBuffer
        this.noiseNode.loop = true
        const filter = this.audioContext.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime)
        filter.Q.setValueAtTime(0.5, this.audioContext.currentTime)
        this.noiseNode.connect(filter)
        filter.connect(this.masterGain)
        this.noiseNode.start()
        break
      }
      case 'birds': {
        const freqs = [1200, 1800, 2400, 3000]
        freqs.forEach((f) => {
          const osc = this.createOscillator(f, 'sine', 0.01)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'tibetan': {
        const freqs = [136.1, 272.2, 408.3]
        freqs.forEach((f) => {
          const osc = this.createOscillator(f, 'sine', 0.05)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'meditation': {
        const freqs = [256, 384, 512]
        freqs.forEach((f) => {
          const osc = this.createOscillator(f, 'sine', 0.04)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'spiritual': {
        const freqs = [432, 528, 639]
        freqs.forEach((f) => {
          const osc = this.createOscillator(f, 'sine', 0.03)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
    }
  }

  stop() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop()
      } catch {}
    })
    this.oscillators = []

    if (this.noiseNode) {
      try {
        this.noiseNode.stop()
      } catch {}
      this.noiseNode = null
    }
  }
}

function BreathingSessionModal({
  companion,
  onClose,
  onComplete,
  onInteract,
  hapticsEnabled,
  confettiEnabled,
  onToggleHaptics,
  onToggleConfetti
}: {
  companion: FocusGardenProgress['companion']
  onClose: () => void
  onComplete: (minutes: number) => void
  onInteract: () => void
  hapticsEnabled: boolean
  confettiEnabled: boolean
  onToggleHaptics: () => void
  onToggleConfetti: () => void
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [targetMinutes, setTargetMinutes] = useState<2 | 5>(2)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [phase, setPhase] = useState<BreathingPhase>('rest')
  const [sensoryOpen, setSensoryOpen] = useState(false)
  const [ambience, setAmbience] = useState<AmbienceType>('none')
  const [ambienceVolume, setAmbienceVolume] = useState(0.3)
  const ambientSoundRef = useRef<AmbientSoundGenerator | null>(null)

  // Box breathing: 4-4-4-4
  const phases = useMemo(() => {
    return [
      { phase: 'inhale' as const, seconds: 4 },
      { phase: 'hold' as const, seconds: 4 },
      { phase: 'exhale' as const, seconds: 4 },
      { phase: 'rest' as const, seconds: 4 }
    ]
  }, [])

  const totalSeconds = targetMinutes * 60
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

  useEffect(() => {
    ambientSoundRef.current = new AmbientSoundGenerator()
    ambientSoundRef.current?.setVolume(ambienceVolume)
    return () => {
      ambientSoundRef.current?.stop()
      ambientSoundRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const tick = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(tick)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return

    if (elapsedSeconds >= totalSeconds) {
      setIsRunning(false)
      ambientSoundRef.current?.stop()
      if (hapticsEnabled) vibrate([30, 40, 30])
      if (confettiEnabled) fireConfettiBurst({ particleCount: 110 }).catch(() => {})
      onComplete(targetMinutes)
      return
    }

    // Determine current phase based on elapsed time
    const cycleSeconds = phases.reduce((sum, p) => sum + p.seconds, 0)
    const inCycle = elapsedSeconds % cycleSeconds
    let acc = 0
    for (const p of phases) {
      acc += p.seconds
      if (inCycle < acc) {
        setPhase((prevPhase) => {
          if (prevPhase !== p.phase) {
            // light haptic cue on transitions
            if (hapticsEnabled) {
              vibrate(p.phase === 'inhale' ? 15 : p.phase === 'exhale' ? 10 : 5)
            }
          }
          return p.phase
        })
        break
      }
    }
  }, [confettiEnabled, elapsedSeconds, hapticsEnabled, isRunning, onComplete, phases, targetMinutes, totalSeconds])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Companion Breathing</h3>
            <p className="text-blue-100 text-sm">Box breathing • {targetMinutes} minutes</p>
          </div>
          <Button
            onClick={() => {
              setIsRunning(false)
              ambientSoundRef.current?.stop()
              onClose()
            }}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Close
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Time Remaining</p>
              <p className="text-3xl font-bold text-slate-900">{formatTime(remainingSeconds)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={targetMinutes === 2 ? 'default' : 'outline'}
                onClick={() => {
                  setTargetMinutes(2)
                  setElapsedSeconds(0)
                  setIsRunning(false)
                  setPhase('rest')
                  ambientSoundRef.current?.stop()
                }}
              >
                2m
              </Button>
              <Button
                type="button"
                variant={targetMinutes === 5 ? 'default' : 'outline'}
                onClick={() => {
                  setTargetMinutes(5)
                  setElapsedSeconds(0)
                  setIsRunning(false)
                  setPhase('rest')
                  ambientSoundRef.current?.stop()
                }}
              >
                5m
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant={sensoryOpen ? 'default' : 'outline'}
              onClick={() => setSensoryOpen((v) => !v)}
            >
              <Music className="w-4 h-4 mr-2" />
              Sensory
            </Button>
            <Button
              type="button"
              variant={hapticsEnabled ? 'default' : 'outline'}
              onClick={onToggleHaptics}
              aria-pressed={hapticsEnabled ? 'true' : 'false'}
            >
              <Vibrate className="w-4 h-4 mr-2" />
              Haptics {hapticsEnabled ? 'On' : 'Off'}
            </Button>
          </div>

          {sensoryOpen && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Soundscape</p>
                  <Select
                    value={ambience}
                    onValueChange={(value) => {
                      const next = value as AmbienceType
                      setAmbience(next)

                      // user gesture (select change) is a good time to restart ambience
                      ambientSoundRef.current?.stop()
                      if (isRunning && next !== 'none') {
                        ambientSoundRef.current?.setVolume(ambienceVolume)
                        ambientSoundRef.current?.play(next)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose ambience" />
                    </SelectTrigger>
                    <SelectContent>
                      {AMBIENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Volume</p>
                    <p className="text-xs text-slate-500">{Math.round(ambienceVolume * 100)}%</p>
                  </div>
                  <Slider
                    value={[ambienceVolume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={(v) => {
                      const next = v[0] ?? 0
                      setAmbienceVolume(next)
                      ambientSoundRef.current?.setVolume(next)
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={confettiEnabled ? 'default' : 'outline'}
                  onClick={onToggleConfetti}
                  aria-pressed={confettiEnabled ? 'true' : 'false'}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Visual rewards {confettiEnabled ? 'On' : 'Off'}
                </Button>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                If audio is blocked, press Start again.
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-6">
            <CompanionInSession
              companion={companion}
              isBreathing
              breathPhase={phase}
              phaseDurationMs={4000}
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  onInteract()
                  setIsRunning(true)

                  if (ambience !== 'none') {
                    ambientSoundRef.current?.setVolume(ambienceVolume)
                    ambientSoundRef.current?.play(ambience)
                  }
                }}
                disabled={isRunning}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                Start
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRunning(false)
                  ambientSoundRef.current?.stop()
                }}
                disabled={!isRunning}
              >
                Pause
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRunning(false)
                  setElapsedSeconds(0)
                  setPhase('rest')
                  ambientSoundRef.current?.stop()
                  if (hapticsEnabled) vibrate(10)
                }}
              >
                Reset
              </Button>
            </div>

            <p className="text-xs text-slate-600 text-center max-w-sm">
              Tip: keep shoulders relaxed. Inhale through nose, exhale slowly.
              If you feel dizzy, stop and breathe normally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function badgeBgClass(color?: string): string {
  const c = String(color || '').toUpperCase();
  switch (c) {
    case '#4CAF50':
      return 'bg-green-100';
    case '#FF5722':
      return 'bg-orange-100';
    case '#9C27B0':
      return 'bg-purple-100';
    case '#FFD700':
      return 'bg-yellow-100';
    case '#E91E63':
      return 'bg-pink-100';
    case '#FF9800':
      return 'bg-amber-100';
    case '#3F51B5':
      return 'bg-blue-100';
    default:
      return 'bg-slate-100';
  }
}

// Plant stages with enhanced visuals
const PLANT_STAGES = {
  seed: { emoji: '🌱', name: 'Seed', water: 0, color: 'text-amber-600' },
  sprout: { emoji: '🌿', name: 'Sprout', water: 1, color: 'text-green-500' },
  bud: { emoji: '🌷', name: 'Bud', water: 2, color: 'text-pink-500' },
  bloom: { emoji: '🌸', name: 'Bloom', water: 3, color: 'text-purple-500' }
}

// Garden level themes with visual styling
const GARDEN_THEMES = {
  'plot': {
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    borderColor: 'border-amber-200',
    accentColor: 'text-amber-600',
    icon: '🌍'
  },
  'small-garden': {
    bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
    borderColor: 'border-green-200',
    accentColor: 'text-green-600',
    icon: '🌿'
  },
  'garden': {
    bgGradient: 'from-emerald-50 via-green-50 to-cyan-50',
    borderColor: 'border-emerald-200',
    accentColor: 'text-emerald-600',
    icon: '🌳'
  },
  'lush-garden': {
    bgGradient: 'from-teal-50 via-emerald-50 to-green-50',
    borderColor: 'border-teal-200',
    accentColor: 'text-teal-600',
    icon: '🌴'
  },
  'paradise': {
    bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
    borderColor: 'border-purple-200',
    accentColor: 'text-purple-600',
    icon: '🏝️'
  }
}

// Enhanced task layers with modern styling
const TASK_LAYERS = {
  structure: {
    name: 'Structure',
    icon: '📋',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    iconBg: 'bg-emerald-100',
    tasks: [
      { id: 'morning-routine', title: 'Morning Routine', description: 'Complete your morning steps', icon: '🌅', xp: 10 },
      { id: 'visual-schedule', title: 'Visual Schedule', description: 'Follow your visual schedule today', icon: '📅', xp: 10 },
      { id: 'transition-timer', title: 'Transition Timer', description: 'Use a timer for activity changes', icon: '⏰', xp: 15 },
      { id: 'task-breakdown', title: 'Task Breakdown', description: 'Break a big task into small steps', icon: '🧩', xp: 20 },
      { id: 'routine-chain', title: 'Routine Chain', description: 'Complete a full routine chain', icon: '🔗', xp: 25 },
      { id: 'weekly-planner', title: 'Weekly Planner', description: 'Plan and follow your whole week', icon: '📘', xp: 30 }
    ]
  },
  communication: {
    name: 'Communication',
    icon: '💬',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconBg: 'bg-blue-100',
    tasks: [
      { id: 'request-help', title: 'Ask for Help', description: 'Use words or symbols to ask for help', icon: '🙋', xp: 10 },
      { id: 'greet-someone', title: 'Greeting Practice', description: 'Say hello to someone new', icon: '👋', xp: 10 },
      { id: 'express-feeling', title: 'Express a Feeling', description: 'Tell someone how you feel', icon: '💗', xp: 15 },
      { id: 'conversation-turn', title: 'Conversation Turns', description: 'Take turns in a conversation', icon: '🔄', xp: 20 },
      { id: 'social-story', title: 'Social Story', description: 'Read and practice a social story', icon: '📖', xp: 25 },
      { id: 'complex-request', title: 'Complex Request', description: 'Make a detailed request with reasons', icon: '💎', xp: 30 }
    ]
  },
  zones: {
    name: 'Zones',
    icon: '🌈',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    hoverBorder: 'hover:border-purple-400',
    iconBg: 'bg-purple-100',
    tasks: [
      { id: 'zone-check', title: 'Zone Check-In', description: 'Identify your current zone', icon: '🎯', xp: 10 },
      { id: 'calm-tool', title: 'Use a Calm Tool', description: 'Use a tool to get to green zone', icon: '🧘', xp: 15 },
      { id: 'energy-boost', title: 'Energy Boost', description: 'Use a tool to increase energy', icon: '⚡', xp: 15 },
      { id: 'zone-tracking', title: 'Zone Tracking', description: 'Track your zones for a whole day', icon: '📊', xp: 20 },
      { id: 'zone-prevention', title: 'Zone Prevention', description: 'Notice warning signs before leaving green', icon: '🚦', xp: 25 },
      { id: 'zone-mastery', title: 'Zone Mastery', description: 'Stay in green zone during a challenge', icon: '🏆', xp: 30 }
    ]
  },
  selfMgmt: {
    name: 'Self-Management',
    icon: '🧭',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    iconBg: 'bg-amber-100',
    tasks: [
      { id: 'set-goal', title: 'Set a Small Goal', description: 'Set and complete a small goal', icon: '🎯', xp: 10 },
      { id: 'problem-solve', title: 'Problem Solving', description: 'Use steps to solve a problem', icon: '🔧', xp: 15 },
      { id: 'take-break', title: 'Planned Break', description: 'Take a break when you need it', icon: '☕', xp: 10 },
      { id: 'stress-log', title: 'Stress Log', description: 'Notice and record stress triggers', icon: '📝', xp: 20 },
      { id: 'coping-plan', title: 'Coping Plan', description: 'Create and use a coping plan', icon: '🗺️', xp: 25 },
      { id: 'independent-day', title: 'Independent Day', description: 'Manage your whole day independently', icon: '🌟', xp: 30 }
    ]
  },
  mindfulness: {
    name: 'Mindfulness & Calm',
    icon: '🦋',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    hoverBorder: 'hover:border-pink-400',
    iconBg: 'bg-pink-100',
    tasks: [
      { id: 'brave-step', title: 'Brave Step', description: 'Take one small brave step', icon: '👣', xp: 10 },
      { id: 'worry-time', title: 'Worry Time', description: 'Use scheduled worry time', icon: '⏳', xp: 15 },
      { id: 'calm-breathing', title: 'Calm Breathing', description: 'Practice calming breaths', icon: '🌬️', xp: 15 },
      { id: 'mindful-moment', title: 'Mindful Moment', description: 'Take 5 minutes for mindfulness', icon: '🧘', xp: 20 },
      { id: 'gratitude-practice', title: 'Gratitude Practice', description: 'Note 3 things you are grateful for', icon: '🙏', xp: 20 },
      { id: 'body-scan', title: 'Body Scan', description: 'Complete a body scan meditation', icon: '✨', xp: 25 }
    ]
  }
}

// Tab type for navigation
type ActiveTab = 'garden' | 'quests' | 'badges'

export default function FocusGardenPage() {
  const [progress, setProgress] = useState<FocusGardenProgress | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<string>('structure')
  const [activeTab, setActiveTab] = useState<ActiveTab>('garden')
  const [showTutorial, setShowTutorial] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationText, setCelebrationText] = useState('')
  const [celebrationIcon, setCelebrationIcon] = useState('')
  const [showStreakFreezeModal, setShowStreakFreezeModal] = useState(false)
  const [showQuestModal, setShowQuestModal] = useState<MultiDayQuest | null>(null)
  const [showCompanionModal, setShowCompanionModal] = useState(false)
  const [showBreathingModal, setShowBreathingModal] = useState(false)
  const [sensory, setSensory] = useState<SensorySettings>({
    hapticsEnabled: true,
    confettiEnabled: true
  })
  const [companionContext, setCompanionContext] = useState<
    'greeting' | 'session-start' | 'session-end' | 'harvest' | 'streak' | 'idle' | 'comeback' | 'breathing' | 'level-up' | 'quest-complete'
  >('greeting')

  // Load progress on mount
  useEffect(() => {
    migrateOldProgress()
    setSensory(loadSensorySettings())
    const loaded = loadFocusGardenProgress()
    setProgress(loaded)

    if (loaded.totalSessions === 0) {
      setShowTutorial(true)
    }
  }, [])

  useEffect(() => {
    saveSensorySettings(sensory)
  }, [sensory])

  const refreshProgress = useCallback(() => {
    const latest = loadFocusGardenProgress()

    // Sync companion accessory unlocks (kept in-progress-only storage for now)
    const unlockable = getUnlockableAccessories(
      latest.gardenLevel,
      latest.totalHarvests,
      latest.streak.currentStreak,
      latest.earnedBadges,
      latest.completedQuests.length
    )

    const merged = Array.from(new Set([...(latest.companion.unlockedAccessories ?? []), ...unlockable]))
    if (merged.length !== (latest.companion.unlockedAccessories ?? []).length) {
      latest.companion.unlockedAccessories = merged
      saveFocusGardenProgress(latest)
    }

    setProgress(latest)
  }, [])

  const celebrate = useCallback((text: string, icon: string = '🎉') => {
    setCelebrationText(text)
    setCelebrationIcon(icon)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }, [])

  const applySensoryRewards = useCallback(
    async (before: FocusGardenProgress | null, after: FocusGardenProgress, hint?: 'minor' | 'major') => {
      if (!before) {
        if (sensory.hapticsEnabled && hint) hapticPulse(hint)
        return
      }

      const beforeLevel = calculateGardenLevel(before.totalXP).level
      const afterLevel = calculateGardenLevel(after.totalXP).level
      const leveledUp = afterLevel > beforeLevel

      const badgesUnlocked = (after.earnedBadges?.length ?? 0) > (before.earnedBadges?.length ?? 0)
      const questCompleted = (after.completedQuests?.length ?? 0) > (before.completedQuests?.length ?? 0)
      const harvested = (after.totalHarvests ?? 0) > (before.totalHarvests ?? 0)

      if (sensory.hapticsEnabled) {
        if (badgesUnlocked) hapticPulse('unlock')
        else if (questCompleted || harvested || leveledUp) hapticPulse('major')
        else if (hint) hapticPulse(hint)
      }

      if (sensory.confettiEnabled) {
        if (badgesUnlocked) {
          await fireConfettiBurst({ particleCount: 70, spread: 90, startVelocity: 22 }).catch(() => {})
        } else if (questCompleted || harvested || leveledUp) {
          await fireConfettiBurst({ particleCount: 110 }).catch(() => {})
        }
      }
    },
    [sensory.confettiEnabled, sensory.hapticsEnabled]
  )

  const companionUserProgress = useMemo(() => {
    if (!progress) {
      return {
        gardenLevel: 1,
        totalHarvests: 0,
        currentStreak: 0,
        earnedBadges: [],
        completedQuests: 0
      }
    }
    return {
      gardenLevel: progress.gardenLevel,
      totalHarvests: progress.totalHarvests,
      currentStreak: progress.streak.currentStreak,
      earnedBadges: progress.earnedBadges,
      completedQuests: progress.completedQuests.length
    }
  }, [progress])

  const handlePlantTask = useCallback((taskId: string, layer: string) => {
    const before = progress
    storePlantTask(taskId, layer)
    const after = loadFocusGardenProgress()
    refreshProgress()
    celebrate('🌱 Task planted! Water it to help it grow.', '🌱')
    setCompanionContext('session-start')
    updateCompanionMood('encouraging')
    void applySensoryRewards(before, after, 'minor')
  }, [applySensoryRewards, celebrate, progress, refreshProgress])

  const handleWaterPlant = useCallback((plantId: string) => {
    const before = progress
    const result = storeWaterPlant(plantId)
    const after = loadFocusGardenProgress()
    refreshProgress()

    if (result.bloomed) {
      celebrate('🌸 Plant bloomed! Ready to harvest!', '🌸')
      setCompanionContext('harvest')
      updateCompanionMood('excited')
      void applySensoryRewards(before, after, 'major')
    } else if (result.xpEarned > 0) {
      celebrate(`💧 Plant watered! +${result.xpEarned} XP`, '💧')
      setCompanionContext('session-end')
      updateCompanionMood('proud')
      void applySensoryRewards(before, after, 'minor')
    }
  }, [applySensoryRewards, celebrate, progress, refreshProgress])

  const handleHarvestPlant = useCallback((plantId: string) => {
    const before = progress
    const result = storeHarvestPlant(plantId)
    if (result.success) {
      const after = loadFocusGardenProgress()
      refreshProgress()
      celebrate(`🎉 Harvest complete! +${result.xpEarned} XP earned!`, '🌺')
      setCompanionContext('harvest')
      updateCompanionMood('excited')
      void applySensoryRewards(before, after, 'major')
    }
  }, [applySensoryRewards, celebrate, progress, refreshProgress])

  const handleBreathingComplete = useCallback((minutes: number) => {
    // Log breathing session for XP/stats/badges
    const before = progress
    logSession(minutes, 'breathing')
    const after = loadFocusGardenProgress()
    refreshProgress()
    celebrate(`🌬️ Breathing complete! +XP earned`, '🌬️')
    setCompanionContext('session-end')
    updateCompanionMood('proud')
    setShowBreathingModal(false)
    void applySensoryRewards(before, after, 'minor')
  }, [applySensoryRewards, celebrate, progress, refreshProgress])

  const handleStartQuest = useCallback((questId: string) => {
    const before = progress
    const success = startQuest(questId)
    if (success) {
      const after = loadFocusGardenProgress()
      refreshProgress()
      setShowQuestModal(null)
      celebrate('📜 Quest started! Check the Quests tab for your progress.', '📜')
      setCompanionContext('session-start')
      updateCompanionMood('happy')
      void applySensoryRewards(before, after, 'minor')
    }
  }, [applySensoryRewards, celebrate, progress, refreshProgress])

  const handleCompleteQuestDay = useCallback((questId: string, day: number) => {
    const before = progress
    const result = completeQuestDay(questId, day)
    if (result.success) {
      const after = loadFocusGardenProgress()
      refreshProgress()
      if (result.questCompleted) {
        celebrate(`🏆 Quest Complete! +${result.xpEarned} XP earned!`, '🏆')
        setCompanionContext('quest-complete')
        updateCompanionMood('excited')
        void applySensoryRewards(before, after, 'major')
      } else {
        celebrate(`✅ Day ${day} complete! +${result.xpEarned} XP`, '✅')
        setCompanionContext('session-end')
        updateCompanionMood('proud')
        void applySensoryRewards(before, after, 'minor')
      }
    }
  }, [applySensoryRewards, celebrate, progress, refreshProgress])

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Sprout className="w-12 h-12 mx-auto mb-4 text-green-500 animate-pulse" />
          <p className="text-slate-600">Loading your garden...</p>
        </div>
      </div>
    )
  }

  const currentGardenLevel = calculateGardenLevel(progress.totalXP)
  const levelProgress = getGardenLevelProgress(progress.totalXP)
  const gardenTheme = GARDEN_THEMES[currentGardenLevel.gardenTheme] || GARDEN_THEMES['plot']
  const currentLayer = TASK_LAYERS[selectedLayer as keyof typeof TASK_LAYERS]

  const isTaskPlanted = (taskId: string) => {
    return progress.garden.some(p => p.taskId === taskId)
  }

  const getTaskInfo = (taskId: string, layerKey: string) => {
    const layer = TASK_LAYERS[layerKey as keyof typeof TASK_LAYERS]
    return layer?.tasks.find(t => t.id === taskId)
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", gardenTheme.bgGradient)}>
      {/* Celebration Toast */}
      {showCelebration && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-green-200 flex items-center gap-3">
            <span className="text-3xl">{celebrationIcon}</span>
            <p className="font-semibold text-slate-900">{celebrationText}</p>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl">
                🌱
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Welcome to Focus Garden!</h2>
                <p className="text-slate-600">Your journey to mindful growth starts here</p>
              </div>
            </div>

            <div className="space-y-6 text-slate-700">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-lg mb-3 text-slate-900">How It Works</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">1.</span>
                    <span><strong>Choose a task</strong> from five categories and plant it in your garden</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">2.</span>
                    <span><strong>Water daily</strong> by completing tasks - watch plants grow through 4 stages!</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">3.</span>
                    <span><strong>Harvest blooms</strong> 🌸 to earn XP and level up your garden!</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">4.</span>
                    <span><strong>Complete quests</strong> for bonus rewards and unlock badges!</span>
                  </li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <strong className="text-orange-700">Streaks</strong>
                  </div>
                  <p className="text-sm">Practice daily to build streaks. Miss a day? Use a Streak Freeze to protect your progress!</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    <strong className="text-purple-700">Garden Levels</strong>
                  </div>
                  <p className="text-sm">Earn XP to level up your garden from a bare plot to a paradise!</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowTutorial(false)}
              className="mt-8 w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Let&apos;s Grow!
            </Button>
          </div>
        </div>
      )}

      {/* Streak Freeze Modal */}
      {showStreakFreezeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Snowflake className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Streak Freezes</h3>
              <p className="text-slate-600 mt-2">Protect your streak when life gets busy</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700">Available Freezes</span>
                  <span className="text-2xl font-bold text-blue-600">{progress.streak.streakFreezes}/{progress.streak.maxStreakFreezes}</span>
                </div>
                <div className="flex gap-2">
                  {[...Array(progress.streak.maxStreakFreezes)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        i < progress.streak.streakFreezes
                          ? "bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md"
                          : "bg-slate-200 text-slate-400"
                      )}
                    >
                      <Snowflake className="w-5 h-5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-slate-600 space-y-2">
                <p>• Streak Freezes automatically protect your streak if you miss one day</p>
                <p>• Earn more freezes by completing quests and hitting milestones</p>
                <p>• Maximum of {progress.streak.maxStreakFreezes} freezes can be stored</p>
              </div>
            </div>

            <Button
              onClick={() => setShowStreakFreezeModal(false)}
              className="w-full"
              variant="outline"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}

      {/* Quest Details Modal */}
      {showQuestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
                📜
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{showQuestModal.title}</h3>
                <p className="text-sm text-slate-600">{showQuestModal.days.length}-Day Quest</p>
              </div>
            </div>

            <p className="text-slate-700 mb-4 italic">&quot;{showQuestModal.narrative}&quot;</p>
            <p className="text-slate-600 mb-6">{showQuestModal.description}</p>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-slate-900">Quest Days:</h4>
              {showQuestModal.days.map((day, index) => (
                <div
                  key={day.day}
                  className={cn(
                    "p-3 rounded-xl border transition-all",
                    index === 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">Day {day.day}: {day.title}</span>
                      <p className="text-sm text-slate-600">{day.task}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      +{day.xpReward} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Completion Rewards</span>
              </div>
              <p className="text-sm text-green-700">+{showQuestModal.xpReward} XP bonus</p>
              {showQuestModal.badgeReward && (
                <p className="text-sm text-green-700">
                  + Unlock &quot;{getBadgeInfo(showQuestModal.badgeReward)?.name}&quot; badge
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowQuestModal(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleStartQuest(showQuestModal.id)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600"
              >
                Start Quest
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Companion Customization Modal */}
      {showCompanionModal && progress && (
        <CompanionCustomizationModal
          companion={progress.companion}
          userProgress={companionUserProgress}
          onClose={() => setShowCompanionModal(false)}
          onChangeType={(type) => {
            changeCompanionType(type)
            refreshProgress()
            celebrate('✨ Companion changed!', '✨')
          }}
          onChangeName={(name) => {
            setCompanionName(name)
            refreshProgress()
            celebrate('📝 Name updated!', '📝')
          }}
          onEquipAccessory={(accessoryId) => {
            // ensure unlock list is synced before equipping
            refreshProgress()
            equipAccessory(accessoryId)
            refreshProgress()
            celebrate('🎀 Accessory equipped!', '🎀')
          }}
          onUnequipAccessory={() => {
            unequipAccessory()
            refreshProgress()
            celebrate('✅ Accessory removed!', '✅')
          }}
        />
      )}

      {showBreathingModal && progress && (
        <BreathingSessionModal
          companion={progress.companion}
          onClose={() => {
            setShowBreathingModal(false)
            setCompanionContext('greeting')
            updateCompanionMood('neutral')
          }}
          onInteract={() => {
            interactWithCompanion()
            refreshProgress()
          }}
          onComplete={handleBreathingComplete}
          hapticsEnabled={sensory.hapticsEnabled}
          confettiEnabled={sensory.confettiEnabled}
          onToggleHaptics={() =>
            setSensory((prev) => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }))
          }
          onToggleConfetti={() =>
            setSensory((prev) => ({ ...prev, confettiEnabled: !prev.confettiEnabled }))
          }
        />
      )}

      <div className="w-[96%] max-w-[2000px] mx-auto py-8 px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 hover:bg-white/80">
          <Link href="/breathing/breath" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Breathing Guides</span>
          </Link>
        </Button>

        {/* Hero Header with Garden Level */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                    {gardenTheme.icon}
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-1">Focus Garden</h1>
                    <p className="text-green-100 text-lg">Level {currentGardenLevel.level}: {currentGardenLevel.name}</p>
                  </div>
                </div>
                <p className="text-lg text-green-50 leading-relaxed max-w-3xl">
                  {currentGardenLevel.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <Companion
                    companion={progress.companion}
                    context={companionContext}
                    onInteract={() => {
                      interactWithCompanion()
                      refreshProgress()
                    }}
                    onCustomize={() => setShowCompanionModal(true)}
                  />
                </div>
                <div className="md:hidden">
                  <CompactCompanion
                    companion={progress.companion}
                    onClick={() => setShowCompanionModal(true)}
                  />
                </div>
                <Button
                  onClick={() => setShowTutorial(true)}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Info className="w-4 h-4 mr-2" />
                  How it Works
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {/* Garden Level */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-600">Garden Level</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{currentGardenLevel.level}</p>
              </div>

              {/* Total XP */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-slate-600">Total XP</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{progress.totalXP}</p>
              </div>

              {/* Streak */}
              <div
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 cursor-pointer hover:border-orange-300 transition-colors"
                onClick={() => setShowStreakFreezeModal(true)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-slate-600">Streak</span>
                  <Snowflake className="w-4 h-4 text-blue-400 ml-auto" />
                  <span className="text-xs text-blue-500">{progress.streak.streakFreezes}</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{progress.streak.currentStreak}</p>
              </div>

              {/* Plants */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-600">Growing</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{progress.garden.length}</p>
              </div>

              {/* Harvests */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-600">Harvests</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{progress.totalHarvests}</p>
              </div>
            </div>

            {/* Garden Level Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Progress to {GARDEN_LEVELS[currentGardenLevel.level]?.name || 'Max Level'}
                </span>
                <span className="text-sm font-medium text-slate-600">
                  {levelProgress.current} / {levelProgress.required} XP
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={levelProgress.percentage}
                  className="h-4 bg-slate-200 shadow-inner [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:via-emerald-500 [&>div]:to-teal-500"
                />
                <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={() => {
                  setShowBreathingModal(true)
                  setCompanionContext('breathing')
                  updateCompanionMood('neutral')
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                🌬️ Start Breathing
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCompanionModal(true)}
              >
                ⚙️ Customize Companion
              </Button>
              <Button
                type="button"
                variant={sensory.hapticsEnabled ? 'default' : 'outline'}
                onClick={() =>
                  setSensory((prev) => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }))
                }
                aria-pressed={sensory.hapticsEnabled ? 'true' : 'false'}
              >
                <Vibrate className="w-4 h-4 mr-2" />
                Haptics
              </Button>
              <Button
                type="button"
                variant={sensory.confettiEnabled ? 'default' : 'outline'}
                onClick={() =>
                  setSensory((prev) => ({ ...prev, confettiEnabled: !prev.confettiEnabled }))
                }
                aria-pressed={sensory.confettiEnabled ? 'true' : 'false'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Rewards
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'garden', label: 'Garden', icon: Sprout },
            { id: 'quests', label: 'Quests', icon: ScrollText },
            { id: 'badges', label: 'Badges', icon: Award }
          ].map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={cn(
                "flex-1 md:flex-none px-6",
                activeTab === tab.id && "bg-gradient-to-r from-green-500 to-emerald-600"
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Garden Tab Content */}
        {activeTab === 'garden' && (
          <div className="space-y-8">
            {/* Task Categories */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border-2 border-slate-200 p-7 overflow-hidden">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                    📚
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Task Categories</h2>
                    <p className="text-xs text-slate-600">Choose your focus area</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {Object.entries(TASK_LAYERS).map(([key, layer]) => {
                  const isSelected = selectedLayer === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedLayer(key)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden",
                        isSelected
                          ? `bg-gradient-to-r ${layer.bgGradient} ${layer.borderColor} shadow-lg scale-[1.03] ring-2 ring-offset-2 ${layer.borderColor.replace('border', 'ring')}`
                          : `bg-white border-slate-200 hover:bg-gradient-to-r ${layer.bgGradient} hover:border-slate-300 hover:shadow-md hover:scale-[1.01]`
                      )}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 shadow-md",
                          isSelected
                            ? `${layer.iconBg} transform scale-110 rotate-3`
                            : 'bg-slate-100 group-hover:scale-110 group-hover:-rotate-3'
                        )}>
                          {layer.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn(
                              "font-bold text-sm transition-colors",
                              isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                            )}>
                              {layer.name}
                            </span>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" />
                            )}
                          </div>
                          <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full transition-colors",
                            isSelected
                              ? "bg-white/80 text-slate-700"
                              : "bg-slate-200 text-slate-600 group-hover:bg-white/60"
                          )}>
                            {layer.tasks.length} tasks
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Available Tasks */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl",
                  currentLayer.iconBg
                )}>
                  {currentLayer.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{currentLayer.name} Tasks</h2>
                  <p className="text-slate-600">Choose tasks to plant and nurture in your garden</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {currentLayer.tasks.map(task => {
                  const isPlanted = isTaskPlanted(task.id)
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "group p-6 rounded-2xl border-2 transition-all duration-200",
                        isPlanted
                          ? 'bg-slate-50 border-slate-300'
                          : `bg-gradient-to-br ${currentLayer.bgGradient} ${currentLayer.borderColor} ${currentLayer.hoverBorder} hover:shadow-lg hover:scale-[1.02]`
                      )}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110",
                          isPlanted ? 'bg-slate-200' : 'bg-white/80 shadow-sm'
                        )}>
                          {task.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-1">{task.title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-600 bg-white/60 px-2 py-1 rounded-full">
                          +{task.xp} XP per water
                        </span>
                      </div>

                      <Button
                        onClick={() => handlePlantTask(task.id, selectedLayer)}
                        disabled={isPlanted}
                        size="lg"
                        className={cn(
                          "w-full",
                          isPlanted
                            ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                            : `bg-gradient-to-r ${currentLayer.gradient} text-white hover:shadow-lg`
                        )}
                      >
                        {isPlanted ? (
                          <>
                            <Check className="w-4 h-4 mr-2" /> Already Planted
                          </>
                        ) : (
                          <>
                            <Sprout className="w-4 h-4 mr-2" /> Plant Task
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Garden Section */}
            <div className={cn("rounded-3xl shadow-xl border p-8", gardenTheme.borderColor, `bg-gradient-to-br ${gardenTheme.bgGradient}`)}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-lg flex items-center justify-center text-3xl">
                    {gardenTheme.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Your {currentGardenLevel.name}</h2>
                    <p className="text-slate-600">Water your plants daily to help them bloom</p>
                  </div>
                </div>
                {progress.garden.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Growing</p>
                    <p className="text-2xl font-bold text-slate-900">{progress.garden.length} plant{progress.garden.length !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>

              {progress.garden.length === 0 ? (
                <div className="text-center py-16 bg-white/60 rounded-2xl border-2 border-dashed border-slate-300">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <Sprout className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-2">Your garden awaits</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Plant your first task from the categories above to begin your growth journey!
                  </p>
                  <Button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    Choose a Task
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {progress.garden.map(plant => {
                    const task = getTaskInfo(plant.taskId, plant.layer)
                    const stageInfo = PLANT_STAGES[plant.stage]
                    const canWater = plant.stage !== 'bloom'
                    const canHarvest = plant.stage === 'bloom'
                    const layerInfo = TASK_LAYERS[plant.layer as keyof typeof TASK_LAYERS]

                    return (
                      <div
                        key={plant.id}
                        className={cn(
                          "group p-6 rounded-2xl border-2 bg-white/80 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]",
                          layerInfo?.borderColor || 'border-slate-200'
                        )}
                      >
                        <div className="text-center mb-4">
                          <div className={cn(
                            "text-7xl mb-3 transition-transform group-hover:scale-110",
                            stageInfo.color
                          )}>
                            {stageInfo.emoji}
                          </div>
                          <div className="inline-block px-3 py-1 bg-white rounded-full mb-2 shadow-sm">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              {stageInfo.name}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-900 text-center mb-1 text-sm">
                          {task?.title || 'Unknown Task'}
                        </h4>
                        <p className="text-xs text-slate-600 text-center mb-4">
                          {layerInfo?.name || 'Unknown'}
                        </p>

                        <div className="space-y-2">
                          {canWater && (
                            <Button
                              onClick={() => handleWaterPlant(plant.id)}
                              size="sm"
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              💧 Water ({plant.waterCount}/3)
                            </Button>
                          )}
                          {canHarvest && (
                            <Button
                              onClick={() => handleHarvestPlant(plant.id)}
                              size="sm"
                              className={cn(
                                "w-full text-white",
                                layerInfo ? `bg-gradient-to-r ${layerInfo.gradient} hover:shadow-lg` : 'bg-purple-500'
                              )}
                            >
                              <Sparkles className="w-4 h-4 mr-1" />
                              Harvest +50 XP
                            </Button>
                          )}
                        </div>

                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                          {[0, 1, 2, 3].map(i => (
                            <div
                              key={i}
                              className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                i < plant.waterCount + 1
                                  ? 'bg-blue-500 scale-125'
                                  : 'bg-slate-300'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quests Tab Content */}
        {activeTab === 'quests' && (
          <div className="space-y-8">
            {/* Active Quests */}
            {getActiveQuests().length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
                    📜
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Active Quests</h2>
                    <p className="text-slate-600">Your current adventures</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {getActiveQuests().map(quest => (
                    <div
                      key={quest.id}
                      className="p-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-900">{quest.title}</h3>
                        <span className="text-sm font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                          Day {quest.currentDay}/{quest.days.length}
                        </span>
                      </div>

                      <Progress
                        value={(quest.days.filter(d => d.completed).length / quest.days.length) * 100}
                        className="h-3 mb-4"
                      />

                      <div className="space-y-2 mb-4">
                        {quest.days.map(day => (
                          <div
                            key={day.day}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl transition-all",
                              day.completed
                                ? "bg-green-100 border border-green-200"
                                : day.day === quest.currentDay
                                ? "bg-white border-2 border-amber-300"
                                : "bg-slate-100 border border-slate-200 opacity-60"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                              day.completed
                                ? "bg-green-500 text-white"
                                : day.day === quest.currentDay
                                ? "bg-amber-500 text-white"
                                : "bg-slate-300 text-slate-600"
                            )}>
                              {day.completed ? <Check className="w-4 h-4" /> : day.day}
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-sm text-slate-900">{day.title}</span>
                              <p className="text-xs text-slate-600">{day.task}</p>
                            </div>
                            {day.day === quest.currentDay && !day.completed && (
                              <Button
                                size="sm"
                                onClick={() => handleCompleteQuestDay(quest.id, day.day)}
                                className="bg-amber-500 hover:bg-amber-600"
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-amber-700">
                        <Gift className="w-4 h-4" />
                        <span>+{quest.xpReward} XP on completion</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Quests */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-3xl">
                  🗺️
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Available Quests</h2>
                  <p className="text-slate-600">Start a new adventure to earn bonus rewards</p>
                </div>
              </div>

              {getAvailableQuests().length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">All Quests Completed!</h3>
                  <p className="text-slate-600">Check back later for new adventures</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {getAvailableQuests().map(quest => (
                    <div
                      key={quest.id}
                      className="p-6 rounded-2xl border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => setShowQuestModal(quest)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            📜
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{quest.title}</h3>
                            <p className="text-sm text-slate-600">{quest.days.length}-Day Quest</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{quest.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-purple-600 font-semibold">+{quest.xpReward} XP</span>
                        {quest.badgeReward && (
                          <span className="text-amber-600">+ Badge</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Quests */}
            {progress.completedQuests.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl">
                    ✅
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Completed Quests</h2>
                    <p className="text-slate-600">{progress.completedQuests.length} quest{progress.completedQuests.length !== 1 ? 's' : ''} finished</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {progress.completedQuests.map(questId => {
                    const quest = MULTI_DAY_QUESTS.find(q => q.id === questId)
                    if (!quest) return null
                    return (
                      <div
                        key={questId}
                        className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{quest.title}</h4>
                          <p className="text-xs text-green-600">+{quest.xpReward} XP earned</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges Tab Content */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            {/* Earned Badges */}
            {progress.earnedBadges.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl">
                    🏆
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Your Badges</h2>
                    <p className="text-slate-600">{progress.earnedBadges.length} badge{progress.earnedBadges.length !== 1 ? 's' : ''} earned</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {progress.earnedBadges.map(badgeId => {
                    const badge = getBadgeInfo(badgeId)
                    if (!badge) return null
                    return (
                      <div
                        key={badgeId}
                        className="group p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 text-center hover:shadow-lg hover:scale-105 transition-all"
                      >
                        <div
                          className={cn(
                            'w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl shadow-lg',
                            badgeBgClass(badge.color)
                          )}
                        >
                          {badge.icon}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">{badge.name}</h4>
                        <p className="text-xs text-slate-600">{badge.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All Badges */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-3xl">
                  🎖️
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">All Badges</h2>
                  <p className="text-slate-600">{progress.earnedBadges.length}/{FOCUS_GARDEN_BADGES.length} unlocked</p>
                </div>
              </div>

              {/* Badge categories */}
              {(['streak', 'time', 'growth', 'resilience', 'mastery', 'special'] as const).map(category => {
                const categoryBadges = FOCUS_GARDEN_BADGES.filter(b => b.category === category)
                const categoryNames = {
                  streak: { name: 'Streak Badges', icon: <Flame className="w-5 h-5 text-orange-500" /> },
                  time: { name: 'Time of Day', icon: <Clock className="w-5 h-5 text-blue-500" /> },
                  growth: { name: 'Garden Growth', icon: <Sprout className="w-5 h-5 text-green-500" /> },
                  resilience: { name: 'Resilience', icon: <Shield className="w-5 h-5 text-purple-500" /> },
                  mastery: { name: 'Mastery', icon: <Star className="w-5 h-5 text-amber-500" /> },
                  special: { name: 'Special', icon: <Trophy className="w-5 h-5 text-pink-500" /> }
                }

                return (
                  <div key={category} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-2 mb-4">
                      {categoryNames[category].icon}
                      <h3 className="font-bold text-lg text-slate-900">{categoryNames[category].name}</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {categoryBadges.map(badge => {
                        const isEarned = progress.earnedBadges.includes(badge.id)
                        return (
                          <div
                            key={badge.id}
                            className={cn(
                              "group p-4 rounded-2xl border-2 text-center transition-all",
                              isEarned
                                ? "bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:shadow-lg hover:scale-105"
                                : "bg-slate-100 border-slate-200 opacity-60"
                            )}
                          >
                            <div
                              className={cn(
                                "w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl",
                                isEarned ? "shadow-lg" : "grayscale"
                              )}
                            >
                              <div
                                className={cn(
                                  'w-full h-full rounded-full flex items-center justify-center',
                                  isEarned ? badgeBgClass(badge.color) : 'bg-slate-200'
                                )}
                              >
                                {isEarned ? badge.icon : <Lock className="w-6 h-6 text-slate-400" />}
                              </div>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mb-1">{badge.name}</h4>
                            <p className="text-xs text-slate-600">{badge.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Related Tools */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-xl">
              🔗
            </div>
            Explore More Tools
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/breathing/breath"
              className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🫁</span>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-700">Breathing Guides</h4>
              </div>
              <p className="text-sm text-slate-600">Learn breathing techniques for calm and focus</p>
            </Link>

            <Link
              href="/tools/adhd-tools"
              className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎯</span>
                <h4 className="font-bold text-slate-900 group-hover:text-green-700">ADHD Tools</h4>
              </div>
              <p className="text-sm text-slate-600">Focus support tools for ADHD minds</p>
            </Link>

            <Link
              href="/tools/autism-tools"
              className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🧩</span>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">Autism Tools</h4>
              </div>
              <p className="text-sm text-slate-600">Sensory-friendly regulation resources</p>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
