'use client'

/* eslint-disable jsx-a11y/aria-proptypes */
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X, LogIn, User } from 'lucide-react'
import { getSession, signOut } from 'next-auth/react'
import { SITE_CONFIG } from '../lib/seo/site-seo'

const REGION_COOKIE = 'nb_region'

function getRegionPrefixFromCookie(): '/uk' | '/us' {
  if (typeof document === 'undefined') return '/uk'
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${REGION_COOKIE}=(uk|us)(?:;|$)`))
  return match?.[1] === 'us' ? '/us' : '/uk'
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname() || '/'
  const [regionPrefix, setRegionPrefix] = useState<'/uk' | '/us'>(pathname.startsWith('/us') ? '/us' : '/uk')

  useEffect(() => {
    if (pathname.startsWith('/us')) {
      setRegionPrefix('/us')
      return
    }
    if (pathname.startsWith('/uk')) {
      setRegionPrefix('/uk')
      return
    }
    setRegionPrefix(getRegionPrefixFromCookie())
  }, [pathname])

  // Check auth status on mount
  useEffect(() => {
    getSession()
      .then((session) => {
        setUserEmail(session?.user?.email || null)
      })
      .catch(() => {
        setUserEmail(null)
      })
  }, [])

  const toggleMegaMenu = (menuName: string) => {
    setActiveMegaMenu(activeMegaMenu === menuName ? null : menuName)
  }

  const closeMegaMenu = () => {
    setActiveMegaMenu(null)
  }

  return (
    <header className="nb-header">
      <div className="nb-header-container">
        <Link
          href={regionPrefix}
          className="nb-brand"
          id="brandLink"
          onClick={closeMegaMenu}
          aria-label={`NeuroBreath — ${SITE_CONFIG.siteSlogan}`}
        >
          <span className="nb-brand-mark">
            <Image
              src="/icons/neurobreath-logo-square-128.png"
              alt="NeuroBreath"
              width={36}
              height={36}
              className="nb-brand-logo"
              priority
            />
          </span>
          <span className="nb-brand-copy">
            <span className="nb-brand-text">NeuroBreath</span>
            <span className="nb-brand-tagline">{SITE_CONFIG.siteSlogan}</span>
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="nb-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          data-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Main Navigation */}
        <nav 
          className={`nb-main-nav ${mobileMenuOpen ? 'nb-main-nav--open' : ''}`}
          id="mainNav" 
          role="navigation" 
          aria-label="Primary"
        >
          {/* Conditions Mega Menu */}
          <div className="nb-mega-menu-wrapper">
            <button 
              type="button" 
              className={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'conditions' ? 'active' : ''}`}
              aria-haspopup="true"
              data-expanded={activeMegaMenu === 'conditions'}
              onClick={() => toggleMegaMenu('conditions')}
            >
              Conditions
              <ChevronDown size={16} className="nb-chevron" />
            </button>
            {activeMegaMenu === 'conditions' && (
              <div className="nb-mega-menu">
                <div className="nb-mega-menu-content">
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Neurodevelopmental</h4>
                    <Link href="/conditions/autism" onClick={closeMegaMenu}>🧩 Autism</Link>
                    <Link href="/conditions/autism-parent" onClick={closeMegaMenu}>👨‍👩‍👧 Autism Parent Support</Link>
                    <Link href="/conditions/autism-teacher" onClick={closeMegaMenu}>🎓 Autism Teacher Support</Link>
                    <Link href="/conditions/autism-carer" onClick={closeMegaMenu}>❤️ Autism Carers Support</Link>
                    <Link href="/adhd" onClick={closeMegaMenu}>🎯 ADHD</Link>
                    <Link href="/conditions/adhd-parent" onClick={closeMegaMenu}>👨‍👩‍👧 ADHD Parent Support</Link>
                    <Link href="/conditions/adhd-teacher" onClick={closeMegaMenu}>🎓 ADHD Teacher Support</Link>
                    <Link href="/conditions/adhd-carer" onClick={closeMegaMenu}>❤️ ADHD Carers Support</Link>
                    <Link href="/conditions/dyslexia" onClick={closeMegaMenu}>📖 Dyslexia Hub</Link>
                    <Link href="/conditions/dyslexia-parent" onClick={closeMegaMenu}>👨‍👩‍👧 Dyslexia Parent Support</Link>
                    <Link href="/conditions/dyslexia-teacher" onClick={closeMegaMenu}>🎓 Dyslexia Teacher Support</Link>
                    <Link href="/conditions/dyslexia-carer" onClick={closeMegaMenu}>❤️ Dyslexia Carers Support</Link>
                    <Link href="/dyslexia-reading-training" onClick={closeMegaMenu}>📚 Dyslexia Reading Training</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Mental Health</h4>
                    <Link href="/conditions/anxiety" onClick={closeMegaMenu}>😰 Anxiety</Link>
                    <Link href="/conditions/anxiety-parent" onClick={closeMegaMenu}>👨‍👩‍👧 Anxiety Parent Support</Link>
                    <Link href="/conditions/anxiety-carer" onClick={closeMegaMenu}>❤️ Anxiety Carers Support</Link>
                    <Link href="/conditions/depression" onClick={closeMegaMenu}>💙 Depression</Link>
                    <Link href="/conditions/bipolar" onClick={closeMegaMenu}>⚡ Bipolar</Link>
                    <Link href="/conditions/ptsd" onClick={closeMegaMenu}>🛡️ PTSD / Trauma</Link>
                    <Link href="/stress" onClick={closeMegaMenu}>😓 Stress</Link>
                    <Link href="/sleep" onClick={closeMegaMenu}>💤 Sleep Issues</Link>
                    <Link href="/conditions/low-mood-burnout" onClick={closeMegaMenu}>🌧️ Low Mood & Burnout</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Breathing & Focus Mega Menu */}
          <div className="nb-mega-menu-wrapper">
            <button 
              type="button" 
              className={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'breathing' ? 'active' : ''}`}
              aria-haspopup="true"
              data-expanded={activeMegaMenu === 'breathing'}
              onClick={() => toggleMegaMenu('breathing')}
            >
              Breathing &amp; Focus
              <ChevronDown size={16} className="nb-chevron" />
            </button>
            {activeMegaMenu === 'breathing' && (
              <div className="nb-mega-menu">
                <div className="nb-mega-menu-content">
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Guides</h4>
                    <Link href="/breathing/breath" onClick={closeMegaMenu}>🫁 Breath (how-to)</Link>
                    <Link href="/breathing/focus" onClick={closeMegaMenu}>🎯 Focus</Link>
                    <Link href="/breathing/mindfulness" onClick={closeMegaMenu}>🧘 Mindfulness</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Techniques</h4>
                    <Link href="/techniques/sos" onClick={closeMegaMenu}>🆘 60-second SOS</Link>
                    <Link href="/techniques/box-breathing" onClick={closeMegaMenu}>🟩 Box Breathing</Link>
                    <Link href="/techniques/4-7-8" onClick={closeMegaMenu}>🟦 4-7-8 Breathing</Link>
                    <Link href="/techniques/coherent" onClick={closeMegaMenu}>🟪 Coherent 5-5</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Training</h4>
                    <Link href="/breathing/training/focus-garden" onClick={closeMegaMenu}>🌱 Focus Garden</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tools Mega Menu */}
          <div className="nb-mega-menu-wrapper">
            <button 
              type="button" 
              className={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'tools' ? 'active' : ''}`}
              aria-haspopup="true"
              data-expanded={activeMegaMenu === 'tools'}
              onClick={() => toggleMegaMenu('tools')}
            >
              Tools
              <ChevronDown size={16} className="nb-chevron" />
            </button>
            {activeMegaMenu === 'tools' && (
              <div className="nb-mega-menu">
                <div className="nb-mega-menu-content">
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Condition-Specific</h4>
                    <Link href="/tools/adhd-tools" onClick={closeMegaMenu}>🎯 ADHD Tools</Link>
                    <Link href="/tools/autism-tools" onClick={closeMegaMenu}>🧩 Autism Tools</Link>
                    <Link href="/tools/anxiety-tools" onClick={closeMegaMenu}>😰 Anxiety Tools</Link>
                    <Link href="/tools/stress-tools" onClick={closeMegaMenu}>😓 Stress Tools</Link>
                    <Link href="/tools/depression-tools" onClick={closeMegaMenu}>💙 Depression Tools</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">General Tools</h4>
                    <Link href="/tools/breath-tools" onClick={closeMegaMenu}>🫁 Breath Tools</Link>
                    <Link href="/tools/mood-tools" onClick={closeMegaMenu}>🌈 Mood Tools</Link>
                    <Link href="/tools/sleep-tools" onClick={closeMegaMenu}>💤 Sleep Tools</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Games & Challenges</h4>
                    <Link href="/tools/breath-ladder" onClick={closeMegaMenu}>🪜 Breath Ladder</Link>
                    <Link href="/tools/colour-path" onClick={closeMegaMenu}>🎨 Colour Path</Link>
                    <Link href="/tools/focus-tiles" onClick={closeMegaMenu}>🧩 Focus Tiles</Link>
                    <Link href="/tools/roulette" onClick={closeMegaMenu}>🎡 Micro-Reset Roulette</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About & Resources Mega Menu */}
          <div className="nb-mega-menu-wrapper">
            <button 
              type="button" 
              className={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'resources' ? 'active' : ''}`}
              aria-haspopup="true"
              data-expanded={activeMegaMenu === 'resources'}
              onClick={() => toggleMegaMenu('resources')}
            >
              Resources
              <ChevronDown size={16} className="nb-chevron" />
            </button>
            {activeMegaMenu === 'resources' && (
              <div className="nb-mega-menu">
                <div className="nb-mega-menu-content">
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">For Educators</h4>
                    <Link href="/schools" onClick={closeMegaMenu}>🏫 For Schools</Link>
                    <Link href="/teacher-quick-pack" onClick={closeMegaMenu}>📦 Teacher Quick Pack</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">Downloads</h4>
                    <Link href="/downloads" onClick={closeMegaMenu}>📥 Downloadable Resources</Link>
                    <Link href="/resources" onClick={closeMegaMenu}>📚 Resource Library</Link>
                  </div>
                  <div className="nb-mega-menu-section">
                    <h4 className="nb-mega-menu-heading">About</h4>
                    <Link href={`${regionPrefix}/about`} onClick={closeMegaMenu}>ℹ️ About</Link>
                    <Link href={`${regionPrefix}/trust`} onClick={closeMegaMenu}>🛡️ Trust Centre</Link>
                    <Link href="/blog" onClick={closeMegaMenu}>📝 Blog</Link>
                    <Link href="/contact" onClick={closeMegaMenu}>✉️ Contact</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress & Dashboard */}
          <Link href="/progress" className="nb-nav-link" onClick={closeMegaMenu}>
            📊 Progress
          </Link>

          {/* My Plan */}
          <Link href="/my-plan" className="nb-nav-link" onClick={closeMegaMenu}>
            📋 My Plan
          </Link>

          {/* Settings */}
          <Link href="/settings" className="nb-nav-link" onClick={closeMegaMenu}>
            ⚙️ Settings
          </Link>

          {/* Authentication */}
          {userEmail ? (
            <div className="nb-user-menu">
              <button
                type="button"
                className="nb-nav-link nb-user-button"
                onClick={() => setActiveMegaMenu(activeMegaMenu === 'user' ? null : 'user')}
                aria-haspopup="true"
                data-expanded={activeMegaMenu === 'user'}
              >
                <User size={18} />
                {userEmail.split('@')[0]}
                <ChevronDown size={16} className="nb-chevron" />
              </button>
              {activeMegaMenu === 'user' && (
                <div className="nb-user-dropdown">
                  <Link 
                    href="/uk/my-account" 
                    className="nb-user-dropdown-item"
                    onClick={closeMegaMenu}
                  >
                    👤 My Account
                  </Link>
                  <button
                    type="button"
                    className="nb-user-dropdown-item nb-user-dropdown-item--danger"
                    onClick={async () => {
                      setIsSigningOut(true)
                      await signOut({ callbackUrl: '/' })
                    }}
                    disabled={isSigningOut}
                  >
                    🚪 {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/uk/login" 
              className="nb-nav-link nb-login-link"
              onClick={closeMegaMenu}
            >
              <LogIn size={18} />
              Sign in
            </Link>
          )}

          {/* Get Started Button */}
          <Link href="/get-started" className="nb-nav-cta" onClick={closeMegaMenu}>
            Get Started
          </Link>
        </nav>
      </div>

      {/* Mega Menu Backdrop */}
      {activeMegaMenu && (
        <div 
          className="nb-mega-menu-backdrop" 
          onClick={closeMegaMenu}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
