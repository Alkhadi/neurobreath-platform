'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Play, Pause, RotateCcw, Square, Settings, Music, Headphones, X } from 'lucide-react'
import { calculateRoundsForMinutes, getTechniqueById } from '@/lib/breathing-data'
import { getDeviceId } from '@/lib/device-id'
import { toast } from 'sonner'
import Link from 'next/link'
import BreathingSession from './breathing-session'
import { useBreathingSession } from '@/contexts/BreathingSessionContext'

type AmbienceType = 'none' | 'cosmic' | 'rain' | 'birds' | 'ocean' | 'forest' | 'tibetan' | 'meditation' | 'spiritual'
type ViewMode = 'main' | 'settings' | 'focus'

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

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    switch (type) {
      case 'cosmic': {
        const freqs = [55, 110, 165, 220]
        freqs.forEach(f => {
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
        filter.connect(this.masterGain!)
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
        filter.connect(this.masterGain!)
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
        filter.connect(this.masterGain!)
        this.noiseNode.start()
        break
      }
      case 'birds': {
        const freqs = [1200, 1800, 2400, 3000]
        freqs.forEach(f => {
          const osc = this.createOscillator(f, 'sine', 0.01)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'tibetan': {
        const freqs = [136.1, 272.2, 408.3]
        freqs.forEach(f => {
          const osc = this.createOscillator(f, 'sine', 0.05)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'meditation': {
        const freqs = [256, 384, 512]
        freqs.forEach(f => {
          const osc = this.createOscillator(f, 'sine', 0.04)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
      case 'spiritual': {
        const freqs = [432, 528, 639]
        freqs.forEach(f => {
          const osc = this.createOscillator(f, 'sine', 0.03)
          this.oscillators.push(osc)
          osc.start()
        })
        break
      }
    }
  }

  stop() {
    this.oscillators.forEach(osc => {
      try { osc.stop() } catch {}
    })
    this.oscillators = []
    if (this.noiseNode) {
      try { this.noiseNode.stop() } catch {}
      this.noiseNode = null
    }
    this.isPlaying = false
  }
}

export default function DailyPracticePlayer() {
  const { activeTechnique, challengeKey, launchSession, closeSession } = useBreathingSession()
  const [technique, setTechnique] = useState('box-breathing')
  const [minutes, setMinutes] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [currentPhase, setCurrentPhase] = useState('Ready')
  
  // New state for enhanced features
  const [viewMode, setViewMode] = useState<ViewMode>('main')
  const [ambience, setAmbience] = useState<AmbienceType>('none')
  const [ambienceVolume, setAmbienceVolume] = useState(0.3)
  const [voiceSpeed, setVoiceSpeed] = useState(1.0)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [focusModeEnabled, setFocusModeEnabled] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('')
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  
  const ambientSoundRef = useRef<AmbientSoundGenerator | null>(null)

  const selectedTechnique = getTechniqueById(technique)
  const totalRounds = calculateRoundsForMinutes(selectedTechnique!, minutes)

  // Initialize ambient sound generator
  useEffect(() => {
    ambientSoundRef.current = new AmbientSoundGenerator()
    return () => {
      ambientSoundRef.current?.stop()
    }
  }, [])

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
      if (voices.length > 0 && !selectedVoice) {
        const defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0]
        setSelectedVoice(defaultVoice.name)
      }
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [selectedVoice])

  useEffect(() => {
    setTimeLeft(minutes * 60)
  }, [minutes])

  const handleStop = useCallback(async () => {
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentRound(0)
    setBreathCount(0)
    setTimeLeft(minutes * 60)
    setCurrentPhase('Ready')
    
    // Stop ambient sounds and voice
    ambientSoundRef.current?.stop()
    window.speechSynthesis?.cancel()

    // Log session
    if (breathCount > 0) {
      try {
        const deviceId = getDeviceId()
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId,
            technique,
            label: selectedTechnique?.name ?? 'Breathing Session',
            minutes,
            breaths: breathCount,
            rounds: currentRound,
            category: selectedTechnique?.category ?? 'calm'
          })
        })
        toast.success('✅ Session completed and logged!')
      } catch (error) {
        console.error('Failed to log session:', error)
      }
    }
  }, [minutes, breathCount, technique, selectedTechnique, currentRound])

  // Phase cycling effect
  useEffect(() => {
    if (!isPlaying || isPaused || !selectedTechnique) return

    const phases = selectedTechnique.phases
    if (!phases || phases.length === 0) return

    let phaseIndex = 0
    let phaseTimer = 0
    
    const cyclePhases = () => {
      const currentPhaseData = phases[phaseIndex]
      setCurrentPhase(currentPhaseData?.name ?? 'Breathe')
      
      // Speak phase if voice enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentPhaseData?.name ?? '')
        utterance.rate = voiceSpeed
        if (selectedVoice) {
          const voice = availableVoices.find(v => v.name === selectedVoice)
          if (voice) utterance.voice = voice
        }
        window.speechSynthesis.speak(utterance)
      }
      
      // Vibrate if enabled
      if (vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate(100)
      }
    }

    // Initial phase
    cyclePhases()
    phaseTimer = phases[0]?.duration ?? 4

    const interval = setInterval(() => {
      phaseTimer--
      if (phaseTimer <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length
        if (phaseIndex === 0) {
          setBreathCount(prev => prev + 1)
          setCurrentRound(prev => prev + 1)
        }
        cyclePhases()
        phaseTimer = phases[phaseIndex]?.duration ?? 4
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, isPaused, selectedTechnique, voiceEnabled, voiceSpeed, selectedVoice, availableVoices, vibrationEnabled])

  // Countdown timer effect
  useEffect(() => {
    if (!isPlaying || isPaused) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleStop()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, isPaused, minutes, breathCount, currentRound, handleStop])

  const handleStart = () => {
    setIsPlaying(true)
    setIsPaused(false)
    setCurrentRound(0)
    setBreathCount(0)
    setTimeLeft(minutes * 60)
    setCurrentPhase('Inhale')
    
    // Start ambient sound
    if (ambience !== 'none') {
      ambientSoundRef.current?.play(ambience)
      ambientSoundRef.current?.setVolume(ambienceVolume)
    }
    
    toast.success('🧘 Session started!')
  }

  const handlePause = () => {
    setIsPaused(true)
    ambientSoundRef.current?.stop()
    toast.info('⏸️ Session paused')
  }

  const handleResume = () => {
    setIsPaused(false)
    if (ambience !== 'none') {
      ambientSoundRef.current?.play(ambience)
      ambientSoundRef.current?.setVolume(ambienceVolume)
    }
    toast.info('▶️ Session resumed')
  }

  const handleReset = () => {
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentRound(0)
    setBreathCount(0)
    setTimeLeft(minutes * 60)
    setCurrentPhase('Ready')
    ambientSoundRef.current?.stop()
    window.speechSynthesis?.cancel()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Full-screen Breathing Session Modal */}
      {activeTechnique && (
        <BreathingSession
          technique={activeTechnique}
          challengeKey={challengeKey}
          onClose={() => closeSession()}
        />
      )}

      <section id="daily-practice" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <h1 className="text-4xl font-bold mb-4">Measured Breathing. Measurable Relief.</h1>
          
          {/* Voice controls row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              onClick={handleStart} 
              disabled={isPlaying}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              size="sm"
            >
              🎧 Start
            </Button>
            <Button 
              onClick={handlePause} 
              disabled={!isPlaying || isPaused}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              size="sm"
            >
              ⏸ Pause
            </Button>
            <Button 
              onClick={handleResume} 
              disabled={!isPaused}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              size="sm"
            >
              ▶ Resume
            </Button>
            <Button 
              onClick={handleStop}
              disabled={!isPlaying}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              size="sm"
            >
              ■ Stop
            </Button>
          </div>

          <p className="text-white/90 mb-4">
            <strong>Measured Breathing. Measurable Relief.</strong> Free, evidence-based techniques with measured progress tracking.
          </p>

          {/* Credibility lines */}
          <div className="space-y-2 mb-4 text-sm text-white/85">
            <div><strong>Informed by experts:</strong> Dr Herbert Benson (Harvard "Relaxation Response") · Dr Andrew Weil (4-7-8 breathing)</div>
            <div><strong>Referenced in public guidance:</strong> NHS (UK) · U.S. Department of Veterans Affairs</div>
            <div><strong>Supported by leading institutions:</strong> Harvard Medical School · Mayo Clinic</div>
          </div>

          {/* Conditions badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/stress" className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-medium hover:bg-white/90 transition-colors">
              Stress & General Anxiety
            </Link>
            <Link href="/anxiety" className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-medium hover:bg-white/90 transition-colors">
              Panic Symptoms
            </Link>
            <Link href="/sleep" className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-medium hover:bg-white/90 transition-colors">
              Sleep-Onset Insomnia
            </Link>
            <Link href="/focus" className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-medium hover:bg-white/90 transition-colors">
              Focus & Test Anxiety
            </Link>
            <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-medium">
              PTSD Regulation*
            </span>
            <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-medium">
              Low Mood & Burnout
            </span>
          </div>
          <p className="text-xs text-white/70 mb-4">* Use alongside professional care where appropriate.</p>

          {/* Primary technique shortcuts - Launch full-screen session */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => {
                launchSession('box')
              }}
              className="bg-green-500 hover:bg-green-600"
              size="sm"
            >
              🟩 Box Breathing
            </Button>
            <Button 
              onClick={() => {
                launchSession('478')
              }}
              className="bg-blue-500 hover:bg-blue-600"
              size="sm"
            >
              🟦 4-7-8 Breathing
            </Button>
            <Button 
              onClick={() => {
                launchSession('coherent')
              }}
              className="bg-purple-500 hover:bg-purple-600"
              size="sm"
            >
              🟪 Coherent 5-5
            </Button>
            <Button 
              onClick={() => {
                launchSession('sos')
              }}
              className="bg-red-500 hover:bg-red-600"
              size="sm"
            >
              🆘 60-second SOS
            </Button>
          </div>

          {/* Split grid: Quickstart / Goals & Duration / Onboarding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Col 1: Quickstart */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-bold mb-2">Start in 60 seconds</h3>
              <p className="text-sm text-white/80 mb-3">Jump straight to a 60-second reset. No scrolling, no sign-in, just relief.</p>
              <div className="space-y-2">
                <Button 
                  onClick={() => launchSession('sos')}
                  className="w-full bg-red-500 hover:bg-red-600"
                  size="sm"
                >
                  🆘 Start SOS-60 now
                </Button>
              </div>
            </div>

            {/* Col 2: Goals + Duration */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-bold mb-2">Pick your goal</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button onClick={() => launchSession('box')} className="text-center py-1 px-2 bg-white/20 hover:bg-white/30 rounded text-xs">Calm</button>
                <button onClick={() => launchSession('478')} className="text-center py-1 px-2 bg-white/20 hover:bg-white/30 rounded text-xs">Sleep</button>
                <button onClick={() => launchSession('coherent')} className="text-center py-1 px-2 bg-white/20 hover:bg-white/30 rounded text-xs">Focus</button>
              </div>
              <p className="text-xs text-white/70 mt-2">Choose a technique and duration in the next screen</p>
            </div>

            {/* Col 3: First-time steps */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="font-bold mb-2">New here? 3 steps</h3>
              <ol className="text-sm space-y-1 mb-3 list-decimal list-inside">
                <li>Enable audio on your device</li>
                <li>Try Box Breathing for 1 minute</li>
                <li>Track your progress automatically</li>
              </ol>
              <Button 
                onClick={() => launchSession('box')}
                className="w-full bg-white/20 hover:bg-white/30 border border-white/30"
                size="sm"
              >
                Try Box Breathing
              </Button>
            </div>
          </div>

          <p className="text-xs text-white/70 mt-4">Educational information only; not medical advice.</p>
        </div>

        {/* Practice Player - Enhanced with Settings, Focus, Ambiance */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          
          {/* Header with View Toggle */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-600 mb-2">Coach guided</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Daily practice in one tap</h2>
              <p className="text-gray-600">
                Choose a breathing pattern, set minutes, add voice narration and ambient sounds. Sessions log automatically.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode(viewMode === 'settings' ? 'main' : 'settings')}
                variant={viewMode === 'settings' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                onClick={() => setFocusModeEnabled(!focusModeEnabled)}
                variant={focusModeEnabled ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
              >
                🎯 Focus
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {viewMode === 'settings' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">⚙️ Session Settings</h3>
                <Button onClick={() => setViewMode('main')} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Voice Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Headphones className="w-4 h-4" /> Voice Guidance
                  </h4>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Enable:</label>
                    <Button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      variant={voiceEnabled ? 'default' : 'outline'}
                      size="sm"
                    >
                      {voiceEnabled ? 'On' : 'Off'}
                    </Button>
                  </div>
                  {voiceEnabled && (
                    <>
                      <div>
                        <label htmlFor="voice-select" className="text-sm text-gray-600 block mb-1">Voice:</label>
                        <select
                          id="voice-select"
                          name="voice-select"
                          title="Select voice for guidance"
                          value={selectedVoice}
                          onChange={(e) => setSelectedVoice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          {availableVoices.map((voice) => (
                            <option key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="voice-speed" className="text-sm text-gray-600 block mb-1">Speed: {voiceSpeed.toFixed(1)}x</label>
                        <input
                          id="voice-speed"
                          name="voice-speed"
                          title="Voice speed"
                          type="range"
                          min="0.5"
                          max="1.5"
                          step="0.1"
                          value={voiceSpeed}
                          onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Ambiance Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Music className="w-4 h-4" /> Ambient Sounds
                  </h4>
                  <div>
                    <label htmlFor="ambience-select" className="text-sm text-gray-600 block mb-1">Sound:</label>
                    <select
                      id="ambience-select"
                      name="ambience-select"
                      title="Select ambient sound"
                      value={ambience}
                      onChange={(e) => {
                        const newAmbience = e.target.value as AmbienceType
                        setAmbience(newAmbience)
                        ambientSoundRef.current?.stop()
                        if (newAmbience !== 'none') {
                          ambientSoundRef.current?.setVolume(ambienceVolume)
                          ambientSoundRef.current?.play(newAmbience)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="none">🔇 None</option>
                      <option value="cosmic">🌌 Cosmic Waves</option>
                      <option value="rain">🌧️ Gentle Rain</option>
                      <option value="ocean">🌊 Ocean Waves</option>
                      <option value="forest">🌲 Forest Ambience</option>
                      <option value="birds">🐦 Bird Songs</option>
                      <option value="tibetan">🔔 Tibetan Bowls</option>
                      <option value="meditation">🧘 Meditation Tones</option>
                      <option value="spiritual">✨ Spiritual Frequencies</option>
                    </select>
                  </div>
                  {ambience !== 'none' && (
                    <div>
                      <label htmlFor="ambience-volume" className="text-sm text-gray-600 block mb-1">Volume: {Math.round(ambienceVolume * 100)}%</label>
                      <input
                        id="ambience-volume"
                        name="ambience-volume"
                        title="Ambience volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={ambienceVolume}
                        onChange={(e) => {
                          const vol = parseFloat(e.target.value)
                          setAmbienceVolume(vol)
                          ambientSoundRef.current?.setVolume(vol)
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      if (ambience !== 'none') {
                        ambientSoundRef.current?.setVolume(ambienceVolume)
                        ambientSoundRef.current?.play(ambience)
                        setTimeout(() => ambientSoundRef.current?.stop(), 3000)
                      }
                    }}
                    variant="outline"
                    size="sm"
                    disabled={ambience === 'none'}
                  >
                    🔊 Preview (3s)
                  </Button>
                </div>

                {/* Other Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">🛠️ Other Options</h4>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Vibration:</label>
                    <Button
                      onClick={() => setVibrationEnabled(!vibrationEnabled)}
                      variant={vibrationEnabled ? 'default' : 'outline'}
                      size="sm"
                    >
                      {vibrationEnabled ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Focus Mode:</label>
                    <Button
                      onClick={() => setFocusModeEnabled(!focusModeEnabled)}
                      variant={focusModeEnabled ? 'default' : 'outline'}
                      size="sm"
                    >
                      {focusModeEnabled ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Focus mode dims the screen and hides distractions</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Technique Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose a technique:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => launchSession('box')}
                className="p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">🟩</span>
                <span className="font-semibold text-gray-900 block">Box Breathing</span>
                <span className="text-xs text-gray-500">4-4-4-4 · Calm & Focus</span>
              </button>
              <button
                onClick={() => launchSession('478')}
                className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">🟦</span>
                <span className="font-semibold text-gray-900 block">4-7-8 Breathing</span>
                <span className="text-xs text-gray-500">Sleep & Deep Relaxation</span>
              </button>
              <button
                onClick={() => launchSession('coherent')}
                className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">🟪</span>
                <span className="font-semibold text-gray-900 block">Coherent 5-5</span>
                <span className="text-xs text-gray-500">Heart Coherence & Balance</span>
              </button>
              <button
                onClick={() => launchSession('sos')}
                className="p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">🆘</span>
                <span className="font-semibold text-gray-900 block">60-second SOS</span>
                <span className="text-xs text-gray-500">Quick Panic Reset</span>
              </button>
            </div>
          </div>

          {/* Inline Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label htmlFor="technique" className="block text-sm font-medium text-gray-700 mb-2">Technique</label>
              <select
                id="technique"
                name="technique"
                value={technique}
                onChange={(e) => setTechnique(e?.target?.value ?? 'box-breathing')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isPlaying}
              >
                <optgroup label="Calm & Focus">
                  <option value="box-breathing">🟩 Box Breathing · 4-4-4-4</option>
                  <option value="triangle">🔺 Triangle · 4-4-4</option>
                  <option value="physiological-sigh">😮‍💨 Double Inhale Sigh</option>
                </optgroup>
                <optgroup label="Sleep & Relaxation">
                  <option value="4-7-8">🟦 4-7-8 Reset</option>
                  <option value="relaxing">🌙 Relaxing · 4-2-6</option>
                </optgroup>
                <optgroup label="Focus & Balance">
                  <option value="coherent">🟪 Coherent Breathing · 5-5</option>
                </optgroup>
                <optgroup label="Energy & Alertness">
                  <option value="energizing">⚡ Energizing · 4-0-2</option>
                  <option value="wim-hof">🧊 Power Breathing</option>
                </optgroup>
                <optgroup label="Emergency Reset">
                  <option value="sos">🆘 SOS Reset · 60s</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="flex items-center gap-4">
                <input
                  id="minutes"
                  name="minutes"
                  type="range"
                  min="1"
                  max="10"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e?.target?.value ?? 3))}
                  className="flex-1"
                  disabled={isPlaying}
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[4rem]">{minutes} min</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Settings</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  variant={voiceEnabled ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1"
                >
                  {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  Voice
                </Button>
                <Button
                  onClick={() => setViewMode('settings')}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Music className="w-3 h-3" />
                  Sound
                </Button>
              </div>
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Round</p>
              <p className="text-2xl font-bold text-gray-900">{currentRound}/{totalRounds}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Breaths</p>
              <p className="text-2xl font-bold text-gray-900">{breathCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Time left</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(timeLeft)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Ambiance</p>
              <p className="text-lg font-bold text-gray-900">{ambience === 'none' ? '🔇' : ambience === 'cosmic' ? '🌌' : ambience === 'rain' ? '🌧️' : ambience === 'ocean' ? '🌊' : ambience === 'forest' ? '🌲' : ambience === 'birds' ? '🐦' : ambience === 'tibetan' ? '🔔' : ambience === 'meditation' ? '🧘' : '✨'}</p>
            </div>
          </div>

          {/* Breathing Diagram */}
          <div className={`rounded-xl p-8 mb-8 transition-all ${focusModeEnabled ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
            <div className={`aspect-square max-w-xs mx-auto rounded-full flex items-center justify-center shadow-lg transition-all ${focusModeEnabled ? 'bg-gray-800 border-2 border-purple-500' : 'bg-white'}`}>
              <p className={`text-2xl font-semibold ${focusModeEnabled ? 'text-white' : 'text-gray-900'}`}>{currentPhase}</p>
            </div>
            {focusModeEnabled && (
              <p className="text-center text-purple-400 text-sm mt-4">Focus Mode Active</p>
            )}
          </div>

          {/* Phase Breakdown */}
          {selectedTechnique && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {selectedTechnique?.phases?.map((phase, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                  <span
                    className="w-3 h-3 rounded-full"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-600">
                    {phase?.name ?? ''} ({phase?.duration ?? 0}s)
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            {!isPlaying ? (
              <Button onClick={handleStart} size="lg" className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Play className="w-4 h-4" /> Start Session
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={handlePause} size="lg" variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" /> Pause
                  </Button>
                ) : (
                  <Button onClick={handleResume} size="lg" className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Play className="w-4 h-4" /> Resume
                  </Button>
                )}
                <Button onClick={handleStop} size="lg" variant="outline" className="gap-2">
                  <Square className="w-4 h-4" /> Stop
                </Button>
                <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
              </>
            )}
            <Button
              onClick={() => setViewMode('settings')}
              size="lg"
              variant="ghost"
              className="gap-2"
            >
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </div>

          {/* Active Features Indicator */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {voiceEnabled && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                🎙️ Voice On
              </span>
            )}
            {ambience !== 'none' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                🎵 {ambience.charAt(0).toUpperCase() + ambience.slice(1)} Ambiance
              </span>
            )}
            {focusModeEnabled && (
              <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-medium">
                🎯 Focus Mode
              </span>
            )}
            {vibrationEnabled && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                📳 Vibration On
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
