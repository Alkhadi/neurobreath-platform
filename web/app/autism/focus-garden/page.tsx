'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sprout } from 'lucide-react'

// Plant stages
const PLANT_STAGES = {
  seed: { emoji: '🌱', name: 'Seed', water: 0 },
  sprout: { emoji: '🌿', name: 'Sprout', water: 1 },
  bud: { emoji: '🌷', name: 'Bud', water: 2 },
  bloom: { emoji: '🌸', name: 'Bloom', water: 3 }
}

// Task layers for autism
const TASK_LAYERS = {
  structure: {
    name: 'Structure',
    icon: '📋',
    color: 'bg-green-100 border-green-300',
    tasks: [
      { id: 'morning-routine', title: 'Morning Routine', description: 'Complete your morning steps', icon: '🌅' },
      { id: 'visual-schedule', title: 'Visual Schedule', description: 'Follow your visual schedule today', icon: '📅' },
      { id: 'transition-timer', title: 'Transition Timer', description: 'Use a timer for activity changes', icon: '⏰' }
    ]
  },
  communication: {
    name: 'Communication',
    icon: '💬',
    color: 'bg-blue-100 border-blue-300',
    tasks: [
      { id: 'request-help', title: 'Ask for Help', description: 'Use words or symbols to ask for help', icon: '🙋' },
      { id: 'greet-someone', title: 'Greeting Practice', description: 'Say hello to someone new', icon: '👋' },
      { id: 'express-feeling', title: 'Express a Feeling', description: 'Tell someone how you feel', icon: '💗' }
    ]
  },
  zones: {
    name: 'Zones',
    icon: '🌈',
    color: 'bg-purple-100 border-purple-300',
    tasks: [
      { id: 'zone-check', title: 'Zone Check-In', description: 'Identify your current zone', icon: '🎯' },
      { id: 'calm-tool', title: 'Use a Calm Tool', description: 'Use a tool to get to green zone', icon: '🧘' },
      { id: 'energy-boost', title: 'Energy Boost', description: 'Use a tool to increase energy', icon: '⚡' }
    ]
  },
  selfMgmt: {
    name: 'Self-Management',
    icon: '🧭',
    color: 'bg-amber-100 border-amber-300',
    tasks: [
      { id: 'set-goal', title: 'Set a Small Goal', description: 'Set and complete a small goal', icon: '🎯' },
      { id: 'problem-solve', title: 'Problem Solving', description: 'Use steps to solve a problem', icon: '🔧' },
      { id: 'take-break', title: 'Planned Break', description: 'Take a break when you need it', icon: '☕' }
    ]
  },
  anxiety: {
    name: 'Anxiety & Coaching',
    icon: '🦋',
    color: 'bg-pink-100 border-pink-300',
    tasks: [
      { id: 'brave-step', title: 'Brave Step', description: 'Take one small brave step', icon: '👣' },
      { id: 'worry-time', title: 'Worry Time', description: 'Use scheduled worry time', icon: '⏳' },
      { id: 'calm-breathing', title: 'Calm Breathing', description: 'Practice calming breaths', icon: '🌬️' }
    ]
  }
}

interface Plant {
  id: string
  taskId: string
  stage: keyof typeof PLANT_STAGES
  waterCount: number
  layer: string
  plantedAt: Date
}

