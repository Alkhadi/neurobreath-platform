/**
 * PIN Entry Dialog
 * 
 * Used to unlock onboarding card when profiles exist.
 * Unlock lasts only for current page visit (in-memory state).
 */

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, AlertCircle } from 'lucide-react'
import { verifyPin } from '@/lib/security/devicePinStore'

interface PinEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  onForgotPin: () => void
}

export function PinEntryDialog({ open, onOpenChange, onSuccess, onForgotPin }: PinEntryDialogProps) {
  const [pin, setPin] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pin) {
      setError('Please enter your PIN')
      return
    }

    setIsVerifying(true)

    try {
      const isValid = await verifyPin(pin)
      
      if (!isValid) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        if (newAttempts >= 3) {
          setError('Too many failed attempts. Use "Forgot PIN?" to reset.')
        } else {
          setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`)
        }
        
        setPin('')
        return
      }

      // Success!
      toast.success('Unlocked! You can now access profiles.', {
        duration: 3000,
      })

      setPin('')
      setAttempts(0)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error verifying PIN:', error)
      setError('Failed to verify PIN. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCancel = () => {
    setPin('')
    setError('')
    onOpenChange(false)
  }

  const handleForgotPin = () => {
    setPin('')
    setError('')
    setAttempts(0)
    onOpenChange(false)
    onForgotPin()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Enter PIN</DialogTitle>
          </div>
          <DialogDescription>
            Enter your device PIN to access profiles and create new ones.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* PIN Field */}
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-sm font-medium">
              PIN
            </Label>
            <Input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              disabled={isVerifying || attempts >= 3}
              className="w-full text-center text-2xl tracking-widest"
              maxLength={8}
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Forgot PIN Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPin}
              className="text-sm text-primary hover:underline"
              disabled={isVerifying}
            >
              Forgot PIN?
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isVerifying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isVerifying || !pin || attempts >= 3}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isVerifying ? 'Verifying...' : 'Unlock'}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              <span className="text-green-600 dark:text-green-400">🔒</span> Unlock lasts only
              for this page visit. Refresh to lock again.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

