'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LiveBreathingPreview } from './live-breathing-preview'

// Hoisted outside component to satisfy react/require-constant
const mechanisms = [
  {
    id: 'box-coherent',
    badge: '🫧 Box & Coherent Breathing',
    title: 'Steady the Autonomic Swing',
    description: 'Equal 4-4-4-4 or 5-5 patterns are used by Navy special operations teams, heart rate variability researchers, and the NHS to nudge the vagus nerve, lower heart rate variability peaks, and steady attention for ADHD minds.',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
  },
  {
    id: 'slow-exhale',
    badge: '🌙 4-7-8 & Slow Exhale Work',
    title: 'Lengthened Exhales Calm the Limbic System',
    description: 'Dr Andrew Weil\'s 4-7-8 protocol and Harvard\'s relaxation response both show that extending the out-breath dampens the stress response, easing sleep onset and evening anxiety.',
    color: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800'
  },
  {
    id: 'short-breaks',
    badge: '🎯 Short, Frequent Breaks',
    title: 'Regulation Is a Trainable Skill',
    description: 'Occupational therapy guidance recommends 60–180 second breathing punctuations to reduce sensory overload, anchor autistic routines, and prep ADHD minds for learning. You\'re not broken — these are skills you can practise.',
    color: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
  }
]

const research = [
  {
    study: '8-week diaphragmatic breathing RCT',
    metric: '−1.3 μg/dL cortisol',
    description: 'Office workers who completed 20 guided sessions reduced salivary cortisol by approximately 1.3 μg/dL, whilst controls showed no change.',
    source: 'Ma et al., 2017',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5455070/'
  },
  {
    study: 'Attention & accuracy',
    metric: '+6.7 target hits',
    description: 'The same study recorded a 6.7-point gain on the Number Cancellation Test after training, confirming measurable focus improvements for everyday staff.',
    source: 'Frontiers in Psychology',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5455070/'
  }
]

export default function ScienceSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#0F172A]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why These Techniques Work
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Everything here is educational guidance informed by clinical and occupational therapy sources.
            We translate the evidence so it feels friendly, neuro-affirming, and doable.
          </p>
        </div>

        {/* Science Cards */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="space-y-6">
            {mechanisms.map((mechanism) => (
              <div
                key={mechanism.id}
                className={`p-6 md:p-8 rounded-3xl border-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${mechanism.color}`}
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    {mechanism.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {mechanism.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {mechanism.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Preview */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-xl">
            <div className="mb-4">
              <div className="inline-block px-3 py-1 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-full text-sm font-medium mb-4">
                INTERACTIVE DEMO
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Try it now: Guided breathing
            </h3>

            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Experience our visual breathing guide in action. Click &quot;Start Preview&quot; to see how the orb
              expands, holds, and contracts — giving you predictable, sensory-friendly timing cues that match your breath.
            </p>

            <div className="mb-6">
              <LiveBreathingPreview />
            </div>

            <div className="text-center px-2 sm:px-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Want full sessions with audio guidance?</p>
              <div className="mb-4 text-2xl">👇</div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#959E0B] to-[#4ECDC4] hover:from-[#7a8409] hover:to-[#3ab8b0] w-full sm:w-auto sm:max-w-lg mx-auto h-auto py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
              >
                <Link href="/breathing/breath" className="flex items-center justify-start gap-2 sm:gap-3 px-3 sm:px-5 md:px-6">
                  <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0 leading-none">🫁</span>
                  <div className="text-left flex-1 min-w-0 overflow-hidden">
                    <div className="font-semibold text-[11px] xs:text-xs sm:text-sm md:text-base leading-tight sm:leading-snug truncate">
                      Explore All Techniques
                    </div>
                    <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm opacity-90 leading-tight mt-0.5 sm:mt-1">
                      Full sessions with narration &amp; progress tracking
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 hidden sm:block" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Evidence Highlights */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Evidence Highlights</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Peer-reviewed research supporting breathing techniques</p>
          </div>
          <div className="flex flex-wrap gap-8 max-w-5xl mx-auto [&>*]:basis-full md:[&>*]:basis-[calc(50%-16px)] [&>*]:min-w-0">
            {research.map((study, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/60 dark:to-slate-800/60 rounded-3xl p-6 border-l-4 border-[#4ECDC4] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <p className="text-xs font-semibold text-[#4ECDC4] uppercase tracking-wide mb-3">{study.study}</p>
                <p className="font-bold text-slate-900 dark:text-white text-3xl mb-3 text-center bg-white/60 dark:bg-slate-700/60 rounded-2xl py-2">{study.metric}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-center">{study.description}</p>
                <div className="text-center">
                  <a
                    href={study.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#4ECDC4] hover:text-[#3ab8b0] font-medium hover:underline transition-colors"
                  >
                    <span>📄</span>
                    <span>{study.source}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-12 p-6 md:p-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-3xl text-center shadow-xl">
          <div className="flex flex-col items-center gap-2">
            <span className="text-amber-600 text-2xl">⚠️</span>
            <div>
              <p className="text-amber-800 dark:text-amber-300 font-semibold text-lg mb-2">Pause or stop any time</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm max-w-2xl mx-auto">
                If breathing feels uncomfortable, return to natural breathing and speak to a clinician for personalised advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
