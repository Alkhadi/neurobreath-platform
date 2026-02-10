'use client'

interface StripeBuyButtonProps {
  buyButtonId: string
  publishableKey: string
  disabled?: boolean
}

/**
 * Stripe Buy Button integration for Next.js
 * Note: The Stripe script is loaded at the page level in DonationPanel
 * @see https://stripe.com/docs/payments/buy-button
 */
export function StripeBuyButton({
  buyButtonId,
  publishableKey,
  disabled = false,
}: StripeBuyButtonProps) {
  if (disabled) {
    return null
  }

  return (
    <stripe-buy-button
      buy-button-id={buyButtonId}
      publishable-key={publishableKey}
    />
  )
}
