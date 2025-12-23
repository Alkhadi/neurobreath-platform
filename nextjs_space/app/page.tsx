import HeroSection from '@/components/home/hero-section'
import { PracticeCredibility } from '@/components/home/practice-credibility'
import { GoalsAssist } from '@/components/home/goals-assist'
import DailyPracticePlayer from '@/components/home/daily-practice-player'
import ChallengesSection from '@/components/home/challenges-section'
import ToolsLab from '@/components/home/tools-lab'
import EvidenceSection from '@/components/home/evidence-section'

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
      <ChallengesSection />
      <DailyPracticePlayer />
      <ToolsLab />
    </div>
  )
}
