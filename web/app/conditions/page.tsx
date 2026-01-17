import Link from 'next/link';

const conditions = [
  {
    title: 'ADHD support',
    description: 'Focus tools, routines, and school-friendly guidance.',
    href: '/adhd',
  },
  {
    title: 'Autism support',
    description: 'Sensory-friendly strategies, schedules, and practical routines.',
    href: '/autism',
  },
  {
    title: 'Anxiety support',
    description: 'Grounding techniques, calm plans, and breathing guidance.',
    href: '/anxiety',
  },
  {
    title: 'Dyslexia support',
    description: 'Reading support and accessible learning routines.',
    href: '/dyslexia-reading-training',
  },
  {
    title: 'Sleep support',
    description: 'Wind-down routines and gentle sleep guidance.',
    href: '/sleep',
  },
  {
    title: 'Stress & burnout',
    description: 'Practical steps to reset and reduce overwhelm.',
    href: '/stress',
  },
];

export default function ConditionsHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Conditions we cover</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">One place for neurodivergent support</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            NeuroBreath brings together guides, tools, and trust-first resources. Everything is educational and evidence-informed,
            so families, carers, and educators can find practical next steps without medical claims.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {conditions.map(condition => (
            <Link
              key={condition.title}
              href={condition.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300"
            >
              <h2 className="text-lg font-semibold text-slate-900">{condition.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{condition.description}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
          <h2 className="text-lg font-semibold text-slate-900">How we work</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5">
            <li>Educational information only — never a substitute for professional care.</li>
            <li>Evidence-informed guidance with transparent review cadence.</li>
            <li>Safeguarding, privacy-first design, and accessible UX as defaults.</li>
          </ul>
          <div className="mt-4">
            <Link href="/trust" className="text-sm font-semibold text-indigo-600 hover:underline">
              Visit the Trust Centre
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Start here</h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose a condition hub, then open the tools and guides for practical steps you can use today.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/tools" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Explore tools
            </Link>
            <Link href="/guides" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300">
              Browse guides
            </Link>
          </div>
        </section>

        <section className="text-xs text-slate-500">
          Educational information only. If you are in immediate danger call 999/112 (UK) or 911 (US).
        </section>
      </div>
    </main>
  );
}
