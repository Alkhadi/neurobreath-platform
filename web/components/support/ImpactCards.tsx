import { Users, Sparkles, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function ImpactCards() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Why Your Support Matters</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center border-2 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group">
            <div className="bg-purple-100 p-4 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">100% Free Access</h3>
            <p className="text-muted-foreground leading-relaxed">
              All our educational wellbeing resources remain completely free. No paywalls, no subscriptions, no ads.
              Mental health support should be accessible to everyone, regardless of income.
            </p>
          </Card>

          <Card className="p-8 text-center border-2 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
            <div className="bg-blue-100 p-4 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">New Features</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your support helps us develop new interactive tools, breathing exercises, and
              evidence-informed resources for ADHD, autism, anxiety, and other conditions.
            </p>
          </Card>

          <Card className="p-8 text-center border-2 hover:border-pink-300 hover:shadow-lg transition-all duration-300 group">
            <div className="bg-pink-100 p-4 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform">
              <Target className="h-10 w-10 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Community Impact</h3>
            <p className="text-muted-foreground leading-relaxed">
              We help many users manage anxiety, improve focus, and better understand
              their neurodivergence. Your donation helps us reach even more people.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
