'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName)
  }

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link href="/" className="brand" id="brandLink">
          <Image 
            src="/icons/neurobreath-logo-square-64.png" 
            alt="NeuroBreath Logo" 
            width={64} 
            height={64} 
            className="logo" 
          />
          <span className="brand-text">NeuroBreath</span>
        </Link>

        <nav className="main-nav" id="mainNav" role="navigation" aria-label="Primary">
          {/* Conditions Menu */}
          <div className="menu-group">
            <button 
              type="button" 
              className="menu-toggle" 
              aria-expanded={activeDropdown === 'conditions'}
              onClick={() => toggleDropdown('conditions')}
            >
              Conditions ▾
            </button>
            <div className="submenu">
              <div className="menu-label" aria-hidden="true">Neurodevelopmental</div>
              <Link href="/conditions/autism">Autism</Link>
              <Link href="/conditions/autism-parent">Autism Parent</Link>
              <Link href="/adhd">ADHD</Link>
              <Link href="/dyslexia-reading-training">Dyslexia</Link>
              <div className="menu-label" aria-hidden="true">Mental Health</div>
              <Link href="/conditions/anxiety">Anxiety</Link>
              <Link href="/conditions/depression">Depression</Link>
              <Link href="/stress">Stress</Link>
              <Link href="/sleep">Sleep</Link>
            </div>
          </div>

          {/* Breathing & Focus Menu */}
          <div className="menu-group">
            <button 
              type="button" 
              className="menu-toggle" 
              aria-expanded={activeDropdown === 'breathing'}
              onClick={() => toggleDropdown('breathing')}
            >
              Breathing &amp; Focus ▾
            </button>
            <div className="submenu">
              <div className="menu-label" aria-hidden="true">Guides</div>
              <Link href="/breathing/breath">Breath (how-to)</Link>
              <Link href="/breathing/focus">Focus</Link>
              <Link href="/breathing/mindfulness">Mindfulness</Link>
              <div className="menu-label" aria-hidden="true">Techniques</div>
              <Link href="/techniques/sos">🆘 60-second SOS</Link>
              <Link href="/techniques/box-breathing">🟩 Box Breathing</Link>
              <Link href="/techniques/4-7-8">🟦 4-7-8 Breathing</Link>
              <Link href="/techniques/coherent">🟪 Coherent 5-5</Link>
            </div>
          </div>

          {/* Tools Menu */}
          <div className="menu-group">
            <button 
              type="button" 
              className="menu-toggle" 
              aria-expanded={activeDropdown === 'tools'}
              onClick={() => toggleDropdown('tools')}
            >
              Tools ▾
            </button>
            <div className="submenu">
              <Link href="/tools/sleep-tools">Sleep Tools</Link>
              <Link href="/tools/breath-tools">Breath Tools</Link>
              <Link href="/tools/mood-tools">Mood Tools</Link>
              <Link href="/tools/adhd-tools">ADHD Tools</Link>
              <Link href="/tools/autism-tools">Autism Tools</Link>
              <Link href="/tools/anxiety-tools">Anxiety Tools</Link>
              <Link href="/tools/stress-tools">Stress Tools</Link>
              <Link href="/breathing/training/focus-garden">🌱 Focus Training</Link>
              <div className="menu-label" aria-hidden="true">Progress &amp; Rewards</div>
              <Link href="/progress">📊 Progress Dashboard</Link>
              <Link href="/rewards">🏆 Rewards &amp; Badges</Link>
              <div className="menu-label" aria-hidden="true">Symptom Guides</div>
              <Link href="/conditions/anxiety">Stress &amp; General Anxiety</Link>
              <Link href="/conditions/anxiety">Panic Symptoms</Link>
              <Link href="/sleep">Sleep-Onset Insomnia</Link>
              <Link href="/conditions/anxiety">Focus &amp; Test Anxiety</Link>
              <Link href="/conditions/anxiety">PTSD Regulation*</Link>
              <Link href="/conditions/low-mood-burnout">Low Mood &amp; Burnout</Link>
            </div>
          </div>

          {/* About Menu */}
          <div className="menu-group">
            <button 
              type="button" 
              className="menu-toggle" 
              aria-expanded={activeDropdown === 'about'}
              onClick={() => toggleDropdown('about')}
            >
              About ▾
            </button>
            <div className="submenu">
              <Link href="/about-us">About</Link>
              <Link href="/aims-objectives">Aims &amp; Stories</Link>
              <Link href="/support-us">Support Us</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </nav>

        <button 
          type="button" 
          id="navToggle" 
          className="nav-toggle" 
          aria-label="Menu" 
          aria-expanded={mobileMenuOpen}
          aria-controls="mainNav"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <Link href="#" className="nb-quest-pass-pill" id="questPassPill">
          <span className="nb-quest-pass-pill__icon">🎯</span>
          <span className="nb-quest-pass-pill__quests">0/3 quests</span>
          <span className="nb-quest-pass-pill__points">0 pts</span>
        </Link>
      </div>
    </header>
  )
}
