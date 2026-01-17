'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Lightbulb,
  Clock,
  Calendar,
  Brain,
  Shield,
  Phone,
  Sparkles,
  HeartHandshake,
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AutismCarerSupportPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <HeartHandshake className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">Autism Carers Support Hub</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Comprehensive guidance for family members, guardians, and professional carers supporting 
              autistic individuals: daily strategies, later-life support, health coordination, and self-care
            </p>
            <p className="text-sm opacity-75 max-w-2xl mx-auto">
              Supporting an autistic person is rewarding and challenging. You deserve support, respite, and recognition.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="#carer-wellbeing" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Carer Wellbeing
            </a>
            <a href="#daily-support" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Daily Support
            </a>
            <a href="#later-life" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Later Life & Ageing
            </a>
            <a href="#health-coordination" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Health & Social Care
            </a>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Self-care</Badge>
                <CardTitle>Carer wellbeing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Strategies for preventing burnout, managing stress, and maintaining your mental health.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <a href="#carer-wellbeing">Wellbeing guide</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Practical support</Badge>
                <CardTitle>Daily routines & strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Sensory-aware approaches, communication support, and managing challenging behaviors.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#daily-support">Support strategies</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Future planning</Badge>
                <CardTitle>Later life & transitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Planning for ageing, transitions, health changes, and long-term support needs.
                </p>
                <Button size="sm" className="w-full" variant="outline" asChild>
                  <a href="#later-life">Later life planning</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Core Principles */}
          <Card className="mt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Remember</Badge>
              <CardTitle>Key principles for autism carers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-teal-600" />
                    Your wellbeing matters
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Taking breaks, seeking respite, and caring for yourself enables better long-term support.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    Connect with others
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Carer support groups, online communities, and peer connections reduce isolation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-600" />
                    Plan ahead
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Future planning, legal arrangements, and contingency plans provide peace of mind.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Educational information only; not a substitute for medical, legal, or social care advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Carer Wellbeing Section */}
      <section id="carer-wellbeing" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Carer Wellbeing & Self-Care</h2>
          
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong>Carer stress is real:</strong> Research shows family carers of autistic individuals 
              experience higher stress and depression rates. Seeking support is essential, not selfish.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-teal-200 dark:border-teal-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Recognizing burnout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Signs of carer burnout</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Chronic fatigue despite rest</li>
                      <li>Increased irritability, resentment, or anger</li>
                      <li>Feeling hopeless about the future</li>
                      <li>Withdrawing from social activities</li>
                      <li>Physical symptoms (headaches, digestive issues)</li>
                      <li>Neglecting your own health needs</li>
                      <li>Feeling guilty when taking time for yourself</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Immediate actions</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Talk to your GP about how you're feeling</li>
                      <li>Request a carer's assessment from social services</li>
                      <li>Arrange respite care (even short breaks help)</li>
                      <li>Join a carer support group</li>
                      <li>Lower non-essential expectations temporarily</li>
                      <li>Ask specific people for specific help</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Daily self-care strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="physical">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Physical self-care</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Protect your sleep (7-8 hours if possible)</li>
                        <li>Regular meals even when stressed</li>
                        <li>10-15 minute walks or gentle exercise</li>
                        <li>Stay hydrated throughout the day</li>
                        <li>Attend your own medical appointments</li>
                        <li>Limit caffeine and alcohol</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="emotional">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <span className="font-semibold">Emotional self-care</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Acknowledge difficult feelings without judgment</li>
                        <li>Talk to friend, counselor, or support group</li>
                        <li>Journal about your experiences</li>
                        <li>Allow yourself to grieve losses or changes</li>
                        <li>Celebrate small wins and moments of joy</li>
                        <li>Practice self-compassion daily</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="social">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">Social connection</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Stay in touch with friends (even brief texts)</li>
                        <li>Join autism carer support groups</li>
                        <li>Online communities when in-person isn't possible</li>
                        <li>Schedule regular catch-ups with one friend</li>
                        <li>Don't isolate even when exhausted</li>
                        <li>Accept offers of help from others</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="practical">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Practical breaks</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>15 minutes daily just for you (coffee, bath, breathing)</li>
                        <li>2-3 hours weekly doing something you enjoy</li>
                        <li>Monthly half-day or full day off if possible</li>
                        <li>Annual respite break (even long weekend)</li>
                        <li>Regular use of respite services</li>
                        <li>Share caring with family members</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Support Strategies */}
      <section id="daily-support" className="py-16 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Daily Support Strategies</h2>
          
          <div className="grid gap-6">
            <Card className="border-2 border-teal-200 dark:border-teal-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  Sensory support & regulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Understanding sensory needs</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Sensory sensitivities:</strong> Noise, light, touch, smell, taste</li>
                      <li>• <strong>Sensory seeking:</strong> Need for movement, pressure, input</li>
                      <li>• <strong>Overwhelm signs:</strong> Covering ears, avoiding eye contact, withdrawal</li>
                      <li>• <strong>Meltdown vs shutdown:</strong> Learn individual's patterns</li>
                      <li>• <strong>Sensory profile:</strong> What helps vs what overwhelms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Practical sensory strategies</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Calm space:</strong> Quiet area with preferred sensory items</li>
                      <li>• <strong>Noise reduction:</strong> Headphones, ear defenders, white noise</li>
                      <li>• <strong>Lighting:</strong> Dimmer switches, lamps instead of overhead</li>
                      <li>• <strong>Clothing:</strong> Soft fabrics, remove tags, loose fits</li>
                      <li>• <strong>Movement breaks:</strong> Trampoline, walk, swing, rock</li>
                      <li>• <strong>Deep pressure:</strong> Weighted blanket, hugs if wanted, compression</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Communication support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Supporting verbal communication</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Give processing time (5-10 seconds after speaking)</li>
                      <li>• Use clear, concrete language (avoid idioms)</li>
                      <li>• Say what you mean directly</li>
                      <li>• One instruction at a time</li>
                      <li>• Reduce background noise when talking</li>
                      <li>• Accept echolalia as communication</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Alternative & augmentative communication (AAC)</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• PECS (Picture Exchange Communication System)</li>
                      <li>• Communication apps/tablets</li>
                      <li>• Sign language or gestures</li>
                      <li>• Writing or typing</li>
                      <li>• Choice boards with pictures</li>
                      <li>• AAC doesn't prevent speech - it supports it</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Routines & predictability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Visual schedules</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Picture or word schedule</li>
                      <li>First/Then boards</li>
                      <li>Now/Next displays</li>
                      <li>Weekly calendar visible</li>
                      <li>Mark off completed tasks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Managing change</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Prepare in advance when possible</li>
                      <li>Social stories for new situations</li>
                      <li>Visual countdown to changes</li>
                      <li>Transition warnings (5 min, 2 min)</li>
                      <li>Comfort item during transitions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Reducing anxiety</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                      <li>Consistent daily routines</li>
                      <li>Predictable meal/sleep times</li>
                      <li>Warning before visitors</li>
                      <li>Plan B for disruptions</li>
                      <li>Safe space always available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-600" />
                  Managing challenging behaviors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Behaviors are communication:</strong> Challenging behaviors often communicate unmet 
                      needs (pain, sensory overwhelm, frustration, fear). Focus on understanding the 'why' before 
                      trying to change the behavior.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-3">ABC approach (Antecedent-Behavior-Consequence)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Antecedent:</strong> What happened right before?</li>
                        <li>• <strong>Behavior:</strong> Describe objectively what occurred</li>
                        <li>• <strong>Consequence:</strong> What happened after?</li>
                        <li>• Track patterns to identify triggers</li>
                        <li>• Modify environment to prevent triggers</li>
                        <li>• Teach alternative communication methods</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">During meltdowns</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Safety first:</strong> Remove dangers, protect from harm</li>
                        <li>• <strong>Reduce stimulation:</strong> Quiet, dim, less people</li>
                        <li>• <strong>Give space:</strong> Stay nearby but don't crowd</li>
                        <li>• <strong>Stay calm:</strong> Your regulation helps their regulation</li>
                        <li>• <strong>Don't lecture:</strong> Process after they're calm</li>
                        <li>• <strong>Recovery time:</strong> Allow rest after intense episodes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Later Life & Ageing */}
      <section id="later-life" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Later Life & Ageing with Autism</h2>
          
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <Card className="border-2 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Sensory changes</Badge>
                <CardTitle className="text-lg">Anticipate and adapt early</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Expect shifts in hearing, vision, and vestibular needs; plan calmer environments before overwhelm builds.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Book double-length or quieter clinic slots</li>
                  <li>• Request low-sensory waiting areas</li>
                  <li>• Trial lighting, seating, mobility aids ahead of time</li>
                  <li>• Document preferred adjustments for all providers</li>
                  <li>• Audiology and vision screening with clear scripts</li>
                  <li>• Visual supports for health appointments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Health admin</Badge>
                <CardTitle className="text-lg">Stay ahead of paperwork</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Use visual and tactile prompts to keep medication, appointments, and emergency info organised.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Set up pill organisers with reminders</li>
                  <li>• Maintain laminated checklists for appointments</li>
                  <li>• Create hospital passport with autism profile</li>
                  <li>• Store emergency contacts in multiple formats</li>
                  <li>• Keep medication list current</li>
                  <li>• Annual review of all health information</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Social care</Badge>
                <CardTitle className="text-lg">Access support early</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Engage local authorities and carer networks before needs escalate.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Request adult social care assessment</li>
                  <li>• Request carer's assessment for yourself</li>
                  <li>• Explore respite and supported living options</li>
                  <li>• Consider direct payments for flexibility</li>
                  <li>• Connect with local autism hubs</li>
                  <li>• Join carers' forums for peer support</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transition planning checklist</CardTitle>
              <CardDescription>
                Future-proofing for changes in care needs, living arrangements, and your own circumstances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Legal & financial planning</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Power of Attorney:</strong> Lasting POA for health & finance (UK) or Durable POA (US)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Guardianship:</strong> Consider if decision-making capacity is limited</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Special needs trust:</strong> Protects assets without affecting benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Will planning:</strong> Ensure future care is arranged</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Benefits review:</strong> Maximize current and future entitlements</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Care continuity planning</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Letter of intent:</strong> Document preferences, routines, likes/dislikes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Backup carers:</strong> Identify alternative care arrangements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Housing options:</strong> Research supported living, group homes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Day services:</strong> Explore activity programs & skill building</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span><strong>Emergency plan:</strong> What happens if you're suddenly unable to care</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Health & Social Care Coordination */}
      <section id="health-coordination" className="py-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Health & Social Care Coordination</h2>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Hospital passport & health information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    A hospital passport (or health profile) is a document that tells healthcare professionals 
                    about the autistic person's communication, sensory needs, and preferences.
                  </p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">What to include</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>Communication style (verbal/non-verbal, AAC)</li>
                        <li>How they show pain or distress</li>
                        <li>Sensory sensitivities (noise, light, touch)</li>
                        <li>Meltdown signs and de-escalation strategies</li>
                        <li>Comfort items or routines that help</li>
                        <li>Medication list and times</li>
                        <li>Emergency contacts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">When to use</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>Hospital admissions or A&E visits</li>
                        <li>Dental appointments</li>
                        <li>New healthcare providers</li>
                        <li>Respite care or day services</li>
                        <li>Emergency situations</li>
                        <li>Keep copies in multiple formats (paper, phone)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Accessing social care support (UK)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="adult" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="adult">Adult social care</TabsTrigger>
                    <TabsTrigger value="carer">Carer's assessment</TabsTrigger>
                  </TabsList>
                  <TabsContent value="adult" className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Requesting an assessment</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>Contact your local authority adult social care team</li>
                        <li>Anyone can request an assessment (individual, family, professional)</li>
                        <li>Assessment is free and focuses on needs and outcomes</li>
                        <li>Prepares eligibility for support and services</li>
                        <li>Results in care plan if eligible</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">What support might be available</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>Direct payments (funding to arrange own support)</li>
                        <li>Day services and activities</li>
                        <li>Supported living arrangements</li>
                        <li>Personal care assistance</li>
                        <li>Respite care</li>
                        <li>Equipment and home adaptations</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="carer" className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Your rights as a carer</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>Right to a carer's assessment for YOUR needs</li>
                        <li>Assessment separate from person you care for</li>
                        <li>Focuses on impact of caring on YOUR wellbeing</li>
                        <li>Available even if person you care for refuses assessment</li>
                        <li>Should result in support plan for you</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Carer support available</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>Respite care funding</li>
                        <li>Carer's allowance (if eligible)</li>
                        <li>Training and information</li>
                        <li>Carer support groups</li>
                        <li>Emergency plan if you're suddenly unable to care</li>
                        <li>Emotional support services</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Crisis Support & Emergency Resources</h2>
          
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
            <Phone className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>In a crisis:</strong> Call 999 (UK emergency), 111 (UK NHS), 911 (US emergency), or 988 (US 
              Suicide & Crisis Lifeline). Don't wait if someone is in immediate danger.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crisis contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">UK Crisis Support</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Emergency:</strong> 999</li>
                      <li>• <strong>NHS 24/7:</strong> 111</li>
                      <li>• <strong>Samaritans:</strong> 116 123 (24/7)</li>
                      <li>• <strong>National Autistic Society Helpline:</strong> 0808 800 4104</li>
                      <li>• <strong>Carers UK Helpline:</strong> 0808 808 7777</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">US Crisis Support</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Emergency:</strong> 911</li>
                      <li>• <strong>Crisis Lifeline:</strong> 988 (call or text)</li>
                      <li>• <strong>Autism Response Team:</strong> 888-288-4762</li>
                      <li>• <strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your emergency plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Keep this information accessible:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>GP and specialist contacts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>Social worker or care coordinator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>Emergency respite services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>Trusted family/friends who can help</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>Current medications and dosages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>Hospital passport/health profile</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section id="resources" className="py-16 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Carer Support Organizations</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">National Autistic Society (UK)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Helpline, local groups, information, and family support services
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.autism.org.uk/" target="_blank" rel="noopener noreferrer">
                    Visit NAS
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carers UK</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Support, advice, and rights information for all unpaid carers
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.carersuk.org/" target="_blank" rel="noopener noreferrer">
                    Visit Carers UK
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Autism Speaks (US)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Resource guides, toolkits, and Autism Response Team
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.autismspeaks.org/" target="_blank" rel="noopener noreferrer">
                    Visit Autism Speaks
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ARCH National Respite (US)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Find respite care services in your area
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://archrespite.org/" target="_blank" rel="noopener noreferrer">
                    Find Respite
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact (UK)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Support for families with disabled children
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://contact.org.uk/" target="_blank" rel="noopener noreferrer">
                    Visit Contact
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Caregiver Alliance (US)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Information, support, and advocacy for family carers
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <a href="https://www.caregiver.org/" target="_blank" rel="noopener noreferrer">
                    Visit FCA
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Breathing for Carers */}
      <section id="breathing" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Breathing for Carer Stress Relief
          </h2>
          
          <Card className="border-2 border-teal-200 dark:border-teal-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                Quick stress-relief breathing techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">When to use breathing</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Feeling overwhelmed or exhausted</li>
                    <li>• Before or after challenging situations</li>
                    <li>• When you feel anger or resentment rising</li>
                    <li>• At bedtime if unable to sleep</li>
                    <li>• During brief breaks in caregiving</li>
                    <li>• Anytime you need to reset</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Benefits for carers</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Activates calm (parasympathetic) nervous system</li>
                    <li>• Lowers stress hormones quickly</li>
                    <li>• Helps regulate emotions</li>
                    <li>• Improves sleep quality</li>
                    <li>• Takes only 1-2 minutes</li>
                    <li>• Can be done anywhere, anytime</li>
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
                <Link href="/techniques/4-7-8">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟦</div>
                      <div className="text-xs">4-7-8 Breathing</div>
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
                <Link href="/techniques/coherent">
                  <Button variant="outline" className="w-full h-auto py-3" size="sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🟪</div>
                      <div className="text-xs">Coherent 5-5</div>
                    </div>
                  </Button>
                </Link>
              </div>

              <Alert className="mt-6">
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Remember:</strong> Taking 2 minutes to breathe and center yourself isn't taking time 
                  away from caregiving—it's recharging so you can provide sustainable, compassionate care. You matter too.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

