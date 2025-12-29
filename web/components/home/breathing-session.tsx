'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BreathingSessionProps {
  technique: 'box' | '478' | 'coherent' | 'sos'
  challengeKey?: string | null
  onClose: () => void
}

type AmbienceType = 'none' | 'cosmic' | 'rain' | 'birds' | 'ocean' | 'forest' | 'tibetan' | 'meditation' | 'spiritual'

// Ambient sound generator using Web Audio API
class AmbientSoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private noiseNode: AudioBufferSourceNode | null = null
  private isPlaying = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
    }
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0)
    }
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    const bufferSize = this.audioContext!.sampleRate * 2
    const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate)
    const output = buffer.getChannelData(0)
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      
      if (type === 'white') {
        output[i] = white * 0.5
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      } else {
        output[i] = (b0 = (b0 + (0.02 * white)) / 1.02) * 3.5
      }
    }
    return buffer
  }

  private createOscillator(freq: number, type: OscillatorType, gain: number): OscillatorNode {
    const osc = this.audioContext!.createOscillator()
    const oscGain = this.audioContext!.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime)
    oscGain.gain.setValueAtTime(gain, this.audioContext!.currentTime)
    osc.connect(oscGain)
    oscGain.connect(this.masterGain!)
    return osc
  }

  play(type: AmbienceType) {
    if (!this.audioContext || type === 'none') return
    
    this.stop()
    this.isPlaying = true

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    switch (type) {
      case 'cosmic':
        // Deep space ambient drone
        this.oscillators.push(this.createOscillator(60, 'sine', 0.15))
        this.oscillators.push(this.createOscillator(90, 'sine', 0.1))
        this.oscillators.push(this.createOscillator(120, 'triangle', 0.08))
        this.oscillators.push(this.createOscillator(180, 'sine', 0.05))
        break
        
      case 'rain':
        // Rain-like white noise with filtering
        const rainBuffer = this.createNoiseBuffer('pink')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = rainBuffer
        this.noiseNode.loop = true
        const rainFilter = this.audioContext.createBiquadFilter()
        rainFilter.type = 'lowpass'
        rainFilter.frequency.setValueAtTime(3000, this.audioContext.currentTime)
        const rainGain = this.audioContext.createGain()
        rainGain.gain.setValueAtTime(0.4, this.audioContext.currentTime)
        this.noiseNode.connect(rainFilter)
        rainFilter.connect(rainGain)
        rainGain.connect(this.masterGain!)
        this.noiseNode.start()
        break
        
      case 'ocean':
        // Ocean waves with brown noise
        const oceanBuffer = this.createNoiseBuffer('brown')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = oceanBuffer
        this.noiseNode.loop = true
        const oceanFilter = this.audioContext.createBiquadFilter()
        oceanFilter.type = 'lowpass'
        oceanFilter.frequency.setValueAtTime(800, this.audioContext.currentTime)
        const oceanGain = this.audioContext.createGain()
        oceanGain.gain.setValueAtTime(0.5, this.audioContext.currentTime)
        this.noiseNode.connect(oceanFilter)
        oceanFilter.connect(oceanGain)
        oceanGain.connect(this.masterGain!)
        this.noiseNode.start()
        // Add subtle wave oscillation
        this.oscillators.push(this.createOscillator(0.1, 'sine', 0.02))
        break
        
      case 'birds':
        // Nature sounds with high frequency chirps
        this.oscillators.push(this.createOscillator(2000, 'sine', 0.02))
        this.oscillators.push(this.createOscillator(2500, 'sine', 0.015))
        this.oscillators.push(this.createOscillator(3000, 'triangle', 0.01))
        // Background rustling
        const birdBuffer = this.createNoiseBuffer('pink')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = birdBuffer
        this.noiseNode.loop = true
        const birdFilter = this.audioContext.createBiquadFilter()
        birdFilter.type = 'highpass'
        birdFilter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
        const birdGain = this.audioContext.createGain()
        birdGain.gain.setValueAtTime(0.1, this.audioContext.currentTime)
        this.noiseNode.connect(birdFilter)
        birdFilter.connect(birdGain)
        birdGain.connect(this.masterGain!)
        this.noiseNode.start()
        break
        
      case 'forest':
        // Forest stream with gentle water sounds
        const forestBuffer = this.createNoiseBuffer('pink')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = forestBuffer
        this.noiseNode.loop = true
        const forestFilter = this.audioContext.createBiquadFilter()
        forestFilter.type = 'bandpass'
        forestFilter.frequency.setValueAtTime(1500, this.audioContext.currentTime)
        forestFilter.Q.setValueAtTime(0.5, this.audioContext.currentTime)
        const forestGain = this.audioContext.createGain()
        forestGain.gain.setValueAtTime(0.25, this.audioContext.currentTime)
        this.noiseNode.connect(forestFilter)
        forestFilter.connect(forestGain)
        forestGain.connect(this.masterGain!)
        this.noiseNode.start()
        break
        
      case 'tibetan':
        // Tibetan singing bowls - harmonic tones
        this.oscillators.push(this.createOscillator(174, 'sine', 0.12))
        this.oscillators.push(this.createOscillator(285, 'sine', 0.1))
        this.oscillators.push(this.createOscillator(396, 'sine', 0.08))
        this.oscillators.push(this.createOscillator(528, 'sine', 0.06))
        this.oscillators.push(this.createOscillator(639, 'triangle', 0.04))
        break
        
      case 'meditation':
        // Deep meditation drone with binaural-like tones
        this.oscillators.push(this.createOscillator(100, 'sine', 0.15))
        this.oscillators.push(this.createOscillator(104, 'sine', 0.15)) // 4Hz difference for theta
        this.oscillators.push(this.createOscillator(200, 'sine', 0.08))
        this.oscillators.push(this.createOscillator(300, 'triangle', 0.05))
        break
        
      case 'spiritual':
        // Ethereal spiritual sounds with harmonics
        this.oscillators.push(this.createOscillator(256, 'sine', 0.1))
        this.oscillators.push(this.createOscillator(384, 'sine', 0.08))
        this.oscillators.push(this.createOscillator(512, 'sine', 0.06))
        this.oscillators.push(this.createOscillator(768, 'triangle', 0.04))
        // Subtle shimmer
        const shimmerBuffer = this.createNoiseBuffer('white')
        this.noiseNode = this.audioContext.createBufferSource()
        this.noiseNode.buffer = shimmerBuffer
        this.noiseNode.loop = true
        const shimmerFilter = this.audioContext.createBiquadFilter()
        shimmerFilter.type = 'highpass'
        shimmerFilter.frequency.setValueAtTime(8000, this.audioContext.currentTime)
        const shimmerGain = this.audioContext.createGain()
        shimmerGain.gain.setValueAtTime(0.02, this.audioContext.currentTime)
        this.noiseNode.connect(shimmerFilter)
        shimmerFilter.connect(shimmerGain)
        shimmerGain.connect(this.masterGain!)
        this.noiseNode.start()
        break
    }

    // Start all oscillators
    this.oscillators.forEach(osc => osc.start())
  }

  stop() {
    this.isPlaying = false
    this.oscillators.forEach(osc => {
      try { osc.stop() } catch {}
    })
    this.oscillators = []
    if (this.noiseNode) {
      try { this.noiseNode.stop() } catch {}
      this.noiseNode = null
    }
  }

  isActive() {
    return this.isPlaying
  }
}

