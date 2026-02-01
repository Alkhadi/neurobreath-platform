'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Smartphone, Laptop, Share2, ExternalLink } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/share/ShareButton'
import { InstallButton } from '@/components/pwa/InstallButton'

const FALLBACK_APP_URL = 'https://neurobreath.co.uk/uk'
const FALLBACK_INSTALL_URL = 'https://neurobreath.co.uk/install'

const QRCodeSVG = dynamic(() => import('qrcode.react').then((m) => m.QRCodeSVG), { ssr: false })

export function InstallPageClient() {
  const installUrl = useMemo(() => {
    if (typeof window === 'undefined') return FALLBACK_INSTALL_URL
    return `${window.location.origin}/install`
  }, [])

  const appUrl = useMemo(() => {
    if (typeof window === 'undefined') return FALLBACK_APP_URL
    return `${window.location.origin}/uk`
  }, [])

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Install NeuroBreath</h1>
        <p className="text-muted-foreground max-w-2xl">
          Add NeuroBreath to your home screen for quick access. If your browser supports it, you’ll see a one-tap install.
          Otherwise, follow the steps below.
        </p>

        <div className="flex flex-wrap gap-2">
          <InstallButton variant="default" size="sm" label="Install" showFallbackLink={false} />
          <ShareButton url={installUrl} variant="outline" size="sm" />
          <ShareButton url={installUrl} mode="copy" variant="outline" size="sm" />
          <Button asChild variant="outline" size="sm">
            <Link href="/uk" aria-label="Open NeuroBreath">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open app
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" /> iPhone / iPad (Safari)
            </CardTitle>
            <CardDescription>iOS doesn’t support programmatic install prompts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open NeuroBreath in <span className="font-semibold">Safari</span>.</li>
              <li>
                Tap <span className="inline-flex items-center gap-1"><Share2 className="h-4 w-4" /> Share</span>.
              </li>
              <li>Scroll and tap <span className="font-semibold">Add to Home Screen</span>.</li>
              <li>Tap <span className="font-semibold">Add</span>.</li>
            </ol>
            <p className="text-muted-foreground">
              Tip: if you opened this in Chrome on iOS, use the share sheet but install works best via Safari.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" /> Android (Chrome)
            </CardTitle>
            <CardDescription>Look for the install prompt or use the browser menu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open NeuroBreath in Chrome.</li>
              <li>If prompted, tap <span className="font-semibold">Install</span>.</li>
              <li>Otherwise: Menu (⋮) → <span className="font-semibold">Install app</span> / <span className="font-semibold">Add to Home screen</span>.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Laptop className="h-5 w-5" /> Desktop (Chrome / Edge)
            </CardTitle>
            <CardDescription>Install from the address bar icon or menu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open NeuroBreath in Chrome or Edge.</li>
              <li>Look for an install icon in the address bar.</li>
              <li>Or: Menu (⋮) → <span className="font-semibold">Install NeuroBreath</span>.</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR code</CardTitle>
            <CardDescription>Scan to open the app on your phone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center rounded-lg border bg-white p-4">
              <QRCodeSVG value={appUrl} size={180} includeMargin />
            </div>
            <div className="flex flex-wrap gap-2">
              <ShareButton url={appUrl} variant="outline" size="sm">
                <>
                  <Share2 className="h-4 w-4" />
                  Share app link
                </>
              </ShareButton>
              <ShareButton url={appUrl} mode="copy" variant="outline" size="sm" />
            </div>
            <p className="text-xs text-muted-foreground break-all">{appUrl}</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        Sharing tip: send someone this page (<span className="font-medium">{installUrl}</span>) if they need help installing.
      </div>
    </div>
  )
}
