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
}

export function InstallButton({
  className,
  variant = 'outline',
  size = 'sm',
  label = 'Install',
  showFallbackLink = false,
}: InstallButtonProps) {
  const { isIOS, isStandalone, canPromptInstall, triggerInstall } = usePwaInstall()

  const shouldShow = useMemo(() => {
    if (isStandalone) return false
    if (isIOS) return false
    return canPromptInstall
  }, [canPromptInstall, isIOS, isStandalone])

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
