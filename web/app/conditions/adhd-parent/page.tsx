'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Heart, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Lightbulb,
  Clock,
  Calendar,
  Home,
  Brain,
  Pill,
  Star,
  Zap,
  Target,
  AlertCircle,
  Award,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function ADHDParentSupportPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="mx-auto px-4 max-w-[86vw]">
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <Heart className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">ADHD Parent Support Hub</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Comprehensive guidance for parents supporting children and teens with ADHD: home strategies, 
              school collaboration, treatment options, and evidence-based approaches
            </p>
            <p className="text-sm opacity-75 max-w-2xl mx-auto">
              Based on NICE guidelines, CDC recommendations, and peer-reviewed ADHD research
            </p>
          </div>

          {/* Quick Navigation Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="#home-strategies" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Home Strategies
            </a>
            <a href="#school-collaboration" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              School Support
            </a>
            <a href="#treatment-options" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Treatment Options
            </a>
            <a href="#age-specific" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              By Age Group
            </a>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Daily routines</Badge>
                <CardTitle>Structure & support at home</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Practical strategies for managing daily routines, homework, sleep, and behavior at home.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <a href="#home-strategies">View strategies</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">School partnerships</Badge>
                <CardTitle>Working with school</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Navigate 504 plans, IEPs, parent-teacher meetings, and reasonable adjustments.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#school-collaboration">School guidance</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Evidence-based</Badge>
                <CardTitle>Treatment & medication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Understand medication options, behavioral interventions, and combined approaches.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#treatment-options">Treatment info</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Key Principles */}
          <Card className="mt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Core principles</Badge>
              <CardTitle>Supporting your child with ADHD</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    Consistency & structure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Predictable routines, clear expectations, visual schedules, and consistent consequences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    Positive reinforcement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Catch them being good, reward effort not just outcomes, celebrate small wins daily.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Partnership approach
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Work collaboratively with school, doctors, and your child to create personalized support.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Educational information only; not medical advice. Always consult with healthcare professionals 
                for diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Parent Overview */}
      <section id="parent-overview" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 max-w-[86vw]">
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">ADHD (Parents) — quick overview</h2>
              <p className="text-muted-foreground">
                A quick reference for parents supporting children and teens with ADHD across home, school, and community settings.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">First steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <span>Seek professional assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <span>Learn about ADHD types and presentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <span>Build support team (school, doctor, therapist)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  What is ADHD?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Neurodevelopmental condition</li>
                  <li>• Affects attention, impulse control, hyperactivity</li>
                  <li>• Three types: Inattentive, Hyperactive-Impulsive, Combined</li>
                  <li>• Lifelong condition but manageable with support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Common signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Difficulty sustaining attention</li>
                  <li>• Forgetfulness & losing things</li>
                  <li>• Fidgeting & restlessness</li>
                  <li>• Impulsive decisions</li>
                  <li>• Difficulty waiting turn</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Quick wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Create visual daily schedule</li>
                  <li>• Break tasks into small steps</li>
                  <li>• Use timers & alarms</li>
                  <li>• Reward charts for positive behavior</li>
                  <li>• Movement breaks every 20-30 min</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Key resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <a 
                    href="https://www.cdc.gov/ncbddd/adhd/index.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    CDC ADHD Resources
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://chadd.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    CHADD (Parent Support)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.nice.org.uk/guidance/ng87" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    NICE ADHD Guidance
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Home Strategies Section */}
      <section id="home-strategies" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="mx-auto px-4 max-w-[86vw]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Support at Home: Daily Strategies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Evidence-based approaches for managing ADHD at home, from morning routines to bedtime
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Structure</Badge>
                <CardTitle>Daily routines & organization</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="morning">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">Morning routine</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Wake at consistent time (including weekends)</li>
                        <li>Visual checklist on wall (get dressed, brush teeth, breakfast, pack bag)</li>
                        <li>Lay out clothes & pack bag night before</li>
                        <li>Use timers for each task (5 min to get dressed)</li>
                        <li>Minimize distractions (no TV during morning routine)</li>
                        <li>Positive start: one thing they look forward to</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="homework">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">Homework & study time</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Same time & place daily (reduces decision fatigue)</li>
                        <li>Short bursts: 10-20 min work, 5 min break</li>
                        <li>Remove distractions (phone in another room)</li>
                        <li>Break assignments into small steps</li>
                        <li>Use planner or app to track assignments</li>
                        <li>Reward completion, not perfection</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="evening">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Evening & bedtime</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Dinner at consistent time</li>
                        <li>Screen-free 1 hour before bed</li>
                        <li>Calm activities: reading, puzzles, quiet play</li>
                        <li>Bedtime routine checklist (bath, pajamas, teeth, story)</li>
                        <li>Same bedtime nightly (even weekends)</li>
                        <li>Dark, cool, quiet bedroom</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="organization">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Organization systems</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Visual calendar in common area</li>
                        <li>Color-coded folders for school subjects</li>
                        <li>Dedicated place for keys, backpack, sports gear</li>
                        <li>One inbox for papers/forms</li>
                        <li>Weekly declutter session (15 min)</li>
                        <li>Photos of "where things go"</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Behavior</Badge>
                <CardTitle>Positive behavior strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="reinforcement">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold">Reward systems</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Immediate rewards work best (not "at end of week")</li>
                        <li>Token economy: earn stars/points for target behaviors</li>
                        <li>Variety of rewards: screen time, special activity, small treat</li>
                        <li>Praise specific behaviors: "Great job putting shoes away!"</li>
                        <li>Catch them being good 4x more than catching mistakes</li>
                        <li>Reward effort, not just outcomes</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="consequences">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold">Clear consequences</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Consistent and immediate</li>
                        <li>Natural consequences when possible (forgot lunch = buy at school)</li>
                        <li>Time-outs brief (1 min per year of age)</li>
                        <li>Remove privileges related to behavior</li>
                        <li>Avoid long lectures; state consequence calmly</li>
                        <li>Follow through every time</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="communication">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Communication strategies</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Get eye contact before giving instructions</li>
                        <li>One instruction at a time</li>
                        <li>Ask them to repeat it back</li>
                        <li>Use "when-then": "When you finish homework, then you can play"</li>
                        <li>Give 5-minute, 2-minute, 1-minute warnings before transitions</li>
                        <li>Stay calm; lower your voice instead of raising it</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="emotional">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <span className="font-semibold">Emotional regulation</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Teach deep breathing (before meltdown)</li>
                        <li>Create calm-down corner with sensory tools</li>
                        <li>Name emotions: "You look frustrated"</li>
                        <li>Problem-solve after they're calm</li>
                        <li>Build in movement breaks</li>
                        <li>Watch for hunger/tired triggers</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Consistency is key:</strong> It takes 3-4 weeks to establish new routines. Don't give up if 
              you don't see immediate results. Small, consistent changes add up over time.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* School Collaboration Section */}
      <section id="school-collaboration" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 max-w-[86vw]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Working with School: Advocacy & Support</h2>
          
          <Tabs defaultValue="communication" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
            </TabsList>

            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Effective parent-teacher communication</CardTitle>
                  <CardDescription>
                    Build a strong partnership with your child's teachers and school
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Initial contact</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Share ADHD diagnosis and key challenges early in school year</li>
                        <li>Provide one-page student profile (strengths, challenges, what works)</li>
                        <li>Ask about teacher's experience with ADHD</li>
                        <li>Establish preferred communication method (email, phone, app)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Ongoing communication</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Brief weekly check-ins (not just when there's a problem)</li>
                        <li>Share what's working at home</li>
                        <li>Ask specific questions: "How is she doing with completing assignments?"</li>
                        <li>Respond promptly to teacher concerns</li>
                        <li>Thank teachers for accommodations and support</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">When concerns arise</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Address issues early before they escalate</li>
                        <li>Request meeting if email isn't sufficient</li>
                        <li>Bring data: homework log, behavior chart, medication timing</li>
                        <li>Focus on solutions, not blame</li>
                        <li>Request updates in 2-4 weeks to assess progress</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accommodations" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">504 Plan (US)</CardTitle>
                    <CardDescription>Accommodations under Section 504</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">What it is</h4>
                        <p className="text-sm text-muted-foreground">
                          Legal document ensuring reasonable accommodations for students with disabilities 
                          (ADHD qualifies)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Common accommodations</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                          <li>Extended time on tests</li>
                          <li>Preferential seating (front, away from distractions)</li>
                          <li>Frequent breaks</li>
                          <li>Reduced homework load</li>
                          <li>Extra set of textbooks for home</li>
                          <li>Use of fidget tools</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">IEP (US)</CardTitle>
                    <CardDescription>Special education services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">What it is</h4>
                        <p className="text-sm text-muted-foreground">
                          If ADHD significantly impacts learning and requires specialized instruction 
                          (not just accommodations)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">May include</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                          <li>Executive function coaching</li>
                          <li>Social skills groups</li>
                          <li>Organization/study skills instruction</li>
                          <li>Behavior intervention plan</li>
                          <li>Modified curriculum</li>
                          <li>Resource room support</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">UK: SEND Support & EHCP</CardTitle>
                    <CardDescription>Special Educational Needs support in UK schools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">SEN Support</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                          <li>School-based support & adjustments</li>
                          <li>Graduated approach (Assess-Plan-Do-Review)</li>
                          <li>No formal assessment required</li>
                          <li>SENCO coordinates support</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">EHCP (Education, Health & Care Plan)</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                          <li>For complex/significant needs</li>
                          <li>Legal document with specified provision</li>
                          <li>Local Authority assessment process</li>
                          <li>Annual reviews required</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="meetings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preparing for school meetings</CardTitle>
                  <CardDescription>
                    Whether it's a parent-teacher conference, 504 meeting, or IEP meeting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Before the meeting</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>List your top 3 concerns/goals</li>
                        <li>Gather evidence: report cards, work samples, behavior logs</li>
                        <li>Review previous meeting notes/plans</li>
                        <li>Ask for agenda in advance</li>
                        <li>Bring a support person if helpful</li>
                        <li>Write down questions you want to ask</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">During the meeting</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Start with child's strengths</li>
                        <li>Take notes (or ask to record)</li>
                        <li>Ask questions if you don't understand something</li>
                        <li>Be specific about what you're requesting</li>
                        <li>Agree on action steps with timelines</li>
                        <li>Request copy of all documents</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">After the meeting</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Send thank you email summarizing agreed actions</li>
                        <li>File all documents in organized binder</li>
                        <li>Set reminder for follow-up date</li>
                        <li>Share plan with child (age-appropriate)</li>
                        <li>Monitor implementation of accommodations</li>
                        <li>Request progress update in 4-6 weeks</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Treatment Options Section */}
      <section id="treatment-options" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="mx-auto px-4 max-w-[86vw]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Treatment Options: Evidence-Based Approaches</h2>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This information is for educational purposes only. Always consult 
              with qualified healthcare professionals about diagnosis and treatment decisions for your child.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Medication</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-600" />
                  ADHD medication overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Stimulant medications</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      First-line treatment; 70-80% of children respond well
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li><strong>Methylphenidate:</strong> Ritalin, Concerta, Daytrana (patch)</li>
                      <li><strong>Amphetamines:</strong> Adderall, Vyvanse, Dexedrine</li>
                      <li><strong>Duration:</strong> Short-acting (3-4 hrs) or long-acting (8-12 hrs)</li>
                      <li><strong>Effects:</strong> Improve focus, reduce impulsivity, decrease hyperactivity</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Non-stimulant medications</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      For children who don't respond to or can't tolerate stimulants
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li><strong>Atomoxetine (Strattera):</strong> 24-hour coverage</li>
                      <li><strong>Guanfacine (Intuniv):</strong> Also helps with sleep/anxiety</li>
                      <li><strong>Clonidine (Kapvay):</strong> Can be combined with stimulants</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">What to monitor</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Appetite & sleep (common side effects)</li>
                      <li>Mood changes (irritability when wearing off)</li>
                      <li>Height & weight (check every 3-6 months)</li>
                      <li>Effectiveness (track with rating scales)</li>
                      <li>Heart rate & blood pressure (baseline & ongoing)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Behavioral</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Behavioral interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Parent training programs</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Evidence-based programs teach effective behavior management
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li><strong>PCIT:</strong> Parent-Child Interaction Therapy (ages 2-7)</li>
                      <li><strong>Triple P:</strong> Positive Parenting Program</li>
                      <li><strong>Incredible Years:</strong> Group parent training</li>
                      <li><strong>Barkley's program:</strong> Defiant Children/Teens</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">School-based interventions</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Daily report card (home-school communication)</li>
                      <li>Behavioral classroom management</li>
                      <li>Social skills training</li>
                      <li>Executive function coaching</li>
                      <li>Organizational skills training</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Individual therapy</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li><strong>CBT:</strong> For co-occurring anxiety/depression</li>
                      <li><strong>Executive function coaching:</strong> Teens/young adults</li>
                      <li><strong>Family therapy:</strong> If family stress is high</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Combined approach</h4>
                    <p className="text-sm text-muted-foreground">
                      Research shows <strong>medication + behavioral intervention</strong> works best for 
                      most children. The MTA study found combined treatment allowed lower medication doses 
                      with equal or better outcomes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Age-Specific Guidance */}
      <section id="age-specific" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 max-w-[86vw]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">ADHD by Age Group</h2>
          
          <Tabs defaultValue="early" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
              <TabsTrigger value="early">Early (3-6)</TabsTrigger>
              <TabsTrigger value="school">School (7-12)</TabsTrigger>
              <TabsTrigger value="teen">Teen (13-18)</TabsTrigger>
              <TabsTrigger value="young">Young Adult</TabsTrigger>
            </TabsList>

            <TabsContent value="early">
              <Card>
                <CardHeader>
                  <CardTitle>Early childhood (ages 3-6)</CardTitle>
                  <CardDescription>Preschool and early elementary years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Key challenges</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Extreme activity level</li>
                        <li>Can't sit still for stories/meals</li>
                        <li>Frequent tantrums & meltdowns</li>
                        <li>Danger unawareness (runs into street)</li>
                        <li>Difficulty with transitions</li>
                        <li>Expelled from preschool/daycare</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Strategies that help</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>High structure & predictability</li>
                        <li>Frequent praise for good behavior</li>
                        <li>Short time-outs (1 min per year)</li>
                        <li>Remove dangerous items from reach</li>
                        <li>Active play before quiet activities</li>
                        <li>Parent training programs (PCIT)</li>
                      </ul>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Medication:</strong> For ages 4-5, behavioral interventions are recommended first. 
                      Methylphenidate may be considered if behavior therapy isn't sufficient. For ages 3 and under, 
                      medication is not recommended.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="school">
              <Card>
                <CardHeader>
                  <CardTitle>School age (ages 7-12)</CardTitle>
                  <CardDescription>Elementary and early middle school years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Key challenges</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Homework battles</li>
                        <li>Forgetting assignments/materials</li>
                        <li>Social difficulties (interrupting, bossiness)</li>
                        <li>Low frustration tolerance</li>
                        <li>Disorganization & losing things</li>
                        <li>Poor time management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Strategies that help</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Homework routine & organization system</li>
                        <li>Daily report card (home-school)</li>
                        <li>Social skills groups</li>
                        <li>Medication during school hours</li>
                        <li>504 plan or IEP if needed</li>
                        <li>Extracurricular activities (sports, scouts)</li>
                      </ul>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Treatment:</strong> Combination of medication and behavioral interventions 
                      recommended. This is when ADHD often significantly impacts academic and social functioning.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teen">
              <Card>
                <CardHeader>
                  <CardTitle>Teenagers (ages 13-18)</CardTitle>
                  <CardDescription>Middle and high school years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Key challenges</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Increased academic demands</li>
                        <li>Managing multiple teachers/classes</li>
                        <li>Long-term project planning</li>
                        <li>Risky behaviors (driving, substance use)</li>
                        <li>Low self-esteem</li>
                        <li>Resistance to parent involvement</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Strategies that help</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Transfer responsibility gradually</li>
                        <li>Executive function coaching</li>
                        <li>Planner/app training</li>
                        <li>Natural consequences (within safety limits)</li>
                        <li>Driving contract & close monitoring</li>
                        <li>Substance use education</li>
                      </ul>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Monitor for co-occurring conditions (depression, anxiety, 
                      substance use). Risk-taking behaviors increase with ADHD. Stay involved while respecting 
                      growing independence.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="young">
              <Card>
                <CardHeader>
                  <CardTitle>Young adults (ages 18+)</CardTitle>
                  <CardDescription>College, work, and independent living</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">Key challenges</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Managing without parental structure</li>
                        <li>Time management & planning</li>
                        <li>Financial management</li>
                        <li>Medication management</li>
                        <li>Relationship difficulties</li>
                        <li>Job performance & retention</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Strategies that help</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>College disability services</li>
                        <li>ADHD coaching</li>
                        <li>Workplace accommodations</li>
                        <li>Accountability partners</li>
                        <li>Technology tools & apps</li>
                        <li>Regular check-ins with prescriber</li>
                      </ul>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Transition planning:</strong> Start discussing college/work accommodations in 
                      high school. Young adults need to self-advocate and manage their own treatment. Consider 
                      ADHD coaching for executive function support.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Resources & Support */}
      <section id="resources" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="mx-auto px-4 max-w-[86vw]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Resources & Support Organizations</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CHADD</CardTitle>
                <CardDescription>Children and Adults with ADHD</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Leading ADHD organization with local chapters, webinars, and annual conference
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://chadd.org/" target="_blank" rel="noopener noreferrer">
                    Visit CHADD
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CDC ADHD Resources</CardTitle>
                <CardDescription>Centers for Disease Control</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Evidence-based information, free parent training modules, and treatment guidelines
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.cdc.gov/ncbddd/adhd/index.html" target="_blank" rel="noopener noreferrer">
                    Visit CDC
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ADDitude Magazine</CardTitle>
                <CardDescription>Online ADHD resource</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Articles, webinars, downloads on all aspects of ADHD across the lifespan
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.additudemag.com/" target="_blank" rel="noopener noreferrer">
                    Visit ADDitude
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Understood.org</CardTitle>
                <CardDescription>Learning & thinking differences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  School support, IEP/504 guidance, assistive technology recommendations
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.understood.org/en/articles/conditions/adhd" target="_blank" rel="noopener noreferrer">
                    Visit Understood
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NICE Guidance (UK)</CardTitle>
                <CardDescription>Clinical guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  UK clinical guidelines for ADHD diagnosis and management in children and adults
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.nice.org.uk/guidance/ng87" target="_blank" rel="noopener noreferrer">
                    Visit NICE
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ADHD Foundation (UK)</CardTitle>
                <CardDescription>UK charity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  UK-focused support, neurodiversity week, training, and advocacy
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.adhdfoundation.org.uk/" target="_blank" rel="noopener noreferrer">
                    Visit ADHD Foundation
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Breathing & Regulation */}
      <section id="breathing" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 max-w-[86vw]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Breathing & Regulation for ADHD
          </h2>
          
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Using NeuroBreath with ADHD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">How breathing helps ADHD</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Focus & attention:</strong> Brief breathing breaks improve concentration</li>
                    <li>• <strong>Impulse control:</strong> Pause-breathe-respond instead of react</li>
                    <li>• <strong>Emotional regulation:</strong> Calm the nervous system during frustration</li>
                    <li>• <strong>Transitions:</strong> Reset between activities</li>
                    <li>• <strong>Sleep:</strong> Wind-down breathing before bed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Best techniques for ADHD</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>SOS-60:</strong> Quick 1-minute reset</li>
                    <li>• <strong>Box Breathing:</strong> Simple 4-count pattern</li>
                    <li>• <strong>4-7-8:</strong> For bedtime & anxiety</li>
                    <li>• <strong>Focus Timer:</strong> Pomodoro with breath breaks</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
                <Link href="/techniques/sos">
                  <Button variant="default" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🆘</div>
                      <div className="text-xs">SOS-60</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/box-breathing">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟩</div>
                      <div className="text-xs">Box Breathing</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/4-7-8">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟦</div>
                      <div className="text-xs">4-7-8 Breathing</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/adhd">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">⏱️</div>
                      <div className="text-xs">Focus Timer</div>
                    </div>
                  </Button>
                </Link>
              </div>

              <Alert className="mt-6">
                <Rocket className="h-4 w-4" />
                <AlertDescription>
                  <strong>ADHD-friendly tip:</strong> Keep breathing exercises short (1-2 minutes). 
                  Use them as "reset buttons" throughout the day rather than long meditation sessions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

