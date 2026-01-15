'use client'

import { Wind, Heart, Brain, Target, Zap, Moon, Play, BookOpen, Download, ChevronRight, Timer, Activity } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EvidenceFooter, BREATHING_EVIDENCE_SOURCES } from '@/components/evidence-footer'

export default function BreathingExercisesPage() {
  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-6">
              <Wind className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Breathing Exercises
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Evidence-based breathing techniques for calm, focus, and wellbeing. 
              Interactive guided exercises with audio support and visual timers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#exercises">
                <Button size="lg" className="px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Start Practicing
                </Button>
              </a>
              <a href="#benefits">
                <Button size="lg" variant="outline" className="px-8">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-white/80 backdrop-blur">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">6</div>
                <div className="text-sm text-muted-foreground">Breathing Techniques</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1-10</div>
                <div className="text-sm text-muted-foreground">Minutes per session</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Science</div>
                <div className="text-sm text-muted-foreground">Evidence-based</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Free</div>
                <div className="text-sm text-muted-foreground">No cost or login</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Breathing Exercises */}
      <section id="exercises" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Play className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Interactive Exercises</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose a technique based on your needs. Each includes visual guidance, audio instructions, and customizable timers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Box Breathing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Box Breathing (4-4-4-4)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Focus, stress relief, test anxiety
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Also known as "square breathing" or "tactical breathing." Used by Navy SEALs and athletes to stay calm under pressure.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-6">
                <li>• Breathe in: 4 seconds</li>
                <li>• Hold: 4 seconds</li>
                <li>• Breathe out: 4 seconds</li>
                <li>• Hold: 4 seconds</li>
              </ul>
              <Link href="/techniques/box-breathing">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try Box Breathing
                </Button>
              </Link>
            </Card>

            {/* 4-7-8 Breathing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Moon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">4-7-8 Breathing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Sleep, anxiety, calming before bed
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Developed by Dr. Andrew Weil. Extended exhale activates the parasympathetic nervous system for deep relaxation.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-6">
                <li>• Breathe in: 4 seconds</li>
                <li>• Hold: 7 seconds</li>
                <li>• Breathe out: 8 seconds</li>
                <li>• Repeat 4 times</li>
              </ul>
              <Link href="/techniques/4-7-8">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try 4-7-8 Breathing
                </Button>
              </Link>
            </Card>

            {/* Coherent Breathing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Coherent Breathing (5-5)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Heart rate variability, balance, resilience
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Breathe at 5-6 breaths per minute to maximize heart rate variability and promote autonomic nervous system balance.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-6">
                <li>• Breathe in: 5 seconds</li>
                <li>• Breathe out: 5 seconds</li>
                <li>• Maintain steady rhythm</li>
                <li>• Practice 5-20 minutes</li>
              </ul>
              <Link href="/techniques/coherent">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try Coherent Breathing
                </Button>
              </Link>
            </Card>

            {/* SOS Breathing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-red-100 p-3 rounded-lg inline-block mb-4">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">SOS Breathing (60 seconds)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Panic attacks, acute anxiety, emergency calm
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Quick, powerful technique for immediate anxiety relief. Can be done anywhere, anytime you need rapid calming.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-6">
                <li>• 60-second guided session</li>
                <li>• Rapid anxiety reduction</li>
                <li>• Portable and discreet</li>
                <li>• No preparation needed</li>
              </ul>
              <Link href="/techniques/sos">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try SOS Breathing
                </Button>
              </Link>
            </Card>

            {/* Belly Breathing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 p-3 rounded-lg inline-block mb-4">
                <Activity className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Belly Breathing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> Beginners, children, diaphragmatic training
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Simple, foundational technique focusing on diaphragmatic breathing. Great for younger students and beginners.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-6">
                <li>• Place hand on belly</li>
                <li>• Belly expands on inhale</li>
                <li>• Belly deflates on exhale</li>
                <li>• Slow, natural rhythm</li>
              </ul>
              <Link href="/breathing/breath">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try Belly Breathing
                </Button>
              </Link>
            </Card>

            {/* Focus Breathing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-lg inline-block mb-4">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Focus Breathing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Best for:</strong> ADHD, concentration, mental clarity
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Specialized breathing exercises designed to improve attention, reduce mental fog, and enhance cognitive performance.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-6">
                <li>• Attention training</li>
                <li>• Mental clarity</li>
                <li>• ADHD-friendly pace</li>
                <li>• Visual anchors</li>
              </ul>
              <Link href="/breathing/focus">
                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Try Focus Breathing
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Why Practice Breathing Exercises?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Scientific evidence shows breathing exercises provide powerful benefits for mental and physical health
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Mental Health Benefits</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Reduces anxiety:</strong> Meta-analysis shows medium effect size (d=-0.42) for anxiety reduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Lowers stress:</strong> Activates parasympathetic nervous system, reducing cortisol</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Improves focus:</strong> Increases prefrontal cortex activity and attention control</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Better sleep:</strong> 4-7-8 breathing helps with sleep onset and quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Emotional regulation:</strong> Helps manage anger, frustration, and overwhelm</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Physical Health Benefits</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Lowers blood pressure:</strong> Slow breathing (5-6 breaths/min) reduces BP</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Heart rate variability:</strong> Coherent breathing maximizes HRV</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Better oxygenation:</strong> Diaphragmatic breathing improves oxygen delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Reduces pain:</strong> Activates endogenous opioid system</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Immune support:</strong> Reduces inflammation markers</span>
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 mt-8 bg-white">
            <h3 className="text-xl font-bold mb-4">Clinical Evidence</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <p className="mb-2"><strong>Research Sources:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Harvard Medical School - Dr. Herbert Benson</li>
                  <li>• University of Arizona - Dr. Andrew Weil</li>
                  <li>• NHS (UK) breathing guidance</li>
                  <li>• U.S. Department of Veterans Affairs</li>
                </ul>
              </div>
              <div>
                <p className="mb-2"><strong>Optimal Practice:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• 5-20 minutes daily for best results</li>
                  <li>• 5-6 breaths per minute optimal rate</li>
                  <li>• Consistent practice &gt; duration</li>
                  <li>• Safe for most people (consult doctor if concerns)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">How to Get Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold mb-2">Choose a Technique</h3>
              <p className="text-sm text-muted-foreground">
                Pick based on your goal: calm, focus, sleep, or emergency relief
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-bold mb-2">Follow the Guide</h3>
              <p className="text-sm text-muted-foreground">
                Use visual timers and audio instructions. Start with 2-5 minutes
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-bold mb-2">Practice Regularly</h3>
              <p className="text-sm text-muted-foreground">
                Daily practice brings best results. Track your progress over time
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <Download className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Downloadable Resources</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take breathing exercises offline with our printable guides
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/legacy-assets/assets/downloads/breathing-cheat-sheet.pdf'
                link.download = 'breathing-cheat-sheet.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Breathing Cheat Sheet (PDF)
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/legacy-assets/assets/downloads/adhd_selfcare_breathing_cards.pdf'
                link.download = 'breathing-cards.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Breathing Cards (PDF)
            </Button>
            <Link href="/downloads">
              <Button size="lg" variant="outline">
                View All Downloads
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Tools & Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Heart className="h-8 w-8 text-pink-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Anxiety Tools</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive anxiety management with CBT tools, grounding exercises, and mood tracking
              </p>
              <Link href="/anxiety">
                <Button variant="outline" className="w-full">
                  Explore Anxiety Tools
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Brain className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Stress Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stress reduction techniques, relaxation games, and progress tracking tools
              </p>
              <Link href="/tools/stress-tools">
                <Button variant="outline" className="w-full">
                  Stress Tools
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <BookOpen className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">School Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Breathing exercises for classroom use, teacher guides, and student resources
              </p>
              <Link href="/schools">
                <Button variant="outline" className="w-full">
                  For Educators
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Disclaimer:</strong> Breathing exercises are generally safe for most people. 
            If you have respiratory conditions, cardiovascular issues, or feel dizzy or uncomfortable during practice, 
            please stop and consult a healthcare professional.
          </p>
          <p className="text-sm text-muted-foreground">
            All techniques are based on clinical research from Harvard Medical School, University of Arizona, 
            NHS, and peer-reviewed studies (2025).
          </p>
        </div>
      </footer>

      {/* Evidence Sources */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <EvidenceFooter sources={BREATHING_EVIDENCE_SOURCES} />
        </div>
      </section>
    </main>
  )
}

