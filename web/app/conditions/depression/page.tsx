import { HeroSection } from './components/hero-section';
import { ConditionOverview } from './components/condition-overview';
import { QuickStarter } from './components/quick-starter';
import { BreathingExercises } from './components/breathing-exercises';
import { BehavioralActivation } from './components/behavioral-activation';
import { TreatmentOptions } from './components/treatment-options';
import { EmergingTherapies } from './components/emerging-therapies';
import { LifestyleInterventions } from './components/lifestyle-interventions';
import { StatisticsImpact } from './components/statistics-impact';
import { SpecialPopulations } from './components/special-populations';
import { SupportResources } from './components/support-resources';
import { References } from './components/references';
import { DownloadPDF } from './components/download-pdf';
import { Navigation } from './components/navigation';
import { ScrollToTop } from './components/scroll-to-top';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';

const evidence = evidenceByRoute['/conditions/depression'];

const containerCls = "w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[88vw] max-w-[1400px] mx-auto px-3 sm:px-4";

export default function DepressionPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navigation />

      <main>

        {/* ── Band 1: Hero — background image + dark overlay ── */}
        <section
          className="relative overflow-hidden"
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
          <div className={`relative z-10 ${containerCls}`}>
            <HeroSection />
          </div>
        </section>

        {/* ── Band 2: Overview & Quick Start — soft blue ── */}
        <section className="bg-blue-50/70 dark:bg-blue-950/10 py-12 sm:py-16 lg:py-20">
          <div className={`${containerCls} space-y-12 sm:space-y-16`}>
            <ConditionOverview />
            <QuickStarter />
          </div>
        </section>

        {/* ── Band 3: Breathing & Activation — green tint ── */}
        <section className="bg-green-50/60 dark:bg-green-950/10 py-12 sm:py-16 lg:py-20">
          <div className={`${containerCls} space-y-12 sm:space-y-16`}>
            <BreathingExercises />
            <BehavioralActivation />
          </div>
        </section>

        {/* ── Band 4: Treatment — white ── */}
        <section className="bg-white dark:bg-gray-950 py-12 sm:py-16 lg:py-20">
          <div className={`${containerCls} space-y-12 sm:space-y-16`}>
            <TreatmentOptions />
            <EmergingTherapies />
          </div>
        </section>

        {/* ── Band 5: Lifestyle, Statistics & Populations — amber tint ── */}
        <section className="bg-amber-50/50 dark:bg-amber-950/10 py-12 sm:py-16 lg:py-20">
          <div className={`${containerCls} space-y-12 sm:space-y-16`}>
            <LifestyleInterventions />
            <StatisticsImpact />
            <SpecialPopulations />
          </div>
        </section>

        {/* ── Band 6: Support, References & Evidence — indigo tint ── */}
        <section className="bg-indigo-50 dark:bg-indigo-950/15 py-12 sm:py-16 lg:py-20">
          <div className={`${containerCls} space-y-12 sm:space-y-16`}>
            <SupportResources />
            <References />
            <DownloadPDF />
            <EvidenceFooter evidence={evidence} />
          </div>
        </section>

      </main>

      <ScrollToTop />
    </div>
  );
}
