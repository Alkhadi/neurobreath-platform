import Link from 'next/link'
import { Sparkles, Brain, HeartPulse, BookOpen, Target, Users, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GetStartedPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-900">
              <Sparkles className="h-4 w-4" />
              Your journey starts here
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Getting Started with{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                NeuroBreath
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              Evidence-based breathing techniques, neurodiversity support, and personalized tools
              to help you thrive. Start in just 3 simple steps.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                <Link href="#choose-path">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/coach">Talk to AI Coach</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16" id="choose-path">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">Your Path in 3 Simple Steps</h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <Card className="relative border-2 border-teal-100 transition-all hover:border-teal-300 hover:shadow-lg">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  1
                </div>
                <CardHeader>
                  <Target className="mb-3 h-10 w-10 text-teal-600" />
                  <CardTitle>Choose Your Focus</CardTitle>
                  <CardDescription>
                    Pick what matters most to you right now
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>Breathing & calm techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>ADHD, autism, or dyslexia support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <span>Mental health tools</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative border-2 border-blue-100 transition-all hover:border-blue-300 hover:shadow-lg">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  2
                </div>
                <CardHeader>
                  <Zap className="mb-3 h-10 w-10 text-blue-600" />
                  <CardTitle>Try Your First Tool</CardTitle>
                  <CardDescription>
                    Start with something quick and easy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>2-minute Box Breathing exercise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>Interactive focus game</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      <span>Quick mood check-in</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative border-2 border-purple-100 transition-all hover:border-purple-300 hover:shadow-lg">
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  3
                </div>
                <CardHeader>
                  <Award className="mb-3 h-10 w-10 text-purple-600" />
                  <CardTitle>Track Your Progress</CardTitle>
                  <CardDescription>
                    Build streaks and earn achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                      <span>Daily quests & challenges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                      <span>XP points & level-ups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                      <span>Unlock badges & rewards</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Paths */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold">Choose Your Starting Point</h2>
            <p className="mb-12 text-center text-gray-600">
              Not sure where to begin? Pick the area that fits your needs best.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Breathing & Calm */}
              <Card className="group cursor-pointer border-2 transition-all hover:border-teal-300 hover:shadow-xl">
                <Link href="/breathing/techniques" className="block h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 group-hover:scale-110 transition-transform">
                      <HeartPulse className="h-7 w-7 text-teal-700" />
                    </div>
                    <CardTitle className="text-xl">Breathing & Calm</CardTitle>
                    <CardDescription>
                      Reduce stress and anxiety with proven breathing techniques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                        <span>Box Breathing (4-4-4-4)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                        <span>4-7-8 Technique</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                        <span>Coherent Breathing</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-teal-600">
                      Start breathing exercises
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* ADHD Support */}
              <Card className="group cursor-pointer border-2 transition-all hover:border-orange-300 hover:shadow-xl">
                <Link href="/adhd" className="block h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 group-hover:scale-110 transition-transform">
                      <Target className="h-7 w-7 text-orange-700" />
                    </div>
                    <CardTitle className="text-xl">ADHD Hub</CardTitle>
                    <CardDescription>
                      Focus tools, timers, and executive function support
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                        <span>Pomodoro focus timer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                        <span>Task breakdown tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                        <span>Daily quests system</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600">
                      Explore ADHD tools
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Autism Support */}
              <Card className="group cursor-pointer border-2 transition-all hover:border-blue-300 hover:shadow-xl">
                <Link href="/conditions/autism" className="block h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:scale-110 transition-transform">
                      <Brain className="h-7 w-7 text-blue-700" />
                    </div>
                    <CardTitle className="text-xl">Autism Hub</CardTitle>
                    <CardDescription>
                      Sensory support, communication, and regulation tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span>Calm toolkit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span>Social scripts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span>Sensory guides</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                      Visit autism hub
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Dyslexia Support */}
              <Card className="group cursor-pointer border-2 transition-all hover:border-purple-300 hover:shadow-xl">
                <Link href="/dyslexia-reading-training" className="block h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-7 w-7 text-purple-700" />
                    </div>
                    <CardTitle className="text-xl">Dyslexia Reading</CardTitle>
                    <CardDescription>
                      Structured literacy training and phonics practice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        <span>Reading assessment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        <span>Phonics lab games</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        <span>Fluency training</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-600">
                      Start reading training
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Mental Health */}
              <Card className="group cursor-pointer border-2 transition-all hover:border-pink-300 hover:shadow-xl">
                <Link href="/conditions/anxiety" className="block h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 group-hover:scale-110 transition-transform">
                      <HeartPulse className="h-7 w-7 text-pink-700" />
                    </div>
                    <CardTitle className="text-xl">Mental Health</CardTitle>
                    <CardDescription>
                      Anxiety, depression, and mood support tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                        <span>Grounding techniques</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                        <span>Mood tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                        <span>Coping strategies</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-pink-600">
                      Explore mental health tools
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Parents & Teachers */}
              <Card className="group cursor-pointer border-2 transition-all hover:border-green-300 hover:shadow-xl">
                <Link href="/parent" className="block h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 group-hover:scale-110 transition-transform">
                      <Users className="h-7 w-7 text-green-700" />
                    </div>
                    <CardTitle className="text-xl">Parents & Teachers</CardTitle>
                    <CardDescription>
                      Support resources and progress monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        <span>Progress dashboards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        <span>Classroom strategies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        <span>Home support guides</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">
                      Access parent/teacher hub
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-blue-600 p-8 text-white md:p-12">
              <div className="mb-6 text-center">
                <h2 className="mb-3 text-3xl font-bold">Ready to Start?</h2>
                <p className="text-lg text-teal-50">
                  Get personalized recommendations from our AI Coach or jump straight into an activity.
                </p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Button asChild size="lg" variant="secondary" className="h-auto flex-col gap-2 py-4">
                  <Link href="/coach">
                    <Sparkles className="h-6 w-6" />
                    <span className="font-semibold">AI Coach</span>
                    <span className="text-xs">Get personalized help</span>
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="secondary" className="h-auto flex-col gap-2 py-4">
                  <Link href="/breathing/techniques">
                    <HeartPulse className="h-6 w-6" />
                    <span className="font-semibold">Try Breathing</span>
                    <span className="text-xs">2-minute calm exercise</span>
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="secondary" className="h-auto flex-col gap-2 py-4 sm:col-span-2 lg:col-span-1">
                  <Link href="/progress">
                    <Award className="h-6 w-6" />
                    <span className="font-semibold">View Progress</span>
                    <span className="text-xs">Track your journey</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Common Questions</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need an account?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    No! All tools work immediately. Your progress is saved locally on your device. 
                    Creating an account is optional and allows you to sync across devices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is NeuroBreath free?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes, all core features are free to use. We believe everyone should have access 
                    to mental health and neurodiversity support tools.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How long does each exercise take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Most breathing exercises are 2-5 minutes. Other tools range from quick 1-minute 
                    check-ins to longer 10-15 minute activities. You choose what fits your schedule.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can parents and teachers monitor progress?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes! Users can generate a 6-digit access code to share with parents, teachers, 
                    or carers for read-only progress viewing. Visit the{' '}
                    <Link href="/parent" className="font-medium text-teal-600 hover:underline">
                      Parent/Teacher Hub
                    </Link>{' '}
                    to learn more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-2xl font-bold">Still have questions?</h3>
          <p className="mb-6 text-gray-600">
            Our AI Coach can help you find exactly what you need.
          </p>
          <Button asChild size="lg">
            <Link href="/coach">
              Talk to AI Coach
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
