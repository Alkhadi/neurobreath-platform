'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ScienceSection() {
  const mechanisms = [
    {
      id: 'box-coherent',
      badge: '🫧 Box & Coherent Breathing',
      title: 'Steady the Autonomic Swing',
      description: 'Equal 4-4-4-4 or 5-5 patterns are used by Navy special operations teams, heart rate variability researchers, and the NHS to nudge the vagus nerve, lower heart rate variability peaks, and steady attention for ADHD minds.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'slow-exhale',
      badge: '🌙 4-7-8 & Slow Exhale Work',
      title: 'Lengthened Exhales Calm the Limbic System', 
      description: 'Dr Andrew Weil\'s 4-7-8 protocol and Harvard\'s relaxation response both show that extending the out-breath dampens the stress response, easing sleep onset and evening anxiety.',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'short-breaks',
      badge: '🎯 Short, Frequent Breaks',
      title: 'Regulation Is a Trainable Skill',
      description: 'Occupational therapy guidance recommends 60–180 second breathing punctuations to reduce sensory overload, anchor autistic routines, and prep ADHD minds for learning. You\'re not broken — these are skills you can practise.',
      color: 'bg-green-50 border-green-200'
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

  return (
    <section className="py-16 bg-slate-50">
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why These Techniques Work
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Everything here is educational guidance informed by clinical and occupational therapy sources. 
            We translate the evidence so it feels friendly, neuro-affirming, and doable.
          </p>
        </div>

        {/* Science Cards & Interactive Preview - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Science Cards */}
          <div className="space-y-6">
            {mechanisms.map((mechanism) => (
              <div key={mechanism.id} className={`p-6 rounded-lg border-2 ${mechanism.color}`}>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-medium text-slate-700 mb-2">
                    {mechanism.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {mechanism.title}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {mechanism.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Preview */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <div className="mb-4">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                LIVE PREVIEW
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Guided Inhale • Hold • Exhale
            </h3>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              Preview the same visual pacing used in the main player. Inhale, hold, and exhale cues 
              keep timing predictable for sensory-sensitive learners.
            </p>

            {/* Visual Breathing Circle Preview */}
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 border-4 border-blue-200 rounded-full flex items-center justify-center bg-blue-50">
                <div className="w-16 h-16 bg-blue-400 rounded-full opacity-60"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">Click here to explore:</p>
              <div className="mb-4 text-2xl">👇</div>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/breathing/training/focus-garden" className="flex items-center gap-2">
                  <span className="text-lg">🌱</span>
                  <div className="text-left">
                    <div className="font-semibold">Focus Training</div>
                    <div className="text-xs opacity-90">Interactive plant-based focus exercises</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Evidence Highlights - Full Width */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Evidence Highlights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {research.map((study, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <p className="text-sm text-slate-600 mb-1">{study.study}</p>
                <p className="font-semibold text-slate-900 text-lg mb-2">{study.metric}</p>
                <p className="text-sm text-slate-700 mb-2">{study.description}</p>
                <a 
                  href={study.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {study.source}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div>
              <p className="text-amber-800 font-medium">Pause or stop any time</p>
              <p className="text-amber-700 text-sm mt-1">
                If breathing feels uncomfortable, return to natural breathing and speak to a clinician for personalised advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
