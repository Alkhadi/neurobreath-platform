'use client'

import Link from 'next/link'
import { Sparkles, Layers, Shuffle, Grid } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ToolsLab() {
  return (
    <section id="play-lab" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Playful Breathing Lab</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gamified tools keep things interesting without overwhelming your nervous system. Use them as gentle prompts, not prescriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breath Ladder */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Breath Ladder</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Climb from 3-3-3-3 to 5-5-5-5 over a few rounds. Each rung nudges lung capacity and confidence.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/tools/breath-ladder">Try Breath Ladder</Link>
            </Button>
          </div>

          {/* Colour-Path Breathing */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Colour-Path Breathing</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Follow the color trail as it lights up each breathing phase. Visual cues help anchor attention.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/tools/colour-path">Try Colour-Path</Link>
            </Button>
          </div>

          {/* Micro-Reset Roulette */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Shuffle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Micro-Reset Roulette</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Spin the wheel for a random 1-minute breathing reset. Perfect for decision fatigue.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/tools/roulette">Spin the Wheel</Link>
            </Button>
          </div>

          {/* Focus Tiles */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Focus Tiles</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Context-based breathing suggestions for school, work, home, or social situations.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/tools/focus-tiles">Explore Focus Tiles</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
