'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-4">Blog · AI-powered hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AI-Powered Neurodiversity &amp; Wellbeing Hub
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Free guidance on autism, ADHD, dyslexia, breathing practices, mood, sleep, and workplace 
            wellbeing for families, teachers, young people, and adults across the UK &amp; US.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('ai-chat')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Ask a question now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('blog-directory')}
              className="border-2 font-semibold"
            >
              Browse all topics
            </Button>
          </div>

          <p className="text-sm text-muted-foreground font-medium">
            Trusted. Neuro-inclusive. Always evidence-informed.
          </p>
        </div>

        <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">What's New</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-sm mb-1">📚 Visual Learning Cards</p>
              <p className="text-xs text-muted-foreground">
                Every answer now includes teaching-grade visual cards you can download, print, or share.
              </p>
            </div>
            <div>
              <p className="font-medium text-sm mb-1">🎯 Audience Mode</p>
              <p className="text-xs text-muted-foreground">
                Tailor answers for parents, teachers, young people, adults, or workplace needs.
              </p>
            </div>
            <div>
              <p className="font-medium text-sm mb-1">📖 Evidence-Grounded</p>
              <p className="text-xs text-muted-foreground">
                Every answer cites NHS, NICE, and peer-reviewed research (PubMed).
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs mt-4">
            Educational only · Not a diagnosis service
          </Badge>
        </Card>
      </div>
    </Card>
  )
}


