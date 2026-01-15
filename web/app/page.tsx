import HeroSection from '@/components/home/hero-section'
import CredibilitySection from '@/components/home/credibility-section'
import GoalsSection from '@/components/home/goals-section'
import ScienceSection from '@/components/home/science-section'
import ChallengesSection from '@/components/home/challenges-section'
import RewardsSection from '@/components/home/rewards-section'
import ToolsSection from '@/components/home/tools-section'
import SafetySupportSection from '@/components/home/safety-support-section'
import OrganisationsSection from '@/components/home/organisations-section'
import { EvidenceFooter, ADHD_EVIDENCE_SOURCES, AUTISM_EVIDENCE_SOURCES, BREATHING_EVIDENCE_SOURCES, ANXIETY_EVIDENCE_SOURCES, type EvidenceSource } from '@/components/evidence-footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero - Full width */}
      <HeroSection />
      
      {/* Post-hero content - 94% width centred container */}
      <div className="mx-auto w-[94vw] max-w-[1400px]">
        {/* Credibility & Evidence */}
        <CredibilitySection />
        
        {/* Choose Your Path */}
        <GoalsSection />
        
        {/* Why It Works */}
        <ScienceSection />
        
        {/* Challenges & Tracking */}
        <ChallengesSection />
        
        {/* Rewards & Milestones */}
        <RewardsSection />
        
        {/* Interactive Tools */}
        <ToolsSection />
        
        {/* Safety & Support */}
        <SafetySupportSection />
        
        {/* For Organisations */}
        <OrganisationsSection />
        
        {/* Evidence Sources */}
        <EvidenceFooter sources={[...ADHD_EVIDENCE_SOURCES, ...AUTISM_EVIDENCE_SOURCES, ...BREATHING_EVIDENCE_SOURCES, ...ANXIETY_EVIDENCE_SOURCES]} className="mt-16" />
      </div>
    </div>
  )
}
