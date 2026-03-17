'use client'

import Link from 'next/link'
import { ArrowLeft, Play, Video, AlertTriangle, Moon, Target, Heart, Zap, Activity, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Breathing478Player } from '@/components/breathing/Breathing478Player'
import { ResponsiveYouTubeEmbed } from '@/components/video/ResponsiveYouTubeEmbed'
import { FOUR_SEVEN_EIGHT_COPY } from '@/lib/breathing/478'

const RELATED_TECHNIQUES = [
  {
    href: '/techniques/box-breathing',
    label: 'Box Breathing',
    description: 'Equal 4-4-4-4 ratio for focus and calm under pressure.',
    icon: Target,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    href: '/techniques/coherent',
    label: 'Coherent Breathing',
    description: '5-5 rhythm to support heart rate variability and balance.',
    icon: Heart,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    href: '/techniques/sos',
    label: 'SOS Breathing',
    description: '60-second emergency reset for acute stress moments.',
    icon: Zap,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    href: '/breathing/breath',
    label: 'Belly Breathing',
    description: 'Foundational diaphragmatic breathing — great for beginners.',
    icon: Activity,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
]

export default function FourSevenEightPage() {
  return (
    <main className="min-h-screen">
      {/* Skip navigation */}
      <a
        href="#practice"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded focus:shadow-lg"
      >
        Skip to breathing practice
      </a>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative py-14 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
      >
        {/* Back nav */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link href="/breathing">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Breathing Hub
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 mb-6" aria-hidden="true">
            <Moon className="w-8 h-8 text-purple-600" />
          </div>

          <h1 id="hero-heading" className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {FOUR_SEVEN_EIGHT_COPY.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {FOUR_SEVEN_EIGHT_COPY.subtitle}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-800">4s</span> inhale
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-800">7s</span> hold
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-800">8s</span> exhale
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-800">19s</span> per cycle
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="px-8 bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
            >
              <a href="#practice">
                <Play className="mr-2 h-5 w-5" aria-hidden="true" />
                Start Practice
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <a href="#interview">
                <Video className="mr-2 h-5 w-5" aria-hidden="true" />
                Watch Interview
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Safety Notice ─────────────────────────────────────────────── */}
      <section aria-label="Safety notice" className="px-4 py-6 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
            <AlertDescription className="text-sm text-amber-900 leading-relaxed">
              <strong>Safety notice: </strong>
              {FOUR_SEVEN_EIGHT_COPY.safetyNote}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* ── Practice Panel ────────────────────────────────────────────── */}
      <section
        id="practice"
        aria-labelledby="practice-heading"
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="practice-heading" className="text-3xl font-bold text-gray-900 mb-3">
              Guided Practice
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {FOUR_SEVEN_EIGHT_COPY.recommendationNote}
            </p>
          </div>
          <Breathing478Player />
        </div>
      </section>

      {/* ── Evidence-safe Explanation ─────────────────────────────────── */}
      <section
        aria-labelledby="explanation-heading"
        className="py-16 px-4 bg-gradient-to-br from-purple-50 to-indigo-50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="explanation-heading" className="text-3xl font-bold text-gray-900 mb-8 text-center">
            About This Technique
          </h2>

          <div className="flex flex-wrap gap-6 [&>*]:basis-full md:[&>*]:basis-[calc(50%-12px)] [&>*]:min-w-0">
            {/* What it is */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">What It Is</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {FOUR_SEVEN_EIGHT_COPY.description}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                The ratio — breathe in for 4 seconds, hold for 7, breathe out for 8 — is
                thought to slow the breath and engage the body&apos;s natural calming mechanisms.
                The ratio matters more than speed: if 4–7–8 feels too intense, slow each count
                slightly.
              </p>
            </Card>

            {/* How to do it */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">How to Practise</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                  <span>Sit comfortably or lie down. Place the tip of your tongue lightly behind your upper front teeth.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                  <span>Exhale fully through your mouth, then close it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                  <span>Inhale quietly through your nose for a count of 4.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                  <span>Hold your breath for a count of 7.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center mt-0.5">5</span>
                  <span>Exhale completely through your mouth for a count of 8. Repeat for 4 cycles.</span>
                </li>
              </ol>
            </Card>

            {/* What it may help with */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">What It May Help With</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  'May help support relaxation before sleep',
                  'Commonly used for calming during stressful moments',
                  'Can support stress reduction when practised consistently',
                  'Often used as part of an evening wind-down routine',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Timing explained */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">The 4:7:8 Ratio</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm font-medium text-blue-600">Inhale</div>
                  <div className="flex-1 h-3 rounded-full bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(4 / 19) * 100}%` }} />
                  </div>
                  <div className="w-6 text-sm font-bold text-gray-700">4s</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm font-medium text-orange-500">Hold</div>
                  <div className="flex-1 h-3 rounded-full bg-orange-100 overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(7 / 19) * 100}%` }} />
                  </div>
                  <div className="w-6 text-sm font-bold text-gray-700">7s</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm font-medium text-pink-500">Exhale</div>
                  <div className="flex-1 h-3 rounded-full bg-pink-100 overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full" style={{ width: `${(8 / 19) * 100}%` }} />
                  </div>
                  <div className="w-6 text-sm font-bold text-gray-700">8s</div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  One complete cycle = 19 seconds. Default session = 4 cycles = 76 seconds.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Interview / Video ─────────────────────────────────────────── */}
      <section
        id="interview"
        aria-labelledby="interview-heading"
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="interview-heading" className="text-3xl font-bold text-gray-900 mb-3">
              In Their Own Words
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dr. Andrew Weil explains how the 4–7–8 technique works and why he commonly
              recommends it as part of a relaxation practice.
            </p>
          </div>

          {/* Video embed — replace videoId with confirmed YouTube ID before deploy */}
          <ResponsiveYouTubeEmbed
            videoId="gz4G31ty9-0"
            title="Dr. Andrew Weil demonstrates and explains the 4-7-8 breathing technique"
            className="mb-8"
          />

          {/* Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">Key Points from the Interview</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                The extended exhale is considered the most important part of the ratio.
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                Dr. Weil commonly recommends starting with four cycles, twice per day.
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                Consistent daily practice over weeks is thought to support the cumulative effect.
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                The technique can be practised anywhere, with no equipment required.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* ── Related Techniques ───────────────────────────────────────── */}
      <section
        aria-labelledby="related-heading"
        className="py-16 px-4 bg-gradient-to-br from-gray-50 to-purple-50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="related-heading" className="text-3xl font-bold text-gray-900 mb-3 text-center">
            Explore Related Techniques
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Each technique serves a different purpose — find what works for you.
          </p>

          <div className="flex flex-wrap gap-4 [&>*]:basis-full sm:[&>*]:basis-[calc(50%-8px)] [&>*]:min-w-0">
            {RELATED_TECHNIQUES.map(({ href, label, description, icon: Icon, iconBg, iconColor }) => (
              <Card key={href} className="p-5 hover:shadow-md transition-shadow">
                <div className={`inline-flex p-2 rounded-lg mb-3 ${iconBg}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
                </div>
                <h3 className="font-bold mb-1">{label}</h3>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={href}>
                    <Play className="mr-2 h-3 w-3" aria-hidden="true" />
                    Try {label}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="ghost">
              <Link href="/breathing">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Breathing Hub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
