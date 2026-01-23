'use client'

import { Heart, Coffee, CreditCard, Users, Sparkles, Gift, Target, Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

const STRIPE_DONATION_URL = "https://buy.stripe.com/28E4gy5j6cmD2wu3pk"

export default function SupportUsPage() {
  // Set page title dynamically for client component
  useEffect(() => {
    document.title = 'Support Us | NeuroBreath'
  }, [])
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Support NeuroBreath
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Help us keep mental health and neurodiversity resources free and accessible for everyone.
              Your support helps us develop new tools, create more content, and reach those who need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Why Support Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Your Support Matters</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center border-2 hover:border-purple-200 transition-all">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Free Access</h3>
              <p className="text-sm text-muted-foreground">
                All our resources remain completely free. No paywalls, no subscriptions, no ads. 
                Mental health support should be accessible to everyone, regardless of income.
              </p>
            </Card>

            <Card className="p-6 text-center border-2 hover:border-blue-200 transition-all">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">New Features</h3>
              <p className="text-sm text-muted-foreground">
                Your support helps us develop new interactive tools, breathing exercises, and 
                evidence-based resources for ADHD, autism, anxiety, and other conditions.
              </p>
            </Card>

            <Card className="p-6 text-center border-2 hover:border-pink-200 transition-all">
              <div className="bg-pink-100 p-3 rounded-full inline-block mb-4">
                <Target className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Impact</h3>
              <p className="text-sm text-muted-foreground">
                We've helped thousands of users manage anxiety, improve focus, and better understand 
                their neurodivergence. Your donation helps us reach even more people.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Donation CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 border-2 border-purple-200 shadow-2xl">
            <div className="text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
                <Coffee className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Buy Me a Coffee ☕</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                If NeuroBreath has helped you or someone you care about, consider supporting our mission. 
                Every contribution, no matter how small, helps us continue providing free, 
                evidence-based mental health resources to those who need them.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <a 
                    href={STRIPE_DONATION_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-6 w-6" />
                    Donate via Stripe
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Secure payment processing powered by Stripe. We don't store your payment details.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* What Your Support Enables */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What Your Support Enables</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Development & Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Server hosting and infrastructure costs</li>
                  <li>• Regular updates and bug fixes</li>
                  <li>• New interactive breathing tools and timers</li>
                  <li>• Mobile app development</li>
                  <li>• Accessibility improvements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Gift className="h-6 w-6 text-blue-600" />
                  Content Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Research and evidence reviews</li>
                  <li>• New condition guides and resources</li>
                  <li>• Downloadable PDFs and worksheets</li>
                  <li>• Video tutorials and demonstrations</li>
                  <li>• Professional editing and fact-checking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-6 w-6 text-green-600" />
                  Community Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• User support and feedback response</li>
                  <li>• Community moderation and safety</li>
                  <li>• Translation into multiple languages</li>
                  <li>• Outreach to underserved communities</li>
                  <li>• Partnership with schools and organizations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-6 w-6 text-amber-600" />
                  Future Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personalized AI-powered recommendations</li>
                  <li>• Progress tracking and analytics</li>
                  <li>• Integration with wearable devices</li>
                  <li>• Professional clinician dashboard</li>
                  <li>• Advanced gamification and rewards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Ways to Support */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Other Ways to Support</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-bold mb-3">Spread the Word</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share NeuroBreath with friends, family, colleagues, or on social media. 
                Help us reach more people who could benefit from our free resources.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-3">Leave Feedback</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your experience, suggest improvements, or report issues. 
                Your feedback helps us make NeuroBreath better for everyone.
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Send Feedback</Link>
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Volunteer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you a developer, designer, researcher, or mental health professional? 
                We'd love to collaborate with passionate volunteers.
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Get Involved</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Commitment to Transparency</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong>All donations are voluntary and non-refundable.</strong> We use donations exclusively 
                to improve and maintain NeuroBreath services.
              </p>
              <p>
                <strong>We will never:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Put essential features behind a paywall</li>
                <li>Sell your personal data to third parties</li>
                <li>Use intrusive advertising or tracking</li>
                <li>Require payment for crisis resources</li>
              </ul>
              <p>
                <strong>We will always:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keep core resources 100% free and accessible</li>
                <li>Respect your privacy with local-first data storage</li>
                <li>Base our content on evidence and clinical research</li>
                <li>Maintain transparency about how we use donations</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Thank You for Being Part of Our Community ❤️
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Whether you donate, share our resources, or simply use our tools, you're helping 
            us make mental health support more accessible. Together, we're making a difference.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-lg"
            asChild
          >
            <a 
              href={STRIPE_DONATION_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Heart className="h-6 w-6" />
              Support NeuroBreath Today
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}
