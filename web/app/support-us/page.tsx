import type { Metadata } from 'next'
import { SupportHero } from '@/components/support/SupportHero'
import { DonationPanel } from '@/components/support/DonationPanel'
import { DonationDisclosure } from '@/components/support/DonationDisclosure'
import { SupportFAQ } from '@/components/support/SupportFAQ'
import { RoadmapAndAccountability } from '@/components/support/RoadmapAndAccountability'

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
 * Page structure:
 * 1. Hero: Mission statement and development phase explanation
 * 2. Donation Panel: Four tiers (£5, £10, £20, £50) with Stripe Buy Buttons
 * 3. Donation Disclosure: One-paragraph voluntary donation and terms disclosure
 * 4. FAQ: 13 comprehensive questions covering donations, privacy, security, and roadmap
 * 5. Roadmap & Accountability: Two milestones with transparent timelines and deliverables
 * 
 * Security & compliance:
 * - All Stripe Buy Button IDs and payment handlers are preserved unchanged
 * - No card details stored; Stripe handles all PCI compliance
 * - All copy emphasizes voluntary donation, no tax-deductible claims
 * - Accessibility: Semantic heading hierarchy, skip links, keyboard navigation
 */
export default function SupportUsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      <SupportHero />
      <DonationPanel />
      <DonationDisclosure />
      <SupportFAQ />
      <RoadmapAndAccountability />
    </main>
  )
}
