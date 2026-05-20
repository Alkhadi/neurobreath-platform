import Link from 'next/link';

import { EducationalDisclaimer } from '@/components/shared/EducationalDisclaimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonaToolkit, ToolkitCard } from '@/data/phase2/persona-toolkits';

export function ToolkitView({ toolkit }: { toolkit: PersonaToolkit }) {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-10 sm:py-14 space-y-10">
      <header className="space-y-3">
        <p className="text-sm tracking-wide text-slate-500">Toolkit</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {toolkit.title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {toolkit.audience}
        </p>
        <p className="text-base">{toolkit.intro}</p>
      </header>

      <EducationalDisclaimer />

      <Group heading="Start here" cards={toolkit.startHere} />
      <Group heading="Most useful tools" cards={toolkit.mostUseful} />
      <Group heading="Common situations" cards={toolkit.commonSituations} />
      <Group heading="Templates and conversations" cards={toolkit.templates} />

      <nav aria-label="Other toolkits" className="pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-2">Other toolkits</p>
        <ul className="flex flex-wrap gap-3 text-sm">
          <li><Link className="underline" href="/toolkits/parents">Parents</Link></li>
          <li><Link className="underline" href="/toolkits/educators">Educators</Link></li>
          <li><Link className="underline" href="/toolkits/paediatricians">Paediatricians</Link></li>
          <li><Link className="underline" href="/toolkits/professionals">Professionals</Link></li>
        </ul>
      </nav>
    </main>
  );
}

function Group({ heading, cards }: { heading: string; cards: ToolkitCard[] }) {
  if (!cards.length) return null;
  return (
    <section aria-labelledby={heading.replace(/\s+/g, '-').toLowerCase()} className="space-y-3">
      <h2
        id={heading.replace(/\s+/g, '-').toLowerCase()}
        className="text-2xl font-semibold"
      >
        {heading}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-lg">{c.title}</CardTitle>
              {c.href ? (
                <CardDescription>
                  <Link className="underline" href={c.href}>
                    Open related resource
                  </Link>
                </CardDescription>
              ) : (
                <CardDescription>Practical starting point.</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm">{c.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default ToolkitView;
