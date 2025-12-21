import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function AutismPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breathing Tools for Autism</h1>
          <p className="text-lg text-gray-600 mb-6">
            Breathing techniques adapted for autistic individuals, with clear patterns, predictable timing, and sensory-friendly guidance.
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Breathing Matters</h2>
            <p className="text-gray-700 mb-4">
              For autistic individuals, breathing exercises can help manage sensory overload, reduce anxiety, and create predictable routines for emotional regulation. 
              The structured patterns provide a clear framework that works with autistic cognitive strengths.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recommended Techniques</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟩 Box Breathing (4-4-4-4)</h3>
                <p className="text-gray-700 mb-3">
                  The equal pattern provides clear structure and predictability. Visual cues help maintain attention through each phase.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/box-breathing">Try Box Breathing</Link>
                </Button>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🆘 60-second SOS Reset</h3>
                <p className="text-gray-700 mb-3">
                  Quick intervention for meltdown prevention or sensory overload. One minute of structured breathing to restore calm.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/sos">Try SOS Reset</Link>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sensory Considerations</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Visual timers and progress indicators help maintain focus</li>
              <li>Optional voice guidance can be adjusted or turned off</li>
              <li>No sudden sounds or flashing animations</li>
              <li>Clear, consistent patterns reduce cognitive load</li>
              <li>Practice in a quiet, low-stimulation environment</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Building a Routine</h2>
            <p className="text-gray-700">
              Start with 1-minute sessions and gradually increase. Consistency is more important than duration. 
              Link breathing practice to existing routines (morning, before bed, after school) to build lasting habits.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
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
