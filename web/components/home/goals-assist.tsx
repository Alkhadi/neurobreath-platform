'use client'

import Link from 'next/link'

export function GoalsAssist() {
  return (
    <article className="card home-goals-card" id="vp-home-goals">
      <div className="goals-card-header">
        <h3>Pick your goal</h3>
        <p className="muted goals-card-subtitle">
          Choose a goal to tailor cues, pace, and downloadable guides.
        </p>
      </div>

      <div className="goals-grid">
        <Link href="/stress" className="btn">
          Calm
        </Link>
        <Link href="/sleep" className="btn">
          Sleep
        </Link>
        <Link href="/breathing/focus" className="btn">
          Focus
        </Link>
        <Link href="/teacher-quick-pack" className="btn">
          School
        </Link>
        <Link href="/conditions/mood" className="btn">
          Mood
        </Link>
      </div>

      <div className="goals-timing">
        <h4 className="goals-timing__title">How long do you have?</h4>
        <div className="actions goals-timing__actions">
          <Link href="/techniques/sos" className="btn">
            1 minute
          </Link>
          <Link href="/techniques/box-breathing" className="btn">
            3 minutes
          </Link>
          <Link href="/techniques/coherent" className="btn">
            5 minutes
          </Link>
        </div>
      </div>

      <section className="goals-assist-compact" aria-labelledby="goals-assist-title">
        <h4 id="goals-assist-title" className="goals-assist-compact__title">
          Built for neurodiversity
        </h4>
        <ul className="goals-assist-compact__list">
          <li>Clear language, optional visuals, OT-aligned timings</li>
          <li>Alternative cues for sensory-sensitive learners</li>
          <li>Accessible contrast &amp; keyboard-first controls</li>
          <li>Evidence citations across every technique</li>
        </ul>
      </section>
    </article>
  )
}
