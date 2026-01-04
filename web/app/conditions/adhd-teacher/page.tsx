'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Lightbulb,
  Clock,
  Calendar,
  Target,
  AlertCircle,
  Award,
  FileText,
  Zap,
  Brain,
  Shield,
  ClipboardCheck,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ADHDTeacherSupportPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-purple-600 via-orange-500 to-pink-600 text-white">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">ADHD Teachers Support Hub</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Comprehensive guidance for teachers supporting students with ADHD: classroom strategies, 
              accommodations, 504/IEP planning, and evidence-based interventions
            </p>
            <p className="text-sm opacity-75 max-w-2xl mx-auto">
              Based on IDEA regulations, research on ADHD in schools, and effective classroom management strategies
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="#classroom-strategies" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Classroom Strategies
            </a>
            <a href="#accommodations" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Accommodations
            </a>
            <a href="#504-iep" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              504/IEP Planning
            </a>
            <a href="#behavior-management" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Behavior Support
            </a>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Immediate strategies</Badge>
                <CardTitle>Classroom toolkit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Practical, ready-to-use strategies for managing ADHD behaviors and supporting learning.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <a href="#classroom-strategies">View strategies</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Legal requirements</Badge>
                <CardTitle>504 & IEP guidance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Navigate accommodations, modifications, and formal support planning.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#504-iep">Legal guidance</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Evidence-based</Badge>
                <CardTitle>Behavior interventions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Research-backed approaches for reducing disruptive behaviors and increasing engagement.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#behavior-management">Behavior support</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Core Principles */}
          <Card className="mt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Core principles</Badge>
              <CardTitle>Teaching students with ADHD effectively</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    Structure & clarity
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clear expectations, consistent routines, visual schedules, and predictable transitions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    Active engagement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Frequent opportunities to respond, movement breaks, hands-on learning, and novelty.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Positive reinforcement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Immediate, specific feedback; reward effort; catch students being good; build relationship.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Educational information; not a substitute for IEP team decisions or school psychologist consultation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Teacher Overview - truncated for space */}
      <section id="teacher-overview" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">ADHD (Teachers) — quick overview</h2>
          
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
                  <li>• Neurodevelopmental disorder</li>
                  <li>• Affects 5-10% of students</li>
                  <li>• Three presentations: Inattentive, Hyperactive-Impulsive, Combined</li>
                  <li>• Not due to laziness or poor parenting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Classroom signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Difficulty staying seated</li>
                  <li>• Blurting out answers</li>
                  <li>• Not following multi-step directions</li>
                  <li>• Losing materials/assignments</li>
                  <li>• Incomplete work despite ability</li>
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
                  <li>• Seat near teacher, away from distractions</li>
                  <li>• Break tasks into smaller steps</li>
                  <li>• Frequent check-ins & feedback</li>
                  <li>• Movement breaks every 20 min</li>
                  <li>• Visual schedule on desk</li>
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
                    href="https://chadd.org/for-educators/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    CHADD for Educators
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.cdc.gov/ncbddd/adhd/school-success.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    CDC School Success
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Classroom Strategies - comprehensive section */}
      <section id="classroom-strategies" className="py-16 bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-purple-950 dark:via-orange-950 dark:to-pink-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Classroom Strategies for ADHD</h2>
          
          <Tabs defaultValue="environment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="instruction">Instruction</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
            </TabsList>

            <TabsContent value="environment">
              <Card>
                <CardHeader>
                  <CardTitle>Classroom environment & seating</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <strong>Preferential seating:</strong> Near teacher, away from windows/doors, 
                        next to positive role model, not in high-traffic areas
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <strong>Reduce distractions:</strong> Minimize visual clutter on walls near desk, 
                        use study carrels for independent work, consider noise-cancelling headphones
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <strong>Movement options:</strong> Standing desk, stability ball chair, fidget tools 
                        (stress ball, Theraband on chair legs), movement breaks
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <strong>Visual supports:</strong> Daily schedule on desk, behavior chart visible, 
                        task checklist, timer for transitions
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instruction">
              <Card>
                <CardHeader>
                  <CardTitle>Instructional modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="delivery">
                      <AccordionTrigger>Lesson delivery</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Start with attention-grabber (funny story, surprising fact)</li>
                          <li>State objective clearly & write on board</li>
                          <li>Use multi-sensory instruction (visual, auditory, kinesthetic)</li>
                          <li>Break information into chunks (teach-practice-teach-practice)</li>
                          <li>Frequent opportunities to respond (thumbs up/down, whiteboards)</li>
                          <li>Movement built into lesson (stand up for answer, act out concept)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="attention">
                      <AccordionTrigger>Maintaining attention</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Cue before calling on: "John, here's your question..."</li>
                          <li>Use proximity - teach near ADHD student frequently</li>
                          <li>Vary voice tone, volume, pace</li>
                          <li>Use visual aids (not just lecture)</li>
                          <li>Check for understanding frequently</li>
                          <li>Limit lecture to 10-15 minutes at a time</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="directions">
                      <AccordionTrigger>Giving directions</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Get student's attention first (eye contact, proximity)</li>
                          <li>Keep directions simple and brief (one step at a time)</li>
                          <li>Write directions on board + state verbally</li>
                          <li>Ask student to repeat back</li>
                          <li>Provide written copy for complex tasks</li>
                          <li>Give time warnings: "5 more minutes to finish"</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization & time management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Materials management</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Color-coded folders/notebooks for each subject</li>
                        <li>Keep extra supplies on hand (student often forgets)</li>
                        <li>Designated place for turning in work</li>
                        <li>Check planner/assignment book daily (initial it)</li>
                        <li>Clean out desk/locker weekly (structured time)</li>
                        <li>Take photo of assignment board/post online</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Time management support</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Visual timer on desk for independent work</li>
                        <li>Break long assignments into timed chunks</li>
                        <li>Extended time for tests (50% more typically)</li>
                        <li>Reduce homework amount (not just more time)</li>
                        <li>Use agenda/planner with regular teacher check-ins</li>
                        <li>Front-load long-term projects with checkpoints</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Assignment modifications</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Reduce length (10 problems instead of 30)</li>
                        <li>One task per page (not cluttered worksheet)</li>
                        <li>Highlight key words in directions</li>
                        <li>Provide study guides/notes before test</li>
                        <li>Allow typing instead of handwriting</li>
                        <li>Accept late work with small penalty</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior">
              <Card>
                <CardHeader>
                  <CardTitle>Positive behavior strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Classroom-wide strategies</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Clear, consistent rules (post visually)</li>
                        <li>Teach & practice expectations explicitly</li>
                        <li>High rates of positive reinforcement (4:1 positive:negative)</li>
                        <li>Ignore minor behaviors when safe to do so</li>
                        <li>Calm, brief redirections (avoid power struggles)</li>
                        <li>Movement breaks for whole class benefits everyone</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Individual behavior plans</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li><strong>Daily report card:</strong> Track 3-5 target behaviors, rate daily, share with parents</li>
                        <li><strong>Token economy:</strong> Earn points/tickets for positive behaviors, trade for privileges</li>
                        <li><strong>Behavior contract:</strong> Written agreement about expectations & rewards</li>
                        <li><strong>Check-in/check-out:</strong> Brief morning & afternoon meeting with adult mentor</li>
                        <li><strong>Self-monitoring:</strong> Student tracks own behavior (with teacher verification)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Responding to problem behaviors</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Stay calm (don't take it personally)</li>
                        <li>Use proximity & nonverbal cues first</li>
                        <li>Give choices when possible ("Work here or at back table")</li>
                        <li>Brief time-out or break if needed (not punitive)</li>
                        <li>Problem-solve after student is calm</li>
                        <li>Communicate with parents same day if significant issue</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 504/IEP Section - condensed */}
      <section id="504-iep" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">504 Plans & IEPs for ADHD</h2>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  504 Plan
                </CardTitle>
                <CardDescription>Section 504 of the Rehabilitation Act</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Eligibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Student with ADHD that substantially limits a major life activity (learning). 
                      Less stringent than IEP.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Common accommodations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Extended time (tests/assignments)</li>
                      <li>Preferential seating</li>
                      <li>Reduced homework</li>
                      <li>Breaks during class/testing</li>
                      <li>Use of fidget tools</li>
                      <li>Extra set of books for home</li>
                      <li>Copies of notes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  IEP
                </CardTitle>
                <CardDescription>Individuals with Disabilities Education Act</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Eligibility</h4>
                    <p className="text-sm text-muted-foreground">
                      ADHD must adversely affect educational performance and require specialized instruction. 
                      Typically qualifies under "Other Health Impairment."
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">May include</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Special education services</li>
                      <li>Resource room support</li>
                      <li>Executive function training</li>
                      <li>Social skills instruction</li>
                      <li>Behavior intervention plan</li>
                      <li>Modified curriculum</li>
                      <li>All 504 accommodations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Teacher's role:</strong> Implement accommodations consistently, document student progress, 
              participate in team meetings, communicate with parents regularly. You are a vital member of the 
              504/IEP team!
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Parent Partnership */}
      <section id="parent-partnership" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Partnering with Parents</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Effective communication strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Regular communication</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Weekly email update (brief, not just problems)</li>
                    <li>• Daily report card for students with intensive needs</li>
                    <li>• Respond to parent emails within 24 hours</li>
                    <li>• Request parent input on what works at home</li>
                    <li>• Share successes as well as concerns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Parent meetings</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Start with student's strengths</li>
                    <li>• Come prepared with data & work samples</li>
                    <li>• Listen to parent concerns & observations</li>
                    <li>• Agree on specific goals & strategies</li>
                    <li>• Set follow-up date to review progress</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Professional Development Resources</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CHADD for Educators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Free webinars, fact sheets, and professional training on ADHD in schools
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://chadd.org/for-educators/" target="_blank" rel="noopener noreferrer">
                    Visit Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CDC Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Evidence-based information and training modules for teachers
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.cdc.gov/ncbddd/adhd/school-success.html" target="_blank" rel="noopener noreferrer">
                    Visit Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Understood.org</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Classroom strategies, accommodations checklists, and IEP guidance
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.understood.org/en/articles/adhd-in-the-classroom" target="_blank" rel="noopener noreferrer">
                    Visit Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Breathing for Classroom */}
      <section id="breathing" className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Using Breathing Breaks in the Classroom
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Breathing techniques for students with ADHD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Benefits</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Improves focus & attention</li>
                    <li>• Reduces impulsivity</li>
                    <li>• Transitions between activities</li>
                    <li>• Whole-class calm-down</li>
                    <li>• Test anxiety relief</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Implementation tips</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Keep it brief (1-2 minutes)</li>
                    <li>• Make it routine (after recess, before tests)</li>
                    <li>• Use visual cues (timer, breathing ball)</li>
                    <li>• Lead by example</li>
                    <li>• Don't force participation</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
                <Link href="/techniques/box-breathing">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟩</div>
                      <div className="text-xs">Box Breathing</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/sos">
                  <Button variant="default" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🆘</div>
                      <div className="text-xs">SOS-60</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/4-7-8">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟦</div>
                      <div className="text-xs">4-7-8</div>
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
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

