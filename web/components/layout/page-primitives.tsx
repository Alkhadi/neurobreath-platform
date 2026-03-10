import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// NB Page-Composition Primitives — Patch 9
//
// Shared page-shell, intro, body, ending, and section building blocks that
// extend the established NB design system (patches 1–8).
//
// All tones and spacings consume existing CSS custom properties from globals.css
// so they inherit the complete dark-mode and accessibility behaviour already
// established by earlier patches.
// ─────────────────────────────────────────────────────────────────────────────

// ─── PageShellNB ─────────────────────────────────────────────────────────────
// Outer <main> wrapper. Replaces ad-hoc background classes on individual pages.
// tone="soft"     → light slate-50/white gradient (most content pages)
// tone="base"     → plain white/dark background (dense tool pages)
// tone="gradient" → subtle muted-to-background gradient (marketing/editorial)

interface PageShellNBProps {
  children: ReactNode;
  tone?: 'base' | 'soft' | 'gradient';
  className?: string;
  /** Accessible landmark label for pages that have multiple <main> regions */
  label?: string;
}

export function PageShellNB({
  children,
  tone = 'soft',
  className,
  label,
}: PageShellNBProps) {
  const toneClass =
    tone === 'base'
      ? 'bg-white dark:bg-[#0B1220]'
      : tone === 'gradient'
        ? 'bg-gradient-to-b from-muted/45 via-background to-background dark:from-muted/10 dark:via-background dark:to-background'
        : 'bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#0f172a]';

  return (
    <main
      className={cn('page-shell-nb', toneClass, className)}
      aria-label={label}
    >
      {children}
    </main>
  );
}

// ─── PageIntroNB ─────────────────────────────────────────────────────────────
// Standardised top-of-page block: breadcrumb → eyebrow → title → summary →
// trust note → actions. Used inside PageShellNB for content/educational pages.

interface PageIntroNBProps {
  breadcrumb?: ReactNode;
  eyebrow?: string;
  title: string;
  summary?: string;
  /** Inline trust note rendered below the summary (e.g. TrustStripNB) */
  trustNote?: ReactNode;
  /** Primary + secondary CTA buttons */
  actions?: ReactNode;
  children?: ReactNode;
  /** Use narrow (page-content-nb) rather than wide (container-nb) container */
  narrow?: boolean;
  className?: string;
}

