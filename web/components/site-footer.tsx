'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RegionSwitcher } from '@/components/trust/RegionSwitcher'
import { usePathname } from 'next/navigation'

export function SiteFooter() {
  const [currentYear, setCurrentYear] = useState(2025)
  const pathname = usePathname() || '/'
  const regionPrefix = pathname.startsWith('/us') ? '/us' : '/uk'

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="site-footer" id="siteFooter" role="contentinfo">
      {/* Footer navigation - Full Width */}
      <div className="ft-nav-wrapper">
        <div className="ft-nav-inner">
          {/* Brand + Support in Navigation Area */}
          <div className="ft-nav-brand">
            <Link className="ft-logo" href="/" aria-label="Return to NeuroBreath homepage">
              <Image 
                src="/icons/neurobreath-logo-square-64.png" 
                alt="NeuroBreath logo" 
                width={64}
                height={64}
                priority={false}
              />
            </Link>
            <Link href="/support-us" className="btn" aria-label="Support NeuroBreath">
              <span aria-hidden="true">☕</span> Support Us
            </Link>
          </div>
          <nav className="ft-nav" aria-label="Footer navigation">
            <details className="ft-group">
              <summary>
                <span>Conditions</span>
                <span aria-hidden="true">▾</span>
              </summary>
              <div className="links">
                <p>
                  <Link href="/conditions/autism">Autism</Link> ·{' '}
                  <Link href="/conditions/autism-parent">Autism Parent</Link> ·{' '}
                  <Link href="/conditions/autism-teacher">Autism Teacher</Link> ·{' '}
                  <Link href="/conditions/autism-carer">Autism Carers</Link>
                </p>
                <p>
                  <Link href="/adhd">ADHD</Link> ·{' '}
                  <Link href="/conditions/adhd-parent">ADHD Parent</Link> ·{' '}
                  <Link href="/conditions/adhd-teacher">ADHD Teacher</Link> ·{' '}
                  <Link href="/conditions/adhd-carer">ADHD Carers</Link>
                </p>
                <p>
                  <Link href="/conditions/dyslexia">Dyslexia Hub</Link> ·{' '}
                  <Link href="/conditions/dyslexia-parent">Dyslexia Parent</Link> ·{' '}
                  <Link href="/conditions/dyslexia-teacher">Dyslexia Teacher</Link> ·{' '}
                  <Link href="/conditions/dyslexia-carer">Dyslexia Carers</Link> ·{' '}
                  <Link href="/dyslexia-reading-training">Dyslexia Training</Link>
                </p>
                <p>
                  <Link href="/conditions/anxiety">Anxiety</Link> ·{' '}
                  <Link href="/conditions/depression">Depression</Link> ·{' '}
                  <Link href="/stress">Stress</Link> ·{' '}
                  <Link href="/sleep">Sleep</Link>
                </p>
              </div>
            </details>
            <details className="ft-group">
              <summary>
                <span>Breathing &amp; Focus</span>
                <span aria-hidden="true">▾</span>
              </summary>
              <div className="links">
                <p>
                  <Link href="/breathing/breath">Breath (how-to)</Link> ·{' '}
                  <Link href="/breathing/focus">Focus</Link> ·{' '}
                  <Link href="/breathing/mindfulness">Mindfulness</Link>
                </p>
                <p>
                  <Link href="/techniques/sos">60-second Reset</Link> ·{' '}
                  <Link href="/techniques/box-breathing">Box Breathing</Link> ·{' '}
                  <Link href="/techniques/4-7-8">4-7-8 Breathing</Link> ·{' '}
                  <Link href="/techniques/coherent">Coherent 5-5</Link>
                </p>
              </div>
            </details>
            <details className="ft-group">
              <summary>Toolkits <span aria-hidden="true">▾</span></summary>
              <div className="links">
                <p>
                  <Link href="/tools/sleep-tools">Sleep Tools</Link> ·{' '}
                  <Link href="/tools/breath-tools">Breath Tools</Link> ·{' '}
                  <Link href="/tools/mood-tools">Mood Tools</Link> ·{' '}
                  <Link href="/tools/adhd-tools">ADHD Tools</Link> ·{' '}
                  <Link href="/tools/autism-tools">Autism Tools</Link> ·{' '}
                  <Link href="/tools/anxiety-tools">Anxiety Tools</Link> ·{' '}
                  <Link href="/tools/stress-tools">Stress Tools</Link>
                </p>
              </div>
            </details>
            <details className="ft-group">
              <summary>
                <span>Symptom Guides</span>
                <span aria-hidden="true">▾</span>
              </summary>
              <div className="links">
                <p>
                  <Link href="/conditions/anxiety">Stress &amp; General Anxiety</Link> ·{' '}
                  <Link href="/conditions/anxiety">Panic Symptoms</Link> ·{' '}
                  <Link href="/sleep">Sleep-Onset Insomnia</Link>
                </p>
                <p>
                  <Link href="/conditions/anxiety">Focus &amp; Test Anxiety</Link> ·{' '}
                  <Link href="/conditions/anxiety">PTSD Regulation*</Link> ·{' '}
                  <Link href="/conditions/low-mood-burnout">Low Mood &amp; Burnout</Link>
                </p>
              </div>
            </details>
            <details className="ft-group">
              <summary>About <span aria-hidden="true">▾</span></summary>
              <div className="links">
                <p>
                  <Link href={`${regionPrefix}/about`}>About</Link> ·{' '}
                  <Link href="/support-us">Support Us</Link> ·{' '}
                  <Link href="/contact">Contact</Link>
                </p>
              </div>
            </details>
            <details className="ft-group">
              <summary>Trust &amp; Safety <span aria-hidden="true">▾</span></summary>
              <div className="links">
                <p>
                  <Link href={`${regionPrefix}/trust`}>Trust Centre</Link> ·{' '}
                  <Link href={`${regionPrefix}/trust/disclaimer`}>Disclaimer</Link> ·{' '}
                  <Link href={`${regionPrefix}/trust/evidence-policy`}>Evidence Policy</Link>
                </p>
                <p>
                  <Link href={`${regionPrefix}/trust/accessibility`}>Accessibility</Link> ·{' '}
                  <Link href={`${regionPrefix}/trust/editorial-standards`}>Editorial standards</Link> ·{' '}
                  <Link href={`${regionPrefix}/trust/privacy`}>Privacy</Link> ·{' '}
                  <Link href={`${regionPrefix}/trust/terms`}>Terms</Link> ·{' '}
                  <Link href={`${regionPrefix}/trust/contact`}>Report a concern</Link>
                </p>
              </div>
            </details>
          </nav>
        </div>
      </div>

      <div className="inner">
        <div className="ft-bottom">
          <div className="ft-bottom__copy">
            <p className="muted ft-bottom__text">
              <strong>Educational information only.</strong> Not medical advice. NeuroBreath is a free resource. ©{' '}
              <time dateTime={currentYear.toString()} id="yearFooter">{currentYear}</time> NeuroBreath. All rights reserved.
            </p>
            <div className="mt-3">
              <RegionSwitcher />
            </div>
          </div>
          <button 
            type="button" 
            className="btn back-to-top-btn" 
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            title="Back to top"
          >
            <span className="back-to-top__label">Back to top</span>
            <span className="back-to-top__icon" aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
