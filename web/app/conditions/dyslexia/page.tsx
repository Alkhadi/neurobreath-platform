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
import { TrustBadge } from '@/components/trust/trust-badge';

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
        <div className="min-h-screen overflow-x-hidden bg-background">
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          >
            Skip to main content
          </a>

          <main id="main-content">

            {/* ── Band 1: Hero ── Background image with dark overlay */}
            <section
              className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
              style={{
                backgroundImage: 'url("/images/home/home-section-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/20 dark:from-black/55 dark:via-black/40 dark:to-black/35"
                aria-hidden="true"
              />
              <div className="relative z-10 mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-6">
                <DyslexiaHero onScrollToSection={scrollToSection} />
                <div className="flex flex-wrap items-center gap-3">
                  <TrustBadge route="/conditions/dyslexia" variant="inline" />
                </div>
                <EducationalDisclaimerInline contextLabel="Dyslexia hub" />
              </div>
            </section>

            {/* ── Band 2: Understand & Assess ── Soft blue tint */}
            <section className="bg-blue-50/70 dark:bg-blue-950/10 py-12 sm:py-16 lg:py-20">
              <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
                <div className="pb-2 border-b border-blue-200 dark:border-blue-800">
                  <h2 className="text-2xl font-bold text-foreground">Understand &amp; Assess</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Learn what dyslexia is and explore personalised screening tools.</p>
                </div>
                <div ref={understandingRef}>
                  <UnderstandingDyslexia />
                </div>
                <div ref={assessmentRef}>
                  <AssessmentTools />
                </div>
              </div>
            </section>

            {/* ── Band 3: Interactive Learning ── Clean white */}
            <section className="bg-white dark:bg-gray-950 py-12 sm:py-16 lg:py-20">
              <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
                <div className="pb-2 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-2xl font-bold text-foreground">Interactive Learning</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Games, activities, and progress tracking designed for dyslexic learners.</p>
                </div>
                <div ref={gamesRef}>
                  <LearningGames />
                </div>
                <div ref={progressRef}>
                  <ProgressDashboard />
                </div>
              </div>
            </section>

            {/* ── Band 4: Resources &amp; Guides ── Indigo/violet tint */}
            <section className="bg-indigo-50 dark:bg-indigo-950/15 py-12 sm:py-16 lg:py-20">
              <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
                <div className="pb-2 border-b border-indigo-200 dark:border-indigo-800">
                  <h2 className="text-2xl font-bold text-foreground">Resources &amp; Guides</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Curated materials, printables, and role-specific management guides.</p>
                </div>
                <div ref={resourcesRef}>
                  <ResourcesHub />
                </div>
                <div ref={guidesRef}>
                  <ManagementGuides />
                </div>
              </div>
            </section>

            {/* ── Band 5: Evidence &amp; Community ── Slate tint */}
            <section className="bg-slate-100 dark:bg-slate-900/40 py-12 sm:py-16 lg:py-20">
              <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8 sm:space-y-10">
                <div className="pb-2 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-foreground">Evidence &amp; Community</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Research-backed strategies and peer support for everyone affected by dyslexia.</p>
                </div>
                <div ref={strategiesRef}>
                  <EvidenceBasedStrategies />
                </div>
                <div ref={supportRef}>
                  <SupportCommunity />
                </div>
              </div>
            </section>

            {/* ── Band 6: Closing ── White, border top */}
            <section className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 sm:py-16">
              <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-8">

                {/* Educational Disclaimer */}
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Educational Resource Disclaimer</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This platform provides educational information and tools based on evidence-based research about dyslexia.
                    It is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>.
                    Always seek the advice of qualified healthcare providers, educational psychologists, or specialist teachers
                    with any questions regarding dyslexia or learning differences. The screening tools provided are for informational
                    purposes only and cannot diagnose dyslexia—only qualified professionals can provide formal diagnosis and assessment.
                    Content is sourced from reputable organisations including the NHS, British Dyslexia Association, International
                    Dyslexia Association, Yale Center for Dyslexia &amp; Creativity, and peer-reviewed research.
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p className="italic">
                      <strong>Privacy:</strong> This application stores all data locally on your device. No personal information
                      is sent to external servers. You can clear your data at any time through your browser settings.
                    </p>
                  </div>
                </div>

                {/* Back to Top */}
                <div className="flex justify-center">
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
                <EvidenceFooter evidence={evidence} />
              </div>
            </section>

          </main>
        </div>
      </ProgressProvider>
    </ReadingLevelProvider>
  );
}

