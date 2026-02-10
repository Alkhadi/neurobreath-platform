'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Share2, PlusSquare, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { usePwaInstall } from '@/components/pwa/usePwaInstall'
import { cn } from '@/lib/utils'

const DISMISS_KEY = 'nb_ios_install_banner_dismissed_v1'

export function IosInstallBanner({ className }: { className?: string }) {
  const pathname = usePathname() || '/'
  const { isIOS, isSafari, isStandalone } = usePwaInstall()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      const value = localStorage.getItem(DISMISS_KEY)
      setDismissed(value === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  const shouldShow = useMemo(() => {
    if (pathname === '/install') return false
    if (isStandalone) return false
    if (!isIOS || !isSafari) return false
    return !dismissed
  }, [dismissed, isIOS, isSafari, isStandalone, pathname])

  if (!shouldShow) return null

  return (
    <div className={cn('border-b bg-muted/50', className)} role="region" aria-label="Install NeuroBreath">
      <div className="container mx-auto px-4 py-2 flex items-center gap-3">
        <div className="min-w-0 text-sm text-foreground/90">
          <span className="font-semibold">Install:</span> tap <Share2 className="inline h-4 w-4 align-text-bottom" /> then <PlusSquare className="inline h-4 w-4 align-text-bottom" /> <span className="font-semibold">Add to Home Screen</span>.
          <span className="ml-2">
            <Link href="/install" className="underline underline-offset-2">Details</Link>
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, '1')
            } catch {
              // ignore
            }
            setDismissed(true)
          }}
          aria-label="Dismiss install hint"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
