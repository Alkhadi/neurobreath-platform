'use client'

import { Heart, Shield, Users, Brain, Target, Sparkles, Mail, Download, FileText, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AboutUsPage() {
  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement('a')
    link.href = path
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              About NeuroBreath
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering neurodivergent individuals and supporting mental wellbeing through 
              evidence-based tools, accessible resources, and inclusive design.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Neuro-Inclusive</h3>
              <p className="text-sm text-muted-foreground">
                Designed specifically for autistic, ADHD, dyslexic, and neurodivergent individuals. 
                Clear patterns, predictable interfaces, and sensory-friendly design.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Evidence-Based</h3>
              <p className="text-sm text-muted-foreground">
                All techniques and resources informed by clinical research, NHS guidance, 
                and peer-reviewed studies. Rigorous, reliable, and effective.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Free & Accessible</h3>
              <p className="text-sm text-muted-foreground">
                100% free resources, no paywalls, no subscriptions. 
                Privacy-first with local storage. Mental health support for everyone.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
            <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6">
              NeuroBreath exists to make mental health and neurodiversity support accessible to everyone. 
              We provide free, evidence-based tools and resources for individuals, families, educators, and clinicians.
            </p>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto">
              We believe that effective breathing techniques, emotional regulation tools, and educational resources 
              should be available to all—especially those who are neurodivergent and may struggle with traditional approaches. 
              Our platform is designed with accessibility, inclusivity, and user empowerment at its core.
            </p>
          </Card>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What We Offer</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <Brain className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Interactive Wellbeing Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Guided breathing exercises (Box Breathing, 4-7-8, Coherent Breathing)</li>
                <li>• Anxiety and stress management tools</li>
                <li>• Mood tracking and emotional regulation</li>
                <li>• Focus and attention training games</li>
                <li>• Grounding and mindfulness exercises</li>
              </ul>
            </Card>

            <Card className="p-6">
              <FileText className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Educational Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Comprehensive guides for ADHD, Autism, Anxiety, Dyslexia</li>
                <li>• 60+ downloadable PDFs (checklists, planners, templates)</li>
                <li>• Evidence-based information on mental health conditions</li>
                <li>• Teacher resources and classroom strategies</li>
                <li>• Parent guides and family support materials</li>
              </ul>
            </Card>

            <Card className="p-6">
              <Target className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Specialized Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ADHD assessment prep and home strategies</li>
                <li>• Autism visual supports and sensory tools</li>
                <li>• Dyslexia reading training with phonics practice</li>
                <li>• Depression and mood disorder resources</li>
                <li>• Sleep hygiene and stress management</li>
              </ul>
            </Card>

            <Card className="p-6">
              <Sparkles className="h-10 w-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">For Educators & Professionals</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Teacher dashboard with learner analytics</li>
                <li>• School resources and classroom accommodations</li>
                <li>• Professional development materials</li>
                <li>• Crisis response protocols</li>
                <li>• Printable classroom posters and visual aids</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Scope & Disclaimer */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 border-2 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Scope & Disclaimer</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>Educational Support Only:</strong> NeuroBreath provides educational information, self-help tools, 
                    and resources. This platform is <strong>not</strong> medical treatment, diagnosis, or a substitute for 
                    professional healthcare.
                  </p>
                  <p>
                    <strong>When to Seek Professional Help:</strong> If you or someone you know is experiencing a mental health 
                    crisis, thoughts of self-harm, or needs medical diagnosis and treatment, please contact a qualified healthcare 
                    provider, GP, or emergency services immediately.
                  </p>
                  <p>
                    <strong>Evidence-Based but Not Medical Advice:</strong> While our content is informed by clinical research 
                    and evidence-based practices, it should complement—not replace—professional medical advice.
                  </p>
                  <p>
                    <strong>Your Responsibility:</strong> Always consult with a healthcare professional before starting any new 
                    breathing practice, especially if you have respiratory conditions, anxiety disorders, or other health concerns.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Accessibility */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Accessibility & Inclusive Design</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-3">Visual Accessibility</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• High contrast color schemes</li>
                <li>• Large, clear fonts and touch targets</li>
                <li>• Dyslexia-friendly typography options</li>
                <li>• Screen reader compatible</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-3">Sensory Considerations</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Motion controls for animations</li>
                <li>• Audio on/off toggles</li>
                <li>• Predictable, consistent layouts</li>
                <li>• Minimal sensory overload</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-3">Cognitive Support</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Clear, simple instructions</li>
                <li>• Visual timers and progress indicators</li>
                <li>• Logical navigation structure</li>
                <li>• ADHD and autism-friendly design</li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 mt-8 bg-white">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Help Us Improve:</strong> We're committed to continuous accessibility improvement. 
              If you encounter barriers or have suggestions, please{' '}
              <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
            </p>
          </Card>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Founder & Builder</h2>
          
          <Card className="p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400">
                  <Image
                    src="/alkhadi.png"
                    alt="Alkhadi Koroma - Founder"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Alkhadi Koroma</h3>
                <p className="text-muted-foreground mb-4">
                  Flutter Developer · Neuro-Inclusive Tool Creator
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Passionate about creating accessible technology that supports neurodivergent individuals and 
                  promotes mental wellbeing. Building tools that make a real difference in people's lives.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link href="mailto:support@neurobreath.app">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.linkedin.com/in/alkhadi-koroma', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    CV / Resume
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload('/images_default_profile.pdf', 'alkhadi_koroma_profile.pdf')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Profile PDF
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Download className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Free Downloads</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Printable guides and resources hosted on a fast CDN. All completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <FileText className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-bold mb-2">All Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our complete library of 60+ downloadable PDFs
              </p>
              <Link href="/resources">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  All Downloads
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <Sparkles className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-bold mb-2">Autism Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Parent quick guide for autism (UK-focused)
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDownload('/legacy-assets/assets/downloads/autism-parent-quick-guide-uk.pdf', 'autism_parent_quick_guide.pdf')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </Card>

            <Card className="p-6">
              <FileText className="h-8 w-8 text-amber-600 mb-4" />
              <h3 className="font-bold mb-2">Dyslexia Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adult resources and support guide
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDownload('/legacy-assets/assets/downloads/dyslexia-adult-resources-uk.pdf', 'dyslexia_adult_resources.pdf')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Clinical References */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Clinical References & Evidence Base</h2>
          
          <Card className="p-8">
            <p className="text-muted-foreground mb-6">
              Our breathing techniques and mental health information are informed by research from:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Research Institutions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Harvard Medical School (Dr. Herbert Benson - Relaxation Response)</li>
                  <li>• University of Arizona (Dr. Andrew Weil - 4-7-8 Breathing)</li>
                  <li>• National Institutes of Health (NIH)</li>
                  <li>• Centers for Disease Control and Prevention (CDC)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Healthcare Organizations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• NHS (UK) - Mental health and breathing guidance</li>
                  <li>• NICE (National Institute for Health and Care Excellence)</li>
                  <li>• American Psychological Association (APA)</li>
                  <li>• Mental Health Foundation (UK)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Specialist Organizations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Autism Education Trust</li>
                  <li>• CHADD (Children and Adults with ADHD)</li>
                  <li>• British Dyslexia Association</li>
                  <li>• Anxiety and Depression Association of America (ADAA)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Other Sources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• U.S. Department of Veterans Affairs</li>
                  <li>• Navy SEAL training programs (Box Breathing)</li>
                  <li>• Peer-reviewed journal articles</li>
                  <li>• Clinical practice guidelines</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <Shield className="h-10 w-10 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Privacy & Data Protection</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>Your data stays on your device.</strong> All your progress, sessions, preferences, and personal 
                    information are stored locally in your browser using localStorage. We don't collect, track, sell, or share your data.
                  </p>
                  <p>
                    <strong>No accounts required.</strong> You don't need to create an account or provide personal information 
                    to use NeuroBreath. Use the platform anonymously with full functionality.
                  </p>
                  <p>
                    <strong>You're in control.</strong> Clear your browser data anytime to remove all stored information. 
                    Your privacy is not just a policy—it's built into how the platform works.
                  </p>
                  <p>
                    <strong>Teacher Dashboard Exception:</strong> Teachers who use the analytics dashboard may optionally 
                    track aggregate student progress. This data is also stored locally and never shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our tools, download resources, and discover support for your journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/breathing">
              <Button size="lg">
                Start Breathing Exercises
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Download Resources
              </Button>
            </Link>
            <Link href="/schools">
              <Button size="lg" variant="outline">
                For Educators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            NeuroBreath — Free, evidence-based tools for mental wellbeing and neurodiversity support
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/contact" className="text-primary hover:underline">
              Contact Us
            </Link>
            <Link href="/resources" className="text-primary hover:underline">
              Resources
            </Link>
            <Link href="/schools" className="text-primary hover:underline">
              For Schools
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
