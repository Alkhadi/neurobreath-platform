import Image from 'next/image';
import type { ReactNode } from 'react';

interface HomeSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'muted' | 'surface';
  withDivider?: boolean;

  tourId?: string;
  tourOrder?: number;
  tourTitle?: string;
  tourPlacement?: 'auto' | 'right' | 'left' | 'bottom';

  /**
   * When provided, renders a full-bleed background image behind the section.
   * The background spans the viewport width; the content remains constrained.
   */
  backgroundImageSrc?: string;
  backgroundOverlayClassName?: string;

  /** Attach a stable selector for E2E tests. */
  testId?: string;
}

export function HomeSection({
  id,
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  tone = 'default',
  withDivider,
  backgroundImageSrc,
  backgroundOverlayClassName,
  testId,
  tourId,
  tourOrder,
  tourTitle,
  tourPlacement,
}: HomeSectionProps) {
  const toneClass =
    tone === 'muted'
      ? [
          'bg-gradient-to-b',
          'from-muted/45 via-muted/20 to-background',
          'dark:from-muted/10 dark:via-background/0 dark:to-background',
        ].join(' ')
      : tone === 'surface'
        ? [
            'bg-gradient-to-b',
            'from-background via-background to-muted/15',
            'dark:from-background dark:via-background dark:to-muted/5',
          ].join(' ')
        : [
            'bg-gradient-to-b',
            'from-muted/20 via-background/35 to-muted/15',
            'dark:via-background/10',
          ].join(' ');

  const separatorClass =
    'isolate before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px ' +
    'before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent ' +
    'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px ' +
    'after:bg-gradient-to-r after:from-transparent after:via-border/40 after:to-transparent';

  const hasFullBleedBackground = Boolean(backgroundImageSrc);

  return (
    <section
      id={id}
      data-testid={testId}
      data-tour={tourId}
      data-tour-order={typeof tourOrder === 'number' ? String(tourOrder) : undefined}
      data-tour-title={tourTitle}
      data-tour-placement={tourPlacement}
      className={`relative py-12 sm:py-16 ${separatorClass} ${toneClass} ${withDivider ? 'border-t border-border/60' : ''} ${hasFullBleedBackground ? 'overflow-hidden' : ''}`}
    >
      {hasFullBleedBackground ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Image
            src={backgroundImageSrc!}
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      {hasFullBleedBackground ? (
        <div
          aria-hidden="true"
          className={
            backgroundOverlayClassName ||
            'pointer-events-none absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/90 dark:from-background/80 dark:via-background/65 dark:to-background/90'
          }
        />
      ) : null}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow || title || subtitle || actions ? (
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {eyebrow ? (
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </header>
        ) : null}

        <div className={eyebrow || title || subtitle || actions ? 'mt-5' : ''}>{children}</div>
      </div>
    </section>
  );
}
