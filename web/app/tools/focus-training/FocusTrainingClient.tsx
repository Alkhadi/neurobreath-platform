'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Brain, ArrowRight, Timer, Gamepad2, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FocusPomodoro } from '@/components/focus-pomodoro'
import { FocusDrill } from '@/components/focus/FocusDrill'
import { FocusDownloadButton } from '@/components/focus/FocusDownloadButton'
import { FocusProgressTracker } from '@/components/focus/FocusProgressTracker'

type FocusGameKey = 'focusQuest' | 'spotTarget' | 'reactionChallenge'

export default function FocusTrainingClient() {
  const [selectedGame, setSelectedGame] = useState<FocusGameKey | null>(null)
  const [gamesReady, setGamesReady] = useState(false)

  useEffect(() => {
    if (!gamesReady) return

    const container = document.getElementById('focus-game-container')
    if (!container) return

    if (!selectedGame) {
      container.innerHTML = ''
      return
    }

    const anyWindow = window as unknown as {
      NBFocusGames?: { init: (containerId: string, gameType: string) => void }
    }

    anyWindow.NBFocusGames?.init('focus-game-container', selectedGame)
  }, [gamesReady, selectedGame])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <section className="py-12 md:py-16">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm">Focus training</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Focus — Sprints with Recovery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make focus kinder: short sprints, clear goals, and recovery breaks. Works well alongside ADHD routines
              and reasonable adjustments at work.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button asChild size="lg" className="px-8">
              <Link href="#focus-protocols">
                <Timer className="mr-2 h-5 w-5" />
                Start a protocol
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="#focus-drill">
                <Brain className="mr-2 h-5 w-5" />
                Try the 3×5 drill
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="main-content" className="py-10 md:py-14 bg-white/60 dark:bg-gray-900/30 scroll-mt-20" role="main">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw] space-y-6">
          <Card id="focus-protocols" className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-3">Focus protocols</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="font-medium text-foreground">2-minute reset:</span> 4 Box cycles + eyes on a single point.</li>
              <li><span className="font-medium text-foreground">5-minute:</span> Coherent 5-5 + brief stretch.</li>
              <li><span className="font-medium text-foreground">10-minute:</span> 2× Coherent 5-5 + 1-minute quiet.</li>
            </ul>

            <div className="flex flex-wrap gap-3 mt-5">
              <Button asChild>
                <Link href="/techniques/coherent?minutes=5">
                  Start 5-minute <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tools/adhd-tools">ADHD Tools</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tools/anxiety-tools">Anxiety Tools</Link>
              </Button>
            </div>
          </Card>

          <FocusProgressTracker />

          <Card className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Try Focus Training Games</h2>
                <p className="text-muted-foreground mt-1">
                  Practice your focus skills with gentle, interactive games. No pressure, just fun practice.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <Button
                    type="button"
                    variant={selectedGame === 'focusQuest' ? 'default' : 'outline'}
                    onClick={() => setSelectedGame('focusQuest')}
                  >
                    🎯 Focus Quest
                  </Button>
                  <Button
                    type="button"
                    variant={selectedGame === 'spotTarget' ? 'default' : 'outline'}
                    onClick={() => setSelectedGame('spotTarget')}
                  >
                    🔍 Spot the Target
                  </Button>
                  <Button
                    type="button"
                    variant={selectedGame === 'reactionChallenge' ? 'default' : 'outline'}
                    onClick={() => setSelectedGame('reactionChallenge')}
                  >
                    ⚡ Reaction Challenge
                  </Button>
                </div>

                <div className="mt-5">
                  <div
                    id="focus-game-container"
                    className={selectedGame ? 'rounded-lg border bg-background p-4' : 'hidden'}
                  />
                </div>

                <Script
                  src="/js/focus-games.js"
                  strategy="afterInteractive"
                  onLoad={() => setGamesReady(true)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8" id="focus-timer">
            <h2 className="text-2xl font-bold mb-2">ADHD-friendly focus timer</h2>
            <p className="text-muted-foreground mb-5">
              Adjust the sprint and break lengths. Use this when you want structure without perfection.
            </p>
            <FocusPomodoro />
          </Card>

          <Card className="p-6 md:p-8" id="evidence">
            <h2 className="text-2xl font-bold mb-3">Evidence & UK resources</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <a
                  className="underline underline-offset-2 hover:text-foreground"
                  href="https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acas — Adjustments for neurodiversity
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2 hover:text-foreground"
                  href="https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NHS — Talking therapies (work stress)
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <FocusDownloadButton />
            </div>
          </Card>

          <Card className="p-6 md:p-8" id="urgent-help">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-red-600" />
              <div>
                <h2 className="text-2xl font-bold">Emergency & urgent help (UK)</h2>
                <p className="text-muted-foreground mt-2">
                  If you are at immediate risk of harming yourself or someone else, call <strong>999</strong> or go to
                  A&amp;E. For urgent mental health support call <strong>NHS 111</strong> (select the mental health
                  option). You can talk 24/7 to <strong>Samaritans on 116 123</strong> (free). This site is educational
                  and is <em>not</em> medical advice.
                </p>
              </div>
            </div>
          </Card>

          <div id="focus-drill" className="scroll-mt-20">
            <FocusDrill />
          </div>

          <p className="text-xs text-muted-foreground">
            Educational content only. If focus issues are persistent or disabling, consider talking to a qualified
            clinician or occupational health provider.
          </p>
        </div>
      </section>
    </div>
  )
}
