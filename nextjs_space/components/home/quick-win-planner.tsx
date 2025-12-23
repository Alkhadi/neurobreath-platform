'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Save } from 'lucide-react'

export function QuickWinPlanner() {
  const [showModal, setShowModal] = useState(false)

  const handleGeneratePlan = () => {
    // This would open a modal with the AI planner
    setShowModal(true)
  }

  const handleSaveToToolkit = () => {
    // This would save the generated plan
    alert('Plan saved to your toolkit!')
  }

  return (
    <section className="nb-quickwin" data-quest="quickwin" aria-label="Quick Win">
      <div className="nb-quickwin__inner">
        <div className="nb-quickwin__meta">
          <span className="nb-pill">Quick Win • 2–5 minutes</span>
          <span className="nb-pill nb-pill--gold">+30 points</span>
        </div>
        <h2 className="nb-quickwin__title">Daily Support Planner (Instant)</h2>
        <p className="nb-quickwin__lead">
          Answer three questions and generate a calm, realistic plan for today—home, school, work, or care.
        </p>

        <div className="nb-quickwin__actions">
          <Button 
            onClick={handleGeneratePlan}
            className="nb-btn nb-btn--primary"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Today's Plan
          </Button>
          <Button 
            onClick={handleSaveToToolkit}
            variant="outline"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save to Toolkit
          </Button>
        </div>

        <p className="nb-quickwin__note">
          Earn badges and unlock coupons by completing Quick Wins across NeuroBreath. Progress toward "Steady Navigator" badge.
        </p>
      </div>
    </section>
  )
}
