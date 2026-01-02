'use client';

import { useRef, useState, useEffect } from 'react';
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

export default function AutismHubPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Initialize milestones on first load
  useEffect(() => {
    initializeMilestones();
  }, []);

  const handleProgressUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-6xl px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">Autism Hub</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Evidence-based autism support with tools, strategies, and resources for all ages
          </p>
          <p className="text-sm opacity-75 max-w-2xl mx-auto">
            Built with guidance from NHS, NICE, CDC, and peer-reviewed research
          </p>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <HowToUse />
        </div>
      </section>

      {/* Progress Dashboard */}
      <section id="progress" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <ProgressDashboardEnhanced key={updateTrigger} onReset={handleProgressUpdate} />
        </div>
      </section>

      {/* Skills Library */}
      <section id="skills" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <SkillsLibraryEnhanced onProgressUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Calm Toolkit */}
      <section id="toolkit" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <CalmToolkitEnhanced onProgressUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Daily Quests */}
      <section id="quests" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <DailyQuests onUpdate={handleProgressUpdate} />
        </div>
      </section>

      {/* Education Pathways */}
      <section id="pathways" className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <PathwaysNavigator />
        </div>
      </section>

      {/* Resources Library */}
      <section id="resources" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <ResourcesLibrary />
        </div>
      </section>

      {/* Evidence Hub */}
      <section id="evidence" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <EvidenceHub />
        </div>
      </section>

      {/* PubMed Research */}
      <section id="research" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <PubMedResearch />
        </div>
      </section>

      {/* AI Chat Hub */}
      <section id="ai-chat" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <AIChatHub />
        </div>
      </section>

      {/* Myths & Facts */}
      <section id="myths" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <MythsFacts />
        </div>
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <CrisisSupport />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">NeuroBreath Autism Hub</h3>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto">
              Evidence-based autism support for all ages. Built with guidance from NHS, NICE, CDC, and peer-reviewed research.
            </p>
            <p className="text-xs text-gray-500 pt-4 border-t border-white/10">
              © 2026 NeuroBreath Platform - Autism Hub. All content is for educational purposes only.
            </p>
            <p className="text-xs text-gray-600">
              ⚠️ This platform provides educational support and is not a substitute for professional medical advice.
              Always consult healthcare providers for diagnosis and treatment.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
