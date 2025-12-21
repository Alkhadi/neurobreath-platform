'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10">
                <Image src="/favicon.svg" alt="NeuroBreath Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-semibold text-gray-900">NeuroBreath</span>
            </Link>
            <p className="text-sm text-gray-600">Clinically referenced, neuro-inclusive breathing techniques for calm, focus, and emotional regulation.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link href="/progress" className="text-gray-600 hover:text-gray-900">Progress Dashboard</Link></li>
              <li><Link href="/rewards" className="text-gray-600 hover:text-gray-900">Rewards & Badges</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
            </ul>
          </div>

          {/* Techniques */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Techniques</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/techniques/box-breathing" className="text-gray-600 hover:text-gray-900">Box Breathing</Link></li>
              <li><Link href="/techniques/4-7-8" className="text-gray-600 hover:text-gray-900">4-7-8 Breathing</Link></li>
              <li><Link href="/techniques/coherent" className="text-gray-600 hover:text-gray-900">Coherent 5-5</Link></li>
              <li><Link href="/techniques/sos" className="text-gray-600 hover:text-gray-900">60-second SOS</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Educational information only. Not medical advice. © {currentYear} NeuroBreath. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
