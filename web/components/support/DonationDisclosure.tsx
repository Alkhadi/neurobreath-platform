'use client'

import Link from 'next/link'

export function DonationDisclosure() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-blue-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3 text-sm font-semibold tracking-wide uppercase">
            Donation disclosure
          </div>

          <div className="p-6 sm:p-8 space-y-4 text-slate-700 leading-relaxed">
            <p className="text-base sm:text-lg">
              Your contribution is a voluntary donation to support NeuroBreath's development and research. It is not a purchase and does not provide special access, priority support, or guaranteed features beyond what is publicly available.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex gap-3 items-start">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm sm:text-base">
                  NeuroBreath is not currently registered as a charity, so donations are not tax-deductible.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm sm:text-base">
                  Donations are generally non-refundable. If you made a mistake (for example, the wrong amount or a duplicate donation), please{' '}
                  <Link href="/contact" className="text-blue-700 font-semibold hover:underline">
                    contact us
                  </Link>{' '}
                  and we will review it fairly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
