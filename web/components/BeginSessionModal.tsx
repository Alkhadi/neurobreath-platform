'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Play, Pause, Square, Volume2, Music } from 'lucide-react'
import { getTechniqueById, calculateTotalCycleDuration } from '@/lib/breathing-data'
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS'
import { trackProgress } from '@/lib/progress/track'

interface BeginSessionModalProps {
  isOpen: boolean
  onClose: () => void
}

type View = 'picker' | 'session'
type Phase = 'inhale' | 'hold' | 'exhale' | 'ready'
type AmbienceType = 'none' | 'cosmic' | 'rain' | 'birds' | 'ocean' | 'forest' | 'tibetan' | 'meditation' | 'spiritual'

// Ambient sound generator using Web Audio API
class AmbientSoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private noiseNode: AudioBufferSourceNode | null = null
  private isPlaying = false
  private isTransitioning = false
  private currentType: AmbienceType = 'none'

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
    
    // Prevent rapid transitions
    if (this.isTransitioning || (this.isPlaying && this.currentType === type)) return
    
    this.isTransitioning = true
    this.stop()
    this.isPlaying = true
    this.currentType = type

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      void this.audioContext.resume()
    }
    
    // Small delay to prevent race condition
    setTimeout(() => {
      this.isTransitioning = false
    }, 100)

    switch (type) {
      case 'cosmic': {
        // Deep space ambient drone
        this.oscillators.push(this.createOscillator(60, 'sine', 0.15))
        this.oscillators.push(this.createOscillator(90, 'sine', 0.1))
        this.oscillators.push(this.createOscillator(120, 'triangle', 0.08))
        this.oscillators.push(this.createOscillator(180, 'sine', 0.05))
        break
      }
        
      case 'rain': {
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
      }
        
      case 'ocean': {
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
      }
        
      case 'birds': {
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
      }
        
      case 'forest': {
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
      }
        
      case 'tibetan': {
        // Tibetan singing bowls - harmonic tones
        this.oscillators.push(this.createOscillator(174, 'sine', 0.12))
        this.oscillators.push(this.createOscillator(285, 'sine', 0.1))
        this.oscillators.push(this.createOscillator(396, 'sine', 0.08))
        this.oscillators.push(this.createOscillator(528, 'sine', 0.06))
        this.oscillators.push(this.createOscillator(639, 'triangle', 0.04))
        break
      }
        
      case 'meditation': {
        // Deep meditation drone with binaural-like tones
        this.oscillators.push(this.createOscillator(100, 'sine', 0.15))
        this.oscillators.push(this.createOscillator(104, 'sine', 0.15)) // 4Hz difference for theta
        this.oscillators.push(this.createOscillator(200, 'sine', 0.08))
        this.oscillators.push(this.createOscillator(300, 'triangle', 0.05))
        break
      }
        
      case 'spiritual': {
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
    }

    // Start all oscillators
    this.oscillators.forEach(osc => osc.start())
  }

  stop() {
    if (!this.isPlaying && this.oscillators.length === 0) return
    
    this.isPlaying = false
    this.currentType = 'none'
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

const AMBIENCE_OPTIONS: { id: AmbienceType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'cosmic', label: '🌌 Cosmic Waves' },
  { id: 'rain', label: '🌧️ Soft Rain' },
  { id: 'birds', label: '🐦 Morning Birds' },
  { id: 'ocean', label: '🌊 Ocean Waves' },
  { id: 'forest', label: '🌲 Forest Stream' },
  { id: 'tibetan', label: '🔔 Tibetan Bowls' },
  { id: 'meditation', label: '🧘 Deep Meditation' },
  { id: 'spiritual', label: '✨ Spiritual Journey' }
]

