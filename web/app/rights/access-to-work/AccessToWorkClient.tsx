'use client';

import * as React from 'react';

import { EducationalDisclaimer } from '@/components/shared/EducationalDisclaimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ACCESS_TO_WORK_CHECKLIST,
  REASONABLE_ADJUSTMENT_EXAMPLES,
  US_ADA_OVERVIEW,
  TEMPLATES,
} from '@/data/phase2/legal-rights';

export default function AccessToWorkClient() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copy = async (id: string, body: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(body);
        setCopiedId(id);
        window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
      }
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-14 space-y-8">
      <header className="space-y-3">
        <p className="text-sm tracking-wide text-slate-500">Educational hub</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Access to Work & Legal Rights Hub
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Plain-language information about workplace and school adjustments,
          along with copyable templates you can adapt before sending.
        </p>
      </header>

      <EducationalDisclaimer variant="legal" title="Not legal advice" />

      <Section title="UK · Access to Work" id="uk">
        <p>
          Access to Work is a UK government scheme that may help with the costs
          of practical support at work. Eligibility, scope, and process are set
          by the UK government and can change. Always check the official guidance
          before applying or relying on this information.
        </p>
        <p className="text-sm text-muted-foreground">
          Official source: search “Access to Work” on the UK government
          website (gov.uk).
        </p>
        <h3 className="font-semibold mt-4">Preparation checklist</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {ACCESS_TO_WORK_CHECKLIST.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Reasonable adjustments — common examples" id="adjustments">
        <p>
          These are common, neuro-affirming examples that people request at
          work or school. They are illustrative only, and what is reasonable
          depends on your specific role and context.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {REASONABLE_ADJUSTMENT_EXAMPLES.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="US · ADA overview" id="us">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {US_ADA_OVERVIEW.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Official source: ADA.gov. Always confirm details with a qualified
          professional before taking action.
        </p>
      </Section>

      <Section title="Copyable templates" id="templates">
        <p className="text-sm text-muted-foreground">
          Each template is a starting point — please adapt the wording before
          sending. Templates do not constitute legal advice.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-lg">{t.title}</CardTitle>
                <CardDescription>Adapt before sending.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
{t.body}
                </pre>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copy(t.id, t.body)}
                  aria-live="polite"
                >
                  {copiedId === t.id ? 'Copied' : 'Copy template'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="If you need more help" id="more">
        <p className="text-sm">
          For specific legal, employment, medical, safeguarding, or crisis
          situations, please contact an appropriate qualified professional or
          emergency service. This hub is educational and is not a substitute
          for professional advice.
        </p>
      </Section>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-2xl font-semibold">
        {title}
      </h2>
      <div className="space-y-3 text-sm sm:text-base leading-relaxed">{children}</div>
    </section>
  );
}
