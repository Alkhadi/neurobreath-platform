import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function SleepPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breathing for Better Sleep</h1>
          <p className="text-lg text-gray-600 mb-6">
            Clinically-proven breathing techniques to ease sleep onset, manage insomnia, and improve sleep quality.
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Breathing Improves Sleep</h2>
            <p className="text-gray-700 mb-4">
              Extended exhales activate the parasympathetic nervous system (rest and digest), slowing heart rate and preparing your body for sleep. 
              Breathing exercises also quiet racing thoughts and reduce cortisol, common barriers to sleep onset.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recommended Techniques</h2>
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟦 4-7-8 Breathing</h3>
                <p className="text-gray-700 mb-3">
                  Dr. Andrew Weil's technique specifically designed for sleep. The 8-count exhale is powerfully sedating. 
                  Many people fall asleep before completing 4 cycles.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/4-7-8">Try 4-7-8 Breathing</Link>
                </Button>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟪 Coherent 5-5</h3>
                <p className="text-gray-700 mb-3">
                  For chronic insomnia, daily coherent breathing builds nervous system balance that carries over to bedtime.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/coherent">Try Coherent Breathing</Link>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bedtime Routine</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Start 30-60 minutes before your target sleep time</li>
              <li>Dim lights and reduce screen time</li>
              <li>Practice 4-7-8 breathing for 5 minutes</li>
              <li>If still awake after 20 minutes, get up and try again</li>
              <li>Consistency builds sleep associations over time</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sleep Hygiene Tips</h2>
            <p className="text-gray-700 mb-4">
              Breathing exercises work best when combined with good sleep hygiene:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Keep bedroom cool (16-19°C / 60-67°F)</li>
              <li>Use blackout curtains or eye mask</li>
              <li>White noise or earplugs for sound masking</li>
              <li>Same wake time every day (even weekends)</li>
              <li>No caffeine after 2pm</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Note:</strong> If insomnia persists for more than 3 weeks or interferes with daily function, 
                consult a sleep specialist. Breathing exercises complement but don't replace treatment for sleep disorders.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/">Start Practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/progress">Track Progress</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
