/**
 * PIN Reset Dialog
 * 
 * RESET-ONLY approach: Never reveals old PIN.
 * Requires recovery identifier verification before allowing new PIN.
 */

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { KeyRound, AlertCircle, Shield } from 'lucide-react'
import { verifyRecoveryIdentifier, resetPinWithRecovery, getRecoveryHint } from '@/lib/security/devicePinStore'

interface PinResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PinResetDialog({ open, onOpenChange, onSuccess }: PinResetDialogProps) {
  const [step, setStep] = useState<'verify' | 'reset'>('verify')
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('')
  const [newPin, setNewPin] = useState('')
  const [newPinConfirm, setNewPinConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [recoveryHint] = useState(getRecoveryHint())

  const handleVerifyRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!recoveryIdentifier.trim()) {
      setError('Please enter your recovery identifier')
      return
    }

    setIsSubmitting(true)

    try {
      const isValid = await verifyRecoveryIdentifier(recoveryIdentifier.trim())
      
      if (!isValid) {
        setError('Recovery identifier does not match. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Move to reset step
      setStep('reset')
    } catch (error) {
      console.error('Error verifying recovery identifier:', error)
      setError('Failed to verify recovery identifier. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (newPin.length < 4) {
      setError('PIN must be at least 4 digits')
      return
    }

    if (newPin.length > 8) {
      setError('PIN must be no more than 8 digits')
      return
    }

    if (!/^\d+$/.test(newPin)) {
      setError('PIN must contain only numbers')
      return
    }

    if (newPin !== newPinConfirm) {
      setError('PINs do not match')
      return
    }

    setIsSubmitting(true)

    try {
      const success = await resetPinWithRecovery(recoveryIdentifier.trim(), newPin)
      
      if (!success) {
        throw new Error('Failed to reset PIN')
      }

      toast.success('PIN reset successfully! You can now use your new PIN.', {
        duration: 4000,
      })

      // Reset form
      setRecoveryIdentifier('')
      setNewPin('')
      setNewPinConfirm('')
      setStep('verify')
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error resetting PIN:', error)
      setError('Failed to reset PIN. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setRecoveryIdentifier('')
    setNewPin('')
    setNewPinConfirm('')
    setError('')
    setStep('verify')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Reset PIN</DialogTitle>
          </div>
          <DialogDescription>
            {step === 'verify' 
              ? 'Verify your recovery identifier to reset your PIN.'
              : 'Enter your new PIN.'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Verify Recovery Identifier */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyRecovery} className="space-y-6 pt-4">
            {/* Recovery Identifier */}
            <div className="space-y-2">
              <Label htmlFor="recovery" className="text-sm font-medium">
                Recovery Identifier
              </Label>
              {recoveryHint && (
                <p className="text-xs text-muted-foreground">
                  Hint: {recoveryHint}
                </p>
              )}
              <Input
                id="recovery"
                name="recovery"
                type="text"
                placeholder="Enter your recovery identifier"
                value={recoveryIdentifier}
                onChange={(e) => setRecoveryIdentifier(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
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

            {/* Security Notice */}
            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-primary/10">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Important:</p>
                  <ul className="space-y-0.5">
                    <li>• Your old PIN cannot be recovered (only reset)</li>
                    <li>• If you don't know your recovery identifier, you'll need to clear all device data</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !recoveryIdentifier}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Set New PIN */}
        {step === 'reset' && (
          <form onSubmit={handleResetPin} className="space-y-6 pt-4">
            {/* New PIN */}
            <div className="space-y-2">
              <Label htmlFor="new-pin" className="text-sm font-medium">
                New PIN (4-8 digits) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-pin"
                name="new-pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter new PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                disabled={isSubmitting}
                className="w-full text-center text-2xl tracking-widest"
                maxLength={8}
                autoFocus
                autoComplete="off"
              />
            </div>

            {/* Confirm New PIN */}
            <div className="space-y-2">
              <Label htmlFor="new-pin-confirm" className="text-sm font-medium">
                Confirm New PIN <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-pin-confirm"
                name="new-pin-confirm"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Re-enter new PIN"
                value={newPinConfirm}
                onChange={(e) => setNewPinConfirm(e.target.value.replace(/\D/g, ''))}
                disabled={isSubmitting}
                className="w-full text-center text-2xl tracking-widest"
                maxLength={8}
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

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !newPin || !newPinConfirm}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Resetting...' : 'Reset PIN'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

