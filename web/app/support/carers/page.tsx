'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, CheckCircle2, Phone, HelpCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CarerSupportPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <Heart className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Support for Carers</h1>
              <p className="text-lg text-slate-700 mb-4">
                Resources and guidance for all caregivers supporting neurodivergent individuals in your life.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Your Role</div>
                  <div className="text-lg font-bold text-purple-600">Essential</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Impact</div>
                  <div className="text-lg font-bold text-purple-600">Significant</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Your Needs</div>
                  <div className="text-lg font-bold text-purple-600">Matter Too</div>
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
              <TabsTrigger value="support" className="text-xs sm:text-base">
                Support
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs sm:text-base">
                Tools
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-base">
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Who Are Carers?</CardTitle>
                    <CardDescription>We recognize all types of caregiving</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">
                      Carers include:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Extended family members (grandparents, aunts, uncles)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Family friends or mentors</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Siblings (often become supports as adults)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Partners and spouses</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Professional carers and support workers</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Peers and friends in the neurodivergent community</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Understanding Your Role</CardTitle>
                    <CardDescription>The foundation of effective caregiving</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Listen & Learn</h4>
                        <p className="text-sm text-slate-600 mt-1">Every neurodivergent person is different. Ask them what they need rather than assuming.</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Respect Autonomy</h4>
                        <p className="text-sm text-slate-600 mt-1">Your role is to support, not control. Encourage independence within safe boundaries.</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Validate Experiences</h4>
                        <p className="text-sm text-slate-600 mt-1">Their challenges are real. Acceptance doesn't mean everything is easy, but it means accepting them as they are.</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Be Patient with Progress</h4>
                        <p className="text-sm text-slate-600 mt-1">Growth looks different for everyone. Small steps and setbacks are both normal.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Carer Burnout is Real</CardTitle>
                    <CardDescription>Recognition and prevention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-slate-700 mb-3">
                        Caring is demanding. Common signs of burnout:
                      </p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Exhaustion that doesn't improve with rest</li>
                        <li>• Resentment toward the person you're caring for</li>
                        <li>• Neglecting your own health and needs</li>
                        <li>• Difficulty concentrating or making decisions</li>
                        <li>• Feelings of hopelessness</li>
                      </ul>
                      <p className="text-sm text-slate-600 mt-3 font-semibold">
                        Prevention: Prioritize self-care. You can't pour from an empty cup.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practical Support Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-purple-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Create Predictable Routines</h4>
                        <p className="text-sm text-slate-600 mt-1">Consistency reduces anxiety. Regular schedules for meals, sleep, and activities provide security.</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Reduce Sensory Stress</h4>
                        <p className="text-sm text-slate-600 mt-1">Control noise, lighting, and clutter. Ask what sensory environments help them feel calm.</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Support Emotional Regulation</h4>
                        <p className="text-sm text-slate-600 mt-1">Help them identify emotions and develop coping strategies (breathing, movement, safe spaces).</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Facilitate Special Interests</h4>
                        <p className="text-sm text-slate-600 mt-1">Their special interests aren't distractions—they're sources of joy and self-regulation. Support and celebrate them.</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Use Clear Communication</h4>
                        <p className="text-sm text-slate-600 mt-1">Be direct and concrete. Avoid sarcasm and unclear hints. Written communication often helps.</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Know When to Step Back</h4>
                        <p className="text-sm text-slate-600 mt-1">Support doesn't mean rescuing. Let them experience natural consequences and problem-solve with guidance.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Managing Difficult Moments</CardTitle>
                    <CardDescription>Crisis response and de-escalation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">During Overwhelm/Meltdown</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Stay calm (your energy affects theirs)</li>
                        <li>• Create a safe, quiet space if possible</li>
                        <li>• Don't try to reason or problem-solve during crisis</li>
                        <li>• Offer comfort only if they want it</li>
                        <li>• Wait for calm before discussing what happened</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">After Recovery</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Debrief gently (if they're willing)</li>
                        <li>• Identify triggers for next time</li>
                        <li>• Plan prevention strategies together</li>
                        <li>• Reassure them the crisis is over</li>
                        <li>• Practice self-compassion (for both of you)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Getting Support for Yourself</CardTitle>
                    <CardDescription>Your wellbeing matters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Seek carer support groups (in-person or online)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Consider counseling or therapy for yourself</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Take regular breaks (respite care if available)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Maintain your own interests and friendships</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <span>Practice stress management (exercise, sleep, hobbies)</span>
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
                    <CardTitle>NeuroBreath Tools for Carers</CardTitle>
                    <CardDescription>Resources to support your caregiving</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/breathing">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Breathing & Calm Tools
                      </Button>
                    </Link>
                    <Link href="/stress">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Stress Management for Carers
                      </Button>
                    </Link>
                    <Link href="/tools/stress-tools">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Wellness Tools & Activities
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Creating a Care Plan</CardTitle>
                    <CardDescription>Organization and communication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700 text-sm">
                      A good care plan documents:
                    </p>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p><strong>Daily needs:</strong> Meals, medication, routines, schedule</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p><strong>Triggers & responses:</strong> What upsets them & how you help</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p><strong>Communication preferences:</strong> How they like to be spoken to</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p><strong>Emergency contacts:</strong> Who to call in crisis</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p><strong>Medical/therapeutic info:</strong> Conditions, meds, professional contacts</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p><strong>Rights & preferences:</strong> What they want in their life</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Helpful Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/conditions/adhd">
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Understanding ADHD
                      </Button>
                    </Link>
                    <Link href="/conditions/autism">
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Understanding Autism
                      </Button>
                    </Link>
                    <Link href="/conditions/ptsd">
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        PTSD Support
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact NeuroBreath Support
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Remember</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>✓ <strong>Your support makes a profound difference.</strong> You matter.</p>
                    <p>✓ <strong>Self-care is essential, not selfish.</strong> Taking care of yourself helps you care for others.</p>
                    <p>✓ <strong>You're doing your best.</strong> That's enough.</p>
                    <p>✓ <strong>Asking for help is strength.</strong> You don't have to do this alone.</p>
                    <p>✓ <strong>Progress comes in all shapes.</strong> Celebrate what matters, not what's "normal."</p>
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
