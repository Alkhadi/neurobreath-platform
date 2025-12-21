'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'

export default function SiteHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10">
              <Image src="/favicon.svg" alt="NeuroBreath Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-semibold text-gray-900">NeuroBreath</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Primary">
            {/* Conditions Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onMouseEnter={() => setOpenMenu('conditions')}
                onClick={() => toggleMenu('conditions')}
              >
                Conditions ▾
              </button>
              {openMenu === 'conditions' && (
                <div
                  className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Neurodevelopmental</div>
                  <Link href="/autism" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Autism</Link>
                  <Link href="/adhd" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ADHD</Link>
                  <Link href="/dyslexia-reading-training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">📖 Dyslexia Reading Training</Link>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase mt-2">Mental Health</div>
                  <Link href="/anxiety" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Anxiety</Link>
                  <Link href="/stress" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Stress</Link>
                  <Link href="/sleep" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sleep</Link>
                </div>
              )}
            </div>

            {/* Breathing & Focus Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onMouseEnter={() => setOpenMenu('breathing')}
                onClick={() => toggleMenu('breathing')}
              >
                Breathing & Focus ▾
              </button>
              {openMenu === 'breathing' && (
                <div
                  className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Techniques</div>
                  <Link href="/techniques/box-breathing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🟩 Box Breathing</Link>
                  <Link href="/techniques/4-7-8" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🟦 4-7-8 Breathing</Link>
                  <Link href="/techniques/coherent" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🟪 Coherent 5-5</Link>
                  <Link href="/techniques/sos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🆘 60-second SOS</Link>
                </div>
              )}
            </div>

            {/* Tools Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onMouseEnter={() => setOpenMenu('tools')}
                onClick={() => toggleMenu('tools')}
              >
                Tools ▾
              </button>
              {openMenu === 'tools' && (
                <div
                  className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link href="/tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Tools</Link>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase mt-2">Progress</div>
                  <Link href="/progress" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">📊 Progress Dashboard</Link>
                  <Link href="/rewards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🏆 Rewards & Badges</Link>
                </div>
              )}
            </div>

            {/* About Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onMouseEnter={() => setOpenMenu('about')}
                onClick={() => toggleMenu('about')}
              >
                About ▾
              </button>
              {openMenu === 'about' && (
                <div
                  className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About</Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact</Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-label="Menu"
            aria-expanded={isNavOpen}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isNavOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 px-4">
            <div className="space-y-2">
              <Link href="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>Home</Link>
              <Link href="/autism" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>Autism</Link>
              <Link href="/adhd" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>ADHD</Link>
              <Link href="/dyslexia-reading-training" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>📖 Dyslexia Reading Training</Link>
              <Link href="/anxiety" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>Anxiety</Link>
              <Link href="/techniques/box-breathing" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>🟩 Box Breathing</Link>
              <Link href="/progress" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>📊 Progress</Link>
              <Link href="/rewards" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>🏆 Rewards</Link>
              <Link href="/about" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsNavOpen(false)}>About</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
