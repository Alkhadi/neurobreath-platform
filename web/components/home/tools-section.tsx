'use client'

import Link from 'next/link'
import { Layers, Sparkles, Shuffle, Grid, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HomeCardGrid from './home-card-grid'

export default function ToolsSection() {
  const tools = [
    {
      id: 'breath-ladder',
      name: 'Breath Ladder',
      description: 'Climb from 3-3-3-3 to 5-5-5-5 over a few rounds. Each rung nudges lung capacity and confidence.',
      icon: <Layers className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      href: '/tools/breath-ladder'
    },
    {
      id: 'colour-path',
      name: 'Colour-Path Breathing',
      description: 'Follow the colour trail as it lights up each breathing phase. Visual cues help anchor attention.',
      icon: <Sparkles className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      href: '/tools/colour-path'
    },
    {
      id: 'micro-reset',
      name: 'Micro-Reset Roulette',
      description: 'Spin the wheel for a random 1-minute breathing reset. Perfect for decision fatigue.',
      icon: <Shuffle className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      href: '/tools/roulette'
    },
    {
      id: 'focus-tiles',
      name: 'Focus Tiles',
      description: 'Context-based breathing suggestions for school, work, home, or social situations.',
      icon: <Grid className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-500',
      href: '/tools/focus-tiles'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Interactive Tools
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Gamified tools keep things interesting without overwhelming your nervous system. 
            Use them as gentle prompts, not prescriptions.
          </p>
        </div>

        <HomeCardGrid>
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center shadow-md`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{tool.name}</h3>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {tool.description}
              </p>
              <Button asChild variant="outline" className="w-full group">
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
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <h3 className="font-semibold text-slate-900 mb-2">Gentle Gamification</h3>
            <p className="text-sm text-slate-600">
              These tools add variety without pressure. No leaderboards, no competition — 
              just different ways to explore your breathing practice at your own pace.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
