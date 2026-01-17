'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, Timer, Brain, Target, BookOpen, Heart,
  Rocket, Star, Users, Download, Play, Pause,
  CheckCircle2, AlertCircle, Trophy, Sparkles,
  Clock, Focus, ListChecks, FlameIcon
} from 'lucide-react';
import { FocusPomodoro } from '@/components/adhd/focus-pomodoro';
import { DailyQuestsADHD } from '@/components/adhd/daily-quests-adhd';
import { ADHDSkillsLibrary } from '@/components/adhd/adhd-skills-library';
import { ADHDMythsFacts } from '@/components/adhd/adhd-myths-facts';
import { TreatmentDecisionTree } from '@/components/adhd/treatment-decision-tree';
import { PubMedResearch } from '@/components/autism/pubmed-research';
import { CrisisSupport } from '@/components/autism/crisis-support';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { TrustPanel } from '@/components/trust/TrustPanel';
import type { Region } from '@/lib/region/region';

const evidence = evidenceByRoute['/tools/adhd-tools'];

export default function ADHDToolsPage() {
  const region: Region = 'UK';
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="mx-auto px-4 text-center space-y-6 w-[86vw] max-w-[86vw]">
          <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white border-white/30">
            <Zap className="w-4 h-4" />
            <span>Focus · Regulation · Planning</span>
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            ADHD Tools & Focus Hub
          </h1>
          <div className="max-w-2xl mx-auto">
            <EducationalDisclaimerInline contextLabel="ADHD tools" variant="compact" className="bg-white/10 text-white border-white/30" />
          </div>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Curated bundles, breathing resets, focus routines, and interactive games to help you plan work, protect energy, and build supportive habits.
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 gap-2 shadow-lg">
              <Play className="w-5 h-5" />
              Quick Start Guide
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
              <Download className="w-5 h-5" />
              Download Toolkit
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
              <Focus className="w-5 h-5" />
              Focus Sprint
            </Button>
          </div>

          <p className="text-sm opacity-75 max-w-2xl mx-auto pt-4">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Educational information only; not medical advice. Built with evidence from NHS, CDC, and peer-reviewed research.
          </p>
        </div>
      </section>

      {/* Quick Access Navigation */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('overview')}
              className="gap-2"
            >
              <Target className="w-4 h-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'focus' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('focus')}
              className="gap-2"
            >
              <Timer className="w-4 h-4" />
              Focus Timer
            </Button>
            <Button 
              variant={activeTab === 'games' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('games')}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Games & Practice
            </Button>
            <Button 
              variant={activeTab === 'breathing' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('breathing')}
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              Breathing Tools
            </Button>
            <Button 
              variant={activeTab === 'resources' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('resources')}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Resources
            </Button>
          </div>
        </div>
      </section>

      {/* ADHD Quick Starter */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Quick Starter: ADHD</CardTitle>
                  <CardDescription>Educational information only — not a diagnosis or medical advice</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    What it is
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    A neurodevelopmental condition that affects attention regulation, impulsivity and hyperactivity. Experiences vary from person to person.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Possible signs
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Difficulty sustaining attention or following through on tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Restlessness or fidgeting; feeling "on the go"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Impulsivity (e.g., interrupting, acting before thinking)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Disorganisation, forgetfulness, losing things</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    How to use this site
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Start with short, repeatable breath sets to settle the nervous system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Use the SOS 60-second reset before challenging tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Build a streak in the progress panel; keep sessions brief but frequent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Use focus sprints and games to build attention skills</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" className="gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    Box Breathing
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    4-7-8 Breathing
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                    Coherent 5-5
                  </Button>
                  <Button variant="outline" className="gap-2 bg-red-50 dark:bg-red-950/20 border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    60-second SOS
                  </Button>
                </div>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  <strong>Trusted resources:</strong> <a href="https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NHS – ADHD overview</a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Daily Quests & Gamification */}
      <section id="quests" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Level Up Your ADHD Management</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Daily Quests & Challenges 🎮
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Gamified daily quests to build consistency. Earn XP, unlock badges, and maintain streaks!
            </p>
          </div>
          <DailyQuestsADHD />
        </div>
      </section>

      {/* Focus Pomodoro Timer */}
      <section id="focus-timer" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4">
              <Timer className="w-5 h-5" />
              <span className="font-semibold">Flexible Focus System</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              ADHD Focus Timer ⏱️
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Flexible Pomodoro technique adapted for ADHD brains — adjust intervals based on your energy and hyperfocus state
            </p>
          </div>
          <FocusPomodoro />
        </div>
      </section>

      {/* ADHD Skills Library & Practice Games */}
      <section id="skills" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Interactive Learning</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Skills Library & Practice Games 🎯
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Evidence-based strategies, interactive exercises, and practical tools to master ADHD management
            </p>
          </div>
          <ADHDSkillsLibrary />
        </div>
      </section>

      {/* Curated Breathing Bundles */}
      <section id="breathing-bundles" className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">Nervous System Regulation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Curated Breathing Bundles 🌬️
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Pre-designed breathing sequences for different situations and energy levels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Beginner Bundle",
                duration: "2 minutes",
                description: "2× Box Breathing (1 min each) + shareable PDF",
                icon: <Star className="w-8 h-8 text-blue-600" />,
                color: "blue",
                use: "Start here if you're new to breathing techniques"
              },
              {
                title: "Quick Reset",
                duration: "2 minutes",
                description: "SOS-60 + Coherent 5-5 for rapid regulation",
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                color: "yellow",
                use: "Before meetings, tests, or difficult conversations"
              },
              {
                title: "Classroom Bundle",
                duration: "2 minutes",
                description: "Silent Box Breathing — no audio needed",
                icon: <Users className="w-8 h-8 text-green-600" />,
                color: "green",
                use: "Perfect for quiet classroom or office environments"
              },
              {
                title: "Bedtime Bundle",
                duration: "3-5 minutes",
                description: "4-7-8 Breathing, phone face-down",
                icon: <Clock className="w-8 h-8 text-purple-600" />,
                color: "purple",
                use: "Wind down before sleep for better rest quality"
              }
            ].map((bundle, index) => (
              <Card key={index} className="hover:shadow-lg transition-all border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>{bundle.icon}</div>
                    <Badge variant="outline">{bundle.duration}</Badge>
                  </div>
                  <CardTitle className="text-xl mt-3">{bundle.title}</CardTitle>
                  <CardDescription className="mt-2">{bundle.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        <strong>Best for:</strong> {bundle.use}
                      </p>
                    </div>
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Start Bundle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Decision Tree */}
      <section id="treatment" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Evidence-Based Guidance</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              ADHD Treatment Decision Support 🧭
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Interactive decision tree based on NICE guidelines to explore treatment options
            </p>
          </div>
          <TreatmentDecisionTree />
        </div>
      </section>

      {/* ADHD Myths & Facts */}
      <section id="myths-facts" className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-950/20 dark:via-yellow-950/20 dark:to-pink-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <ADHDMythsFacts />
        </div>
      </section>

      {/* Downloadable Resources & Templates */}
      <section id="resources" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 mb-4">
              <Download className="w-5 h-5" />
              <span className="font-semibold">Printable & Editable</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
              ADHD Resources & Templates 📋
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Downloadable templates for 504 plans, workplace accommodations, dopamine menus, focus planners, and more
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Focus Sprint Planner",
                description: "Visual time-blocking template with If-Then cues and micro-boost reminders",
                icon: <Rocket className="w-8 h-8 text-orange-600" />,
                badge: "All Ages",
                format: "HTML + PDF"
              },
              {
                title: "504 Plan Request Letter",
                description: "Request ADHD accommodations at school (US)",
                icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                badge: "Parents",
                format: "Word + PDF"
              },
              {
                title: "Workplace Accommodations",
                description: "Request ADA accommodations at work with evidence-based examples",
                icon: <Heart className="w-8 h-8 text-purple-600" />,
                badge: "Adults",
                format: "Word + PDF"
              },
              {
                title: "Dopamine Menu",
                description: "Create your personalized activity menu for different energy states",
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                badge: "All Ages",
                format: "Editable PDF"
              },
              {
                title: "Medication Tracker",
                description: "Track effectiveness, side effects, and timing with visual charts",
                icon: <Star className="w-8 h-8 text-green-600" />,
                badge: "All Ages",
                format: "Printable PDF"
              },
              {
                title: "Parent-Teacher Collaboration Plan",
                description: "Structured communication plan for consistent school support",
                icon: <Users className="w-8 h-8 text-pink-600" />,
                badge: "Parents & Teachers",
                format: "Word + PDF"
              },
              {
                title: "If-Then Planning Worksheet",
                description: "Build automatic habits with if-then cue planning templates",
                icon: <ListChecks className="w-8 h-8 text-teal-600" />,
                badge: "All Ages",
                format: "Printable PDF"
              },
              {
                title: "Energy Tracker & Mood Log",
                description: "Track patterns to optimize scheduling and medication timing",
                icon: <FlameIcon className="w-8 h-8 text-red-600" />,
                badge: "All Ages",
                format: "Printable PDF"
              },
              {
                title: "Complete ADHD Toolkit Bundle",
                description: "All printable resources, guides, and templates in one download",
                icon: <Download className="w-8 h-8 text-indigo-600" />,
                badge: "Complete Set",
                format: "ZIP Bundle"
              }
            ].map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>{resource.icon}</div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">{resource.badge}</Badge>
                      <p className="text-xs text-muted-foreground">{resource.format}</p>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3">{resource.title}</CardTitle>
                  <CardDescription className="mt-2">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={index > 0}
                  >
                    {index === 0 ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </>
                    ) : (
                      'Coming Soon 🚧'
                    )}
                  </Button>
                  {index > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Template editor in development
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence & UK Resources */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                  <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Evidence Base & UK Resources</CardTitle>
                  <CardDescription>Why breathing + sprints work for ADHD brains</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Research Evidence
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Short breathing resets regulate autonomic arousal <em>(Noble & Hochman, 2019)</em> while structured work-rest intervals improve sustained attention for adults with ADHD <em>(Semeijn et al., 2020)</em>.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">🇬🇧 UK-Specific Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://www.nice.org.uk/guidance/ng87" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        NICE NG87 — ADHD diagnosis and management
                      </a>
                    </li>
                    <li>
                      <a href="https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        NHS — ADHD overview & support pathways
                      </a>
                    </li>
                    <li>
                      <a href="https://www.acas.org.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Acas — Workplace adjustments for neurodiversity
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">🌍 International Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://www.additudemag.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        ADDitude — Pomodoro for ADHD focus
                      </a>
                    </li>
                    <li>
                      <a href="https://chadd.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        CHADD — Children & Adults with ADHD
                      </a>
                    </li>
                    <li>
                      <a href="https://www.cdc.gov/adhd/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        CDC — ADHD research & data
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PubMed Research Database */}
      <section id="research" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">35+ Million Articles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              ADHD Research Database 📚
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Search peer-reviewed articles on ADHD, executive function, and neurodevelopmental research
            </p>
          </div>
          <PubMedResearch />
        </div>
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <CrisisSupport />
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <TrustPanel region={region} title="Evidence policy & citations" />
        </div>
      </section>

      {/* Evidence Sources */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <EvidenceFooter evidence={evidence} />
        </div>
      </section>

    </main>
  );
}
