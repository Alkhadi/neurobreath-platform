'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeroBreathingOrbit } from '@/components/home/hero-breathing-orbit'
import { QuickWinPlanner } from '@/components/home/quick-win-planner'
import { BeginSessionModal } from '@/components/BeginSessionModal'
import Link from 'next/link'
import { Zap, Sparkles, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [showQuickStart, setShowQuickStart] = useState(false)

  return (
    <section id="vp-home-hero" className="nb-hero-section-v2" aria-label="Measured breathing hero">
      <div className="nb-hero-container-v2">
        {/* Main Title */}
        <h1 className="nb-hero-main-title">
          Measured breathing. Measurable relief.
        </h1>

        {/* Two-column layout */}
        <div className="nb-hero-two-col">
          {/* Left Column: Glass Cards */}
          <div className="nb-hero-col-left">
            {/* HERO CARD 1: Glass card with two lines */}
            <div className="nb-glass-card-primary">
              <p className="nb-glass-line-bold">
                Guided breathing, voice cues, and evidence-based resources built for neurodiversity.
              </p>
              <p className="nb-glass-line-normal">
                Free to use and share across classrooms, clinics, and home practice.
              </p>
            </div>

            {/* Paragraph under card */}
            <p className="nb-hero-paragraph">
              NeuroBreath helps neurodivergent people and their supporters build calm, focus and stability through practical tools, guided breathing, training, and low-pressure progress tracking. Start with a 2–5 minute Quick Win today and earn rewards you can actually use.
            </p>

            {/* Yellow CTA Button */}
            <button
              onClick={() => setShowQuickStart(true)}
              className="nb-hero-yellow-btn"
              aria-label="Start quick breathing session"
            >
              <Zap size={20} className="nb-btn-icon" />
              Click here for a quick start
            </button>

            {/* HERO CARD 2: Large glass panel with features */}
            <div className="nb-glass-card-secondary">
              <h3 className="nb-glass-heading">Key features</h3>
              
              <ul className="nb-glass-features-list">
                <li>Voice-guided breathing cues with adjustable timings for neuro-inclusive learning</li>
                <li>Private progress tracking: session minutes, breath counts, and daily streaks stored locally on your device</li>
                <li>Auto-updating resources: printable guides, QR code cards, and shareable materials sync with your progress</li>
                <li>
                  <Link href="/tools/focus-training" className="nb-feature-link">
                    🌱 Focus Training — Interactive plant-based focus exercises for sustained attention
                  </Link>
                </li>
              </ul>

              {/* Chips row */}
              <div className="nb-chips-row">
                <span className="nb-chip">Neuro-inclusive</span>
                <span className="nb-chip">Evidence-based</span>
                <span className="nb-chip">Share-ready</span>
              </div>

              {/* Common Concerns */}
              <h4 className="nb-glass-subheading">Common concerns</h4>
              
              <div className="nb-concern-pills">
                <Link href="/conditions/anxiety" className="nb-pill-btn">Stress & Anxiety</Link>
                <Link href="/conditions/anxiety" className="nb-pill-btn">Panic Symptoms</Link>
                <Link href="/sleep" className="nb-pill-btn">Sleep Issues</Link>
                <Link href="/conditions/anxiety" className="nb-pill-btn">Focus & Tests</Link>
                <Link href="/conditions/anxiety" className="nb-pill-btn">PTSD Support*</Link>
                <Link href="/conditions/low-mood-burnout" className="nb-pill-btn">Low Mood</Link>
              </div>
            </div>
          </div>

          {/* Right Column: Breathing Orbit */}
          <div className="nb-hero-col-right">
            <HeroBreathingOrbit />
          </div>
        </div>

        {/* Quick Win Planner - Below main grid */}
        <div className="nb-hero-quickwin-section">
          <QuickWinPlanner />
        </div>
      </div>

      {/* Quick Start Modal */}
      <BeginSessionModal 
        isOpen={showQuickStart} 
        onClose={() => setShowQuickStart(false)} 
      />
    </section>
  )
}