// Spiritual/Meditation breathing sound generator using Web Audio API
class BreathingSoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private reverbNode: ConvolverNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.setValueAtTime(0.4, this.audioContext.currentTime)
      this.masterGain.connect(this.audioContext.destination)
      
      // Create reverb for spiritual/ethereal sound
      this.createReverb()
    }
  }

  private async createReverb() {
    if (!this.audioContext) return
    
    // Create impulse response for reverb effect
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * 2.5 // 2.5 second reverb tail
    const impulse = this.audioContext.createBuffer(2, length, sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        // Exponential decay with some randomness for natural reverb
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5)
      }
    }
    
    this.reverbNode = this.audioContext.createConvolver()
    this.reverbNode.buffer = impulse
  }

  setVolume(volume: number) {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(volume * 0.5, this.audioContext.currentTime)
    }
  }

  // Solfeggio frequencies for spiritual healing
  private readonly SOLFEGGIO = {
    UT: 396,   // Liberating guilt and fear
    RE: 417,   // Undoing situations and facilitating change
    MI: 528,   // Transformation and miracles (DNA repair)
    FA: 639,   // Connecting/relationships
    SOL: 741,  // Awakening intuition
    LA: 852,   // Returning to spiritual order
    OM: 136.1  // Om frequency - Earth's vibration
  }

  private playTibetanBowl(frequency: number, duration: number, volume = 0.25) {
    if (!this.audioContext || !this.masterGain) return

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    const now = this.audioContext.currentTime

    // Create multiple harmonics for rich tibetan bowl sound
    const harmonics = [1, 2, 3, 4.5, 5.5]
    const gains = [0.5, 0.3, 0.2, 0.15, 0.1]

    harmonics.forEach((harmonic, i) => {
      const osc = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const filterNode = this.audioContext!.createBiquadFilter()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency * harmonic, now)
      
      // Gentle frequency wobble for authentic bowl sound
      osc.frequency.setValueAtTime(frequency * harmonic, now)
      osc.frequency.linearRampToValueAtTime(frequency * harmonic * 1.002, now + 0.5)
      osc.frequency.linearRampToValueAtTime(frequency * harmonic * 0.998, now + 1.0)
      
      // Low-pass filter for warmth
      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(2000 - (i * 200), now)
      filterNode.Q.setValueAtTime(1, now)
      
      // Bowl-like envelope: quick attack, long sustain, gentle decay
      const peakGain = volume * gains[i]
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.05)
      gainNode.gain.setValueAtTime(peakGain * 0.8, now + 0.2)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)
      
      osc.connect(filterNode)
      filterNode.connect(gainNode)
      
      // Connect to reverb if available
      if (this.reverbNode) {
        const dryGain = this.audioContext!.createGain()
        const wetGain = this.audioContext!.createGain()
        dryGain.gain.setValueAtTime(0.6, now)
        wetGain.gain.setValueAtTime(0.4, now)
        
        gainNode.connect(dryGain)
        gainNode.connect(this.reverbNode)
        this.reverbNode.connect(wetGain)
        dryGain.connect(this.masterGain!)
        wetGain.connect(this.masterGain!)
      } else {
        gainNode.connect(this.masterGain!)
      }
      
      osc.start(now)
      osc.stop(now + duration)
    })
  }

  private playOmTone(duration: number) {
    if (!this.audioContext || !this.masterGain) return

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    const now = this.audioContext.currentTime
    
    // Om frequency with harmonics
    const frequencies = [this.SOLFEGGIO.OM, this.SOLFEGGIO.OM * 2, this.SOLFEGGIO.OM * 3]
    const gains = [0.35, 0.2, 0.1]

    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      
      // Slow, meditative envelope
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(gains[i], now + duration * 0.3)
      gainNode.gain.setValueAtTime(gains[i] * 0.9, now + duration * 0.7)
      gainNode.gain.linearRampToValueAtTime(0, now + duration)
      
      osc.connect(gainNode)
      gainNode.connect(this.masterGain!)
      
      osc.start(now)
      osc.stop(now + duration)
    })
  }

  private playSolfeggioChime(frequencies: number[], duration: number) {
    if (!this.audioContext || !this.masterGain) return

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    const now = this.audioContext.currentTime

    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.15)
      
      // Ethereal chime envelope
      const startTime = now + i * 0.15
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.08)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      
      osc.connect(gainNode)
      gainNode.connect(this.masterGain!)
      
      osc.start(startTime)
      osc.stop(startTime + duration)
    })
  }

  playInhale() {
    // Spiritual inhale: Rising solfeggio frequencies with tibetan bowl
    // 396 Hz (liberation) -> 528 Hz (transformation) 
    this.playTibetanBowl(this.SOLFEGGIO.MI, 2.5, 0.2) // 528 Hz - healing frequency
    this.playSolfeggioChime([this.SOLFEGGIO.UT, this.SOLFEGGIO.MI, this.SOLFEGGIO.SOL], 1.5)
  }

  playHold() {
    // Spiritual hold: Om frequency with sustained bowl
    this.playOmTone(1.5)
    this.playTibetanBowl(this.SOLFEGGIO.FA, 1.8, 0.15) // 639 Hz - connection
  }

  playExhale() {
    // Spiritual exhale: Descending frequencies, releasing energy
    // 852 Hz (spiritual order) -> 639 Hz -> 417 Hz (letting go)
    this.playTibetanBowl(this.SOLFEGGIO.RE, 2.5, 0.2) // 417 Hz - facilitating change
    this.playSolfeggioChime([this.SOLFEGGIO.LA, this.SOLFEGGIO.FA, this.SOLFEGGIO.RE], 1.5)
  }

  // Play a completion/celebration sound
  playComplete() {
    if (!this.audioContext || !this.masterGain) return

    // Beautiful ascending major chord with all solfeggio
    this.playTibetanBowl(this.SOLFEGGIO.MI, 4, 0.25) // 528 Hz
    setTimeout(() => this.playTibetanBowl(this.SOLFEGGIO.SOL, 3.5, 0.2), 200)
    setTimeout(() => this.playTibetanBowl(this.SOLFEGGIO.LA, 3, 0.18), 400)
  }
}

