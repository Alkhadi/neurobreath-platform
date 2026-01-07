'use client'

import { Wind, Target, Heart, Moon, BookOpen, Download, AlertCircle, Play, Timer, Clock } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function BreathHowToPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Wind className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Breath (how‑to)</h1>
          </div>

          {/* Quick Explainer Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold mb-3">Breathing — quick explainer</h2>
            <p className="text-muted-foreground mb-4">
              Inhale, hold, exhale with gentle timing. Start silent; add tones or voice if that helps you.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Link href="/techniques/box-breathing">
                <Button variant="outline">Box</Button>
              </Link>
              <Link href="/techniques/4-7-8">
                <Button variant="outline">4-7-8</Button>
              </Link>
              <Link href="/techniques/coherent">
                <Button variant="outline">Coherent 5-5</Button>
              </Link>
            </div>
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800">
                If you feel dizzy: pause, breathe normally, and try a shorter round later.
              </AlertDescription>
            </Alert>
          </Card>

          {/* Context Presets */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Pick your context</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/techniques/box-breathing?minutes=1">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm">Before an exam</span>
                  </div>
                </Button>
              </Link>
              <Link href="/techniques/box-breathing?minutes=1&vib=off&tts=off">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm">In a classroom</span>
                  </div>
                </Button>
              </Link>
              <Link href="/techniques/coherent?minutes=5">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-1">
                    <Timer className="h-5 w-5" />
                    <span className="text-sm">At work</span>
                  </div>
                </Button>
              </Link>
              <Link href="/techniques/4-7-8?minutes=3">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-1">
                    <Moon className="h-5 w-5" />
                    <span className="text-sm">At bedtime</span>
                  </div>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Introduction Card */}
          <Card className="p-6 mb-8 bg-white border-2 border-primary/20">
            <p className="text-lg text-center">
              Three patterns to learn: <strong>Box 4‑4‑4‑4</strong>, <strong>Coherent 5‑5</strong> (≈5–6 breaths/min), and{' '}
              <strong>4‑7‑8</strong> for settling. Keep it comfortable; stop if dizzy.
            </p>
          </Card>

          {/* Three Main Techniques */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Box Breathing */}
            <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">🟩 Box breathing (4‑4‑4‑4)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Inhale 4 • Hold 4 • Exhale 4 • Hold 4. A steady, balanced rhythm for calm and focus.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li><strong>Best for:</strong> quick grounding, pre‑task focus</li>
                <li><strong>Try:</strong> 1–2 minutes to start</li>
              </ul>
              <div className="flex flex-col gap-2">
                <Link href="/techniques/box-breathing?minutes=2" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" />
                    Start (2 min)
                  </Button>
                </Link>
                <Link href="/techniques/box-breathing" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Open timer
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Coherent Breathing */}
            <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-200">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">🟪 Coherent breathing (5‑5)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Inhale 5 • Exhale 5 (no holds). A smooth pace that many people find settling and sustainable.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li><strong>Best for:</strong> steady calm, long work blocks, easing stress</li>
                <li><strong>Try:</strong> 3–5 minutes</li>
              </ul>
              <div className="flex flex-col gap-2">
                <Link href="/techniques/coherent?minutes=5" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" />
                    Start (5 min)
                  </Button>
                </Link>
                <Link href="/techniques/coherent" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Open timer
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 4-7-8 Breathing */}
            <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-200">
              <div className="bg-indigo-100 p-3 rounded-lg inline-block mb-4">
                <Moon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">🟦 4‑7‑8 breathing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Inhale 4 • Hold 7 • Exhale 8. A longer exhale pattern often used for settling at night.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li><strong>Best for:</strong> winding down, sleep onset</li>
                <li><strong>Try:</strong> 2–3 minutes (stop if dizzy)</li>
              </ul>
              <div className="flex flex-col gap-2">
                <Link href="/techniques/4-7-8?minutes=3" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" />
                    Start (3 min)
                  </Button>
                </Link>
                <Link href="/techniques/4-7-8" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Open timer
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Evidence & Resources */}
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Evidence &amp; UK resources</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <a 
                  href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  NHS — Breathing exercises for stress
                </a>
              </li>
              <li>
                <a 
                  href="https://www.cuh.nhs.uk/patient-information/breathing-techniques-to-ease-breathlessness/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  CUH — Breathing techniques (rectangle, pursed lips)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nhsinform.scot/healthy-living/mental-wellbeing/stress/breathing-and-relaxation-exercises/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  NHS Inform — Breathing &amp; relaxation (videos)
                </a>
              </li>
            </ul>
            <Button 
              className="w-full md:w-auto"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/legacy-assets/assets/downloads/breath-resources.pdf'
                link.download = 'breath-howto-resources.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download: Breath (how‑to) — Resources (PDF)
            </Button>
          </Card>

          {/* Emergency Help */}
          <Card className="p-6 bg-red-50 border-red-200">
            <h3 className="text-xl font-bold mb-3 text-red-900">Emergency &amp; urgent help (UK)</h3>
            <p className="text-sm text-red-800">
              If you are at immediate risk of harming yourself or someone else, call <strong>999</strong> or go to A&amp;E.
              For urgent mental health support call <strong>NHS 111</strong> (select the mental health option).
              You can talk 24/7 to <strong>Samaritans on 116 123</strong> (free). This site is educational and is <em>not</em> medical advice.
            </p>
          </Card>
        </div>
      </section>
    </main>
  )
}
