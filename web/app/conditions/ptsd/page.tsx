'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Brain, Shield, Heart, Zap, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PTSDPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
            <div>
              <Badge className="mb-2 bg-white/20">Mental Health Support</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Understanding PTSD in Neurodivergent Individuals</h1>
              <p className="text-lg text-indigo-100 mb-6">
                Post-Traumatic Stress Disorder (PTSD) is treatable. This guide combines evidence-based practices with NeuroBreath tools to support your recovery journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Neurodivergent Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">32%</div>
              <p className="text-xs text-slate-500 mt-1">Autistic adults with probable PTSD vs 4% general population</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">ADHD Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">9x</div>
              <p className="text-xs text-slate-500 mt-1">Higher odds of PTSD with ADHD diagnosis</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Treatable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">Yes</div>
              <p className="text-xs text-slate-500 mt-1">Evidence-based therapies show high efficacy</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
            <TabsTrigger value="tracking">Progress</TabsTrigger>
            <TabsTrigger value="resources">Evidence</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What is PTSD?</CardTitle>
                <CardDescription>Understanding the condition and how it manifests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Post-Traumatic Stress Disorder (PTSD) is a mental health condition that develops after experiencing or witnessing a traumatic event. Only 5-10% of people exposed to trauma develop PTSD, but the rate is significantly higher in neurodivergent populations.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-3">Four Key Symptom Categories:</h4>
                  <ul className="space-y-2 text-indigo-800">
                    <li className="flex gap-2">
                      <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span><strong>Intrusive Memories</strong> – Unwanted flashbacks, nightmares, distressing recollections</span>
                    </li>
                    <li className="flex gap-2">
                      <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span><strong>Avoidance</strong> – Staying away from people, places, thoughts associated with trauma</span>
                    </li>
                    <li className="flex gap-2">
                      <Brain className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span><strong>Negative Thinking</strong> – Persistent negative beliefs, shame, feeling detached</span>
                    </li>
                    <li className="flex gap-2">
                      <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span><strong>Hyperarousal</strong> – Being easily startled, hypervigilant, irritable, sleep problems</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Neurodivergent Individuals Are at Higher Risk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Increased Exposure to Trauma</h4>
                    <p className="text-slate-600">70% of autistic adults report sexual victimization after age 14 vs 45% in non-autistic peers. Bullying, abuse, and social rejection occur at higher rates.</p>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-4">
                    <h4 className="font-semibold">Heightened Stress Response</h4>
                    <p className="text-slate-600">Many neurodivergent individuals have more reactive nervous systems with reduced ability to adapt to stress. This makes lasting fear responses more likely.</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold">Sensory Intensity</h4>
                    <p className="text-slate-600">ADHD and autism often involve sensory sensitivities. Traumatic memories can be encoded with extreme sensory detail, making them more intrusive and triggering.</p>
                  </div>
                  <div className="border-l-4 border-rose-500 pl-4">
                    <h4 className="font-semibold">Chronic Daily Stress</h4>
                    <p className="text-slate-600">Living in a world not designed for neurodivergent minds—constant masking, misunderstanding, lack of support—creates accumulated trauma.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PTSD in Autism vs ADHD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-3">In Autistic Individuals</h4>
                    <ul className="space-y-1 text-sm text-purple-800">
                      <li>• ~32% meet PTSD criteria vs 4% general population</li>
                      <li>• Detail-oriented memory intensifies flashbacks</li>
                      <li>• Sensory triggers are highly potent</li>
                      <li>• May present as increased stimming or meltdowns</li>
                      <li>• Camouflaged autism increases PTSD risk</li>
                    </ul>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-900 mb-3">In ADHD Individuals</h4>
                    <ul className="space-y-1 text-sm text-pink-800">
                      <li>• ~15% prevalence of PTSD (8–12% lifetime)</li>
                      <li>• Impulsivity may increase trauma exposure risk</li>
                      <li>• Difficulty with fear extinction (staying in 'alert' state)</li>
                      <li>• Sleep disturbances compound hyperarousal</li>
                      <li>• ADHD meds may help with fear extinction</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Toolkit Tab */}
          <TabsContent value="toolkit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practical Grounding Techniques</CardTitle>
                <CardDescription>Evidence-based methods to return to the present moment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">5-4-3-2-1 Technique</h4>
                    <p className="text-sm text-blue-800 mb-3">Engage all five senses to anchor yourself in the present.</p>
                    <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                      <li>Name 5 things you can see</li>
                      <li>Name 4 things you can touch/feel</li>
                      <li>Name 3 things you can hear</li>
                      <li>Name 2 things you can smell</li>
                      <li>Name 1 thing you can taste</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Box Breathing</h4>
                    <p className="text-sm text-green-800 mb-3">Calms the nervous system by regulating breath.</p>
                    <ol className="text-sm text-green-800 space-y-1 ml-4 list-decimal">
                      <li>Breathe in for 4 counts</li>
                      <li>Hold for 4 counts</li>
                      <li>Breathe out for 4 counts</li>
                      <li>Hold for 4 counts</li>
                      <li>Repeat 5-10 times</li>
                    </ol>
                    <Link href="/techniques/box-breathing">
                      <Button variant="outline" size="sm" className="mt-3">
                        Try Interactive Tool
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Cold Water Immersion</h4>
                    <p className="text-sm text-purple-800">The dive response can interrupt panic:</p>
                    <ul className="text-sm text-purple-800 space-y-1 ml-4 list-disc mt-2">
                      <li>Splash cold water on face, or hold ice cubes</li>
                      <li>This triggers the parasympathetic nervous system</li>
                      <li>Provides immediate relief during flashbacks</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">Bilateral Stimulation</h4>
                    <p className="text-sm text-amber-800">Used in EMDR therapy, helpful for processing trauma:</p>
                    <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc mt-2">
                      <li>Cross-lateral tapping: alternately tap left & right knee</li>
                      <li>Eye movement: follow a moving finger side-to-side</li>
                      <li>Helps integrate traumatic memories</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sleep Hygiene for Trauma Recovery</CardTitle>
                <CardDescription>Quality sleep is essential; PTSD often disrupts it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Consistent schedule:</strong> Aim for the same bedtime every night to regulate your nervous system</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Bedroom safety:</strong> Cool, dark, quiet space. Use curtains or blackout blinds if hypervigilant</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Grounding ritual:</strong> 15 min of gentle breathing before bed</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Avoid screens 1 hour before bed:</strong> Blue light can dysregulate circadian rhythm</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Keep a journal by the bed:</strong> Write worries/intrusive thoughts to externalize them</span>
                  </li>
                </ul>
                <Link href="/tools/sleep">
                  <Button variant="outline" className="mt-4">
                    Explore Sleep Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journaling & Processing Trauma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
                  <h4 className="font-semibold text-sky-900 mb-2">Structured Journaling Prompts</h4>
                  <ul className="space-y-2 text-sm text-sky-800">
                    <li>• <strong>What triggered me today?</strong> (Identify patterns)</li>
                    <li>• <strong>How did I cope?</strong> (Acknowledge your resilience)</li>
                    <li>• <strong>What did I learn?</strong> (Growth perspective)</li>
                    <li>• <strong>One thing I'm grateful for:</strong> (Counteract negative cognitions)</li>
                    <li>• <strong>My body felt:</strong> (Somatic awareness)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NeuroBreath PTSD Support Plan</CardTitle>
                <CardDescription>Gamified progress tracking for sustainable recovery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-indigo-900">Daily Grounding Challenge</h4>
                      <p className="text-sm text-indigo-800 mt-1">Practice 10 min of grounding (5-4-3-2-1, box breathing, etc). Earn 10 XP + 1 day streak.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Brain className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900">7-Day Grounding Sprint</h4>
                      <p className="text-sm text-green-800 mt-1">Complete 7 consecutive grounding sessions. Unlock "Calm Builder" badge + 100 XP bonus.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">14-Day Sleep Support Quest</h4>
                      <p className="text-sm text-blue-800 mt-1">Track sleep quality & practice sleep hygiene. Complete for "Restful Nights" badge + sleep insights.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Heart className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-900">30-Day Calm Challenge</h4>
                      <p className="text-sm text-purple-800 mt-1">Build a recovery routine: grounding + sleep + journaling. Unlock "Trauma Warrior" badge.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-3">Progress Tracking Features</h4>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Symptom Log:</strong> Track triggers, intensity (1-10), and coping success</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Recovery Streaks:</strong> Visual motivation for consistent practice</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Trigger Library:</strong> Identify patterns and safe responses (private by default)</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Weekly Insights:</strong> See progress over time; celebrate wins</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                  <h4 className="font-semibold text-rose-900 mb-2">⚠️ Crisis Support</h4>
                  <p className="text-sm text-rose-800 mb-3">If you're in immediate crisis or having self-harm thoughts:</p>
                  <div className="space-y-2 text-sm font-semibold text-rose-900">
                    <p>🇬🇧 <strong>UK:</strong> Call NHS 111 or text 50808 (Shout Crisis Text Line)</p>
                    <p>🇺🇸 <strong>US:</strong> Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence/Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evidence & Research References</CardTitle>
                <CardDescription>This page is informed by peer-reviewed research and clinical guidelines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-indigo-500 pl-4 py-2">
                    <h4 className="font-semibold">PTSD Prevalence in Neurodivergent Populations</h4>
                    <p className="text-sm text-slate-600 mt-1">Research shows ~32% of autistic adults meet PTSD criteria vs 4% general population; ADHD individuals have 8–12% lifetime PTSD rates.</p>
                    <p className="text-xs text-slate-500 mt-2">Sources: PubMed Central, Journal of Autism & Developmental Disorders</p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h4 className="font-semibold">Trauma in Neurodivergent Children</h4>
                    <p className="text-sm text-slate-600 mt-1">Autistic children face higher rates of abuse; ADHD is associated with {'>'}2x risk of PTSD in longitudinal studies.</p>
                    <p className="text-xs text-slate-500 mt-2">Sources: NICE NG26, CDC Resources, NIH</p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4 py-2">
                    <h4 className="font-semibold">Nervous System Dysregulation & Hyperarousal</h4>
                    <p className="text-sm text-slate-600 mt-1">PTSD in neurodivergent individuals often involves heightened hypervigilance, reduced fear extinction, and sensory-triggered flashbacks.</p>
                    <p className="text-xs text-slate-500 mt-2">Sources: Trauma Psychology Research, European Journal of Psychotraumatology</p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold">Evidence-Based Interventions</h4>
                    <p className="text-sm text-slate-600 mt-1">Grounding techniques, EMDR, CBT, and somatic therapies are effective. Neurodiversity-affirming adaptations improve outcomes.</p>
                    <p className="text-xs text-slate-500 mt-2">Sources: NICE NG26 (PTSD Guidance), NHS, PubMed Reviews</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold">Sleep & PTSD Recovery</h4>
                    <p className="text-sm text-slate-600 mt-1">Sleep deprivation worsens PTSD symptoms; consistent sleep hygiene is foundational to recovery.</p>
                    <p className="text-xs text-slate-500 mt-2">Sources: American Psychological Association, Sleep Medicine Reviews</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-6">
                  <h4 className="font-semibold mb-3">Professional Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://www.nice.org.uk/guidance/ng26" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        NICE NG26: Post-traumatic Stress Disorder (PTSD) — Clinical Guideline
                      </a>
                    </li>
                    <li>
                      <a href="https://www.nhs.uk/mental-health/conditions/post-traumatic-stress-disorder-ptsd/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        NHS: Post-traumatic Stress Disorder (PTSD) Overview
                      </a>
                    </li>
                    <li>
                      <a href="https://medlineplus.gov/posttraumaticstressdisorder.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        MedlinePlus: PTSD Overview
                      </a>
                    </li>
                    <li>
                      <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        PubMed: Peer-reviewed PTSD & Neurodiversity Research
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>When to Seek Professional Help</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Symptoms persist for more than one month after a traumatic event</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>PTSD symptoms interfere with daily functioning or relationships</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>You have thoughts of self-harm or are struggling with substance use</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>You want trauma-informed therapy tailored to neurodiversity</span>
                  </li>
                </ul>
                <p className="text-sm text-slate-600 mt-4">
                  Ask for a therapist experienced in both PTSD and neurodiversity (autism, ADHD, etc.). Trauma-informed, neurodiversity-affirming care significantly improves outcomes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle>Ready to Start Your Recovery Journey?</CardTitle>
            <CardDescription>NeuroBreath is here to support you with evidence-based tools and tracking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/techniques">
                <Button className="w-full">Explore Breathing Techniques</Button>
              </Link>
              <Link href="/tools/sleep">
                <Button variant="outline" className="w-full">Sleep Support</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full">Contact Support</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
