'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useNbcardInstall } from '@/components/nbcard/useNbcardInstall'

function copyText(text: string) {
  if (typeof navigator === 'undefined') return Promise.reject(new Error('No navigator'))

  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }

  return Promise.reject(new Error('Clipboard API not available'))
}

type InstructionMode = 'ios' | 'desktop'

const NB_CARD_CANONICAL_PATH = '/resources/nb-card'

export function NBCardInstallCTA() {
  const { isIOS, isSafari, isStandalone, canPromptInstall, installState, triggerInstall } = useNbcardInstall()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<InstructionMode>('desktop')

  const canonicalUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return new URL(NB_CARD_CANONICAL_PATH, window.location.origin).toString()
  }, [])

  const primaryLabel = isStandalone ? 'Open NB-Card' : 'Download & Install NB-Card'

  const onPrimaryClick = async () => {
    // B) Already installed
    if (isStandalone) {
      const el = document.getElementById('nbcard-app')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      toast.message('NB-Card is installed', { description: 'Opening your NB-Card experience.' })
      return
    }

    // A) Prompt available: one-shot prompt (must be user gesture)
    if (canPromptInstall) {
      const result = await triggerInstall()
      if (result.outcome === 'accepted' || result.outcome === 'installed') {
        toast.success('Installed', { description: 'NB-Card is now available from your home screen / apps.' })
      } else if (result.outcome === 'dismissed') {
        toast.message('Install dismissed', { description: 'You can install later from your browser menu.' })
      } else {
        // Fall through to instructions
      }

      if (result.outcome === 'accepted' || result.outcome === 'installed' || result.outcome === 'dismissed') return
    }

    // C/D) No prompt: show instructions modal
    if (isIOS) {
      setMode('ios')
      setOpen(true)
      return
    }

    setMode('desktop')
    setOpen(true)
  }

  const statusText = (() => {
    if (isStandalone) return 'Installed'
    if (installState === 'accepted') return 'Installed'
    if (installState === 'prompting') return 'Installing…'
    if (installState === 'dismissed') return 'Install dismissed'
    if (installState === 'unsupported') return 'Not supported'
    if (canPromptInstall) return 'Ready to install'
    if (isIOS) return 'Install via Add to Home Screen'
    return 'Install via browser menu'
  })()

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/nbcard/icon-192.png"
              alt="NB-Card"
              width={56}
              height={56}
              className="rounded-xl"
              priority
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Install NB-Card</h2>
              <p className="text-gray-600">Local-first digital business card. Installable where supported.</p>
              <p className="mt-1 text-sm text-gray-500">Status: <span className="font-semibold text-gray-700">{statusText}</span></p>
            </div>
          </div>

          <div className="md:ml-auto">
            <button
              type="button"
              onClick={onPrimaryClick}
              disabled={installState === 'prompting'}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {primaryLabel}
            </button>

            {!isStandalone && canPromptInstall ? (
              <p className="mt-2 text-xs text-gray-500">A confirmation prompt will appear; you must accept to install.</p>
            ) : null}

            {!isStandalone && isIOS && !isSafari ? (
              <p className="mt-2 text-xs text-gray-500">Tip: for fastest install on iPhone/iPad, open this page in Safari.</p>
            ) : null}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={
            mode === 'ios'
              ? 'max-w-xl w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-xl top-auto bottom-0 translate-y-0 rounded-t-2xl sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%]'
              : 'max-w-xl'
          }
        >
          <DialogHeader>
            <DialogTitle>
              {mode === 'ios' ? 'Install on iPhone / iPad' : 'Install NB-Card'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'ios'
                ? 'iOS does not allow one-tap programmatic install. Use Add to Home Screen.'
                : 'Your browser did not provide an install prompt for this site. You can still install from the browser menu when supported.'}
            </DialogDescription>
          </DialogHeader>

          {mode === 'ios' ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Open NB-Card in <span className="font-semibold">Safari</span>.</li>
                  <li>Tap the <span className="font-semibold">Share</span> button (square with an arrow).</li>
                  <li>Scroll and tap <span className="font-semibold">Add to Home Screen</span>.</li>
                  <li>Tap <span className="font-semibold">Add</span>.</li>
                </ol>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white border border-gray-200 p-3">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">NB-Card link</div>
                  <div className="text-sm text-gray-800 truncate">{canonicalUrl || NB_CARD_CANONICAL_PATH}</div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await copyText(canonicalUrl || NB_CARD_CANONICAL_PATH)
                      toast.success('Copied link')
                    } catch {
                      toast.message('Copy not available', { description: 'Please copy the URL from the address bar.' })
                    }
                  }}
                  className="shrink-0 rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-purple-50"
                >
                  Copy link
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <div className="font-semibold text-gray-800 mb-2">Chrome / Edge (Windows, macOS)</div>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Look for the install icon in the address bar, or</li>
                  <li>Menu (⋮) → <span className="font-semibold">Install app</span> / <span className="font-semibold">Create shortcut</span></li>
                </ul>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <div className="font-semibold text-gray-800 mb-2">Safari / Firefox</div>
                <p className="text-sm text-gray-700">
                  If install isn’t available, you can still use NB-Card in the browser. Some browsers may not support installing this site as an app.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gray-900 text-white px-4 py-2 font-semibold hover:bg-gray-800"
            >
              Dismiss
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
