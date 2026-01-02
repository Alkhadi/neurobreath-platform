'use client';

import { BookOpen, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReferenceGroup {
  title: string;
  refs: { text: string; url: string; pmid?: string }[];
}

const referenceGroups: ReferenceGroup[] = [
  {
    title: 'NICE Guidelines (UK)',
    refs: [
      {
        text: 'NICE CG170: Autism spectrum disorder in under 19s - support and management',
        url: 'https://www.nice.org.uk/guidance/cg170'
      },
      {
        text: 'NICE CG128: Autism spectrum disorder in under 19s - recognition, referral and diagnosis',
        url: 'https://www.nice.org.uk/guidance/cg128'
      },
      {
        text: 'NICE CG142: Autism spectrum disorder in adults - diagnosis and management',
        url: 'https://www.nice.org.uk/guidance/cg142'
      }
    ]
  },
  {
    title: 'UK Government & Education Resources',
    refs: [
      {
        text: 'GOV.UK PINS (Partnerships for Inclusion of Neurodiversity in Schools)',
        url: 'https://www.gov.uk/guidance/partnerships-for-inclusion-of-neurodiversity-in-schools-pins'
      },
      {
        text: 'DfE SEND Code of Practice (0-25) - Updated September 2024',
        url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25'
      },
      {
        text: 'EEF Special Educational Needs in Mainstream Schools guidance',
        url: 'https://d2tic4wvo1iusb.cloudfront.net/eef-guidance-reports/send/EEF_Special_Educational_Needs_in_Mainstream_Schools_Guidance_Report.pdf'
      }
    ]
  },
  {
    title: 'Autism Education Trust (AET)',
    refs: [
      {
        text: 'AET Good Autism Practice training modules',
        url: 'https://www.autismeducationtrust.org.uk/resources'
      },
      {
        text: 'AET Practitioner Guidance',
        url: 'https://www.autismeducationtrust.org.uk/resources/practitioner-guidance'
      }
    ]
  },
  {
    title: 'NHS Resources',
    refs: [
      {
        text: 'NHS Inform - Autistic Spectrum Disorder overview',
        url: 'https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/autistic-spectrum-disorder-asd/'
      },
      {
        text: 'NHS - Autism support and services',
        url: 'https://www.nhs.uk/conditions/autism/support/'
      }
    ]
  },
  {
    title: 'US Resources (CDC & National Organizations)',
    refs: [
      {
        text: 'CDC Autism Data and Statistics',
        url: 'https://www.cdc.gov/autism/data-research/'
      },
      {
        text: 'CDC MMWR Autism Prevalence Reports',
        url: 'https://www.cdc.gov/mmwr/volumes/72/ss/ss7202a1.htm'
      },
      {
        text: 'Autism Society - Resources and Support',
        url: 'https://www.autism-society.org/'
      }
    ]
  },
  {
    title: 'European Resources',
    refs: [
      {
        text: 'Autism-Europe - Rights and Support',
        url: 'https://www.autismeurope.org/'
      },
      {
        text: 'European Agency for Special Needs and Inclusive Education',
        url: 'https://www.european-agency.org/'
      }
    ]
  },
  {
    title: 'Peer-Reviewed Research (PubMed)',
    refs: [
      {
        text: 'Visual Activity Schedules as evidence-based practice',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25355388/',
        pmid: '25355388'
      },
      {
        text: 'Visual supports scoping review (home/community)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38300059/',
        pmid: '38300059'
      },
      {
        text: 'PECS teacher training RCT',
        url: 'https://pubmed.ncbi.nlm.nih.gov/36220979/',
        pmid: '36220979'
      },
      {
        text: 'PECS effects summary evidence',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31667826/',
        pmid: '31667826'
      },
      {
        text: 'Peer-mediated interventions systematic review',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4881558/'
      },
      {
        text: 'Digital activity schedules systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39370459/',
        pmid: '39370459'
      },
      {
        text: 'Anxiety treatments in autistic children - systematic review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38862906/',
        pmid: '38862906'
      },
      {
        text: 'School-based inclusion interventions systematic review',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11408347/'
      }
    ]
  }
];

export const References = () => {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Evidence Base & References</h2>
        </div>

        <p className="text-muted-foreground mb-8 max-w-3xl">
          All strategies and information on this page are drawn from evidence-based sources including
          NICE guidelines, NHS resources, government education guidance, and peer-reviewed research.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {referenceGroups?.map?.((group) => (
            <Card key={group?.title} className="p-5 flex flex-col h-full">
              <h3 className="text-lg font-semibold mb-3">{group?.title}</h3>
              <ul className="space-y-2">
                {group?.refs?.map?.((ref, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1 flex-shrink-0">•</span>
                    <div className="flex-1 min-w-0">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-left text-sm break-words whitespace-normal leading-snug"
                        onClick={() => window?.open?.(ref?.url, '_blank')}
                      >
                        <span className="break-words">{ref?.text}</span>
                        <ExternalLink className="inline-block h-3 w-3 ml-1 flex-shrink-0" />
                      </Button>
                      {ref?.pmid && (
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          (PMID: {ref?.pmid})
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
