import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function StressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breathing for Stress Relief</h1>
          <p className="text-lg text-gray-600 mb-6">
            Science-backed breathing techniques to reduce cortisol, manage workplace stress, and build resilience.
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Breathing Reduces Stress</h2>
            <p className="text-gray-700 mb-4">
              Research shows that controlled breathing can reduce salivary cortisol levels by up to 1.3 µg/dL after 20 sessions. 
              The vagus nerve, when stimulated through slow breathing, signals safety to your brain and body.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recommended Techniques</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟩 Box Breathing</h3>
                <p className="text-gray-700 mb-3">
                  The 4-4-4-4 pattern is used by Navy SEALs to maintain calm under extreme stress. 
                  Perfect for workplace pressure and daily stress management.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/box-breathing">Try Box Breathing</Link>
                </Button>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">🟪 Coherent 5-5</h3>
                <p className="text-gray-700 mb-3">
                  Breathing at 5 breaths per minute maximizes heart rate variability, a marker of stress resilience. 
                  Excellent for chronic stress.
                </p>
                <Button asChild size="sm">
                  <Link href="/techniques/coherent">Try Coherent Breathing</Link>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Workplace Stress Management</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Before meetings:</strong> 2-3 minutes of box breathing to center yourself</li>
              <li><strong>During breaks:</strong> 5 minutes of coherent breathing for reset</li>
              <li><strong>After difficult conversations:</strong> SOS reset to process emotions</li>
              <li><strong>End of day:</strong> 4-7-8 breathing to transition from work to home</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Building Resilience</h2>
            <p className="text-gray-700">
              Consistency matters more than duration. Even 2-3 minutes daily can build lasting stress resilience. 
              Track your practice to see improvements in how quickly you recover from stressful events.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
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
