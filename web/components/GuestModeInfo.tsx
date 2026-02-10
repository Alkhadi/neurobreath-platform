/**
 * GuestModeInfo Component
 * 
 * Modal explaining guest mode features, privacy benefits, and export options
 */

'use client'

import { Check, Download, Lock, Smartphone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { exportGuestProgressAsJSON, loadGuestProgress } from '@/lib/guest-progress'
import { toast } from 'sonner'

interface GuestModeInfoProps {
  onClose: () => void
}

export function GuestModeInfo({ onClose }: GuestModeInfoProps) {
  const handleExport = () => {
    try {
      const json = exportGuestProgressAsJSON()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `neurobreath-data-${new Date().toISOString().split('T')[0]}.nbx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Guest data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export data. Please try again.')
    }
  }
  
  const progress = loadGuestProgress()
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-primary" />
            About Guest Mode
          </DialogTitle>
          <DialogDescription className="text-base">
            Understanding how your data is stored and protected
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Privacy First */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              Privacy-First Design
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>All your data is stored <strong>locally on your device</strong> only</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>No account required</strong> – no passwords, no emails, no tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Fully functional</strong> – access all core features without signing in</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>UK education compliant</strong> – meets GDPR and safeguarding standards</span>
              </li>
            </ul>
          </div>
          
          {/* Current Progress */}
          {progress && progress.totalSessions > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-primary/10">
              <h3 className="font-semibold text-sm mb-3">Your Guest Progress:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{progress.totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{progress.totalMinutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{progress.badges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Export & Transfer */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Export & Transfer
            </h3>
            <p className="text-sm text-muted-foreground">
              You can export your guest data at any time as a <code className="text-xs bg-muted px-1 py-0.5 rounded">.nbx</code> file. 
              This lets you:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Transfer your progress to another device</span>
              </li>
              <li className="flex items-start gap-2">
                <Download className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Keep a backup of your learning journey</span>
              </li>
              <li className="flex items-start gap-2">
                <Download className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Share with teachers or supporters (optional)</span>
              </li>
            </ul>
            
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="w-full mt-2"
              disabled={!progress || progress.totalSessions === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data (.nbx)
            </Button>
          </div>
          
          {/* Optional Account Benefits */}
          <div className="space-y-3 p-4 border border-dashed border-primary/30 rounded-lg">
            <h3 className="font-semibold text-sm">Optional: Create an Account</h3>
            <p className="text-xs text-muted-foreground">
              You never <em>have</em> to create an account, but it can help if you want to:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground ml-4">
              <li>• Sync across multiple devices automatically</li>
              <li>• Access your data from anywhere</li>
              <li>• Share progress with family or teachers securely</li>
            </ul>
            <p className="text-xs text-muted-foreground italic">
              Creating an account is always optional and never forced.
            </p>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              NeuroBreath respects your privacy and data ownership.
            </p>
            <Button onClick={onClose} size="sm">
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

