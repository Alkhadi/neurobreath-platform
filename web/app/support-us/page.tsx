import type { Metadata } from 'next'
import { SupportHero } from '@/components/support/SupportHero'
import { ImpactCards } from '@/components/support/ImpactCards'
import { DonationPanel } from '@/components/support/DonationPanel'
import { WhereDonationsGo } from '@/components/support/WhereDonationsGo'
import { SupportFAQ } from '@/components/support/SupportFAQ'
import { TransparencyCard } from '@/components/support/TransparencyCard'
import { OtherWaysToSupport } from '@/components/support/OtherWaysToSupport'
import { FinalCTA } from '@/components/support/FinalCTA'

export const metadata: Metadata = {
  title: 'Support NeuroBreath | Help Keep Mental Health Resources Free',
  description:
    'Support NeuroBreath with a voluntary donation. Help us keep evidence-informed wellbeing resources free and accessible for everyone dealing with anxiety, ADHD, autism, and other conditions.',
  openGraph: {
    title: 'Support NeuroBreath',
    description:
      'Help us keep mental health and neurodiversity resources free and accessible for everyone.',
  },
}

/**
 * Support Us page - handles voluntary donations via Stripe Buy Buttons
 * 
 * Features:
 * - Four donation tiers (£5, £10, £20, £50)
 * - Secure Stripe integration
 * - Transparent communication about how donations are used
 * - FAQ section
 * - Multiple ways to support (donations, sharing, volunteering)
 */
export default function SupportUsPage() {
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      <SupportHero />
      <ImpactCards />
      <DonationPanel />
      <WhereDonationsGo />
      <SupportFAQ />
      <TransparencyCard />
      <OtherWaysToSupport />
      <FinalCTA />
    </main>
  )
}
