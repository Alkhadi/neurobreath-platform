'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TeacherResourcesPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <BookOpen className="h-8 w-8 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Teacher Resources</h1>
              <p className="text-lg text-slate-700 mb-4">
                Practical strategies and understanding for supporting neurodivergent students in your classroom.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Key Goal</div>
                  <div className="text-lg font-bold text-green-600">Inclusion</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Your Role</div>
                  <div className="text-lg font-bold text-green-600">Facilitator</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Approach</div>
                  <div className="text-lg font-bold text-green-600">Universal Design</div>
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
              <TabsTrigger value="strategies" className="text-xs sm:text-base">
                Strategies
              </TabsTrigger>
              <TabsTrigger value="classroom" className="text-xs sm:text-base">
                Classroom
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs sm:text-base">
                Tools
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Understanding Neurodivergent Learners</CardTitle>
                    <CardDescription>Common traits in your classroom</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">
                      Neurodivergent students learn differently. They may show:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">ADHD Traits</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Difficulty staying focused</li>
                          <li>• Impulsive actions/words</li>
                          <li>• Trouble organizing tasks</li>
                          <li>• High energy levels</li>
                          <li>• Hyperfocus on interests</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">Autism Traits</h4>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Sensory sensitivities</li>
                          <li>• Preference for predictability</li>
                          <li>• Direct communication style</li>
                          <li>• Deep special interests</li>
                          <li>• May struggle with social nuance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Universal Design for Learning (UDL)</CardTitle>
                    <CardDescription>Strategies that help all students</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700 text-sm">
                      Good teaching for neurodivergent students is good teaching for everyone. UDL involves:
                    </p>
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Multiple Means of Representation</h4>
                        <p className="text-sm text-slate-600">Information via text, visual, audio, and kinesthetic formats</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Multiple Means of Action/Expression</h4>
                        <p className="text-sm text-slate-600">Let students show understanding through different methods (verbal, written, visual, hands-on)</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Multiple Means of Engagement</h4>
                        <p className="text-sm text-slate-600">Connect to interests, build autonomy, provide meaning and relevance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Common Misconceptions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm"><strong>Myth:</strong> Neurodivergent kids can "just try harder"</p>
                        <p className="text-xs text-slate-600 mt-1">Reality: Differences are neurological, not motivational. Try different approaches, not harder ones.</p>
                      </div>

                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm"><strong>Myth:</strong> Accommodations are "unfair"</p>
                        <p className="text-xs text-slate-600 mt-1">Reality: Accommodations level the playing field so all students can access learning.</p>
                      </div>

                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm"><strong>Myth:</strong> Neurodivergent students are less intelligent</p>
                        <p className="text-xs text-slate-600 mt-1">Reality: Intelligence is diverse. Different neurodivergent profiles have different strengths.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Strategies Tab */}
            <TabsContent value="strategies">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Classroom Strategies</CardTitle>
                    <CardDescription>Practical techniques that work</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Clear Expectations & Instructions</h4>
                        <p className="text-sm text-slate-600 mt-1">Write instructions clearly. Use bullet points, not paragraphs. Avoid vague directives like "be respectful."</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Visual Supports</h4>
                        <p className="text-sm text-slate-600 mt-1">Visual schedules, timers, checklists, and diagrams help. Verbal instructions alone often don't stick.</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Frequent Breaks & Movement</h4>
                        <p className="text-sm text-slate-600 mt-1">Neurodivergent students need more frequent brain breaks. Movement helps. Consider standing desks or movement breaks every 20-30 minutes.</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Reduced Sensory Input Options</h4>
                        <p className="text-sm text-slate-600 mt-1">Headphones, low-lighting area, fidget tools, or sensory breaks help students regulate. Don't penalize them for these needs.</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Flexible Seating & Positioning</h4>
                        <p className="text-sm text-slate-600 mt-1">Different students need different environments (near/far from teacher, with/without peer proximity). Experiment to find what works.</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Extra Processing Time</h4>
                        <p className="text-sm text-slate-600 mt-1">Wait 5-10 seconds after asking a question before expecting an answer. Many neurodivergent students need time to process.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Managing Challenging Behaviors</CardTitle>
                    <CardDescription>Behavior is communication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 mb-3">
                        <strong>Reframe:</strong> Instead of "problem behavior," think "unmet need." The behavior usually means:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>• "I'm overwhelmed" → Provide break, quiet space</li>
                        <li>• "I don't understand" → Explain differently, check comprehension</li>
                        <li>• "This is too hard" → Break into smaller steps, provide scaffolding</li>
                        <li>• "I need a break" → Allow movement or sensory break</li>
                        <li>• "The environment is uncomfortable" → Adjust sensory input</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Classroom Tab */}
            <TabsContent value="classroom">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Classroom Environment Design</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Sensory-Friendly Zone</h4>
                        <p className="text-sm text-slate-600 mt-1">Create a quiet corner with minimal stimulation. This isn't punishment—it's a regulation tool.</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Lighting</h4>
                        <p className="text-sm text-slate-600 mt-1">Fluorescent lights can be overwhelming. Use natural light when possible, or softer bulbs. Offer sunglasses for sensitive students.</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Noise Management</h4>
                        <p className="text-sm text-slate-600 mt-1">Provide noise-canceling headphones. Use quiet signals instead of loud bells. Limit unnecessary background noise.</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Visual Organization</h4>
                        <p className="text-sm text-slate-600 mt-1">Organized, uncluttered spaces help. Use color coding, labels, and clear zones for different activities.</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Movement Opportunities</h4>
                        <p className="text-sm text-slate-600 mt-1">Fidget tools, movement breaks, standing options, or kinesthetic activities help students regulate energy.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Working with Parents & Support Teams</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Communicate regularly (positive AND challenging)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Review IEP/504 plans and honor them</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Ask parents what works at home</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Share specific examples of successes and challenges</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>Collaborate on solutions rather than blame</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practical Tools & Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/teacher-quick-pack">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        NeuroBreath Teacher Quick Pack
                      </Button>
                    </Link>
                    <Link href="/conditions/adhd">
                      <Button variant="outline" className="w-full justify-start">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        ADHD in the Classroom
                      </Button>
                    </Link>
                    <Link href="/conditions/autism">
                      <Button variant="outline" className="w-full justify-start">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Autism & Inclusion Strategies
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Remember</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>✓ <strong>You make a difference.</strong> Teachers are often the first to recognize neurodivergence.</p>
                    <p>✓ <strong>Different doesn't mean difficult.</strong> Adjust your approach, not your expectations.</p>
                    <p>✓ <strong>Small accommodations = big impact.</strong> A few adjustments unlock learning.</p>
                    <p>✓ <strong>Support yourself.</strong> Teaching neurodivergent students is rewarding but demanding. Take care of yourself.</p>
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
