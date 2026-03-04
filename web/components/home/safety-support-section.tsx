'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Heart, Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// Hoisted outside component to satisfy react/require-constant
const shareButtons = [
  { id: 'twitter', label: 'Twitter', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
  { id: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
  { id: 'email', label: 'Email', color: 'bg-slate-500 hover:bg-slate-600' }
]

export default function SafetySupportSection() {
  const [copied, setCopied] = useState(false)

  const handleShare = async (platform: string) => {
    const url = 'https://neurobreath.co.uk'
    const text = 'NeuroBreath: Free breathing & mindfulness tools for neurodivergent people. Evidence-based, neuro-inclusive, and privacy-first.'

    if (platform === 'whatsapp') {
      const whatsappText = `NeuroBreath — free breathing tools: ${url}`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        try {
          await navigator.share({ title: 'NeuroBreath', text: whatsappText })
          toast.success('Shared successfully!')
          return
        } catch {
          // Fallback to wa.me if share fails
        }
      }

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      toast.success('Opening WhatsApp...')
      return
    }

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent('Check out NeuroBreath')}&body=${encodeURIComponent(text + '\n\n' + url)}`
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
      toast.success(`Opening ${platform} share...`)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://neurobreath.co.uk')
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#0F172A]">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Safety & Support
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your wellbeing is our priority. Here's important information about safe practice and how to support this project.
          </p>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8 shadow-xl">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-amber-500">⚠️</span>
            Safety Guidelines
          </h3>
          <div className="flex flex-wrap gap-6 text-slate-700 dark:text-slate-300 [&>*]:basis-full md:[&>*]:basis-[calc(33.333%-16px)] [&>*]:min-w-0">
            <div className="border-l-4 border-amber-300 pl-4">
              <p className="font-medium text-amber-800 dark:text-amber-300 mb-2">Educational Information Only</p>
              <p className="text-sm">
                These techniques are educational resources, not medical advice. They cannot replace professional healthcare.
              </p>
            </div>
            <div className="border-l-4 border-blue-300 pl-4">
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">Listen to Your Body</p>
              <p className="text-sm">
                If breathing exercises feel uncomfortable, cause dizziness, or increase anxiety, stop immediately and return to natural breathing.
              </p>
            </div>
            <div className="border-l-4 border-green-300 pl-4">
              <p className="font-medium text-green-800 dark:text-green-300 mb-2">Supportive Tool</p>
              <p className="text-sm">
                For PTSD, panic disorders, or serious mental health conditions, use these tools alongside — never instead of — professional care.
              </p>
            </div>
          </div>
        </div>

        {/* When to Seek Help */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-3xl p-6 md:p-8 mb-12">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">When to Seek Professional Help</h3>
          <div className="flex flex-wrap gap-4 text-sm text-red-800 dark:text-red-300 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] lg:[&>*]:basis-[calc(25%-12px)] [&>*]:min-w-0">
            <p>• Persistent breathing difficulties or chest pain</p>
            <p>• Panic attacks or severe anxiety that interferes with daily life</p>
            <p>• Symptoms of depression, PTSD, or other mental health conditions</p>
            <p>• Any concerns about your physical or mental wellbeing</p>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400 mt-6 font-medium">
            Emergency: Call 999 (UK) or your local emergency services
          </p>
        </div>

        {/* Share & Support */}
        <div className="max-w-4xl mx-auto">
          {/* Share Section */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#4ECDC4]" />
              Share NeuroBreath
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Help others discover free, neuro-inclusive breathing tools. Share responsibly with those who might benefit.
            </p>

            {/* Share Buttons — minimum py-3.5 for tappable touch targets */}
            <div className="flex flex-wrap gap-3 mb-4 [&>*]:basis-full sm:[&>*]:basis-[calc(50%-6px)] md:[&>*]:basis-[calc(33.333%-8px)] [&>*]:min-w-0">
              {shareButtons.map((button) => (
                <Button
                  key={button.id}
                  size="lg"
                  onClick={() => handleShare(button.id)}
                  className={`${button.color} text-white text-base py-3.5 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]`}
                >
                  {button.label}
                </Button>
              ))}
            </div>

            {/* Copy Link */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2 rounded-2xl py-3.5 text-base font-semibold border-slate-200 dark:border-slate-600 hover:border-[#4ECDC4] hover:text-[#4ECDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300"
            >
              {copied ? (
                <><Check className="w-4 h-4 text-green-500" /> Link Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Link</>
              )}
            </Button>

            {/* QR Code */}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-slate-600 dark:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Support This Project
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              NeuroBreath is free and always will be. Your support helps us maintain and improve these resources.
            </p>

            <div className="space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 rounded-2xl py-3.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <a
                  href="https://buymeacoffee.com/neurobreath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  ☕ Buy Me a Coffee
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-2xl py-3.5 text-base font-semibold border-slate-200 dark:border-slate-600 hover:border-[#4ECDC4] hover:text-[#4ECDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300"
              >
                <a
                  href="https://patreon.com/neurobreath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  🤝 Monthly Support
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full rounded-2xl py-3.5 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ECDC4]/60 transition-all duration-300"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  📧 Get in Touch
                </Link>
              </Button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
              All funds go towards hosting, development, and keeping this free for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
