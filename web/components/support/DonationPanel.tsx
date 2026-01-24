'use client'

import { Heart, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { Card, CardContent } from '@/components/ui/card'
import { StripeBuyButton } from './StripeBuyButton'
import { DONATION_TIERS, STRIPE_PUBLISHABLE_KEY } from '@/lib/support/donation-config'

export function DonationPanel() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Load Stripe Buy Button script once for all buttons */}
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-8 shadow-lg">
            <Heart className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Support NeuroBreath ❤️</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            If NeuroBreath has helped you or someone you care about, consider supporting our mission.
            Every contribution, no matter how small, helps us continue providing free,
            evidence-informed resources to those who need them.
          </p>
        </div>

        {/* Donation Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-10">Choose an amount</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {DONATION_TIERS.map((tier) => (
              <Card
                key={tier.amount}
                className={`relative overflow-hidden transition-all duration-300 ${
                  tier.disabled
                    ? 'opacity-60 border-gray-300'
                    : 'border-2 hover:border-purple-400 hover:shadow-xl hover:scale-105'
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2 text-purple-600">{tier.label}</div>
                  <p className="text-sm text-muted-foreground mb-6 min-h-[3rem]">{tier.benefit}</p>

                  {tier.disabled ? (
                    <div className="py-4 px-6 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Temporarily unavailable</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tier.disabledReason}</p>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <StripeBuyButton
                        buyButtonId={tier.buttonId}
                        publishableKey={STRIPE_PUBLISHABLE_KEY}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Microcopy */}
        <div className="max-w-3xl mx-auto text-center space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 font-medium">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure checkout powered by Stripe
          </p>
          <p>We do not store your card details.</p>
          <p>
            Donations are voluntary and non-refundable. Please{' '}
            <Link href="/contact" className="text-purple-600 hover:underline">
              contact us
            </Link>{' '}
            if you made a mistake.
          </p>
        </div>
      </div>
    </section>
  )
}
