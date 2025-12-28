'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Play, Pause, Square, Volume2 } from 'lucide-react'
import { getTechniqueById } from '@/lib/breathing-data'

interface BeginSessionModalProps {
  isOpen: boolean
  onClose: () => void
}

type View = 'picker' | 'session'
type Phase = 'inhale' | 'hold' | 'exhale' | 'ready'

export function BeginSessionModal({ isOpen, onClose }: BeginSessionModalProps) {
  const [view, setView] = useState<View>('picker')
  const [selectedDuration, setSelectedDuration] = useState<number>(1)
  const [selectedTechnique, setSelectedTechnique] = useState<string>('4-7-8')
  const [selectedVoice, setSelectedVoice] = useState<string>('british-male')
  const voiceEnabled = true
  
  // Session state
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<Phase>('ready')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setView('picker')
      setIsPlaying(false)
      setPhase('ready')
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isOpen])

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
    
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
    utteranceRef.current = utterance
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
    const totalSeconds = selectedDuration * 60
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
                <select
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
              <div
                className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.max(0, Math.min(100, progressPercentage))}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Session progress"
              >
                {/* Inline style is necessary for dynamic progress width */}
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
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
