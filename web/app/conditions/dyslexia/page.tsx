'use client';

import { useRef } from 'react';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { ReadingLevelProvider } from '@/contexts/ReadingLevelContext';
import { DyslexiaHero } from '@/components/dyslexia/DyslexiaHero';
import { UnderstandingDyslexia } from '@/components/dyslexia/UnderstandingDyslexia';
import { AssessmentTools } from '@/components/dyslexia/AssessmentTools';
import { LearningGames } from '@/components/dyslexia/LearningGames';
import { ProgressDashboard } from '@/components/dyslexia/ProgressDashboard';
import { ResourcesHub } from '@/components/dyslexia/ResourcesHub';
import { ManagementGuides } from '@/components/dyslexia/ManagementGuides';
import { EvidenceBasedStrategies } from '@/components/dyslexia/EvidenceBasedStrategies';
import { SupportCommunity } from '@/components/dyslexia/SupportCommunity';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';

const evidence = evidenceByRoute['/conditions/dyslexia'];

export default function DyslexiaHubPage() {
  // Refs for smooth scrolling
  const understandingRef = useRef<HTMLDivElement>(null);
  const assessmentRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLDivElement>(null);
  const strategiesRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      understanding: understandingRef,
      assessment: assessmentRef,
      games: gamesRef,
      progress: progressRef,
      resources: resourcesRef,
      guides: guidesRef,
      strategies: strategiesRef,
      support: supportRef,
    };

    const targetRef = refs[section];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ReadingLevelProvider>
      <ProgressProvider>
        <div className="min-h-screen bg-background">
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          >
            Skip to main content
          </a>

          <main
            id="main-content"
            className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]"
          >
            {/* Hero Section */}
            <DyslexiaHero onScrollToSection={scrollToSection} />
            <div className="mt-4">
              <EducationalDisclaimerInline contextLabel="Dyslexia hub" />
            </div>

            {/* Understanding Dyslexia */}
            <div ref={understandingRef}>
              <UnderstandingDyslexia />
            </div>

            {/* Assessment Tools */}
            <div ref={assessmentRef}>
              <AssessmentTools />
            </div>

            {/* Learning Games */}
            <div ref={gamesRef}>
              <LearningGames />
            </div>

            {/* Progress Dashboard */}
            <div ref={progressRef}>
              <ProgressDashboard />
            </div>

            {/* Resources Hub */}
            <div ref={resourcesRef}>
              <ResourcesHub />
            </div>

            {/* Management Guides */}
            <div ref={guidesRef}>
              <ManagementGuides />
            </div>

            {/* Evidence-Based Strategies */}
            <div ref={strategiesRef}>
              <EvidenceBasedStrategies />
            </div>

            {/* Support & Community */}
            <div ref={supportRef}>
              <SupportCommunity />
            </div>

            {/* Educational Disclaimer */}
            <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-foreground mb-2">Educational Resource Disclaimer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This platform provides educational information and tools based on evidence-based research about dyslexia. 
                  It is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>. 
                  Always seek the advice of qualified healthcare providers, educational psychologists, or specialist teachers 
                  with any questions regarding dyslexia or learning differences. The screening tools provided are for informational 
                  purposes only and cannot diagnose dyslexia—only qualified professionals can provide formal diagnosis and assessment. 
                  Content is sourced from reputable organizations including the NHS, British Dyslexia Association, International 
                  Dyslexia Association, Yale Center for Dyslexia & Creativity, and peer-reviewed research.
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p className="italic">
                    <strong>Privacy:</strong> This application stores all data locally on your device. No personal information 
                    is sent to external servers. You can clear your data at any time through your browser settings.
                  </p>
                </div>
              </div>
            </section>

            {/* Back to Top Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Back to Top
              </button>
            </div>

            {/* Evidence Sources */}
            <div className="pt-8">
              <EvidenceFooter evidence={evidence} />
            </div>
          </main>
        </div>
      </ProgressProvider>
    </ReadingLevelProvider>
  );
}