export default function FocusGardenPage() {
  const [selectedLayer, setSelectedLayer] = useState<string>('structure')
  const [garden, setGarden] = useState<Plant[]>([])
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [showTutorial, setShowTutorial] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const savedGarden = localStorage.getItem('autism-focus-garden')
    if (savedGarden) {
      const data = JSON.parse(savedGarden)
      setGarden(data.garden || [])
      setXp(data.xp || 0)
      setLevel(data.level || 1)
    } else {
      setShowTutorial(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (garden.length > 0 || xp > 0) {
      localStorage.setItem('autism-focus-garden', JSON.stringify({ garden, xp, level }))
    }
  }, [garden, xp, level])

  const plantTask = (taskId: string, layer: string) => {
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      taskId,
      stage: 'seed',
      waterCount: 0,
      layer,
      plantedAt: new Date()
    }
    setGarden([...garden, newPlant])
  }

  const waterPlant = (plantId: string) => {
    setGarden(garden.map(plant => {
      if (plant.id === plantId && plant.stage !== 'bloom') {
        const newWaterCount = plant.waterCount + 1
        let newStage: keyof typeof PLANT_STAGES = plant.stage
        
        if (newWaterCount === 1) newStage = 'sprout'
        else if (newWaterCount === 2) newStage = 'bud'
        else if (newWaterCount === 3) newStage = 'bloom'
        
        return { ...plant, waterCount: newWaterCount, stage: newStage }
      }
      return plant
    }))
    
    // Award XP
    setXp(prev => {
      const newXp = prev + 10
      if (newXp >= level * 100) {
        setLevel(l => l + 1)
        return newXp - (level * 100)
      }
      return newXp
    })
  }

  const harvestPlant = (plantId: string) => {
    const plant = garden.find(p => p.id === plantId)
    if (plant && plant.stage === 'bloom') {
      setGarden(garden.filter(p => p.id !== plantId))
      setXp(prev => prev + 50)
      // Show celebration animation (could be enhanced)
      alert('🎉 Harvest complete! +50 XP')
    }
  }

  const getTaskInfo = (taskId: string, layerKey: string) => {
    const layer = TASK_LAYERS[layerKey as keyof typeof TASK_LAYERS]
    return layer?.tasks.find(t => t.id === taskId)
  }

  const isTaskPlanted = (taskId: string) => {
    return garden.some(p => p.taskId === taskId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/autism">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Autism Hub
          </Link>
        </Button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🌱 Focus Garden – Autism Condition Hub
              </h1>
              <p className="text-lg text-gray-600">
                A calming, supportive space for neurodivergent individuals to grow focus through gentle plant-based tasks.
              </p>
            </div>
            <Button onClick={() => setShowTutorial(true)} variant="outline">
              How it Works
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Level {level}</span>
              <span className="text-sm text-gray-600">{xp} / {level * 100} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              {/* eslint-disable-next-line react/forbid-dom-props */}
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (xp / (level * 100)) * 100)}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Welcome to Focus Garden! 🌱</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  <strong>How it works:</strong>
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Choose a task</strong> from one of the five categories (Structure, Communication, Zones, Self-Management, or Anxiety)</li>
                  <li><strong>Plant the task</strong> in your garden as a seed 🌱</li>
                  <li><strong>Water your plant</strong> by completing the task - each completion makes it grow!</li>
                  <li><strong>Watch it bloom</strong> through stages: Seed 🌱 → Sprout 🌿 → Bud 🌷 → Bloom 🌸</li>
                  <li><strong>Harvest your bloom</strong> when fully grown to earn bonus XP and start again!</li>
                </ol>
                <p className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  💡 <strong>Tip:</strong> Start with gentle tasks like "Morning Routine" or "Zone Check-In" to build confidence!
                </p>
              </div>
              <Button onClick={() => setShowTutorial(false)} className="mt-6 w-full" size="lg">
                Let's Grow! 🌱
              </Button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Task Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Categories</h2>
              <div className="space-y-2">
                {Object.entries(TASK_LAYERS).map(([key, layer]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedLayer(key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedLayer === key
                        ? `${layer.color} shadow-md`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{layer.icon}</span>
                      <span className="font-semibold text-gray-900">{layer.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Your Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plants Growing:</span>
                    <span className="font-semibold text-gray-900">{garden.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-semibold text-gray-900">{level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total XP:</span>
                    <span className="font-semibold text-gray-900">{xp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle & Right: Available Tasks and Garden */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {TASK_LAYERS[selectedLayer as keyof typeof TASK_LAYERS]?.icon}{' '}
                {TASK_LAYERS[selectedLayer as keyof typeof TASK_LAYERS]?.name} Tasks
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {TASK_LAYERS[selectedLayer as keyof typeof TASK_LAYERS]?.tasks.map(task => {
                  const isPlanted = isTaskPlanted(task.id)
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border-2 ${
                        isPlanted
                          ? 'bg-gray-50 border-gray-300'
                          : `${TASK_LAYERS[selectedLayer as keyof typeof TASK_LAYERS].color} hover:shadow-md transition-shadow`
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-3xl">{task.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => plantTask(task.id, selectedLayer)}
                        disabled={isPlanted}
                        size="sm"
                        className="w-full mt-2"
                        variant={isPlanted ? 'secondary' : 'default'}
                      >
                        {isPlanted ? '✓ Planted' : '🌱 Plant Task'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Garden */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌿 Your Garden</h2>
              {garden.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Sprout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your garden is empty. Plant a task to get started!</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {garden.map(plant => {
                    const task = getTaskInfo(plant.taskId, plant.layer)
                    const stageInfo = PLANT_STAGES[plant.stage]
                    const canWater = plant.stage !== 'bloom'
                    const canHarvest = plant.stage === 'bloom'

                    return (
                      <div
                        key={plant.id}
                        className="p-4 rounded-xl border-2 bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
                      >
                        <div className="text-center mb-3">
                          <div className="text-6xl mb-2">{stageInfo.emoji}</div>
                          <div className="text-xs font-semibold text-gray-600 uppercase">
                            {stageInfo.name}
                          </div>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 text-center mb-2">
                          {task?.title || 'Unknown Task'}
                        </h4>
                        <div className="flex gap-2">
                          {canWater && (
                            <Button
                              onClick={() => waterPlant(plant.id)}
                              size="sm"
                              className="flex-1"
                              variant="outline"
                            >
                              💧 Water
                            </Button>
                          )}
                          {canHarvest && (
                            <Button
                              onClick={() => harvestPlant(plant.id)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500"
                            >
                              🎉 Harvest
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-center text-gray-500">
                          Waters: {plant.waterCount}/3
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">💡 Focus Garden Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Structure:</strong> Build predictable routines and visual supports</li>
            <li>• <strong>Communication:</strong> Practice expressing needs and social interactions</li>
            <li>• <strong>Zones:</strong> Learn to recognize and regulate emotional states</li>
            <li>• <strong>Self-Management:</strong> Develop independence and problem-solving skills</li>
            <li>• <strong>Anxiety & Coaching:</strong> Build confidence through small, brave steps</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
