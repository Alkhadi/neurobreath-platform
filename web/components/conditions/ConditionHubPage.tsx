import Link from 'next/link';
import { PageShellNB } from '@/components/layout/page-primitives';
import { SafetyNoteNB } from '@/components/trust/trust-primitives';

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
    <PageShellNB tone="soft">
      <div className="container-nb py-12 space-y-10">
        {/* Page intro */}
        <header className="space-y-3">
          <p className="section-eyebrow-nb">Condition hub</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
            {title}
          </h1>
          <p className="text-base text-[color:var(--nb-text-body)] dark:text-white/75 max-w-3xl">
            {subtitle}
          </p>
        </header>

        {/* Primary links */}
        {primaryLinks.length > 0 ? (
          <section aria-label="Support areas" className="feature-grid-nb">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="content-card-nb block focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nb-btn-primary-bg)]/40 no-underline"
              >
                <h2 className="text-lg font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
                  {link.label}
                </h2>
                {link.description ? (
                  <p className="mt-2 text-sm text-[color:var(--nb-text-body)] dark:text-white/70">
                    {link.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </section>
        ) : null}

        {/* Related tags */}
        {relatedTags.length > 0 ? (
          <section
            aria-label="Related support areas"
            className="trust-block-nb"
          >
            <h2 className="text-base font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
              Related support areas
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white dark:bg-white/10 px-3 py-1 text-xs font-semibold text-[color:var(--nb-text-body)] dark:text-white/80 border border-[color:var(--nb-border-soft)] dark:border-white/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Secondary links */}
        {secondaryLinks.length > 0 ? (
          <nav aria-label="Secondary links" className="flex flex-wrap gap-3">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-[color:var(--nb-border-soft)] dark:border-white/10 px-4 py-2 text-sm font-semibold text-[color:var(--nb-text-heading)] dark:text-white hover:border-[color:var(--nb-border-muted)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        {/* Safety note */}
        <SafetyNoteNB>{educationalOnlyNote}</SafetyNoteNB>
      </div>
    </PageShellNB>
  );
}
