import HeroSection from '@/components/home/hero-section'
import QuickWinPlanner from '@/components/home/quick-win-planner'
import DailyPracticePlayer from '@/components/home/daily-practice-player'
import ChallengesSection from '@/components/home/challenges-section'
import ToolsLab from '@/components/home/tools-lab'
import EvidenceSection from '@/components/home/evidence-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickWinPlanner />
      <DailyPracticePlayer />
      <ChallengesSection />
      <ToolsLab />
      <EvidenceSection />
    </div>
  )
}
