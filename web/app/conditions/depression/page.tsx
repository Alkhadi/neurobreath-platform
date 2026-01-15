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
import { EvidenceFooter, DEPRESSION_EVIDENCE_SOURCES } from '@/components/evidence-footer';

export default function DepressionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <Navigation />
      <div className="w-[88vw] mx-auto py-8 space-y-16">
        <HeroSection />
        <ConditionOverview />
        <QuickStarter />
        <BreathingExercises />
        <BehavioralActivation />
        <TreatmentOptions />
        <EmergingTherapies />
        <LifestyleInterventions />
        <StatisticsImpact />
        <SpecialPopulations />
        <SupportResources />
        <References />
        <DownloadPDF />
        
        {/* Evidence Sources */}
        <EvidenceFooter sources={DEPRESSION_EVIDENCE_SOURCES} />
      </div>
      <ScrollToTop />
    </main>
  );
}
