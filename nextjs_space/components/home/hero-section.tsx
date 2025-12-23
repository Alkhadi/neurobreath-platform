'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { HeroBreathingOrbit } from '@/components/home/hero-breathing-orbit'
import { QuickWinPlanner } from '@/components/home/quick-win-planner'
import { BeginSessionModal } from '@/components/BeginSessionModal'
import Link from 'next/link'
import { Play, Sparkles, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [showQuickStart, setShowQuickStart] = useState(false)

  return (
    <section id="vp-home-hero" className="nb-hero-section" aria-label="Measured breathing hero">
      <div className="nb-hero-container">
        <div className="nb-hero-content">
          
          {/* Left Column: Text & CTA */}
          <div className="nb-hero-left">
            <div className="nb-hero-badge">
              🧠 Built for Neurodiversity
            </div>
            
            <h1 className="nb-hero-title">
              Measured breathing.<br />
              Measurable relief.
            </h1>

            <p className="nb-hero-tagline">
              Guided breathing, voice cues, and evidence-based resources built specifically for neurodivergent minds.
            </p>

            <p className="nb-hero-description">
              NeuroBreath helps neurodivergent people and their supporters build calm, focus and stability through practical tools, guided breathing, training, and low-pressure progress tracking.
            </p>

            {/* Quick Start Button */}
            <div className="nb-hero-actions">
              <button
                onClick={() => setShowQuickStart(true)}
                className="nb-hero-cta-primary"
                aria-label="Start quick breathing session"
              >
                <Play size={20} className="nb-hero-cta-icon" />
                <span className="nb-hero-cta-text">
                  <span className="nb-hero-cta-main">Click here for a Quick Start</span>
                  <span className="nb-hero-cta-sub">2-5 minute breathing session • Earn rewards</span>
                </span>
                <Sparkles size={18} className="nb-hero-cta-sparkle" />
              </button>

              <Link href="/get-started" className="nb-hero-cta-secondary">
                Explore All Tools
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="nb-hero-badges">
              <span className="nb-hero-badge-item">✅ Free Forever</span>
              <span className="nb-hero-badge-item">🔒 Privacy First</span>
              <span className="nb-hero-badge-item">🧠 Neuro-Inclusive</span>
              <span className="nb-hero-badge-item">🔬 Evidence-Based</span>
            </div>
          </div>

          {/* Right Column: Breathing Orbit */}
          <div className="nb-hero-right">
            <HeroBreathingOrbit />
          </div>
        </div>

        {/* Quick Win Planner */}
        <div className="nb-hero-bottom">
          <QuickWinPlanner />
        </div>

        {/* Common Concerns */}
        <div className="nb-hero-concerns">
          <h3 className="nb-hero-concerns-title">Common concerns we support:</h3>
          <div className="nb-hero-concerns-grid">
            <Link href="/conditions/anxiety" className="nb-concern-card">
              <span className="nb-concern-emoji">😰</span>
              <span className="nb-concern-text">Stress & Anxiety</span>
            </Link>
            <Link href="/conditions/anxiety" className="nb-concern-card">
              <span className="nb-concern-emoji">😱</span>
              <span className="nb-concern-text">Panic Symptoms</span>
            </Link>
            <Link href="/sleep" className="nb-concern-card">
              <span className="nb-concern-emoji">💤</span>
              <span className="nb-concern-text">Sleep Issues</span>
            </Link>
            <Link href="/conditions/anxiety" className="nb-concern-card">
              <span className="nb-concern-emoji">🎯</span>
              <span className="nb-concern-text">Focus & Tests</span>
            </Link>
            <Link href="/adhd" className="nb-concern-card">
              <span className="nb-concern-emoji">🌀</span>
              <span className="nb-concern-text">ADHD Support</span>
            </Link>
            <Link href="/conditions/low-mood-burnout" className="nb-concern-card">
              <span className="nb-concern-emoji">🌧️</span>
              <span className="nb-concern-text">Low Mood</span>
            </Link>
          </div>
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
