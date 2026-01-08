/**
 * Profile Enabled Banner (State C)
 * 
 * Compact banner shown on / and /get-started when profile exists.
 * Shows "Profile enabled ✓" with option to add another learner (requires PIN).
 * 
 * Non-intrusive, dismissible, privacy-focused.
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, UserPlus, X } from 'lucide-react'
import { hasAnyLearnerProfile, getActiveProfile } from '@/lib/onboarding/deviceProfileStore'
import { PinEntryDialog } from '@/components/security/PinEntryDialog'
import { PinResetDialog } from '@/components/security/PinResetDialog'
import { isPinSet } from '@/lib/security/devicePinStore'
import { toast } from 'sonner'

export function ProfileEnabledBanner() {
  const [mounted, setMounted] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showPinResetDialog, setShowPinResetDialog] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [activeProfileName, setActiveProfileName] = useState<string | null>(null)
  
  useEffect(() => {
    setMounted(true)
    
    // Check if banner was dismissed this session
    const dismissed = sessionStorage.getItem('nb:bannerDismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
    
    // Get active profile name
    const profile = getActiveProfile()
    if (profile) {
      setActiveProfileName(profile.name)
    }
  }, [])
  
  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('nb:bannerDismissed', 'true')
  }
  
  const handleAddLearner = () => {
    // If PIN is set, require unlock first
    if (isPinSet()) {
      setShowPinDialog(true)
    } else {
      // No PIN (shouldn't happen, but handle gracefully)
      navigateToProfileCreation()
    }
  }
  
  const handlePinUnlocked = () => {
    setIsUnlocked(true)
    navigateToProfileCreation()
  }
  
  const navigateToProfileCreation = () => {
    // Navigate to /get-started with a flag to open profile creation
    window.location.href = '/get-started?action=create-profile'
  }
  
  if (!mounted || isDismissed) {
    return null
  }
  
  // Only show if profile exists
  if (!hasAnyLearnerProfile()) {
    return null
  }
  
  return (
    <>
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Status indicator */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Profile enabled ✓
                </p>
                {activeProfileName && (
                  <p className="text-xs text-muted-foreground">
                    Active: {activeProfileName}
                  </p>
                )}
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddLearner}
                className="text-xs gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add another learner
              </Button>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-muted/50 rounded transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* PIN Entry Dialog */}
      <PinEntryDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onSuccess={handlePinUnlocked}
        onForgotPin={() => {
          setShowPinDialog(false)
          setShowPinResetDialog(true)
        }}
      />
      
      {/* PIN Reset Dialog */}
      <PinResetDialog
        open={showPinResetDialog}
        onOpenChange={setShowPinResetDialog}
        onSuccess={handlePinUnlocked}
      />
    </>
  )
}

