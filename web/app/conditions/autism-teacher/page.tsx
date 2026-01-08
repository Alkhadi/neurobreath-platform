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
  BookOpen, 
  GraduationCap,
  CheckCircle2, 
  ExternalLink, 
  Lightbulb,
  Clock,
  Calendar,
  Users,
  Shield,
  FileText,
  Sparkles,
  AlertCircle,
  Target,
  Briefcase,
  Award,
  ClipboardCheck,
  School,
  Brain,
  HeartHandshake
} from 'lucide-react';
import { PathwaysNavigator } from '@/components/autism/pathways-navigator';
import { ResourcesLibrary } from '@/components/autism/resources-library';
import Link from 'next/link';

export default function AutismTeacherSupportPage() {
  const [mounted, setMounted] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">Autism Teachers Support Hub</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Comprehensive guidance for supporting autistic learners in schools: classroom strategies, 
              SEND support, EHCP guidance, and professional development resources
            </p>
            <p className="text-sm opacity-75 max-w-2xl mx-auto">
              Evidence-based practices aligned with SEND Code of Practice, NICE guidelines, and 
              Autism Education Trust frameworks
            </p>
          </div>

          {/* Quick Navigation Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="#classroom-strategies" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Classroom Strategies
            </a>
            <a href="#send-support" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              SEND Support
            </a>
            <a href="#pathways" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              EHCP Pathways
            </a>
            <a href="#professional-development" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              CPD Resources
            </a>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Quick start</Badge>
                <CardTitle>Classroom toolkit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Essential strategies for primary and secondary classrooms: visual supports, 
                  sensory planning, and predictable routines.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <a href="#classroom-strategies">View strategies</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">SEND process</Badge>
                <CardTitle>EHCP guidance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Navigate SEN Support to EHCP: graduated approach, evidence gathering, and 
                  annual reviews.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#pathways">SEND pathways</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Resources</Badge>
                <CardTitle>Templates & Downloads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Letter templates, one-page profiles, ABC logs, visual schedules, and assessment forms.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#resources">Browse resources</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Key Principles */}
          <Card className="mt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Core principles</Badge>
              <CardTitle>Supporting autistic learners effectively</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Predictable environment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Visual schedules, clear routines, advance warnings for changes, and consistent expectations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Sensory awareness
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Audit noise/light/touch triggers, offer quiet spaces, allow movement breaks and sensory tools.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Communication support
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Process time, concrete language, visual aids, alternative communication methods (AAC).
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Educational information only; not a substitute for SENCO advice or specialist assessment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Teacher Overview */}
      <section id="teacher-overview" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Autism (Teachers) — quick overview</h2>
              <p className="text-muted-foreground">
                A quick reference for teachers supporting autistic learners across primary and secondary settings.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">At-a-glance actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Meet with SENCO to create one-page profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Set up visual timetable and regulation plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Review adjustments termly using Assess-Plan-Do-Review</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Common signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Difficulty with transitions or unexpected changes</li>
                  <li>• Sensory sensitivities (noise, light, touch)</li>
                  <li>• Literal understanding of language</li>
                  <li>• Need for routine and predictability</li>
                  <li>• Social communication differences</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  First steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Speak with SENCO about concerns</li>
                  <li>Gather observations and evidence</li>
                  <li>Meet with parents/carers</li>
                  <li>Create initial support plan</li>
                  <li>Monitor and review progress</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Quick wins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li>• Use visual timetables</li>
                  <li>• Give advance warnings for changes</li>
                  <li>• Allow processing time</li>
                  <li>• Create quiet space access</li>
                  <li>• Offer sensory breaks</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Key resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <a 
                    href="https://www.autismeducationtrust.org.uk/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Autism Education Trust
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.autism.org.uk/advice-and-guidance/professional-practice/education" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    NAS Education Guidance
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.gov.uk/government/publications/send-code-of-practice-0-to-25" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    SEND Code of Practice
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Classroom Strategies Section */}
      <section id="classroom-strategies" className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">School: Teachers & TAs (UK)</h2>
              <p className="text-muted-foreground max-w-2xl">
                Support inclusion with predictable structure, proactive sensory planning, and active SENCO collaboration.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">SEN support</Badge>
              <Badge variant="secondary">Whole-school practice</Badge>
            </div>
          </div>

          <Tabs defaultValue="primary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="primary">Primary</TabsTrigger>
              <TabsTrigger value="secondary">Secondary</TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="space-y-6">
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="secondary">Primary</Badge>
                  <CardTitle>Classroom starter toolkit</CardTitle>
                  <CardDescription>
                    Essential strategies for primary-age autistic learners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="profile">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold">One-page profile</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Capture strengths, interests, sensory notes, and communication tips; circulate to every adult.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Include what helps the learner stay calm and focused</li>
                          <li>Note sensory preferences (quiet spaces, movement breaks)</li>
                          <li>List communication strategies that work</li>
                          <li>Share special interests that motivate learning</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="visual">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Visual structure</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Use Now/Next, First/Then, and symbol timetables; model each step with calm pacing.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Display visual timetable at consistent location</li>
                          <li>Use First/Then boards for task sequencing</li>
                          <li>Model new activities before expecting participation</li>
                          <li>Allow time to process visual information</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="processing">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold">Processing time</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Keep language concise, build in pause time, and check understanding with choice questions.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Wait 5-10 seconds after giving instructions</li>
                          <li>Use concrete, literal language</li>
                          <li>Break down multi-step instructions</li>
                          <li>Check understanding with "show me" rather than "do you understand?"</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="transitions">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold">Predictable transitions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Countdown timers, finish tokens, transition objects, and advance warnings for changes.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Use visual timers for activity endings</li>
                          <li>Give 5-minute, 2-minute, and 1-minute warnings</li>
                          <li>Provide transition objects (photo of next location)</li>
                          <li>Create predictable routines for common transitions</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="regulation">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold">Regulation plan</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Scheduled movement/sensory breaks, a quiet corner, and a headphone agreement with parents.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Schedule regular movement breaks (not just when dysregulated)</li>
                          <li>Create designated calm space in classroom</li>
                          <li>Allow use of fidget tools or sensory items</li>
                          <li>Agree on exit pass system with SENCO approval</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="playground">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">Playground & lunch</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Offer structured jobs/clubs, buddy systems, and calmer seating options.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Provide structured playground activities or clubs</li>
                          <li>Assign buddies for unstructured time</li>
                          <li>Offer quieter lunch seating away from main hall noise</li>
                          <li>Allow early lunch or break times to reduce overwhelm</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="home-school">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="w-5 h-5 text-pink-600" />
                          <span className="font-semibold">Home–school link</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Brief daily notes or checklists that highlight wins and specific asks.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Use home-school diary or app</li>
                          <li>Focus on positives and progress</li>
                          <li>Flag upcoming changes (trips, supply teacher)</li>
                          <li>Share strategies that worked well</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="adjustments">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Reasonable adjustments</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Flexible uniform, tailored PE, and moderated displays or lighting where needed.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Allow comfortable clothing (no tags, soft fabrics)</li>
                          <li>Modify PE expectations (alternative activities, gradual exposure)</li>
                          <li>Reduce visual clutter on walls</li>
                          <li>Consider lighting (turn off some fluorescents if possible)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="secondary" className="space-y-6">
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="secondary">Secondary</Badge>
                  <CardTitle>Structure for older learners</CardTitle>
                  <CardDescription>
                    Blend pastoral safety nets with academic scaffolds so expectations stay high while overwhelm stays low
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="safe-base">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold">Safe base & pass</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Agree a key adult, quiet space, and a discreet exit pass for overwhelm.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Identify trusted adult (mentor, TA, SENCO)</li>
                          <li>Arrange access to quiet room or pastoral office</li>
                          <li>Create discreet card/pass system for leaving class</li>
                          <li>Ensure all staff know the protocol</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="timetable">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Timetable support</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Provide a colour-coded map, controlled corridor release, and a locker near core rooms.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Give visual map with colour-coded rooms/subjects</li>
                          <li>Allow early dismissal to avoid corridor rush</li>
                          <li>Arrange locker placement strategically</li>
                          <li>Provide digital copy of timetable</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="workload">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold">Workload clarity</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Chunk tasks, share exemplars, and negotiate deadlines when load spikes.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Break assignments into smaller steps with sub-deadlines</li>
                          <li>Provide worked examples and success criteria</li>
                          <li>Use task boards or checklists</li>
                          <li>Allow flexibility during high-stress periods (exams, coursework)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="group-work">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">Group work</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Assign clear roles or offer an alternative solo pathway; avoid last-minute presentations.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Pre-assign groups and roles (researcher, scribe, presenter)</li>
                          <li>Provide structured collaboration frameworks</li>
                          <li>Offer alternative individual tasks where appropriate</li>
                          <li>Give advance notice for presentations (practice opportunities)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="exam-access">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold">Exam access arrangements</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Secure adjustments early (extra time, rest breaks, reader/scribe, smaller room).</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Apply for access arrangements well in advance</li>
                          <li>Arrange separate room if sensory needs require</li>
                          <li>Allow rest breaks without penalty</li>
                          <li>Practice exam conditions with adjustments in place</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sensory-routines">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold">Sensory & routines</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Minimise avoidable bells/noise, give consistent seating, and provide digital note copies.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Allow ear defenders or headphones in corridors</li>
                          <li>Assign consistent seating in each classroom</li>
                          <li>Share lesson slides/notes digitally</li>
                          <li>Reduce surprise announcements (give written notice)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="pastoral">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="w-5 h-5 text-pink-600" />
                          <span className="font-semibold">Pastoral check-ins</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>Schedule touchpoints after lunch/last period and plan for trips, drills, and timetable shifts.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Regular mentor meetings (weekly or fortnightly)</li>
                          <li>Check-in after high-stress periods (exams, assemblies)</li>
                          <li>Prepare social stories for school trips</li>
                          <li>Give advance notice and rehearsal for fire drills</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>SENCO coordination:</strong> All adjustments should be documented, reviewed termly using the 
              Assess–Plan–Do–Review cycle, and shared with parents/carers. Maintain proportionate support that promotes 
              independence.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* SEND Support Section */}
      <section id="send-support" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">SEND Support & EHCP (England)</h2>
          
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 mb-8">
            <CardHeader>
              <CardTitle>The graduated approach</CardTitle>
              <CardDescription>
                Four-part cycle for identifying and supporting learners with SEND
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="font-bold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <h4 className="font-semibold">Assess</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Gather information from child, parents, teachers, observations, and any specialist assessments.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <span className="font-bold text-green-600 dark:text-green-400">2</span>
                    </div>
                    <h4 className="font-semibold">Plan</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Agree specific outcomes, interventions, and adjustments. Document on SEN Support plan or provision map.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="font-bold text-purple-600 dark:text-purple-400">3</span>
                    </div>
                    <h4 className="font-semibold">Do</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Implement the plan. Class teacher responsible, supported by SENCO and any TAs or specialists.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <span className="font-bold text-amber-600 dark:text-amber-400">4</span>
                    </div>
                    <h4 className="font-semibold">Review</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Evaluate impact, adjust approaches, and decide if additional support or EHCP needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>SEND Support to EHCP pathway</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Start with SEN Support:</strong> Meet with SENCO and parents to identify needs. 
                    Create initial plan with specific targets and adjustments.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Graduated approach:</strong> Use Assess → Plan → Do → Review cycle at least termly. 
                    Document what works and any persistent unmet needs.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Gather evidence:</strong> Keep detailed records of interventions tried, progress data, 
                    observations, reports from specialists, and parent input.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>EHCP request:</strong> If needs cannot be met through SEN Support, school or parents can 
                    request an Education, Health and Care needs assessment from the Local Authority.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>EHCP quality:</strong> Outcomes in Section E should be SMART (specific, measurable, 
                    achievable, relevant, time-bound). Provision in Section F must be specific and quantified.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Annual review:</strong> Review progress toward outcomes, update provision, and plan for 
                    transitions (Year 6/11) well in advance.
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Key resources:</strong>{' '}
                  <a href="https://www.ipsea.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    IPSEA
                  </a>{' '}
                  (legal guidance),{' '}
                  <a href="https://www.autism.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    National Autistic Society
                  </a>
                  ,{' '}
                  <a href="https://www.councilfordisabledchildren.org.uk/information-advice/iass-network" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    SENDIASS
                  </a>{' '}
                  (local impartial advice), and the{' '}
                  <a href="https://www.gov.uk/government/publications/send-code-of-practice-0-to-25" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    SEND Code of Practice
                  </a>
                  . <em>Educational information; not legal advice.</em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Education Pathways Navigator */}
      <section id="pathways" className="py-16 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950 dark:via-blue-950 dark:to-purple-950">
        <div className="mx-auto px-4 mb-8" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SEND Pathways Navigator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Step-by-step guides for UK SEND/EHCP, US IEP/504, and EU inclusive education systems
            </p>
          </div>
        </div>
        <PathwaysNavigator />
      </section>

      {/* Autistic Staff Section */}
      <section id="autistic-staff" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Autistic teachers & staff — reasonable adjustments</h2>
          
          <Card>
            <CardHeader>
              <CardDescription>
                Under the Equality Act 2010, schools and employers must consider reasonable adjustments for 
                autistic staff members. These adjustments support wellbeing and enable educators to perform at their best.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    Work environment
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Quieter workspace where possible (away from high-traffic areas)</li>
                    <li>• Reduced corridor/break duties during busy times</li>
                    <li>• Choice of lower-sensory classrooms when timetabling</li>
                    <li>• Control over lighting (desk lamp, blinds access)</li>
                    <li>• Noise-cancelling headphones for planning/PPA time</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Communication
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Written agendas and decisions shared in advance</li>
                    <li>• Time to process information before responding</li>
                    <li>• Scheduled meetings (avoid drop-in interruptions)</li>
                    <li>• Email communication preferred where feasible</li>
                    <li>• Clear, direct feedback without ambiguity</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Timetabling
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Cluster teaching rooms/year groups where possible</li>
                    <li>• Limit last-minute cover (advance notice preferred)</li>
                    <li>• Predictable meeting schedules</li>
                    <li>• Consistent teaching schedule (avoid frequent changes)</li>
                    <li>• Protected planning time in designated space</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    Sensory considerations
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Lighting adjustments (natural light, avoiding fluorescent)</li>
                    <li>• Ear defenders or headphones during noisy periods</li>
                    <li>• Access to calm room or quiet space</li>
                    <li>• Flexible dress code (sensory-friendly clothing)</li>
                    <li>• Consideration of scent-free environments</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Admin & marking
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Protected marking blocks (uninterrupted time)</li>
                    <li>• Remote marking options where policies allow</li>
                    <li>• Digital workflow preferences</li>
                    <li>• Clear, written expectations for tasks</li>
                    <li>• Templates for routine admin tasks</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-pink-600" />
                    Wellbeing support
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Identified trusted colleague for debriefs</li>
                    <li>• Advance planning for high-stress periods (exams, inspections)</li>
                    <li>• Regular supervision or mentoring</li>
                    <li>• Access to occupational health support</li>
                    <li>• Reasonable adjustments for staff meetings/training</li>
                  </ul>
                </div>
              </div>

              <Alert className="mt-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Access to Work:</strong> Autistic teachers can apply for{' '}
                  <a href="https://www.gov.uk/access-to-work" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Access to Work
                  </a>{' '}
                  funding for role-specific support such as coaching, assistive technology, or workplace assessments. 
                  Schools may also benefit from Disability Confident employer scheme guidance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources Library */}
      <section id="resources" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
        <ResourcesLibrary />
      </section>

      {/* Professional Development Section */}
      <section id="professional-development" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Professional Development & CPD</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Recommended CPD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://www.autismeducationtrust.org.uk/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <strong>Autism Education Trust (AET)</strong> — Accredited training for teachers and school 
                        staff. Competency frameworks and progression routes.
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.autism.org.uk/what-we-do/professional-development" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <strong>National Autistic Society</strong> — Professional practice modules covering 
                        classroom strategies, sensory needs, and communication.
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.ambitiousaboutautism.org.uk/professionals" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <strong>Ambitious about Autism</strong> — Education and employment-focused training, 
                        including post-16 transitions.
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.e-lfh.org.uk/programmes/autism/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <strong>NHS e-Learning for Healthcare (Autism)</strong> — Free online modules for 
                        education, health, and social care professionals.
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/send" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <strong>Education Endowment Foundation</strong> — Evidence-based SEND guidance report 
                        with practical recommendations.
                      </div>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  SEND policy checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Document the graduated approach with parent/carer involvement at every stage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Review reasonable adjustments termly (at minimum)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Maintain SEN Support profiles and escalate to EHCP assessment when required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Run environment audits (sensory/noise/visual clutter) and action follow-ups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Align staff training with AET frameworks and safeguarding requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Track attendance, exclusions, and regulation incidents with clear escalation protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Plan transitions (class, key stage, post-16) with visits, social stories, or transition plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Link with LA services, SENDIASS, educational psychologists, and specialist teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Ensure SEND information report is published and accessible on school website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Monitor quality of provision through lesson observations and learner voice</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quality Markers */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Quality markers for autism education provision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Teaching & Learning</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Measurable targets with baseline data and regular progress monitoring</li>
                    <li>• Differentiated, accessible materials (visuals, clear language, chunking)</li>
                    <li>• Use of logs/trackers to refine supports and evidence impact</li>
                    <li>• Predictable routines and structured learning environments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Safeguarding & Wellbeing</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Safeguarding awareness with clear escalation pathways</li>
                    <li>• Proactive regulation and behavior support plans</li>
                    <li>• Anti-bullying measures and peer awareness education</li>
                    <li>• Mental health support and early intervention protocols</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Partnership Working</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Joined-up work with families and multi-disciplinary professionals</li>
                    <li>• Regular communication between home and school</li>
                    <li>• Collaboration with external specialists (OT, SALT, EP)</li>
                    <li>• Transition planning with receiving settings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Staff Development</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Training mapped to AET/NAS standards</li>
                    <li>• Reflective practice embedded in CPD</li>
                    <li>• Supervision and mentoring for staff working with autistic learners</li>
                    <li>• Whole-school autism awareness and understanding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clinical & Education Guidance */}
      <section id="guidance" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Clinical & Education Guidance</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clinical guidance (NICE)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://www.nice.org.uk/guidance/cg170" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Clinicians</Badge>
                          <Badge variant="secondary" className="text-xs">Teachers</Badge>
                        </div>
                        <strong>NICE CG170</strong> — Autism spectrum disorder in under 19s: support and management
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.nice.org.uk/guidance/cg142" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Clinicians</Badge>
                          <Badge variant="secondary" className="text-xs">Post-16</Badge>
                        </div>
                        <strong>NICE CG142</strong> — Autism spectrum disorder in adults: diagnosis and management
                      </div>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education policy & guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://www.gov.uk/government/publications/send-code-of-practice-0-to-25" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Policy</Badge>
                          <Badge variant="secondary" className="text-xs">Essential</Badge>
                        </div>
                        <strong>DfE/DoH SEND Code of Practice (0–25)</strong> — Statutory guidance for schools
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.autism.org.uk/advice-and-guidance/professional-practice/education" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Teachers</Badge>
                        </div>
                        <strong>National Autistic Society</strong> — Education guidance and reasonable adjustments
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://councilfordisabledchildren.org.uk/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Teachers</Badge>
                          <Badge variant="secondary" className="text-xs">Policy</Badge>
                        </div>
                        <strong>Council for Disabled Children</strong> — Practice resources and policy updates
                      </div>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Practical Techniques */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Practical techniques for the classroom</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div>
                  <strong>Visual schedules & First/Then (ages 3–16):</strong> Make steps visible to reduce 
                  transition stress and increase predictability.
                </div>
                <div>
                  <strong>AAC basics (all ages):</strong> Core boards, PECS, or communication apps reduce 
                  frustration without replacing speech.
                </div>
                <div>
                  <strong>Structured teaching / TEACCH (school age):</strong> Predictable work systems, visual 
                  boundaries, and chunked tasks.
                </div>
                <div>
                  <strong>ABC behaviour logging (all ages):</strong> Track antecedents, behaviour, consequences; 
                  teach easier communication alternatives.
                </div>
                <div>
                  <strong>Sensory regulation menu (all ages):</strong> Headphones, movement breaks, fidget tools, 
                  quiet corners as needed.
                </div>
                <div>
                  <strong>Social stories & comic strip conversations:</strong> Prepare for changes, explain social 
                  situations, support understanding.
                </div>
                <div>
                  <strong>Task analysis & chaining:</strong> Break complex tasks into small steps; teach 
                  systematically with reinforcement.
                </div>
                <div>
                  <strong>Peer awareness training:</strong> Age-appropriate autism understanding for classmates 
                  to promote inclusion.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Breathing & Regulation Section */}
      <section id="breathing-regulation" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Breathing & Regulation in the Classroom
          </h2>
          
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Using NeuroBreath with autistic learners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">How to introduce breathing exercises</h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Choose sensory-appropriate technique (silent Box Breathing is often best)</li>
                    <li>Demonstrate first without expectation of participation</li>
                    <li>Offer visual cues (breathing ball animation, visual timer)</li>
                    <li>Allow opt-out or alternative (quiet sitting, gentle movement)</li>
                    <li>Keep sessions short (1-2 minutes initially)</li>
                    <li>Build into predictable daily routine</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">When to use</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Transition times:</strong> Before moving to new activity or location</li>
                    <li>• <strong>After break/lunch:</strong> Help settle and refocus</li>
                    <li>• <strong>Before tests:</strong> Reduce anxiety and improve focus</li>
                    <li>• <strong>Regulation breaks:</strong> Alternative to time-out, promotes calm</li>
                    <li>• <strong>Whole-class calm:</strong> Start lessons or assemblies</li>
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
                <Link href="/techniques/4-7-8">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟦</div>
                      <div className="text-xs">4-7-8 Breathing</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/techniques/coherent">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟪</div>
                      <div className="text-xs">Coherent 5-5</div>
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
              </div>

              <Alert className="mt-6">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tip:</strong> Some autistic learners may find focused breathing uncomfortable or 
                  anxiety-inducing. Always offer alternatives (gentle movement, sensory tools, quiet time) and 
                  never force participation. The goal is regulation, not compliance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

