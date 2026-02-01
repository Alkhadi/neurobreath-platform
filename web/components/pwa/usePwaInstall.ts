'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

export type PwaInstallState =
  | 'idle'
  | 'available'
  | 'prompting'
  | 'accepted'
  | 'dismissed'
  | 'installed'
  | 'unsupported'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false

  const nav = window.navigator as Navigator & { standalone?: boolean }
  const mediaStandalone = window.matchMedia?.('(display-mode: standalone)')?.matches ?? false
  const iosStandalone = nav.standalone === true
  return mediaStandalone || iosStandalone
}

function detectIOS(): boolean {
  if (typeof window === 'undefined') return false

  const nav = window.navigator as Navigator & { maxTouchPoints?: number }
  const ua = window.navigator.userAgent || ''
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua)
  const isIpadOS = window.navigator.platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1
  return isAppleMobile || isIpadOS
}

function detectSafari(): boolean {
  if (typeof window === 'undefined') return false

  const ua = window.navigator.userAgent || ''
  const hasSafari = /Safari\//.test(ua)
  const isChrome = /Chrome\//.test(ua) || /CriOS\//.test(ua)
  const isEdge = /Edg\//.test(ua) || /EdgiOS\//.test(ua)
  const isFirefox = /Firefox\//.test(ua) || /FxiOS\//.test(ua)
  const isOpera = /OPR\//.test(ua) || /OPiOS\//.test(ua)
  return hasSafari && !isChrome && !isEdge && !isFirefox && !isOpera
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [installState, setInstallState] = useState<PwaInstallState>('idle')

  const isIOS = useMemo(() => detectIOS(), [])
  const isSafari = useMemo(() => detectSafari(), [])

  useEffect(() => {
    const updateStandalone = () => {
      const standalone = detectStandalone()
      setIsStandalone(standalone)
      if (standalone) setInstallState('installed')
    }

    updateStandalone()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setInstallState((prev) => (prev === 'installed' ? prev : 'available'))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', updateStandalone)

    const media = window.matchMedia?.('(display-mode: standalone)')
    if (media?.addEventListener) {
      media.addEventListener('change', updateStandalone)
    } else if (media && 'addListener' in media) {
      // Safari fallback
      media.addListener(updateStandalone)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', updateStandalone)

      if (media?.removeEventListener) {
        media.removeEventListener('change', updateStandalone)
      } else if (media && 'removeListener' in media) {
        // Safari fallback
        media.removeListener(updateStandalone)
      }
    }
  }, [])

  const canPromptInstall = !!deferredPrompt && !isStandalone

  const triggerInstall = useCallback(async () => {
    if (isStandalone) {
      setInstallState('installed')
      return { outcome: 'installed' as const }
    }

    if (!deferredPrompt) {
      setInstallState('unsupported')
      return { outcome: 'unsupported' as const }
    }

    setInstallState('prompting')

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      setDeferredPrompt(null)

      if (outcome === 'accepted') {
        setInstallState('accepted')
        setIsStandalone(true)
        // Give UI a chance to show "accepted" before settling on "installed".
        setTimeout(() => setInstallState('installed'), 150)
        return { outcome: 'accepted' as const }
      }

      setInstallState('dismissed')
      return { outcome: 'dismissed' as const }
    } catch {
      setInstallState('unsupported')
      return { outcome: 'unsupported' as const }
    }
  }, [deferredPrompt, isStandalone])

  return {
    isIOS,
    isSafari,
    isStandalone,
    canPromptInstall,
    installState,
    triggerInstall,
  }
}
