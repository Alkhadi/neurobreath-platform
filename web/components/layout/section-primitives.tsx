import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// NB Section-Composition Primitives — Patch 9
//
// Reusable section-level patterns that standardise recurring structural
// intentions across NeuroBreath page families:
//   - Feature/tool card grids
//   - Content cards
//   - Numbered steps
//   - Related "what next" grids
//   - CTA blocks
//   - Support blocks
// ─────────────────────────────────────────────────────────────────────────────

// ─── FeatureGridNB ───────────────────────────────────────────────────────────
// Responsive grid for tool cards, feature cards, or condition cards.

interface FeatureGridNBProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGridNB({
  children,
  columns = 2,
  className,
}: FeatureGridNBProps) {
  const colClass =
    columns === 3
      ? 'feature-grid-nb--3'
      : columns === 4
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--nb-card-gap)]'
        : 'feature-grid-nb';

  return <div className={cn(colClass, className)}>{children}</div>;
}

// ─── ContentCardNB ───────────────────────────────────────────────────────────
// A single card inside FeatureGridNB (or standalone). Supports icon, title,
// description, optional link wrapping, and an action slot.

interface ContentCardNBProps {
  title: string;
  description?: string;
  /** Icon element (e.g. Lucide icon) */
  icon?: ReactNode;
  /** When provided, wraps the entire card in a <Link> */
  href?: string;
  /** Action element rendered at the bottom of the card */
  action?: ReactNode;
  children?: ReactNode;
  /** Custom icon background colour (hex or CSS value) */
  accent?: string;
  className?: string;
}

export function ContentCardNB({
  title,
  description,
  icon,
  href,
  action,
  children,
  accent,
  className,
}: ContentCardNBProps) {
  const inner = (
    <div
      className={cn(
        'content-card-nb h-full flex flex-col',
        href
          ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nb-btn-primary-bg)]/40'
          : '',
        className,
      )}
    >
      {icon ? (
        <div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
          style={
            accent
              ? { background: accent }
              : { background: 'var(--nb-surface-muted)' }
          }
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}

      <h3 className="text-lg font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
        {title}
      </h3>

      {description ? (
        <p className="mt-2 text-sm text-[color:var(--nb-text-body)] dark:text-white/70 leading-relaxed flex-1">
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-3 flex-1">{children}</div> : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {inner}
      </Link>
    );
  }

  return inner;
}

// ─── GuideSectionNB ──────────────────────────────────────────────────────────
// A guide/educational section: heading + body prose + optional highlights.

interface GuideSectionNBProps {
  title: string;
  children: ReactNode;
  level?: 2 | 3;
  className?: string;
}

export function GuideSectionNB({
  title,
  children,
  level = 2,
  className,
}: GuideSectionNBProps) {
  const HeadingTag = `h${level}` as 'h2' | 'h3';

  return (
    <section className={cn('space-y-4', className)}>
      <HeadingTag className="section-title-nb">{title}</HeadingTag>
      <div className="prose-nb text-[color:var(--nb-text-body)] dark:text-white/75 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

// ─── StepsSectionNB ──────────────────────────────────────────────────────────
// Numbered steps list. Works for onboarding flows, guide procedures, and
// any sequential process with a clear order.

interface StepItem {
  title: string;
  description: string;
}

interface StepsSectionNBProps {
  steps: StepItem[];
  /** Override the step number background colour */
  accentColor?: string;
  className?: string;
}

export function StepsSectionNB({
  steps,
  accentColor = 'var(--nb-btn-primary-bg)',
  className,
}: StepsSectionNBProps) {
  return (
    <ol className={cn('space-y-5', className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <div
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          >
            {index + 1}
          </div>
          <div className="pt-0.5">
            <h3 className="text-base font-semibold text-[color:var(--nb-text-heading)] dark:text-white leading-snug">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--nb-text-body)] dark:text-white/70 leading-relaxed">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── RelatedNextStepNB ───────────────────────────────────────────────────────
// "What next" link cards. Used at the page end to guide continuation.

interface NextStepItem {
  href: string;
  label: string;
  description?: string;
  eyebrow?: string;
}

interface RelatedNextStepNBProps {
  items: NextStepItem[];
  className?: string;
}

export function RelatedNextStepNB({
  items,
  className,
}: RelatedNextStepNBProps) {
  return (
    <div className={cn('related-next-step-nb', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group rounded-2xl border border-[color:var(--nb-border-soft)] bg-[color:var(--nb-surface-card)] p-5 hover:border-[color:var(--nb-border-muted)] hover:shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nb-btn-primary-bg)]/40 dark:bg-[#1e293b] dark:border-white/10 no-underline"
        >
          {item.eyebrow ? (
            <p className="section-eyebrow-nb mb-2">{item.eyebrow}</p>
          ) : null}
          <h3 className="text-base font-semibold text-[color:var(--nb-text-heading)] dark:text-white group-hover:text-[color:var(--nb-text-link)] transition-colors">
            {item.label}
          </h3>
          {item.description ? (
            <p className="mt-1 text-sm text-[color:var(--nb-text-body)] dark:text-white/70">
              {item.description}
            </p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

// ─── CTASectionNB ────────────────────────────────────────────────────────────
// Standardised page-bottom CTA block. Consistent with the existing FinalCTA
// component but accepts the extended prop set from this system.

interface CTASectionNBProps {
  title: string;
  summary?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Small trust note below the summary (e.g. "Educational only") */
  trustNote?: string;
  className?: string;
}

export function CTASectionNB({
  title,
  summary,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  trustNote,
  className,
}: CTASectionNBProps) {
  return (
    <div
      className={cn(
        'rounded-[1.5rem] border border-black/5 dark:border-white/10 bg-white/90 dark:bg-white/5 p-6 sm:p-8 shadow-xl',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--nb-text-heading)] dark:text-white">
            {title}
          </h2>
          {summary ? (
            <p className="mt-1 text-sm text-[color:var(--nb-text-body)] dark:text-white/70">
              {summary}
            </p>
          ) : null}
          {trustNote ? (
            <p className="mt-2 text-xs text-[color:var(--nb-text-secondary)] dark:text-white/50">
              {trustNote}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
          <Link href={primaryHref} className="nb-btn-primary">
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="nb-btn-secondary">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── SupportBlockNB ──────────────────────────────────────────────────────────
// Flexible support / help panel. Used for crisis signposting, peer support
// links, and professional service mentions.

interface SupportBlockNBProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function SupportBlockNB({
  title,
  children,
  className,
}: SupportBlockNBProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[color:var(--nb-border-soft)] bg-[color:var(--nb-surface-soft)] p-5 sm:p-6',
        'dark:bg-[#1e293b] dark:border-white/10',
        className,
      )}
    >
      {title ? (
        <h2 className="text-base font-semibold text-[color:var(--nb-text-heading)] dark:text-white mb-3">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}

// ─── ContentCardSectionNB ────────────────────────────────────────────────────
// A convenience wrapper for a SectionHeader + FeatureGrid composition.

interface ContentCardSectionNBProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}

export function ContentCardSectionNB({
  eyebrow,
  title,
  subtitle,
  columns = 2,
  children,
  className,
}: ContentCardSectionNBProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(eyebrow ?? title ?? subtitle) ? (
        <div>
          {eyebrow ? <p className="section-eyebrow-nb mb-2">{eyebrow}</p> : null}
          {title ? <h2 className="section-title-nb">{title}</h2> : null}
          {subtitle ? (
            <p className="section-subtitle-nb mt-1">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
      <FeatureGridNB columns={columns}>{children}</FeatureGridNB>
    </div>
  );
}
