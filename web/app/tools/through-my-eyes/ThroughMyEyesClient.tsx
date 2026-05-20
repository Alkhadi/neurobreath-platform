'use client';

import * as React from 'react';

import { EducationalDisclaimer } from '@/components/shared/EducationalDisclaimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SimId = 'sensory' | 'focus' | 'reading';

const SIMS: Array<{
  id: SimId;
  title: string;
  description: string;
  intro: string;
  note: string;
}> = [
  {
    id: 'sensory',
    title: 'Sensory overwhelm hint',
    description: 'Light visual layering that hints at how busy environments can feel.',
    intro:
      'A subtle pattern is layered over a calm scene. Some people experience environments as much busier than this — the simulation does not aim to be photo-real.',
    note: 'No flashing. Animation respects your reduced-motion settings.',
  },
  {
    id: 'focus',
    title: 'Focus drift hint',
    description: 'Words gently move so attention has to keep re-anchoring.',
    intro:
      'Sentences shift slowly so the eye has to keep finding its place again. This hints at what it can feel like when attention will not stay put.',
    note: 'Stop at any time. Reduced motion is respected automatically.',
  },
  {
    id: 'reading',
    title: 'Reading effort hint',
    description: 'Letter spacing and contrast soften, so reading takes more effort.',
    intro:
      'Letter spacing widens and contrast softens. Many readers describe needing extra effort even with shorter lines than this.',
    note: 'No flashing or strobe effects.',
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export default function ThroughMyEyesClient() {
  const [active, setActive] = React.useState<SimId | null>(null);
  const reduced = usePrefersReducedMotion();

  const stop = () => setActive(null);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-14 space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-wide text-slate-500">Sensory simulators</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Through My Eyes
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Optional, gentle simulations that hint at what sensory overwhelm,
          focus drift, or reading effort can feel like. Every simulation is
          opt-in, can be stopped at any time, and avoids flashing.
        </p>
      </header>

      <EducationalDisclaimer>
        These simulations are educational hints, not lived experience. Stop any
        simulation at any time. If a simulation feels distressing, please stop and
        return to a calm part of the site.
      </EducationalDisclaimer>

      <section aria-labelledby="sim-list" className="space-y-4">
        <h2 id="sim-list" className="text-2xl font-semibold">
          Choose a simulation to start
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SIMS.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.note}</p>
                <Button
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-pressed={active === s.id}
                >
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {active && (
        <section aria-labelledby="active-sim" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="active-sim" className="text-2xl font-semibold">
              {SIMS.find((s) => s.id === active)?.title}
            </h2>
            <Button type="button" variant="outline" onClick={stop} autoFocus>
              Stop simulation
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {SIMS.find((s) => s.id === active)?.intro}
          </p>
          <SimStage id={active} reduced={reduced} />
        </section>
      )}

      <p className="text-xs text-muted-foreground">
        Simulations are gentle hints, not measurements. No data is collected.
      </p>
    </main>
  );
}

function SimStage({ id, reduced }: { id: SimId; reduced: boolean }) {
  if (id === 'sensory') {
    return (
      <div
        className="relative h-72 rounded-2xl overflow-hidden border bg-slate-100 dark:bg-slate-900"
        aria-label="Sensory overwhelm hint stage"
      >
        <div
          className={
            'absolute inset-0 ' +
            (reduced ? '' : 'animate-[nb-sensory-drift_18s_linear_infinite]')
          }
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(15,23,42,0.10) 0 12px, transparent 12px 24px), repeating-linear-gradient(-45deg, rgba(15,23,42,0.08) 0 18px, transparent 18px 36px)',
          }}
        />
        <div className="relative z-10 p-6 max-w-md mx-auto text-center mt-12 bg-white/70 dark:bg-slate-950/60 rounded-xl">
          <p className="text-sm">
            A calm sentence in a busy space. Many people find this kind of
            visual layering tiring within minutes.
          </p>
        </div>
        <style>{`@keyframes nb-sensory-drift { 0% { transform: translate(0,0); } 100% { transform: translate(-24px,-24px); } }`}</style>
      </div>
    );
  }

  if (id === 'focus') {
    return (
      <div
        className="rounded-2xl border p-6 bg-white dark:bg-slate-950 leading-loose text-lg"
        aria-label="Focus drift hint stage"
      >
        <p className={reduced ? '' : 'animate-[nb-focus-shift_6s_ease-in-out_infinite]'}>
          Reading is easier when words stay still. When attention drifts, the
          eye has to keep finding its place on the page again and again.
        </p>
        <style>{`@keyframes nb-focus-shift { 0%,100% { transform: translateX(0); letter-spacing: 0; } 50% { transform: translateX(6px); letter-spacing: 0.5px; } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 bg-white dark:bg-slate-950"
      aria-label="Reading effort hint stage"
      style={{ letterSpacing: '0.12em', color: 'rgba(15,23,42,0.55)' }}
    >
      <p className="text-base leading-loose">
        Wider letter spacing and softer contrast can make reading feel slower.
        Even shorter lines than this can take extra effort for many readers.
      </p>
    </div>
  );
}
