'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, BookOpen, CheckCircle2, Phone } from 'lucide-react';
import Link from 'next/link';

export default function ParentSupportPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <Heart className="h-8 w-8 text-pink-600 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Parenting Neurodivergent Children</h1>
              <p className="text-lg text-slate-700 mb-4">
                Resources, support, and practical strategies for parents of autistic, ADHD, and neurodivergent children.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Common Challenge</div>
                  <div className="text-lg font-bold text-pink-600">Behavior Patterns</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Key Focus</div>
                  <div className="text-lg font-bold text-pink-600">Self-Regulation</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-slate-600">Your Role</div>
                  <div className="text-lg font-bold text-pink-600">Guide & Support</div>
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
              <TabsTrigger value="support" className="text-xs sm:text-base">
                Support
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
                    <CardTitle>Understanding Neurodivergence</CardTitle>
                    <CardDescription>What parents need to know</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">
                      Neurodivergence (autism, ADHD, dyslexia, etc.) means your child's brain works differently—not wrongly. This affects:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>How they process sensory information</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Executive function (planning, organizing, time management)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Social communication and relationships</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Emotional regulation</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Learning style and attention</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>The Parent's Role</CardTitle>
                    <CardDescription>Your core responsibilities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">1. Understand Your Child</h4>
                        <p className="text-sm text-slate-600 mt-1">Learn about their specific neurodivergence, triggers, strengths, and needs. Every child is different.</p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">2. Create Safe Structures</h4>
                        <p className="text-sm text-slate-600 mt-1">Predictable routines, clear expectations, and safe spaces help your child feel secure.</p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">3. Validate & Accept</h4>
                        <p className="text-sm text-slate-600 mt-1">Acceptance doesn't mean complacency. Help them succeed as their authentic selves.</p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">4. Model Self-Care</h4>
                        <p className="text-sm text-slate-600 mt-1">Take care of your own mental health. Your wellbeing directly impacts your child's wellbeing.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Parental Burnout is Real</CardTitle>
                    <CardDescription>You're not alone in struggling sometimes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-slate-700 mb-3">
                        Parenting a neurodivergent child is rewarding and challenging. Many parents experience burnout from:
                      </p>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Constant vigilance and emotional labor</li>
                        <li>• Navigating schools and services</li>
                        <li>• Managing behavior challenges</li>
                        <li>• Lack of understanding from others</li>
                        <li>• Isolation and limited breaks</li>
                      </ul>
                      <p className="text-sm text-slate-600 mt-3">Seeking support is not weakness—it's essential care.</p>
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
                    <CardTitle>Practical Parenting Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-pink-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Clear, Concrete Expectations</h4>
                        <p className="text-sm text-slate-600 mt-1">Instead of "be good," say "stay seated during dinner." Neurodivergent children often need explicit instructions.</p>
                      </div>

                      <div className="border-l-4 border-pink-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Visual Supports</h4>
                        <p className="text-sm text-slate-600 mt-1">Use pictures, charts, schedules, and lists. Verbal instructions alone often aren't enough.</p>
                      </div>

                      <div className="border-l-4 border-pink-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Sensory Breaks</h4>
                        <p className="text-sm text-slate-600 mt-1">Recognize when your child is overstimulated. Quiet time, headphones, or movement helps reset their nervous system.</p>
                      </div>

                      <div className="border-l-4 border-pink-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Special Interests as Tools</h4>
                        <p className="text-sm text-slate-600 mt-1">Use their hyperfocus interests to engage them, teach skills, and build confidence.</p>
                      </div>

                      <div className="border-l-4 border-pink-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Routine & Predictability</h4>
                        <p className="text-sm text-slate-600 mt-1">Consistent schedules reduce anxiety. Prepare your child for changes in advance.</p>
                      </div>

                      <div className="border-l-4 border-pink-600 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">Emotion Coaching</h4>
                        <p className="text-sm text-slate-600 mt-1">Help them name emotions, validate feelings, and develop coping strategies. Don't dismiss difficult emotions.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Managing Challenging Behaviors</CardTitle>
                    <CardDescription>Understanding the "why" behind behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 mb-3">
                        <strong>Key principle:</strong> Behavior is communication. It usually means one of five things:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>• "I'm overwhelmed" → Provide sensory breaks and safe space</li>
                        <li>• "I don't understand" → Explain more clearly, use visuals</li>
                        <li>• "This is hard" → Break tasks into smaller steps</li>
                        <li>• "I need a break" → Recognize when to slow down</li>
                        <li>• "I have a physical need" → Check hunger, tiredness, sensory needs</li>
                      </ul>
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
                    <CardTitle>Getting Support You Need</CardTitle>
                    <CardDescription>You don't have to do this alone</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Parent Support Groups</h4>
                        <p className="text-sm text-slate-600 mt-1">Connect with other parents. Peer support reduces isolation and provides practical advice.</p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Professional Support</h4>
                        <p className="text-sm text-slate-600 mt-1">Family therapists, behavioral specialists, or parenting coaches can provide tailored strategies.</p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Respite Care</h4>
                        <p className="text-sm text-slate-600 mt-1">Regular breaks from caregiving are essential. Arrange trusted family/friends or professional respite care.</p>
                      </div>

                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900">Self-Care (Non-Negotiable)</h4>
                        <p className="text-sm text-slate-600 mt-1">Sleep, exercise, hobbies, friendships. You can't pour from an empty cup.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>School Collaboration</CardTitle>
                    <CardDescription>Working effectively with teachers and staff</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700 text-sm">
                      Strong parent-school partnerships improve outcomes. Tips for collaboration:
                    </p>
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Communicate regularly (weekly check-ins)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Provide written documentation of needs</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Review IEP/504 plans annually and advocate for adjustments</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Ask for specific examples rather than vague feedback</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0" />
                        <span>Share what works at home; ask what works at school</span>
                      </li>
                    </ul>
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
                        <BookOpen className="h-4 w-4 mr-2" />
                        ADHD Information for Parents
                      </Button>
                    </Link>
                    <Link href="/conditions/autism">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Autism Information & Support
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
                  <CardContent>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p>✓ <strong>Progress, not perfection.</strong> Small improvements matter.</p>
                      <p>✓ <strong>Your child is doing their best.</strong> So are you.</p>
                      <p>✓ <strong>Acceptance is powerful.</strong> Help them love themselves.</p>
                      <p>✓ <strong>You deserve support.</strong> Ask for it.</p>
                    </div>
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
