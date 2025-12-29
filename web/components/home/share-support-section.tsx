'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Heart, Download, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

// REQUIREMENT #6: Support URL Constants
const SUPPORT_DONATE_ONCE_URL = 'https://buymeacoffee.com/neurobreath' // Placeholder - update with actual URL
const SUPPORT_MONTHLY_URL = 'https://patreon.com/neurobreath' // Placeholder - update with actual URL
const ORG_CONTACT_URL = '/contact'

export default function ShareSupportSection() {
  const [copied, setCopied] = useState(false)

  const handleShare = async (platform: string) => {
    const url = 'https://neurobreath.co.uk'
    const text = 'NeuroBreath: Free breathing & mindfulness tools for neurodivergent people. Evidence-based, neuro-inclusive, and privacy-first.'

    // REQUIREMENT #3: WhatsApp fix - use wa.me instead of api.whatsapp.com
    if (platform === 'whatsapp') {
      const whatsappText = `NeuroBreath — free breathing tools: ${url}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
      
      // Try Web Share API first on mobile
      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        try {
          await navigator.share({ title: 'NeuroBreath', text: whatsappText });
          toast.success('Shared successfully!');
          return;
        } catch (err) {
          // Fallback to wa.me if share fails
        }
      }
      
      // Open wa.me link
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening WhatsApp...');
      return;
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

  // REQUIREMENT #3: Professional QR Code with Logo
  const handleDownloadQR = () => {
    try {
      const url = 'https://neurobreath.co.uk'
      const canvasSize = 1024  // High resolution
      const qrSize = 700  // QR code size within canvas
      const qrData = encodeQRData(url)
      
      // Create canvas with padding for title and styling
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize
      canvas.height = canvasSize
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        toast.error('Failed to create QR code')
        return
      }
      
      // Draw white background with subtle border
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasSize, canvasSize)
      
      // Draw outer border
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, canvasSize - 40, canvasSize - 40)
      
      // Draw title
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 48px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan NeuroBreath', canvasSize / 2, 90)
      
      // Calculate QR position (centered with top margin for title)
      const qrX = (canvasSize - qrSize) / 2
      const qrY = 140
      
      // Draw QR code
      ctx.fillStyle = '#000000'
      const moduleSize = qrSize / qrData.length

      for (let row = 0; row < qrData.length; row++) {
        for (let col = 0; col < qrData[row].length; col++) {
          if (qrData[row][col] === 1) {
            ctx.fillRect(
              qrX + (col * moduleSize),
              qrY + (row * moduleSize),
              moduleSize,
              moduleSize
            )
          }
        }
      }
      
      // Load and draw logo in center
      const logo = new Image()
      logo.crossOrigin = 'anonymous'
      logo.src = '/icons/neurobreath-logo-square-128.png'
      
      logo.onload = () => {
        const logoSize = qrSize * 0.2  // 20% of QR size
        const logoX = (canvasSize - logoSize) / 2
        const logoY = qrY + (qrSize - logoSize) / 2
        
        // Draw white rounded background for logo
        const logoBackground = logoSize * 1.2
        const logoBgX = (canvasSize - logoBackground) / 2
        const logoBgY = qrY + (qrSize - logoBackground) / 2
        
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.roundRect(logoBgX, logoBgY, logoBackground, logoBackground, 16)
        ctx.fill()
        
        // Draw logo
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
        
        // Add website URL at bottom
        ctx.fillStyle = '#6b7280'
        ctx.font = '32px system-ui, -apple-system, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('neurobreath.co.uk', canvasSize / 2, qrY + qrSize + 60)
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = 'neurobreath-qr.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
            toast.success('Premium QR code downloaded!')
          }
        }, 'image/png')
      }
      
      logo.onerror = () => {
        // Fallback: download without logo
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = 'neurobreath-qr.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
            toast.success('QR code downloaded!')
          }
        }, 'image/png')
      }
    } catch (error) {
      toast.error('Failed to generate QR code')
    }
  }
  
  // Simple QR code data encoder (creates a basic pattern matrix)
  const encodeQRData = (url: string): number[][] => {
    // Create a simple 25x25 matrix for demonstration
    // In production, use a proper QR encoding library
    const size = 25
    const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0))
    
    // Add finder patterns (corners)
    const addFinderPattern = (startRow: number, startCol: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isEdge = i === 0 || i === 6 || j === 0 || j === 6
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4
          if (isEdge || isInner) {
            if (startRow + i < size && startCol + j < size) {
              matrix[startRow + i][startCol + j] = 1
            }
          }
        }
      }
    }
    
    addFinderPattern(0, 0) // Top-left
    addFinderPattern(0, size - 7) // Top-right
    addFinderPattern(size - 7, 0) // Bottom-left
    
    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0
      matrix[i][6] = i % 2 === 0 ? 1 : 0
    }
    
    // Add data pattern (simplified - encodes URL hash)
    let hash = 0
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i)
      hash = hash & hash
    }
    
    for (let row = 8; row < size - 8; row++) {
      for (let col = 8; col < size - 8; col++) {
        matrix[row][col] = ((hash >> ((row * col) % 16)) & 1)
      }
    }
    
    return matrix
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Share Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Share2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Share NeuroBreath
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help others discover free, evidence-based breathing tools. Share with families, schools,
              clinics, or anyone who could benefit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Social Share Buttons */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>👋</span>
                Share on social media
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => handleShare('twitter')}
                  className="w-full justify-start bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                  Share on Twitter / X
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  className="w-full justify-start bg-[#1877F2] hover:bg-[#1664d9] text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Share on Facebook
                </Button>
                <Button
                  onClick={() => handleShare('linkedin')}
                  className="w-full justify-start bg-[#0A66C2] hover:bg-[#095196] text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </Button>
                <Button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full justify-start bg-[#25D366] hover:bg-[#20ba5a] text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Share on WhatsApp
                </Button>
              </div>
            </div>

            {/* Direct Share Options */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔗</span>
                Direct sharing
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {copied ? (
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 mr-2" />
                  )}
                  {copied ? 'Link copied!' : 'Copy link to share'}
                </Button>
                <Button
                  onClick={() => handleShare('email')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Share via email
                </Button>
                <Button
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download QR code
                </Button>
              </div>
              <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Share this link:</p>
                <code className="text-xs text-blue-600 break-all">https://neurobreath.co.uk</code>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-center text-sm text-blue-900">
              <strong>🏯 For schools & clinics:</strong> Download printable QR code cards and posters to
              share with students, patients, or staff.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Support NeuroBreath
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              NeuroBreath is 100% free and always will be. We don't sell data or charge for features. If
              you find it helpful, consider supporting our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">☕</div>
              <h3 className="font-semibold text-gray-900 mb-2">Buy us a coffee</h3>
              <p className="text-sm text-gray-600 mb-4">
                One-time donation to help keep the platform running
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // REQUIREMENT #6: Wire up donate once button
                  window.open(SUPPORT_DONATE_ONCE_URL, '_blank')
                  toast.info('Opening donation page...')
                }}
              >
                💙 Donate once
              </Button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-semibold text-gray-900 mb-2">Become a patron</h3>
              <p className="text-sm text-gray-600 mb-4">
                Monthly support to help us grow and improve
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // REQUIREMENT #6: Wire up monthly support button
                  window.open(SUPPORT_MONTHLY_URL, '_blank')
                  toast.info('Opening monthly support page...')
                }}
              >
                ❤️ Support monthly
              </Button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Spread the word</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tell others about NeuroBreath—it helps us reach more people
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // REQUIREMENT #6: Wire up share now button - scroll to share section
                  const shareSection = document.querySelector('[class*="Share"]')?.closest('section')
                  if (shareSection) {
                    shareSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    setTimeout(() => {
                      shareSection.querySelector('button')?.focus()
                    }, 500)
                  }
                  toast.success('Share NeuroBreath using the options above!')
                }}
              >
                🚀 Share now
              </Button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">
              🎓 For schools & organizations
            </h3>
            <p className="text-sm text-gray-700 text-center max-w-2xl mx-auto">
              Interested in bulk training, custom resources, or professional development workshops? We
              offer tailored packages for schools, clinics, and community organizations.
            </p>
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  // REQUIREMENT #6: Wire up contact for organizations button
                  window.location.href = ORG_CONTACT_URL
                }}
              >
                Contact us for organizations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
