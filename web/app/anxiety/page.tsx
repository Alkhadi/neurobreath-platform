import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function AnxietyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breathing for Anxiety Relief</h1>
          <p className="text-lg text-gray-600 mb-6">
            Evidence-based breathing techniques to calm your nervous system, reduce panic symptoms, and manage general anxiety.
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Breathing Helps Anxiety</h2>
            <p className="text-gray-700 mb-4">
              Slow, controlled breathing activates the vagus nerve and parasympathetic nervous system, telling your body it's safe. 
              Extended exhales in particular help reduce the fight-or-flight response and cortisol levels.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recommended Techniques</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟦 4-7-8 Breathing</h3>
                <p className="text-gray-700 mb-3">
                  The extended exhale in this pattern (inhale 4, hold 7, exhale 8) is particularly effective for calming anxiety. 
                  Used by Dr. Andrew Weil as a "natural tranquilizer."
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/4-7-8">Try 4-7-8 Breathing</Link>
                </Button>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟩 Box Breathing</h3>
                <p className="text-gray-700 mb-3">
                  The equal 4-4-4-4 pattern provides structure and steadies heart rate. Excellent for general anxiety and maintaining calm.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/box-breathing">Try Box Breathing</Link>
                </Button>
              </div>

              <div className="bg-teal-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🆘 60-second SOS</h3>
                <p className="text-gray-700 mb-3">
                  For acute anxiety or panic symptoms, this 60-second reset provides immediate intervention.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/sos">Try SOS Reset</Link>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When Anxiety Strikes</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Find a quiet space if possible (or use headphones)</li>
              <li>Sit or stand in a comfortable position</li>
              <li>Start with whatever pattern feels manageable (even 30 seconds helps)</li>
              <li>Focus on the exhale—longer exhales = more calm</li>
              <li>If you feel lightheaded, slow down or take a break</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Safety Note</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Important:</strong> Breathing exercises complement but don't replace professional mental health treatment. 
                If anxiety is interfering with daily life, please consult a healthcare provider.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
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
