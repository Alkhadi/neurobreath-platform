"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Brain, 
  BookOpen, 
  Activity,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Phone,
  School,
  Home,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react"
import { StreakTracker } from "@/components/anxiety-tools/streak-tracker"
import { DailyChallenges } from "@/components/anxiety-tools/daily-challenges"
import { SupportQuiz } from "@/components/anxiety-tools/support-quiz"
import { AchievementBoard } from "@/components/anxiety-tools/achievement-board"
import { CrisisResources } from "@/components/anxiety-tools/crisis-resources"

export default function AnxietyParentSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Heart className="h-3 w-3 mr-1" />
              For Parents & Guardians
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Supporting Your Child Through Anxiety
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Evidence-based strategies, interactive learning, and daily support to help you become your child's anxiety ally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-blue-50">
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="h-5 w-5 mr-2" />
                Crisis Resources
              </Button>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-white mb-1">20.3%</div>
                <p className="text-blue-100 text-sm">UK children (8-16) have anxiety disorders</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-white mb-1">31.9%</div>
                <p className="text-blue-100 text-sm">US adolescents experience anxiety in their lifetime</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-white mb-1">Early Support</div>
                <p className="text-blue-100 text-sm">Parental involvement significantly improves outcomes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <StreakTracker />
          <SupportQuiz />
          <DailyChallenges />
          <AchievementBoard />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Understanding Anxiety */}
        <Card className="mb-8 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Understanding Your Child's Anxiety
            </CardTitle>
            <CardDescription>
              Anxiety is not a choice. It's a real condition with physical, emotional, and behavioral symptoms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="physical" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="physical">Physical Signs</TabsTrigger>
                <TabsTrigger value="behavioral">Behavioral Signs</TabsTrigger>
                <TabsTrigger value="cognitive">Cognitive Signs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="physical" className="space-y-4 mt-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-lg mb-4 text-red-900 dark:text-red-100">Physical Manifestations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Stomachaches & Headaches</p>
                        <p className="text-sm text-muted-foreground">Without medical cause, often before school</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Sleep Difficulties</p>
                        <p className="text-sm text-muted-foreground">Trouble falling asleep, nightmares, night waking</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Fatigue & Restlessness</p>
                        <p className="text-sm text-muted-foreground">Always tired yet unable to relax</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Muscle Tension</p>
                        <p className="text-sm text-muted-foreground">Clenched jaw, tense shoulders</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Appetite Changes</p>
                        <p className="text-sm text-muted-foreground">Eating more or less than usual</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Rapid Heartbeat</p>
                        <p className="text-sm text-muted-foreground">Pounding heart, especially during stress</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded border">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      Important: These symptoms are REAL, not fabricated. The stress response causes genuine physical reactions.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="behavioral" className="space-y-4 mt-6">
                <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-lg mb-4 text-amber-900 dark:text-amber-100">Behavioral Warning Signs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Avoidance</p>
                        <p className="text-sm text-muted-foreground">Avoiding school, social situations, or activities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Excessive Reassurance-Seeking</p>
                        <p className="text-sm text-muted-foreground">"Will I be okay?" "Are you sure?" repeatedly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Clinginess</p>
                        <p className="text-sm text-muted-foreground">Difficulty separating, following you everywhere</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Irritability & Meltdowns</p>
                        <p className="text-sm text-muted-foreground">Quick to anger, emotional outbursts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Perfectionism</p>
                        <p className="text-sm text-muted-foreground">Erasing repeatedly, fear of mistakes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Regression</p>
                        <p className="text-sm text-muted-foreground">Baby talk, thumb-sucking, bedwetting</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cognitive" className="space-y-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-lg mb-4 text-blue-900 dark:text-blue-100">Cognitive Patterns</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">"What if..." Questions</p>
                        <p className="text-sm text-muted-foreground">Constant worry about future events</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Catastrophic Thinking</p>
                        <p className="text-sm text-muted-foreground">Imagining worst-case scenarios</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Difficulty Concentrating</p>
                        <p className="text-sm text-muted-foreground">Mind goes blank, can't focus on tasks</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Negative Self-Talk</p>
                        <p className="text-sm text-muted-foreground">"I can't do it," "I'm going to fail"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Evidence-Based Strategies */}
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              Evidence-Based Strategies for Parents
            </CardTitle>
            <CardDescription>
              Research-backed approaches that make a difference
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-green-50 dark:bg-green-950/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-lg">1. Validate, Don't Dismiss</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-green-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">DO SAY:</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        "I can see you're really worried about the test. That must feel hard."<br/>
                        "It's okay to feel nervous. Let's figure this out together."<br/>
                        "Your feelings are valid. I'm here to support you."
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">DON'T SAY:</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        "There's nothing to worry about."<br/>
                        "You're fine, just relax."<br/>
                        "Stop being dramatic."
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
                    <p className="text-sm font-medium">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      Why it works: Validation acknowledges their experience and builds trust. Dismissing teaches them their feelings are wrong or shameful.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-lg">2. Encourage Gradual Exposure (Not Avoidance)</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-indigo-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Avoidance temporarily reduces anxiety but maintains it long-term. Research shows gradual exposure (facing fears step-by-step) is one of the most effective anxiety treatments.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Example: Social Anxiety (Fear of Birthday Parties)</p>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Look at party invitation, talk about it (no commitment)</li>
                        <li>RSVP "yes" but plan to arrive late/leave early</li>
                        <li>Attend for 30 minutes with parent nearby</li>
                        <li>Attend for 1 hour</li>
                        <li>Attend full party, parent stays</li>
                        <li>Attend full party, parent drops off</li>
                      </ol>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Praise brave behavior, not just outcomes</p>
                      <p className="text-sm text-muted-foreground">"I'm so proud you went to the party for 30 minutes, even though you were nervous!"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Don't enable avoidance</p>
                      <p className="text-sm text-muted-foreground">Letting them skip school repeatedly reinforces that school is dangerous. Work with professionals for gradual reintegration.</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-lg">3. Model Healthy Coping</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-purple-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Children learn by watching you. Demonstrate healthy responses to stress out loud so they can learn the pattern.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Examples:</p>
                      <ul className="text-sm space-y-2 list-disc list-inside">
                        <li>"I'm feeling stressed about my presentation. I'm going to take some deep breaths to calm down."</li>
                        <li>"I made a mistake at work today. That's okay, everyone makes mistakes. I'll learn from it."</li>
                        <li>"I'm worried about the traffic, but worrying won't change it. I'll listen to music and relax."</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
                    <p className="text-sm font-medium">
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      Normalize emotions + show healthy responses = powerful learning
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-lg">4. Limit (Don't Eliminate) Reassurance</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-amber-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Constant reassurance maintains anxiety because it prevents your child from building confidence in their own judgment.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                      <p className="font-semibold text-sm mb-2 text-red-900 dark:text-red-100">❌ Excessive Reassurance</p>
                      <p className="text-sm text-muted-foreground">
                        Child: "Will I be okay?"<br/>
                        Parent: "Yes, you'll be fine!"<br/>
                        <span className="italic">(Repeated 20 times)</span>
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                      <p className="font-semibold text-sm mb-2 text-green-900 dark:text-green-100">✅ Healthy Response</p>
                      <p className="text-sm text-muted-foreground">
                        Child: "Will I be okay?"<br/>
                        Parent: "What do you think? How have you handled this before?"
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded">
                    <p className="text-sm font-medium">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      Balance: Provide reassurance 1-2 times, then redirect to their own resources.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-lg">5. Maintain Consistent Routines</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-blue-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Predictability reduces anxiety. Consistent sleep, meal, and activity schedules provide a sense of security.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm">Morning Routine</h5>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Same wake-up time (even weekends)</li>
                        <li>Healthy breakfast</li>
                        <li>Brief check-in before school</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm">Evening Routine</h5>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        <li>Consistent bedtime (±30 min)</li>
                        <li>Wind-down activities (reading, music)</li>
                        <li>Avoid screens 1 hour before bed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors">
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-rose-600" />
                  <span className="font-semibold text-lg">6. Collaborate with School</span>
                </div>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-6 border-l-4 border-rose-500 ml-6 mt-2 bg-white dark:bg-gray-900 rounded-r-lg">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Communication between home and school ensures consistent support.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Share with Teachers:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Anxiety triggers (tests, presentations, social situations)</li>
                        <li>Effective coping strategies</li>
                        <li>Signs of escalating anxiety</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded">
                      <p className="font-semibold text-sm mb-2">Possible Accommodations (504 Plan/IEP):</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Extended time on tests</li>
                        <li>Testing in separate, quiet room</li>
                        <li>Breaks when needed</li>
                        <li>Preferential seating (near door, away from distractions)</li>
                        <li>Modified homework expectations during high-stress periods</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* When to Seek Professional Help */}
        <Card className="mb-8 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Phone className="h-6 w-6 text-red-600" />
              When to Seek Professional Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800 space-y-4">
              <p className="font-semibold">Contact a mental health professional if:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Anxiety interferes with school, friendships, or family life</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Physical symptoms lead to school avoidance</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Panic attacks</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Excessive rituals or checking behaviors</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Self-harm or suicidal thoughts</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">No improvement after 4-6 weeks of home strategies</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded border">
                <p className="font-semibold mb-2">First-Line Treatment: Cognitive Behavioral Therapy (CBT)</p>
                <p className="text-sm text-muted-foreground">
                  NICE guidelines recommend CBT as first-line treatment for anxiety disorders. CBT teaches children to identify and challenge anxious thoughts, develop coping skills, and face fears gradually. Parent involvement significantly improves outcomes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Resources */}
        <CrisisResources />
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This page provides educational information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.
            </p>
            <p>
              Content based on evidence from NICE guidelines, NHS resources, Anxiety Canada, and peer-reviewed research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
