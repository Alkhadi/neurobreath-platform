'use client'

import { Button } from '@/components/ui/button'
import { HeroBreathingOrbit } from '@/components/home/hero-breathing-orbit'
import { QuickWinPlanner } from '@/components/home/quick-win-planner'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section id="vp-home-hero" className="hero-section section" aria-label="Measured breathing hero">
      <div className="page-container">
        <article className="card hero-content-card hero-gradient--home">
          
          <HeroBreathingOrbit />

          <div className="hero-primary">
            <h1>Measured breathing. Measurable relief.</h1>

            <p className="hero-tagline">
              <strong>Guided breathing, voice cues, and evidence-based resources built for neurodiversity.</strong><br />
              Free to use and share across classrooms, clinics, and home practice.
            </p>

            <p className="nb-lead">
              NeuroBreath helps neurodivergent people and their supporters build calm, focus and stability through practical tools, guided breathing, training, and low-pressure progress tracking.
              Start with a 2–5 minute Quick Win today and earn rewards you can actually use.
            </p>
          </div>

          <QuickWinPlanner />

          <div className="hero-features">
            <div className="hero-feature-col">
              <h3 className="feature-title">Key features</h3>

              <ul className="hero-highlights">
                <li>Voice-guided breathing cues with adjustable timings for neuro-inclusive learning</li>
                <li>Private progress tracking: session minutes, breath counts, and daily streaks stored locally on your device</li>
                <li>Auto-updating resources: printable guides, QR code cards, and shareable materials sync with your progress</li>
                <li>
                  <Link href="/breathing/training/focus-garden" className="focus-training-link">
                    🌱 Focus Training – Interactive plant-based focus exercises for sustained attention
                  </Link>
                </li>
              </ul>

              <div className="hero-badges">
                <span className="badge">Neuro-inclusive</span>
                <span className="badge">Evidence-based</span>
                <span className="badge">Share-ready</span>
              </div>
            </div>

            <div className="hero-feature-col">
              <h3 className="feature-title">Common concerns</h3>

              <div className="actions hero-condition-links">
                <Link className="btn btn-compact" href="/conditions/anxiety">
                  Stress &amp; Anxiety
                </Link>
                <Link className="btn btn-compact" href="/conditions/anxiety">
                  Panic Symptoms
                </Link>
                <Link className="btn btn-compact" href="/sleep">
                  Sleep Issues
                </Link>
                <Link className="btn btn-compact" href="/conditions/anxiety">
                  Focus &amp; Tests
                </Link>
                <Link className="btn btn-compact" href="/conditions/anxiety">
                  PTSD Support*
                </Link>
                <Link className="btn btn-compact" href="/conditions/low-mood-burnout">
                  Low Mood
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
