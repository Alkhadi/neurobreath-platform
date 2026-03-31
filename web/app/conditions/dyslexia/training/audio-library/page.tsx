'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadAssessmentResult, type DyslexiaAssessmentResult } from '@/lib/dyslexia/assessment-store';
import {
  audioResourcesByAge,
  dyslexiaAgeLabels,
  dyslexiaCategoryLabels,
  essentialAudioPlatforms,
  trainingResourceLinks,
  type SupportLink,
} from '@/lib/dyslexia/training-support';
import { ArrowLeft, CheckCircle2, ExternalLink, Headphones, Lightbulb, Volume2 } from 'lucide-react';

const categoryListeningTips: Record<string, string> = {
  reading: 'Start with audio plus a short follow-along section in print, then try one short independent re-read.',
  comprehension: 'Pause after each chunk and say the main idea aloud or record a one-sentence summary.',
  writing: 'Use audio as idea input, then dictate or jot three bullets after listening.',
  executive: 'Tie listening to an existing slot such as lunch, commute, or bedtime so it becomes automatic.',
  emotional: 'Choose topics you genuinely enjoy. Interest-led listening is more sustainable than "should" listening.',
  processing: 'Preview the topic, listen in short chunks, and avoid trying to hold too much information at once.',
  memory: 'Capture one to three points only and review them later, rather than taking full notes.',
};

const allAgeTips = [
  'Listening is access support, not cheating. It helps many dyslexic people learn at their actual thinking level.',
  'Follow along in print only for short sections if it helps. You do not need to track every word for the whole session.',
  'Pause once or twice to say the key idea, save two useful words, or record a quick voice note.',
  'Use playback speed, sleep timers, headphones, and background colour adjustments to reduce fatigue.',
];

function SupportChipLink({ link }: { link: SupportLink }) {
  const className = 'inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors';

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function DyslexiaAudioLibraryPage() {
  const [result, setResult] = useState<DyslexiaAssessmentResult | null>(null);

  useEffect(() => {
    setResult(loadAssessmentResult());
  }, []);

  const ageGroup = result?.ageGroup ?? 'adult';
  const resourceGroup = audioResourcesByAge[ageGroup];
  const topListeningTips = (result?.categoryBreakdown ?? [])
    .map(item => ({ ...item, tip: categoryListeningTips[item.category] }))
    .filter(item => Boolean(item.tip))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative overflow-hidden py-12 sm:py-16"
        style={{ backgroundImage: 'url("/images/home/home-section-bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/20" aria-hidden="true" />
        <div className="relative z-10 mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-5">
          <Link href="/conditions/dyslexia/training" className="inline-flex items-center gap-2 text-white/75 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dyslexia Training Plan
          </Link>

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/40 text-white text-sm font-medium">
              <Headphones className="w-4 h-4" />
              Audio & Podcast Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Trusted Listening Support For Dyslexia</h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Use spoken language, audiobooks, and podcasts to build vocabulary, comprehension, confidence, and access to ideas without carrying the full decoding load every time.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50/70 dark:bg-blue-950/10 py-10 sm:py-14">
        <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-6">
          <Card className="border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-3">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Tailored Starting Point</h2>
                <p className="text-sm text-muted-foreground">
                  {result
                    ? `Your saved assessment suggests starting with ${dyslexiaAgeLabels[ageGroup]}. The links below are picked to match that stage and the reading profile shown in your answers.`
                    : 'No saved assessment was found, so this page is showing the adult starting set by default. You can still use any of the links below.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {dyslexiaAgeLabels[ageGroup]}
                </span>
                {(result?.categoryBreakdown ?? []).slice(0, 3).map(item => (
                  <span key={item.category} className="rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-muted-foreground">
                    {dyslexiaCategoryLabels[item.category] ?? item.category}: {item.pct}%
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 dark:border-cyan-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">{resourceGroup.heading}</h2>
                <p className="text-sm text-muted-foreground">{resourceGroup.summary}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resourceGroup.resources.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/20 p-4 hover:border-cyan-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-foreground">{link.label}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{link.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
              <div className="rounded-xl border border-cyan-100 dark:border-cyan-900 bg-white/80 dark:bg-gray-950/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Starter plan</p>
                <ul className="mt-2 space-y-2">
                  {resourceGroup.starterPlan.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {topListeningTips.length > 0 && (
            <Card className="border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900/60">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">Based On Your Answers, Use Audio Like This</h2>
                  <p className="text-sm text-muted-foreground">
                    These listening habits are selected from your highest-need reading support areas.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {topListeningTips.map(item => (
                    <div key={item.category} className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/20 p-4 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                        {dyslexiaCategoryLabels[item.category] ?? item.category}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Essential Audio Platforms</h2>
                <p className="text-sm text-muted-foreground">
                  These are reliable starting points for fiction, spoken explainers, podcasts, and accessible audiobook support.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {essentialAudioPlatforms.map(link => (
                  <SupportChipLink key={link.href} link={link} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">How To Make Listening Help Reading</h2>
                    <p className="text-sm text-muted-foreground">
                      Audio works best when it supports attention, meaning, and confidence rather than becoming passive background noise.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {allAgeTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Keep Building Your Routine</h2>
                <p className="text-sm text-white/80">
                  Pair these listening resources with concrete daily examples and interactive reading tools.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={trainingResourceLinks.practiceLibrary.href}>
                  <Button className="bg-white text-blue-700 hover:bg-white/90">Open Practice Library</Button>
                </Link>
                <Link href={trainingResourceLinks.trainingSuite.href}>
                  <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                    Open Reading Training
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
