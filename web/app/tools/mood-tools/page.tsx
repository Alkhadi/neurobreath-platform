import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { TrustPanel } from '@/components/trust/TrustPanel';
import type { Region } from '@/lib/region/region';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { ArrowRight, ClipboardCheck, HeartPulse, Moon, ShieldAlert, Sparkles, Wind } from 'lucide-react';

const evidence = evidenceByRoute['/tools/mood-tools'];

type ToolCard = {
  title: string;
  description: string;
  href: string;
  badge: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const tools: ToolCard[] = [
  {
    title: 'Quick breath resets',
    description: 'Low-effort pacing cues for calming and steadying mood swings.',
    href: '/tools/breath-tools',
    badge: '1–3 min',
    Icon: Wind,
  },
  {
    title: 'Stress tools',
    description: 'Grounding, prioritisation, and fast “reset” options when you feel overloaded.',
    href: '/tools/stress-tools',
    badge: 'Reduce overwhelm',
    Icon: ShieldAlert,
  },
  {
    title: 'Sleep tools',
    description: 'Wind-down routines and gentle cues to protect sleep (big mood lever).',
    href: '/tools/sleep-tools',
    badge: 'Protect sleep',
    Icon: Moon,
  },
  {
    title: 'Micro‑Reset Roulette',
    description: 'When decision fatigue is high, spin for a 1‑minute next step.',
    href: '/tools/roulette',
    badge: '1 minute',
    Icon: Sparkles,
  },
  {
    title: 'Depression support tools',
    description: 'Gentle activation prompts and coping resources for persistent low mood.',
    href: '/tools/depression-tools',
    badge: 'Low mood',
    Icon: HeartPulse,
  },
  {
    title: 'All tools',
    description: 'Browse everything and pick what fits your context today.',
    href: '/tools',
    badge: 'Browse',
    Icon: ArrowRight,
  },
];

export default async function MoodToolsPage() {
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
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Mood tools</h1>
            <p className="text-base text-slate-600 max-w-3xl">
              Practical check-ins and gentle regulation ideas for everyday mood ups and downs — designed to be low friction.
              Educational support only; not diagnosis or treatment.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#check-in">Start a check‑in</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#tools">Browse tools</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/uk/help-me-choose">Help me choose</Link>
            </Button>
          </div>

          <EducationalDisclaimerInline contextLabel="Mood tools" />
        </header>

        <section id="main-content" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-900">How to use this page</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                  Quick check‑in (60 seconds)
                </CardTitle>
                <CardDescription>Get a clearer “next step” without overthinking.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Name it: <span className="font-semibold">low</span>, <span className="font-semibold">flat</span>,{' '}
                    <span className="font-semibold">wired</span>, or <span className="font-semibold">heavy</span>.
                  </li>
                  <li>Pick one lever: body (breath), environment (light/movement), or connection (message someone).</li>
                  <li>Do the smallest version for 1 minute. Stop early if it feels worse.</li>
                </ol>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/tools/breath-tools">Try a breath reset</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/tools/roulette">Spin a next step</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-rose-600" />
                  Build a tiny routine
                </CardTitle>
                <CardDescription>Small repetitions beat big plans.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-3">
                <p>
                  Mood is often a pattern problem (sleep, stress load, isolation, under‑recovery). A simple routine makes your day more predictable.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Morning: 1 minute of breathing or light exposure.</li>
                  <li>Midday: one “movement snack” (stairs, walk, stretch).</li>
                  <li>Evening: protect sleep with a gentle wind‑down cue.</li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/tools/sleep-tools">Sleep tools</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/tools/stress-tools">Stress tools</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="check-in" className="space-y-4 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-900">Mood check‑in prompts</h2>
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-sm text-slate-700 space-y-4">
              <p>
                If you’re not sure what you’re feeling, try these prompts. Answer in one sentence each — you can keep it private.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-semibold text-slate-900">Body</p>
                  <p className="mt-2 text-slate-600">Where do I feel this (chest, throat, stomach, head)? What’s the intensity 1–10?</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-semibold text-slate-900">Needs</p>
                  <p className="mt-2 text-slate-600">What would help 5% right now: water, food, movement, rest, connection, sunlight?</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-semibold text-slate-900">Context</p>
                  <p className="mt-2 text-slate-600">What happened in the last 2 hours that could explain this shift?</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="font-semibold text-slate-900">Next step</p>
                  <p className="mt-2 text-slate-600">What is the smallest action I can do in 60 seconds?</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="#tools">Pick a tool</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/progress">View progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="tools" className="space-y-5 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Tools you can use today</h2>
              <p className="text-sm text-slate-600 mt-1">Start small: 1–3 minutes is enough to shift state.</p>
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

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Safety & comfort
          </h2>
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-sm text-slate-700 space-y-3">
              <ul className="list-disc pl-6 space-y-2">
                <li>Stop any exercise that makes symptoms worse (dizziness, panic escalation, nausea, pain). Return to normal breathing.</li>
                <li>If you’re in a very low mood, make the task smaller and prioritise basic needs (water, food, rest, safe connection).</li>
                <li>For persistent symptoms, consider speaking with a clinician or mental health professional.</li>
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
              <summary className="cursor-pointer font-semibold text-slate-900">Should I track my mood every day?</summary>
              <p className="mt-3 text-sm text-slate-600">
                Only if it helps. Some people benefit from a quick 10‑second check‑in; others feel worse when they monitor too closely.
                If tracking increases rumination, reduce frequency.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">What if I don’t feel better after a tool?</summary>
              <p className="mt-3 text-sm text-slate-600">
                That’s normal. Tools shift state a little, not perfectly. Try a smaller version, switch to a different lever (sleep/stress/breath),
                or focus on a basic need. If symptoms are persistent or severe, seek professional support.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-slate-900">Is low mood always depression?</summary>
              <p className="mt-3 text-sm text-slate-600">
                No. Low mood can be linked to stress load, sleep loss, life events, burnout, or physical health factors.
                If low mood lasts most days for 2+ weeks or affects safety, it’s worth seeking clinical advice.
              </p>
            </details>
          </div>
        </section>

        <TrustPanel region={region} title="Trust & evidence" />
        {evidence ? <EvidenceFooter evidence={evidence} /> : null}
      </div>
    </main>
  );
}
