'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Eye, Hand, Ear, Heart, Coffee, BookOpen, Download, Save, Play, Wind, Users, Brain } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function MindfulnessPage() {
  const [reflectionNotes, setReflectionNotes] = useState('')
  const [mounted, setMounted] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Load reflection notes from localStorage
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('nb_mindfulness_reflection')
    if (stored) {
      setReflectionNotes(stored)
    }
  }, [])

  const handleSaveReflection = () => {
    if (mounted) {
      localStorage.setItem('nb_mindfulness_reflection', reflectionNotes)
      setSaveMessage('Saved ✓')
      setTimeout(() => setSaveMessage(''), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mindfulness — Small, Repeated Moments</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mindfulness helps us notice and unhook from loops of worry and low mood. NICE recognises mindfulness and MBCT within evidence‑based care for depression.
            </p>
          </div>

          {/* 1-minute Grounding Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              1-minute grounding
            </h2>
            <div className="bg-white/80 p-4 rounded-lg mb-4">
              <p className="font-medium mb-3">Try 5-4-3-2-1 technique:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div><strong>5 things</strong> you can see</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 p-1.5 rounded-full mt-0.5">
                    <Hand className="h-4 w-4 text-purple-600" />
                  </div>
                  <div><strong>4 things</strong> you can feel</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-pink-100 p-1.5 rounded-full mt-0.5">
                    <Ear className="h-4 w-4 text-pink-600" />
                  </div>
                  <div><strong>3 things</strong> you can hear</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                    <Wind className="h-4 w-4 text-green-600" />
                  </div>
                  <div><strong>2 things</strong> you can smell</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-amber-100 p-1.5 rounded-full mt-0.5">
                    <Coffee className="h-4 w-4 text-amber-600" />
                  </div>
                  <div><strong>1 thing</strong> you can taste</div>
                </li>
              </ul>
            </div>
            <Link href="/conditions/anxiety">
              <Button variant="outline">
                <Brain className="mr-2 h-4 w-4" />
                When thoughts race
              </Button>
            </Link>
          </Card>

          {/* Reflection & Log Card */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-600" />
              Reflect &amp; log (private)
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Write a few words about how you feel. Saved only on your device.
            </p>
            <Textarea
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="Write your reflection here..."
              rows={5}
              className="mb-4"
              aria-label="Reflection notes"
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSaveReflection}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              {saveMessage && (
                <span className="text-sm text-green-600 font-medium">{saveMessage}</span>
              )}
            </div>
          </Card>

          {/* Three Technique Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 3-minute breathing space */}
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Wind className="h-6 w-6 text-blue-600" />
                3‑minute breathing space
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground mb-4">
                <li>
                  <strong className="text-foreground">1. Aware:</strong> what's here? thoughts, feelings, sensations.
                </li>
                <li>
                  <strong className="text-foreground">2. Gather:</strong> attention on the breath, gentle count 1‑10.
                </li>
                <li>
                  <strong className="text-foreground">3. Expand:</strong> include the body; soften shoulders/jaw.
                </li>
              </ol>
            </Card>

            {/* Body scan */}
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Body scan (brief)
              </h3>
              <p className="text-sm text-muted-foreground">
                Move attention from toes to head. Notice and name <em className="text-foreground">pressure, warmth, cool, contact</em>. 
                If the mind wanders, gently return.
              </p>
            </Card>

            {/* Everyday mindful moments */}
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-pink-600" />
                Everyday mindful moments
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Coffee className="h-4 w-4 mt-0.5 text-pink-600 flex-shrink-0" />
                  <span>One mindful sip/bite.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Wind className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Doorway pause: one slow breath.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>"Note three things" on a short walk.</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* 3-Minute Breathing Space Drill */}
          <Card className="p-6 mb-6 border-2 border-primary/20">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Wind className="h-6 w-6" />
              3‑Minute Breathing Space
            </h2>
            <p className="text-muted-foreground mb-4">
              1) Notice posture &amp; breath. 2) Follow 10 breaths. 3) Widen attention to sound and body. Return kindly when distracted.
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
                  href="https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  NHS — Mindfulness overview
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nice.org.uk/guidance/ng222" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  NICE — Depression NG222 (mindfulness/MBCT)
                </a>
              </li>
              <li>
                <a 
                  href="https://sussexmindfulnesscentre.nhs.uk/wp-content/uploads/2023/09/Referrer-info-sheet.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Sussex Mindfulness Centre — NICE first‑line note (PDF)
                </a>
              </li>
            </ul>
            <Button 
              className="w-full md:w-auto"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/legacy-assets/assets/downloads/mindfulness-resources.pdf'
                link.download = 'mindfulness-small-repeated-moments-resources.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download: Mindfulness — Small, Repeated Moments — Resources (PDF)
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
