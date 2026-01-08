/**
 * ExportGuestData Component
 * 
 * Button and modal for exporting guest progress as .nbx file
 * Includes QR code for device transfer
 */

'use client'

import { useState } from 'react'
import { Download, FileJson, QrCode, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { exportGuestProgressAsJSON, loadGuestProgress } from '@/lib/guest-progress'
import { toast } from 'sonner'

interface ExportGuestDataProps {
  /**
   * Trigger element variant
   */
  variant?: 'button' | 'menu-item'
  
  /**
   * Button size (when variant is 'button')
   */
  size?: 'sm' | 'default' | 'lg'
}

export function ExportGuestData({ variant = 'button', size = 'default' }: ExportGuestDataProps) {
  const [showModal, setShowModal] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [qrData, setQrData] = useState<string | null>(null)
  
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
      
      setExportSuccess(true)
      
      // Generate QR code data (simplified - just base64 encode for now)
      try {
        const compressed = btoa(json.slice(0, 2000)) // Limit size for QR
        setQrData(compressed)
      } catch (e) {
        console.warn('QR generation failed:', e)
      }
      
      toast.success('Export successful! File downloaded.')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export data. Please try again.')
    }
  }
  
  const progress = loadGuestProgress()
  const hasData = progress && progress.totalSessions > 0
  
  const triggerButton = variant === 'button' ? (
    <Button
      onClick={() => setShowModal(true)}
      disabled={!hasData}
      size={size}
      variant="outline"
    >
      <Download className="w-4 h-4 mr-2" />
      Export Data
    </Button>
  ) : (
    <button
      onClick={() => setShowModal(true)}
      disabled={!hasData}
      className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded-md transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>Export Guest Data</span>
    </button>
  )
  
  return (
    <>
      {triggerButton}
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Export Your Data
            </DialogTitle>
            <DialogDescription>
              Download your guest progress as a .nbx file
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {!exportSuccess ? (
              <>
                {/* Export info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">What's included:</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      All {progress?.totalSessions || 0} breathing sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Reading assessments and placement data
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      {progress?.badges.length || 0} badges earned
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Progress statistics and streaks
                    </li>
                  </ul>
                </div>
                
                {/* File format info */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">File format:</strong> The .nbx file is a 
                    JSON format that can be imported back into NeuroBreath on another device or 
                    used for backup purposes.
                  </p>
                </div>
                
                {/* Export button */}
                <Button
                  onClick={handleExport}
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download .nbx File
                </Button>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Export Successful!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your data has been downloaded as a .nbx file
                    </p>
                  </div>
                </div>
                
                {/* QR Code (if available) */}
                {qrData && (
                  <div className="p-4 bg-muted/50 rounded-lg text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                      <QrCode className="w-4 h-4" />
                      Quick Transfer (Coming Soon)
                    </div>
                    <p className="text-xs text-muted-foreground">
                      In a future update, you'll be able to scan a QR code to transfer data between devices instantly.
                    </p>
                  </div>
                )}
                
                {/* Next steps */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">To import on another device:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Transfer the .nbx file to your other device</li>
                    <li>Open NeuroBreath and go to Settings</li>
                    <li>Select "Import Data" and choose your file</li>
                  </ol>
                </div>
                
                <Button
                  onClick={() => {
                    setShowModal(false)
                    setExportSuccess(false)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

