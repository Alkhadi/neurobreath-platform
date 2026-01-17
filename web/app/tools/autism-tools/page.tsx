'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, Heart, Users, Target, BookOpen, Download,
  Play, CheckCircle2, AlertCircle, Shield, Eye,
  Volume2, Clock, Sparkles, MessageSquare, Home,
  School, FileText, Headphones, Sun, Box
} from 'lucide-react';
import { HowToUse } from '@/components/autism/how-to-use';
import { SkillsLibraryEnhanced } from '@/components/autism/skills-library-enhanced';
import { CalmToolkitEnhanced } from '@/components/autism/calm-toolkit-enhanced';
import { ProgressDashboardEnhanced } from '@/components/autism/progress-dashboard-enhanced';
import { DailyQuests } from '@/components/autism/daily-quests';
import { PathwaysNavigator } from '@/components/autism/pathways-navigator';
import { ResourcesLibrary } from '@/components/autism/resources-library';
import { PubMedResearch } from '@/components/autism/pubmed-research';
import { AIChatHub } from '@/components/autism/ai-chat-hub';
import { CrisisSupport } from '@/components/autism/crisis-support';
import { MythsFacts } from '@/components/autism/myths-facts';
import { EvidenceHub } from '@/components/autism/evidence-hub';
import { initializeMilestones } from '@/lib/progress-store-enhanced';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { TrustPanel } from '@/components/trust/TrustPanel';
import type { Region } from '@/lib/region/region';

const evidence = evidenceByRoute['/tools/autism-tools'];

