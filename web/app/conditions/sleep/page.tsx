'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SleepSupportPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <Moon className="h-8 w-8 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Sleep Support</h1>
              <p className="text-lg text-slate-700 mb-4">
                Better sleep means better focus, mood, and stress management. Science-backed strategies for neurodivergent sleep.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Sleep Impact</div>
                  <div className="text-lg font-bold text-indigo-600">Most Effective</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Target Hours</div>
                  <div className="text-lg font-bold text-indigo-600">7-9 hours</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Routine Time</div>
                  <div className="text-lg font-bold text-indigo-600">30-60 min</div>
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
              <TabsTrigger value="tools" className="text-xs sm:text-base">
                Tools
              </TabsTrigger>
              <TabsTrigger value="tracking" className="text-xs sm:text-base">
                Tracking
              </TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs sm:text-base">
                Evidence
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Why Sleep Matters</CardTitle>
                    <CardDescription>The foundation of mental health</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">
                      Sleep isn't a luxury—it's a biological necessity. During sleep, your brain:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Consolidates memories and learning</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Clears metabolic waste (toxins)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Regulates mood and emotional responses</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Restores immune function</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span>Processes emotions from the day</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sleep Problems in Neurodivergent People</CardTitle>
                    <CardDescription>Common challenges and why they happen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-slate-900 mb-3">Common Sleep Issues:</h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>• <strong>Delayed sleep onset:</strong> Racing thoughts, intrusive thoughts (ADHD/autism)</li>
                        <li>• <strong>Sensory sensitivity:</strong> Light, sound, temperature disrupting sleep</li>
                        <li>• <strong>Sleep architecture changes:</strong> Different sleep cycles than neurotypical people</li>
                        <li>• <strong>Hyperfocus:</strong> Losing track of time, staying up too late (ADHD)</li>
                        <li>• <strong>Anxiety about sleep:</strong> Worry about not sleeping creates the problem</li>
                        <li>• <strong>Medication effects:</strong> ADHD meds can affect sleep timing</li>
                        <li>• <strong>Stimming behaviors:</strong> Can interfere with sleep onset</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>The Sleep-Neurodivergence Connection</CardTitle>
                    <CardDescription>How poor sleep worsens ADHD/autism symptoms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Without Adequate Sleep</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Executive function worse (working memory ↓)</li>
                          <li>• Impulse control reduced</li>
                          <li>• Emotional regulation harder</li>
                          <li>• Sensory sensitivity increases</li>
                          <li>• Anxiety & mood issues worsen</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">With Good Sleep (7-9 hours)</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Focus & attention improve</li>
                          <li>• Better impulse control</li>
                          <li>• Mood more stable</li>
                          <li>• Sensory filtering improves</li>
                          <li>• Overall functioning enhanced</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>The Sleep Hygiene Foundation</CardTitle>
                    <CardDescription>Non-negotiable basics for sleep success</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-indigo-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Consistent Schedule</h4>
                        <p className="text-sm text-slate-600 mt-1">Go to bed and wake up at the same time every day (including weekends). Your body works best on a rhythm.</p>
                        <p className="text-xs text-slate-500 mt-2">Even on weekends: ±30 min variation</p>
                      </div>

                      <div className="border-l-4 border-indigo-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Dark, Cool, Quiet</h4>
                        <p className="text-sm text-slate-600 mt-1">Control your bedroom environment. Blackout curtains, white noise machine, cool temperature (65-68°F).</p>
                      </div>

                      <div className="border-l-4 border-indigo-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">No Screens 30-60 Minutes Before Bed</h4>
                        <p className="text-sm text-slate-600 mt-1">Blue light suppresses melatonin. Use night mode or blue light glasses if necessary.</p>
                      </div>

                      <div className="border-l-4 border-indigo-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">No Caffeine After 2 PM</h4>
                        <p className="text-sm text-slate-600 mt-1">Caffeine takes 5-6 hours to leave your system. This includes tea and energy drinks.</p>
                      </div>

                      <div className="border-l-4 border-indigo-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Light Exercise (Not Before Bed)</h4>
                        <p className="text-sm text-slate-600 mt-1">Exercise earlier in the day improves sleep quality. Vigorous exercise within 3 hours of bed can be stimulating.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bedtime Routine (30-60 minutes)</CardTitle>
                    <CardDescription>Signal to your body it's time to sleep</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700 text-sm">A consistent routine trains your brain for sleep. Pick calming activities that work for you:</p>
                    <div className="space-y-2">
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="font-semibold text-sm">60 min before:</p>
                        <p className="text-sm text-slate-600">Warm bath/shower, dim lights, stop work/difficult tasks</p>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="font-semibold text-sm">30 min before:</p>
                        <p className="text-sm text-slate-600">Light reading, journaling, gentle stretching, or breathing exercises</p>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="font-semibold text-sm">In bed:</p>
                        <p className="text-sm text-slate-600">Relaxation technique (breathing, body scan, or meditation)</p>
                      </div>
                    </div>
                    <Link href="/tools/sleep-tools">
                      <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                        Explore sleep tools in NeuroBreath
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dealing with Racing Thoughts</CardTitle>
                    <CardDescription>The most common sleep blocker for neurodivergent people</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">The "Brain Dump" Technique</h4>
                        <p className="text-sm text-slate-600 mt-1">30 minutes before bed, write down everything in your head. Leave worries on paper, not in your mind.</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Box Breathing</h4>
                        <p className="text-sm text-slate-600 mt-1">Breath in for 4, hold for 4, out for 4, hold for 4. Gives your brain something to focus on.</p>
                        <Link href="/techniques/box-breathing">
                          <Button variant="link" className="mt-2 p-0 h-auto text-sm">
                            Try box breathing →
                          </Button>
                        </Link>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Body Scan Meditation</h4>
                        <p className="text-sm text-slate-600 mt-1">Systematically relax each body part from toes to head. Redirects attention and releases tension.</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">White Noise or Nature Sounds</h4>
                        <p className="text-sm text-slate-600 mt-1">Masks intrusive thoughts and creates consistent auditory environment. Apps like White Noise or Calm work well.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>If You Can't Fall Asleep</CardTitle>
                    <CardDescription>What to do after 15-20 minutes awake</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-slate-700 text-sm">
                        If you're awake for more than 15-20 minutes, <strong>get out of bed</strong>. Your brain should associate bed with sleep only.
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li>• Go to another room (dark and quiet)</li>
                        <li>• Do something boring but calming (reading, gentle stretching)</li>
                        <li>• When you feel sleepy, return to bed</li>
                        <li>• Avoid bright lights and screens</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sleep Tracking</CardTitle>
                    <CardDescription>Understanding your personal sleep patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-3">What to Track</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        <p><strong>Sleep time:</strong> When you went to bed</p>
                        <p><strong>Wake time:</strong> When you woke up</p>
                        <p><strong>Quality:</strong> Rate 1-10</p>
                        <p><strong>Sleep factors:</strong> Exercise, caffeine, stress, environment</p>
                        <p><strong>How you feel:</strong> Refreshed? Foggy? Irritable?</p>
                      </div>
                    </div>

                    <Card className="border-indigo-200 bg-indigo-50">
                      <CardHeader>
                        <CardTitle className="text-base">Why Track?</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-slate-700 space-y-2">
                        <p>• Identify what helps your sleep</p>
                        <p>• Spot patterns (caffeine → poor sleep, exercise → better sleep)</p>
                        <p>• Measure progress (average sleep quantity/quality)</p>
                        <p>• Share data with healthcare provider if needed</p>
                      </CardContent>
                    </Card>

                    <Link href="/progress">
                      <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                        Start tracking sleep in NeuroBreath
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sleep Goals (Realistic Timeline)</CardTitle>
                    <CardDescription>Building better sleep habits gradually</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Week 1</p>
                        <p className="text-sm text-slate-600">Establish a consistent bedtime (even if you're still having trouble falling asleep)</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Week 2-3</p>
                        <p className="text-sm text-slate-600">Add 1-2 elements of good sleep hygiene (dark room, no screens, etc.)</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Week 4+</p>
                        <p className="text-sm text-slate-600">Consolidate habits, add a bedtime routine, assess progress</p>
                      </div>
                      <div className="border-l-4 border-blue-600 pl-4 py-2">
                        <p className="font-semibold text-slate-900">Month 2</p>
                        <p className="text-sm text-slate-600">Review: Are you getting 7-9 hours? How's your daytime energy?</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sleep Science & Research</CardTitle>
                    <CardDescription>Evidence for our recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Sleep Duration & Cognitive Function</h4>
                        <p className="text-sm text-slate-600 mt-1">Research shows 7-9 hours is optimal for executive function, working memory, and emotional regulation. Neurodivergent people may need slightly more.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: National Sleep Foundation, CDC Sleep Guidelines</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Sleep Timing Consistency</h4>
                        <p className="text-sm text-slate-600 mt-1">Consistent sleep schedules regulate circadian rhythms. Irregular sleep worsens ADHD and autism symptoms more than neurotypical people.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Sleep Research Society, Chronobiology International</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Environmental Sleep Factors</h4>
                        <p className="text-sm text-slate-600 mt-1">Dark (0-5 lux), cool (65-68°F), and quiet environments optimize sleep. For neurodivergent people, sensory control is especially important.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Sleep Medicine Reviews, Light Research</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">ADHD & Sleep Challenges</h4>
                        <p className="text-sm text-slate-600 mt-1">ADHD medications, executive dysfunction, and circadian preference changes affect sleep. Consistent routines and external structure help.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: ADHD Clinical Guidelines, Neuropsychology Research</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-slate-900">Sleep & Mental Health</h4>
                        <p className="text-sm text-slate-600 mt-1">Poor sleep is both a symptom of and contributor to anxiety, depression, and low mood. Better sleep improves mental health across all conditions.</p>
                        <p className="text-xs text-slate-500 mt-2">Source: Journal of Affective Disorders, Sleep Health</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>When to Seek Professional Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm text-slate-700">
                        Consider talking to a healthcare provider if you've tried sleep hygiene for 4+ weeks with no improvement, or if sleep issues significantly impact your daily function.
                      </p>
                      <p className="text-xs text-slate-600 mt-2">A sleep specialist or your primary care doctor can rule out sleep disorders like insomnia, sleep apnea, or restless leg syndrome.</p>
                    </div>

                    <Link href="/contact">
                      <Button variant="outline" className="w-full justify-start">
                        Contact our team for guidance
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
