'use client'

import Link from 'next/link'

export function PracticeCredibility() {
  return (
    <section className="practice-credibility-compact">
      <h4 className="practice-credibility__title">Clinical backing &amp; credibility</h4>
      <div className="practice-credibility__compact-grid">
        <div className="practice-credibility__compact-item">
          <strong className="practice-credibility__label">Informed by experts</strong>
          <p className="practice-credibility__text">
            <a 
              href="https://bhi.org/our-founder" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Dr Herbert Benson
            </a>
            {' (Harvard) · '}
            <a 
              href="https://www.healthline.com/health/4-7-8-breathing" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Dr Andrew Weil
            </a>
            {' (4-7-8)'}
          </p>
        </div>
        <div className="practice-credibility__compact-item">
          <strong className="practice-credibility__label">Public guidance</strong>
          <p className="practice-credibility__text">
            <a 
              href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              NHS (UK)
            </a>
            {' · '}
            <a 
              href="https://www.va.gov/health-care/health-needs-conditions/mental-health/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              U.S. VA
            </a>
            {' · '}
            <a 
              href="https://hms.harvard.edu/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Harvard
            </a>
            {' · '}
            <a 
              href="https://www.mayoclinic.org/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Mayo Clinic
            </a>
          </p>
        </div>
        <div className="practice-credibility__compact-item">
          <strong className="practice-credibility__label">Evidence</strong>
          <p className="practice-credibility__text">
            Navy SEAL teams use box breathing for focus (
            <a 
              href="https://psychcentral.com/health/box-breathing" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              PsychCentral
            </a>
            ). 2024 trial: <strong>99.2%</strong> breathing effectiveness improvement (
            <a 
              href="https://www.healthline.com/health/box-breathing" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Healthline
            </a>
            ).
          </p>
        </div>
      </div>
    </section>
  )
}
