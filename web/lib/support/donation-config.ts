/**
 * Donation configuration for Stripe Buy Buttons
 * 
 * All donation tiers now have active Stripe Buy Button integrations.
 */

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_live_51SstifRTUOLBisTTIFrxcGJlAejkk8Gpz6ePQLp35inNgONkYKLk1sdlochPe4AZfCwI9TlX2YblOIQfRj49oDPY00kd4nJvfr'

export interface DonationTier {
  amount: number
  buttonId: string
  label: string
  benefit: string
  disabled?: boolean
  disabledReason?: string
}

export const DONATION_TIERS: DonationTier[] = [
  {
    amount: 5,
    buttonId: 'buy_btn_1SswSLRTUOLBisTTGsxWHoQo',
    label: '£5',
    benefit: 'Helps cover hosting and maintenance costs.',
  },
  {
    amount: 10,
    buttonId: 'buy_btn_1Sswj1RTUOLBisTT0wf0JVXh',
    label: '£10',
    benefit: 'Supports development of new interactive tools.',
  },
  {
    amount: 20,
    buttonId: 'buy_btn_1Sswj1RTUOLBisTT0wf0JVXh',
    label: '£20',
    benefit: 'Funds research and evidence-based content creation.',
  },
  {
    amount: 50,
    buttonId: 'buy_btn_1SswpGRTUOLBisTTKW2S5gbF',
    label: '£50',
    benefit: 'Enables major feature development and outreach programs.',
  },
]
