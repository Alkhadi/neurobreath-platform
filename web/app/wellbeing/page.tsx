'use client';

import Link from 'next/link';
import { Activity, AlertCircle, Heart, BookOpen, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/page/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreathingExercise } from '@/components/BreathingExercise';

export default function WellbeingPage() {
  return (
    <main className="min-h-screen">
      {/* Accessibility skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Band 1: Hero ─────────────────────────────────────────────────────── */}
      <section
        id="main-content"
        className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-emerald-50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-700 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-slate-400" aria-hidden="true">›</span>
            <span className="text-slate-700 font-medium">Wellbeing</span>
          </nav>

          <PageHeader
            title="Wellbeing"
            description="A calm space for everyday breathing practice and a 60-second reset when you need it most."
            showMetadata
          />

          <p className="text-sm text-slate-500 text-center mt-3">
            Educational information only — not medical advice.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button asChild size="lg" className="px-8 bg-teal-600 hover:bg-teal-500 text-white shadow-lg">
              <Link href="/uk/help-me-choose">
                <Activity className="mr-2 h-5 w-5" />
                Help me choose
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 border-teal-300 text-teal-700 hover:bg-teal-50">
              <Link href="/uk/journeys">
                <BookOpen className="mr-2 h-5 w-5" />
                Starter journeys
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Band 2: Crisis / About SOS-60 ──────────────────────────────────── */}
      <section
        id="sos-info"
        className="py-12 px-4 bg-amber-50 border-y border-amber-200"
        aria-label="UK crisis and urgent support"
      >
        <div className="max-w-7xl mx-auto">
          <Card className="p-3 sm:p-4 md:p-6 bg-white border-amber-200 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold text-amber-900">About SOS-60</h2>
                <p className="text-sm text-amber-800 mt-1 max-w-2xl">
                  A single, quiet minute with minimal UI. Start or stop any time. If you feel worse,
                  stop and use the UK crisis links below.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <a
                href="https://www.samaritans.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Samaritans 116 123
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://111.nhs.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                NHS 111 Online
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://giveusashout.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Shout 85258
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Band 3: Technique instruction ──────────────────────────────────── */}
      <section
        id="technique-instruction"
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">
              How to use this breathing technique
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Educational information only; not medical advice.
            </p>
          </header>

          {/* Practice anchor highlight */}
          <Card className="p-5 bg-teal-50 border-teal-200">
            <p className="text-sm font-medium text-teal-900 text-center">
              <strong>Practice anchor:</strong> 10–20 min per day in 2–4 gentle bouts (~4.5–6 breaths/min).
              Pair a 60-second SOS before or after stressful moments.
            </p>
          </Card>

          {/* Quick start card */}
          <Card className="p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick start (90 seconds)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-700 mb-6">
              <li>Sit or stand comfortably; soften shoulders and jaw.</li>
              <li>Inhale quietly through the nose, exhale slightly longer.</li>
              <li>Keep rhythm light — aim around 4.5–6 breaths each minute.</li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Link href="/techniques/sos?minutes=1">▶ SOS 60-second reset</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/breathing/breath">Breath basics</Link>
              </Button>
            </div>
          </Card>

          {/* Daily dose / Neurodivergent tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-3 sm:p-4 md:p-6">
              <h3 className="font-semibold text-lg text-slate-900 mb-3">Daily dose ideas</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li>
                  <strong className="text-slate-900">Minimum:</strong> 2–5 min once or twice daily
                  + SOS before/after stress.
                </li>
                <li>
                  <strong className="text-slate-900">Standard:</strong> 10 min/day (for example,
                  2×5 min) on most days.
                </li>
                <li>
                  <strong className="text-slate-900">Training:</strong> Up to 20 min/day for 4–8
                  weeks, then maintain.
                </li>
              </ul>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6">
              <h3 className="font-semibold text-lg text-slate-900 mb-3">Neurodivergent tips</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li>
                  <strong className="text-slate-900">ADHD:</strong> stack short, predictable bouts;
                  pair with visual timers.
                </li>
                <li>
                  <strong className="text-slate-900">Autism:</strong> offer silent/low-stimulus
                  modes and steady counts.
                </li>
                <li>Allow visual pacing around 4.5–7 breaths/min when preferred.</li>
              </ul>
            </Card>
          </div>

          {/* Expandable: more plans, safety, rationale */}
          <details className="group rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            <summary className="cursor-pointer select-none list-none flex items-center justify-between px-6 py-4 font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
              More daily plans, safety, and rationale
              <span
                className="ml-2 text-slate-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ▾
              </span>
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6 pt-4">
              <Card className="p-5 bg-white">
                <h4 className="font-semibold text-sm text-slate-900 mb-3">
                  Where it fits in the day
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>
                    <strong>Before a demand:</strong> run 60–90 s to settle.
                  </li>
                  <li>
                    <strong>Breaks:</strong> 3–5 min mid-morning or afternoon.
                  </li>
                  <li>
                    <strong>Wind-down:</strong> 5–8 min before bed.
                  </li>
                </ul>
                <h5 className="font-semibold text-sm text-slate-900 mt-4 mb-2">Example plan</h5>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>
                    <strong>Busy day:</strong> SOS on waking → 5 min mid-morning → 1 min
                    pre-meeting → 5–8 min at night.
                  </li>
                  <li>
                    <strong>Training phase:</strong> 10 min morning + 10 min evening.
                  </li>
                </ul>
              </Card>

              <Card className="p-5 bg-white">
                <h4 className="font-semibold text-sm text-slate-900 mb-3">
                  Safety &amp; adaptations
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>Stop if dizzy, air-hungry, or tingling; resume normal breathing.</li>
                  <li>Keep breathing gentle; avoid straining holds or forced exhales.</li>
                  <li>
                    Check with a clinician if you have asthma, POTS, cardiac/respiratory
                    conditions, are pregnant, or manage panic hyperventilation.
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-3">
                  Adjust intensity to comfort; aim for calm regulation, not performance.
                </p>
              </Card>

              <Card className="p-5 bg-white">
                <h4 className="font-semibold text-sm text-slate-900 mb-3">
                  Evidence &amp; rationale
                </h4>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>
                    NHS practice guides often suggest ~10 minutes twice daily for
                    self-regulation skills.
                  </li>
                  <li>
                    HRV-biofeedback programmes typically use ~20 minutes per day in short
                    blocks during training.
                  </li>
                  <li>
                    Resonance/coherent breathing usually lands around 4.5–7 breaths/min for
                    safe autonomic down-regulation.
                  </li>
                </ul>
                <h5 className="font-semibold text-xs text-slate-900 mt-4 mb-2">
                  Trusted sources
                </h5>
                <ul className="space-y-1 text-xs">
                  <li>
                    <a
                      href="https://www.cuh.nhs.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 underline hover:text-teal-800"
                    >
                      Cambridge University Hospitals NHS
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.nhs.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 underline hover:text-teal-800"
                    >
                      NHS — breathing &amp; self-regulation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.frontiersin.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 underline hover:text-teal-800"
                    >
                      Frontiers — HRV-biofeedback reviews
                    </a>
                  </li>
                </ul>
              </Card>
            </div>
          </details>
        </div>
      </section>

      {/* ── Band 4: 60-second SOS session ──────────────────────────────────── */}
      <section
        id="session"
        className="py-16 px-4 bg-gradient-to-br from-teal-50/70 via-blue-50/50 to-emerald-50/70"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">60-second SOS</h2>
            <p className="text-sm text-slate-600 mt-2">
              One-minute reset: gentle <strong>inhale 4</strong> → <strong>exhale 4</strong> to
              calm.
            </p>
          </div>
          <BreathingExercise initialPattern="sos" />
        </div>
      </section>

      {/* ── Band 5: Related guides ──────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Related guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/guides/quick-calm-in-5-minutes"
              className="nb-surface nb-surface-interactive nb-focus block p-6 group"
            >
              <Heart className="h-6 w-6 text-teal-500 mb-3" aria-hidden="true" />
              <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                Quick calm in 5 minutes
              </p>
              <p className="mt-2 text-xs text-slate-600">
                A short, practical reset using breathing, grounding, and gentle movement.
              </p>
            </Link>
            <Link
              href="/guides/body-scan-for-stress"
              className="nb-surface nb-surface-interactive nb-focus block p-6 group"
            >
              <Activity className="h-6 w-6 text-teal-500 mb-3" aria-hidden="true" />
              <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                Body scan for stress relief
              </p>
              <p className="mt-2 text-xs text-slate-600">
                A simple body scan to release tension and reset your attention.
              </p>
            </Link>
            <Link
              href="/guides/anxiety-stress/breathing-for-anxiety"
              className="nb-surface nb-surface-interactive nb-focus block p-6 group"
            >
              <BookOpen className="h-6 w-6 text-teal-500 mb-3" aria-hidden="true" />
              <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                Breathing for anxiety
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Simple breathing steps to reduce tension and worry.
              </p>
            </Link>
            <Link
              href="/guides/anxiety-stress/stress-reset-routine"
              className="nb-surface nb-surface-interactive nb-focus block p-6 group"
            >
              <AlertCircle className="h-6 w-6 text-teal-500 mb-3" aria-hidden="true" />
              <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                Stress reset routine
              </p>
              <p className="mt-2 text-xs text-slate-600">
                A short routine for calming the body and mind.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Band 6: Disclaimer ──────────────────────────────────────────────── */}
      <section className="py-10 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <p className="font-semibold text-slate-900 mb-2">Disclaimer</p>
          <p className="text-sm text-slate-700">
            Educational information only. This does not replace professional medical,
            psychological, or educational advice. Stop if you feel dizzy or panicky and seek
            support if symptoms persist.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            If you are in immediate danger or feel unable to keep yourself safe, call 999. For
            urgent medical advice in the UK, contact NHS 111.
          </p>
        </div>
      </section>
    </main>
  );
}
