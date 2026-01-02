'use client';

import { useRef, useState, useEffect } from 'react';
import { Hero } from '@/components/autism/hero';
import { AudienceSwitcher } from '@/components/autism/audience-switcher';
import { CountrySwitcher } from '@/components/autism/country-switcher';
import { HowToUse } from '@/components/autism/how-to-use';
import { SkillsLibraryEnhanced } from '@/components/autism/skills-library-enhanced';
import { CalmToolkitEnhanced } from '@/components/autism/calm-toolkit-enhanced';
import { DailyQuests } from '@/components/autism/daily-quests';
import { ProgressDashboardEnhanced } from '@/components/autism/progress-dashboard-enhanced';
import { CrisisSupport } from '@/components/autism/crisis-support';
import { MythsFacts } from '@/components/autism/myths-facts';
import { References } from '@/components/autism/references';
import { TodaysPlanWizard } from '@/components/autism/todays-plan-wizard';
import { NowNextBuilder } from '@/components/autism/now-next-builder';
import { SensoryDetective } from '@/components/autism/sensory-detective';
import { EvidenceHub } from '@/components/autism/evidence-hub';
import { PubMedResearch } from '@/components/autism/pubmed-research';
import { TransitionTimer } from '@/components/autism/transition-timer';
import { CommunicationChoice } from '@/components/autism/communication-choice';
import { EmotionThermometer } from '@/components/autism/emotion-thermometer';
import { CopingMenu } from '@/components/autism/coping-menu';
import { WorkplaceAdjustments } from '@/components/autism/workplace-adjustments';
import { PathwaysNavigator } from '@/components/autism/pathways-navigator';
import { AIChatHub } from '@/components/autism/ai-chat-hub';
import { ResourcesLibrary } from '@/components/autism/resources-library';
import { initializeMilestones } from '@/lib/progress-store-enhanced';

export default function AutismHubPage() {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Initialize milestones on first load
  useEffect(() => {
    initializeMilestones();
  }, []);

  const scrollToCalm = () => {
    const calmSection = document.querySelector('#calm');
    calmSection?.scrollIntoView?.({ behavior: 'smooth' });
  };

  const scrollToSkills = () => {
    const skillsSection = document.querySelector('#skills');
    skillsSection?.scrollIntoView?.({ behavior: 'smooth' });
  };

  const handleProgressUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen">
      {/* Hero with integrated navigation */}
      <Hero 
        onStartCalm={scrollToCalm} 
        onBrowseSkills={scrollToSkills}
        AudienceSwitcher={AudienceSwitcher}
        CountrySwitcher={CountrySwitcher}
      />

      {/* How to use */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <HowToUse />
      </div>

      {/* Daily Quests */}
      <DailyQuests onUpdate={handleProgressUpdate} />

      {/* Today's Plan Wizard - NEW FLAGSHIP FEATURE */}
      <section id="todays-plan" className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Today's Plan Wizard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate a practical, evidence-based plan tailored to your age, need, and setting
            </p>
          </div>
          <TodaysPlanWizard onComplete={handleProgressUpdate} />
        </div>
      </section>

      {/* Interactive Tools */}
      <section id="tools" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Interactive Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create practical supports and visual aids to help with daily challenges
            </p>
          </div>
          <div className="space-y-6">
            <NowNextBuilder onComplete={handleProgressUpdate} />
            <SensoryDetective onComplete={handleProgressUpdate} />
            <TransitionTimer />
            <CommunicationChoice />
            <EmotionThermometer />
            <CopingMenu />
            <WorkplaceAdjustments />
          </div>
        </div>
      </section>

      {/* Skills Library Enhanced */}
      <SkillsLibraryEnhanced onProgressUpdate={handleProgressUpdate} />

      {/* Calm Toolkit Enhanced */}
      <CalmToolkitEnhanced onProgressUpdate={handleProgressUpdate} />

      {/* Progress Dashboard Enhanced */}
      <ProgressDashboardEnhanced onReset={handleProgressUpdate} />

      {/* Evidence Hub */}
      <section id="evidence" className="py-16 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <EvidenceHub />
        </div>
      </section>

      {/* Pathways Navigator */}
      <section id="pathways" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Education Rights & Pathways</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Step-by-step guides for UK SEND/EHCP, US IEP/504, and EU inclusive education
            </p>
          </div>
          <PathwaysNavigator />
        </div>
      </section>

      {/* Downloadable Resources Library */}
      <section id="resources" className="py-16 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/20 dark:via-gray-900 dark:to-blue-950/20 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Template Letters & Forms</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ready-to-use templates for EHCP/IEP requests, evidence gathering, meeting prep, and classroom support
            </p>
          </div>
          <ResourcesLibrary />
        </div>
      </section>

      {/* PubMed Research */}
      <section id="research" className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Research Database</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search 35+ million peer-reviewed articles on PubMed
            </p>
          </div>
          <PubMedResearch />
        </div>
      </section>

      {/* AI Chat Hub */}
      <section id="ai-chat" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">AI Support Assistant</h2>
            <p className="text-muted-foreground mx-auto">
              Ask questions and get personalized autism support guidance
            </p>
          </div>
          <AIChatHub />
        </div>
      </section>

      {/* Crisis Support */}
      <CrisisSupport />

      {/* Myths & Facts */}
      <MythsFacts />

      {/* References */}
      <References />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2026 NeuroBreath Platform - Autism Hub. All content is for educational purposes only.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Evidence-based information from NICE, NHS, CDC, and peer-reviewed research.
          </p>
        </div>
      </footer>
    </main>
  );
}
