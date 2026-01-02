'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, ExternalLink, BookOpen } from 'lucide-react';
import { getAllEvidenceSources } from '@/lib/data/adhd-evidence-registry';

interface Myth {
  id: string;
  myth: string;
  fact: string;
  category: 'diagnosis' | 'treatment' | 'education' | 'workplace' | 'general';
  evidenceIds: string[]; // References to evidence registry
  ageRelevance?: string;
}

const ADHD_MYTHS: Myth[] = [
  {
    id: 'myth_1',
    myth: 'ADHD is not a real medical condition',
    fact: 'ADHD is a recognized neurodevelopmental disorder with a strong neurobiological basis. It\'s classified in both DSM-5 (American Psychiatric Association) and ICD-11 (WHO), with decades of research supporting its validity. Brain imaging studies show structural and functional differences in individuals with ADHD.',
    category: 'diagnosis',
    evidenceIds: ['us_dsm5_adhd', 'uk_nice_ng87', 'us_cdc_adhd']
  },
  {
    id: 'myth_2',
    myth: 'ADHD only affects children and they will grow out of it',
    fact: 'ADHD persists into adulthood in approximately 50-60% of cases. Over 50% of adults with ADHD are diagnosed in adulthood. While hyperactivity may decrease with age, inattention and executive function challenges often continue. The DSM-5 specifically includes criteria for adult ADHD diagnosis.',
    category: 'diagnosis',
    evidenceIds: ['us_dsm5_adhd', 'us_cdc_adhd', 'pubmed_33528652'],
    ageRelevance: 'Adults, Adolescents'
  },
  {
    id: 'myth_3',
    myth: 'ADHD medication is dangerous and leads to substance abuse',
    fact: 'Research shows the opposite: ADHD medication has a robust protective effect against substance use disorders. A meta-analysis of multiple studies confirmed medication protects against mood disorders, suicidality, criminality, and substance abuse. Proper medication management reduces risks rather than increasing them.',
    category: 'treatment',
    evidenceIds: ['pubmed_32014701', 'pubmed_30097390', 'uk_nice_ng87']
  },
  {
    id: 'myth_4',
    myth: 'People with ADHD just need to try harder or be more disciplined',
    fact: 'ADHD involves neurobiological differences in brain structure and function, particularly in areas controlling executive functions like attention, impulse control, and working memory. "Trying harder" doesn\'t address the underlying neurological differences. Evidence-based treatments (medication, behavioral therapy, accommodations) are necessary.',
    category: 'general',
    evidenceIds: ['us_dsm5_adhd', 'pubmed_38178649', 'uk_nice_ng87']
  },
  {
    id: 'myth_5',
    myth: 'ADHD is caused by bad parenting or too much screen time',
    fact: 'ADHD has a strong genetic component (heritability 70-80%) and involves neurodevelopmental factors. While environmental factors can influence symptom severity, they don\'t cause ADHD. The CDC and NICE guidelines emphasize the neurobiological basis rather than parenting or lifestyle as primary causes.',
    category: 'diagnosis',
    evidenceIds: ['us_cdc_adhd', 'uk_nice_ng87', 'us_dsm5_adhd']
  },
  {
    id: 'myth_6',
    myth: 'Medication is the only treatment for ADHD',
    fact: 'While medication is highly effective, comprehensive ADHD treatment includes multiple approaches. For children aged 4-6, parent training is first-line treatment (NICE NG87, AAP 2019). For older children, combined medication and behavioral interventions are recommended. Adults benefit from CBT, workplace accommodations, and organizational strategies.',
    category: 'treatment',
    evidenceIds: ['uk_nice_ng87', 'us_aap_guideline', 'pubmed_36794797', 'pubmed_31411903']
  },
  {
    id: 'myth_7',
    myth: 'ADHD is overdiagnosed and everyone thinks they have it now',
    fact: 'Research suggests ADHD is actually under-recognized and under-diagnosed, particularly in girls, women, and adults. The NHS 2024 taskforce found ADHD is "under-recognized, under-diagnosed, and under-treated" in England, with waiting times of 4-8 years. Diagnostic criteria remain stringent (DSM-5 requires 6+ symptoms, onset before age 12, impairment in 2+ settings).',
    category: 'diagnosis',
    evidenceIds: ['uk_nhs_adhd', 'us_dsm5_adhd', 'us_adaa_anxiety']
  },
  {
    id: 'myth_8',
    myth: 'People with ADHD cannot succeed academically or professionally',
    fact: 'With appropriate support and accommodations, individuals with ADHD can excel in all areas. The UK Equality Act 2010 and US ADA require reasonable workplace adjustments. Research shows that with proper treatment and support, people with ADHD achieve comparable outcomes. Many successful professionals have ADHD and leverage their strengths like creativity and hyperfocus.',
    category: 'workplace',
    evidenceIds: ['uk_equality_act', 'pubmed_33528652', 'pubmed_36451126'],
    ageRelevance: 'Adults, Adolescents'
  },
  {
    id: 'myth_9',
    myth: 'ADHD means you cannot focus on anything',
    fact: 'ADHD involves difficulty regulating attention, not an inability to focus. People with ADHD can experience "hyperfocus" on activities they find engaging. The core challenge is controlling where attention goes and switching focus when needed. This is why environmental modifications and organizational strategies are evidence-based interventions.',
    category: 'general',
    evidenceIds: ['us_dsm5_adhd', 'pubmed_38178649', 'uk_nice_ng87']
  },
  {
    id: 'myth_10',
    myth: 'Behavioral interventions don\'t work for ADHD',
    fact: 'Behavioral interventions are highly effective, especially when combined with medication. A 2019 RCT found behavioral consultation reduced medication initiation by 50% and decreased total methylphenidate exposure by 40%. For preschool children (ages 4-6), parent training in behavior management is the first-line treatment per NICE and AAP guidelines.',
    category: 'treatment',
    evidenceIds: ['pubmed_31411903', 'uk_nice_ng87', 'us_aap_guideline']
  }
];

