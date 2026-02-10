'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Award } from 'lucide-react';
import Link from 'next/link';

export default function EvidencePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <Award className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Evidence-Based Approach</h1>
              <p className="text-lg text-slate-700 mb-4">
                How NeuroBreath is built on science, research, and expert knowledge.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Research-Backed</div>
                  <div className="text-lg font-bold text-blue-600">100%</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Expert Review</div>
                  <div className="text-lg font-bold text-blue-600">Ongoing</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Transparent</div>
                  <div className="text-lg font-bold text-blue-600">Always</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="text-xs sm:text-base">
                Overview
              </TabsTrigger>
              <TabsTrigger value="sources" className="text-xs sm:text-base">
                Sources
              </TabsTrigger>
              <TabsTrigger value="methods" className="text-xs sm:text-base">
                Methods
              </TabsTrigger>
              <TabsTrigger value="commitments" className="text-xs sm:text-base">
                Our Commitments
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Why Evidence Matters</CardTitle>
                    <CardDescription>What makes advice trustworthy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">
                      When managing mental health and neurodivergence, you deserve recommendations based on science, not guesswork. Every tool, strategy, and resource in NeuroBreath is selected because:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span><strong>Research supports it:</strong> Multiple studies show effectiveness</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span><strong>Experts recommend it:</strong> Clinical guidelines, professional bodies endorse it</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span><strong>Real people use it:</strong> Community feedback validates effectiveness</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span><strong>It's safe:</strong> We screen for contraindications and safety concerns</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>NeuroBreath's Evidence Foundation</CardTitle>
                    <CardDescription>What we're built on</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Neuroscience of ADHD & Autism</h4>
                        <p className="text-sm text-slate-600 mt-1">Research on executive function, sensory processing, emotional regulation, and neurotypical differences</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Psychological Interventions</h4>
                        <p className="text-sm text-slate-600 mt-1">Cognitive-behavioral therapy (CBT), dialectical behavior therapy (DBT), and emotion regulation techniques</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Clinical Guidelines</h4>
                        <p className="text-sm text-slate-600 mt-1">NHS, NICE, CDC, DSM-5, and international professional standards for mental health and neurodivergence</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Wellbeing & Self-Care</h4>
                        <p className="text-sm text-slate-600 mt-1">Sleep science, exercise physiology, stress management research, and positive psychology</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Community Feedback</h4>
                        <p className="text-sm text-slate-600 mt-1">Lived experience from neurodivergent individuals, parents, and professionals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What We Don't Do</CardTitle>
                    <CardDescription>Maintaining scientific integrity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p>✗ We don't promote unproven "cures" or miracle treatments</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p>✗ We don't claim to replace professional medical care</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p>✗ We don't make medication recommendations</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p>✗ We don't dismiss personal experience or intuition</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p>✗ We don't make promises about what will or won't work for you</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sources Tab */}
            <TabsContent value="sources">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Research Sources</CardTitle>
                    <CardDescription>Organizations and publications we rely on</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">NHS (UK)</h4>
                        <p className="text-sm text-slate-600 mt-1">Clinical guidelines for mental health, neurodivergence diagnosis, and treatment recommendations</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">NICE (National Institute for Health and Care Excellence)</h4>
                        <p className="text-sm text-slate-600 mt-1">Evidence-based clinical guidelines for ADHD (NG87), Autism (NG167), depression, anxiety, PTSD</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">CDC (Centers for Disease Control)</h4>
                        <p className="text-sm text-slate-600 mt-1">Mental health data, sleep guidelines, stress management recommendations</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">PubMed & Medical Research</h4>
                        <p className="text-sm text-slate-600 mt-1">Peer-reviewed research on neurodivergence, sleep, anxiety, depression, trauma, and interventions</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Diagnostic Manuals (DSM-5, ICD-11)</h4>
                        <p className="text-sm text-slate-600 mt-1">Professional diagnostic criteria and frameworks for mental health and neurodivergence</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Professional Organizations</h4>
                        <p className="text-sm text-slate-600 mt-1">American Psychological Association (APA), British Psychological Society (BPS), ADHD organizations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How We Update Information</CardTitle>
                    <CardDescription>Staying current with evidence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>Regular review of new research and clinical guidelines</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>Expert consultation on emerging evidence</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>Community feedback to identify gaps</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>Transparent changelog when information changes</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>Last-updated dates on all content</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Methods Tab */}
            <TabsContent value="methods">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Our Content Methodology</CardTitle>
                    <CardDescription>How we create trustworthy information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">1. Research Phase</h4>
                        <p className="text-sm text-slate-600 mt-1">Review peer-reviewed literature, clinical guidelines, and expert consensus</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">2. Expert Review</h4>
                        <p className="text-sm text-slate-600 mt-1">Content reviewed by qualified professionals in relevant fields</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">3. Community Input</h4>
                        <p className="text-sm text-slate-600 mt-1">Feedback from neurodivergent individuals and families ensures practical relevance</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">4. Accessibility Review</h4>
                        <p className="text-sm text-slate-600 mt-1">Ensure content is understandable to diverse audiences</p>
                      </div>

                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">5. Publication & Dating</h4>
                        <p className="text-sm text-slate-600 mt-1">All content is dated and attributed. Regular updates maintain accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transparency & Limitations</CardTitle>
                    <CardDescription>We acknowledge what we don't know</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-slate-700 mb-3">
                        Science evolves. We:
                      </p>
                      <ul className="space-y-1 text-sm text-slate-700">
                        <li>• Acknowledge gaps in current research</li>
                        <li>• State when recommendations have limited evidence</li>
                        <li>• Encourage seeking professional advice for complex situations</li>
                        <li>• Update content when evidence changes</li>
                        <li>• Share contradictory research when it exists</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Commitments Tab */}
            <TabsContent value="commitments">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Our Commitments to You</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Scientific Integrity</h4>
                        <p className="text-sm text-slate-600 mt-1">We base recommendations on the best available evidence. When evidence is limited, we say so.</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Neurodiversity Affirmation</h4>
                        <p className="text-sm text-slate-600 mt-1">We support neurodivergent individuals in thriving as themselves, not "fixing" them into neurotypical patterns.</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Respect for Autonomy</h4>
                        <p className="text-sm text-slate-600 mt-1">You know yourself best. We provide information; you decide what works for you.</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Inclusivity</h4>
                        <p className="text-sm text-slate-600 mt-1">Our tools and information serve diverse neurodivergent individuals, families, educators, and professionals.</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Transparency</h4>
                        <p className="text-sm text-slate-600 mt-1">You can see our sources, understand our methods, and access our evidence policy.</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Continuous Improvement</h4>
                        <p className="text-sm text-slate-600 mt-1">We evolve as research advances and as we learn from community feedback.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Questions About Our Evidence?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-700 text-sm">
                      We're committed to transparency. If you want to know the evidence behind a specific recommendation or have questions about our approach:
                    </p>
                    <Link href="/contact">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Get in Touch
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