export function PageIntroNB({
  breadcrumb,
  eyebrow,
  title,
  summary,
  trustNote,
  actions,
  children,
  narrow = true,
  className,
}: PageIntroNBProps) {
  return (
    <div
      className={cn(
        'page-intro-nb',
        narrow ? 'page-content-nb' : 'container-nb',
        className,
      )}
    >
      {breadcrumb ? (
        <div className="mb-4 text-sm text-[color:var(--nb-text-secondary)]">
          {breadcrumb}
        </div>
      ) : null}

      {eyebrow ? <p className="section-eyebrow-nb mb-3">{eyebrow}</p> : null}

      <h1 className="text-3xl sm:text-4xl font-semibold text-[color:var(--nb-text-heading)] dark:text-white leading-tight">
        {title}
      </h1>

      {summary ? (
        <p className="mt-3 text-base sm:text-lg text-[color:var(--nb-text-body)] dark:text-white/75 max-w-3xl leading-relaxed">
          {summary}
        </p>
      ) : null}

      {trustNote ? <div className="mt-4">{trustNote}</div> : null}

      {actions ? (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 flex-wrap">
          {actions}
        </div>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

// ─── PageBodyNB ──────────────────────────────────────────────────────────────
// Main content area. Handles bottom padding so the page-ending block is
// naturally separated from the content stack.

interface PageBodyNBProps {
  children: ReactNode;
  /** Use wide (container-nb) rather than narrow (page-content-nb) container */
  wide?: boolean;
  className?: string;
}

export function PageBodyNB({ children, wide, className }: PageBodyNBProps) {
  return (
    <div
      className={cn(
        'page-body-nb',
        wide ? 'container-nb' : 'page-content-nb',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── PageEndNB ───────────────────────────────────────────────────────────────
// Standardised page-ending block. Renders "what next" / related content /
// support CTAs consistently across all page families.

interface PageEndNBProps {
  eyebrow?: string;
  title?: string;
  summary?: string;
  children: ReactNode;
  className?: string;
}

export function PageEndNB({
  eyebrow,
  title,
  summary,
  children,
  className,
}: PageEndNBProps) {
  return (
    <div className={cn('page-end-nb container-nb', className)}>
      {(eyebrow ?? title ?? summary) ? (
        <div className="mb-6">
          {eyebrow ? <p className="section-eyebrow-nb mb-2">{eyebrow}</p> : null}
          {title ? (
            <h2 className="section-title-nb">{title}</h2>
          ) : null}
          {summary ? (
            <p className="section-subtitle-nb mt-1">{summary}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

// ─── SectionNB ───────────────────────────────────────────────────────────────
// Drop-in section wrapper aligned to the HomeSection pattern.
// Supports tone variants, optional section header, and tour attributes.

interface SectionNBProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'muted' | 'surface' | 'dark';
  withDivider?: boolean;
  /** Use wide (container-nb) rather than narrow (page-content-nb) container */
  wide?: boolean;
  className?: string;
  testId?: string;
}

export function SectionNB({
  id,
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  tone = 'default',
  withDivider,
  wide,
  className,
  testId,
}: SectionNBProps) {
  const toneClass =
    tone === 'muted'
      ? 'bg-gradient-to-b from-muted/45 via-muted/20 to-background dark:from-muted/10 dark:via-background/0 dark:to-background'
      : tone === 'surface'
        ? 'bg-gradient-to-b from-background via-background to-muted/15 dark:from-background dark:via-background dark:to-muted/5'
        : tone === 'dark'
          ? 'bg-[#0F172A] dark:bg-[#0F172A]'
          : 'bg-gradient-to-b from-muted/20 via-background/35 to-muted/15 dark:via-background/10';

  const hasHeader = eyebrow ?? title ?? subtitle ?? actions;

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn(
        'relative section-nb',
        toneClass,
        withDivider ? 'border-t border-[color:var(--nb-border-soft)]' : '',
        className,
      )}
    >
      <div className={wide ? 'container-nb' : 'page-content-nb'}>
        {hasHeader ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              {eyebrow ? <p className="section-eyebrow-nb">{eyebrow}</p> : null}
              {title ? <h2 className="section-title-nb">{title}</h2> : null}
              {subtitle ? <p className="section-subtitle-nb mt-1">{subtitle}</p> : null}
            </div>
            {actions ? <div className="shrink-0 mt-2 sm:mt-0">{actions}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

// ─── SectionGroupNB ──────────────────────────────────────────────────────────
// Groups related sections with consistent vertical rhythm between them.

interface SectionGroupNBProps {
  children: ReactNode;
  className?: string;
}

export function SectionGroupNB({ children, className }: SectionGroupNBProps) {
  return (
    <div className={cn('stack-nb-section', className)}>
      {children}
    </div>
  );
}

// ─── SectionHeaderNB ─────────────────────────────────────────────────────────
// Standalone section heading block. Used when the header and body need
// separate containers or independent alignment.

interface SectionHeaderNBProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  level?: 2 | 3;
  className?: string;
}

export function SectionHeaderNB({
  eyebrow,
  title,
  subtitle,
  actions,
  level = 2,
  className,
}: SectionHeaderNBProps) {
  const HeadingTag = `h${level}` as 'h2' | 'h3';

  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6',
        className,
      )}
    >
      <div>
        {eyebrow ? <p className="section-eyebrow-nb">{eyebrow}</p> : null}
        <HeadingTag className="section-title-nb">{title}</HeadingTag>
        {subtitle ? (
          <p className="section-subtitle-nb mt-1">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="shrink-0 mt-2 sm:mt-0">{actions}</div>
      ) : null}
    </div>
  );
}