export function ADHDMythsFacts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const allSources = getAllEvidenceSources();

  const categories = [
    { value: 'all', label: 'All Myths', icon: '🔍' },
    { value: 'diagnosis', label: 'Diagnosis', icon: '🩺' },
    { value: 'treatment', label: 'Treatment', icon: '💊' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'workplace', label: 'Workplace', icon: '💼' },
    { value: 'general', label: 'General', icon: '📌' }
  ];

  const filteredMyths = selectedCategory === 'all'
    ? ADHD_MYTHS
    : ADHD_MYTHS.filter(m => m.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      diagnosis: 'bg-blue-100 text-blue-800 border-blue-200',
      treatment: 'bg-green-100 text-green-800 border-green-200',
      education: 'bg-purple-100 text-purple-800 border-purple-200',
      workplace: 'bg-orange-100 text-orange-800 border-orange-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors.general;
  };

  const getEvidenceSources = (evidenceIds: string[]) => {
    return evidenceIds
      .map(id => allSources.find(s => s.id === id))
      .filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ADHD Myths vs Facts</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Evidence-based facts debunking common ADHD misconceptions. All information cited from
          NICE NG87, NHS, CDC, AAP, DSM-5, and peer-reviewed research.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
            className="gap-2"
          >
            <span>{cat.icon}</span>
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Myths Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredMyths.map((item) => {
          const sources = getEvidenceSources(item.evidenceIds);
          
          return (
            <Card key={item.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge 
                    variant="outline" 
                    className={getCategoryColor(item.category)}
                  >
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </Badge>
                  {item.ageRelevance && (
                    <Badge variant="secondary" className="text-xs">
                      {item.ageRelevance}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                        Myth
                      </div>
                      <CardTitle className="text-lg font-semibold leading-snug">
                        {item.myth}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                        Fact
                      </div>
                      <CardDescription className="text-sm leading-relaxed text-foreground">
                        {item.fact}
                      </CardDescription>
                    </div>
                  </div>
                </div>

                {/* Evidence Sources */}
                {sources.length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      Evidence Sources
                    </div>
                    <div className="space-y-1">
                      {sources.map((source: any) => (
                        <div key={source.id} className="text-xs">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            <span className="font-medium">{source.organization}</span>
                            {source.country === 'UK' && <span className="text-xs">🇬🇧</span>}
                            {source.country === 'US' && <span className="text-xs">🇺🇸</span>}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          {source.pmid && (
                            <span className="ml-2 text-muted-foreground">
                              PMID: <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${source.pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {source.pmid}
                              </a>
                            </span>
                          )}
                          <div className="text-muted-foreground">
                            {source.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-muted/50 border-2">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{ADHD_MYTHS.length}</div>
              <div className="text-sm text-muted-foreground">Myths Debunked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Evidence Sources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">UK Sources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">PubMed Studies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Evidence-Based Information:</strong> All facts are supported by
            official UK guidelines (NICE NG87, NHS), US clinical guidelines (CDC, AAP, DSM-5), and
            peer-reviewed systematic reviews from PubMed. Click on sources to access original documentation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