export function BeginSessionModal({ isOpen, onClose }: BeginSessionModalProps) {
  const [view, setView] = useState<View>('picker')
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [selectedTechnique, setSelectedTechnique] = useState<string>('4-7-8')
  const [selectedVoice, setSelectedVoice] = useState<string>('british-male')
  const [selectedAmbience, setSelectedAmbience] = useState<AmbienceType>('cosmic')
  const [ambienceVolume, setAmbienceVolume] = useState<number>(0.25)
  const [isTestingAmbience, setIsTestingAmbience] = useState(false)
  const voiceEnabled = true
  
  // Session state
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<Phase>('ready')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const ambientSoundRef = useRef<AmbientSoundGenerator | null>(null)
  const didTrackRef = useRef<boolean>(false)

  // Initialize ambient sound generator
  useEffect(() => {
    ambientSoundRef.current = new AmbientSoundGenerator()
    return () => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.stop()
      }
    }
  }, [])

  // Handle ambience playback during session OR testing
  useEffect(() => {
    if (!ambientSoundRef.current) return

    const shouldPlay = (view === 'session' && isPlaying && selectedAmbience !== 'none') || 
                       (view === 'picker' && isTestingAmbience && selectedAmbience !== 'none')
    
    if (shouldPlay) {
      ambientSoundRef.current.setVolume(ambienceVolume)
      ambientSoundRef.current.play(selectedAmbience)
    } else {
      ambientSoundRef.current.stop()
    }
  }, [view, isPlaying, isTestingAmbience, selectedAmbience, ambienceVolume])

  useEffect(() => {
    if (!isOpen) {
      setView('picker')
      setIsPlaying(false)
      setPhase('ready')
      setIsTestingAmbience(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (ambientSoundRef.current) ambientSoundRef.current.stop()
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedTechnique === 'sos' && selectedDuration !== 1) {
      setSelectedDuration(1)
    }
  }, [selectedTechnique, selectedDuration])

  if (!isOpen) return null

  // Calculate progress percentage
  const progressPercentage = totalTime > 0 ? Math.round(((totalTime - timeRemaining) / totalTime) * 100) : 0

  const techniques = [
    {
      id: 'box-breathing',
      name: '🟩 Box Breathing',
      subtitle: 'Equal 4-4-4-4 pacing',
      color: 'bg-green-50 border-green-200',
      colorActive: 'bg-green-100 border-green-400'
    },
    {
      id: '4-7-8',
      name: '🟦 4-7-8 Breathing',
      subtitle: 'Slow exhale wind-down',
      color: 'bg-blue-50 border-blue-200',
      colorActive: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'coherent',
      name: '🟪 Coherent 5-5',
      subtitle: 'HRV-friendly resonance',
      color: 'bg-purple-50 border-purple-200',
      colorActive: 'bg-purple-100 border-purple-400'
    },
    {
      id: 'sos',
      name: '🆘 60-second SOS',
      subtitle: 'Rapid calm cue',
      color: 'bg-red-50 border-red-200',
      colorActive: 'bg-red-100 border-red-400'
    }
  ]

  const voiceOptions = [
    { id: 'british-male', label: 'British male' },
    { id: 'british-female', label: 'British female' },
    { id: 'us-male', label: 'US male' },
    { id: 'us-female', label: 'US female' }
  ]

  const speak = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return

    const cleanText = sanitizeForTTS(text)
    if (!cleanText) return

    // Cancel any existing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }
    
    // Small delay to prevent race condition
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      
      // Handle errors gracefully
      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error)
      }
      
      window.speechSynthesis.speak(utterance)
      utteranceRef.current = utterance
    }, 50)
  }

  const readInstructions = () => {
    const technique = techniques.find(t => t.id === selectedTechnique)
    if (technique) {
      speak(`${technique.name}. ${technique.subtitle}. Pick a warm-up technique and duration. We will start your session with voice guidance.`)
    }
  }

  const stopVoice = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  const testVoice = () => {
    speak('This is a voice test. Daniel, English, Great Britain.')
  }

  const handleStartBreathing = () => {
    setIsTestingAmbience(false) // Stop preview when starting session
    didTrackRef.current = false // Reset tracking guard
    const isSos = selectedTechnique === 'sos' || getTechniqueById(selectedTechnique)?.id === 'sos'
    const totalSeconds = isSos ? 60 : selectedDuration * 60
    setTotalTime(totalSeconds)
    setTimeRemaining(totalSeconds)
    setView('session')
    setIsPlaying(true)
    startBreathingCycle()
  }

  const startBreathingCycle = () => {
    const technique = getTechniqueById(selectedTechnique)
    if (!technique) return

    let phaseIndex = 0
    let secondsInPhase = 0

    setPhase(technique.phases[0].name.toLowerCase() as Phase)
    speak(technique.phases[0].name)

    intervalRef.current = setInterval(() => {
      secondsInPhase++

      // Check if current phase is complete
      if (secondsInPhase >= technique.phases[phaseIndex].duration) {
        secondsInPhase = 0
        phaseIndex = (phaseIndex + 1) % technique.phases.length

        const nextPhase = technique.phases[phaseIndex]
        setPhase(nextPhase.name.toLowerCase() as Phase)
        speak(nextPhase.name)
      }

      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsPlaying(false)
          setPhase('ready')
          speak('Session complete')
          
          // Track progress - guard against double-fire
          if (!didTrackRef.current) {
            didTrackRef.current = true
            const technique = getTechniqueById(selectedTechnique)
            const durationSeconds = Math.round((totalTime || 60))
            const cycleDuration = technique ? calculateTotalCycleDuration(technique) : 10
            const cycles = cycleDuration > 0 ? Math.floor(durationSeconds / cycleDuration) : 6

            const inhaleSeconds = technique?.phases.find(p => p.name.toLowerCase().includes('inhale'))?.duration
            const exhaleSeconds = technique?.phases.find(p => p.name.toLowerCase().includes('exhale'))?.duration
            
            // Build pattern string from phases
            const patternParts = technique?.phases.map(p => p.duration.toString()) ?? []
            const pattern = patternParts.join('-')
            
            void trackProgress({
              type: 'breathing_completed',
              metadata: {
                techniqueId: technique?.id || selectedTechnique || 'unknown',
                durationSeconds,
                cycles,
                pattern,
                inhaleSeconds,
                exhaleSeconds,
                category: 'breathing',
              },
              path: typeof window !== 'undefined' ? window.location.pathname : undefined,
            })
          }
          
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    stopVoice()
  }

  const handleResume = () => {
    setIsPlaying(true)
    startBreathingCycle()
  }

  const handleStop = () => {
    setIsPlaying(false)
    setPhase('ready')
    if (intervalRef.current) clearInterval(intervalRef.current)
    stopVoice()
    setView('picker')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-xl bg-white rounded-2xl shadow-2xl z-[9999] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-start-title"
        onClick={(e) => e.stopPropagation()}
      >
        {view === 'picker' ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="quick-start-title" className="text-xl font-bold text-gray-900">
                Choose a breathing technique
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Narration Voice Section */}
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={16} className="text-gray-600" />
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Narration Voice
                </label>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-3">Choose narration voice</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <label htmlFor="narration-voice-select" className="sr-only">
                  Select narration voice
                </label>
                <select
                  id="narration-voice-select"
                  name="narrationVoice"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select narration voice"
                  title="Choose your preferred narration voice"
                >
                  {voiceOptions.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
                <button
                  onClick={readInstructions}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  aria-label="Read breathing instructions aloud"
                >
                  Read instructions
                </button>
                <button
                  onClick={stopVoice}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  aria-label="Stop voice narration"
                >
                  Stop
                </button>
              </div>

              <button
                onClick={testVoice}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 mb-2"
                aria-label="Test selected voice"
              >
                Voice test
              </button>
              
              <p className="text-xs text-gray-600">Daniel • en-GB</p>
            </div>

            {/* Instruction Text */}
            <p className="text-sm text-gray-700 mb-4">
              Pick a warm-up technique and duration. We will start your session with voice guidance.
            </p>

            {/* Technique Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6" role="group" aria-label="Breathing technique options">
              {techniques.map(tech => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechnique(tech.id)}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTechnique === tech.id ? tech.colorActive : tech.color
                  }`}
                  aria-label={`Select ${tech.name} technique - ${tech.subtitle}`}
                >
                  {selectedTechnique === tech.id && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-white rounded-full border border-gray-300">
                      Selected
                    </span>
                  )}
                  <div className="font-semibold text-gray-900 mb-1">{tech.name}</div>
                  <div className="text-xs text-gray-600">{tech.subtitle}</div>
                </button>
              ))}
            </div>

            {/* Session Duration */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Session duration</h3>
              <p className="text-xs text-gray-600 mb-3">Tap a timing that feels doable today.</p>

              <div className="flex gap-2" role="group" aria-label="Session duration options">
                {[1, 2, 3, 4, 5].map(min => (
                  <button
                    key={min}
                    onClick={() => setSelectedDuration(min)}
                    disabled={selectedTechnique === 'sos' && min !== 1}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      selectedDuration === min
                        ? 'bg-blue-50 border-blue-400 text-blue-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                    aria-label={`Select ${min} minute session`}
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </div>

            {/* Ambience Sound Section */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Music size={16} className="text-purple-600" />
                <label className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                  Ambience Sounds
                </label>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-3">Choose background ambience</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <label htmlFor="ambience-sound-select" className="sr-only">
                  Select ambience sound
                </label>
                <select
                  id="ambience-sound-select"
                  name="ambienceSound"
                  value={selectedAmbience}
                  onChange={(e) => setSelectedAmbience(e.target.value as AmbienceType)}
                  className="flex-1 px-3 py-1.5 text-sm border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  aria-label="Select ambience sound"
                  title="Choose your preferred background sound"
                >
                  {AMBIENCE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsTestingAmbience(!isTestingAmbience)}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    isTestingAmbience 
                      ? 'bg-purple-500 text-white border-purple-500' 
                      : 'border-purple-300 text-purple-700 hover:bg-purple-100'
                  }`}
                  aria-label={isTestingAmbience ? 'Stop preview' : 'Preview ambience'}
                  disabled={selectedAmbience === 'none'}
                >
                  {isTestingAmbience ? 'Stop' : 'Preview'}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <label htmlFor="ambience-volume-slider" className="text-xs text-gray-600 w-14">
                  Volume
                </label>
                <input
                  id="ambience-volume-slider"
                  name="ambienceVolume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambienceVolume}
                  onChange={(e) => setAmbienceVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  aria-label="Ambience volume"
                />
                <span className="text-xs text-gray-600 w-10 text-right">{Math.round(ambienceVolume * 100)}%</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Cancel and close modal"
              >
                Cancel
              </button>
              <button
                onClick={handleStartBreathing}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Start breathing session"
              >
                Start breathing
              </button>
            </div>
          </div>
        ) : (
          /* Session View */
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Breathing Session</h2>
              <button
                onClick={handleStop}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Stop session"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-gray-900 mb-2">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-gray-600">Time remaining</div>
            </div>

            {/* Phase Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6 text-center">
              <div className="text-3xl font-bold text-gray-900 capitalize mb-2">{phase}</div>
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-200 to-purple-200 rounded-full animate-pulse" />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ${
                    progressPercentage <= 0 ? 'w-0' :
                    progressPercentage <= 5 ? 'w-[5%]' :
                    progressPercentage <= 10 ? 'w-[10%]' :
                    progressPercentage <= 15 ? 'w-[15%]' :
                    progressPercentage <= 20 ? 'w-[20%]' :
                    progressPercentage <= 25 ? 'w-1/4' :
                    progressPercentage <= 30 ? 'w-[30%]' :
                    progressPercentage <= 35 ? 'w-[35%]' :
                    progressPercentage <= 40 ? 'w-[40%]' :
                    progressPercentage <= 45 ? 'w-[45%]' :
                    progressPercentage <= 50 ? 'w-1/2' :
                    progressPercentage <= 55 ? 'w-[55%]' :
                    progressPercentage <= 60 ? 'w-[60%]' :
                    progressPercentage <= 65 ? 'w-[65%]' :
                    progressPercentage <= 70 ? 'w-[70%]' :
                    progressPercentage <= 75 ? 'w-3/4' :
                    progressPercentage <= 80 ? 'w-[80%]' :
                    progressPercentage <= 85 ? 'w-[85%]' :
                    progressPercentage <= 90 ? 'w-[90%]' :
                    progressPercentage <= 95 ? 'w-[95%]' :
                    'w-full'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span className="sr-only">Session progress: {progressPercentage}%</span>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {!isPlaying ? (
                <button
                  onClick={handleResume}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  aria-label="Resume breathing session"
                >
                  <Play size={18} />
                  Resume
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-6 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                  aria-label="Pause breathing session"
                >
                  <Pause size={18} />
                  Pause
                </button>
              )}
              <button
                onClick={handleStop}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                aria-label="Stop breathing session and return to picker"
              >
                <Square size={18} />
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
