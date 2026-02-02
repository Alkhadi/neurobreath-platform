'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Copy, Download, ExternalLink, Laptop, Share2, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InstallButton } from '@/components/pwa/InstallButton'
import { usePwaInstall } from '@/components/pwa/usePwaInstall'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const FALLBACK_APP_URL = 'https://neurobreath.co.uk/uk'
const FALLBACK_INSTALL_URL = 'https://neurobreath.co.uk/install'

const QRCodeSVG = dynamic(() => import('qrcode.react').then((m) => m.QRCodeSVG), { ssr: false })

function detectPlatformLabel(): 'iOS' | 'Android' | 'Desktop' {
  if (typeof navigator === 'undefined') return 'Desktop'
  const ua = navigator.userAgent || ''
  if (/Android/i.test(ua)) return 'Android'
  if (/iPad|iPhone|iPod/i.test(ua)) return 'iOS'
  // iPadOS can report as MacIntel with touch points.
  const nav = navigator as Navigator & { maxTouchPoints?: number }
  if (navigator.platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1) return 'iOS'
  return 'Desktop'
}

async function copyTextWithFallback(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to textarea fallback.
  }

  if (typeof document === 'undefined') return false

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export function InstallPageClient() {
  const { isIOS, isStandalone, canPromptInstall } = usePwaInstall()

  const [howToOpen, setHowToOpen] = useState(false)
  const [howToFocus, setHowToFocus] = useState<'ios' | 'android' | 'desktop'>('ios')
  const [liveMessage, setLiveMessage] = useState('')

  const qrContainerRef = useRef<HTMLDivElement | null>(null)

  const installUrl = useMemo(() => FALLBACK_INSTALL_URL, [])
  const appUrl = useMemo(() => FALLBACK_APP_URL, [])

  const platform = useMemo(() => detectPlatformLabel(), [])
  const canShare = useMemo(() => typeof navigator !== 'undefined' && typeof navigator.share === 'function', [])

  const announce = useCallback((message: string) => {
    setLiveMessage('')
    // Ensure repeat announcements are read reliably.
    setTimeout(() => setLiveMessage(message), 50)
  }, [])

  const shareOrCopy = useCallback(
    async ({ url, title }: { url: string; title: string }) => {
      const shareSupported = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
      if (shareSupported) {
        try {
          await navigator.share({ title, url })
          toast.success('Shared')
          announce('Shared')
          return
        } catch {
          // User cancelled or share failed → fall back to copy.
        }
      }

      const copied = await copyTextWithFallback(url)
      if (copied) {
        toast.success('Link copied')
        announce('Link copied')
        return
      }

      toast.message('Copy failed', { description: 'Please copy the link manually.' })
      announce('Copy failed')
    },
    [announce]
  )

  const copyOnly = useCallback(
    async ({ url, label }: { url: string; label: string }) => {
      const copied = await copyTextWithFallback(url)
      if (copied) {
        toast.success('Copied', { description: label })
        announce('Link copied')
        return
      }
      toast.message('Copy failed', { description: 'Please copy the link manually.' })
      announce('Copy failed')
    },
    [announce]
  )

  const getQrSvg = useCallback(() => {
    const container = qrContainerRef.current
    if (!container) return null
    const svg = container.querySelector('svg') as SVGSVGElement | null
    return svg
  }, [])

  const openQrInNewTab = useCallback(() => {
    const svg = getQrSvg()
    if (!svg || typeof window === 'undefined') {
      toast.message('QR not ready', { description: 'Please try again in a moment.' })
      announce('QR not ready')
      return
    }

    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    }

    const serialized = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      toast.message('Popup blocked', { description: 'Allow popups to open the QR in a new tab.' })
      announce('Popup blocked')
      URL.revokeObjectURL(url)
      return
    }
    setTimeout(() => URL.revokeObjectURL(url), 15_000)
  }, [announce, getQrSvg])

  const downloadQr = useCallback(() => {
    const svg = getQrSvg()
    if (!svg || typeof document === 'undefined') {
      toast.message('QR not ready', { description: 'Please try again in a moment.' })
      announce('QR not ready')
      return
    }

    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    }

    const serialized = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'neurobreath-qr.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setTimeout(() => URL.revokeObjectURL(url), 15_000)
    toast.success('Downloaded')
    announce('Downloaded')
  }, [announce, getQrSvg])

  const installStatusLine = useMemo(() => {
    if (isStandalone) return 'Already installed'
    if (canPromptInstall) return 'Install available in this browser'
    if (isIOS) return 'Install via Safari steps below'
    return 'Install from your browser menu (steps below)'
  }, [canPromptInstall, isIOS, isStandalone])

  return (
    <div className="space-y-8">
      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Install NeuroBreath</h1>
        <p className="text-muted-foreground max-w-2xl">
          Add NeuroBreath to your home screen for quick access. If your browser supports it, you’ll see a one-tap install.
          Otherwise, follow the steps below.
        </p>

        <div className="flex flex-wrap gap-2">
          {isStandalone ? (
            <>
              <Button asChild variant="default" size="sm">
                <Link href="/uk" aria-label="Open NeuroBreath">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open app
                </Link>
              </Button>
              <Button type="button" variant="outline" size="sm" disabled aria-disabled="true">
                Installed ✓
              </Button>
            </>
          ) : (
            <InstallButton
              variant="default"
              size="sm"
              label={canPromptInstall ? 'One-tap install' : 'How to install'}
              showFallbackLink={false}
              installAvailable={canPromptInstall}
              standalone={isStandalone}
              isIOS={isIOS}
              fallbackWhenUnavailable
              onHowToInstall={() => {
                setHowToFocus(isIOS ? 'ios' : platform === 'Android' ? 'android' : 'desktop')
                setHowToOpen(true)
              }}
            />
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => shareOrCopy({ url: appUrl, title: 'NeuroBreath app link' })}
            className="gap-2"
            aria-label="Share NeuroBreath app link"
          >
            <Share2 className="h-4 w-4" />
            Share app link
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyOnly({ url: appUrl, label: 'App link copied' })}
            className="gap-2"
            aria-label="Copy NeuroBreath app link"
          >
            <Copy className="h-4 w-4" />
            Copy app link
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => shareOrCopy({ url: installUrl, title: 'NeuroBreath install help' })}
            className="gap-2"
            aria-label="Share install help page"
          >
            <Share2 className="h-4 w-4" />
            Share install help
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyOnly({ url: installUrl, label: 'Install help copied' })}
            className="gap-2"
            aria-label="Copy install help link"
          >
            <Copy className="h-4 w-4" />
            Copy install help
          </Button>
          {!isStandalone ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/uk" aria-label="Open NeuroBreath">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open app
              </Link>
            </Button>
          ) : null}
        </div>

        <p className="text-sm text-muted-foreground">{installStatusLine}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Install status</CardTitle>
          <CardDescription>Quick checks to help you install smoothly.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="font-medium">Platform:</span> {platform}
            </div>
            <div>
              <span className="font-medium">Install available:</span> {canPromptInstall ? '✅ Yes' : '— Not right now'}
            </div>
            <div>
              <span className="font-medium">Already installed:</span> {isStandalone ? '✅ Yes' : '— No'}
            </div>
            <div>
              <span className="font-medium">Share supported:</span> {canShare ? '✅ Yes' : '— Copy link instead'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={platform === 'iOS' ? 'ring-2 ring-primary/30' : undefined}>
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

        <Card className={platform === 'Android' ? 'ring-2 ring-primary/30' : undefined}>
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

        <Card className={platform === 'Desktop' ? 'ring-2 ring-primary/30' : undefined}>
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
            <div ref={qrContainerRef} className="flex items-center justify-center rounded-lg border bg-white p-4">
              <QRCodeSVG value={appUrl} size={180} includeMargin />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={openQrInNewTab} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open QR in new tab
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={downloadQr} className="gap-2">
                <Download className="h-4 w-4" />
                Download QR
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => shareOrCopy({ url: appUrl, title: 'NeuroBreath app link' })}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share app link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyOnly({ url: appUrl, label: 'App link copied' })}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy app link
              </Button>
            </div>
            <p className="text-xs text-muted-foreground break-all">Scans to: {appUrl}</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        Sharing tip: send someone this page (<span className="font-medium">{installUrl}</span>) if they need help installing.
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Quick fixes for common install and sharing issues.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="no-install">
              <AccordionTrigger>I don’t see “Install”</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Some browsers don’t support one-tap install. Use the browser menu instructions above.</li>
                  <li>On iPhone/iPad, installation works via Safari: Share → Add to Home Screen.</li>
                  <li>Private browsing may block installability.</li>
                  <li>If it’s already installed, open it from your Home Screen/app launcher.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ios-steps">
              <AccordionTrigger>iPhone / iPad install steps</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Safari → Share → Add to Home Screen.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="share-not-opening">
              <AccordionTrigger>Share button doesn’t open</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Your browser may not support Web Share. Use Copy link instead.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="installed-opens-browser">
              <AccordionTrigger>Installed but it still opens in the browser</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Launch NeuroBreath from the installed icon (Home Screen/app launcher). In the app, you should be in standalone mode.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={howToOpen} onOpenChange={setHowToOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to install</DialogTitle>
            <DialogDescription>
              Follow the steps for your device. If one-tap install isn’t available, use the browser menu.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={howToFocus === 'ios' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHowToFocus('ios')}
              >
                iPhone / iPad
              </Button>
              <Button
                type="button"
                variant={howToFocus === 'android' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHowToFocus('android')}
              >
                Android
              </Button>
              <Button
                type="button"
                variant={howToFocus === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHowToFocus('desktop')}
              >
                Desktop
              </Button>
            </div>

            {howToFocus === 'ios' ? (
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="font-medium mb-2">iPhone / iPad (Safari)</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                  <li>Open NeuroBreath in Safari.</li>
                  <li>Tap Share.</li>
                  <li>Tap Add to Home Screen.</li>
                  <li>Tap Add.</li>
                </ol>
              </div>
            ) : howToFocus === 'android' ? (
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="font-medium mb-2">Android (Chrome)</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                  <li>Open NeuroBreath in Chrome.</li>
                  <li>If prompted, tap Install.</li>
                  <li>Or use Menu (⋮) → Install app / Add to Home screen.</li>
                </ol>
              </div>
            ) : (
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="font-medium mb-2">Desktop (Chrome / Edge)</div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/90">
                  <li>Open NeuroBreath in Chrome or Edge.</li>
                  <li>Use the install icon in the address bar, or Menu (⋮) → Install NeuroBreath.</li>
                </ol>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => shareOrCopy({ url: appUrl, title: 'NeuroBreath app link' })}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share app link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyOnly({ url: appUrl, label: 'App link copied' })}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy app link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
