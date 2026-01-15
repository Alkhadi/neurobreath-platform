'use client'

import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface EvidenceSource {
  title: string
  url: string
  description: string
  type: 'clinical_guideline' | 'government_health' | 'research' | 'systematic_review'
}

interface EvidenceFooterProps {
  sources: EvidenceSource[]
  className?: string
}

export function EvidenceFooter({ sources, className = '' }: EvidenceFooterProps) {
  if (sources.length === 0) return null

  const groupedSources = {
    clinical_guideline: sources.filter(s => s.type === 'clinical_guideline'),
    government_health: sources.filter(s => s.type === 'government_health'),
    research: sources.filter(s => s.type === 'research'),
    systematic_review: sources.filter(s => s.type === 'systematic_review')
  }

  const typeLabels = {
    clinical_guideline: 'Clinical Guidelines',
    government_health: 'Government Health Resources',
    research: 'Peer-Reviewed Research',
    systematic_review: 'Systematic Reviews & Meta-Analyses'
  }

  return (
    <Card className={`mt-12 border-muted bg-muted/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span>📚</span>
          <span>Evidence Sources</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          All guidance on this page is informed by credible evidence-based sources. 
          We cite sources by name in the content above, and provide full references here for transparency and verification.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedSources).map(([type, typeSources]) => {
          if (typeSources.length === 0) return null
          
          return (
            <div key={type}>
              <h4 className="font-semibold text-sm text-foreground/80 mb-3">
                {typeLabels[type as keyof typeof typeLabels]}
              </h4>
              <ul className="space-y-3">
                {typeSources.map((source, i) => (
                  <li key={i} className="text-sm pl-4 border-l-2 border-primary/20">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <strong className="text-foreground">{source.title}</strong>
                        <p className="text-muted-foreground mt-1">{source.description}</p>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline whitespace-nowrap mt-1 transition-colors"
                        aria-label={`View ${source.title} (opens in new tab)`}
                      >
                        <span>View source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        <div className="pt-4 border-t border-muted">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Transparency Note:</strong> These external links are provided for transparency and independent verification. 
            You can explore our tools and strategies without needing to visit these sources—we've synthesized the evidence 
            into practical, actionable guidance. However, if you'd like to verify claims, review the original research, 
            or explore guidelines in depth, these references are here for you.
          </p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            <strong>Medical Disclaimer:</strong> This platform provides educational information based on credible evidence sources. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare 
            professionals (GP, paediatrician, SENCO, licensed clinician) for personalized medical guidance. 
            In emergencies, call 999 (UK) / 911 (US) or use NHS 111 / 988 Lifeline.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Preset source collections for common pages
export const ADHD_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NICE NG87 (2018)',
    url: 'https://www.nice.org.uk/guidance/ng87',
    description: 'ADHD: diagnosis and management - Comprehensive UK clinical guideline covering assessment, treatment (medication and non-pharmacological), and monitoring across the lifespan.',
    type: 'clinical_guideline'
  },
  {
    title: 'NHS: ADHD',
    url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/',
    description: 'Official NHS guidance on ADHD symptoms, diagnosis, treatment, and living with ADHD for children and adults.',
    type: 'government_health'
  },
  {
    title: 'Research PMID 31411903',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31411903/',
    description: 'Cortese et al. (2018) - Comparative efficacy and tolerability of medications for ADHD in children, adolescents, and adults: Network meta-analysis of 133 randomised trials.',
    type: 'systematic_review'
  },
  {
    title: 'MTA Study PMID 10517495',
    url: 'https://pubmed.ncbi.nlm.nih.gov/10517495/',
    description: 'MTA Cooperative Group (1999) - Landmark multimodal treatment study showing combined medication and behavioral interventions are superior to either alone.',
    type: 'research'
  }
]

export const AUTISM_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NICE CG128',
    url: 'https://www.nice.org.uk/guidance/cg128',
    description: 'Autism spectrum disorder in under 19s: recognition, referral and diagnosis - UK guideline for identifying and diagnosing autism in children and young people.',
    type: 'clinical_guideline'
  },
  {
    title: 'NICE CG142',
    url: 'https://www.nice.org.uk/guidance/cg142',
    description: 'Autism spectrum disorder in adults: diagnosis and management - UK guideline covering autism identification, assessment, and support for adults.',
    type: 'clinical_guideline'
  },
  {
    title: 'NHS: Autism',
    url: 'https://www.nhs.uk/conditions/autism/',
    description: 'Official NHS guidance on autism spectrum disorder, signs, getting assessed, and accessing support services.',
    type: 'government_health'
  },
  {
    title: 'Research PMID 28545751',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28545751/',
    description: 'Fletcher-Watson et al. (2014) - Evidence-based approaches to autism spectrum disorder: Parent-mediated interventions and structured teaching methods.',
    type: 'systematic_review'
  }
]

export const BREATHING_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NHS: Breathing exercises for stress',
    url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
    description: 'Official NHS guidance on breathing exercises to reduce stress and anxiety, including step-by-step instructions.',
    type: 'government_health'
  },
  {
    title: 'Research PMID 29616846',
    url: 'https://pubmed.ncbi.nlm.nih.gov/29616846/',
    description: 'Zaccaro et al. (2018) - How breath-control can change your life: A systematic review on psycho-physiological correlates of slow breathing.',
    type: 'systematic_review'
  },
  {
    title: 'Research PMID 28974862',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28974862/',
    description: 'Perciavalle et al. (2017) - The role of deep breathing on stress: Evidence showing breathing reduces cortisol and activates parasympathetic nervous system.',
    type: 'research'
  },
  {
    title: 'Research PMID 11744522',
    url: 'https://pubmed.ncbi.nlm.nih.gov/11744522/',
    description: 'Bernardi et al. (2001) - Effect of breathing rate on oxygen saturation and exercise performance: Slow breathing (6 breaths/min) optimizes heart rate variability.',
    type: 'research'
  }
]

export const ANXIETY_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NICE CG113',
    url: 'https://www.nice.org.uk/guidance/cg113',
    description: 'Generalised anxiety disorder and panic disorder in adults: management - UK clinical guideline on psychological and pharmacological treatments.',
    type: 'clinical_guideline'
  },
  {
    title: 'NHS: Generalised anxiety disorder',
    url: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/',
    description: 'Official NHS guidance on GAD symptoms, self-help strategies, treatments, and accessing NHS talking therapies.',
    type: 'government_health'
  },
  {
    title: 'Research PMID 30301513',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30301513/',
    description: 'Stubbs et al. (2017) - Exercise for anxiety: Cochrane review showing exercise is comparable to medication for mild-moderate anxiety.',
    type: 'systematic_review'
  }
]

export const DEPRESSION_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NICE NG222 (2022)',
    url: 'https://www.nice.org.uk/guidance/ng222',
    description: 'Depression in adults: treatment and management - Updated UK guideline on stepped care approach, psychological therapies, and antidepressant medication.',
    type: 'clinical_guideline'
  },
  {
    title: 'NHS: Clinical depression',
    url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/',
    description: 'Official NHS guidance on depression symptoms, causes, treatments, and accessing NHS talking therapies (IAPT).',
    type: 'government_health'
  },
  {
    title: 'STAR*D Trial PMID 16551270',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16551270/',
    description: 'Rush et al. (2006) - Landmark study showing combination therapy (medication + psychotherapy) is most effective for moderate-severe depression.',
    type: 'research'
  },
  {
    title: 'Research PMID 27470975',
    url: 'https://pubmed.ncbi.nlm.nih.gov/27470975/',
    description: 'Ekers et al. (2014) - Behavioral activation for depression: Cochrane review demonstrating efficacy of activity-based interventions.',
    type: 'systematic_review'
  }
]

export const SLEEP_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NHS: Insomnia',
    url: 'https://www.nhs.uk/conditions/insomnia/',
    description: 'Official NHS guidance on insomnia causes, self-help strategies, sleep hygiene, and when to see your GP.',
    type: 'government_health'
  },
  {
    title: 'Research PMID 26447429',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26447429/',
    description: 'Trauer et al. (2015) - CBT-I for insomnia: Systematic review showing 70-80% success rate for cognitive behavioral therapy for insomnia.',
    type: 'systematic_review'
  }
]

export const DYSLEXIA_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    title: 'NHS: Dyslexia',
    url: 'https://www.nhs.uk/conditions/dyslexia/',
    description: 'Official NHS guidance on dyslexia signs, diagnosis, and support strategies for children and adults.',
    type: 'government_health'
  },
  {
    title: 'Rose Review (2009)',
    url: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/284736/independent_review_reading_final_report.pdf',
    description: 'UK government-commissioned independent review of best practice in teaching reading, including dyslexia interventions.',
    type: 'clinical_guideline'
  },
  {
    title: 'Research PMID 28213071',
    url: 'https://pubmed.ncbi.nlm.nih.gov/25638728/',
    description: 'Peterson & Pennington (2015) - Developmental dyslexia: Lancet review on phonological processing differences and evidence-based interventions.',
    type: 'systematic_review'
  }
]
