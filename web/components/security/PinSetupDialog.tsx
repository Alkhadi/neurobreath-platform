/**
 * PIN Setup Dialog
 * 
 * Required after first profile creation.
 * Sets PIN + recovery identifier for device security.
 */

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, Shield, AlertCircle } from 'lucide-react'
import { setPin } from '@/lib/security/devicePinStore'

interface PinSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  allowClose?: boolean // If false, user must complete setup
}

export function PinSetupDialog({ open, onOpenChange, onComplete, allowClose = false }: PinSetupDialogProps) {
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits')
      return
    }

    if (pin.length > 8) {
      setError('PIN must be no more than 8 digits')
      return
    }

    if (!/^\d+$/.test(pin)) {
      setError('PIN must contain only numbers')
      return
    }

    if (pin !== pinConfirm) {
      setError('PINs do not match')
      return
    }

    if (!recoveryIdentifier.trim()) {
      setError('Recovery identifier is required')
      return
    }

    setIsSubmitting(true)

    try {
      await setPin(pin)

      toast.success('PIN set successfully! Your profiles are now protected.', {
        duration: 4000,
      })

      // Reset form
      setPin('')
      setPinConfirm('')
      setRecoveryIdentifier('')
      
      onComplete()
      onOpenChange(false)
    } catch (error) {
      console.error('Error setting PIN:', error)
      setError('Failed to set PIN. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (allowClose) {
      setPin('')
      setPinConfirm('')
      setRecoveryIdentifier('')
      setError('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChange : undefined}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (!allowClose) e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (!allowClose) e.preventDefault()
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Set Device PIN</DialogTitle>
          </div>
          <DialogDescription>
            Protect your profiles with a PIN. You'll need this to access profiles on this device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* PIN Field */}
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-sm font-medium">
              PIN (4-8 digits) <span className="text-destructive">*</span>
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
              disabled={isSubmitting}
              className="w-full text-center text-2xl tracking-widest"
              maxLength={8}
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* PIN Confirm Field */}
          <div className="space-y-2">
            <Label htmlFor="pin-confirm" className="text-sm font-medium">
              Confirm PIN <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pin-confirm"
              name="pin-confirm"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Re-enter PIN"
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
              disabled={isSubmitting}
              className="w-full text-center text-2xl tracking-widest"
              maxLength={8}
              autoComplete="off"
            />
          </div>

          {/* Recovery Identifier */}
          <div className="space-y-2">
            <Label htmlFor="recovery" className="text-sm font-medium">
              Recovery Identifier (Name or Email) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recovery"
              name="recovery"
              type="text"
              placeholder="e.g., john@example.com or John Smith"
              value={recoveryIdentifier}
              onChange={(e) => setRecoveryIdentifier(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Used to reset your PIN if you forget it. This will be stored securely (hashed).
            </p>
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
                <p className="font-medium text-foreground mb-1">Security Notice:</p>
                <ul className="space-y-0.5">
                  <li>• Your PIN cannot be recovered (only reset)</li>
                  <li>• PIN is stored securely (hashed, not plaintext)</li>
                  <li>• Required to unlock profiles on this device</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {allowClose && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !pin || !pinConfirm || !recoveryIdentifier}
              className={`${allowClose ? 'flex-1' : 'w-full'} bg-primary hover:bg-primary/90`}
            >
              {isSubmitting ? 'Setting PIN...' : 'Set PIN'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

