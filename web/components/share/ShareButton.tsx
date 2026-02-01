'use client'

import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { Share2, Copy, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ShareButtonProps = {
  url?: string
  title?: string
  text?: string
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  mode?: 'share' | 'copy'
  children?: React.ReactNode
}

async function copyToClipboard(text: string) {
  if (typeof navigator === 'undefined') throw new Error('No navigator')

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  // Last-resort fallback.
  if (typeof window !== 'undefined') {
    window.prompt('Copy this link:', text)
    return
  }

  throw new Error('Clipboard not available')
}

export function ShareButton({
  url,
  title = 'NeuroBreath',
  text = 'NeuroBreath — evidence-based breathing & focus tools.',
  className,
  variant = 'outline',
  size = 'sm',
  mode = 'share',
  children,
}: ShareButtonProps) {
  const resolvedUrl = useMemo(() => {
    if (url) return url
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [url])

  const onClick = useCallback(async () => {
    if (!resolvedUrl) return

    if (mode === 'copy') {
      try {
        await copyToClipboard(resolvedUrl)
        toast.success('Link copied')
      } catch {
        toast.message('Copy not available', { description: 'Please copy the URL from the address bar.' })
      }
      return
    }

    // Prefer native share when available.
    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    if (canShare) {
      try {
        await navigator.share({ title, text, url: resolvedUrl })
        toast.success('Shared')
        return
      } catch {
        // User cancelled or share failed → fall back to copy.
      }
    }

    try {
      await copyToClipboard(resolvedUrl)
      toast.success('Link copied')
    } catch {
      toast.message('Share not available', { description: 'Please copy the URL from the address bar.' })
    }
  }, [mode, resolvedUrl, text, title])

  const icon = mode === 'copy' ? Copy : Share2

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn('gap-2', className)}
      aria-label={mode === 'copy' ? 'Copy link' : 'Share'}
    >
      {children ? (
        children
      ) : (
        <>
          {icon === Share2 ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {mode === 'copy' ? 'Copy link' : 'Share'}
        </>
      )}
    </Button>
  )
}

export function CopiedChip({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <Check className="h-3 w-3" />
      Copied
    </span>
  )
}
