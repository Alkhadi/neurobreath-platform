import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EvidenceSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Evidence & Research</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            NeuroBreath is informed by clinical research and public health guidance from trusted institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Box Breathing */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🟩</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Box Breathing</h3>
            <p className="text-gray-700 mb-4">
              Equal 4-4-4-4 or 5-5 patterns are used by Navy special operations teams, HRV researchers, and the NHS to steady attention for ADHD brains.
            </p>
            <a
              href="https://psychcentral.com/health/box-breathing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline text-sm"
            >
              PsychCentral Reference →
            </a>
          </div>

          {/* 4-7-8 Breathing */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
            <div className="text-3xl mb-3">🟦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">4-7-8 Breathing</h3>
            <p className="text-gray-700 mb-4">
              Dr Andrew Weil's 4-7-8 protocol and Harvard's relaxation response show that extending the out-breath dampens stress, easing sleep onset.
            </p>
            <a
              href="https://www.healthline.com/health/4-7-8-breathing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              4-7-8 Breathing Guide →
            </a>
          </div>

          {/* Research Results */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Measured Results</h3>
            <p className="text-gray-700 mb-4">
              Office workers who completed 20 guided sessions cut salivary cortisol by roughly 1.3 µg/dL, while controls showed no change.
            </p>
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5455070/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline text-sm"
            >
              Ma et al., 2017 →
            </a>
          </div>
        </div>

        {/* Clinical Backing */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Clinical Backing & Credibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-medium text-gray-900 mb-2">Informed by experts</p>
              <p className="text-sm text-gray-600">
                <a href="https://bhi.org/our-founder" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Dr Herbert Benson</a> (Harvard) ·{' '}
                <a href="https://www.healthline.com/health/4-7-8-breathing" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Dr Andrew Weil</a> (4-7-8)
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">Public guidance</p>
              <p className="text-sm text-gray-600">
                <a href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">NHS (UK)</a> ·{' '}
                <a href="https://www.va.gov/health-care/health-needs-conditions/mental-health/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">U.S. VA</a> ·{' '}
                <a href="https://hms.harvard.edu/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Harvard</a>
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-2">Evidence</p>
              <p className="text-sm text-gray-600">
                Navy SEAL teams use box breathing for focus. 2024 trial: <strong>99.2%</strong> breathing effectiveness improvement.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Safety note:</strong> Breathwork is not a substitute for medical or psychiatric treatment. If you experience dizziness, panic, or worsening symptoms, stop immediately and consult a healthcare professional. Some techniques may not be suitable for certain conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
