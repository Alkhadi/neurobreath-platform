'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadAssessmentResult, type DyslexiaAssessmentResult } from '@/lib/dyslexia/assessment-store';
import {
  ageRelevantCategories,
  categorySupportById,
  dyslexiaAgeLabels,
  dyslexiaCategoryLabels,
  practiceExamplesByAge,
  trainingResourceLinks,
  type SupportLink,
} from '@/lib/dyslexia/training-support';
import { ArrowLeft, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';

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

export default function DyslexiaPracticeLibraryPage() {
  const [result, setResult] = useState<DyslexiaAssessmentResult | null>(null);

  useEffect(() => {
    setResult(loadAssessmentResult());
  }, []);

  const ageGroup = result?.ageGroup ?? 'adult';
  const examples = practiceExamplesByAge[ageGroup];
  const topSupports = (result?.categoryBreakdown ?? [])
    .filter(item => categorySupportById[item.category])
    .slice(0, 3)
    .map(item => ({ ...item, support: categorySupportById[item.category] }));
  const categoryCards = ageRelevantCategories[ageGroup]
    .filter(category => categorySupportById[category])
    .map(category => ({ category, support: categorySupportById[category] }));

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Practice Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Routine Examples And Reading Support By Age</h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Use these examples when you want a clearer starting point. They turn the daily routine into concrete, repeatable actions and show what to do for the most common dyslexia support areas.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50/60 dark:bg-emerald-950/10 py-10 sm:py-14">
        <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px] space-y-6">
          <Card className="border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-3">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Tailored View</h2>
                <p className="text-sm text-muted-foreground">
                  {result
                    ? `These examples are centred on ${dyslexiaAgeLabels[ageGroup]} and the highest-need areas in your saved answers.`
                    : 'No saved assessment was found, so this page is showing the adult starting set by default. You can still use any section that fits.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
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

          <Card className="border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Age-Tailored Routine Examples</h2>
                <p className="text-sm text-muted-foreground">
                  Pick one or two examples and repeat them consistently. The goal is a routine that feels doable, not a perfect schedule.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {examples.map(example => (
                  <Card key={example.title} className="border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                            {example.timing}
                          </p>
                          <h3 className="text-sm font-semibold text-foreground">{example.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{example.summary}</p>
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">How to do it</p>
                        <ul className="space-y-1.5">
                          {example.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-gray-950/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">Example prompt</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{example.example}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {example.links.map(link => (
                          <SupportChipLink key={`${example.title}-${link.href}`} link={link} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {topSupports.length > 0 && (
            <Card className="border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900/60">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">Based On Your Answers, Start Here</h2>
                  <p className="text-sm text-muted-foreground">
                    These are the quickest routines to prioritise from your top difficulty areas.
                  </p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {topSupports.map(({ category, pct, support }) => (
                    <Card key={category} className="border-indigo-100 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/20">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                              {dyslexiaCategoryLabels[category] ?? category}
                            </p>
                            <h3 className="text-sm font-semibold text-foreground">{support.title}</h3>
                          </div>
                          <span className="rounded-full bg-white dark:bg-gray-950 border border-indigo-200 dark:border-indigo-800 px-2 py-1 text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{support.description}</p>
                        <ul className="space-y-1">
                          {support.quickWins.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="rounded-lg border border-indigo-100 dark:border-indigo-900 bg-white/80 dark:bg-gray-950/40 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">Example</p>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{support.example}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {support.links.map(link => (
                            <SupportChipLink key={`${category}-${link.href}`} link={link} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Support Areas To Explore For {dyslexiaAgeLabels[ageGroup]}</h2>
                <p className="text-sm text-muted-foreground">
                  Use this as a menu of practical options for the support areas most commonly relevant to this age group.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categoryCards.map(({ category, support }) => (
                  <Card key={category} className="border-amber-100 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                          {dyslexiaCategoryLabels[category] ?? category}
                        </p>
                        <h3 className="text-sm font-semibold text-foreground">{support.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{support.description}</p>
                      <div className="rounded-lg border border-amber-100 dark:border-amber-900 bg-white/80 dark:bg-gray-950/40 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">One starting example</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{support.example}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {support.links.map(link => (
                          <SupportChipLink key={`${category}-support-${link.href}`} link={link} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 border-0 text-white">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Build The Full Routine Around These Examples</h2>
                <p className="text-sm text-white/80">
                  Add trusted listening links and interactive practice tools when you want more structure.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={trainingResourceLinks.audioLibrary.href}>
                  <Button className="bg-white text-emerald-700 hover:bg-white/90">Open Audio Library</Button>
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
