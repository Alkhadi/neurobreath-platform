import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SupportCommunity } from '@/components/dyslexia/SupportCommunity';
import {
  BookOpen, Brain, Heart, Home, School, Users,
  FileText, Download, CheckCircle2, AlertCircle,
  Lightbulb, Target, TrendingUp
} from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Dyslexia Parent Support | NeuroBreath',
  description:
    'Dyslexia support for parents with home reading routines, school collaboration tips and practical resources for confidence.',
  path: '/conditions/dyslexia-parent',
});

export default function DyslexiaParentPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <main id="main-content">

        {/* ── Band 1: Hero — background image + dark overlay ── */}
        <section
          className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
          style={{
            backgroundImage: 'url("/images/home/home-section-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/20 dark:from-black/55 dark:via-black/40 dark:to-black/35"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 py-4">

            {/* Title */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/80 border border-blue-400/50 text-white text-sm font-semibold">
                <Brain className="w-4 h-4" />
                <span>Dyslexia Parent Support Hub • NeuroBreath</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Supporting Your Child with Dyslexia
              </h1>
              <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-3xl">
                Everything parents need to help their child thrive with dyslexia. Evidence-based strategies,
                home activities, school communication tools, and a supportive community.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 [&>*]:basis-full sm:[&>*]:basis-[calc(50%-6px)] lg:[&>*]:basis-[calc(25%-9px)] [&>*]:min-w-0">
              <Button asChild className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <a href="#quick-start">
                  <BookOpen className="w-5 h-5" />
                  Quick Start Guide
                </a>
              </Button>
              <Button asChild className="w-full gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/40">
                <a href="#school-support">
                  <School className="w-5 h-5" />
                  School Support
                </a>
              </Button>
              <Button asChild className="w-full gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/40">
                <a href="#emotional-support">
                  <Heart className="w-5 h-5" />
                  Emotional Support
                </a>
              </Button>
              <Button asChild className="w-full gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/40">
                <a href="#downloads">
                  <Download className="w-5 h-5" />
                  Resources
                </a>
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(33.333%-11px)] [&>*]:min-w-0">
              <a
                href="#evidence"
                className="flex items-start gap-3 p-4 rounded-lg bg-white/12 border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Jump to evidence-based resources"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">Evidence-Based</h3>
                  <p className="text-xs text-white/70">Backed by NHS &amp; research institutions</p>
                </div>
              </a>

              <a
                href="#support"
                className="flex items-start gap-3 p-4 rounded-lg bg-white/12 border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Jump to parent community and support"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">Parent Community</h3>
                  <p className="text-xs text-white/70">Connect with other parents</p>
                </div>
              </a>

              <a
                href="#downloads"
                className="flex items-start gap-3 p-4 rounded-lg bg-white/12 border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Jump to practical tools and downloads"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/30 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-orange-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">Practical Tools</h3>
                  <p className="text-xs text-white/70">Ready-to-use activities &amp; templates</p>
                </div>
              </a>
            </div>

          </div>
        </section>

        {/* ── Band 2: Getting Started — soft blue tint ── */}
        <section className="bg-blue-50/70 dark:bg-blue-950/10 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
            <div className="pb-2 border-b border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-foreground">Getting Started</h2>
              <p className="mt-1 text-sm text-muted-foreground">Immediate steps and an overview of your role as a parent.</p>
            </div>

            {/* Quick Start */}
            <section id="quick-start" className="space-y-4">
              <Card className="bg-white dark:bg-gray-900/60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
                      <CardDescription>3 practical steps for this week</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(33.333%-11px)] [&>*]:min-w-0">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-900/50 border">
                      <h3 className="font-semibold text-foreground mb-2">1) Protect confidence</h3>
                      <p className="text-sm text-muted-foreground">Separate reading effort from intelligence. Praise strategies, persistence, and small wins.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-900/50 border">
                      <h3 className="font-semibold text-foreground mb-2">2) Make practice short</h3>
                      <p className="text-sm text-muted-foreground">Aim for 10–15 minutes daily of structured practice, with breaks and a clear finish line.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-900/50 border">
                      <h3 className="font-semibold text-foreground mb-2">3) Align with school</h3>
                      <p className="text-sm text-muted-foreground">Ask what intervention is used, what to reinforce at home, and which accommodations apply now.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="gap-2">
                      <a href="/legacy-assets/assets/downloads/dyslexia-parent-support-guide.pdf" download aria-label="Download dyslexia parent support guide (PDF)">
                        <Download className="w-4 h-4" />
                        Download Parent Guide (PDF)
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="#school-support">
                        <School className="w-4 h-4" />
                        Jump to School Support
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="#downloads">
                        <FileText className="w-4 h-4" />
                        Browse Downloads
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* You're Not Alone */}
            <section className="space-y-4">
              <Card className="bg-white dark:bg-gray-900/60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">You&apos;re Not Alone</CardTitle>
                      <CardDescription>Understanding your journey as a parent</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Remember:</strong> Dyslexia is not related to intelligence. With the right support, children with dyslexia can excel academically and in life. Many successful people have dyslexia, including entrepreneurs, artists, and scientists.
                    </AlertDescription>
                  </Alert>
                  <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] [&>*]:min-w-0">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-900/50 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        What Parents Can Do
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Create a supportive, stress-free learning environment</li>
                        <li>• Focus on strengths and celebrate small wins</li>
                        <li>• Communicate regularly with teachers</li>
                        <li>• Advocate for appropriate accommodations</li>
                        <li>• Use multi-sensory learning techniques</li>
                        <li>• Build confidence and resilience</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-gray-900/50 border">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Key Focus Areas
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Early identification and intervention</li>
                        <li>• Structured literacy instruction</li>
                        <li>• Homework support strategies</li>
                        <li>• Emotional well-being</li>
                        <li>• Technology tools &amp; assistive tech</li>
                        <li>• Building independence</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>

        {/* ── Band 3: Home Strategies & Emotional Support — white ── */}
        <section className="bg-white dark:bg-gray-950 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
            <div className="pb-2 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-foreground">Strategies &amp; Wellbeing</h2>
              <p className="mt-1 text-sm text-muted-foreground">Practical home learning approaches and emotional support for your child.</p>
            </div>

            {/* Home Strategies */}
            <section className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Home Learning Strategies</CardTitle>
                      <CardDescription>Evidence-based techniques for home practice</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="reading" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="reading">Reading</TabsTrigger>
                      <TabsTrigger value="writing">Writing</TabsTrigger>
                      <TabsTrigger value="homework">Homework</TabsTrigger>
                      <TabsTrigger value="confidence">Confidence</TabsTrigger>
                    </TabsList>

                    <TabsContent value="reading" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Multi-Sensory Reading Techniques</h4>
                        <div className="grid gap-3">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">📖 Shared Reading</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Read together daily for 15-20 minutes. Let your child choose books that interest them, even if they&apos;re &ldquo;too easy.&rdquo;
                            </p>
                            <Badge variant="outline">Ages 4-12</Badge>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">🎵 Phonics Games</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Use rhyming games, sound matching, and letter-sound activities. Make it fun and multi-sensory.
                            </p>
                            <Badge variant="outline">Ages 4-8</Badge>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">🎧 Audiobooks</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Use audiobooks while following along with the text to build comprehension and vocabulary.
                            </p>
                            <Badge variant="outline">All Ages</Badge>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="writing" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Supporting Writing Development</h4>
                        <div className="grid gap-3">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">✍️ Multisensory Writing</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Try writing in sand, shaving cream, or on textured surfaces. Use finger tracing before pencil writing.
                            </p>
                            <Badge variant="outline">Ages 4-10</Badge>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">💻 Assistive Technology</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Use speech-to-text, word prediction software, and typing tools to reduce writing barriers.
                            </p>
                            <Badge variant="outline">Ages 7+</Badge>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">📝 Graphic Organizers</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              Use mind maps, story planners, and visual templates to organize thoughts before writing.
                            </p>
                            <Badge variant="outline">Ages 8+</Badge>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="homework" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Homework Support Tips</h4>
                        <div className="grid gap-3">
                          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <h5 className="font-medium mb-2">🕐 Break It Down</h5>
                            <p className="text-sm text-muted-foreground">
                              Divide homework into smaller chunks with breaks. Use timers for focused work periods (10-15 min).
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                            <h5 className="font-medium mb-2">🎯 Reduce Writing Load</h5>
                            <p className="text-sm text-muted-foreground">
                              Ask teachers if your child can give verbal answers, use a scribe, or type instead of handwrite.
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                            <h5 className="font-medium mb-2">📚 Reading Aloud</h5>
                            <p className="text-sm text-muted-foreground">
                              Read instructions and questions aloud. Use text-to-speech for longer reading assignments.
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                            <h5 className="font-medium mb-2">💪 Build Stamina Gradually</h5>
                            <p className="text-sm text-muted-foreground">
                              Start with short sessions and gradually increase. Quality over quantity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="confidence" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Building Confidence &amp; Resilience</h4>
                        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                          <Heart className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Emotional support is crucial.</strong> Children with dyslexia may feel frustrated, anxious, or have low self-esteem. Your encouragement matters.
                          </AlertDescription>
                        </Alert>
                        <div className="flex flex-wrap gap-3 [&>*]:basis-full md:[&>*]:basis-[calc(50%-6px)] [&>*]:min-w-0">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">✨ Celebrate Strengths</h5>
                            <p className="text-sm text-muted-foreground">
                              Highlight what your child is good at: art, sports, creativity, problem-solving, empathy.
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">🎯 Set Achievable Goals</h5>
                            <p className="text-sm text-muted-foreground">
                              Break larger goals into small, achievable steps. Celebrate progress, not perfection.
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">💬 Open Communication</h5>
                            <p className="text-sm text-muted-foreground">
                              Talk openly about dyslexia. Help your child understand it&apos;s not their fault and they can succeed.
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">👥 Role Models</h5>
                            <p className="text-sm text-muted-foreground">
                              Share stories of successful people with dyslexia: Richard Branson, Steven Spielberg, etc.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Emotional Support */}
            <section id="emotional-support" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
                      <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Emotional Support</CardTitle>
                      <CardDescription>Reducing shame, frustration, and school stress</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      If reading triggers tears, avoidance, or anger, treat it like a stress response: pause, regulate, then restart with a smaller task.
                    </AlertDescription>
                  </Alert>
                  <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] [&>*]:min-w-0">
                    <div className="p-4 rounded-lg bg-rose-50 dark:bg-gray-900/50 border">
                      <h3 className="font-semibold text-foreground mb-2">Language that helps</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• &ldquo;Your brain is learning a new pathway.&rdquo;</li>
                        <li>• &ldquo;Let&apos;s do one small step, then stop.&rdquo;</li>
                        <li>• &ldquo;Mistakes are data, not failure.&rdquo;</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-rose-50 dark:bg-gray-900/50 border">
                      <h3 className="font-semibold text-foreground mb-2">When to scale down</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Headaches/tummy aches before reading</li>
                        <li>• Meltdowns at the start of homework</li>
                        <li>• &ldquo;I&apos;m stupid&rdquo; or &ldquo;I can&apos;t&rdquo; self-talk</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="gap-2">
                      <Link href="/techniques/box-breathing">
                        <TrendingUp className="w-4 h-4" />
                        Try Box Breathing
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="#support">
                        <Users className="w-4 h-4" />
                        Parent Support &amp; FAQs
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>

        {/* ── Band 4: School & Resources — indigo tint ── */}
        <section className="bg-indigo-50 dark:bg-indigo-950/15 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
            <div className="pb-2 border-b border-indigo-200 dark:border-indigo-800">
              <h2 className="text-2xl font-bold text-foreground">School, Age &amp; Resources</h2>
              <p className="mt-1 text-sm text-muted-foreground">Advocate effectively, find age-specific guidance, and download ready-to-use materials.</p>
            </div>

            {/* School Collaboration */}
            <section id="school-support" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <School className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Working with School</CardTitle>
                      <CardDescription>How to advocate and collaborate effectively</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] [&>*]:min-w-0">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">📋 Request These Accommodations</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>✓ Extra time on tests and assignments</li>
                        <li>✓ Audio format for reading materials</li>
                        <li>✓ Use of assistive technology</li>
                        <li>✓ Reduced reading/writing load</li>
                        <li>✓ Alternative assessment formats</li>
                        <li>✓ Access to notes/materials in advance</li>
                        <li>✓ Preferential seating</li>
                        <li>✓ Break tasks into smaller steps</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">💬 Communication Tips</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Schedule regular check-ins with teachers</li>
                        <li>• Share what works at home</li>
                        <li>• Ask for written summaries of meetings</li>
                        <li>• Keep records of all communications</li>
                        <li>• Be specific about your child&apos;s needs</li>
                        <li>• Approach collaboratively, not confrontationally</li>
                        <li>• Ask about school&apos;s dyslexia support</li>
                        <li>• Request formal assessment if needed</li>
                      </ul>
                    </div>
                  </div>
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <strong>UK Parents:</strong> Your child may be entitled to SEN Support or an Education, Health and Care Plan (EHCP). Contact your school&apos;s SENCO (Special Educational Needs Coordinator) to discuss support.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </section>

            {/* Age-Specific Guidance */}
            <section className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Age-Specific Guidance</CardTitle>
                  <CardDescription>Tailored support for different developmental stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="early" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="early">Early Years</TabsTrigger>
                      <TabsTrigger value="primary">Primary</TabsTrigger>
                      <TabsTrigger value="secondary">Secondary</TabsTrigger>
                      <TabsTrigger value="teens">Teens</TabsTrigger>
                    </TabsList>

                    <TabsContent value="early" className="space-y-4 mt-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Ages 3-5: Early Signs &amp; Support</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Early identification can lead to earlier intervention. Look for these potential signs:
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Late talking or unclear speech</li>
                          <li>• Difficulty learning nursery rhymes</li>
                          <li>• Problems with rhyming</li>
                          <li>• Difficulty following multi-step instructions</li>
                          <li>• Struggles to recognize letters or write name</li>
                        </ul>
                        <p className="text-sm mt-3">
                          <strong>What helps:</strong> Read together daily, play rhyming games, practice letter sounds, use multi-sensory activities.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="primary" className="space-y-4 mt-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Ages 5-11: Primary School Support</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          This is when dyslexia often becomes more apparent. Key focus areas:
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Structured literacy intervention (phonics-based)</li>
                          <li>• Build reading fluency with repeated reading</li>
                          <li>• Use audiobooks and text-to-speech</li>
                          <li>• Teach keyboarding skills early</li>
                          <li>• Focus on comprehension, not just decoding</li>
                        </ul>
                        <p className="text-sm mt-3">
                          <strong>School support:</strong> Request assessment for SEN Support, ask about phonics programs, explore dyslexia-friendly teaching.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="secondary" className="space-y-4 mt-4">
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Ages 11-14: Secondary School Transition</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Secondary school brings new challenges: more reading, more subjects, more writing. Support strategies:
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Maximize assistive technology use</li>
                          <li>• Teach study and organization skills</li>
                          <li>• Ensure exam access arrangements are in place</li>
                          <li>• Support note-taking (use of laptop, copies of notes)</li>
                          <li>• Advocate for appropriate accommodations</li>
                        </ul>
                        <p className="text-sm mt-3">
                          <strong>Focus on:</strong> Building independence, self-advocacy skills, and recognizing strengths beyond literacy.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="teens" className="space-y-4 mt-4">
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Ages 14+: GCSEs, A-Levels &amp; Beyond</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Exam years require careful planning. Essential support:
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Apply for exam access arrangements (extra time, reader, scribe, computer)</li>
                          <li>• Use mind maps and visual study aids</li>
                          <li>• Leverage assistive tech fully</li>
                          <li>• Break revision into manageable chunks</li>
                          <li>• Explore vocational and apprenticeship routes if appropriate</li>
                        </ul>
                        <p className="text-sm mt-3">
                          <strong>Future planning:</strong> Discuss university/college support (DSA funding), career paths that suit strengths, self-advocacy.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Resources & Downloads */}
            <section id="downloads" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                      <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Resources &amp; Downloads</CardTitle>
                      <CardDescription>Printable guides and useful links</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3 [&>*]:basis-full md:[&>*]:basis-[calc(50%-6px)] [&>*]:min-w-0">
                    <Button asChild variant="outline" className="justify-start gap-3 h-auto p-4">
                      <a href="/legacy-assets/assets/downloads/dyslexia-parent-support-guide.pdf" download aria-label="Download dyslexia parent support guide (PDF)">
                        <FileText className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Parent Support Guide (PDF)</div>
                          <div className="text-xs text-muted-foreground">Essential home + school support overview</div>
                        </div>
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-3 h-auto p-4">
                      <a href="/legacy-assets/assets/downloads/dyslexia-reading-checklist.pdf" download aria-label="Download dyslexia reading checklist (PDF)">
                        <FileText className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Reading Checklist (PDF)</div>
                          <div className="text-xs text-muted-foreground">Signs, supports, and what to ask for</div>
                        </div>
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-3 h-auto p-4">
                      <a href="/legacy-assets/assets/downloads/dyslexia-routine-planner.pdf" download aria-label="Download dyslexia routine planner (PDF)">
                        <FileText className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Routine Planner (PDF)</div>
                          <div className="text-xs text-muted-foreground">Homework flow, breaks, and rewards</div>
                        </div>
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-3 h-auto p-4">
                      <a href="/legacy-assets/assets/downloads/dyslexia-practice-pack-templates.pdf" download aria-label="Download dyslexia practice pack templates (PDF)">
                        <FileText className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Practice Pack &amp; Templates (PDF)</div>
                          <div className="text-xs text-muted-foreground">Printable activities and structured practice</div>
                        </div>
                      </a>
                    </Button>
                  </div>

                  <div id="evidence" className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Recommended UK Organisations</h4>
                    <div className="flex flex-wrap gap-2 text-sm [&>*]:basis-full md:[&>*]:basis-[calc(50%-4px)] [&>*]:min-w-0">
                      <a href="https://www.bdadyslexia.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        • British Dyslexia Association
                      </a>
                      <a href="https://www.nhs.uk/conditions/dyslexia/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        • NHS Dyslexia Information
                      </a>
                      <a href="https://www.dyslexiaaction.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        • Dyslexia Action
                      </a>
                      <a href="https://www.ipsea.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        • IPSEA (SEN Legal Advice)
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>

        {/* ── Band 5: Breathing & Calm — cyan/teal tint ── */}
        <section className="bg-cyan-50 dark:bg-cyan-950/10 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8">
            <div className="pb-2 border-b border-cyan-200 dark:border-cyan-800">
              <h2 className="text-2xl font-bold text-foreground">Breathing for Calm &amp; Focus</h2>
              <p className="mt-1 text-sm text-muted-foreground">Help your child regulate stress and anxiety around reading and school.</p>
            </div>

            <section className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Children with dyslexia may experience stress, anxiety, or frustration around reading and school. Simple breathing exercises can help regulate emotions and improve focus.
              </p>
              <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(33.333%-11px)] [&>*]:min-w-0">
                <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                  <h4 className="font-semibold mb-2">🟦 Box Breathing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Breathe in for 4, hold for 4, out for 4, hold for 4. Great for calming before homework or tests.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/techniques/box-breathing">Try Now</Link>
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                  <h4 className="font-semibold mb-2">🟪 4-7-8 Breathing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Breathe in for 4, hold for 7, out for 8. Perfect for bedtime relaxation.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/techniques/4-7-8">Try Now</Link>
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-white dark:bg-gray-900/50">
                  <h4 className="font-semibold mb-2">🆘 SOS-60</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    60-second emergency calm technique for meltdowns or overwhelm.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/techniques/sos">Try Now</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* ── Band 6: Community — slate tint ── */}
        <section id="support" className="bg-slate-100 dark:bg-slate-900/40 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]">
            <div className="pb-2 border-b border-slate-200 dark:border-slate-700 mb-8">
              <h2 className="text-2xl font-bold text-foreground">Community &amp; Support</h2>
              <p className="mt-1 text-sm text-muted-foreground">Connect with other parents and find peer support.</p>
            </div>
            <SupportCommunity />
          </div>
        </section>

      </main>
    </div>
  );
}
