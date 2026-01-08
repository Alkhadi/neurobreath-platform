'use client'

import { Card } from '@/components/ui/card'
import { useUserContext } from '@/hooks/useAutismProgress'
import { ExternalLink } from 'lucide-react'

export function PathwaysSupport() {
  const { context } = useUserContext()

  const pathways = {
    uk: {
      title: 'UK Pathways & Support',
      sections: [
        {
          heading: 'SEND & EHCP Process',
          items: [
            'Request SEND assessment through school SENCO',
            'Prepare evidence: reports, observations, parent/child views',
            'EHCP assessment takes up to 20 weeks',
            'Annual reviews to update support',
            'Appeal rights if refused'
          ],
          links: [
            { text: 'SEND Code of Practice', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' },
            { text: 'IPSEA (legal advice)', url: 'https://www.ipsea.org.uk/' }
          ]
        },
        {
          heading: 'Diagnosis & Assessment',
          items: [
            'GP referral to community paediatrics or CAMHS',
            'Current NHS wait times: 12–24+ months in many areas',
            'Private assessment option (£1,000–£2,500)',
            'Right to Support referral scheme (some areas)'
          ],
          links: [
            { text: 'National Autistic Society guidance', url: 'https://www.autism.org.uk/' }
          ]
        }
      ]
    },
    us: {
      title: 'US Pathways & Support',
      sections: [
        {
          heading: 'IEP & 504 Plans',
          items: [
            'Request evaluation in writing to school district',
            'IEP for students needing specialized instruction',
            '504 Plan for accommodations without special education',
            'IDEA protects right to free appropriate public education (FAPE)',
            'Dispute resolution and mediation available'
          ],
          links: [
            { text: 'Parent Training & Information Centers', url: 'https://www.parentcenterhub.org/' },
            { text: 'Understood.org', url: 'https://www.understood.org/' }
          ]
        },
        {
          heading: 'Medicaid & Funding',
          items: [
            'Medicaid waiver programs for autism services',
            'State-specific autism insurance mandates',
            'Early intervention (0–3) through state programs',
            'Supplemental Security Income (SSI) eligibility'
          ],
          links: [
            { text: 'Autism Speaks Resource Guide', url: 'https://www.autismspeaks.org/tool-kit' }
          ]
        }
      ]
    },
    eu: {
      title: 'EU Pathways & Support',
      sections: [
        {
          heading: 'Country-Specific Systems',
          items: [
            'Education support varies by member state',
            'Check national autism organizations',
            'UN Convention on Rights of Persons with Disabilities applies',
            'EU disability card pilot (travel/culture access)'
          ],
          links: [
            { text: 'Autism-Europe country resources', url: 'https://www.autismeurope.org/' },
            { text: 'European Agency for SEN', url: 'https://www.european-agency.org/' }
          ]
        }
      ]
    }
  }

  const data = pathways[context.country]

  return (
    <section id="pathways" className="scroll-mt-24 py-16 md:py-20 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-700">Pathways</p>
          <h2 className="text-3xl font-bold text-gray-900">{data.title}</h2>
          <p className="text-gray-600">Practical signposting and what to do next.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.sections.map((section, i) => (
            <Card key={i} className="p-6 bg-white/80 backdrop-blur shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.heading}</h3>
              <ul className="space-y-2 mb-4 text-sm text-gray-700">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {section.links && section.links.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Resources:</h4>
                  {section.links.map((link, k) => (
                    <a
                      key={k}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

