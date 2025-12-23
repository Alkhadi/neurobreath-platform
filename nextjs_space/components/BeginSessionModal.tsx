'use client'

import { useState } from 'react'
import { X, Play, Clock, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface BeginSessionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BeginSessionModal({ isOpen, onClose }: BeginSessionModalProps) {
  const router = useRouter()
  const [selectedDuration, setSelectedDuration] = useState<number>(2)
  const [selectedTechnique, setSelectedTechnique] = useState<string>('box-breathing')

  if (!isOpen) return null

  const durations = [
    { value: 1, label: '1 min', points: 10 },
    { value: 2, label: '2 min', points: 25 },
    { value: 5, label: '5 min', points: 50 },
    { value: 10, label: '10 min', points: 100 }
  ]

  const techniques = [
    { id: 'box-breathing', name: 'Box Breathing', emoji: '🟩', path: '/techniques/box-breathing', desc: 'Equal counts (4-4-4-4)' },
    { id: '4-7-8', name: '4-7-8 Breathing', emoji: '🟦', path: '/techniques/4-7-8', desc: 'Calming exhale focus' },
    { id: 'coherent', name: 'Coherent 5-5', emoji: '🟪', path: '/techniques/coherent', desc: 'Heart-rate variability' },
    { id: 'sos', name: '60-second SOS', emoji: '🆘', path: '/techniques/sos', desc: 'Quick panic relief' }
  ]

  const handleStart = () => {
    const technique = techniques.find(t => t.id === selectedTechnique)
    if (technique) {
      router.push(`${technique.path}?duration=${selectedDuration}`)
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-white rounded-xl shadow-2xl z-[9999] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-start-title"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 id="quick-start-title" className="text-2xl font-bold text-gray-900">
                🚀 Quick Start Session
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose your breathing technique and duration
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Duration Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Clock size={16} className="inline mr-2" />
              Select Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedDuration === duration.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-bold text-gray-900">{duration.label}</div>
                  <div className="text-xs text-gray-500 mt-1">+{duration.points} pts</div>
                </button>
              ))}
            </div>
          </div>

          {/* Technique Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Heart size={16} className="inline mr-2" />
              Choose Technique
            </label>
            <div className="space-y-3">
              {techniques.map((technique) => (
                <button
                  key={technique.id}
                  onClick={() => setSelectedTechnique(technique.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTechnique === technique.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{technique.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{technique.name}</div>
                        <div className="text-sm text-gray-500">{technique.desc}</div>
                      </div>
                    </div>
                    {selectedTechnique === technique.id && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <Sparkles size={16} className="inline mr-1" />
              Earn{' '}
              <span className="font-semibold text-blue-600">
                {durations.find(d => d.value === selectedDuration)?.points || 0} points
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
              >
                <Play size={16} className="mr-2" />
                Start Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