const AMBIENCE_OPTIONS: Record<AmbienceType, { label: string }> = {
  none: { label: 'None' },
  cosmic: { label: '🌌 Cosmic Waves' },
  rain: { label: '🌧️ Soft Rain' },
  birds: { label: '🐦 Morning Birds' },
  ocean: { label: '🌊 Ocean Waves' },
  forest: { label: '🌲 Forest Stream' },
  tibetan: { label: '🔔 Tibetan Bowls' },
  meditation: { label: '🧘 Deep Meditation' },
  spiritual: { label: '✨ Spiritual Journey' }
}

interface SessionSettings {
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  minutes: number
  bpm: number
  tts: boolean
  ttsVoice: string
  vibration: boolean
  ambience: AmbienceType
  ambienceVolume: number
  reducedMotion: 'auto' | 'on' | 'off'
  focusMode: boolean
}

const TECHNIQUE_DEFAULTS: Record<string, Partial<SessionSettings>> = {
  box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4, bpm: 5.5 },
  '478': { inhale: 4, hold1: 7, exhale: 8, hold2: 0, bpm: 5.0 },
  coherent: { inhale: 5, hold1: 0, exhale: 5, hold2: 0, bpm: 6.0 },
  sos: { inhale: 4, hold1: 4, exhale: 6, hold2: 0, bpm: 5.0 }
}

const TECHNIQUE_NAMES: Record<string, string> = {
  box: 'Box Breathing',
  '478': '4-7-8 Breathing',
  coherent: 'Coherent 5-5',
  sos: '60-second SOS'
}

const TECHNIQUE_DESCRIPTIONS: Record<string, string> = {
  box: 'Equal sides like a square: inhale → hold → exhale → hold. Default 4-4-4-4.',
  '478': "Dr. Weil's calming technique: 4 second inhale → 7 second hold → 8 second exhale.",
  coherent: 'Resonant breathing at optimal frequency for heart-rate variability.',
  sos: 'Quick relief protocol: longer exhale for immediate calm.'
}

const QUICK_PRESETS = [
  { label: '3 min · 5.5 BPM · TTS off', inhale: 4, hold1: 4, exhale: 4, hold2: 4, minutes: 3, bpm: 5.5, tts: false, ambience: 'cosmic' as const, ambienceVolume: 0.20 },
  { label: '1 min calm · long exhale · TTS on', inhale: 4, hold1: 4, exhale: 6, hold2: 0, minutes: 1, bpm: 5.0, tts: true, ambience: 'cosmic' as const, ambienceVolume: 0.22 },
  { label: '5 min · 5 BPM · rain', inhale: 5, hold1: 5, exhale: 5, hold2: 5, minutes: 5, bpm: 5.0, tts: false, ambience: 'rain' as const, ambienceVolume: 0.25 }
]

