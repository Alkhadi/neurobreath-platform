'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, Building2, FlaskConical, AlertCircle, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Data-driven approach for easy scaling
const CREDIBILITY_SECTIONS = [
  {
    id: 'expert-informed',
    icon: GraduationCap,
    title: 'Expert-Informed',
    description: 'Based on pioneering research',
    items: [
      {
        name: 'Dr Herbert Benson',
        affiliation: 'Harvard Medical School',
        contribution: 'Relaxation Response research',
        details: 'Pioneer in mind-body medicine, founder of the Benson-Henry Institute at Harvard Medical School. His research on the "relaxation response" demonstrates how deep breathing activates the parasympathetic nervous system.'
      },
      {
        name: 'Dr Andrew Weil',
        affiliation: 'University of Arizona',
        contribution: '4-7-8 breathing technique',
        details: 'Clinical professor and integrative medicine pioneer. Developed the 4-7-8 breathing technique, which uses extended exhalation to activate the vagus nerve and trigger the body\'s natural relaxation response.'
      }
    ]
  },
  {
    id: 'guidance-sources',
    icon: Building2,
    title: 'Guidance Sources',
    description: 'Aligned with trusted organisations',
    items: [
      {
        name: 'NHS (UK)',
        affiliation: 'National Health Service',
        contribution: 'First-line intervention for stress & anxiety',
        details: 'The NHS recommends breathing exercises as a first-line intervention for stress and anxiety management, with Grade A evidence level (highest).'
      },
      {
        name: 'Mayo Clinic',
        affiliation: 'Leading medical institution',
        contribution: 'Evidence-based recommendations',
        details: 'Mayo Clinic recommends breathing exercises for stress, anxiety, high blood pressure, chronic pain, and sleep improvement.'
      },
      {
        name: 'Performance Applications',
        affiliation: 'Military & first responders',
        contribution: 'Used in high-stress settings',
        details: 'Box breathing and similar techniques are used by Navy SEALs, first responders, and emergency services to manage stress and maintain cognitive performance under pressure. These same techniques benefit workplace stress and performance anxiety.'
      }
    ]
  },
  {
    id: 'evidence-informed',
    icon: FlaskConical,
    title: 'Evidence-Informed',
    description: 'Grounded in peer-reviewed research',
    items: [
      {
        name: 'Heart Rate Variability',
        affiliation: 'Harvard & multiple institutions',
        contribution: 'Slow breathing optimises autonomic function',
        details: 'Research shows that slow breathing (around 6 breaths per minute) optimises heart rate variability, reduces inflammation markers, and improves autonomic nervous system balance.'
      },
      {
        name: 'Stress Reduction & Cognitive Regulation',
        affiliation: 'Multiple peer-reviewed studies',
        contribution: 'Reduces cortisol, anxiety and enhances focus and emotional control',
        details: 'Controlled breathing has been shown in multiple studies to reduce cortisol levels, lower blood pressure, and decrease anxiety symptoms. Brain imaging research demonstrates that breathing practices enhance activity in brain regions associated with attention, emotional regulation, and self-control.'
      }
    ]
  }
]

interface CredibilityItemProps {
  name: string
  affiliation: string
  contribution: string
  details: string
}

interface CredibilityCardProps {
  item: CredibilityItemProps
  sectionTitle: string
  IconComponent: React.ComponentType<{ className?: string }>
  sectionId: string
  index: number
}

function CredibilityCard({ item, sectionTitle, IconComponent, sectionId, index }: CredibilityCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isFullWidth = item.name === 'Stress Reduction & Cognitive Regulation'
  
  return (
    <Card 
      key={`${sectionId}-${index}`} 
      className={`overflow-hidden hover:shadow-md transition-shadow ${isFullWidth ? 'sm:col-span-2 lg:col-span-3' : ''}`}
    >
      <CardContent className="p-6">
        <div className={`flex items-start gap-3 mb-4 ${isFullWidth ? 'max-w-2xl' : ''}`}>
          <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-primary mb-1">
              {sectionTitle}
            </div>
            <h3 className="font-semibold text-foreground text-sm leading-tight break-words">
              {item.name}
            </h3>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
          {item.contribution}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="w-full justify-between group hover:bg-accent"
        >
          <span className="text-xs">Learn more</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
              <DialogDescription>{item.affiliation}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-1">Contribution</h4>
                <p className="text-sm text-muted-foreground">{item.contribution}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-1">Details</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default function CredibilitySection() {
  const [showSources, setShowSources] = useState(false)

  return (
    <section className="py-16 lg:py-20" aria-labelledby="credibility-heading">
      <div className="px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 id="credibility-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Clinical Backing &amp; Credibility
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Our tools are evidence-informed and designed with safety in mind.{' '}
            <strong className="text-foreground">Educational information only — not medical advice.</strong>
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200">Important</p>
              <p className="text-amber-800 dark:text-amber-300 mt-1">
                This is educational information only, not medical advice. If breathing feels uncomfortable, return to natural breathing. 
                Always consult healthcare professionals for personalised guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Grid of Individual Cards */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CREDIBILITY_SECTIONS.flatMap((section) => 
              section.items.map((item, idx) => (
                <CredibilityCard
                  key={`${section.id}-${idx}`}
                  item={item}
                  sectionTitle={section.title}
                  IconComponent={section.icon}
                  sectionId={section.id}
                  index={idx}
                />
              ))
            )}
          </div>
        </div>

        {/* Learn More CTA */}
        <div className="max-w-3xl mx-auto text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowSources(true)}
            className="gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <FlaskConical className="w-4 h-4" />
            View Full Sources &amp; References
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Sources Modal (placeholder until dedicated page exists) */}
        <Dialog open={showSources} onOpenChange={setShowSources}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sources &amp; References</DialogTitle>
              <DialogDescription>
                Research and guidance informing our breathing tools
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {CREDIBILITY_SECTIONS.map((section) => {
                const IconComponent = section.icon
                return (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                    </div>
                    <ul className="space-y-3 ml-7">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          <div className="font-medium text-foreground">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.affiliation}</div>
                          <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {item.details}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-foreground mb-2 text-sm">Key Publications &amp; Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Benson, H. (1975). <em>The Relaxation Response</em>. Harvard Medical School</li>
                  <li>• NHS (UK). <em>Breathing exercises for stress</em>. Grade A recommendation</li>
                  <li>• Mayo Clinic. <em>Stress management: Breathing exercises</em></li>
                  <li>• Zaccaro, A. et al. (2018). <em>How Breath-Control Can Change Your Life: A Systematic Review</em>. Frontiers in Human Neuroscience</li>
                  <li>• Jerath, R. et al. (2015). <em>Self-Regulation of Breathing as a Primary Treatment for Anxiety</em>. Applied Psychophysiology and Biofeedback</li>
                </ul>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> A comprehensive sources page with full citations 
                    and references is coming soon. This information is for educational purposes and does not constitute medical advice.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
