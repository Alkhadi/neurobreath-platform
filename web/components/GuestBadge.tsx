/**
 * GuestBadge Component
 * 
 * Visual indicator showing user is in guest mode
 * Includes tooltip with explanation and link to info modal
 */

'use client'

import { useState } from 'react'
import { Info, UserX } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { GuestModeInfo } from './GuestModeInfo'

interface GuestBadgeProps {
  /**
   * Show in compact mode (just icon, no text)
   */
  compact?: boolean
  
  /**
   * Custom className for styling
   */
  className?: string
}

export function GuestBadge({ compact = false, className = '' }: GuestBadgeProps) {
  const [showInfoModal, setShowInfoModal] = useState(false)
  
  const handleClick = () => {
    setShowInfoModal(true)
  }
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`cursor-pointer hover:bg-muted/50 transition-colors ${className}`}
              onClick={handleClick}
            >
              <UserX className="w-3 h-3 mr-1" />
              {!compact && <span>Guest Mode</span>}
              <Info className="w-3 h-3 ml-1 opacity-70" />
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">
              You're using NeuroBreath in guest mode. Your data is stored privately on this device only.
              Click to learn more.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showInfoModal && (
        <GuestModeInfo onClose={() => setShowInfoModal(false)} />
      )}
    </>
  )
}

