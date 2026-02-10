import Link from 'next/link';

export interface ConditionHubPageProps {
  title: string;
  subtitle: string;
  educationalOnlyNote?: string;
  primaryLinks?: Array<{ href: string; label: string; description?: string }>;
  secondaryLinks?: Array<{ href: string; label: string }>;
  relatedTags?: string[];
}

export function ConditionHubPage({
  title,
  subtitle,
  educationalOnlyNote = 'Educational information only. Not medical advice. No diagnosis. If you are in immediate danger call 999/112 (UK) or 911 (US).',
  primaryLinks = [],
  secondaryLinks = [],
  relatedTags = [],
}: ConditionHubPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] max-w-[1100px] py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Condition hub</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{subtitle}</p>
        </header>

        {primaryLinks.length ? (
          <section className="grid gap-4 md:grid-cols-2">
            {primaryLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <h2 className="text-lg font-semibold text-slate-900">{link.label}</h2>
                {link.description ? <p className="mt-2 text-sm text-slate-600">{link.description}</p> : null}
              </Link>
            ))}
          </section>
        ) : null}

        {relatedTags.length ? (
          <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Related support areas</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTags.map(tag => (
                <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {secondaryLinks.length ? (
          <section className="flex flex-wrap gap-3">
            {secondaryLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
              >
                {link.label}
              </Link>
            ))}
          </section>
        ) : null}

        <section className="text-xs text-slate-500">{educationalOnlyNote}</section>
      </div>
    </main>
  );
}
