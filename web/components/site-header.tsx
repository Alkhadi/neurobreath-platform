'use client'

/* eslint-disable jsx-a11y/aria-proptypes */
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X, LogIn, User, Share2 } from 'lucide-react'
import { getSession, signOut } from 'next-auth/react'
import { SITE_CONFIG } from '../lib/seo/site-seo'
import { ShareButton } from '@/components/share/ShareButton'
import { InstallButton } from '@/components/pwa/InstallButton'

const REGION_COOKIE = 'nb_region'

function getRegionPrefixFromCookie(): '/uk' | '/us' {
  if (typeof document === 'undefined') return '/uk'
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${REGION_COOKIE}=(uk|us)(?:;|$)`))
  return match?.[1] === 'us' ? '/us' : '/uk'
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }

    // Safari fallback
    media.addListener(update)
    return () => media.removeListener(update)
  }, [query])

  return matches
}

type FloatingNavMenuProps = {
  id: string
  triggerContent: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  placement?: 'bottom-start' | 'bottom-end'
  triggerClassName: string
  children: React.ReactNode
}

function FloatingNavMenu({
  id,
  triggerContent,
  open,
  setOpen,
  placement = 'bottom-start',
  triggerClassName,
  children,
}: FloatingNavMenuProps) {
  const isDesktop = useMediaQuery('(min-width: 1720px)')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (event: PointerEvent) => {
      const root = wrapperRef.current
      if (!root) return
      const target = event.target
      if (target instanceof Node && !root.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, setOpen])

  const referenceProps = {
    onClick: () => setOpen(!open),
  }

  const floatingPositionClass = placement === 'bottom-end' ? 'right-0' : 'left-0'

  return (
    <div ref={wrapperRef} className="nb-mega-menu-wrapper relative" data-menu={id}>
      {open ? (
        <button
          type="button"
          className={triggerClassName}
          aria-haspopup="dialog"
          aria-expanded="true"
          aria-controls={`${id}-menu`}
          data-expanded={open}
          {...referenceProps}
        >
          {triggerContent}
          <ChevronDown size={16} className="nb-chevron" />
        </button>
      ) : (
        <button
          type="button"
          className={triggerClassName}
          aria-haspopup="dialog"
          aria-expanded="false"
          data-expanded={open}
          {...referenceProps}
        >
          {triggerContent}
          <ChevronDown size={16} className="nb-chevron" />
        </button>
      )}

      {open && !isDesktop && (
        <div id={`${id}-menu`} className="nb-mega-menu nb-mega-menu--inline">
          {children}
        </div>
      )}

      {open && isDesktop && (
        <div
          id={`${id}-menu`}
          className={`nb-mega-menu nb-mega-menu--floating absolute top-full mt-2 z-50 ${floatingPositionClass}`}
          role="dialog"
          aria-modal="false"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null)
  const mobileClosingRef = useRef(false)
  const pathname = usePathname() || '/'
  const [regionPrefix, setRegionPrefix] = useState<'/uk' | '/us'>(pathname.startsWith('/us') ? '/us' : '/uk')
  const isMobile = useMediaQuery('(max-width: 1719px)')

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

  // Close menus on navigation
  useEffect(() => {
    setActiveMegaMenu(null)
    setMobileMenuOpen(false)
  }, [pathname])

  // Mobile drawer: trap focus, ESC-close, and scroll-lock
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!isMobile) return
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const getFocusable = () => {
      const nav = navRef.current
      if (!nav) return [] as HTMLElement[]

      const focusables = Array.from(
        nav.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      )

      return focusables.filter((el) => {
        const style = window.getComputedStyle(el)
        if (style.visibility === 'hidden' || style.display === 'none') return false
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      })
    }

    const focusFirst = () => {
      const focusables = getFocusable()
      focusables[0]?.focus()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        mobileClosingRef.current = true
        setActiveMegaMenu(null)
        setMobileMenuOpen(false)
        requestAnimationFrame(() => {
          mobileToggleRef.current?.focus()
          mobileClosingRef.current = false
        })
        return
      }

      if (e.key !== 'Tab') return

      const nav = navRef.current
      const focusables = getFocusable()

      if (!nav || focusables.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (!active || !nav.contains(active) || active === first) {
          e.preventDefault()
          last.focus()
        }
        return
      }

      if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const onFocusIn = (e: FocusEvent) => {
      if (mobileClosingRef.current) return
      const nav = navRef.current
      if (!nav) return
      const target = e.target as Node | null
      if (target && nav.contains(target)) return
      focusFirst()
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('focusin', onFocusIn, true)
    requestAnimationFrame(() => focusFirst())

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('focusin', onFocusIn, true)
    }
  }, [isMobile, mobileMenuOpen])

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

  const closeMegaMenu = () => {
    setActiveMegaMenu(null)
  }

  const closeMobileMenu = () => {
    mobileClosingRef.current = true
    setActiveMegaMenu(null)
    setMobileMenuOpen(false)
    requestAnimationFrame(() => {
      mobileToggleRef.current?.focus()
      mobileClosingRef.current = false
    })
  }

  const primaryNavContent = (
    <>
      {/* Conditions Mega Menu */}
      <FloatingNavMenu
        id="conditions"
        triggerContent={<>Conditions</>}
        open={activeMegaMenu === 'conditions'}
        setOpen={(open) => setActiveMegaMenu(open ? 'conditions' : null)}
        placement="bottom-start"
        triggerClassName={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'conditions' ? 'active' : ''}`}
      >
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
      </FloatingNavMenu>

      {/* Breathing & Focus Mega Menu */}
      <FloatingNavMenu
        id="breathing"
        triggerContent={<>Breathing &amp; Focus</>}
        open={activeMegaMenu === 'breathing'}
        setOpen={(open) => setActiveMegaMenu(open ? 'breathing' : null)}
        placement="bottom-start"
        triggerClassName={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'breathing' ? 'active' : ''}`}
      >
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
      </FloatingNavMenu>

      {/* Tools Mega Menu */}
      <FloatingNavMenu
        id="tools"
        triggerContent={<>Tools</>}
        open={activeMegaMenu === 'tools'}
        setOpen={(open) => setActiveMegaMenu(open ? 'tools' : null)}
        placement="bottom-start"
        triggerClassName={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'tools' ? 'active' : ''}`}
      >
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
            <h4 className="nb-mega-menu-heading">Games &amp; Challenges</h4>
            <Link href="/tools/breath-ladder" onClick={closeMegaMenu}>🪜 Breath Ladder</Link>
            <Link href="/tools/colour-path" onClick={closeMegaMenu}>🎨 Colour Path</Link>
            <Link href="/tools/focus-tiles" onClick={closeMegaMenu}>🧩 Focus Tiles</Link>
            <Link href="/tools/roulette" onClick={closeMegaMenu}>🎡 Micro-Reset Roulette</Link>
          </div>
        </div>
      </FloatingNavMenu>

      {/* About & Resources Mega Menu */}
      <FloatingNavMenu
        id="resources"
        triggerContent={<>Resources</>}
        open={activeMegaMenu === 'resources'}
        setOpen={(open) => setActiveMegaMenu(open ? 'resources' : null)}
        placement="bottom-start"
        triggerClassName={`nb-nav-link nb-nav-trigger ${activeMegaMenu === 'resources' ? 'active' : ''}`}
      >
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
            <Link href={`${regionPrefix}/resources/nb-card`} onClick={closeMegaMenu}>💳 NB-Card</Link>
            <Link href="/install" onClick={closeMegaMenu}>📲 Install / Share</Link>
          </div>
          <div className="nb-mega-menu-section">
            <h4 className="nb-mega-menu-heading">About</h4>
            <Link href={`${regionPrefix}/about`} onClick={closeMegaMenu}>ℹ️ About</Link>
            <Link href={`${regionPrefix}/trust`} onClick={closeMegaMenu}>🛡️ Trust Centre</Link>
            <Link href="/blog" onClick={closeMegaMenu}>📝 Blog</Link>
            <Link href="/contact" onClick={closeMegaMenu}>✉️ Contact</Link>
          </div>
        </div>
      </FloatingNavMenu>

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

    </>
  )

  const utilityNavContent = (
    <>

      {/* Share / Install */}
      <ShareButton
        variant="ghost"
        size="sm"
        className="nb-nav-link"
      >
        <>
          <Share2 size={18} />
          Share
        </>
      </ShareButton>

      <InstallButton variant="ghost" size="sm" className="nb-nav-link" label="Install" />

      {/* Authentication */}
      {userEmail ? (
        <div className="nb-user-menu">
          <FloatingNavMenu
            id="user"
            triggerContent={
              <>
                <User size={18} />
                {userEmail.split('@')[0]}
              </>
            }
            open={activeMegaMenu === 'user'}
            setOpen={(open) => setActiveMegaMenu(open ? 'user' : null)}
            placement="bottom-end"
            triggerClassName="nb-nav-link nb-user-button"
          >
            <div className="nb-user-dropdown">
              <Link href={`${regionPrefix}/my-account`} className="nb-user-dropdown-item" onClick={closeMegaMenu}>
                👤 My Account
              </Link>
              <button
                type="button"
                className="nb-user-dropdown-item nb-user-dropdown-item--danger"
                onClick={async () => {
                  setIsSigningOut(true)
                  await signOut({ callbackUrl: regionPrefix })
                }}
                disabled={isSigningOut}
              >
                🚪 {isSigningOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </FloatingNavMenu>
        </div>
      ) : (
        <Link
          href={`${regionPrefix}/login`}
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
    </>
  )

  const navContent = (
    <>
      {primaryNavContent}
      {utilityNavContent}
    </>
  )

  return (
    <>
      <header className="nb-header">
        <div className="nb-header-container">
          <Link
            href={regionPrefix}
            className="nb-brand"
            id="brandLink"
            onClick={closeMegaMenu}
            aria-label={`NeuroBreath — ${SITE_CONFIG.siteSlogan}`}
          >
            <span className="nb-brand-tile">
              <span className="nb-brand-mark">
                <Image
                  src="/icons/neurobreath-logo-square-128.png"
                  alt="NeuroBreath"
                  width={56}
                  height={56}
                  className="nb-brand-logo"
                  priority
                />
              </span>
            </span>
            <span className="nb-brand-copy">
              <span className="nb-brand-text">NeuroBreath</span>
              <span className="nb-brand-tagline">{SITE_CONFIG.siteSlogan}</span>
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          {mobileMenuOpen ? (
            <button
              ref={mobileToggleRef}
              type="button"
              className="nb-mobile-toggle"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              aria-controls="mainNav"
              aria-expanded="true"
              data-expanded={mobileMenuOpen}
            >
              <X size={24} />
            </button>
          ) : (
            <button
              ref={mobileToggleRef}
              type="button"
              className="nb-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-controls="mainNav"
              aria-expanded="false"
              data-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
          )}

          {/* Desktop Navigation — stays inside header (no backdrop-filter containment issue on desktop) */}
          {!isMobile && (
            <nav ref={navRef} className="nb-main-nav" id="mainNav" role="navigation" aria-label="Primary">
              <div className="nb-main-nav-primary">{primaryNavContent}</div>
              <div className="nb-main-nav-secondary">{utilityNavContent}</div>
            </nav>
          )}
        </div>

        {/* Desktop mega-menu backdrop */}
        {activeMegaMenu && !isMobile && (
          <div
            className="nb-mega-menu-backdrop"
            onClick={closeMegaMenu}
            aria-hidden="true"
          />
        )}
      </header>

      {/*
        Mobile overlay + drawer rendered OUTSIDE <header>.
        This prevents the header's backdrop-filter from creating a containing block
        that traps fixed descendants, which caused the drawer to appear behind hero content.
      */}
      {isMobile && (
        <>
          {/* Dimmed overlay — covers page content, sits below header (z-[100] < header z-[1000]) */}
          <div
            aria-hidden="true"
            className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMobileMenu}
          />

          {/* Drawer panel — right-side, above overlay (z-[110]) */}
          {mobileMenuOpen ? (
            <nav
              ref={navRef}
              className="nb-main-nav nb-main-nav--open"
              id="mainNav"
              role="navigation"
              aria-label="Primary"
              aria-hidden="false"
            >
              {navContent}
            </nav>
          ) : (
            <nav
              ref={navRef}
              className="nb-main-nav"
              id="mainNav"
              role="navigation"
              aria-label="Primary"
              aria-hidden="true"
            >
              {navContent}
            </nav>
          )}
        </>
      )}
    </>
  )
}
