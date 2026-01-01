import { HeroSection } from '@/components/autism/hero-section'
import { TodaysPlanWizard } from '@/components/autism/todays-plan-wizard'
import { SkillsLibrary } from '@/components/autism/skills-library'
import { QuestsSection } from '@/components/autism/quests-section'
import { CalmToolkit } from '@/components/autism/calm-toolkit'
import { ProgressDashboard } from '@/components/autism/progress-dashboard'
import { EvidenceUpdates } from '@/components/autism/evidence-updates'
import { CrisisSupport } from '@/components/autism/crisis-support'
import { PathwaysSupport } from '@/components/autism/pathways-support'
import { PDFToolkit } from '@/components/autism/pdf-toolkit'
import { ReferencesSection } from '@/components/autism/references-section'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Autism Support Hub | Evidence-Based Strategies & Tools | NeuroBreath',
  description: 'Comprehensive autism support for teachers, parents, autistic individuals, and employers. Evidence-based strategies, interactive tools, progress tracking, and resources from NICE, NHS, CDC & peer-reviewed research.',
  keywords: 'autism support, autism strategies, visual schedules, PECS, AAC, sensory support, calm corners, autism school, autism workplace, autism UK, autism US, SEND, IEP',
  openGraph: {
    title: 'Autism Support Hub | NeuroBreath',
    description: 'Evidence-based autism support strategies and tools for UK, US & EU',
    type: 'website'
  }
}

export default function AutismHubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <HeroSection />

      <main>
        {/* Crisis Support (High visibility) */}
        <CrisisSupport />

        {/* Today's Plan Wizard */}
        <TodaysPlanWizard />

        {/* Skills Library */}
        <SkillsLibrary />

        {/* Quests/Games */}
        <QuestsSection />

        {/* Calm Toolkit */}
        <CalmToolkit />

        {/* Progress Dashboard */}
        <ProgressDashboard />

        {/* Evidence Updates */}
        <EvidenceUpdates />

        {/* Pathways & Support */}
        <PathwaysSupport />

        {/* PDF Toolkits */}
        <PDFToolkit />

      {/* Internal Links to Other Pages */}
        <section className="scroll-mt-24 py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-sm font-medium text-blue-700">Explore</p>
              <h2 className="text-3xl font-bold text-gray-900">Related NeuroBreath tools</h2>
              <p className="text-gray-600">Evidence-aware support across breathing, focus, and learning.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/blog" className="group">
                <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-transparent group-hover:border-blue-600">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Coach</h3>
                  <p className="text-sm text-gray-600">Ask evidence-based questions</p>
                </div>
              </Link>

              <Link href="/breathing/training/focus-garden" className="group">
                <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-transparent group-hover:border-green-600">
                  <div className="text-4xl mb-3">🌱</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Focus Garden</h3>
                  <p className="text-sm text-gray-600">Neurodivergent focus training</p>
                </div>
              </Link>

              <Link href="/tools/dyslexia-reading-training" className="group">
                <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-transparent group-hover:border-purple-600">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dyslexia Tools</h3>
                  <p className="text-sm text-gray-600">Reading & phonics support</p>
                </div>
              </Link>

              <Link href="/techniques/box-breathing" className="group">
                <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-transparent group-hover:border-orange-600">
                  <div className="text-4xl mb-3">🫁</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Breathing Tools</h3>
                  <p className="text-sm text-gray-600">Box, SOS, Coherent 5-5</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

      {/* References & Myths */}
      <ReferencesSection />
      </main>

      {/* Final Disclaimer */}
      <section className="py-8 bg-gray-100 border-t">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Educational information only. Not medical advice.</strong>
          </p>
          <p className="text-xs text-gray-500">
            This page provides evidence-based strategies for supporting autistic individuals based on NICE, NHS, CDC, and peer-reviewed research. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions about autism or medical conditions. If you are in crisis, please contact the crisis services listed above.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} NeuroBreath. All progress tracking is local-only. No personal data is collected or shared.
          </p>
        </div>
      </section>
    </div>
  )
}
