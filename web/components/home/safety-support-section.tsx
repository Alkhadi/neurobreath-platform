'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Heart, Download, Copy, Check, ExternalLink, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

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
        } catch (err) {
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
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const shareButtons = [
    { id: 'twitter', label: 'Twitter', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'facebook', label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
    { id: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'email', label: 'Email', color: 'bg-slate-500 hover:bg-slate-600' }
  ]

  return (
    <section className="py-16 bg-slate-50">
      <div className="px-4">
        {/* Header - Centred with max-width */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Safety & Support
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your wellbeing is our priority. Here's important information about safe practice and how to support this project.
          </p>
        </div>

        {/* Safety Guidelines - Full Width */}
        <div className="bg-white rounded-lg border p-6 md:p-8 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-amber-500">⚠️</span>
            Safety Guidelines
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-slate-700">
            <div className="border-l-4 border-amber-300 pl-4">
              <p className="font-medium text-amber-800 mb-2">Educational Information Only</p>
              <p className="text-sm">
                These techniques are educational resources, not medical advice. They cannot replace professional healthcare.
              </p>
            </div>
            <div className="border-l-4 border-blue-300 pl-4">
              <p className="font-medium text-blue-800 mb-2">Listen to Your Body</p>
              <p className="text-sm">
                If breathing exercises feel uncomfortable, cause dizziness, or increase anxiety, stop immediately and return to natural breathing.
              </p>
            </div>
            <div className="border-l-4 border-green-300 pl-4">
              <p className="font-medium text-green-800 mb-2">Supportive Tool</p>
              <p className="text-sm">
                For PTSD, panic disorders, or serious mental health conditions, use these tools alongside — never instead of — professional care.
              </p>
            </div>
          </div>
        </div>

        {/* When to Seek Help - Full Width */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 md:p-8 mb-12">
          <h3 className="text-lg font-semibold text-red-900 mb-4">When to Seek Professional Help</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-red-800">
            <p>• Persistent breathing difficulties or chest pain</p>
            <p>• Panic attacks or severe anxiety that interferes with daily life</p>
            <p>• Symptoms of depression, PTSD, or other mental health conditions</p>
            <p>• Any concerns about your physical or mental wellbeing</p>
          </div>
          <p className="text-xs text-red-700 mt-6 font-medium">
            Emergency: Call 999 (UK) or your local emergency services
          </p>
        </div>

        {/* Share & Support - Centred with max-width */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
          {/* Share Section */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              Share NeuroBreath
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Help others discover free, neuro-inclusive breathing tools. Share responsibly with those who might benefit.
            </p>
            
            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {shareButtons.map((button) => (
                <Button
                  key={button.id}
                  size="sm"
                  onClick={() => handleShare(button.id)}
                  className={`${button.color} text-white text-xs`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
            
            {/* Copy Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2"
            >
              {copied ? (
                <><Check className="w-4 h-4 text-green-500" /> Link Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Link</>
              )}
            </Button>

            {/* QR Code */}
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                <QrCode className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Support This Project
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              NeuroBreath is free and always will be. Your support helps us maintain and improve these resources.
            </p>
            
            <div className="space-y-3">
              <Button asChild size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
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
              
              <Button asChild variant="outline" size="sm" className="w-full">
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
              
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/contact" className="flex items-center gap-2">
                  📧 Get in Touch
                </Link>
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 mt-4 text-center">
              All funds go towards hosting, development, and keeping this free for everyone.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
