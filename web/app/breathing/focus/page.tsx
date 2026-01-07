'use client'

import { useState, useEffect } from 'react'
import { Brain, Target, Timer, Trophy, Zap, BookOpen, Download, Eye, Gamepad2, Play, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function FocusPage() {
  const [practiceCount, setPracticeCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Load practice count from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('nb_focus_practice_count')
    if (stored) {
      setPracticeCount(parseInt(stored, 10))
    }
  }, [])

  // Save practice count
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nb_focus_practice_count', practiceCount.toString())
    }
  }, [practiceCount, mounted])

  const handleMarkPractice = () => {
    setPracticeCount(prev => prev + 1)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Focus — Sprints with Recovery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make focus kinder: short sprints, clear goals, and recovery breaks. Works well alongside ADHD routines and reasonable adjustments at work.
            </p>
          </div>

          {/* Focus Protocols Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Timer className="h-6 w-6" />
              Focus protocols
            </h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <strong>2-minute reset:</strong> 4 Box cycles + eyes on a single point.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-purple-100 p-1.5 rounded-full mt-0.5">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <strong>5-minute:</strong> Coherent 5-5 + brief stretch.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-indigo-100 p-1.5 rounded-full mt-0.5">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <strong>10-minute:</strong> 2× Coherent 5-5 + 1-minute quiet.
                </div>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href="/techniques/coherent?minutes=5">
                <Button>
                  <Play className="mr-2 h-4 w-4" />
                  Start 5-minute
                </Button>
              </Link>
              <Link href="/tools/adhd-tools">
                <Button variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  ADHD Tools
                </Button>
              </Link>
              <Link href="/tools/anxiety-tools">
                <Button variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  Anxiety Tools
                </Button>
              </Link>
            </div>
          </Card>

          {/* Progress Tracker Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-600" />
              Track your best focus run
            </h2>
            <p className="text-muted-foreground mb-4">
              Tap after a focus block to record progress.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                onClick={handleMarkPractice}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark 1 min practised
              </Button>
              <Badge variant="secondary" className="text-base px-4 py-2">
                Completed: {practiceCount}
              </Badge>
            </div>
          </Card>

          {/* Focus Training Games */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-purple-600" />
              🎮 Try Focus Training Games
            </h2>
            <p className="text-muted-foreground mb-6">
              Practice your focus skills with gentle, interactive games. No pressure, just fun practice.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/breathing/training/focus-garden">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8 text-blue-600" />
                    <span className="font-bold">🎯 Focus Quest</span>
                  </div>
                </Button>
              </Link>
              <Link href="/breathing/training/focus-garden">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="h-8 w-8 text-purple-600" />
                    <span className="font-bold">🔍 Spot the Target</span>
                  </div>
                </Button>
              </Link>
              <Link href="/breathing/training/focus-garden">
                <Button variant="outline" className="w-full h-auto py-6">
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="h-8 w-8 text-amber-600" />
                    <span className="font-bold">⚡ Reaction Challenge</span>
                  </div>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Focus Drill Section */}
          <Card className="p-6 mb-6 border-2 border-primary/20">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Target className="h-6 w-6" />
              Focus Drill (3×5)
            </h2>
            <p className="text-muted-foreground mb-4">
              Single‑task focus: 3 blocks × 5 minutes. Pick one small outcome. Notifications off; one tab only.
            </p>
            <div className="flex gap-3">
              <Button className="bg-primary">
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
              <Button variant="outline" disabled>
                Stop
              </Button>
            </div>
          </Card>

          {/* Evidence & Resources */}
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Evidence &amp; UK resources</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <a 
                  href="https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Acas — Adjustments for neurodiversity
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  NHS — Talking therapies (work stress)
                </a>
              </li>
            </ul>
            <Button 
              className="w-full md:w-auto"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/legacy-assets/assets/downloads/focus-resources.pdf'
                link.download = 'focus-sprints-recovery-resources.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download: Focus — Sprints with Recovery — Resources (PDF)
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
