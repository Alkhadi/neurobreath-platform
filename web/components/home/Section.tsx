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
  const toneClass =
    tone === 'muted'
      ? 'bg-slate-50/70 dark:bg-slate-950/40'
      : 'bg-transparent';

  return (
    <section
      id={id}
      className={`py-10 sm:py-14 ${toneClass} ${withDivider ? 'border-t border-slate-200/70 dark:border-slate-800/70' : ''}`}
    >
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px]">
        {eyebrow || title || subtitle || actions ? (
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {eyebrow ? (
                <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
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
