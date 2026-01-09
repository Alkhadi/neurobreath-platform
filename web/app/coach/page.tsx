'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Users, 
  Download, 
  PlayCircle, 
  Timer, 
  FileText, 
  Shield, 
  TrendingUp, 
  Clock,
  Heart,
  Brain,
  Wind,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PageBuddy } from '@/components/page-buddy'

export default function CoachPage() {
  const [selectedDuration, setSelectedDuration] = useState<{ [key: string]: number }>({
    box: 3,
    coherent: 5,
    sos: 1
  })

  const openBuddyWithQuestion = (question?: string) => {
    // Try multiple selectors to find the PageBuddy button
    const selectors = [
      '[data-pagebuddy-trigger="true"]',
      'button[aria-label*="NeuroBreath Buddy"]',
      'button[class*="fixed"][class*="bottom-6"][class*="right-6"]',
      'button:has(svg.lucide-message-circle)'
    ];
    
    let buddyButton: HTMLButtonElement | null = null;
    for (const selector of selectors) {
      buddyButton = document.querySelector(selector) as HTMLButtonElement;
      if (buddyButton) break;
    }

    if (buddyButton) {
      buddyButton.click();
      
      if (question) {
        // Wait for dialog to open and input to be available
        setTimeout(() => {
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (input && input.placeholder?.toLowerCase().includes('ask')) {
            input.value = question;
            input.focus();
            // Trigger form submission
            const sendButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (sendButton) {
              setTimeout(() => sendButton.click(), 100);
            }
          }
        }, 600);
      }
    } else {
      console.warn('PageBuddy button not found. Make sure PageBuddy component is rendered.');
    }
  }

  const handleQuickQuestion = (question: string) => {
    openBuddyWithQuestion(question);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900">
              <Users className="h-4 w-4" />
              For Educators, Coaches & Team Leaders
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Coach Hub
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Fast briefings, printable resources, and breathing plans you can offer to learners, 
              athletes, and colleagues. <strong>Educational information only</strong>; not medical advice.
            </p>
            
            {/* Interactive Help Banner */}
            <Card className="mt-6 border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Need help getting started?</p>
                    <p className="text-sm text-gray-600">Ask NeuroBreath Buddy anything about this page</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="shrink-0 bg-teal-600 hover:bg-teal-700"
                  onClick={() => openBuddyWithQuestion()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask Buddy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start Breathing Sessions */}
      <section className="py-12" id="quick-start-sessions">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-3xl font-bold">Quick-Start Sessions</h2>
              <p className="text-gray-600">
                Click to launch guided breathing exercises. Perfect for group sessions or individual practice.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-teal-600 hover:text-teal-700"
                onClick={() => openBuddyWithQuestion('Explain the quick-start breathing sessions')}
              >
                <Sparkles className="mr-1 h-4 w-4" />
                Ask Buddy about these sessions
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Box Breathing */}
              <Card className="group relative overflow-hidden border-2 border-green-200 transition-all hover:border-green-400 hover:shadow-xl">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-100 opacity-50 transition-transform group-hover:scale-150" />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <div className="h-8 w-8 rounded border-4 border-green-600" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openBuddyWithQuestion('Explain Box Breathing')}
                      title="Ask Buddy about Box Breathing"
                    >
                      <Sparkles className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    🟩 Box Breathing
                  </CardTitle>
                  <CardDescription>
                    4-4-4-4 pattern — calm nerves before presentations, exams, or games
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Recommended: 3 minutes</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                      <Link href="/techniques/box-breathing">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon">
                      <Link href="/techniques/box-breathing">
                        <Timer className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Best for: Focus, pre-task calm, stress reduction
                  </p>
                </CardContent>
              </Card>

              {/* Coherent Breathing */}
              <Card className="group relative overflow-hidden border-2 border-purple-200 transition-all hover:border-purple-400 hover:shadow-xl">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-100 opacity-50 transition-transform group-hover:scale-150" />
                <CardHeader className="relative">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    🟪 Coherent 5-5
                  </CardTitle>
                  <CardDescription>
                    5-second inhale/exhale — optimizes heart rate variability
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Recommended: 5 minutes</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Link href="/techniques/coherent">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon">
                      <Link href="/techniques/coherent">
                        <Timer className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Best for: Deep relaxation, HRV training, recovery
                  </p>
                </CardContent>
              </Card>

              {/* SOS Reset */}
              <Card className="group relative overflow-hidden border-2 border-red-200 transition-all hover:border-red-400 hover:shadow-xl">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-red-100 opacity-50 transition-transform group-hover:scale-150" />
                <CardHeader className="relative">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    🆘 SOS-60 Reset
                  </CardTitle>
                  <CardDescription>
                    60-second emergency calm technique for acute stress
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Duration: 60 seconds</span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                      <Link href="/techniques/sos">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon">
                      <Link href="/techniques/sos">
                        <Timer className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Best for: Panic, overwhelm, immediate de-escalation
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Quick Links */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button asChild variant="outline" className="h-auto justify-start gap-3 p-4">
                <Link href="/techniques/4-7-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <span className="text-lg">🟦</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4-7-8 Breathing</div>
                    <div className="text-xs text-gray-500">Extended exhale for rest</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto justify-start gap-3 p-4">
                <Link href="/breathing/techniques">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                    <Wind className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">All Breath Tools</div>
                    <div className="text-xs text-gray-500">Timers with audio prompts</div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto justify-start gap-3 p-4">
                <Link href="/tools/focus-garden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Brain className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Focus Guide</div>
                    <div className="text-xs text-gray-500">Pre-task briefings & visualization</div>
                  </div>
                </Link>
              </Button>
            </div>

            {/* Quick Questions Panel */}
            <Card className="mt-8 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-600" />
                  Quick Questions? Ask NeuroBreath Buddy
                </CardTitle>
                <CardDescription>
                  Click any question to get instant help from your AI coach assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3"
                    onClick={() => handleQuickQuestion('How do I start a breathing session?')}
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 shrink-0 text-teal-600" />
                      <span className="text-sm">How do I start a breathing session?</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3"
                    onClick={() => handleQuickQuestion('When should I use SOS Reset?')}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                      <span className="text-sm">When should I use SOS Reset?</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3"
                    onClick={() => handleQuickQuestion('How do I track team progress?')}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="text-sm">How do I track team progress?</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start text-left h-auto py-3"
                    onClick={() => handleQuickQuestion('Show me printable resources')}
                  >
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 shrink-0 text-purple-600" />
                      <span className="text-sm">Show me printable resources</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Check-ins Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12" id="team-checkins">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-3 text-3xl font-bold">Team Check-ins & Group Use</h2>
                <p className="text-gray-600">
                  Simple strategies to integrate breathwork into your classroom, training, or team sessions.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openBuddyWithQuestion('How do I use breathwork with my team?')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Tips
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Quick Interventions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      1
                    </div>
                    <div>
                      <p className="font-medium">SOS Reset Protocol</p>
                      <p className="text-sm text-gray-600">
                        Invite a 1-minute SOS reset anytime energy or focus drops
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Transition Breathing</p>
                      <p className="text-sm text-gray-600">
                        Use Box Breathing between activities or before high-stakes moments
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Pre-Performance Routine</p>
                      <p className="text-sm text-gray-600">
                        3-5 minutes of Coherent breathing before games, presentations, or tests
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <p className="font-medium">Built-in Progress Cards</p>
                      <p className="text-sm text-gray-600">
                        Track attendance or practice streaks with the home page progress system
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <p className="font-medium">XP & Badges</p>
                      <p className="text-sm text-gray-600">
                        Learners earn points and achievements for consistent practice
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <p className="font-medium">Share Progress</p>
                      <p className="text-sm text-gray-600">
                        Use the 6-digit code system for parent/teacher monitoring
                      </p>
                    </div>
                  </div>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link href="/progress">
                      View Progress Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Printables & Resources */}
      <section className="py-12" id="printables">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-3 text-3xl font-bold">Printables & Prep Resources</h2>
                  <p className="text-gray-600">
                    Share ahead of sessions or keep copies in a binder. Each download opens in a new tab with live links.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => openBuddyWithQuestion('Show me printable resources')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Ask About Resources
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* One-Page Breathing Guide */}
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">One-Page Breathing Guide</CardTitle>
                  <CardDescription>
                    Step-by-step overview with visuals for the main techniques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                      Box, 4-7-8, Coherent, SOS
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                      Visual timing diagrams
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                      QR codes to online timers
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/legacy-assets/assets/downloads/breathing-cheat-sheet.pdf" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Open PDF
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Classroom Calm Pack */}
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Classroom Calm Pack</CardTitle>
                  <CardDescription>
                    Timers, scripts, and posters for primary and secondary classrooms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Teacher scripts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Classroom posters (A4)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      Printable timer sheets
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/legacy-assets/assets/downloads/adhd_selfcare_breathing_cards.pdf" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      View Pack
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Parent Handover */}
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Parent Handover</CardTitle>
                  <CardDescription>
                    Quick card to explain what you practiced and how to continue at home
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Session summary template
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Home practice suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Resource links for families
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/legacy-assets/assets/downloads/one-page-profile-template.pdf" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      See Template
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* ADHD Tools Pack */}
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <Brain className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">ADHD Tools Pack</CardTitle>
                  <CardDescription>
                    Comprehensive ADHD support resources and strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Focus strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Executive function supports
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      Classroom accommodations
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/legacy-assets/assets/downloads/adhd-tools-resources.pdf" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Download Pack
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Autism Support Guide */}
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                    <Heart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Autism Support Guide</CardTitle>
                  <CardDescription>
                    Clinic guide and checklists for autism support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Sensory accommodations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Communication strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      Assessment checklists (UK)
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/legacy-assets/assets/downloads/autism-clinic-guide-checklists-uk.pdf" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Open Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Dyslexia Parent Support */}
              <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100">
                    <BookOpen className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg">Dyslexia Parent Support</CardTitle>
                  <CardDescription>
                    Home practice guide for dyslexia support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                      Reading strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                      Home practice templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                      Phonics support activities
                    </li>
                  </ul>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/legacy-assets/assets/downloads/dyslexia-parent-support-guide.pdf" target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      Download Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Safeguarding Section */}
      <section className="border-y bg-amber-50 py-12" id="safeguarding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Alert className="border-amber-200 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-lg font-bold">Safeguarding Reminders</AlertTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 -mt-1"
                  onClick={() => openBuddyWithQuestion('What are the safeguarding guidelines?')}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Ask Buddy
                </Button>
              </div>
              <AlertDescription className="mt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium">Always Voluntary</p>
                      <p className="text-sm text-gray-600">
                        Invite, never force, participation. Offer opt-out gestures and quieter alternatives.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium">Breath Holds</p>
                      <p className="text-sm text-gray-600">
                        Keep holds short for anyone with respiratory, cardiovascular, or trauma histories.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium">Clinical Partnership</p>
                      <p className="text-sm text-gray-600">
                        Partner with the person's clinician or guardian before adding breathing plans to care programs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-medium">Emergency Protocol</p>
                      <p className="text-sm text-gray-600">
                        If someone feels unwell, stop immediately, offer normal breathing, and follow your organization's escalation process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900">
                    <strong>Important:</strong> These are educational wellness tools, not medical treatments. 
                    Always work within your scope of practice and refer to licensed healthcare professionals when needed.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-3xl font-bold">Next Steps</h2>
              <p className="text-gray-600">
                Build sustainable practices and share resources with your team
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Build a Routine */}
              <Card className="border-2 border-blue-100 transition-all hover:border-blue-300 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Build a Routine</CardTitle>
                  <CardDescription>
                    Anchor daily calm practices at consistent times
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    Start with 1 minute at the beginning, middle, and end of your timetable. 
                    Consistency makes the skills stick.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/breathing/techniques">
                      View Techniques
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Plan a Calm Block */}
              <Card className="border-2 border-purple-100 transition-all hover:border-purple-300 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Plan a Calm Block</CardTitle>
                  <CardDescription>
                    Dedicated time for breathwork and regulation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    Schedule 10-15 minute sessions weekly. Use the breathing timers and track engagement 
                    through the progress system.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/progress">
                      Track Progress
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Share Contact Card */}
              <Card className="border-2 border-green-100 transition-all hover:border-green-300 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Share the Platform</CardTitle>
                  <CardDescription>
                    Give families access to the full toolkit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    Share neurobreath.co.uk with parents and colleagues so they can access breathing 
                    exercises, tools, and resources anytime.
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText('https://neurobreath.co.uk')
                        alert('Link copied to clipboard!')
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Resources CTA */}
            <Card className="mt-8 bg-gradient-to-br from-teal-600 to-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="mb-3 text-2xl font-bold">Need More Support?</h3>
                <p className="mb-6 text-teal-50">
                  Explore condition-specific hubs, interactive tools, and AI-powered coaching
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/coach">
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI Coach
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/adhd">
                      <Brain className="mr-2 h-5 w-5" />
                      ADHD Hub
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/conditions/autism">
                      <Heart className="mr-2 h-5 w-5" />
                      Autism Hub
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PageBuddy - Interactive AI Assistant */}
      <PageBuddy />
    </div>
  )
}
