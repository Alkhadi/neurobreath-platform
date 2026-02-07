'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

const FEATURED_RESOURCES = [
  { title: 'Autism', url: '/autism' },
  { title: 'ADHD', url: '/adhd' },
  { title: 'Breathing techniques', url: '/breathing/techniques' },
  { title: 'Dyslexia', url: '/dyslexia-reading-training' },
  { title: 'Sleep disorders', url: '/sleep' },
  { title: 'Depression', url: '/conditions/low-mood-burnout' },
  { title: 'Stress management', url: '/stress' },
  { title: 'Mindfulness', url: '/breathing/mindfulness' },
  { title: 'Anxiety', url: '/anxiety' },
  { title: 'Mood tools', url: '/tools/mood-tools' },
]

const SOURCES = [
  'NICE Guideline NG87: Attention deficit hyperactivity disorder: diagnosis and management.',
  'NHS: Autism support for families · NHS: Every Mind Matters.',
  'CDC ADHD resource hub · American Academy of Pediatrics ADHD clinical practice guideline.',
  'Jiang et al. (2022). Digital games and ADHD – Frontiers in Psychiatry.',
  'Baptist Health (2024). ADHD timers for motivation and pacing.',
  'EndeavorRx (FDA-authorised) – video game therapy evidence for paediatric ADHD.',
  'PubMed E-utilities API for peer-reviewed research articles.',
  'NHS Website Content API v2 for official UK health guidance.',
]

export default function SourcesSection() {
  return (
    <div className="space-y-8">
      {/* Featured Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Featured resources</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jump to in-depth guides and downloadable toolkits:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {FEATURED_RESOURCES.map(resource => (
              <a
                key={resource.url}
                href={resource.url}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {resource.title}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources & Further Reading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sources &amp; further reading</CardTitle>
          <p className="text-sm text-muted-foreground">
            This hub draws from reputable UK and US health authorities, peer-reviewed research, 
            and evidence-based guidelines:
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {SOURCES.map((source, index) => (
              <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                <span>{source}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 text-sm">External Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://www.nice.org.uk/guidance/ng87"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                NICE NG87 Guideline
              </a>
              <a
                href="https://www.nhs.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                NHS.uk
              </a>
              <a
                href="https://www.cdc.gov/ncbddd/adhd/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                CDC ADHD Resources
              </a>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                PubMed
              </a>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-6 pt-6 border-t">
            <strong>Disclaimer:</strong> This blog provides educational information only and is not medical advice. 
            Always consult your GP, paediatrician, SENCO, or licensed clinician for diagnosis, treatment, 
            and personalised support. In emergencies, call 999 (UK) / 911 (US) or use NHS 111 / 988 Lifeline.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


