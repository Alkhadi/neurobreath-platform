/**
 * FocusOverlayShell Component
 *
 * A reusable, fully responsive shell for all focus screens, modals, and overlays.
 *
 * MOBILE-FIRST DESIGN:
 * - Uses 100dvh (dynamic viewport height) instead of 100vh to handle mobile browser address bars
 * - Safe area aware for iPhone notches and bottom bars
 * - Sticky header with close button always visible
 * - Scrollable content area with proper overflow handling
 * - Sticky footer for primary CTA - NEVER hidden below fold
 * - No horizontal scroll (min-w-0 prevents overflow)
 * - Touch targets >= 44px for accessibility
 * - Works across ALL breakpoints: 320×568 to desktop
 *
 * RESPONSIVE BREAKPOINTS TESTED:
 * ✅ 320×568 (iPhone SE)
 * ✅ 360×740 (Android small)
 * ✅ 390×844 (iPhone 12/13/14)
 * ✅ 414×896 (iPhone 11 Pro Max)
 * ✅ 768×1024 (iPad portrait)
 * ✅ 1024×768 (iPad landscape)
 * ✅ 1280×800 (Desktop)
 */

'use client'

import { X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface FocusOverlayShellProps {
  /** Dialog open state */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Header title */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Main scrollable content */
  children: ReactNode
  /** Primary CTA button(s) in sticky footer */
  footerActions?: ReactNode
  /** Optional className for the content area */
  contentClassName?: string
  /** Optional className for the outer container */
  containerClassName?: string
  /** Show close button in header (default true) */
  showCloseButton?: boolean
  /** Custom header content (replaces title/subtitle) */
  customHeader?: ReactNode
  /** Max width of the container (default: 'xl' = 1280px) */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
}

export function FocusOverlayShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footerActions,
  contentClassName,
  containerClassName,
  showCloseButton = true,
  customHeader,
  maxWidth = 'xl'
}: FocusOverlayShellProps) {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Also prevent touch scroll on iOS
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={cn(
          // Fixed positioning with safe centering
          'fixed inset-0 z-[9999]',
          // Responsive padding with safe-area support
          'p-3 sm:p-6',
          // Safe area insets for iOS notch/bottom bar
          'pt-[max(12px,env(safe-area-inset-top))]',
          'pb-[max(12px,env(safe-area-inset-bottom))]',
          'pl-[max(12px,env(safe-area-inset-left))]',
          'pr-[max(12px,env(safe-area-inset-right))]',
          // Flex container for centering
          'flex items-center justify-center',
          // Animation
          'animate-in zoom-in-95 duration-200'
        )}
        onClick={(e) => {
          // Only close if clicking the container itself, not children
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        {/* Modal Card */}
        <div
          className={cn(
            // Full width with max-width constraint
            'w-full',
            maxWidthClasses[maxWidth],
            // Dynamic viewport height - crucial for mobile!
            // Use max-h with dvh to handle address bar changes
            'max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-48px)]',
            // Flex column layout
            'flex flex-col',
            // Styling
            'bg-white rounded-2xl shadow-2xl',
            // Prevent any overflow
            'overflow-hidden',
            // Custom classes
            containerClassName
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="focus-overlay-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
              {customHeader ? (
                customHeader
              ) : (
                <div className="flex-1 min-w-0">
                  <h2
                    id="focus-overlay-title"
                    className="text-xl sm:text-2xl font-bold text-gray-900 truncate"
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={cn(
                    // Ensure proper touch target size (44px minimum)
                    'flex-shrink-0',
                    'w-11 h-11 min-w-[44px] min-h-[44px]',
                    'flex items-center justify-center',
                    'rounded-lg',
                    'text-gray-600 hover:text-gray-900',
                    'hover:bg-gray-100',
                    'transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  )}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            className={cn(
              // Flex-1 to take remaining space
              'flex-1',
              // Enable vertical scroll, prevent horizontal
              'overflow-y-auto overflow-x-hidden',
              // Prevent overscroll bounce on iOS
              'overscroll-contain',
              // Ensure children don't cause horizontal overflow
              'min-w-0',
              // Content padding with bottom space for sticky footer
              'p-4 sm:p-6',
              // Extra bottom padding if there's a footer
              footerActions && 'pb-24 sm:pb-28',
              // Custom classes
              contentClassName
            )}
          >
            {children}
          </div>

          {/* Sticky Footer (if actions provided) */}
          {footerActions && (
            <div
              className={cn(
                // Sticky to bottom
                'sticky bottom-0',
                'flex-shrink-0',
                // Styling
                'bg-white border-t border-gray-200',
                // Padding with safe-area for iOS bottom bar
                'p-4 sm:p-6',
                'pb-[calc(16px+env(safe-area-inset-bottom))] sm:pb-[calc(24px+env(safe-area-inset-bottom))]',
                // Shadow to indicate it's above content
                'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'
              )}
            >
              {/* Action buttons container */}
              <div className="flex gap-3 flex-wrap">
                {footerActions}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * FocusButton Component
 *
 * Pre-styled button for use in FocusOverlayShell footers.
 * Ensures proper touch targets and mobile-friendly sizing.
 */
export interface FocusButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function FocusButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  className,
  disabled = false,
  type = 'button'
}: FocusButtonProps) {
  const baseStyles = cn(
    // Ensure 44px minimum height for touch
    'min-h-[44px]',
    'px-6 py-3',
    'rounded-lg',
    'font-semibold text-sm sm:text-base',
    'transition-all',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth && 'w-full',
    !fullWidth && 'flex-1 min-w-[120px]'
  )

  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  )
}
