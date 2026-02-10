'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is NeuroBreath right now—fully launched or still in development?',
    answer:
      'NeuroBreath is actively in development. The website is live with growing evidence-informed resources for neurodivergent wellbeing (ADHD, autism, anxiety, depression), but we are continuously building, refining, and expanding. We are not yet a registered charity and expect this development phase to continue through March 2026.',
  },
  {
    question: 'Why are you accepting donations during development?',
    answer:
      'We accept donations to support the research, design, and careful build work required to launch NeuroBreath responsibly. These funds help us validate our approach, test evidence-informed practice, and invest in the infrastructure and content quality that users deserve. Donations signal genuine support for our mission and help us plan with confidence.',
  },
  {
    question: 'How will my donation be used?',
    answer:
      'Donations support: hosting and domain costs; research into evidence-informed interventions; content development and fact-checking; design and user experience refinement; security and accessibility enhancements; and team time to build and maintain the platform. We prioritise sustainability and responsible use of every contribution.',
  },
  {
    question: 'Is NeuroBreath medical advice or a replacement for professional care?',
    answer:
      'No. NeuroBreath is an educational platform offering practical techniques, wellbeing support, and evidence-informed guidance. It is not medical advice and does not replace professional healthcare, therapy, or medical treatment. Always consult qualified professionals for diagnosis, treatment, or urgent concerns.',
  },
  {
    question: 'Is my payment secure?',
    answer:
      'Yes. All payments are processed securely through Stripe, a PCI DSS Level 1 compliant payment processor. We never see or store your card details. Stripe uses industry-leading encryption and security standards.',
  },
  {
    question: 'Do you store or sell my personal data?',
    answer:
      'No. We do not sell your data to anyone. We collect only essential information needed to process your donation and issue a receipt. Stripe handles payment data according to their privacy standards. You can contact us at /contact with any privacy concerns.',
  },
  {
    question: 'Is this a donation or a purchase?',
    answer:
      'This is a voluntary donation to support NeuroBreath\'s mission. You are not purchasing a product or service, and donations do not entitle you to specific features or benefits beyond what is already freely available to all users.',
  },
  {
    question: 'Are donations refundable?',
    answer:
      'Donations are one-time, voluntary contributions and are generally non-refundable. However, if you made a mistake (e.g., duplicate payment, wrong amount, or technical error), please contact us immediately through our contact form and we will investigate and assist you.',
  },
  {
    question: 'Will I receive a receipt?',
    answer:
      'Yes. Stripe will automatically send a receipt to the email address you provide during checkout. This receipt includes a transaction ID and payment details. If you do not receive it, check your spam folder or contact us.',
  },
  {
    question: 'Can I donate from outside the UK?',
    answer:
      'Yes! Stripe supports international payments. The amounts shown are in GBP (£), but you can donate from anywhere in the world. Your bank or card provider will handle currency conversion at their current rate.',
  },
  {
    question: 'Can I change or cancel a donation?',
    answer:
      'Donations are one-time, processed immediately, and cannot be cancelled once submitted. If you made a mistake or have concerns, please contact us through our contact form as soon as possible and we will do our best to assist you.',
  },
  {
    question: 'Are donations tax-deductible?',
    answer:
      'At this time, donations to NeuroBreath are not tax-deductible because we are not currently registered as a charity. NeuroBreath is an independent educational wellbeing platform, and the website is still in active development.\n\nWe have already secured our domain and are investing heavily in extensive research and careful build work to ensure we deliver credible, plausible, and high-value support—including training, routine cultivation, practical techniques, and condition-focused guidance—in a responsible and evidence-informed way.\n\nOnce we complete this development phase, our intention is to formalise the organisation by registering with Companies House, and then expand our presence across prominent social media platforms to improve accessibility, communication, and community support.\n\nIf you choose to donate now, please view it as supporting the platform\'s development and research work rather than as a charitable contribution for tax purposes.',
  },
  {
    question: 'Where can I contact you if I have a question or made a mistake?',
    answer:
      'You can reach us through our contact form at /contact or email us directly at hello@neurobreath.io. We typically respond within 24-48 hours during business days. For urgent payment issues, contact your payment provider or Stripe support immediately.',
  },
]

export function SupportFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const ariaExpanded: 'true' | 'false' = isOpen ? 'true' : 'false'
            return (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                {...{ 'aria-expanded': ariaExpanded }}
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-purple-600 flex-shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
