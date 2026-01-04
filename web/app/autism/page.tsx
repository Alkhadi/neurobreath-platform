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
        <div className="mx-auto px-4 text-center space-y-6" style={{ width: '86vw', maxWidth: '86vw' }}>
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
        <HowToUse />
      </section>

      {/* Progress Dashboard */}
      <section id="progress" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 scroll-mt-20">
        <ProgressDashboardEnhanced key={updateTrigger} onReset={handleProgressUpdate} />
      </section>

      {/* Skills Library */}
      <section id="skills" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <SkillsLibraryEnhanced onProgressUpdate={handleProgressUpdate} />
      </section>

      {/* Calm Toolkit */}
      <section id="toolkit" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <CalmToolkitEnhanced onProgressUpdate={handleProgressUpdate} />
      </section>

      {/* Daily Quests */}
      <section id="quests" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <DailyQuests onUpdate={handleProgressUpdate} />
      </section>

      {/* Education Pathways */}
      <section id="pathways" className="py-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950 scroll-mt-20">
        <PathwaysNavigator />
      </section>

      {/* Resources Library */}
      <section id="resources" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <ResourcesLibrary />
      </section>

      {/* Evidence Hub */}
      <section id="evidence" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <EvidenceHub />
      </section>

      {/* PubMed Research */}
      <section id="research" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <PubMedResearch />
      </section>

      {/* AI Chat Hub */}
      <section id="ai-chat" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 scroll-mt-20">
        <AIChatHub />
      </section>

      {/* Myths & Facts */}
      <section id="myths" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <MythsFacts />
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 scroll-mt-20">
        <CrisisSupport />
      </section>
    </main>
  );
}
