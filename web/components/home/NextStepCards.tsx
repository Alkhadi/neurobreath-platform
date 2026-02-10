import Link from 'next/link';
import type { ReactNode } from 'react';

export interface NextStepCardItem {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  highlight?: boolean;
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        d="M5 12h12m0 0-5-5m5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NextStepCards({ items }: { items: NextStepCardItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <Link
          key={item.href + item.title}
          href={item.href}
          className={
            item.highlight
              ? 'group relative rounded-2xl border border-indigo-200/70 bg-white p-5 shadow-sm hover:border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:border-indigo-500/30 dark:hover:border-indigo-400/45'
              : 'group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
          }
        >
          <div className="flex items-start gap-3">
            {item.icon ? (
              <div
                aria-hidden="true"
                className={
                  item.highlight
                    ? 'mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm'
                    : 'mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }
              >
                {item.icon}
              </div>
            ) : null}

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {item.title}
                </h3>
                <span
                  aria-hidden="true"
                  className={
                    item.highlight
                      ? 'text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200'
                  }
                >
                  <ArrowRightIcon />
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
