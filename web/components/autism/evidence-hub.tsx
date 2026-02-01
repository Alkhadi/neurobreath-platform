'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Globe, FileText } from 'lucide-react';

interface Resource {
  title: string;
  organization: string;
  description: string;
  url: string;
  topics?: string[];
}

const ukResources: Resource[] = [
  {
    title: 'NICE Autism Guideline (CG170)',
    organization: 'NICE',
    description: 'Evidence-based guidance on recognition, referral, diagnosis and management of autism in children and young people',
    url: 'https://www.nice.org.uk/guidance/cg170',
    topics: ['diagnosis', 'interventions', 'education']
  },
  {
    title: 'NICE Autism in Adults (CG142)',
    organization: 'NICE',
    description: 'Recognition, referral, diagnosis and management of autism in adults',
    url: 'https://www.nice.org.uk/guidance/cg142',
    topics: ['diagnosis', 'adults', 'workplace']
  },
  {
    title: 'NHS Autism Support',
    organization: 'NHS',
    description: 'Comprehensive information about autism, diagnosis pathways, and support services',
    url: 'https://www.nhs.uk/conditions/autism/',
    topics: ['diagnosis', 'support', 'symptoms']
  },
  {
    title: 'SEND Code of Practice',
    organization: 'DfE',
    description: 'Statutory guidance for organizations working with and supporting children and young people who have special educational needs',
    url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25',
    topics: ['education', 'EHCP', 'legal rights']
  },
  {
    title: 'GOV.UK SEND and Disability Resources',
    organization: 'GOV.UK',
    description: 'Official government guidance on SEND support in schools',
    url: 'https://www.gov.uk/children-with-special-educational-needs',
    topics: ['education', 'support', 'legal rights']
  },
  {
    title: 'National Autistic Society',
    organization: 'NAS',
    description: 'UK\'s leading autism charity providing information, support, and services',
    url: 'https://www.autism.org.uk/',
    topics: ['support', 'education', 'workplace', 'diagnosis']
  },
  {
    title: 'Autism Education Trust',
    organization: 'AET',
    description: 'Training and resources for schools supporting autistic children',
    url: 'https://www.autismeducationtrust.org.uk/',
    topics: ['education', 'teaching strategies']
  },
  {
    title: 'Education Endowment Foundation: SEND',
    organization: 'EEF',
    description: 'Evidence-based guidance for supporting pupils with SEND',
    url: 'https://educationendowmentfoundation.org.uk/',
    topics: ['education', 'evidence', 'interventions']
  }
];

const usResources: Resource[] = [
  {
    title: 'CDC Autism Information',
    organization: 'CDC',
    description: 'Data, statistics, screening tools, and resources about autism spectrum disorder',
    url: 'https://www.cdc.gov/autism/',
    topics: ['diagnosis', 'prevalence', 'screening']
  },
  {
    title: 'IDEA Individuals with Disabilities Education Act',
    organization: 'US Dept of Education',
    description: 'Federal law ensuring services to children with disabilities, including IEP requirements',
    url: 'https://sites.ed.gov/idea/',
    topics: ['education', 'IEP', 'legal rights']
  },
  {
    title: 'ADA Workplace Accommodations',
    organization: 'ADA',
    description: 'Americans with Disabilities Act guidance for workplace reasonable accommodations',
    url: 'https://www.ada.gov/',
    topics: ['workplace', 'legal rights', 'accommodations']
  },
  {
    title: 'Autism Speaks',
    organization: 'Autism Speaks',
    description: 'Resource guides, toolkits, and support for families',
    url: 'https://www.autismspeaks.org/',
    topics: ['support', 'diagnosis', 'resources']
  },
  {
    title: 'National Autistic Society of America',
    organization: 'NASA (not space!)',
    description: 'Advocacy and resources for autistic individuals and families',
    url: 'https://autisticsociety.org/',
    topics: ['support', 'advocacy']
  },
  {
    title: 'AFIRM Autism-Focused Intervention Resources',
    organization: 'UNC Chapel Hill',
    description: 'Evidence-based practices for autism from university research',
    url: 'https://afirm.fpg.unc.edu/',
    topics: ['interventions', 'evidence', 'education']
  }
];

const euResources: Resource[] = [
  {
    title: 'Autism-Europe',
    organization: 'Autism-Europe',
    description: 'European umbrella organization for autism associations promoting rights and quality services',
    url: 'https://www.autismeurope.org/',
    topics: ['advocacy', 'rights', 'Europe-wide']
  },
  {
    title: 'EASNIE: Inclusive Education',
    organization: 'EASNIE',
    description: 'European Agency for Special Needs and Inclusive Education',
    url: 'https://www.european-agency.org/',
    topics: ['education', 'inclusion', 'policy']
  },
  {
    title: 'WHO: Autism Spectrum Disorders',
    organization: 'WHO',
    description: 'World Health Organization guidance on autism globally',
    url: 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
    topics: ['diagnosis', 'global health', 'interventions']
  },
  {
    title: 'Autistica (UK-based, European reach)',
    organization: 'Autistica',
    description: 'Research charity funding autism science',
    url: 'https://www.autistica.org.uk/',
    topics: ['research', 'evidence', 'innovation']
  }
];

export function EvidenceHub() {
  const [selectedCountry, setSelectedCountry] = useState<'uk' | 'us' | 'eu'>('uk');

  return (
    <div className="w-full">
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-2 border-indigo-200 dark:border-indigo-900">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <div>
              <CardTitle>Evidence & Resources Hub</CardTitle>
              <CardDescription>
                Curated, trustworthy resources from official health and education organizations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      <CardContent>
        <Tabs value={selectedCountry} onValueChange={(val) => setSelectedCountry(val as 'uk' | 'us' | 'eu')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="uk"
              data-tour="nb:autism-hub:resources-uk"
              data-tour-order="5"
              data-tour-title="UK resources (NICE/NHS/SEND etc.)"
            >
              UK
            </TabsTrigger>
            <TabsTrigger value="us">US</TabsTrigger>
            <TabsTrigger
              value="eu"
              data-tour="nb:autism-hub:resources-international"
              data-tour-order="6"
              data-tour-title="International resources"
            >
              EU/International
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uk" className="space-y-4">
            {ukResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="us" className="space-y-4">
            {usResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="eu" className="space-y-4">
            {euResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </TabsContent>
        </Tabs>

        {/* PubMed Placeholder for Phase 2 */}
        <div
          className="mt-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
          data-tour="nb:autism-hub:pubmed-coming-soon"
          data-tour-order="7"
          data-tour-title="PubMed research (coming soon)"
          data-tour-placement="bottom"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">PubMed Research (Coming Soon)</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Phase 2 will include live PubMed integration with pre-set queries for:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-500 mt-2 space-y-1 list-disc list-inside">
            <li>Visual supports effectiveness</li>
            <li>AAC and PECS interventions</li>
            <li>Peer-mediated strategies</li>
            <li>Adapted CBT for autism</li>
            <li>Inclusive schooling outcomes</li>
          </ul>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p><strong>Quality Assurance:</strong> All resources are from official government health/education departments, established autism organizations, or peer-reviewed academic sources.</p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm break-words">{resource.title}</h4>
                <p className="text-xs text-muted-foreground break-words">{resource.organization}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground break-words">{resource.description}</p>
            {resource.topics && resource.topics.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {resource.topics.map(topic => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Visit {resource.title}</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
