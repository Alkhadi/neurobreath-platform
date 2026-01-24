'use client'

import { Share2, Mail, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function OtherWaysToSupport() {
  const [copied, setCopied] = useState(false)
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://neurobreath.co.uk'

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.error('Failed to copy:', err)
    }
  }

  const shareUrls = {
    whatsapp: `https://wa.me/?text=Check out NeuroBreath - free mental health and neurodiversity resources: ${encodeURIComponent(siteUrl)}`,
    email: `mailto:?subject=Check out NeuroBreath&body=I found this helpful resource for mental health and neurodiversity support: ${encodeURIComponent(siteUrl)}`,
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Other Ways to Support</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-6">📢</div>
            <h3 className="text-2xl font-bold mb-4">Spread the Word</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Share NeuroBreath with friends, family, colleagues, or on social media.
              Help us reach more people who could benefit from our free resources.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-6">⭐</div>
            <h3 className="text-2xl font-bold mb-4">Leave Feedback</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Share your experience, suggest improvements, or report issues.
              Your feedback helps us make NeuroBreath better for everyone.
            </p>
            <Button variant="outline" asChild className="hover:border-purple-400 hover:text-purple-600">
              <Link href="/contact">Send Feedback</Link>
            </Button>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-bold mb-4">Volunteer</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Are you a developer, designer, researcher, or mental health professional?
              We'd love to collaborate with passionate volunteers.
            </p>
            <Button variant="outline" asChild className="hover:border-purple-400 hover:text-purple-600">
              <Link href="/contact">Get Involved</Link>
            </Button>
          </Card>
        </div>

        {/* Share Links */}
        <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="text-center mb-6">
            <Share2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold">Share NeuroBreath</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="hover:border-purple-400 hover:bg-purple-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              asChild
              className="hover:border-purple-400 hover:bg-purple-50"
            >
              <a href={shareUrls.email} target="_blank" rel="noopener noreferrer">
                <Mail className="h-4 w-4 mr-2" />
                Share by Email
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="hover:border-purple-400 hover:bg-purple-50"
            >
              <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
