'use client'

import Link from 'next/link'
import { Layers, Sparkles, Shuffle, Grid, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HomeCardGrid from './home-card-grid'
import { cardClass } from '@/lib/ui'

// Hoisted outside component to satisfy react/require-constant
const tools = [
  {
    id: 'breath-ladder',
    name: 'Breath Ladder',
    description: 'Climb from 3-3-3-3 to 5-5-5-5 over a few rounds. Each rung nudges lung capacity and confidence.',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    href: '/tools/breath-ladder'
  },
  {
    id: 'colour-path',
    name: 'Colour-Path Breathing',
    description: 'Follow the colour trail as it lights up each breathing phase. Visual cues help anchor attention.',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    href: '/tools/colour-path'
  },
  {
    id: 'micro-reset',
    name: 'Micro-Reset Roulette',
    description: 'Spin the wheel for a random 1-minute breathing reset. Perfect for decision fatigue.',
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
    href: '/tools/roulette'
  },
  {
    id: 'focus-tiles',
    name: 'Focus Tiles',
    description: 'Context-based breathing suggestions for school, work, home, or social situations.',
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    href: '/tools/focus-tiles'
  }
]

const toolIcons = {
  'breath-ladder': <Layers className="w-6 h-6 text-white" />,
  'colour-path': <Sparkles className="w-6 h-6 text-white" />,
  'micro-reset': <Shuffle className="w-6 h-6 text-white" />,
  'focus-tiles': <Grid className="w-6 h-6 text-white" />,
} as const

export default function ToolsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#0B1220] dark:to-[#0F172A]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Interactive Tools
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Gamified tools keep things interesting without overwhelming your nervous system.
            Use them as gentle prompts, not prescriptions.
          </p>
        </div>

        <HomeCardGrid>
          {tools.map((tool) => (
            <div key={tool.id} className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center shadow-md`}>
                  {toolIcons[tool.id as keyof typeof toolIcons]}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {tool.description}
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full group rounded-2xl py-3.5 text-base font-semibold border-slate-200 dark:border-slate-600 hover:border-[#4ECDC4] hover:text-[#4ECDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300"
              >
                <Link href={tool.href} className="flex items-center justify-center gap-2">
                  Try {tool.name}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ))}
        </HomeCardGrid>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Gentle Gamification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              These tools add variety without pressure. No leaderboards, no competition —
              just different ways to explore your breathing practice at your own pace.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
