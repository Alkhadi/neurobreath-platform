'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface AccordionItemProps {
  title: string
  description: string
  link?: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function SourceItem({ title, description, link, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border border-slate-200 rounded-lg mb-2">
      {isOpen ? (
        <button
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
          onClick={onToggle}
          aria-expanded="true"
        >
          <div className="flex-1">
            <h4 className="font-medium text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            {link && (
              <ExternalLink
                className="w-4 h-4 text-slate-400"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(link, '_blank', 'noopener,noreferrer')
                }}
              />
            )}
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </div>
        </button>
      ) : (
        <button
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
          onClick={onToggle}
          aria-expanded="false"
        >
          <div className="flex-1">
            <h4 className="font-medium text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            {link && (
              <ExternalLink
                className="w-4 h-4 text-slate-400"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(link, '_blank', 'noopener,noreferrer')
                }}
              />
            )}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </button>
      )}
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-slate-700">
          {children}
        </div>
      )}
    </div>
  )
}

export default function CredibilitySection() {
  const [openSource, setOpenSource] = useState<string | null>(null)

  const toggleSource = (id: string) => {
    setOpenSource(openSource === id ? null : id)
  }

  const experts = [
    {
      id: 'benson',
      name: 'Dr Herbert Benson',
      speciality: 'Harvard Medical School, Relaxation Response',
      description: 'Pioneer in mind-body medicine and stress reduction research',
      content: (
        <div>
          <p className="mb-3"><strong>Dr Herbert Benson</strong>, MD, founder of the Benson-Henry Institute at Harvard Medical School, pioneered research on the "relaxation response" - the body's counterbalance to the stress response.</p>
          <p className="mb-2"><strong>Key findings:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Deep breathing activates the parasympathetic nervous system</li>
            <li>Regular practice reduces blood pressure and heart rate</li>
            <li>Decreases stress hormones like cortisol</li>
            <li>Improves focus and emotional regulation</li>
          </ul>
          <p><strong>Publications:</strong> "The Relaxation Response" (1975), over 190 peer-reviewed papers on mind-body medicine</p>
        </div>
      )
    },
    {
      id: 'weil',
      name: 'Dr Andrew Weil',
      speciality: 'Integrative Medicine, 4-7-8 Technique',
      description: 'Clinical professor at University of Arizona, breathing technique developer',
      content: (
        <div>
          <p className="mb-3"><strong>Dr Andrew Weil</strong>, MD, integrative medicine pioneer and clinical professor at University of Arizona, developed the 4-7-8 breathing technique.</p>
          <p className="mb-2"><strong>The technique:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Inhale through nose for 4 seconds</li>
            <li>Hold breath for 7 seconds</li>
            <li>Exhale through mouth for 8 seconds</li>
          </ul>
          <p className="mb-2"><strong>Benefits:</strong> Reduces anxiety, aids sleep, manages stress responses, lowers blood pressure</p>
          <p><strong>Scientific basis:</strong> Extended exhalation activates vagus nerve, triggering parasympathetic response</p>
        </div>
      )
    }
  ]

  const publicGuidance = [
    {
      id: 'nhs',
      name: 'NHS (UK)',
      speciality: 'National Health Service',
      description: 'First-line intervention for stress and anxiety management',
      content: (
        <div>
          <p className="mb-3">The <strong>National Health Service (UK)</strong> recommends breathing exercises as a first-line intervention for stress and anxiety management.</p>
          <p className="mb-2"><strong>NHS-recommended techniques:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Box breathing (4-4-4-4 pattern)</li>
            <li>Deep belly breathing</li>
            <li>Relaxed breathing through pursed lips</li>
          </ul>
          <p className="mb-2"><strong>Clinical use:</strong> Prescribed for anxiety disorders, panic attacks, PTSD, chronic pain management, and sleep disorders</p>
          <p><strong>Evidence level:</strong> Grade A recommendation (highest level of evidence)</p>
        </div>
      )
    },
    {
      id: 'mayo',
      name: 'Mayo Clinic',
      speciality: 'Leading Medical Institution',
      description: 'Evidence-based breathing recommendations for multiple conditions',
      content: (
        <div>
          <p className="mb-3">The <strong>Mayo Clinic</strong>, one of the world's leading medical institutions, recommends breathing exercises for various conditions.</p>
          <p className="mb-2"><strong>Recommended for:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Stress and anxiety reduction</li>
            <li>High blood pressure management</li>
            <li>Chronic pain relief</li>
            <li>Asthma symptom control</li>
            <li>Sleep improvement</li>
          </ul>
          <p><strong>Safety profile:</strong> No adverse effects when practised correctly; suitable for all ages</p>
        </div>
      )
    }
  ]

  const research = [
    {
      id: 'harvard',
      name: 'Harvard Medical School',
      speciality: 'Mind-Body Research',
      description: 'Controlled breathing studies on heart rate variability and inflammation',
      content: (
        <div>
          <p className="mb-3"><strong>Harvard Medical School</strong> has conducted extensive research on mind-body practices, including controlled breathing.</p>
          <p className="mb-2"><strong>Research findings:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Slow breathing (6 breaths/min) optimises heart rate variability</li>
            <li>Reduces inflammation markers (C-reactive protein)</li>
            <li>Improves autonomic nervous system balance</li>
            <li>Enhances emotional regulation in brain imaging studies</li>
          </ul>
          <p><strong>Publications:</strong> Multiple studies in JAMA, Psychosomatic Medicine, and other peer-reviewed journals</p>
        </div>
      )
    },
    {
      id: 'military',
      name: 'Military Applications',
      speciality: 'Navy SEALs & Special Operations',
      description: 'Box breathing protocol for high-stress situations',
      content: (
        <div>
          <p className="mb-3"><strong>U.S. Navy SEALs</strong> use box breathing (tactical breathing) as a standard pre-mission and recovery technique.</p>
          <p className="mb-2"><strong>The protocol:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Inhale 4 seconds</li>
            <li>Hold 4 seconds</li>
            <li>Exhale 4 seconds</li>
            <li>Hold 4 seconds</li>
            <li>Repeat for 5+ minutes</li>
          </ul>
          <p className="mb-2"><strong>Military applications:</strong> Used before high-stress operations, during combat recovery, and in BUD/S (SEAL training) to manage stress and maintain cognitive performance under extreme pressure</p>
          <p><strong>Civilian benefits:</strong> Same technique helps manage workplace stress, test anxiety, and performance pressure</p>
        </div>
      )
    }
  ]

  return (
    <section className="py-16 bg-slate-50">
      <div className="px-4">
        {/* Header & Evidence Highlights - Centred with max-width */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Clinical Backing & Credibility
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our techniques are informed by leading medical experts and supported by peer-reviewed research. 
              This is educational information only, not medical advice.
            </p>
          </div>

          {/* Evidence Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Expert-Informed</h3>
              <p className="text-slate-600 text-sm">Dr Herbert Benson (Harvard) • Dr Andrew Weil (4-7-8)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Official Guidance</h3>
              <p className="text-slate-600 text-sm">NHS (UK) • Mayo Clinic • Military Applications</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Evidence-Based</h3>
              <p className="text-slate-600 text-sm">Peer-reviewed research • Grade A NHS recommendations</p>
            </div>
          </div>
        </div>

        {/* Sources & References - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Sources & References</h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Experts Section */}
            <div>
              <h4 className="text-lg font-medium text-slate-900 mb-4">Medical Experts</h4>
              {experts.map((expert) => (
                <SourceItem
                  key={expert.id}
                  title={expert.name}
                  description={`${expert.speciality} - ${expert.description}`}
                  isOpen={openSource === expert.id}
                  onToggle={() => toggleSource(expert.id)}
                >
                  {expert.content}
                </SourceItem>
              ))}
            </div>

            {/* Public Guidance Section */}
            <div>
              <h4 className="text-lg font-medium text-slate-900 mb-4">Public Health Guidance</h4>
              {publicGuidance.map((guidance) => (
                <SourceItem
                  key={guidance.id}
                  title={guidance.name}
                  description={`${guidance.speciality} - ${guidance.description}`}
                  isOpen={openSource === guidance.id}
                  onToggle={() => toggleSource(guidance.id)}
                >
                  {guidance.content}
                </SourceItem>
              ))}
            </div>

            {/* Research & Evidence Section */}
            <div>
              <h4 className="text-lg font-medium text-slate-900 mb-4">Research & Evidence</h4>
              {research.map((study) => (
                <SourceItem
                  key={study.id}
                  title={study.name}
                  description={`${study.speciality} - ${study.description}`}
                  isOpen={openSource === study.id}
                  onToggle={() => toggleSource(study.id)}
                >
                  {study.content}
                </SourceItem>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Note - Full Width */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div>
              <p className="text-amber-800 font-medium">Important Safety Information</p>
              <p className="text-amber-700 text-sm mt-1">
                These are educational resources only. If breathing feels uncomfortable, return to natural breathing. 
                Always consult healthcare professionals for personalised medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
