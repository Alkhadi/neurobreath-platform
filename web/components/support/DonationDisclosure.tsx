'use client'

import Link from 'next/link'

export function DonationDisclosure() {
  return (
    <div className="py-8 px-4 bg-blue-50 border-l-4 border-blue-500 rounded">
      <p className="text-sm leading-relaxed text-slate-700">
        <strong>Donation disclosure:</strong> Your contribution is a voluntary donation to support NeuroBreath's development and research. It is not a purchase and does not provide special access, priority support, or guaranteed features beyond what is publicly available. NeuroBreath is not currently registered as a charity, so donations are not tax-deductible. Donations are generally non-refundable, but if you made a mistake (for example, the wrong amount or a duplicate donation), please{' '}
        <Link href="/contact" className="text-blue-600 hover:underline font-medium">
          contact us
        </Link>{' '}
        and we will review it fairly.
      </p>
    </div>
  )
}
