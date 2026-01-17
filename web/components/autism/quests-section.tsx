'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAutismProgress } from '@/hooks/useAutismProgress'

const QUESTS = [
  {
    id: 'now-next-builder',
    title: 'Now/Next Board Builder',
    description: 'Create and print a personalized Now/Next visual support',
    icon: '📋',
    xp: 10,
    href: '#quest-now-next'
  },
  {
    id: 'transition-timer',
    title: 'Transition Timer Script',
    description: 'Generate a transition warning script you can use',
    icon: '⏰',
    xp: 10,
    href: '#quest-transition'
  },
  {
    id: 'sensory-detective',
    title: 'Sensory Detective',
    description: 'Quick checklist to create a sensory support plan',
    icon: '🔍',
    xp: 15,
    href: '#quest-sensory'
  },
  {
    id: 'calm-corner-kit',
    title: 'Calm Corner Kit Builder',
    description: 'Design your own calm corner with evidence-based items',
    icon: '🛋️',
    xp: 15,
    href: '#quest-calm-corner'
  },
  {
    id: 'communication-choice',
    title: 'Communication Choice Challenge',
    description: 'Learn to offer choices using AAC/PECS principles',
    icon: '💬',
    xp: 10,
    href: '#quest-communication'
  },
  {
    id: 'emotion-thermometer',
    title: 'Emotion Thermometer + Coping Menu',
    description: 'Build a visual emotion scale with coping strategies',
    icon: '🌡️',
    xp: 15,
    href: '#quest-emotion'
  },
  {
    id: 'workplace-adjustments',
    title: 'Workplace Adjustments Generator',
    description: 'Create a reasonable adjustments checklist (for employers/adults)',
    icon: '💼',
    xp: 20,
    href: '#quest-workplace'
  }
]

export function QuestsSection() {
  const { logSession } = useAutismProgress()

  const handleQuestStart = (questId: string, xp: number) => {
    logSession(Math.ceil(xp / 2), questId)
  }

  return (
    <section id="quests" className="scroll-mt-24 py-16 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-purple-700">Practice tools</p>
          <h2 className="text-3xl font-bold text-gray-900">Interactive quests</h2>
          <p className="text-gray-600">Short, practical builders that turn strategies into something you can use.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUESTS.map(quest => (
            <Card key={quest.id} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3" aria-hidden="true">{quest.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{quest.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{quest.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  +{quest.xp} XP
                </span>
                <Button
                  size="sm"
                  onClick={() => handleQuestStart(quest.id, quest.xp)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-xl border bg-white/70 backdrop-blur p-4 text-sm text-gray-700">
          <p className="font-medium text-gray-900">What you’ll get</p>
          <p className="mt-1 text-gray-600">
            Each quest is designed to become a printable/shareable resource. For now, starting a quest logs practice locally
            and helps you build a streak.
          </p>
        </div>
      </div>
    </section>
  )
}

