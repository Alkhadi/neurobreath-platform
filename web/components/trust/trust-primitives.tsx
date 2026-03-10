import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';

// ─────────────────────────────────────────────────────────────────────────────
// NB Trust Primitives — Patch 9
//
// Standardised trust, credibility, safety, and audience-context blocks that
// extend the existing TrustPanel / TrustMiniPanel / EducationalDisclaimerInline
// components. These new primitives share the NB design-token surface so they
// behave consistently in light and dark contexts.
// ─────────────────────────────────────────────────────────────────────────────

// ─── TrustStripNB ────────────────────────────────────────────────────────────
// Minimal inline trust row. Sits below the hero title/summary to communicate
// educational intent without disrupting the reading flow.

interface TrustStripNBProps {
  region?: Region;
  /** Override the default "Educational only. Not medical advice." label */
  disclaimer?: string;
  children?: ReactNode;
  className?: string;
}

export function TrustStripNB({
  region,
  disclaimer,
  children,
  className,
}: TrustStripNBProps) {
  const regionKey = region ? getRegionKey(region) : 'uk';
  return (
    <div className={cn('trust-strip-nb', className)} role="note">
      <span>
        {disclaimer ?? 'Educational only. Not medical advice.'}
      </span>
      {region ? (
        <Link href={`/${regionKey}/trust`}>
          Trust Centre
        </Link>
      ) : null}
      {children}
    </div>
  );
}

// ─── SafetyNoteNB ────────────────────────────────────────────────────────────
// Block-level safety / educational disclaimer. Replaces inconsistent
// amber-box one-offs across pages with a single shared token.

interface SafetyNoteNBProps {
  /** Optional context label rendered as bold prefix (e.g. "Note", "ADHD") */
  label?: string;
  children?: ReactNode;
  variant?: 'default' | 'compact';
  className?: string;
}

export function SafetyNoteNB({
  label,
  children,
  variant = 'default',
  className,
}: SafetyNoteNBProps) {
  return (
    <div
      className={cn(
        'safety-note-nb',
        variant === 'compact' ? 'text-xs py-2 px-3' : '',
        className,
      )}
      role="note"
    >
      {label ? <strong>{label}: </strong> : null}
      {children ??
        'Educational information only. It can support wellbeing routines, but it is not medical advice or a diagnosis.'}
    </div>
  );
}

// ─── TrustBlockNB ────────────────────────────────────────────────────────────
// Section-level trust and credibility block. Replaces TrustPanel / TrustMiniPanel
// usage on pages that need a standardised trust section.

interface TrustBlockNBProps {
  region?: Region;
  title?: string;
  children?: ReactNode;
  /** Show evidence-policy / citations / Trust Centre pill links */
  showLinks?: boolean;
  className?: string;
}

export function TrustBlockNB({
  region,
  title = 'Trust & evidence',
  children,
  showLinks = true,
  className,
}: TrustBlockNBProps) {
  const regionKey = region ? getRegionKey(region) : 'uk';

  return (
    <div className={cn('trust-block-nb', className)}>
      <h2 className="text-base font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[color:var(--nb-text-body)] dark:text-white/75 leading-relaxed">
        {children ??
          'NeuroBreath provides educational support only — not medical advice or diagnosis. Learn how we keep content safe and evidence-informed.'}
      </p>
      {showLinks ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {region ? (
            <>
              <Link
                href={`/${regionKey}/trust/evidence-policy`}
                className="rounded-full border border-[color:var(--nb-border-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--nb-text-secondary)] hover:border-[color:var(--nb-border-muted)] transition-colors dark:border-white/10 dark:text-white/70 dark:hover:text-white"
              >
                Evidence policy
              </Link>
              <Link
                href={`/${regionKey}/trust/citations`}
                className="rounded-full border border-[color:var(--nb-border-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--nb-text-secondary)] hover:border-[color:var(--nb-border-muted)] transition-colors dark:border-white/10 dark:text-white/70 dark:hover:text-white"
              >
                Citations
              </Link>
              <Link
                href={`/${regionKey}/trust`}
                className="rounded-full border border-[color:var(--nb-border-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--nb-text-secondary)] hover:border-[color:var(--nb-border-muted)] transition-colors dark:border-white/10 dark:text-white/70 dark:hover:text-white"
              >
                Trust Centre
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ─── CredibilityBlockNB ──────────────────────────────────────────────────────
// Flexible credibility signal block. Accepts arbitrary children so it can
// wrap evidence stats, team credentials, or review metadata.

interface CredibilityBlockNBProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function CredibilityBlockNB({
  title,
  children,
  className,
}: CredibilityBlockNBProps) {
  return (
    <div className={cn('trust-block-nb', className)}>
      {title ? (
        <h2 className="text-base font-semibold text-[color:var(--nb-text-heading)] dark:text-white mb-3">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}

// ─── AudienceContextNB ───────────────────────────────────────────────────────
// "Who this page is for" contextual note. Used near the hero or intro to
// help visitors quickly identify relevance.

interface AudienceContextNBProps {
  children: ReactNode;
  className?: string;
}

export function AudienceContextNB({
  children,
  className,
}: AudienceContextNBProps) {
  return (
    <div
      className={cn('audience-context-nb', className)}
      role="note"
    >
      {children}
    </div>
  );
}
