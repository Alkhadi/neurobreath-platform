'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Heart, 
  Users, 
  Briefcase,
  CheckCircle2, 
  ExternalLink,
  Clock,
  Calendar,
  Baby,
  UserCheck,
  Shield,
  FileText,
  Sparkles
} from 'lucide-react';
import { PathwaysNavigator } from '@/components/autism/pathways-navigator';
import { ResourcesLibrary } from '@/components/autism/resources-library';
import Link from 'next/link';

export default function AutismParentSupportPage() {
  const [mounted, setMounted] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionStats, setSessionStats] = useState({ sessions: 0, minutes: 0, lastUsed: '—' });

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

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionTime(0);
  };

  const handleStopSession = () => {
    setSessionActive(false);
    setSessionStats({
      sessions: sessionStats.sessions + 1,
      minutes: sessionStats.minutes + Math.floor(sessionTime / 60),
      lastUsed: new Date().toLocaleDateString()
    });
    setSessionTime(0);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Autism Parent Support Hub</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              Everything in one place: Parent, Adult & Later-life guides, Clinic guide with checklists & references, 
              plus an in-app coach module you can import into NeuroBreath
            </p>
            <p className="text-xs sm:text-sm opacity-75 max-w-2xl mx-auto">
              A4 PDFs are print-optimised with brand header/footer
            </p>
          </div>

          {/* Quick Navigation Badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
            <a href="#sensory-support" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Sensory-ready
            </a>
            <a href="#co-regulation" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Co-regulation
            </a>
            <a href="#evidence-snapshot" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              Evidence-backed
            </a>
            <a href="#pathways" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors">
              UK Guidance
            </a>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Co-regulation</Badge>
                <CardTitle>Co-regulate quickly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Start SOS-60 together, keep silent Box Breathing for public spaces, and use predictable pacing to stay within sensory comfort.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/techniques/sos">
                    <Button size="sm">🆘 Try SOS-60</Button>
                  </Link>
                  <Link href="/breathing/breath">
                    <Button size="sm" variant="outline">Breath basics</Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share the quick pack with carers and note three adjustments to request at school.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Download centre</Badge>
                <CardTitle>Print-ready packs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground mb-4">
                  Parent, adult, later-life, and clinic guides ready for A4 printing.
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="default" className="w-full justify-start" asChild>
                    <a href="https://files.mindpaylink.com/pdfs%3Aautism-parent-quick-guide-uk.pdf" download>
                      <Download className="w-4 h-4 mr-2" />
                      Parent quick guide (PDF)
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                    <a href="https://files.mindpaylink.com/pdfs%3Aautism-adult-support-guide-uk.pdf" download>
                      <Download className="w-4 h-4 mr-2" />
                      Adult support (PDF)
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur md:col-span-2 lg:col-span-1">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Toolkit extras</Badge>
                <CardTitle>Ready-made exports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Export everything at once or jump straight to the how-to section.
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                    <a href="https://files.mindpaylink.com/parent-quick-pack.zip" download>
                      <Download className="w-4 h-4 mr-2" />
                      All PDFs (ZIP)
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                    <a href="/assets/autism_coach_module.json" download>
                      <Download className="w-4 h-4 mr-2" />
                      Coach module (JSON)
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full" asChild>
                    <a href="#use">How to use</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evidence Snapshot in Hero */}
          <Card className="mt-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Evidence snapshot</Badge>
              <CardTitle>Guidance at a glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-1">NICE standards</h4>
                  <p className="text-sm text-muted-foreground">
                    Follow CG170 & CG142 for coordinated, family-centred support.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sensory regulation</h4>
                  <p className="text-sm text-muted-foreground">
                    Lead with sensory comfort and predictable transitions before skills practice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Clinical collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Track patterns with ABC logs; discuss melatonin or medication only with clinicians.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Educational information only; not medical advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Download PDFs Section */}
      <section id="download-pdfs" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Download PDFs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each pack is A4, print-optimised, and ready to share with families, schools, and clinicians.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Parent quick guide
                </CardTitle>
                <CardDescription>
                  Co-regulation snapshots, school meeting prompts, and sensory-ready adjustments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <a href="https://files.mindpaylink.com/pdfs%3Aautism-parent-quick-guide-uk.pdf" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  Adult support
                </CardTitle>
                <CardDescription>
                  Workplace adjustments, mental health tips, and Access to Work conversation starters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <a href="https://files.mindpaylink.com/pdfs%3Aautism-adult-support-guide-uk.pdf" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  Later life & carer
                </CardTitle>
                <CardDescription>
                  Planning prompts for sensory change, health admin, and carer collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <a href="https://files.mindpaylink.com/pdfs%3Aautism-later-life-carer-guide-uk.pdf" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Clinic guide
                </CardTitle>
                <CardDescription>
                  Checklists, reasonable adjustment requests, and coordinated care templates for MDT meetings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <a href="https://files.mindpaylink.com/pdfs%3Aautism-clinic-guide-checklists-uk.pdf" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parent Overview Section */}
      <section id="parent-overview" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Autism (Parent) — quick overview</h2>
              <p className="text-muted-foreground">
                A quick reference for families balancing sensory regulation, predictable routines, and communication supports.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">At-a-glance focus</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <span>Prepare co-regulation plans before transitions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <span>Keep sensory toolkits travel-ready.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <span>Share consistent visuals across home and school.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common signs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Prefers sameness or fixed routines</li>
                  <li>• Sensory overwhelm or shutdowns</li>
                  <li>• Communication differences or alternative modes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to use NeuroBreath</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Start SOS-60 together for co-regulation</li>
                  <li>Use silent Box Breathing when out in public</li>
                  <li>Print the quick pack ahead of school or clinic meetings</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/techniques/sos">
                  <Button className="w-full" size="sm">Start SOS-60</Button>
                </Link>
                <Link href="/breathing/breath">
                  <Button className="w-full" size="sm" variant="outline">Review breath basics</Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  Repeat the routine weekly so everyone knows the sequence.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Credible recommendations (UK)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <a 
                    href="https://www.nhs.uk/conditions/autism/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    NHS — Autism support
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.autism.org.uk/advice-and-guidance" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    National Autistic Society
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-muted-foreground italic mt-3">
                    Supportive information only; not medical advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Tracker */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Practice Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-2xl font-bold">{sessionStats.sessions}</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{sessionStats.minutes}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{sessionStats.lastUsed}</div>
                  <div className="text-sm text-muted-foreground">Last used</div>
                </div>
                <div className="flex flex-col gap-2">
                  {!sessionActive ? (
                    <Button onClick={handleStartSession} size="sm">
                      Start session
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleStopSession} size="sm" variant="outline">
                        Stop & save
                      </Button>
                      <div className="text-center text-sm font-mono">{formatTime(sessionTime)}</div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Starter Section */}
      <section id="co-regulation" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Quick Starter: Autism</h2>
              <p className="text-muted-foreground">
                Educational information only — not a diagnosis or medical advice.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Sensory-aware</Badge>
              <Badge variant="secondary">Predictable pacing</Badge>
              <Badge variant="secondary">Family-first</Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>What it is</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Autism is a neurodevelopmental difference that can shape communication, sensory processing, 
                  and patterns of interests or behaviour.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Possible signs</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Alternate communication styles or social pacing</li>
                    <li>• Sensory sensitivities to noise, light, touch, or taste</li>
                    <li>• Strong preference for routines or predictable transitions</li>
                    <li>• Focused, intense, or specialist interests</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-3">Trusted resource</h4>
                  <Button asChild>
                    <a 
                      href="https://www.nhs.uk/conditions/autism/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      NHS – Autism overview
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use this site for Autism</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• Pick a breathing pace that feels sensory-safe before you begin</li>
                  <li>• Stay predictable — use Coherent 5-5 or silent Box Breathing</li>
                  <li>• Save a one-page PDF and share it with carers or educators</li>
                </ul>

                <div className="grid grid-cols-2 gap-2">
                  <Link href="/techniques/box-breathing">
                    <Button variant="outline" className="w-full" size="sm">
                      🟩 Box Breathing
                    </Button>
                  </Link>
                  <Link href="/techniques/4-7-8">
                    <Button variant="outline" className="w-full" size="sm">
                      🟦 4-7-8 Breathing
                    </Button>
                  </Link>
                  <Link href="/techniques/coherent">
                    <Button variant="outline" className="w-full" size="sm">
                      🟪 Coherent 5-5
                    </Button>
                  </Link>
                  <Link href="/techniques/sos">
                    <Button variant="default" className="w-full" size="sm">
                      🆘 SOS-60
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="use" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to use each deliverable in NeuroBreath</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deploy resources consistently across parent, adult, and clinic journeys.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parent / Adult / Later-life PDFs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Add clear <strong>Download (PDF)</strong> links on the Autism landing page</li>
                  <li>• Include in onboarding emails and the in-app <em>Share</em> sheet</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinic Guide (PDF)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Surface under a <strong>For Clinicians</strong> block or advanced toggle</li>
                  <li>• Use during school or MDT meetings to standardise agendas</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">In-App Module JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Import as a coach that adapts prompts to selected goals</li>
                  <li>• Log metrics locally (or via secure cloud) for progress visuals</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-8">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>What you have now:</strong> ✅ Four Autism PDFs (Parent, Adult, Later-life, Clinic) · 
              ✅ In-app module (JSON)
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Evidence Snapshot Section */}
      <section id="evidence-snapshot" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Evidence snapshot (UK)</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-blue-600" />
                  Children & young people
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Structured, communication-focused interventions, environmental adaptations and co-occurring 
                  problem management; consider melatonin via specialists if behavioural sleep approaches fail.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Source: NICE CG170 (support & management). Educational only; not medical advice.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  Adults
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Adapted CBT for anxiety/depression, structured support plans, and workplace or healthcare 
                  reasonable adjustments.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Source: NICE autism guidance (adults). Educational only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Children & Adolescents Section */}
      <section id="children-adolescents" className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Children & Adolescents</h2>
              <p className="text-muted-foreground max-w-2xl">
                Focus naturalistic caregiver coaching, communication supports, and predictable routines to 
                reduce friction across home routines.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Parent coaching</Badge>
              <Badge variant="secondary">NDBI</Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-green-200 dark:border-green-800 md:col-span-2">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Core routine</Badge>
                <CardTitle>Naturalistic caregiver coaching</CardTitle>
                <CardDescription>
                  Deliver three-to-five minute play bursts daily to mirror, model, and celebrate communication attempts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Follow the child's lead, narrate shared play, and echo language with one-step expansions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Embed quick regulation check-ins and sensory tools inside the micro-sessions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Capture brief notes or clips to review wins during supervision and refine targets
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AAC is speech-friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Keep pictures, PECS, core boards, or communication apps within reach everywhere and 
                  model usage to reduce frustration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visual & structured teaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Lean on First/Then boards, visual schedules, and clear work systems so tasks stay 
                  predictable and manageable.
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Behaviour → ABC tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  Log antecedent–behaviour–consequence patterns, teach an easier communication route, 
                  and reinforce success quickly.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Check sensory and sleep foundations if plans stall.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800 md:col-span-2">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Sleep</Badge>
                <CardTitle>Sleep hygiene</CardTitle>
                <CardDescription>
                  Protect consistent routines, optimise light/noise/temperature, and explore melatonin only 
                  with a clinician when behavioural tools plateau.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Create a predictable wind-down with dimmed lighting, calming sensory input, and reduced 
                      screens 60 minutes before bed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Audit bedroom comfort (temperature, noise masking, blackout blinds) and add weighted or 
                      breathable options depending on sensory profile
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-sm">
                      Track sleep patterns and interventions so clinicians can review data before considering supplements
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* School Section */}
      <section id="school" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
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

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Primary</Badge>
                <CardTitle>Classroom starter toolkit</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li>
                    <strong>One-page profile:</strong> capture strengths, interests, sensory notes, and 
                    communication tips; circulate to every adult
                  </li>
                  <li>
                    <strong>Visual structure:</strong> use Now/Next, First/Then, and symbol timetables; 
                    model each step with calm pacing
                  </li>
                  <li>
                    <strong>Processing time:</strong> keep language concise, build in pause time, and check 
                    understanding with choice questions
                  </li>
                  <li>
                    <strong>Predictable transitions:</strong> countdown timers, finish tokens, transition objects, 
                    and advance warnings for changes
                  </li>
                  <li>
                    <strong>Regulation plan:</strong> scheduled movement/sensory breaks, a quiet corner, and a 
                    headphone agreement with parents
                  </li>
                  <li>
                    <strong>Playground & lunch:</strong> offer structured jobs/clubs, buddy systems, and calmer 
                    seating options
                  </li>
                  <li>
                    <strong>Home–school link:</strong> brief daily notes or checklists that highlight wins and 
                    specific asks
                  </li>
                  <li>
                    <strong>Reasonable adjustments:</strong> flexible uniform, tailored PE, and moderated displays 
                    or lighting where needed
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Secondary</Badge>
                <CardTitle>Structure for older learners</CardTitle>
                <CardDescription>
                  Blend pastoral safety nets with academic scaffolds so expectations stay high while overwhelm stays low.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li>
                    <strong>Safe base & pass:</strong> agree a key adult, quiet space, and a discreet exit pass 
                    for overwhelm
                  </li>
                  <li>
                    <strong>Timetable support:</strong> provide a colour-coded map, controlled corridor release, 
                    and a locker near core rooms
                  </li>
                  <li>
                    <strong>Workload clarity:</strong> chunk tasks, share exemplars, and negotiate deadlines when 
                    load spikes
                  </li>
                  <li>
                    <strong>Group work:</strong> assign clear roles or offer an alternative solo pathway; avoid 
                    last-minute presentations
                  </li>
                  <li>
                    <strong>Exam access:</strong> secure adjustments early (extra time, rest breaks, reader/scribe, 
                    smaller room)
                  </li>
                  <li>
                    <strong>Sensory & routines:</strong> minimise avoidable bells/noise, give consistent seating, 
                    and provide digital note copies
                  </li>
                  <li>
                    <strong>Pastoral check-ins:</strong> schedule touchpoints after lunch/last period and plan for 
                    trips, drills, and timetable shifts
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Coordinate through the SENCO. Keep adjustments proportionate, documented, and reviewed termly 
              (Assess–Plan–Do–Review).
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* SEND & EHCP Section */}
      <section id="pathways" className="py-16 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950 dark:via-blue-950 dark:to-purple-950">
        <div className="mx-auto px-4 mb-12 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">SEND & EHCP (England) — quick path</h2>
          
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Start with SEN Support:</strong> meet the SENCO; agree a short plan of reasonable 
                    adjustments and targets
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Graduated approach:</strong> Assess → Plan → Do → Review; log what helps and any 
                    unmet needs
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>EHCP request:</strong> if needs are beyond SEN Support, you can request an Education, 
                    Health and Care needs assessment from the Local Authority. Include evidence from school/clinicians
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>EHCP quality:</strong> outcomes should be specific and measurable; provision (Section F) 
                    should be specific, quantified and named
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Annual review:</strong> update outcomes and provision; ensure transitions 
                    (Year 6/11/college) are planned early
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Helpful UK resources:{' '}
                  <a href="https://www.ipsea.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    IPSEA
                  </a>{' '}
                  (legal guides),{' '}
                  <a href="https://www.autism.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    National Autistic Society
                  </a>
                  , your local{' '}
                  <a href="https://www.councilfordisabledchildren.org.uk/information-advice/iass-network" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    SENDIASS
                  </a>
                  , and the government's{' '}
                  <a href="https://www.gov.uk/government/publications/send-code-of-practice-0-to-25" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    SEND Code of Practice
                  </a>
                  . <em>Educational info; not legal advice.</em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pathways Navigator Component */}
        <PathwaysNavigator />
      </section>

      {/* Autistic Staff Section */}
      <section id="autistic-staff" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Autistic teachers & staff — reasonable adjustments</h2>
          
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Work environment:</strong> quieter workspace where possible, reduced corridor duties, 
                    choose lower-sensory classrooms
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Communication:</strong> written agendas and decisions; time to process; avoid drop-in 
                    interruptions where feasible
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Timetabling:</strong> cluster rooms/years, limit last-minute cover; predictable 
                    meeting times
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Sensory:</strong> lighting tweaks, ear-defenders/headphones for planning time, calm 
                    room access
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Admin/marking:</strong> protected blocks or remote marking where policies allow
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Wellbeing:</strong> identify a trusted colleague for debriefs; plan for exam/inspection weeks
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Under the Equality Act 2010, schools/employers must consider <strong>reasonable adjustments</strong>. 
                  See also{' '}
                  <a href="https://www.gov.uk/access-to-work" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Access to Work
                  </a>{' '}
                  for role-specific support. <em>Educational info only.</em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Adults Section */}
      <section id="adult-support" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Adults</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Employment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Reasonable adjustments (Equality Act), clear written instructions, low-sensory spaces, 
                  flexible hours/hybrid.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Access to Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Workplace assessment, job coach, assistive tech, travel support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Mental health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Adapted CBT (visual structure, concrete goals, graded exposure with sensory planning); 
                  monitor medication with clinicians.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  Regulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Micro-breaks, noise management, and proactive meltdown/shutdown plans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Later Life Section */}
      <section id="later-life" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Later Life</h2>
              <p className="text-muted-foreground max-w-2xl">
                Future-proof routines for autistic adults as sensory profiles shift, health admin increases, 
                and social care navigation expands.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Carer support</Badge>
              <Badge variant="secondary">Ageing well</Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-2 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Sensory changes</Badge>
                <CardTitle className="text-lg">Anticipate and adapt early</CardTitle>
                <CardDescription>
                  Expect shifts in hearing, vision, and vestibular needs; plan calmer environments before overwhelm builds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Book double-length or quieter clinic slots and request low-sensory waiting areas</li>
                  <li>• Trial lighting, seating, and mobility aids ahead of time; document preferred adjustments</li>
                  <li>• Encourage audiology and vision screening with clear scripts and visual supports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Health admin</Badge>
                <CardTitle className="text-lg">Stay ahead of paperwork</CardTitle>
                <CardDescription>
                  Use visual and tactile prompts to keep medication, appointments, and emergency info organised.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Set up pill organisers, talking reminders, or supporter check-ins for daily dosing</li>
                  <li>• Maintain laminated checklists for appointments, bloods, and repeat prescriptions</li>
                  <li>• Create a hospital passport and consent notes; store copies in digital and physical formats</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Social care</Badge>
                <CardTitle className="text-lg">Access support early</CardTitle>
                <CardDescription>
                  Engage local authorities and carer networks before needs escalate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Request adult social care assessments and carers' assessments; capture unmet need evidence</li>
                  <li>• Explore respite, supported living, or direct payments pathways with the social worker</li>
                  <li>• Connect with local autism hubs and carers' forums for peer support and contingency planning</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Keep documentation updated annually and share summaries with healthcare, social care, and trusted supporters.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Resources Library Component */}
      <section id="sensory-support" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <ResourcesLibrary />
      </section>

      {/* Clinical Guidance Section */}
      <section id="clinical-guidance" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Clinical & Education Guidance</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clinical guidance</CardTitle>
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
                        </div>
                        NICE CG170 — Autism spectrum disorder in under 19s: support and management
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
                        </div>
                        NICE CG142 — Autism spectrum disorder in adults: diagnosis and management
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010696.pub2/full" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Clinicians</Badge>
                          <Badge variant="secondary" className="text-xs">Parents</Badge>
                        </div>
                        Cochrane — Melatonin for sleep in ASD
                      </div>
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education & support sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://www.nhs.uk/conditions/autism/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Parents</Badge>
                          <Badge variant="secondary" className="text-xs">Adults</Badge>
                        </div>
                        NHS — Autism overview
                      </div>
                    </a>
                  </li>
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
                          <Badge variant="secondary" className="text-xs">Teachers</Badge>
                          <Badge variant="secondary" className="text-xs">Policy</Badge>
                        </div>
                        DfE/DoH SEND Code of Practice (0–25)
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.autism.org.uk/advice-and-guidance" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Parents</Badge>
                          <Badge variant="secondary" className="text-xs">Adults</Badge>
                        </div>
                        National Autistic Society — Advice & reasonable adjustments
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.gov.uk/access-to-work" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Adults</Badge>
                          <Badge variant="secondary" className="text-xs">Policy</Badge>
                        </div>
                        Access to Work — Workplace support
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.autismeducationtrust.org.uk/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">Teachers</Badge>
                        </div>
                        Autism Education Trust — Frameworks & CPD
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
              <CardTitle>Practical techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 md:grid-cols-2 text-sm">
                <li>• <strong>NDBI-style caregiver coaching (ages 2–8):</strong> brief play bursts with modelling and turn-taking</li>
                <li>• <strong>Visual schedules & First/Then (ages 3–16):</strong> make steps visible to reduce transition stress</li>
                <li>• <strong>AAC basics (all ages):</strong> core boards or PECS reduce frustration without replacing speech</li>
                <li>• <strong>Structured teaching / TEACCH (school age):</strong> predictable work systems and chunked tasks</li>
                <li>• <strong>ABC behaviour logging (all ages):</strong> track antecedents and teach easier communication alternatives</li>
                <li>• <strong>Sleep routines (all ages):</strong> consistent schedule, dim light, calming sequence; seek specialist advice for melatonin</li>
                <li>• <strong>Sensory regulation menu (all ages):</strong> headphones, movement breaks, deep-pressure tools if liked</li>
                <li>• <strong>Adapted CBT (adolescents/adults):</strong> concrete goals, visual agendas, graded exposure with sensory planning</li>
                <li>• <strong>Reasonable adjustments (adolescents/adults):</strong> clear instructions, reduced sensory load, flexible timings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mental Health Quick Reference */}
      <section id="mental-health" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Mental Health: Anxiety • Depression • Stress • Sleep
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Adapted CBT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Visual agendas, concrete skills practice, stepwise exposure paired with sensory planning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Consistent timing, low light, screens off ≥1 hour; record latency; escalate to clinicians if persistent.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Breathing Quick Reference */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Breathing & Focus (2-minute reset)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">How to run it</h4>
                  <ol className="space-y-1 text-sm list-decimal list-inside">
                    <li>Sit comfortably; relax shoulders and jaw</li>
                    <li>Inhale quietly through the nose ~4 s; exhale ~6 s</li>
                    <li>Repeat 10 cycles; notice shoulders lowering and heart rate easing</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When to use</h4>
                  <p className="text-sm text-muted-foreground">
                    Use before transitions, meetings or bedtime wind-down. Pair with a sensory-friendly space where possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
