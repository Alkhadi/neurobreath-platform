'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, BookOpen, Phone } from 'lucide-react';
import Link from 'next/link';
import { PageShellNB, PageEndNB } from '@/components/layout/page-primitives';
import { HeroCompactNB } from '@/components/layout/hero-primitives';
import { CTASectionNB } from '@/components/layout/section-primitives';
import { AudienceContextNB, SafetyNoteNB } from '@/components/trust/trust-primitives';
import { Badge } from '@/components/ui/badge';

export default function ParentSupportPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <PageShellNB tone="soft">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroCompactNB
        eyebrow="Support for parents"
        title="Parenting Neurodivergent Children"
        summary="Resources, support, and practical strategies for parents of autistic, ADHD, and neurodivergent children."
        audienceChip={
          <Badge
            variant="outline"
            className="border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-700/50 dark:bg-pink-900/20 dark:text-pink-300"
          >
            For parents
          </Badge>
        }
        trustNote={
          <AudienceContextNB>
            This page is for parents and caregivers of neurodivergent children. It provides
            educational guidance only — not professional advice or diagnosis.
          </AudienceContextNB>
        }
      />

      {/* ── Context stats strip ──────────────────────────────── */}
      <div className="container-nb pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="content-card-nb text-center">
            <p className="text-sm font-medium text-[color:var(--nb-text-secondary)]">Common Challenge</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400 mt-1">Behaviour Patterns</p>
          </div>
          <div className="content-card-nb text-center">
            <p className="text-sm font-medium text-[color:var(--nb-text-secondary)]">Key Focus</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400 mt-1">Self-Regulation</p>
          </div>
          <div className="content-card-nb text-center">
            <p className="text-sm font-medium text-[color:var(--nb-text-secondary)]">Your Role</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400 mt-1">Guide &amp; Support</p>
          </div>
        </div>
      </div>

      {/* ── Tabbed content ───────────────────────────────────── */}
      <section className="container-nb py-10">
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

          {/* ── Overview ─────────────────────────────────────── */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Neurodivergence</CardTitle>
                  <CardDescription>What parents need to know</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[color:var(--nb-text-body)] dark:text-white/75">
                    Neurodivergence (autism, ADHD, dyslexia, etc.) means your child&apos;s brain works
                    differently — not wrongly. This affects:
                  </p>
                  <ul className="space-y-2 text-[color:var(--nb-text-body)] dark:text-white/75">
                    {[
                      'How they process sensory information',
                      'Executive function (planning, organising, time management)',
                      'Social communication and relationships',
                      'Emotional regulation',
                      'Learning style and attention',
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>The Parent&apos;s Role</CardTitle>
                  <CardDescription>Your core responsibilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        heading: '1. Understand Your Child',
                        body: 'Learn about their specific neurodivergence, triggers, strengths, and needs. Every child is different.',
                      },
                      {
                        heading: '2. Create Safe Structures',
                        body: 'Predictable routines, clear expectations, and safe spaces help your child feel secure.',
                      },
                      {
                        heading: '3. Validate &amp; Accept',
                        body: 'Acceptance doesn\'t mean complacency. Help them succeed as their authentic selves.',
                      },
                      {
                        heading: '4. Model Self-Care',
                        body: 'Take care of your own mental health. Your wellbeing directly impacts your child\'s wellbeing.',
                      },
                    ].map((item) => (
                      <div key={item.heading} className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-lg">
                        <h4 className="font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
                          {item.heading}
                        </h4>
                        <p className="text-sm text-[color:var(--nb-text-body)] dark:text-white/70 mt-1">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parental Burnout is Real</CardTitle>
                  <CardDescription>You&apos;re not alone in struggling sometimes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-700/30">
                    <p className="text-[color:var(--nb-text-body)] dark:text-white/75 mb-3">
                      Parenting a neurodivergent child is rewarding and challenging. Many parents experience
                      burnout from:
                    </p>
                    <ul className="text-sm text-[color:var(--nb-text-body)] dark:text-white/70 space-y-1">
                      <li>• Constant vigilance and emotional labour</li>
                      <li>• Navigating schools and services</li>
                      <li>• Managing behaviour challenges</li>
                      <li>• Lack of understanding from others</li>
                      <li>• Isolation and limited breaks</li>
                    </ul>
                    <p className="text-sm text-[color:var(--nb-text-secondary)] dark:text-white/60 mt-3">
                      Seeking support is not weakness — it&apos;s essential care.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Strategies ───────────────────────────────────── */}
          <TabsContent value="strategies">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practical Parenting Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        heading: 'Clear, Concrete Expectations',
                        body: 'Instead of "be good," say "stay seated during dinner." Neurodivergent children often need explicit instructions.',
                      },
                      {
                        heading: 'Visual Supports',
                        body: 'Use pictures, charts, schedules, and lists. Verbal instructions alone often aren\'t enough.',
                      },
                      {
                        heading: 'Sensory Breaks',
                        body: 'Recognise when your child is overstimulated. Quiet time, headphones, or movement helps reset their nervous system.',
                      },
                      {
                        heading: 'Special Interests as Tools',
                        body: 'Use their hyperfocus interests to engage them, teach skills, and build confidence.',
                      },
                      {
                        heading: 'Routine &amp; Predictability',
                        body: 'Consistent schedules reduce anxiety. Prepare your child for changes in advance.',
                      },
                      {
                        heading: 'Emotion Coaching',
                        body: "Help them name emotions, validate feelings, and develop coping strategies. Don't dismiss difficult emotions.",
                      },
                    ].map((item) => (
                      <div
                        key={item.heading}
                        className="border-l-4 border-pink-500 dark:border-pink-600 pl-4 py-2"
                      >
                        <h4 className="font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
                          {item.heading}
                        </h4>
                        <p className="text-sm text-[color:var(--nb-text-body)] dark:text-white/70 mt-1">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Managing Challenging Behaviours</CardTitle>
                  <CardDescription>Understanding the &quot;why&quot; behind behaviour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg">
                    <p className="text-[color:var(--nb-text-body)] dark:text-white/75 mb-3">
                      <strong>Key principle:</strong> Behaviour is communication. It usually means one of five
                      things:
                    </p>
                    <ul className="space-y-2 text-sm text-[color:var(--nb-text-body)] dark:text-white/70">
                      <li>• &quot;I&apos;m overwhelmed&quot; → Provide sensory breaks and safe space</li>
                      <li>• &quot;I don&apos;t understand&quot; → Explain more clearly, use visuals</li>
                      <li>• &quot;This is hard&quot; → Break tasks into smaller steps</li>
                      <li>• &quot;I need a break&quot; → Recognise when to slow down</li>
                      <li>• &quot;I have a physical need&quot; → Check hunger, tiredness, sensory needs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Support ──────────────────────────────────────── */}
          <TabsContent value="support">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Support You Need</CardTitle>
                  <CardDescription>You don&apos;t have to do this alone</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        heading: 'Parent Support Groups',
                        body: 'Connect with other parents. Peer support reduces isolation and provides practical advice.',
                      },
                      {
                        heading: 'Professional Support',
                        body: 'Family therapists, behavioural specialists, or parenting coaches can provide tailored strategies.',
                      },
                      {
                        heading: 'Respite Care',
                        body: 'Regular breaks from caregiving are essential. Arrange trusted family/friends or professional respite care.',
                      },
                      {
                        heading: 'Self-Care (Non-Negotiable)',
                        body: "Sleep, exercise, hobbies, friendships. You can't pour from an empty cup.",
                      },
                    ].map((item) => (
                      <div key={item.heading} className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-lg">
                        <h4 className="font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
                          {item.heading}
                        </h4>
                        <p className="text-sm text-[color:var(--nb-text-body)] dark:text-white/70 mt-1">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>School Collaboration</CardTitle>
                  <CardDescription>Working effectively with teachers and staff</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[color:var(--nb-text-body)] dark:text-white/75 text-sm mb-4">
                    Strong parent-school partnerships improve outcomes. Tips for collaboration:
                  </p>
                  <ul className="space-y-2 text-[color:var(--nb-text-body)] dark:text-white/75 text-sm">
                    {[
                      'Communicate regularly (weekly check-ins)',
                      'Provide written documentation of needs',
                      'Review IEP/504 plans annually and advocate for adjustments',
                      'Ask for specific examples rather than vague feedback',
                      'Share what works at home; ask what works at school',
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Resources ────────────────────────────────────── */}
          <TabsContent value="resources">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href="/conditions/adhd"
                    className="flex items-center gap-2 rounded-xl border border-[color:var(--nb-border-soft)] dark:border-white/10 px-4 py-3 text-sm font-medium text-[color:var(--nb-text-heading)] dark:text-white hover:border-[color:var(--nb-border-muted)] transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                    ADHD Information for Parents
                  </Link>
                  <Link
                    href="/conditions/autism"
                    className="flex items-center gap-2 rounded-xl border border-[color:var(--nb-border-soft)] dark:border-white/10 px-4 py-3 text-sm font-medium text-[color:var(--nb-text-heading)] dark:text-white hover:border-[color:var(--nb-border-muted)] transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                    Autism Information &amp; Support
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 rounded-xl border border-[color:var(--nb-border-soft)] dark:border-white/10 px-4 py-3 text-sm font-medium text-[color:var(--nb-text-heading)] dark:text-white hover:border-[color:var(--nb-border-muted)] transition-colors"
                  >
                    <Phone className="h-4 w-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                    Contact NeuroBreath Support
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Remember</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-[color:var(--nb-text-body)] dark:text-white/75">
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
      </section>

      {/* ── Safety note ──────────────────────────────────────── */}
      <div className="container-nb pb-8">
        <SafetyNoteNB>
          Educational information only. This page supports wellbeing routines and understanding — it is not
          medical advice, a diagnosis, or a substitute for professional support.
        </SafetyNoteNB>
      </div>

      {/* ── Page end ─────────────────────────────────────────── */}
      <PageEndNB eyebrow="Also helpful" title="More support for your family">
        <CTASectionNB
          title="Explore support for teachers and carers"
          summary="NeuroBreath also provides structured guidance for teachers and carers of neurodivergent children."
          primaryHref="/support/teachers"
          primaryLabel="Support for teachers"
          secondaryHref="/support/carers"
          secondaryLabel="Support for carers"
          trustNote="Educational only. Not medical advice."
        />
      </PageEndNB>
    </PageShellNB>
  );
}
