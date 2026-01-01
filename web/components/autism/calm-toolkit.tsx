'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CALM_TECHNIQUES } from '@/lib/autism/evidence-base'
import { useAutismProgress } from '@/hooks/useAutismProgress'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { toast } from 'sonner'

export function CalmToolkit() {
  const { logSession } = useAutismProgress()

  const handleTechniqueComplete = (techniqueId: string, duration: number) => {
    logSession(duration, `calm-${techniqueId}`)
    toast.success('Session logged', {
      description: `+${duration} minute${duration === 1 ? '' : 's'} added to your progress.`
    })
  }

  return (
    <section id="calm-toolkit" className="scroll-mt-24 py-16 md:py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Regulation</p>
          <h2 className="text-3xl font-bold text-gray-900">Calm &amp; co-regulation toolkit</h2>
          <p className="text-gray-600">Breathing and calming techniques with sensory-friendly adaptations.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {CALM_TECHNIQUES.map(technique => (
            <Card key={technique.id} className="p-6 bg-white/80 backdrop-blur shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{technique.name}</h3>
              <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {technique.duration} min
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{technique.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-gray-700">
                    {technique.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <h4 className="text-xs font-semibold text-gray-900 mb-1">⚠️ Warnings:</h4>
                  <ul className="list-disc list-inside text-xs text-gray-700">
                    {technique.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <h4 className="text-xs font-semibold text-gray-900 mb-1">Age adaptations:</h4>
                  <p className="text-xs text-gray-700">{technique.ageAdaptations}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleTechniqueComplete(technique.id, technique.duration)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Practice & Log
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Want full interactive breathing exercises?</h3>
          <p className="text-sm text-gray-700 mb-4">
            Try our dedicated breathing technique pages with visual timers and audio guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="sm" variant="outline" asChild>
              <Link href="/techniques/box-breathing">Box Breathing</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/techniques/sos">SOS 60s</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/techniques/coherent">Coherent 5-5</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

