import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { TrustPanel } from '@/components/trust/TrustPanel';
import type { Region } from '@/lib/region/region';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { Brain, Focus, HeartPulse, Moon, ShieldAlert, Sparkles, Timer, Wind } from 'lucide-react';

const evidence = evidenceByRoute['/tools/breath-tools'];

type ToolCard = {
  title: string;
  description: string;
  href: string;
  badge: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const tools: ToolCard[] = [
  {
    title: 'Breath Ladder',
    description: 'Progressive pacing levels that build confidence and consistency.',
    href: '/tools/breath-ladder',
    badge: 'Structured',
    Icon: Timer,
  },
  {
    title: 'Colour‑Path Breathing',
    description: 'Visual cues for inhale/hold/exhale timing — great for visual learners.',
    href: '/tools/colour-path',
    badge: 'Visual',
    Icon: Sparkles,
  },
  {
    title: 'Micro‑Reset Roulette',
    description: 'A quick 1‑minute reset when decision fatigue is high.',
    href: '/tools/roulette',
    badge: '1 minute',
    Icon: Wind,
  },
  {
    title: 'Focus Tiles',
    description: 'Pick your context (school/work/home/social) and get a suggested technique.',
    href: '/tools/focus-tiles',
    badge: 'Context‑based',
    Icon: Focus,
  },
  {
    title: 'Focus Training',
    description: 'Paced focus sprints with recovery breaks — designed for steady attention.',
    href: '/tools/focus-training',
    badge: 'Focus',
    Icon: Brain,
  },
];

export default async function BreathToolsPage() {
  const region: Region = 'UK';

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 space-y-10">
        <header className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-slate-500">Tools</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Breath tools</h1>
            <p className="text-base text-slate-600 max-w-3xl">
              Quick, accessible breathing practice for calm, focus, and sleep — with clear timing cues and low-friction options.
              Use these as short wellbeing supports, not medical treatment.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#tools">Browse tools</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/breathing">Breathing guides</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/techniques/sos">SOS 60‑second reset</Link>
            </Button>
          </div>

          <EducationalDisclaimerInline contextLabel="Breathing tools" />
        </header>

        <section id="main-content" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-900">How to choose (fast)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-rose-600" />
                  Calm / overwhelm
                </CardTitle>
                <CardDescription>Start with short resets and simple pacing.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <p>
                  If your body feels "revved up" (racing heart, tight chest), aim for an easy pace and a gentle exhale.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm"><Link href="/tools/roulette">Micro‑Reset Roulette</Link></Button>
                  <Button asChild variant="secondary" size="sm"><Link href="/techniques/sos">SOS reset</Link></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Focus className="h-5 w-5 text-indigo-600" />
                  Focus / transitions
                </CardTitle>
                <CardDescription>Use structure when attention is scattered.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <p>
                  For task-starting friction: pick a context, follow a suggested technique, then start with a small “first step”.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm"><Link href="/tools/focus-tiles">Focus Tiles</Link></Button>
                  <Button asChild variant="secondary" size="sm"><Link href="/tools/breath-ladder">Breath Ladder</Link></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="tools" className="space-y-5 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Tools you can use right now</h2>
              <p className="text-sm text-slate-600 mt-1">Pick one, run it for 1–3 minutes, and stop early if you feel dizzy.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/tools">All interactive tools</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <tool.Icon className="h-5 w-5 text-slate-700" />
                      <div className="text-base font-semibold text-slate-900 group-hover:text-slate-950">{tool.title}</div>
                    </div>
                    <p className="text-sm text-slate-600">{tool.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {tool.badge}
                  </span>
                </div>
                <div className="mt-4 text-sm font-semibold text-indigo-600">Open →</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Moon className="h-5 w-5 text-slate-700" />
                For sleep
              </CardTitle>
              <CardDescription>Wind down gently; prioritise comfort over intensity.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3">
              <p>
                If you’re using breathing for sleep, keep it easy: soften the inhale, lengthen the exhale slightly, and avoid long breath holds.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm"><Link href="/guides/sleep">Sleep guide</Link></Button>
                <Button asChild variant="secondary" size="sm"><Link href="/tools/colour-path">Colour‑Path</Link></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wind className="h-5 w-5 text-slate-700" />
                For daily consistency
              </CardTitle>
              <CardDescription>Small wins beat perfect sessions.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3">
              <p>
                Try a tiny routine: 1 minute after waking up, 1 minute before a task, 1 minute after lunch. Track only what helps.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm"><Link href="/breathing">Breathing basics</Link></Button>
                <Button asChild variant="secondary" size="sm"><Link href="/tools/breath-ladder">Breath Ladder</Link></Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Safety & comfort
          </h2>
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-sm text-slate-700 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>Stop if you feel lightheaded, dizzy, numb, or uncomfortable. Return to normal breathing.</li>
                <li>Avoid long breath-holds if you’re prone to panic symptoms, migraines, or fainting.</li>
                <li>Keep practice gentle if you have respiratory or cardiac conditions; if unsure, check with a clinician.</li>
                <li>Breathing tools can support wellbeing routines but don’t replace assessment, therapy, or urgent care.</li>
              </ul>
              <p className="text-xs text-slate-500">
                If you’re in immediate danger or feel at risk of harming yourself, seek urgent help now.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
          <div className="grid gap-3">
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">How long should I practise?</summary>
              <p className="mt-3 text-sm text-slate-600">
                Start with 60–120 seconds. If it feels good, extend to 3–5 minutes. Consistency matters more than duration.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">What if breathing makes me more anxious?</summary>
              <p className="mt-3 text-sm text-slate-600">
                That can happen. Reduce intensity: shorten the session, avoid holds, and keep the exhale gentle. If symptoms persist,
                use grounding tools and consider professional support.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">Do I need to breathe deeply?</summary>
              <p className="mt-3 text-sm text-slate-600">
                Not necessarily. Slow and comfortable is usually better than “big breaths.” Aim for a calm pace you can sustain.
              </p>
            </details>
          </div>
        </section>

        <TrustPanel region={region} title="Trust & evidence" />
        {evidence ? <EvidenceFooter evidence={evidence} /> : null}

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Want a guided plan?
            </CardTitle>
            <CardDescription>Get a safe starting point tailored to your needs.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild><Link href="/uk/help-me-choose">Help me choose</Link></Button>
            <Button asChild variant="outline"><Link href="/uk/journeys">Starter journeys</Link></Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
