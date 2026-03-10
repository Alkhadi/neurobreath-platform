import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// NB Hero Primitives — Patch 9
//
// Standardised hero variants for major NeuroBreath page families.
// The homepage hero (HomeHero) is intentionally kept separate as a full-bleed
// brand statement. These variants cover content/tool/guide/chooser pages.
//
// All variants share the same spatial grammar:
//   badge/eyebrow → title → summary → trust note → CTA group
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── HeroCompactNB ───────────────────────────────────────────────────────────
// For content, educational, support, and conditions pages.
// Tinted surface — calm, readable, not competing with the brand hero.

interface HeroCompactNBProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  /** Inline trust strip or audience context note rendered after summary */
  trustNote?: ReactNode;
  /** Primary + secondary CTA links */
  actions?: ReactNode;
  /** Optional audience chip (e.g. "For parents", "For teachers") */
  audienceChip?: ReactNode;
  className?: string;
}

export function HeroCompactNB({
  eyebrow,
  title,
  summary,
  trustNote,
  actions,
  audienceChip,
  className,
}: HeroCompactNBProps) {
  return (
    <div className={cn('hero-compact-nb', className)}>
      <div className="container-nb">
        {(audienceChip ?? eyebrow) ? (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {audienceChip}
            {eyebrow ? (
              <span className="section-eyebrow-nb">{eyebrow}</span>
            ) : null}
          </div>
        ) : null}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--nb-text-heading)] dark:text-white leading-tight max-w-4xl">
          {title}
        </h1>

        {summary ? (
          <p className="mt-4 text-base sm:text-lg text-[color:var(--nb-text-body)] dark:text-white/75 max-w-2xl leading-relaxed">
            {summary}
          </p>
        ) : null}

        {trustNote ? <div className="mt-4">{trustNote}</div> : null}

        {actions ? (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── HeroToolNB ──────────────────────────────────────────────────────────────
// For tool hub pages and individual interactive tool pages.
// Slightly denser than HeroCompactNB — tools lead with action, not narrative.

interface HeroToolNBProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  trustNote?: ReactNode;
  actions?: ReactNode;
  /** Optional tool category badge / icon badge */
  badge?: ReactNode;
  className?: string;
}

export function HeroToolNB({
  eyebrow,
  title,
  summary,
  trustNote,
  actions,
  badge,
  className,
}: HeroToolNBProps) {
  return (
    <div className={cn('hero-compact-nb', className)}>
      <div className="container-nb">
        {(badge ?? eyebrow) ? (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {badge}
            {eyebrow ? (
              <span className="section-eyebrow-nb">{eyebrow}</span>
            ) : null}
          </div>
        ) : null}

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--nb-text-heading)] dark:text-white leading-tight">
          {title}
        </h1>

        {summary ? (
          <p className="mt-3 text-base text-[color:var(--nb-text-body)] dark:text-white/75 max-w-2xl leading-relaxed">
            {summary}
          </p>
        ) : null}

        {trustNote ? (
          <div className="mt-4 trust-strip-nb">{trustNote}</div>
        ) : null}

        {actions ? (
          <div className="mt-5 flex flex-col sm:flex-row gap-3 flex-wrap">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── HeroGuideNB ─────────────────────────────────────────────────────────────
// For guide, article, and educational content pages.
// Prioritises clear reading intent: what the guide covers and who benefits.

interface HeroGuideNBProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  trustNote?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function HeroGuideNB({
  eyebrow,
  title,
  summary,
  trustNote,
  actions,
  className,
}: HeroGuideNBProps) {
  return (
    <div className={cn('hero-compact-nb', className)}>
      <div className="container-nb">
        {eyebrow ? (
          <p className="section-eyebrow-nb mb-3">{eyebrow}</p>
        ) : null}

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[color:var(--nb-text-heading)] dark:text-white leading-tight max-w-3xl">
          {title}
        </h1>

        {summary ? (
          <p className="mt-4 text-base sm:text-lg text-[color:var(--nb-text-body)] dark:text-white/75 max-w-2xl leading-relaxed">
            {summary}
          </p>
        ) : null}

        {trustNote ? <div className="mt-4">{trustNote}</div> : null}

        {actions ? (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── HeroChooserNB ───────────────────────────────────────────────────────────
// For onboarding, "help me choose", get-started, and journey starter pages.
// Supports an optional right-column selector panel for audience chooser flows.

interface HeroChooserNBProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  trustNote?: ReactNode;
  actions?: ReactNode;
  /** Optional audience selector / recommendation card panel (right column) */
  selectorSlot?: ReactNode;
  className?: string;
}

export function HeroChooserNB({
  eyebrow,
  title,
  summary,
  trustNote,
  actions,
  selectorSlot,
  className,
}: HeroChooserNBProps) {
  return (
    <div className={cn('hero-compact-nb', className)}>
      <div className="container-nb">
        <div
          className={cn(
            selectorSlot
              ? 'flex flex-col lg:flex-row gap-8 lg:items-start'
              : '',
          )}
        >
          <div className={cn(selectorSlot ? 'lg:w-[52%]' : '')}>
            {eyebrow ? (
              <p className="section-eyebrow-nb mb-3">{eyebrow}</p>
            ) : null}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--nb-text-heading)] dark:text-white leading-tight">
              {title}
            </h1>

            {summary ? (
              <p className="mt-4 text-base sm:text-lg text-[color:var(--nb-text-body)] dark:text-white/75 max-w-2xl leading-relaxed">
                {summary}
              </p>
            ) : null}

            {trustNote ? <div className="mt-4">{trustNote}</div> : null}

            {actions ? (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
                {actions}
              </div>
            ) : null}
          </div>

          {selectorSlot ? (
            <div className="lg:flex-1">{selectorSlot}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── HeroStandardNB ──────────────────────────────────────────────────────────
// Alias for HeroCompactNB — provided for naming symmetry.
// Use HeroCompactNB directly if you need prop-level control.
export { HeroCompactNB as HeroStandardNB };
