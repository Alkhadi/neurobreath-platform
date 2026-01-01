'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sprout, Trophy, TrendingUp, Star, Sparkles, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// Plant stages with enhanced visuals
const PLANT_STAGES = {
  seed: { emoji: '🌱', name: 'Seed', water: 0, color: 'text-amber-600' },
  sprout: { emoji: '🌿', name: 'Sprout', water: 1, color: 'text-green-500' },
  bud: { emoji: '🌷', name: 'Bud', water: 2, color: 'text-pink-500' },
  bloom: { emoji: '🌸', name: 'Bloom', water: 3, color: 'text-purple-500' }
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
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationText, setCelebrationText] = useState('')

  // Load from localStorage
  useEffect(() => {
    const savedGarden = localStorage.getItem('focus-garden')
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
      localStorage.setItem('focus-garden', JSON.stringify({ garden, xp, level }))
    }
  }, [garden, xp, level])

  const celebrate = (text: string) => {
    setCelebrationText(text)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }

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
    celebrate('🌱 Task planted! Water it to help it grow.')
  }

  const waterPlant = (plantId: string) => {
    setGarden(garden.map(plant => {
      if (plant.id === plantId && plant.stage !== 'bloom') {
        const newWaterCount = plant.waterCount + 1
        let newStage: keyof typeof PLANT_STAGES = plant.stage
        
        if (newWaterCount === 1) newStage = 'sprout'
        else if (newWaterCount === 2) newStage = 'bud'
        else if (newWaterCount === 3) newStage = 'bloom'
        
        if (newStage === 'bloom') {
          celebrate('🌸 Plant bloomed! Ready to harvest!')
        }
        
        return { ...plant, waterCount: newWaterCount, stage: newStage }
      }
      return plant
    }))
    
    // Award XP
    setXp(prev => {
      const newXp = prev + 10
      if (newXp >= level * 100) {
        setLevel(l => l + 1)
        celebrate(`🎉 Level Up! You're now Level ${level + 1}!`)
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
      celebrate('🎉 Harvest complete! +50 XP earned!')
    }
  }

  const getTaskInfo = (taskId: string, layerKey: string) => {
    const layer = TASK_LAYERS[layerKey as keyof typeof TASK_LAYERS]
    return layer?.tasks.find(t => t.id === taskId)
  }

  const isTaskPlanted = (taskId: string) => {
    return garden.some(p => p.taskId === taskId)
  }

  const currentLayer = TASK_LAYERS[selectedLayer as keyof typeof TASK_LAYERS]
  const xpPercentage = Math.min(100, (xp / (level * 100)) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Celebration Toast */}
      {showCelebration && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-green-200 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <p className="font-semibold text-slate-900">{celebrationText}</p>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
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
                    <span><strong>Choose a task</strong> from five categories (Structure, Communication, Zones, Self-Management, Mindfulness)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">2.</span>
                    <span><strong>Plant it</strong> in your garden as a seed 🌱</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">3.</span>
                    <span><strong>Water daily</strong> by completing the task - watch it grow through 4 stages!</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600 min-w-[24px]">4.</span>
                    <span><strong>Harvest blooms</strong> 🌸 to earn bonus XP and level up!</span>
                  </li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-sm"><strong className="text-green-700">💡 Pro Tip:</strong> Start with gentle tasks like "Zone Check-In" or "Morning Routine"</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-sm"><strong className="text-purple-700">🎯 Goal:</strong> Complete 3 tasks daily for steady progress</p>
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

      <div className="w-[96%] max-w-[2000px] mx-auto py-8 px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 hover:bg-white/80">
          <Link href="/breathing/breath" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> 
            <span>Back to Breathing Guides</span>
          </Link>
        </Button>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                    🌱
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-1">Focus Garden</h1>
                    <p className="text-green-100 text-lg">Focus Training Hub</p>
                  </div>
                </div>
                <p className="text-lg text-green-50 leading-relaxed max-w-3xl">
                  A calming, supportive space to grow focus through gentle plant-based tasks. Build skills in structure, 
                  communication, emotional regulation, and mindfulness.
                </p>
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

          {/* Stats Dashboard */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-600">Level</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{level}</p>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-slate-600">Total XP</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{xp + (level - 1) * 100}</p>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-600">Plants</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{garden.length}</p>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-600">Progress</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{Math.round(xpPercentage)}%</p>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Level {level} Progress</span>
                <span className="text-sm font-medium text-slate-600">{xp} / {level * 100} XP</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${xpPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar: Task Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                  📚
                </div>
                Categories
              </h2>
              <div className="space-y-3">
                {Object.entries(TASK_LAYERS).map(([key, layer]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedLayer(key)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 group",
                      selectedLayer === key
                        ? `bg-gradient-to-r ${layer.bgGradient} ${layer.borderColor} shadow-md scale-[1.02]`
                        : `bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm`
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110",
                        selectedLayer === key ? layer.iconBg : 'bg-slate-200'
                      )}>
                        {layer.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900 block">{layer.name}</span>
                        <span className="text-xs text-slate-600">{layer.tasks.length} tasks</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
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
                        onClick={() => plantTask(task.id, selectedLayer)}
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
                            <span className="mr-2">✓</span> Already Planted
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
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl">
                    🌿
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Your Garden</h2>
                    <p className="text-slate-600">Water your plants daily to help them bloom</p>
                  </div>
                </div>
                {garden.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Growing</p>
                    <p className="text-2xl font-bold text-slate-900">{garden.length} plant{garden.length !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>

              {garden.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
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
                  {garden.map(plant => {
                    const task = getTaskInfo(plant.taskId, plant.layer)
                    const stageInfo = PLANT_STAGES[plant.stage]
                    const canWater = plant.stage !== 'bloom'
                    const canHarvest = plant.stage === 'bloom'
                    const layerInfo = TASK_LAYERS[plant.layer as keyof typeof TASK_LAYERS]

                    return (
                      <div
                        key={plant.id}
                        className={cn(
                          "group p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]",
                          `bg-gradient-to-br ${layerInfo.bgGradient} ${layerInfo.borderColor}`
                        )}
                      >
                        <div className="text-center mb-4">
                          <div className={cn(
                            "text-7xl mb-3 transition-transform group-hover:scale-110",
                            stageInfo.color
                          )}>
                            {stageInfo.emoji}
                          </div>
                          <div className="inline-block px-3 py-1 bg-white/80 rounded-full mb-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              {stageInfo.name}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-900 text-center mb-1 text-sm">
                          {task?.title || 'Unknown Task'}
                        </h4>
                        <p className="text-xs text-slate-600 text-center mb-4">
                          {layerInfo.name}
                        </p>

                        <div className="space-y-2">
                          {canWater && (
                            <Button
                              onClick={() => waterPlant(plant.id)}
                              size="sm"
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              💧 Water ({plant.waterCount}/3)
                            </Button>
                          )}
                          {canHarvest && (
                            <Button
                              onClick={() => harvestPlant(plant.id)}
                              size="sm"
                              className={cn(
                                "w-full text-white",
                                `bg-gradient-to-r ${layerInfo.gradient} hover:shadow-lg`
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
                                i < plant.waterCount
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

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-blue-200 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Focus Garden Tips</h3>
                  <p className="text-slate-600">Master each category to become a well-rounded focus champion</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📋</span>
                    <strong className="text-slate-900">Structure</strong>
                  </div>
                  <p className="text-sm text-slate-700">Build predictable routines and visual supports for daily success</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💬</span>
                    <strong className="text-slate-900">Communication</strong>
                  </div>
                  <p className="text-sm text-slate-700">Practice expressing needs and navigating social interactions</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🌈</span>
                    <strong className="text-slate-900">Zones</strong>
                  </div>
                  <p className="text-sm text-slate-700">Learn to recognize and regulate emotional states effectively</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🧭</span>
                    <strong className="text-slate-900">Self-Management</strong>
                  </div>
                  <p className="text-sm text-slate-700">Develop independence and problem-solving skills for life</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-pink-200 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🦋</span>
                    <strong className="text-slate-900">Mindfulness & Calm</strong>
                  </div>
                  <p className="text-sm text-slate-700">Build awareness and find inner peace through gentle practices</p>
                </div>
              </div>
            </div>

            {/* Related Tools & Resources */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-xl">
                  🔗
                </div>
                Explore More Tools
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Breathing Techniques */}
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
                  href="/breathing/mindfulness"
                  className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🧘</span>
                    <h4 className="font-bold text-slate-900 group-hover:text-purple-700">Mindfulness</h4>
                  </div>
                  <p className="text-sm text-slate-600">Guided mindfulness and meditation practices</p>
                </Link>

                <Link 
                  href="/techniques/sos"
                  className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🆘</span>
                    <h4 className="font-bold text-slate-900 group-hover:text-red-700">60-Second SOS</h4>
                  </div>
                  <p className="text-sm text-slate-600">Quick emergency calm-down breathing</p>
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

                <Link 
                  href="/tools/focus-tiles"
                  className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🧩</span>
                    <h4 className="font-bold text-slate-900 group-hover:text-amber-700">Focus Tiles</h4>
                  </div>
                  <p className="text-sm text-slate-600">Interactive focus training exercises</p>
                </Link>
              </div>

              {/* Homepage Link */}
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
      </div>
    </div>
  )
}

