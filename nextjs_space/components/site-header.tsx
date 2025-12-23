'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'

export default function SiteHeader() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              🫁
            </div>
            <span className="text-xl font-semibold text-gray-900">NeuroBreath</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4" role="navigation" aria-label="Primary">
            <Link 
              href="/" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/dyslexia-reading-training" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              📖 Dyslexia Reading Training
            </Link>
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
              <Link 
                href="/" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => setIsNavOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/dyslexia-reading-training" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md" 
                onClick={() => setIsNavOpen(false)}
              >
                📖 Dyslexia Reading Training
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
