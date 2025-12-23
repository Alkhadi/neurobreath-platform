import HeroSection from '@/components/home/hero-section'
import { PracticeCredibility } from '@/components/home/practice-credibility'
import { GoalsAssist } from '@/components/home/goals-assist'
import DailyPracticePlayer from '@/components/home/daily-practice-player'
import ChallengesSection from '@/components/home/challenges-section'
import ToolsLab from '@/components/home/tools-lab'
import PlayfulBreathingLab from '@/components/home/playful-breathing-lab'
import EvidenceSection from '@/components/home/evidence-section'
import RewardsSection from '@/components/home/rewards-section'
import ShareSupportSection from '@/components/home/share-support-section'

export default function HomePage() {
  return (
    <div className="min-h-screen home-shell">
      <HeroSection />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <section className="content-section section-bg-white">
        <div className="page-container">
          <article className="card home-practice-card">
            <PracticeCredibility />
            <p className="muted practice-card-footer">
              We log rounds automatically so you can focus on calm, not dashboards.
            </p>
          </article>

          <GoalsAssist />
        </div>
      </section>

      <hr className="section-divider" aria-hidden="true" />

      <EvidenceSection />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <ChallengesSection />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <RewardsSection />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <DailyPracticePlayer />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <ToolsLab />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <PlayfulBreathingLab />
      
      <hr className="section-divider" aria-hidden="true" />
      
      <ShareSupportSection />
    </div>
  )
}
