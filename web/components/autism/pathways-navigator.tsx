'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, ExternalLink, Download, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { educationPathways, type EducationPathway } from '@/lib/data/education-pathways';

export function PathwaysNavigator() {
  const [selectedPathway, setSelectedPathway] = useState<EducationPathway>(educationPathways[0]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepComplete = (stepNumber: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepNumber)
        ? prev.filter(s => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const progressPercentage = (completedSteps.length / selectedPathway.steps.length) * 100;

  const exportPathway = () => {
    const content = `${selectedPathway.pathwayName.toUpperCase()}
${'='.repeat(80)}

${selectedPathway.shortDescription}

--- LEGAL BASIS ---
${selectedPathway.legalBasis}

--- WHO IS ELIGIBLE ---
${selectedPathway.whoIsEligible.map(e => `• ${e}`).join('\n')}

--- OVERVIEW ---
${selectedPathway.overview}

--- STEP-BY-STEP PROCESS ---

${selectedPathway.steps.map(step => `
STEP ${step.stepNumber}: ${step.title.toUpperCase()}
${'-'.repeat(70)}

Description: ${step.description}

Timeframe: ${step.timeframe}

Key Actions:
${step.keyActions.map(a => `  • ${a}`).join('\n')}

Tips:
${step.tips.map(t => `  ✓ ${t}`).join('\n')}

Common Pitfalls:
${step.commonPitfalls.map(p => `  ✗ ${p}`).join('\n')}

Resources:
${step.resources.map(r => `  • ${r.title}: ${r.url}`).join('\n')}
`).join('\n')}

--- YOUR RIGHTS ---
${selectedPathway.keyRights.map(r => `• ${r}`).join('\n')}

--- APPEAL PROCESS ---
${selectedPathway.appealProcess}

--- OFFICIAL RESOURCES ---
${selectedPathway.officialResources.map(r => `• ${r.title}: ${r.url}`).join('\n')}

Generated from NeuroBreath Autism Hub
Date: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPathway.id}-guide.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group pathways by country
  const ukPathways = educationPathways.filter(p => p.country === 'UK');
  const usPathways = educationPathways.filter(p => p.country === 'US');
  const euPathways = educationPathways.filter(p => p.country === 'EU');

  return (
    <div className="w-full">
      <section className="space-y-6">
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-emerald-200 dark:border-emerald-800">
          <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Education Pathways Navigator</CardTitle>
              <CardDescription className="mt-1">
                Step-by-step guides for UK SEND/EHCP, US IEP/504, and EU inclusive education systems
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="w-[84%] mx-auto">
          {/* Pathway Selection Tabs */}
          <Tabs defaultValue="uk" className="space-y-4" onValueChange={() => setCompletedSteps([])}>
            <TabsList className="flex w-full justify-center items-center gap-2 flex-wrap">
              <TabsTrigger value="uk" className="flex-1 min-w-[120px]">🇬🇧 UK</TabsTrigger>
              <TabsTrigger value="eu" className="flex-1 min-w-[120px]">🇪🇺 EU</TabsTrigger>
              <TabsTrigger value="us" className="flex-1 min-w-[120px]">🇺🇸 US</TabsTrigger>
            </TabsList>

            {/* UK Tab */}
            <TabsContent value="uk" className="space-y-4">
              <div className="grid gap-4">
                {ukPathways.map((pathway) => (
                  <Card
                    key={pathway.id}
                    className={`cursor-pointer transition-all ${
                      selectedPathway.id === pathway.id
                        ? 'ring-2 ring-emerald-500 border-emerald-500'
                        : 'hover:border-emerald-300'
                    }`}
                    onClick={() => {
                      setSelectedPathway(pathway);
                      setCompletedSteps([]);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{pathway.pathwayName}</CardTitle>
                      <CardDescription className="text-xs">
                        {pathway.shortDescription}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* EU Tab */}
            <TabsContent value="eu" className="space-y-4">
              <div className="grid gap-4">
                {euPathways.map((pathway) => (
                  <Card
                    key={pathway.id}
                    className={`cursor-pointer transition-all ${
                      selectedPathway.id === pathway.id
                        ? 'ring-2 ring-emerald-500 border-emerald-500'
                        : 'hover:border-emerald-300'
                    }`}
                    onClick={() => {
                      setSelectedPathway(pathway);
                      setCompletedSteps([]);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{pathway.pathwayName}</CardTitle>
                      <CardDescription className="text-xs">
                        {pathway.shortDescription}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* US Tab */}
            <TabsContent value="us" className="space-y-4">
              <div className="grid gap-4">
                {usPathways.map((pathway) => (
                  <Card
                    key={pathway.id}
                    className={`cursor-pointer transition-all ${
                      selectedPathway.id === pathway.id
                        ? 'ring-2 ring-emerald-500 border-emerald-500'
                        : 'hover:border-emerald-300'
                    }`}
                    onClick={() => {
                      setSelectedPathway(pathway);
                      setCompletedSteps([]);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{pathway.pathwayName}</CardTitle>
                      <CardDescription className="text-xs">
                        {pathway.shortDescription}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress Tracker */}
          {selectedPathway && (
            <Card className="border-2 border-emerald-300 dark:border-emerald-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedPathway.pathwayName}</CardTitle>
                    <CardDescription className="mt-1">
                      {completedSteps.length} of {selectedPathway.steps.length} steps completed
                    </CardDescription>
                  </div>
                  <Button onClick={exportPathway} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Guide
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {Math.round(progressPercentage)}% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pathway Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pathway Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Legal Basis</h4>
                <p className="text-sm text-muted-foreground">{selectedPathway.legalBasis}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Who Is Eligible</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedPathway.whoIsEligible.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Overview</h4>
                <p className="text-sm text-muted-foreground">{selectedPathway.overview}</p>
              </div>
            </CardContent>
          </Card>

          {/* Steps Accordion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step-by-Step Process</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {selectedPathway.steps.map((step, index) => (
                  <AccordionItem key={step.stepNumber} value={`step-${step.stepNumber}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepComplete(step.stepNumber);
                          }}
                          className="shrink-0 cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              toggleStepComplete(step.stepNumber);
                            }
                          }}
                        >
                          {completedSteps.includes(step.stepNumber) ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            Step {step.stepNumber}: {step.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {step.timeframe}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {/* Key Actions */}
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <span className="text-blue-600 dark:text-blue-400">•</span>
                          Key Actions
                        </h5>
                        <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                          {step.keyActions.map((action, i) => (
                            <li key={i} className="flex gap-2">
                              <span>•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          Tips for Success
                        </h5>
                        <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2">
                              <span>✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Common Pitfalls */}
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          Common Pitfalls to Avoid
                        </h5>
                        <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                          {step.commonPitfalls.map((pitfall, i) => (
                            <li key={i} className="flex gap-2">
                              <span>✗</span>
                              <span>{pitfall}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      {step.resources.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">Resources</h5>
                          <div className="space-y-1">
                            {step.resources.map((resource, i) => (
                              <a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                              >
                                {resource.title}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Key Rights */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">Your Key Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {selectedPathway.keyRights.map((right, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Appeal Process */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Appeal Process:</strong> {selectedPathway.appealProcess}
            </AlertDescription>
          </Alert>

          {/* Official Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Official Resources & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedPathway.officialResources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    {resource.title}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        </CardContent>
      </Card>
    </section>
    </div>
  );
}
