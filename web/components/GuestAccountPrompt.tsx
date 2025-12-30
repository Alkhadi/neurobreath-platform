/**
 * GuestAccountPrompt Component
 * 
 * Friendly, non-blocking prompt shown after 7 sessions
 * Encourages account creation but remains dismissible forever
 */

'use client'

import { useEffect, useState } from 'react'
import { Cloud, Smartphone, Users, X, TrendingUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  shouldShowAccountPrompt,
  dismissAccountPrompt,
  loadGuestProgress,
} from '@/lib/guest-progress'
import { toast } from 'sonner'

export function GuestAccountPrompt() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted) return
    
    // Check if we should show the prompt
    const shouldShow = shouldShowAccountPrompt()
    if (shouldShow) {
      // Small delay to avoid aggressive popup on page load
      const timer = setTimeout(() => {
        setOpen(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [mounted])
  
  const handleDismiss = () => {
    dismissAccountPrompt()
    setOpen(false)
    toast.success('You can continue using guest mode as long as you like!', {
      duration: 3000,
    })
  }
  
  const handleCreateAccount = () => {
    // TODO: Implement account creation flow
    toast.info('Account creation coming soon! Your progress is safe in guest mode.', {
      duration: 4000,
    })
    dismissAccountPrompt()
    setOpen(false)
  }
  
  // Don't render anything until client-side mounted
  if (!mounted || !open) return null
  
  const progress = loadGuestProgress()
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Dismiss prompt"
        >
          <X className="w-4 h-4" />
        </button>
        
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">You're doing great!</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {progress?.totalSessions || 0} sessions completed
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Progress highlight */}
          <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-primary/10">
            <p className="text-sm text-foreground leading-relaxed">
              You've been using NeuroBreath in guest mode and building a great practice habit. 
              Consider creating an account to unlock even more features!
            </p>
          </div>
          
          {/* Benefits of account */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">With an account, you can:</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3 text-sm">
                <Cloud className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Sync across devices</strong>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Access your progress from phone, tablet, or computer
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Share with supporters</strong>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Securely share progress with teachers or family
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Smartphone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Never lose your data</strong>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatic cloud backup keeps your progress safe
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* CTA buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleCreateAccount}
              className="w-full"
              size="lg"
            >
              Create Free Account
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Maybe later – continue as guest
            </Button>
          </div>
          
          {/* Privacy reassurance */}
          <p className="text-xs text-muted-foreground text-center pt-2 border-t">
            <strong>Privacy first:</strong> Creating an account is optional. You can continue using guest mode forever.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

