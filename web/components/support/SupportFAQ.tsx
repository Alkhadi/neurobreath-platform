'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Is this a donation or a purchase?',
    answer:
      'This is a voluntary donation to support NeuroBreath. You are not purchasing a product or service, and donations do not entitle you to specific features or benefits beyond what is already freely available.',
  },
  {
    question: 'Do you store payment details?',
    answer:
      'No. All payments are processed securely by Stripe. We never see or store your card details. Stripe is PCI DSS compliant and uses industry-leading security.',
  },
  {
    question: 'Can I donate from outside the UK?',
    answer:
      'Yes! Stripe supports international payments. The amounts shown are in GBP (£), but you can donate from anywhere in the world. Your bank or card provider will handle the currency conversion.',
  },
  {
    question: 'Can I change or cancel a donation?',
    answer:
      'Donations are one-time contributions and non-refundable. If you made a mistake or have concerns, please contact us through our contact form and we will do our best to assist you.',
  },
  {
    question: 'Are donations tax-deductible?',
    answer:
      'NeuroBreath is not currently registered as a charity, so donations are not tax-deductible. We are an independent educational wellbeing platform.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'You can reach us through our contact form at /contact. We typically respond within 24-48 hours during business days.',
  },
]

export function SupportFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                aria-expanded={openIndex === index ? 'true' : 'false'}
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-purple-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
