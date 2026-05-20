'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

import { EducationalDisclaimer } from '@/components/shared/EducationalDisclaimer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  SPIKY_CATEGORIES,
  SPIKY_SCALE,
  type SpikyCategory,
} from '@/data/phase2/spiky-profile';

// recharts is already a dependency. Load only on the client to keep
// the initial bundle small and avoid SSR mismatches.
const Radar = dynamic(() => import('./SpikyRadar'), {
  ssr: false,
  loading: () => (
    <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">
      Loading chart…
    </div>
  ),
});

type Responses = Record<string, number[]>;

function computeAverages(responses: Responses): Record<string, number> {
  const out: Record<string, number> = {};
  for (const cat of SPIKY_CATEGORIES) {
    const arr = responses[cat.id] ?? [];
    const filled = arr.filter((n) => typeof n === 'number' && n >= 1 && n <= 5);
    out[cat.id] = filled.length
      ? Number((filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(2))
      : 0;
  }
  return out;
}

function initialResponses(): Responses {
  const out: Responses = {};
  for (const cat of SPIKY_CATEGORIES) {
    out[cat.id] = Array(cat.questions.length).fill(0);
  }
  return out;
}

export default function SpikyProfileClient() {
  const [responses, setResponses] = React.useState<Responses>(() => initialResponses());
  const [submitted, setSubmitted] = React.useState(false);

  const setAnswer = (catId: string, qIdx: number, value: number) => {
    setResponses((prev) => {
      const next = { ...prev, [catId]: [...(prev[catId] ?? [])] };
      next[catId][qIdx] = value;
      return next;
    });
  };

  const averages = React.useMemo(() => computeAverages(responses), [responses]);

  const radarData = SPIKY_CATEGORIES.map((c) => ({
    category: c.label,
    score: averages[c.id] ?? 0,
  }));

  const topNeeds: SpikyCategory[] = React.useMemo(() => {
    return [...SPIKY_CATEGORIES]
      .sort((a, b) => (averages[b.id] ?? 0) - (averages[a.id] ?? 0))
      .slice(0, 3)
      .filter((c) => (averages[c.id] ?? 0) > 0);
  }, [averages]);

  const onReset = () => {
    setResponses(initialResponses());
    setSubmitted(false);
  };

  const completed = Object.values(responses).every((arr) => arr.every((v) => v >= 1));

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-14 space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-wide text-slate-500">Reflection tool</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Spiky Profile: strengths and support map
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          A short, supportive reflection across eight everyday areas. Use it to
          notice patterns and pick one or two areas to support first.
        </p>
      </header>

      <EducationalDisclaimer />

      <section aria-labelledby="questions-heading" className="space-y-6">
        <h2 id="questions-heading" className="text-2xl font-semibold">
          Reflect on each area
        </h2>
        {SPIKY_CATEGORIES.map((cat) => (
          <Card key={cat.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{cat.label}</CardTitle>
              <CardDescription>{cat.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {cat.questions.map((q, qi) => {
                const selected = responses[cat.id]?.[qi] ?? 0;
                const groupName = `${cat.id}-${qi}`;
                return (
                  <fieldset key={groupName} className="space-y-2">
                    <legend className="text-sm font-medium">{q}</legend>
                    <div
                      role="radiogroup"
                      aria-label={q}
                      className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                    >
                      {SPIKY_SCALE.map((s) => {
                        const id = `${groupName}-${s.value}`;
                        const isOn = selected === s.value;
                        return (
                          <label
                            key={id}
                            htmlFor={id}
                            className={[
                              'cursor-pointer rounded-xl border px-3 py-2 text-sm text-center',
                              'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-slate-400',
                              isOn
                                ? 'border-slate-900 bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
                            ].join(' ')}
                          >
                            <input
                              id={id}
                              type="radio"
                              name={groupName}
                              value={s.value}
                              checked={isOn}
                              onChange={() => setAnswer(cat.id, qi, s.value)}
                              className="sr-only"
                            />
                            <span className="font-semibold">{s.value}</span>
                            <span className="block text-xs opacity-80">{s.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!completed}
            aria-disabled={!completed}
          >
            Show my reflection map
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
          {!completed && (
            <p className="text-sm text-muted-foreground self-center">
              Answer every question to see your map.
            </p>
          )}
        </div>
      </section>

      {submitted && completed && (
        <section aria-labelledby="results-heading" className="space-y-6">
          <h2 id="results-heading" className="text-2xl font-semibold">
            Your reflection map
          </h2>
          <Card>
            <CardContent className="pt-6">
              <Radar data={radarData} />
              <p className="mt-3 text-sm text-muted-foreground">
                Higher values mean you reported more difficulty in that area today.
                This is a snapshot, not a diagnosis.
              </p>
            </CardContent>
          </Card>

          {topNeeds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Where to start</CardTitle>
                <CardDescription>
                  Pick one of the top areas and try one supportive idea this week.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {topNeeds.map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <h3 className="font-semibold">{cat.label}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {cat.supportIdeas.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </main>
  );
}
