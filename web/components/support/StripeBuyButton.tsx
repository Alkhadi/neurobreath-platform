'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface StripeBuyButtonProps {
  buyButtonId: string
  publishableKey: string
  disabled?: boolean
}

/**
 * Stripe Buy Button integration for Next.js
 * Loads Stripe script once and renders custom buy-button element
 * @see https://stripe.com/docs/payments/buy-button
 */
export function StripeBuyButton({
  buyButtonId,
  publishableKey,
  disabled = false,
}: StripeBuyButtonProps) {
  const scriptLoaded = useRef(false)

  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development' && !publishableKey) {
      console.warn(
        '[StripeBuyButton] Missing publishable key. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env'
      )
    }
  }, [publishableKey])

  if (disabled) {
    return null
  }

  return (
    <>
      {!scriptLoaded.current && (
        <Script
          src="https://js.stripe.com/v3/buy-button.js"
          strategy="afterInteractive"
          onLoad={() => {
            scriptLoaded.current = true
          }}
        />
      )}
      <stripe-buy-button
        buy-button-id={buyButtonId}
        publishable-key={publishableKey}
      />
    </>
  )
}
