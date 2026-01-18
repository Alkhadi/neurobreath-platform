import type { ReactNode } from 'react';

interface HomeSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'muted';
  withDivider?: boolean;
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
}: HomeSectionProps) {
  const toneClass = tone === 'muted' ? 'bg-muted/30' : 'bg-transparent';

  return (
    <section
      id={id}
      className={`py-10 sm:py-14 ${toneClass} ${withDivider ? 'border-t border-border/60' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