export default function AutismToolsPage() {
  const region: Region = 'UK';
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showSensoryProfile, setShowSensoryProfile] = useState(false);

  // Initialize milestones on first load
  useEffect(() => {
    initializeMilestones();
  }, []);

  const handleProgressUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownloadToolkit = () => {
    // Scroll to resources section where PDFs are available
    scrollToSection('resources');
  };

  const handleQuickStart = () => {
    // Scroll to the how-to-use section
    scrollToSection('how-to-use');
  };

  const handleSensoryProfile = () => {
    // Scroll to sensory profile section
    scrollToSection('sensory-communication');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="mx-auto px-4 text-center space-y-6 w-[86vw] max-w-[86vw]">
          <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white border-white/30">
            <Brain className="w-4 h-4" />
            <span>Sensory-Ready · Co-Regulation · Evidence-Backed</span>
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Autism Tools & Support Hub
          </h1>
          <div className="max-w-2xl mx-auto">
            <EducationalDisclaimerInline contextLabel="Autism tools" variant="compact" className="bg-white/10 text-white border-white/30" />
          </div>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Neuro-inclusive breathing, regulation, communication supports, and daily living tools. Everything designed with sensory processing and predictability in mind.
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 gap-2 shadow-lg"
              onClick={handleQuickStart}
            >
              <Play className="w-5 h-5 text-blue-600" />
              Quick Start Guide
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 gap-2 shadow-lg"
              onClick={handleDownloadToolkit}
            >
              <Download className="w-5 h-5 text-blue-600" />
              Download Toolkit PDFs
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 gap-2 shadow-lg"
              onClick={handleSensoryProfile}
            >
              <Shield className="w-5 h-5 text-blue-600" />
              Sensory Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 max-w-4xl mx-auto">
            <button 
              onClick={() => scrollToSection('breathing-bundles')}
              className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Curated Breathing Bundles</h4>
                <p className="text-xs opacity-90">Save to device, share with carers</p>
              </div>
            </button>
            <button 
              onClick={() => scrollToSection('sensory-communication')}
              className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Sensory & Communication Checklists</h4>
                <p className="text-xs opacity-90">Request adjustments in writing</p>
              </div>
            </button>
            <button 
              onClick={() => scrollToSection('evidence')}
              className="flex items-start gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Evidence-Backed UK Resources</h4>
                <p className="text-xs opacity-90">NHS, NICE, NAS guidance</p>
              </div>
            </button>
          </div>

          <p className="text-sm opacity-75 max-w-2xl mx-auto pt-4">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Educational information only; not medical advice. Built with guidance from NHS, NICE, CDC, and peer-reviewed research.
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
              variant={activeTab === 'skills' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('skills')}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Skills & Games
            </Button>
            <Button 
              variant={activeTab === 'calm' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('calm')}
              className="gap-2"
            >
              <Heart className="w-4 h-4" />
              Calm Toolkit
            </Button>
            <Button 
              variant={activeTab === 'communication' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('communication')}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Communication
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

      {/* Autism Quick Starter */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Quick Starter: Autism</CardTitle>
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
                    Autism is a neurodevelopmental difference that affects social communication, sensory processing, and patterns of behaviour or interests.
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
                      <span>Differences in social communication or interaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Sensory sensitivities (noise, light, textures)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Preference for routines; difficulty with change</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>Focused or intense interests</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Use this site for Autism
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Choose a breathing pace that feels safe for your sensory profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Use predictable counts (e.g., Coherent 5-5) and minimise audio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Save one-page PDFs and share with carers/teachers if helpful</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Use visual schedules, AAC tools, and predictable routines</span>
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
                  <strong>Trusted resources:</strong> <a href="https://www.nhs.uk/conditions/autism/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NHS – Autism overview</a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section id="how-to-use" className="py-12 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <HowToUse />
        </div>
      </section>

      {/* Progress Dashboard */}
      <section id="progress" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Track Your Journey</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Progress Dashboard 📊
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Monitor sessions, streaks, XP, badges, and milestones. All data saved locally on your device.
            </p>
          </div>
          <ProgressDashboardEnhanced key={updateTrigger} onReset={handleProgressUpdate} />
        </div>
      </section>

      {/* Daily Quests */}
      <section id="quests" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Daily Challenges</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Daily Quests & Challenges 🎮
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Complete daily quests to build consistency, earn rewards, and develop new skills
            </p>
          </div>
          <DailyQuests onUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Skills Library */}
      <section id="skills" className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Interactive Learning</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Autism Skills Library 🎯
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Evidence-based strategies, social stories, visual supports, and sensory tools
            </p>
          </div>
          <SkillsLibraryEnhanced onProgressUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Calm Toolkit */}
      <section id="toolkit" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 mb-4">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Regulation Tools</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Calm & Regulation Toolkit 🧘
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Breathing exercises, sensory supports, and co-regulation strategies for overwhelm
            </p>
          </div>
          <CalmToolkitEnhanced onProgressUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Curated Breathing Bundles */}
      <section id="breathing-bundles" className="py-16 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-blue-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 mb-4">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">Sensory-Friendly Routines</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Curated Breathing Bundles 🌬️
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Pre-designed, predictable breathing sequences for different sensory profiles and situations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Beginner Bundle",
                duration: "2 minutes",
                description: "2× Box Breathing (1 min each) + shareable PDF",
                icon: <Box className="w-8 h-8 text-blue-600" />,
                sensory: "Low sensory load, predictable pattern",
                use: "Start here if you're new to breathing techniques"
              },
              {
                title: "Quick Reset",
                duration: "2 minutes",
                description: "SOS-60 + Coherent 5-5 for rapid co-regulation",
                icon: <Clock className="w-8 h-8 text-green-600" />,
                sensory: "Fast, effective, minimal audio",
                use: "Before transitions or when feeling overwhelmed"
              },
              {
                title: "Classroom Bundle",
                duration: "2 minutes",
                description: "Silent Box Breathing — no audio, visual cues only",
                icon: <School className="w-8 h-8 text-purple-600" />,
                sensory: "Silent, discreet, sensory-safe",
                use: "Perfect for classroom or quiet public spaces"
              },
              {
                title: "Bedtime Bundle",
                duration: "3-5 minutes",
                description: "4-7-8 Breathing, phone face-down, dim lighting",
                icon: <Sun className="w-8 h-8 text-orange-600" />,
                sensory: "Slow, calming, sleep-ready",
                use: "Wind down before sleep in predictable routine"
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
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <p className="text-sm text-muted-foreground">
                        <strong>Sensory:</strong> {bundle.sensory}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        <strong>Best for:</strong> {bundle.use}
                      </p>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => scrollToSection('toolkit')}
                    >
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

      {/* Sensory Profile & Communication Tools */}
      <section id="sensory-communication" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Sensory & Communication</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Sensory Profile & Communication Tools 🛡️
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Document your sensory needs and communication preferences to share with supporters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sensory Profile */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Sensory Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Helpful adjustments:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                    <li className="list-disc">Noise-cancelling headphones</li>
                    <li className="list-disc">Dimmer lighting or natural light</li>
                    <li className="list-disc">Stable desk without wobble</li>
                    <li className="list-disc">Predictable schedule</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    Difficult triggers:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2 pl-6">
                    <li className="list-disc">Strong smells or perfumes</li>
                    <li className="list-disc">Bright flickering lights</li>
                    <li className="list-disc">Last-minute schedule changes</li>
                    <li className="list-disc">Loud or unpredictable noises</li>
                  </ul>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <FileText className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Action:</strong> Note three adjustments to request in writing
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Communication Preferences */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Communication Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm mb-3">Preferred communication:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Written agendas</p>
                        <p className="text-xs text-muted-foreground">Clear decisions and next steps documented</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Supporter option</p>
                        <p className="text-xs text-muted-foreground">Bring someone to key meetings</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Non-phone routes</p>
                        <p className="text-xs text-muted-foreground">Email/online booking for appointments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shutdown/Overload Kit */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                    <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle>Shutdown / Overload Kit</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm mb-3">Emergency supports:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                      <Home className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Quiet space access</p>
                        <p className="text-xs text-muted-foreground">Request quiet corner or room</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                      <Headphones className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Sensory tools</p>
                        <p className="text-xs text-muted-foreground">Noise-reduction + sunglasses/hat</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                      <MessageSquare className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Exit script</p>
                        <p className="text-xs text-muted-foreground">"I need 10 minutes to reset."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education Pathways */}
      <section id="pathways" className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-4">
              <School className="w-5 h-5" />
              <span className="font-semibold">UK SEND Pathways</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Education Pathways Navigator 🎓
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              SEND support, EHCP processes, and reasonable adjustments across education settings
            </p>
          </div>
          <PathwaysNavigator />
        </div>
      </section>

      {/* Resources Library */}
      <section id="resources" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 mb-4">
              <Download className="w-5 h-5" />
              <span className="font-semibold">Downloadable Resources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Autism Resources Library 📚
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Printable guides, visual supports, social stories, and templates for home, school, and clinical use
            </p>
          </div>
          <ResourcesLibrary />
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <TrustPanel region={region} title="Evidence policy & citations" />
        </div>
      </section>

      {/* Evidence Hub */}
      <section id="evidence" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 scroll-mt-20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <EvidenceHub />
        </div>
      </section>

      {/* PubMed Research */}
      <section id="research" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">35+ Million Articles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Autism Research Database 📖
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Search peer-reviewed articles on autism, neurodevelopment, sensory processing, and interventions
            </p>
          </div>
          <PubMedResearch />
        </div>
      </section>

      {/* AI Chat Hub */}
      <section id="ai-chat" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-4">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">AI Support Assistant</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              AI Chat Hub 🤖
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get instant, evidence-based answers to autism-related questions
            </p>
          </div>
          <AIChatHub />
        </div>
      </section>

      {/* Myths & Facts */}
      <section id="myths" className="py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <MythsFacts />
        </div>
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <CrisisSupport />
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
