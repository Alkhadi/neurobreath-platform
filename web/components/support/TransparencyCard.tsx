import { Card } from '@/components/ui/card'

export function TransparencyCard() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <Card className="p-10 md:p-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Our Commitment to Transparency
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              <strong className="text-foreground">All donations are voluntary and non-refundable.</strong>{' '}
              We use donations exclusively to improve and maintain NeuroBreath services.
            </p>

            <div>
              <p className="font-semibold text-foreground mb-3 text-lg">We will never:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Put essential features behind a paywall</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Sell your personal data to third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Use intrusive advertising or tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Require payment for crisis resources</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-3 text-lg">We will always:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Keep core resources 100% free and accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Respect your privacy with local-first data storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Base our content on evidence and clinical research</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Maintain transparency about how we use donations</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
