'use client';

import { useState, useEffect } from 'react';
import { Brain, Heart, BookOpen, Lightbulb, TrendingUp, Shield, MessageCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/page/PageHeader';
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
import { Button } from '@/components/ui/button';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import type { Region } from '@/lib/region/region';

const evidence = evidenceByRoute['/autism'];

export default function AutismHubPage() {
  const region: Region = 'UK';
  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and evidence framing.',
    createdAt: '2026-01-16',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 120,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Credibility footer and review details added.', 'safety'),
    ]),
    citationsSummary: createCitationsSummary(evidence?.citations?.length ?? 0, ['A', 'B']),
  });
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Ensure page loads at the top (hero section) on initial mount
  useEffect(() => {
    // Scroll to top when page first loads
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Clear any hash from URL to prevent auto-scrolling
    if (window.location.hash) {
      // Remove hash from URL without triggering navigation
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Initialize milestones on first load
  useEffect(() => {
    initializeMilestones();
  }, []);

  const handleProgressUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Skip to Content Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="py-6 sm:py-8 scroll-mt-20">
        <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <PageHeader 
            title="Autism Hub" 
            description="Evidence-based autism support with tools, strategies, and resources for all ages. Built with guidance from NHS, NICE, CDC, and peer-reviewed research."
            showMetadata
          />

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-6">
            <a href="#evidence" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-xl transition-all font-semibold text-base">
                <Shield className="mr-2 h-5 w-5" />
                Evidence Hub
              </Button>
            </a>
            <a href="#skills" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 transition-all font-semibold text-base">
                <Lightbulb className="mr-2 h-5 w-5" />
                Skills Library
              </Button>
            </a>
            <a href="#toolkit" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 transition-all font-semibold text-base">
                <Heart className="mr-2 h-5 w-5" />
                Calm Toolkit
              </Button>
            </a>
          </div>

          <div className="mt-4">
            <EducationalDisclaimerInline contextLabel="Autism hub" />
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards - Full Width Background with Contained Content */}
      <section className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { icon: Shield, label: 'Evidence', href: '#evidence' },
              { icon: TrendingUp, label: 'Progress', href: '#progress' },
              { icon: Lightbulb, label: 'Skills', href: '#skills' },
              { icon: Heart, label: 'Toolkit', href: '#toolkit' },
              { icon: Brain, label: 'Quests', href: '#quests' },
              { icon: BookOpen, label: 'Pathways', href: '#pathways' },
              { icon: MessageCircle, label: 'AI Chat', href: '#ai-chat' },
              { icon: AlertCircle, label: 'Crisis', href: '#crisis' },
            ].map((item, index) => (
              <a 
                key={index} 
                href={item.href}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:shadow-md group"
              >
                <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use - Introductory Section */}
      <section id="main-content" className="w-full py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HowToUse />
        </div>
      </section>

      {/* Evidence Hub - Research Section */}
      <section id="evidence" className="w-full py-16 md:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Evidence Hub
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Science-backed information and clinical guidelines
            </p>
          </div>
          <EvidenceHub />
        </div>
      </section>

      {/* Progress Dashboard - Full Width Background */}
      <section id="progress" className="w-full py-16 md:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Progress
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Monitor achievements, milestones, and skill development across all activities
            </p>
          </div>
          <ProgressDashboardEnhanced key={updateTrigger} onReset={handleProgressUpdate} />
        </div>
      </section>

      {/* Skills Library - Clean White Background */}
      <section id="skills" className="w-full py-16 md:py-20 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Skills Library
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Build essential life skills through interactive, evidence-based activities
            </p>
          </div>
          <SkillsLibraryEnhanced onProgressUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Calm Toolkit - Soothing Gradient */}
      <section id="toolkit" className="w-full py-16 md:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Calm Toolkit
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Self-regulation strategies and sensory tools for managing overwhelming moments
            </p>
          </div>
          <CalmToolkitEnhanced onProgressUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Daily Quests - Gamified Section */}
      <section id="quests" className="w-full py-16 md:py-20 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Daily Quests & Challenges
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete daily challenges to earn rewards and build consistent habits
            </p>
          </div>
          <DailyQuests onUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Education Pathways - Learning Section */}
      <section id="pathways" className="w-full py-16 md:py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/30 dark:via-blue-950/30 dark:to-purple-950/30 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Education Pathways
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Personalized learning paths for parents, educators, and individuals
            </p>
          </div>
          <PathwaysNavigator />
        </div>
      </section>

      {/* Resources Library - Comprehensive Resources */}
      <section id="resources" className="w-full py-16 md:py-20 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Resources Library
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Downloadable guides, templates, and evidence-based resources
            </p>
          </div>
          <ResourcesLibrary />
        </div>
      </section>

      {/* PubMed Research - Academic Section */}
      <section id="research" className="w-full py-16 md:py-20 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Research Database
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access peer-reviewed autism research from PubMed
            </p>
          </div>
          <PubMedResearch />
        </div>
      </section>

      {/* AI Chat Hub - Interactive Support */}
      <section id="ai-chat" className="w-full py-16 md:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Chat Support
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get personalized guidance and answers to your questions 24/7
            </p>
          </div>
          <AIChatHub />
        </div>
      </section>

      {/* Myths & Facts - Educational Section */}
      <section id="myths" className="w-full py-16 md:py-20 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Myths vs Facts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Debunking common misconceptions with evidence-based facts
            </p>
          </div>
          <MythsFacts />
        </div>
      </section>

      {/* Crisis Support - Emergency Resources */}
      <section id="crisis" className="w-full py-16 md:py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 scroll-mt-20 border-t-4 border-red-500 dark:border-red-600">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Crisis Support Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Free, confidential 24/7 support when you need it most
            </p>
          </div>
          <CrisisSupport />
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <CredibilityFooter editorial={editorial} region={region} />
        </div>
      </section>

      {/* Evidence Sources */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <EvidenceFooter evidence={evidence} />
        </div>
      </section>
    </main>
  );
}