export default function BreathingSession({ technique, challengeKey, onClose }: BreathingSessionProps) {
  const [stage, setStage] = useState<'quick' | 'setup' | 'instructions' | 'session' | 'complete'>('quick')
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [progressCount, setProgressCount] = useState(0)
  const [settings, setSettings] = useState<SessionSettings>({
    ...TECHNIQUE_DEFAULTS[technique],
    minutes: 3,
    bpm: 5.5,
    tts: true,
    ttsVoice: '',
    vibration: true,
    ambience: 'cosmic',
    ambienceVolume: 0.2,
    reducedMotion: 'auto',
    focusMode: true
  } as SessionSettings)

  const [sessionState, setSessionState] = useState({
    isPlaying: false,
    isPaused: false,
    currentPhase: 'ready' as 'ready' | 'inhale' | 'hold1' | 'exhale' | 'hold2',
    phaseCount: 0,
    breathIndex: 0,
    totalBreaths: 0,
    timeLeft: 180,
    completedBreaths: 0
  })

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const countIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const ambientSoundRef = useRef<AmbientSoundGenerator | null>(null)
  const breathingSoundRef = useRef<BreathingSoundGenerator | null>(null)
  const shouldCompleteRef = useRef(false)

  // Initialize sound generators
  useEffect(() => {
    ambientSoundRef.current = new AmbientSoundGenerator()
    breathingSoundRef.current = new BreathingSoundGenerator()
    return () => {
      ambientSoundRef.current?.stop()
    }
  }, [])

  // Load progress count from localStorage
  useEffect(() => {
    const key = `mpl.progress.${technique}.count`
    setProgressCount(Number(localStorage.getItem(key) || 0))
  }, [technique])

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Apply focus mode
  useEffect(() => {
    if (stage === 'session' && settings.focusMode) {
      document.body.classList.add('focus-mode')
    } else {
      document.body.classList.remove('focus-mode')
    }
    return () => document.body.classList.remove('focus-mode')
  }, [stage, settings.focusMode])

  // Calculate total breaths
  useEffect(() => {
    const cycleDuration = settings.inhale + settings.hold1 + settings.exhale + settings.hold2
    const totalBreaths = cycleDuration > 0 ? Math.floor((settings.minutes * 60) / cycleDuration) : 0
    setSessionState(prev => ({ ...prev, totalBreaths, timeLeft: settings.minutes * 60 }))
  }, [settings.minutes, settings.inhale, settings.hold1, settings.exhale, settings.hold2])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && stage === 'session') {
        e.preventDefault()
        if (sessionState.isPaused) {
          handleResume()
        } else {
          handlePause()
        }
      }
      if (e.code === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, sessionState.isPaused])

  // Main breathing cycle logic
  useEffect(() => {
    if (!sessionState.isPlaying || sessionState.isPaused || stage !== 'session') return

    const runPhase = () => {
      type PhaseType = 'ready' | 'inhale' | 'hold1' | 'exhale' | 'hold2'
      const allPhases: Array<{ name: PhaseType; duration: number; label: string }> = [
        { name: 'inhale' as PhaseType, duration: settings.inhale, label: 'Breathe in' },
        { name: 'hold1' as PhaseType, duration: settings.hold1, label: 'Hold' },
        { name: 'exhale' as PhaseType, duration: settings.exhale, label: 'Breathe out' },
        { name: 'hold2' as PhaseType, duration: settings.hold2, label: 'Hold' }
      ]
      const phases = allPhases.filter(p => p.duration > 0)

      let currentPhaseIndex = phases.findIndex(p => p.name === sessionState.currentPhase)
      if (currentPhaseIndex === -1) currentPhaseIndex = 0

      const currentPhaseConfig = phases[currentPhaseIndex]
      
      // Play breathing phase sounds (Web Audio API - always plays)
      if (currentPhaseConfig && breathingSoundRef.current) {
        if (currentPhaseConfig.name === 'inhale') {
          breathingSoundRef.current.playInhale()
        } else if (currentPhaseConfig.name === 'exhale') {
          breathingSoundRef.current.playExhale()
        } else if (currentPhaseConfig.name === 'hold1' || currentPhaseConfig.name === 'hold2') {
          breathingSoundRef.current.playHold()
        }
      }
      
      // Speak phase name at the start of each phase (if TTS enabled)
      if (settings.tts && currentPhaseConfig) {
        // Cancel any ongoing speech before new announcement
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel()
        }
        // Small delay to ensure clean speech after the chime
        setTimeout(() => {
          speak(currentPhaseConfig.label)
        }, 150)
      }

      // Vibrate
      if (settings.vibration && navigator.vibrate) {
        navigator.vibrate(50)
      }

      let countdown = currentPhaseConfig.duration

      countIntervalRef.current = setInterval(() => {
        countdown--
        setSessionState(prev => ({ ...prev, phaseCount: countdown }))

        if (countdown <= 0) {
          if (countIntervalRef.current) clearInterval(countIntervalRef.current)
          
          // Move to next phase
          const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length
          const nextPhase = phases[nextPhaseIndex]

          if (nextPhaseIndex === 0) {
            // Completed full breath cycle
            setSessionState(prev => ({
              ...prev,
              currentPhase: nextPhase.name,
              breathIndex: prev.breathIndex + 1,
              completedBreaths: prev.completedBreaths + 1,
              phaseCount: nextPhase.duration
            }))
          } else {
            setSessionState(prev => ({
              ...prev,
              currentPhase: nextPhase.name,
              phaseCount: nextPhase.duration
            }))
          }
        }
      }, 1000)
    }

    runPhase()

    return () => {
      if (countIntervalRef.current) clearInterval(countIntervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState.isPlaying, sessionState.isPaused, sessionState.currentPhase, stage])

  // Timer countdown
  useEffect(() => {
    if (!sessionState.isPlaying || sessionState.isPaused) return

    const interval = setInterval(() => {
      setSessionState(prev => {
        if (prev.timeLeft <= 1) {
          shouldCompleteRef.current = true
          return { ...prev, timeLeft: 0, isPlaying: false }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionState.isPlaying, sessionState.isPaused])

  // Handle session completion when timer reaches 0
  useEffect(() => {
    if (shouldCompleteRef.current && sessionState.timeLeft === 0 && !sessionState.isPlaying) {
      shouldCompleteRef.current = false
      handleComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionState.timeLeft, sessionState.isPlaying])

  // Ambience audio using Web Audio API
  useEffect(() => {
    if (!ambientSoundRef.current) return

    if (settings.ambience === 'none') {
      ambientSoundRef.current.stop()
      return
    }

    // Update volume
    ambientSoundRef.current.setVolume(settings.ambienceVolume)

    // Start/stop based on session state
    if (stage === 'session' && sessionState.isPlaying && !sessionState.isPaused) {
      ambientSoundRef.current.play(settings.ambience)
    } else {
      ambientSoundRef.current.stop()
    }

    return () => {
      ambientSoundRef.current?.stop()
    }
  }, [settings.ambience, settings.ambienceVolume, stage, sessionState.isPlaying, sessionState.isPaused])

  // Internal speak function for session coaching (respects TTS setting)
  const speak = (text: string) => {
    if (!settings.tts) return
    speakNow(text)
  }

  // Force speak function for manual voice buttons (always plays)
  const speakNow = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    
    // Don't cancel immediately - let current speech finish or wait briefly
    const utterance = new SpeechSynthesisUtterance(text)
    if (settings.ttsVoice) {
      const voice = voices.find(v => v.name === settings.ttsVoice)
      if (voice) utterance.voice = voice
    }
    utterance.rate = 0.85
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const handleTestVoice = () => {
    const testText = 'Inhale... Hold... Exhale... Hold...'
    speakNow(testText)
  }

  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  const handleStartVoiceReading = () => {
    const description = TECHNIQUE_DESCRIPTIONS[technique]
    speakNow(description)
  }

  const handleQuickStart = (mins: number) => {
    setSettings(prev => ({ ...prev, minutes: mins }))
    handleStartSession()
  }

  const handlePresetStart = () => {
    const preset = QUICK_PRESETS[selectedPreset]
    setSettings(prev => ({
      ...prev,
      inhale: preset.inhale,
      hold1: preset.hold1,
      exhale: preset.exhale,
      hold2: preset.hold2,
      minutes: preset.minutes,
      bpm: preset.bpm,
      tts: preset.tts,
      ambience: preset.ambience,
      ambienceVolume: preset.ambienceVolume
    }))
    setTimeout(() => handleStartSession(), 100)
  }

  const handleStartSession = () => {
    setStage('session')
    setSessionState({
      isPlaying: true,
      isPaused: false,
      currentPhase: 'inhale',
      phaseCount: settings.inhale,
      breathIndex: 1,
      totalBreaths: Math.floor((settings.minutes * 60) / (settings.inhale + settings.hold1 + settings.exhale + settings.hold2)),
      timeLeft: settings.minutes * 60,
      completedBreaths: 0
    })
  }

  const handlePause = () => {
    setSessionState(prev => ({ ...prev, isPaused: true }))
    ambientSoundRef.current?.stop()
    window.speechSynthesis.cancel()
  }

  const handleResume = () => {
    setSessionState(prev => ({ ...prev, isPaused: false }))
    if (settings.ambience !== 'none') {
      ambientSoundRef.current?.play(settings.ambience)
    }
  }

  const handleStop = () => {
    if (countIntervalRef.current) clearInterval(countIntervalRef.current)
    setSessionState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentPhase: 'ready',
      phaseCount: 0,
      breathIndex: 0,
      completedBreaths: 0
    }))
    ambientSoundRef.current?.stop()
    window.speechSynthesis.cancel()
    setStage('quick')
  }

  const handleComplete = async () => {
    if (countIntervalRef.current) clearInterval(countIntervalRef.current)
    setSessionState(prev => ({ ...prev, isPlaying: false, isPaused: false }))
    ambientSoundRef.current?.stop()
    window.speechSynthesis.cancel()
    
    // Play completion celebration sound
    breathingSoundRef.current?.playComplete()
    
    // Save progress to localStorage
    const progressKey = `mpl.progress.${technique}.count`
    const currentCount = Number(localStorage.getItem(progressKey) || 0)
    const newCount = currentCount + 1
    localStorage.setItem(progressKey, String(newCount))
    setProgressCount(newCount)
    
    // Save streak
    const today = new Date().toDateString()
    const lastPracticeKey = `mpl.lastPractice.${technique}`
    localStorage.setItem(lastPracticeKey, today)
    
    // Update challenge progress if this session was launched from a challenge
    if (challengeKey) {
      try {
        const deviceId = localStorage.getItem('mpl.deviceId') || (() => {
          const id = crypto.randomUUID()
          localStorage.setItem('mpl.deviceId', id)
          return id
        })()
        
        await fetch('/api/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, challengeKey })
        })
      } catch (error) {
        console.error('Failed to update challenge progress:', error)
      }
    }
    
    setStage('complete')
  }

  const handleMarkPractised = () => {
    const key = `mpl.progress.${technique}.count`
    const current = Number(localStorage.getItem(key) || 0)
    const newCount = current + 1
    localStorage.setItem(key, String(newCount))
    setProgressCount(newCount)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getOrbClass = () => {
    if (sessionState.currentPhase === 'inhale') return 'orb inhale'
    if (sessionState.currentPhase === 'exhale') return 'orb exhale'
    return 'orb'
  }

  const getProgressOffset = () => {
    const phaseDuration = sessionState.currentPhase === 'inhale' ? settings.inhale
      : sessionState.currentPhase === 'hold1' ? settings.hold1
      : sessionState.currentPhase === 'exhale' ? settings.exhale
      : settings.hold2
    
    if (phaseDuration === 0) return 264
    const progress = 1 - (sessionState.phaseCount / phaseDuration)
    const circumference = 2 * Math.PI * 42
    return circumference - (progress * circumference)
  }

  const shouldReduceMotion = settings.reducedMotion === 'on' || 
    (settings.reducedMotion === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <div className="breathing-session-overlay">
      {/* Header Bar */}
      <header className="session-header">
        <Link 
          href="/"
          className="home-link"
          aria-label="Go to home page"
        >
          <Image 
            src="/icons/neurobreath-logo-square-64.png" 
            alt="NeuroBreath Logo" 
            width={32} 
            height={32} 
            className="home-logo" 
          />
          <span className="home-text">NeuroBreath</span>
        </Link>
        <button
          onClick={onClose}
          className="back-btn"
          aria-label="Back to Hub"
        >
          ← Back to Hub
        </button>
        <h1 className="session-title">{TECHNIQUE_NAMES[technique]}</h1>
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </header>

      <main className="session-main">
        {/* Quick Options Stage */}
        {stage === 'quick' && (
          <div className="content-wrapper animate-fade-in">
            {/* Quick Options Card */}
            <section className="session-card">
              <h2 className="card-title">Quick options</h2>
              <p className="card-subtitle">Choose your session duration</p>
              <div className="quick-actions">
                <button onClick={() => handleQuickStart(1)} className="quick-btn">
                  <span className="quick-btn-time">1</span>
                  <span className="quick-btn-label">minute</span>
                </button>
                <button onClick={() => handleQuickStart(3)} className="quick-btn quick-btn-primary">
                  <span className="quick-btn-time">3</span>
                  <span className="quick-btn-label">minutes</span>
                </button>
                <button onClick={() => handleQuickStart(5)} className="quick-btn">
                  <span className="quick-btn-time">5</span>
                  <span className="quick-btn-label">minutes</span>
                </button>
              </div>
            </section>

            {/* Progress Card */}
            <section className="session-card">
              <h2 className="card-title">Your Progress</h2>
              
              {/* Voice Control Row */}
              <div className="voice-control-row">
                <select 
                  className="voice-select"
                  value={settings.ttsVoice}
                  onChange={(e) => setSettings(prev => ({ ...prev, ttsVoice: e.target.value }))}
                  aria-label="Voice selection"
                  title="Select voice for coaching"
                >
                  <option value="">System default</option>
                  {voices.filter(v => v.lang.startsWith('en')).map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <button className="btn-secondary" onClick={handleStartVoiceReading}>🎧 Play</button>
                <button className="btn-secondary" onClick={handleStopVoice}>⏹ Stop</button>
              </div>

              <p className="card-hint">Tap after finishing a round to track progress.</p>
              
              <div className="progress-actions">
                <button className="btn-primary" onClick={handleMarkPractised}>
                  ✓ Mark 1 min practised
                </button>
                <div className="progress-badge">
                  <span className="badge-number">{progressCount}</span>
                  <span className="badge-label">completed</span>
                </div>
              </div>

              <div className="nav-actions">
                <button className="btn-outline" onClick={onClose}>← Return to Home</button>
                <button className="btn-outline" onClick={onClose}>Try Next →</button>
              </div>
            </section>

            {/* Setup Card */}
            <section className="session-card setup-card">
              <h2 className="card-title">{TECHNIQUE_NAMES[technique]} — Setup</h2>
              <p className="card-description">{TECHNIQUE_DESCRIPTIONS[technique]}</p>

              {/* Phase Inputs */}
              <div className="phase-grid">
                <div className="tile">
                  <label>Inhale (s)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.inhale}
                    onChange={(e) => setSettings(prev => ({ ...prev, inhale: Number(e.target.value) }))}
                    title="Inhale duration in seconds"
                  />
                </div>
                <div className="tile">
                  <label>Hold (s)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={settings.hold1}
                    onChange={(e) => setSettings(prev => ({ ...prev, hold1: Number(e.target.value) }))}
                    title="Hold duration after inhale in seconds"
                  />
                </div>
                <div className="tile">
                  <label>Exhale (s)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.exhale}
                    onChange={(e) => setSettings(prev => ({ ...prev, exhale: Number(e.target.value) }))}
                    title="Exhale duration in seconds"
                  />
                </div>
                <div className="tile">
                  <label>Hold (after exhale) (s)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={settings.hold2}
                    onChange={(e) => setSettings(prev => ({ ...prev, hold2: Number(e.target.value) }))}
                    title="Hold duration after exhale in seconds"
                  />
                </div>
              </div>

              {/* Quick Session Presets */}
              <h2 className="text-xl font-bold mt-6 mb-2">Quick Session</h2>
              
              {/* Voice Control Row */}
              <div className="vc-row">
                <select 
                  className="vc-voice"
                  value={settings.ttsVoice}
                  onChange={(e) => setSettings(prev => ({ ...prev, ttsVoice: e.target.value }))}
                  aria-label="Voice selection"
                >
                  <option value="">System default</option>
                  {voices.filter(v => v.lang.startsWith('en')).map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={handleStartVoiceReading}>🎧 Start</button>
                <button className="btn" onClick={handleStopVoice}>■ Stop</button>
              </div>

              <div className="btn-row mt-3">
                <select 
                  className="preset-select"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(Number(e.target.value))}
                  title="Select session preset"
                >
                  {QUICK_PRESETS.map((preset, idx) => (
                    <option key={idx} value={idx}>{preset.label}</option>
                  ))}
                </select>
                <button className="btn btn-success" onClick={handlePresetStart}>▶ Start</button>
                <button className="btn" onClick={handleStopVoice}>■ Stop</button>
              </div>

              {/* Detailed Settings */}
              <div className="ui-panel">
                <div className="kv-grid">
                  <div className="tile">
                    <label>Minutes</label>
                    <select
                      value={settings.minutes}
                      onChange={(e) => setSettings(prev => ({ ...prev, minutes: Number(e.target.value) }))}
                      title="Session duration in minutes"
                    >
                      <option value="1">1 minute</option>
                      <option value="3">3 minutes</option>
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                    </select>
                  </div>

                  <div className="tile">
                    <label>Breaths/min</label>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      step="0.1"
                      value={settings.bpm}
                      onChange={(e) => setSettings(prev => ({ ...prev, bpm: Number(e.target.value) }))}
                      title="Breaths per minute"
                    />
                  </div>

                  <div className="tile">
                    <label>Voice coach (TTS)</label>
                    <select
                      value={settings.tts ? 'on' : 'off'}
                      onChange={(e) => setSettings(prev => ({ ...prev, tts: e.target.value === 'on' }))}
                      title="Enable or disable voice coaching"
                    >
                      <option value="off">Off</option>
                      <option value="on">On</option>
                    </select>
                  </div>

                  <div className="tile">
                    <label>Voice</label>
                    <select
                      value={settings.ttsVoice}
                      onChange={(e) => setSettings(prev => ({ ...prev, ttsVoice: e.target.value }))}
                      title="Select voice for coaching"
                    >
                      <option value="">System default</option>
                      {voices.filter(v => v.lang.startsWith('en')).map(voice => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} · {voice.lang}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-sm mt-2" onClick={handleTestVoice}>Test voice</button>
                  </div>

                  <div className="tile">
                    <label>Haptics</label>
                    <select
                      value={settings.vibration ? 'on' : 'off'}
                      onChange={(e) => setSettings(prev => ({ ...prev, vibration: e.target.value === 'on' }))}
                      title="Enable or disable haptic feedback"
                    >
                      <option value="off">Off</option>
                      <option value="on">On</option>
                    </select>
                  </div>

                  <div className="tile">
                    <label>Ambience</label>
                    <select
                      value={settings.ambience}
                      onChange={(e) => setSettings(prev => ({ ...prev, ambience: e.target.value as AmbienceType }))}
                      title="Select ambient sound"
                    >
                      {(Object.keys(AMBIENCE_OPTIONS) as AmbienceType[]).map((key) => (
                        <option key={key} value={key}>{AMBIENCE_OPTIONS[key].label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="tile">
                    <label>Ambience volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={settings.ambienceVolume}
                      onChange={(e) => setSettings(prev => ({ ...prev, ambienceVolume: Number(e.target.value) }))}
                      title="Adjust ambience volume"
                    />
                  </div>

                  <div className="tile">
                    <label>Reduced motion</label>
                    <select
                      value={settings.reducedMotion}
                      onChange={(e) => setSettings(prev => ({ ...prev, reducedMotion: e.target.value as 'auto' | 'on' | 'off' }))}
                      title="Reduced motion setting"
                    >
                      <option value="auto">Auto</option>
                      <option value="on">Force reduce</option>
                      <option value="off">Full motion</option>
                    </select>
                  </div>

                  <div className="tile">
                    <label>Focus mode</label>
                    <select
                      value={settings.focusMode ? 'on' : 'off'}
                      onChange={(e) => setSettings(prev => ({ ...prev, focusMode: e.target.value === 'on' }))}
                      title="Enable or disable focus mode"
                    >
                      <option value="off">Off</option>
                      <option value="on">On</option>
                    </select>
                  </div>
                </div>

                <p className="hint mt-4">
                  Tip: Start with <strong>3 minutes · 5.5 BPM</strong>. Tap the orb or press <strong>Space</strong> to pause/resume.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="btn-row mt-4">
                <button className="btn btn-success" onClick={handleStartSession}>Start</button>
                <button className="btn" onClick={() => setStage('instructions')}>Instructions</button>
                <button className="btn" onClick={handleStop}>Stop</button>
              </div>
            </section>

            {/* Footer */}
            <div className="footer">
              <p>© {new Date().getFullYear()} <strong>NeuroBreath</strong> — Empowering minds through breath.</p>
              <p className="mt-2">Educational content only, not medical advice. <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/support-us">Support Us</a></p>
            </div>
          </div>
        )}

        {/* Instructions Stage */}
        {stage === 'instructions' && (
          <div className="space-y-6 text-white animate-fade-in">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">How to Practice</h2>
              
              <div className="vc-row">
                <select 
                  className="vc-voice"
                  value={settings.ttsVoice}
                  onChange={(e) => setSettings(prev => ({ ...prev, ttsVoice: e.target.value }))}
                  title="Select voice for instructions"
                >
                  <option value="">System default</option>
                  {voices.filter(v => v.lang.startsWith('en')).map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <button className="btn" onClick={handleStartVoiceReading}>🎧 Start</button>
                <button className="btn" onClick={handleStopVoice}>■ Stop</button>
              </div>

              <ol className="list-decimal list-inside space-y-3 my-6">
                <li>Sit upright or lie flat; soften shoulders and jaw.</li>
                <li>One hand on chest, one on belly (diaphragmatic cues).</li>
                <li>Inhale → Hold → Exhale → Hold with equal counts (e.g., 4-4-4-4).</li>
              </ol>

              <div className="btn-row">
                <button className="btn btn-success" onClick={handleStartSession}>Begin Session</button>
                <button className="btn" onClick={() => setStage('quick')}>Back to Setup</button>
              </div>
            </div>

            <div className="footer">
              <p>© {new Date().getFullYear()} <strong>NeuroBreath</strong> — Empowering minds through breath.</p>
              <p className="mt-2">Educational content only, not medical advice. <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/support-us">Support Us</a></p>
            </div>
          </div>
        )}

        {/* Session Stage */}
        {stage === 'session' && (
          <div className={`session-stage-wrapper ${settings.focusMode ? 'focus-active' : ''}`}>
            <div className={`card session ${settings.focusMode ? 'focus-session' : ''}`}>
              {/* Focus Mode: Show only minimal info */}
              {settings.focusMode && (
                <div className="focus-header">
                  <span className="focus-technique">{TECHNIQUE_NAMES[technique]}</span>
                  <span className="focus-timer">{formatTime(sessionState.timeLeft)}</span>
                </div>
              )}
              
              {!settings.focusMode && (
                <h2 className="text-2xl font-bold mb-4 text-center">Session</h2>
              )}
              
              {/* Orb with Progress Ring */}
              <div 
                className={`orb-wrap ${settings.focusMode ? 'focus-orb-wrap' : ''}`}
                onClick={() => sessionState.isPaused ? handleResume() : handlePause()}
                role="button"
                tabIndex={0}
                aria-label="Tap to pause/resume"
                title="Tap to pause/resume"
              >
                <svg className="radial" viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="ring base" cx="50" cy="50" r="42" />
                  <circle 
                    className="ring progress" 
                    cx="50" 
                    cy="50" 
                    r="42"
                    strokeDasharray="264"
                    strokeDashoffset={getProgressOffset()}
                  />
                </svg>
                
                <div className={`${getOrbClass()} ${shouldReduceMotion ? 'reduced-motion' : ''}`}>
                  <div>
                    <div className="phase">
                      {sessionState.currentPhase === 'hold1' || sessionState.currentPhase === 'hold2' 
                        ? 'Hold' 
                        : sessionState.currentPhase.charAt(0).toUpperCase() + sessionState.currentPhase.slice(1)}
                    </div>
                    <div className="count">{sessionState.phaseCount}</div>
                    <div className="mini">
                    <span>{sessionState.breathIndex}</span>/<span>{sessionState.totalBreaths}</span> breaths
                  </div>
                </div>
              </div>
            </div>

            {/* Controls - Different for focus mode */}
            {settings.focusMode ? (
              <div className="focus-controls">
                <button 
                  className="focus-control-btn"
                  onClick={sessionState.isPaused ? handleResume : handlePause}
                  aria-label={sessionState.isPaused ? 'Resume' : 'Pause'}
                >
                  {sessionState.isPaused ? '▶' : '⏸'}
                </button>
                <button 
                  className="focus-control-btn exit-btn"
                  onClick={handleStop}
                  aria-label="Stop session"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="btn-row justify-center mt-6">
                <button className="btn" onClick={sessionState.isPaused ? handleResume : handlePause}>
                  {sessionState.isPaused ? 'Resume' : 'Pause'}
                </button>
                <button className="btn" onClick={() => setStage('quick')}>Adjust Settings</button>
                <button className="btn" onClick={handleStop}>Stop</button>
              </div>
            )}

            {/* Time remaining - only show if not focus mode */}
            {!settings.focusMode && (
              <div className="text-center text-white/60 mt-4">
                Time remaining: {formatTime(sessionState.timeLeft)}
              </div>
            )}
            </div>
          </div>
        )}

        {/* Complete Stage */}
        {stage === 'complete' && (
          <div className="space-y-6 text-white animate-fade-in">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 text-center">Session Complete</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="tile text-center">
                  <label>Total Minutes</label>
                  <div className="val">{settings.minutes}</div>
                </div>
                <div className="tile text-center">
                  <label>Day Streak</label>
                  <div className="val">{progressCount}</div>
                </div>
                <div className="tile text-center">
                  <label>Total Breaths</label>
                  <div className="val">{sessionState.completedBreaths}</div>
                </div>
              </div>

              <div className="btn-row justify-center">
                <button className="btn btn-success" onClick={() => {
                  setStage('quick')
                  setSessionState(prev => ({
                    ...prev,
                    isPlaying: false,
                    isPaused: false,
                    currentPhase: 'ready',
                    breathIndex: 0,
                    completedBreaths: 0
                  }))
                }}>Again</button>
                <button className="btn" onClick={onClose}>Back to Hub</button>
              </div>
            </div>

            <div className="footer">
              <p>© {new Date().getFullYear()} <strong>NeuroBreath</strong> — Empowering minds through breath.</p>
              <p className="mt-2">Educational content only, not medical advice. <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/support-us">Support Us</a></p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        /* ============================================
           BREATHING SESSION - HOME PAGE STYLED
           ============================================ */
        
        /* Overlay Container */
        .breathing-session-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* Header Bar */
        .session-header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          color: #3b82f6;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .session-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
        }

        /* Home Link in Header */
        .home-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #111827;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .home-link:hover {
          opacity: 0.8;
        }

        .home-logo {
          border-radius: 8px;
        }

        .home-text {
          font-size: 1rem;
          font-weight: 700;
          color: #7c3aed;
        }

        @media (max-width: 640px) {
          .home-text {
            display: none;
          }
        }

        /* Main Content */
        .session-main {
          flex: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px;
          padding-top: 40px;
          width: 100%;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .session-stage-wrapper {
          margin-top: 24px;
          padding-top: 20px;
        }

        /* Session Cards - Home Page Style */
        .session-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
        }

        .setup-card {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-color: #bfdbfe;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-size: 0.938rem;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .card-description {
          font-size: 0.938rem;
          color: #4b5563;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .card-hint {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 12px 0;
        }

        /* Quick Actions - Time Buttons */
        .quick-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .quick-btn {
          flex: 1;
          min-width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 20px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
        }

        .quick-btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-color: #3b82f6;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .quick-btn-primary:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 8px 12px -2px rgba(59, 130, 246, 0.4);
        }

        .quick-btn-time {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
        }

        .quick-btn-primary .quick-btn-time {
          color: white;
        }

        .quick-btn-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }

        .quick-btn-primary .quick-btn-label {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Voice Control Row */
        .voice-control-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .voice-select {
          flex: 1;
          min-width: 160px;
          padding: 10px 14px;
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-size: 0.875rem;
        }

        .voice-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Progress Section */
        .progress-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          margin: 16px 0;
        }

        .progress-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 20px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          border-radius: 12px;
        }

        .badge-number {
          font-size: 1.75rem;
          font-weight: 800;
          color: #059669;
        }

        .badge-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #047857;
          text-transform: uppercase;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 0.938rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 10px -2px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: transparent;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          color: #3b82f6;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: #3b82f6;
          color: white;
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 6px 10px -2px rgba(16, 185, 129, 0.4);
        }

        /* Phase Grid */
        .phase-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 640px) {
          .phase-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Legacy Styles for unchanged sections */
        .card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          color: #111827;
        }

        .card.setup {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-color: #bfdbfe;
          margin-top: 16px;
        }

        .card.session {
          display: grid;
          place-items: center;
          gap: 18px;
          text-align: center;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          padding: 32px;
          margin-top: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #bfdbfe;
        }

        /* UI Panel */
        .ui-panel {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
        }

        /* Grid Layouts */
        .kv-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        @media (max-width: 760px) {
          .kv-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Tiles */
        .tile {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tile label {
          font-size: 0.813rem;
          font-weight: 600;
          color: #374151;
        }

        .tile input,
        .tile select {
          width: 100%;
          padding: 10px 14px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #111827;
          font-size: 0.875rem;
        }

        .tile input:focus,
        .tile select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Buttons Legacy */
        .btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .btn-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Voice Control Legacy */
        .vc-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
          margin: 8px 0;
        }

        .vc-voice {
          min-width: 160px;
          padding: 10px 14px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-size: 0.875rem;
        }

        .preset-select {
          flex: 1;
          padding: 10px 14px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-size: 0.875rem;
        }

        .muted {
          color: #6b7280;
        }

        .hint {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Orb Styles - Properly centered breathing circle */
        .orb-wrap {
          position: relative;
          width: min(280px, 70vw);
          height: min(280px, 70vw);
          cursor: pointer;
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orb {
          position: absolute;
          width: 75%;
          height: 75%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
          box-shadow: 
            inset 0 -8px 20px rgba(0, 0, 0, 0.15),
            inset 0 8px 20px rgba(255, 255, 255, 0.25),
            0 10px 30px rgba(59, 130, 246, 0.4);
          border: 3px solid rgba(255, 255, 255, 0.4);
          transform: scale(0.85);
          transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        .orb.inhale {
          transform: scale(1.0);
        }

        .orb.exhale {
          transform: scale(0.75);
        }

        .orb.reduced-motion {
          transition: none;
          transform: scale(0.9) !important;
        }

        /* Phase Display */
        .phase {
          font-weight: 700;
          font-size: clamp(18px, 4vw, 24px);
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .count {
          font-weight: 900;
          font-size: clamp(48px, 12vw, 64px);
          line-height: 1;
          margin: 8px 0;
          color: white;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .mini {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        /* SVG Progress Ring */
        svg.radial {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
          z-index: 1;
        }

        .ring {
          fill: none;
          stroke-width: 6;
          stroke-linecap: round;
        }

        .ring.base {
          stroke: rgba(59, 130, 246, 0.15);
        }

        .ring.progress {
          stroke: #10b981;
          transition: stroke-dashoffset 0.3s linear;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 32px 16px;
          font-size: 0.875rem;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          margin-top: 32px;
          background: white;
        }

        .footer strong {
          color: #111827;
        }

        .footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        /* Animations */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Focus Mode */
        :global(body.focus-mode) header,
        :global(body.focus-mode) footer,
        :global(body.focus-mode) nav,
        :global(body.focus-mode) .site-header,
        :global(body.focus-mode) .site-footer {
          display: none !important;
        }

        /* Focus Mode Active Session */
        .focus-active {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .focus-session {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          width: 100%;
          max-width: 100%;
          padding: 0 !important;
        }

        .focus-header {
          position: fixed;
          top: calc(80px + 2%);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 210;
          padding: 12px 28px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(20px);
        }

        .focus-technique {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .focus-timer {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .focus-orb-wrap {
          width: min(300px, 70vw) !important;
          height: min(300px, 70vw) !important;
        }

        .focus-orb-wrap .orb {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
          box-shadow: 
            inset 0 -10px 30px rgba(0, 0, 0, 0.2),
            inset 0 10px 30px rgba(255, 255, 255, 0.15),
            0 0 60px rgba(139, 92, 246, 0.5),
            0 0 120px rgba(139, 92, 246, 0.3);
        }

        .focus-orb-wrap .ring.base {
          stroke: rgba(139, 92, 246, 0.2);
        }

        .focus-orb-wrap .ring.progress {
          stroke: #a78bfa;
        }

        .focus-controls {
          position: fixed;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
          z-index: 210;
          padding: 14px 22px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 50px;
          backdrop-filter: blur(20px);
        }

        .focus-control-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .focus-control-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .focus-control-btn:active {
          transform: scale(0.95);
        }

        .focus-control-btn.exit-btn {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.6);
        }

        .focus-control-btn.exit-btn:hover {
          background: rgba(239, 68, 68, 0.4);
          border-color: rgba(239, 68, 68, 0.8);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }

        /* Mobile responsive for focus mode */
        @media (max-width: 640px) {
          .focus-header {
            top: calc(70px + 2%);
            padding: 10px 20px;
          }

          .focus-technique {
            font-size: 0.6rem;
            letter-spacing: 2px;
          }

          .focus-timer {
            font-size: 1.5rem;
          }

          .focus-orb-wrap {
            width: min(250px, 65vw) !important;
            height: min(250px, 65vw) !important;
          }

          .focus-controls {
            bottom: 6%;
            gap: 16px;
            padding: 12px 18px;
          }

          .focus-control-btn {
            width: 48px;
            height: 48px;
            font-size: 1.1rem;
          }
        }

        /* Session State Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 20px 0;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .session-header {
            padding: 12px 16px;
          }

          .session-title {
            font-size: 1rem;
          }

          .back-btn {
            padding: 6px 12px;
            font-size: 0.813rem;
          }

          .session-main {
            padding: 16px;
          }

          .quick-actions {
            flex-direction: column;
          }

          .quick-btn {
            min-width: auto;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Hidden */
        .hidden {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
