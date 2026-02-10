'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page/PageHeader';
import { Brain, Wind, Heart, TrendingUp, BookOpen, AlertCircle, Users, Stethoscope, ChevronDown, Activity, Sparkles } from 'lucide-react';
import { BreathingSuite } from '@/components/anxiety-tools/breathing-suite';
import { GroundingExercise } from '@/components/anxiety-tools/grounding-exercise';
import { CBTThoughtRecord } from '@/components/anxiety-tools/cbt-thought-record';
import { WorryScheduler } from '@/components/anxiety-tools/worry-scheduler';
import { MoodTracker } from '@/components/anxiety-tools/mood-tracker';
import { GratitudeJournal } from '@/components/anxiety-tools/gratitude-journal';
import { ExposureLadder } from '@/components/anxiety-tools/exposure-ladder';
import { PMRBodyScan } from '@/components/anxiety-tools/pmr-body-scan';
import { ProgressDashboard } from '@/components/anxiety-tools/progress-dashboard';
import { CrisisResources } from '@/components/anxiety-tools/crisis-resources';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';

const evidence = evidenceByRoute['/tools/anxiety-tools'];

export default function AnxietyToolsPage() {
  const [activeTab, setActiveTab] = useState('breathing');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <PageHeader 
            title="Anxiety Toolkit" 
            description="Evidence-based tools and strategies to calm the body and train the mind. Built with guidance from NHS, NICE, CDC, Mental Health Foundation, APA, NAMI, and peer-reviewed research."
            showMetadata
          />
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="#interactive-tools">
              <Button size="lg" className="px-8">
                <Wind className="mr-2 h-5 w-5" />
                Start Practicing
              </Button>
            </a>
            <a href="#crisis-help">
              <Button size="lg" variant="outline" className="px-8">
                <AlertCircle className="mr-2 h-5 w-5" />
                Crisis Resources
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <h2 className="text-3xl font-bold text-center mb-8">You're Not Alone</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-none">
              <div className="text-4xl font-bold text-blue-600 mb-2">1 in 5</div>
              <div className="text-sm text-muted-foreground">UK adults report anxiety symptoms weekly</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-none">
              <div className="text-4xl font-bold text-purple-600 mb-2">19.1%</div>
              <div className="text-sm text-muted-foreground">US adults experience anxiety disorders annually</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950 dark:to-orange-950 border-none">
              <div className="text-4xl font-bold text-pink-600 mb-2">31.9%</div>
              <div className="text-sm text-muted-foreground">Adolescents experience lifetime anxiety</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-none">
              <div className="text-4xl font-bold text-green-600 mb-2">Treatable</div>
              <div className="text-sm text-muted-foreground">With evidence-based interventions</div>
            </Card>
          </div>
        </div>
      </section>

      {/* What is Anxiety */}
      <section id="main-content" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-12">
            <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding Anxiety</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn to distinguish between normal anxiety and anxiety disorders
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Normal Anxiety vs. Anxiety Disorder
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">Normal anxiety</strong> is a natural response to stress or danger—it helps us stay alert and motivated. 
                It's temporary and proportionate to the situation.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Anxiety disorders</strong> involve excessive, persistent worry that interferes with daily life, 
                relationships, work, or school. The anxiety is disproportionate to the situation and difficult to control.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Common Signs & Symptoms
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Excessive worry that's hard to control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Restlessness, feeling on edge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Muscle tension, fatigue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Difficulty concentrating</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Sleep disturbances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Physical symptoms: rapid heartbeat, sweating, trembling</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Tools Hub */}
      <section id="interactive-tools" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Wellness Tools</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Nine evidence-based tools to help you manage anxiety, track your progress, and build lasting skills
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <TabsList className="inline-flex w-auto min-w-full justify-start h-auto flex-wrap gap-2 bg-transparent">
                <TabsTrigger 
                  value="breathing" 
                  className="flex-shrink-0 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Wind className="h-4 w-4 mr-2" />
                  Breathing
                </TabsTrigger>
                <TabsTrigger 
                  value="grounding" 
                  className="flex-shrink-0 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  5-4-3-2-1 Grounding
                </TabsTrigger>
                <TabsTrigger 
                  value="cbt" 
                  className="flex-shrink-0 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Thought Record
                </TabsTrigger>
                <TabsTrigger 
                  value="worry" 
                  className="flex-shrink-0 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                >
                  Worry Time
                </TabsTrigger>
                <TabsTrigger 
                  value="exposure" 
                  className="flex-shrink-0 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  Exposure Ladder
                </TabsTrigger>
                <TabsTrigger 
                  value="mood" 
                  className="flex-shrink-0 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  Mood Tracker
                </TabsTrigger>
                <TabsTrigger 
                  value="gratitude" 
                  className="flex-shrink-0 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Gratitude
                </TabsTrigger>
                <TabsTrigger 
                  value="pmr" 
                  className="flex-shrink-0 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                >
                  PMR
                </TabsTrigger>
                <TabsTrigger 
                  value="bodyscan" 
                  className="flex-shrink-0 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                >
                  Body Scan
                </TabsTrigger>
                <TabsTrigger 
                  value="progress" 
                  className="flex-shrink-0 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="breathing" className="mt-8">
              <BreathingSuite />
            </TabsContent>

            <TabsContent value="grounding" className="mt-8">
              <GroundingExercise />
            </TabsContent>

            <TabsContent value="cbt" className="mt-8">
              <CBTThoughtRecord />
            </TabsContent>

            <TabsContent value="worry" className="mt-8">
              <WorryScheduler />
            </TabsContent>

            <TabsContent value="exposure" className="mt-8">
              <ExposureLadder />
            </TabsContent>

            <TabsContent value="mood" className="mt-8">
              <MoodTracker />
            </TabsContent>

            <TabsContent value="gratitude" className="mt-8">
              <GratitudeJournal />
            </TabsContent>

            <TabsContent value="pmr" className="mt-8">
              <PMRBodyScan mode="pmr" />
            </TabsContent>

            <TabsContent value="bodyscan" className="mt-8">
              <PMRBodyScan mode="bodyscan" />
            </TabsContent>

            <TabsContent value="progress" className="mt-8">
              <ProgressDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Evidence-Based Research Section */}
      <section id="research" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Evidence-Based Knowledge</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive information about anxiety disorders, treatments, and evidence-based strategies
            </p>
          </div>

          <div className="space-y-4">
            {/* Types of Anxiety Disorders */}
            <Collapsible>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <h3 className="text-xl font-semibold text-left">Types of Anxiety Disorders</h3>
                  <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-lg mb-2">Generalized Anxiety Disorder (GAD)</h4>
                      <p className="text-sm text-muted-foreground">
                        Persistent, excessive worry about various life areas (work, health, family) for at least 6 months. 
                        <strong className="block mt-2 text-foreground">Prevalence:</strong> UK: 5.6% | US: 3.1% of adults
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-lg mb-2">Panic Disorder</h4>
                      <p className="text-sm text-muted-foreground">
                        Recurrent unexpected panic attacks—sudden surges of intense fear with physical symptoms (racing heart, sweating, chest pain, difficulty breathing).
                        <strong className="block mt-2 text-foreground">Prevalence:</strong> US: 2.7% of adults
                      </p>
                    </div>
                    <div className="border-l-4 border-pink-500 pl-4">
                      <h4 className="font-semibold text-lg mb-2">Social Anxiety Disorder (SAD)</h4>
                      <p className="text-sm text-muted-foreground">
                        Intense fear of social situations where scrutiny is possible. Fear of embarrassment or negative evaluation.
                        <strong className="block mt-2 text-foreground">Prevalence:</strong> US: 7.1% (12-month) | Often begins around age 13
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-lg mb-2">Specific Phobias</h4>
                      <p className="text-sm text-muted-foreground">
                        Intense, irrational fear of specific objects or situations (heights, animals, flying, blood, injections, enclosed spaces).
                        <strong className="block mt-2 text-foreground">Prevalence:</strong> US: 9.1% of adults
                      </p>
                    </div>
                    <div className="border-l-4 border-teal-500 pl-4">
                      <h4 className="font-semibold text-lg mb-2">Health Anxiety (Illness Anxiety Disorder)</h4>
                      <p className="text-sm text-muted-foreground">
                        Preoccupation with having or acquiring a serious illness despite minimal or no symptoms. 
                        Characterized by high health anxiety and excessive checking or avoidance of medical care.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Evidence-Based Techniques */}
            <Collapsible>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <h3 className="text-xl font-semibold text-left">Evidence-Based Techniques</h3>
                  <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Wind className="h-5 w-5 text-blue-600" />
                        Breathing Techniques
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Meta-analysis shows medium effect size (d=-0.42)</strong> for reducing anxiety. 
                        Optimal breathing rate: 5-6 breaths per minute.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong className="text-foreground">Box Breathing (4-4-4-4):</strong> Stabilizes nervous system, used by Navy SEALs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong className="text-foreground">4-7-8 Breathing:</strong> Extended exhale activates parasympathetic response</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong className="text-foreground">Coherent Breathing (5-5):</strong> Maximizes heart rate variability (HRV)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Cognitive Behavioral Therapy (CBT)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Gold standard treatment</strong> with moderate effect sizes (g=0.56 vs placebo). 
                        CBT includes psychoeducation, cognitive restructuring, exposure therapy, and behavioral activation. 
                        Typically delivered in 12-20 sessions. Effective for GAD, panic disorder, social anxiety, and specific phobias.
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">🧘 Mindfulness-Based Cognitive Therapy (MBCT)</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Non-inferior to CBT for GAD.</strong> 8-week structured program with daily practice. 
                        Reduces rumination and increases present-moment awareness. Particularly effective for preventing anxiety relapse.
                      </p>
                    </div>
                    
                    <div className="bg-pink-50 dark:bg-pink-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">🪜 Exposure Therapy</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Gold standard for phobias, OCD, and PTSD.</strong> Gradual, systematic confrontation of fears 
                        in a safe environment. Creates new safety learning that competes with fear associations. Can be done in vivo (real-life), 
                        imaginal, or using virtual reality.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">🏃 Exercise</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Medium anxiolytic effect (d=-0.42).</strong> Higher intensity = greater benefits. 
                        <strong className="block mt-2 text-foreground">Recommendation:</strong> 20-30 minutes, 3-5 times per week, 
                        moderate-vigorous aerobic activity (running, cycling, swimming).
                      </p>
                    </div>
                    
                    <div className="bg-violet-50 dark:bg-violet-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">😴 Sleep Hygiene</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Bidirectional relationship with anxiety.</strong> Poor sleep worsens anxiety; anxiety disrupts sleep.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Consistent sleep schedule (same time every day)</li>
                        <li>• Cool, dark room (60-67°F / 16-19°C)</li>
                        <li>• No screens 1-2 hours before bed</li>
                        <li>• Avoid caffeine after 2pm</li>
                        <li>• Relaxing wind-down routine</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">🥗 Nutrition & Gut-Brain Axis</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">95% of serotonin is produced in the gut.</strong> Mediterranean diet associated with 
                        lower anxiety rates.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Include:</strong> Fiber, probiotics (yogurt, kefir), omega-3s (fish, walnuts), 
                        polyphenols (berries, dark chocolate)
                        <br />
                        <strong className="text-foreground">Limit:</strong> Processed foods, excess caffeine (&gt;400mg/day), alcohol
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Professional Help */}
            <Collapsible>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    When to Seek Professional Help
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="bg-red-50 dark:bg-red-950 p-6 rounded-lg border-l-4 border-red-600">
                      <h4 className="font-semibold text-lg mb-3 text-red-600 dark:text-red-400">
                        Red Flags - See a GP/Doctor if:
                      </h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Anxiety interferes with work, school, relationships, or daily activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Physical symptoms (chest pain, dizziness, shortness of breath) causing distress</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Panic attacks occurring regularly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Avoidance behavior significantly limiting your life</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Self-medicating with alcohol or drugs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Thoughts of self-harm or suicide</strong></span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Therapy Options</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                          <h5 className="font-semibold mb-2">Cognitive Behavioral Therapy (CBT)</h5>
                          <p className="text-sm text-muted-foreground">Gold standard, 12-20 sessions, focuses on thought patterns and behaviors</p>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                          <h5 className="font-semibold mb-2">Acceptance and Commitment Therapy (ACT)</h5>
                          <p className="text-sm text-muted-foreground">Focus on psychological flexibility and living according to values</p>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                          <h5 className="font-semibold mb-2">MBCT</h5>
                          <p className="text-sm text-muted-foreground">Mindfulness-based, 8-week program, prevents relapse</p>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                          <h5 className="font-semibold mb-2">Exposure Therapy</h5>
                          <p className="text-sm text-muted-foreground">For phobias, OCD, PTSD - gradual confrontation of fears</p>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Finding a Therapist</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="font-semibold mb-2 text-blue-600">🇬🇧 United Kingdom</p>
                          <ul className="text-sm space-y-2">
                            <li><strong>NHS Talking Therapies (IAPT):</strong> Self-referral, free, evidence-based</li>
                            <li><strong>BACP:</strong> British Association for Counselling & Psychotherapy - bacp.co.uk</li>
                            <li><strong>Private therapy:</strong> Typical £50-150 per session</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2 text-blue-600">🇺🇸 United States</p>
                          <ul className="text-sm space-y-2">
                            <li><strong>Psychology Today:</strong> Comprehensive therapist finder - psychologytoday.com</li>
                            <li><strong>ADAA:</strong> Anxiety and Depression Association therapist directory - adaa.org</li>
                            <li><strong>Insurance:</strong> Coverage varies; check your plan for mental health benefits</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">Medication Overview</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">First-line medications:</strong> SSRIs (sertraline, escitalopram, paroxetine). 
                        Takes 4-8 weeks for full therapeutic effect. Continue 6-12 months after remission to prevent relapse.
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Second-line:</strong> SNRIs (venlafaxine, duloxetine), pregabalin.
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Benzodiazepines:</strong> Only for short-term crisis management (2-4 weeks maximum) 
                        due to dependence risk and cognitive side effects.
                      </p>
                      <p className="text-sm text-muted-foreground italic border-l-4 border-blue-600 pl-4">
                        <strong className="text-foreground not-italic">Important:</strong> Medication decisions should always be made with a 
                        healthcare provider considering your individual situation, medical history, and potential interactions.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Age-Specific Guidance */}
            <Collapsible>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <h3 className="text-xl font-semibold text-left">Age-Specific Considerations</h3>
                  <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">👶 Children & Adolescents</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Prevalence:</strong> 20.3% of 8-16 year-olds in UK have probable mental disorder (2023). 
                        Screening recommended for ages 8-18.
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Treatment:</strong> CBT is most effective for ages 7-17. SSRIs considered for 
                        moderate-severe anxiety. Combined CBT + SSRI shows best outcomes for severe cases.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">School accommodations:</strong> IEPs/504 plans, extended time on tests, 
                        quiet spaces for breaks, modified assignments, preferential seating.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">👨‍💼 Adults</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Peak onset:</strong> 18-44 years. Common triggers include work stress, 
                        relationship challenges, life transitions, financial pressures, and major life events.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Treatment:</strong> CBT, medication (SSRIs/SNRIs), lifestyle interventions 
                        (exercise, sleep, nutrition). Important to address comorbidities like depression, ADHD, or substance use.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">👵 Older Adults (65+)</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Often underrecognized.</strong> Contributing factors: bereavement, chronic medical conditions, 
                        fear of falling, social isolation, cognitive decline concerns.
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong className="text-foreground">Treatment adaptations:</strong> CBT remains effective with slower pace, 
                        written materials for memory support, and shorter sessions if needed.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Medications:</strong> "Start low, go slow" approach. Avoid benzodiazepines due to 
                        fall risk and cognitive impairment. Exercise interventions like walking and Tai Chi reduce both anxiety and fall risk.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* For Parents, Teachers, Carers */}
            <Collapsible>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <h3 className="text-xl font-semibold text-left flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guidance for Parents, Teachers & Carers
                  </h3>
                  <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">👨‍👩‍👧 For Parents</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-sm mb-2">Recognizing anxiety in children:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Frequent stomachaches or headaches without medical cause</li>
                            <li>• School avoidance, separation difficulties, clinginess</li>
                            <li>• Excessive reassurance-seeking</li>
                            <li>• Irritability, emotional meltdowns, perfectionism</li>
                            <li>• Sleep difficulties, nightmares</li>
                            <li>• Social withdrawal, difficulty with peer relationships</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-2">How to help:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong className="text-foreground">Validate feelings:</strong> "I can see you're worried" instead of "Don't worry"</li>
                            <li>• <strong className="text-foreground">Encourage gradual exposure:</strong> Don't enable complete avoidance</li>
                            <li>• <strong className="text-foreground">Model calm coping:</strong> Show how you manage your own stress</li>
                            <li>• <strong className="text-foreground">Maintain routines:</strong> Predictability reduces anxiety</li>
                            <li>• <strong className="text-foreground">Limit reassurance:</strong> Excessive reassurance increases dependence</li>
                            <li>• <strong className="text-foreground">Praise brave behavior:</strong> Acknowledge attempts, not just successes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">👩‍🏫 For Teachers</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-sm mb-2">Classroom strategies:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong className="text-foreground">Create predictable environment:</strong> Visual schedules, advance notice of changes</li>
                            <li>• <strong className="text-foreground">Offer breaks:</strong> Quiet corner for self-regulation, movement breaks</li>
                            <li>• <strong className="text-foreground">Break down tasks:</strong> Large assignments into smaller, manageable steps</li>
                            <li>• <strong className="text-foreground">Normalize mistakes:</strong> Emphasize effort and learning over perfection</li>
                            <li>• <strong className="text-foreground">Flexible participation:</strong> Never force without support; offer alternatives</li>
                            <li>• <strong className="text-foreground">Private check-ins:</strong> Discreet communication about anxiety triggers</li>
                            <li>• <strong className="text-foreground">Seating considerations:</strong> Near supportive peers, away from distractions</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground italic">
                            <strong className="text-foreground not-italic">Remember:</strong> Accommodations empower students; 
                            they don't create learned helplessness when balanced with appropriate challenges.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">🤝 For Carers</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-sm mb-2">Supporting someone with anxiety:</p>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• <strong className="text-foreground">Educate yourself:</strong> Learn about their specific anxiety disorder</li>
                            <li>• <strong className="text-foreground">Be patient:</strong> Recovery is gradual with inevitable setbacks</li>
                            <li>• <strong className="text-foreground">Encourage treatment:</strong> Support therapy attendance and medication adherence</li>
                            <li>• <strong className="text-foreground">Balance support:</strong> Help without enabling complete avoidance</li>
                            <li>• <strong className="text-foreground">Practice active listening:</strong> Listen without judgment or immediate advice</li>
                            <li>• <strong className="text-foreground">Recognize progress:</strong> Celebrate small wins and brave attempts</li>
                            <li>• <strong className="text-foreground">Set boundaries:</strong> It's okay to have limits on reassurance</li>
                          </ul>
                        </div>
                        <div className="bg-white/50 dark:bg-black/20 p-4 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">⚠️ Caregiver self-care:</strong> Caregiver burnout is real. 
                            Take breaks, maintain your own activities, seek support groups, and consider therapy for yourself if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* Crisis Resources Section */}
      <section id="crisis-help" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Crisis Resources</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Free, confidential support available 24/7 if you're in crisis or need immediate help
            </p>
          </div>
          <CrisisResources />
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-8 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 border-t">
        <div className="mx-auto text-center space-y-4 w-[86vw] max-w-[86vw]">
          <p className="text-sm text-muted-foreground max-w-4xl mx-auto">
            <strong className="text-foreground">Medical Disclaimer:</strong> This platform provides educational information and self-help tools. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or 
            qualified mental health provider with any questions regarding a medical condition. If you are in crisis or experiencing thoughts 
            of self-harm, please contact emergency services or a crisis helpline immediately.
          </p>
          <p className="text-sm text-muted-foreground">
            Content based on evidence from NHS, NICE Guidelines, Mental Health Foundation, American Psychological Association (APA), 
            National Alliance on Mental Illness (NAMI), National Institute of Mental Health (NIMH), Anxiety and Depression Association 
            of America (ADAA), and peer-reviewed research (2024-2025).
          </p>
        </div>
      </footer>

      {/* Evidence Sources */}
      <section className="py-12 px-4 bg-white">
        <div className="mx-auto w-[86vw] max-w-[86vw]">
          <EvidenceFooter evidence={evidence} />
        </div>
      </section>
    </main>
  );
}
