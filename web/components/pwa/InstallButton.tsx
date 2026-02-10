'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { usePwaInstall } from '@/components/pwa/usePwaInstall'

type InstallButtonProps = {
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  label?: string
  showFallbackLink?: boolean
  /** Optional state overrides (useful for /install page). */
  installAvailable?: boolean
  standalone?: boolean
  isIOS?: boolean
  /** When install is unavailable, render a useful fallback button instead of null. */
  fallbackWhenUnavailable?: boolean
  fallbackLabel?: string
  onHowToInstall?: () => void
}

export function InstallButton({
  className,
  variant = 'outline',
  size = 'sm',
  label = 'Install',
  showFallbackLink = false,
  installAvailable,
  standalone,
  isIOS: isIOSOverride,
  fallbackWhenUnavailable = false,
  fallbackLabel,
  onHowToInstall,
}: InstallButtonProps) {
  const { isIOS, isStandalone, canPromptInstall, triggerInstall } = usePwaInstall()

  const resolvedIsIOS = isIOSOverride ?? isIOS
  const resolvedIsStandalone = standalone ?? isStandalone
  const resolvedCanPromptInstall = installAvailable ?? canPromptInstall

  const shouldShow = useMemo(() => {
    if (resolvedIsStandalone) return false
    if (resolvedIsIOS) return false
    return resolvedCanPromptInstall
  }, [resolvedCanPromptInstall, resolvedIsIOS, resolvedIsStandalone])

  const onClick = useCallback(async () => {
    const result = await triggerInstall()

    if (result.outcome === 'accepted' || result.outcome === 'installed') {
      toast.success('Installed', { description: 'NeuroBreath is now available from your apps.' })
      return
    }

    if (result.outcome === 'dismissed') {
      toast.message('Install dismissed', { description: 'You can install later from your browser menu.' })
      return
    }

    toast.message('Install not available', { description: 'Open /install for manual steps.' })
  }, [triggerInstall])

  if (!shouldShow) {
    if (fallbackWhenUnavailable && typeof onHowToInstall === 'function') {
      return (
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className}
          onClick={onHowToInstall}
          aria-label={fallbackLabel ?? label}
        >
          <Download className="h-4 w-4 mr-2" />
          {fallbackLabel ?? label}
        </Button>
      )
    }

    if (!showFallbackLink) return null

    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href="/install" aria-label="Install NeuroBreath">
          <Download className="h-4 w-4 mr-2" />
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={onClick} aria-label="Install NeuroBreath">
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}
