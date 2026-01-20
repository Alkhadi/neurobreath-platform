import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { TrustPanel } from '@/components/trust/TrustPanel';
import type { Region } from '@/lib/region/region';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { Brain, Clock, HeartPulse, Lightbulb, Moon, ShieldAlert, Sparkles, Wind } from 'lucide-react';

const evidence = evidenceByRoute['/tools/sleep-tools'];

type ToolCard = {
  title: string;
  description: string;
  href: string;
  badge: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const tools: ToolCard[] = [
  {
    title: '4-7-8 Breathing',
    description: 'Classic sleep onset technique with extended exhale for parasympathetic activation.',
    href: '/techniques/4-7-8',
    badge: 'Sleep onset',
    Icon: Moon,
  },
  {
    title: 'Colour-Path Breathing',
    description: 'Visual breath pacing with gentle timing - minimal cognitive load.',
    href: '/tools/colour-path',
    badge: 'Visual',
    Icon: Sparkles,
  },
  {
    title: 'Box Breathing',
    description: 'Equal timing for all phases - simple pattern for consistency.',
    href: '/techniques/box-breathing',
    badge: 'Structured',
    Icon: Clock,
  },
  {
    title: 'Coherent 5-5',
    description: 'Resonance frequency breathing for HRV and settling the nervous system.',
    href: '/techniques/coherent-5-5',
    badge: 'Calm',
    Icon: HeartPulse,
  },
  {
    title: 'Micro-Reset Roulette',
    description: 'Quick 1-minute reset when you wake up mid-sleep and can\'t settle.',
    href: '/tools/roulette',
    badge: '1 minute',
    Icon: Wind,
  },
];

const bundles = [
  {
    name: 'Beginner',
    description: '2x Box (1 min) + share PDF',
    use: 'First-timers exploring breath for sleep hygiene',
  },
  {
    name: 'Quick',
    description: 'SOS-60 + Coherent 5-5 (2 min)',
    use: 'Fast wind-down when you\'re short on time',
  },
  {
    name: 'Classroom',
    description: 'Silent Box (2 min) - no audio',
    use: 'Group settings or shared spaces',
  },
  {
    name: 'Bedtime',
    description: '4-7-8 (3-5 min), phone face-down',
    use: 'Sleep onset with minimal screen exposure',
  },
];

export default async function SleepToolsPage() {
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
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Sleep tools</h1>
            <p className="text-base text-slate-600 max-w-3xl">
              Evidence-based breathing techniques, sleep hygiene checklists, and low-friction wind-down routines 
              to support better sleep. Educational support only — not medical advice.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#tools">Browse techniques</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#bundles">Curated bundles</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/techniques/4-7-8">Try 4‑7‑8</Link>
            </Button>
          </div>

          <EducationalDisclaimerInline contextLabel="Sleep tools" />
        </header>

        <section id="main-content" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-900">How to use sleep tools effectively</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Moon className="h-5 w-5 text-indigo-600" />
                  Sleep onset (falling asleep)
                </CardTitle>
                <CardDescription>Wind down gently without forcing sleep.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <p>
                  Use 4‑7‑8 or Colour‑Path in bed with lights low. Keep it gentle — you're cueing relaxation, not battling 
                  wakefulness. If still awake after 20 minutes, get up and do something calming.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/techniques/4-7-8">4‑7‑8 Breathing</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/tools/colour-path">Colour‑Path</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  Sleep maintenance (staying asleep)
                </CardTitle>
                <CardDescription>What to do when you wake during the night.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <p>
                  If you wake mid-sleep: avoid checking the time, do a quick breath reset (1–2 minutes), then return to rest. 
                  Keep lights minimal. If wide awake after 15–20 min, get up briefly.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/tools/roulette">Micro‑Reset</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/techniques/coherent-5-5">Coherent 5‑5</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="tools" className="space-y-5 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Breathing techniques for sleep</h2>
              <p className="text-sm text-slate-600 mt-1">Start with 2–3 minutes; extend if comfortable. Stop if dizzy.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/breathing">All breathing guides</Link>
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

        <section id="bundles" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-900">Curated bundles</h2>
          <p className="text-sm text-slate-600">Pre-packaged combinations for common sleep scenarios.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {bundles.map(bundle => (
              <Card key={bundle.name} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">{bundle.name}</CardTitle>
                  <CardDescription>{bundle.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-700">Best for:</p>
                    <p className="mt-1">{bundle.use}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Sleep hygiene checklist</h2>
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    Stimulus control
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
                    <li>Out of bed if not asleep within ~20 min</li>
                    <li>Bed only for sleep & sex; do wind‑down elsewhere</li>
                    <li>Wake time fixed daily; get bright light early</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-600" />
                    Sleep window
                  </h3>
                  <p className="text-sm text-slate-600">
                    Set time‑in‑bed to match your actual average sleep over the last week (minimum 6 hours). 
                    Avoid excessive time in bed when not sleeping — it weakens sleep drive.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Wind className="h-4 w-4 text-indigo-600" />
                    Wind‑down routine
                  </h3>
                  <p className="text-sm text-slate-600">
                    30–60 min before bed: dim lights, avoid screens, do gentle breathing or reading. 
                    Keep it consistent to cue your body for sleep.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-indigo-600" />
                    Daytime factors
                  </h3>
                  <p className="text-sm text-slate-600">
                    Regular exercise (not late), caffeine cutoff (early afternoon), 
                    manage stress load, and avoid long/late naps.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                Safety & comfort
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>Stop breathing exercises if you feel lightheaded, anxious, or uncomfortable.</li>
                <li>Avoid long breath-holds before sleep if prone to panic or migraines.</li>
                <li>Keep sessions gentle (2–5 minutes) — forcing sleep usually backfires.</li>
                <li>If sleep problems persist for weeks, consult a GP or consider CBT‑I.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                When breathing isn't enough
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3">
              <p>
                Breathing tools support sleep hygiene but don't replace CBT for Insomnia (CBT‑I), 
                which has strong evidence for persistent sleep problems. Consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Digital CBT‑I programmes (e.g. Sleepio, recommended by NICE)</li>
                <li>Sleep clinic referral if recommended by your GP</li>
                <li>Treating underlying conditions (anxiety, depression, pain)</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
          <div className="grid gap-3">
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">
                Should I do breathing in bed or before bed?
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Both work. Some people prefer to wind down with breathing in a chair or sitting position, 
                then get into bed already calm. Others do 2–3 minutes in bed as a final cue. Experiment.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">
                What if breathing makes me more alert?
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                That can happen with certain patterns (especially with holds or fast pacing). 
                Stick to slow exhales without intense focus. If it doesn't help, prioritise sleep hygiene over breathing.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">
                How long before I see results?
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Most people notice a slight shift in wind-down quality within a few nights. 
                For persistent insomnia, sleep hygiene + CBT‑I usually show improvement in 2–4 weeks.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">
                Can I use sleep tools for my child?
              </summary>
              <p className="mt-3 text-sm text-slate-600">
                Yes, but keep it simple and playful. Avoid pressure. For younger children, 
                consider visual prompts (like Colour‑Path) and keep sessions short (1–2 minutes).
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
              Need more guidance?
            </CardTitle>
            <CardDescription>Get personalised recommendations for your sleep needs.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/uk/help-me-choose">Help me choose</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/guides/sleep">Sleep guide</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/conditions/sleep">Sleep condition page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
