import Link from 'next/link'
import { LiveBreathingPreview } from './live-breathing-preview'

export default function EvidenceSection() {
  return (
    <section className="content-section section-bg-sky-lavender w-full" id="why-breathing-works">
      <div className="page-container-full px-4 md:px-6 lg:px-8">
        <article className="card card-elevated card-full-width home-evidence card-share-theme w-full-override">
          
          <div className="home-evidence__heading">
            <h2>Why these techniques work</h2>
            <p className="muted">
              Everything here is educational guidance informed by clinical and occupational therapy sources. 
              We translate the evidence so it feels friendly, neuro-affirming, and doable.
            </p>
          </div>

          <div className="home-evidence__layout">
            <div className="home-evidence__cards-area">
              <div className="evidence-grid home-evidence__cards">
                
                <article className="evidence-card">
                  <span className="evidence-badge">🫧 Box &amp; coherent breathing</span>
                  <h3>Steady the autonomic swing</h3>
                  <p>
                    Equal 4-4-4-4 or 5-5 patterns are used by Navy special operations teams (
                    <a href="https://psychcentral.com/health/box-breathing" target="_blank" rel="noopener noreferrer">
                      PsychCentral
                    </a>
                    ), HRV researchers, and the NHS to nudge the vagus nerve, lower heart rate variability peaks, 
                    and steady attention for ADHD brains.
                  </p>
                </article>

                <article className="evidence-card">
                  <span className="evidence-badge">🌙 4-7-8 &amp; slow exhale work</span>
                  <h3>Lengthened exhales calm the limbic system</h3>
                  <p>
                    Dr Andrew Weil's 4-7-8 protocol and Harvard's relaxation response both show that extending 
                    the out-breath dampens the stress response, easing sleep onset and evening anxiety.
                  </p>
                </article>

                <article className="evidence-card">
                  <span className="evidence-badge">🎯 Short, frequent breaks</span>
                  <h3>Regulation is a trainable skill</h3>
                  <p>
                    Occupational therapy guidance recommends 60–180 second breathing punctuations to reduce sensory 
                    overload, anchor autistic routines, and prep ADHD minds for learning. You're not broken — 
                    these are skills you can practise.
                  </p>
                </article>

              </div>

              <div className="evidence-metrics" aria-label="Study outcomes">
                
                <article className="evidence-metric">
                  <p className="evidence-metric__eyebrow">8-week diaphragmatic breathing RCT</p>
                  <strong className="evidence-metric__value">−1.3&nbsp;µg/dL cortisol</strong>
                  <p>
                    Office workers who completed 20 guided sessions cut salivary cortisol by roughly 1.3 µg/dL, 
                    while controls showed no change. {' '}
                    <a 
                      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5455070/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Ma et&nbsp;al., 2017
                    </a>
                  </p>
                </article>

                <article className="evidence-metric">
                  <p className="evidence-metric__eyebrow">Attention &amp; accuracy</p>
                  <strong className="evidence-metric__value">+6.7 target hits</strong>
                  <p>
                    The same study recorded a 6.7 point gain on the Number Cancellation Test after training, 
                    confirming measurable focus improvements for everyday staff. {' '}
                    <a 
                      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5455070/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Frontiers in Psychology
                    </a>
                  </p>
                </article>

              </div>
            </div>

            <aside className="home-evidence__live-orbit" aria-labelledby="liveOrbitTitle">
              <div className="live-orbit-badge">INTERACTIVE DEMO</div>
              
              <h3 id="liveOrbitTitle" className="live-orbit-title">Try it now: Guided breathing</h3>
              
              <p className="live-orbit-description muted">
                Experience our visual breathing guide in action. Click &quot;Start Preview&quot; to see how the orb expands, 
                holds, and contracts — giving you predictable, sensory-friendly timing cues that match your breath.
              </p>

              {/* Live breathing visualization */}
              <LiveBreathingPreview />

              <div className="live-orbit-footer">
                <p className="live-orbit-footer-prompt">Want full sessions with audio guidance?</p>
                <div className="live-orbit-pointer-wrapper">
                  <span className="live-orbit-pointer-icon">👇</span>
                </div>
                <Link 
                  href="/breathing/breath" 
                  className="btn live-orbit-focus-btn"
                  role="button" 
                  aria-label="Explore all breathing techniques and full guided sessions"
                >
                  <span className="live-orbit-focus-icon">🫁</span>
                  <span className="live-orbit-focus-text">
                    <strong>Explore All Techniques</strong> — Full sessions with narration, timers &amp; progress tracking
                  </span>
                </Link>
              </div>
            </aside>
          </div>

          <div className="evidence-safety-notice">
            <p className="evidence-safety-text">
              <span className="evidence-safety-icon">⚠️</span>
              <span className="evidence-safety-content">
                <strong>Pause or stop any time.</strong> If breathing feels uncomfortable, return to natural 
                breathing and speak to a clinician for personalised advice.
              </span>
            </p>
          </div>

        </article>
      </div>
    </section>
  )
}
