import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Layers, Sparkles, Shuffle, Grid } from 'lucide-react'

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breathing Tools</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive breathing exercises and gamified tools to keep your practice engaging and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Breath Ladder */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Breath Ladder</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Progressively increase your breathing capacity by climbing from 3-3-3-3 to 5-5-5-5. 
              Each rung builds lung capacity and confidence with structured progression.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Start at your comfortable level</li>
              <li>Progress gradually through 5 rungs</li>
              <li>Track your advancement</li>
              <li>Build sustainable capacity</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/tools/breath-ladder">Try Breath Ladder</Link>
            </Button>
          </div>

          {/* Colour-Path Breathing */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Colour-Path Breathing</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Follow the illuminated color path through each breathing phase. Visual cues anchor attention 
              and make timing intuitive for visual learners.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Color-coded breathing phases</li>
              <li>Visual timing guidance</li>
              <li>Perfect for visual processors</li>
              <li>Reduces cognitive load</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/tools/colour-path">Try Colour-Path</Link>
            </Button>
          </div>

          {/* Micro-Reset Roulette */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Shuffle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Micro-Reset Roulette</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Can't decide which technique to use? Spin the wheel for a random 1-minute breathing reset. 
              Perfect for decision fatigue and spontaneous practice.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Random technique selection</li>
              <li>1-minute quick resets</li>
              <li>Reduces decision paralysis</li>
              <li>Keeps practice varied</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/tools/roulette">Spin the Wheel</Link>
            </Button>
          </div>

          {/* Focus Tiles */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Focus Tiles</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Context-based breathing suggestions for different situations: school, work, home, or social. 
              Get the right technique for the right moment.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Situation-specific techniques</li>
              <li>Quick recommendations</li>
              <li>Context-aware guidance</li>
              <li>Practical application</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/tools/focus-tiles">Explore Focus Tiles</Link>
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
