import type { ReactNode } from 'react';

export interface TrustCardItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

function DefaultIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M12 2 20 6v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustCards({ items }: { items: TrustCardItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map(item => (
        <div
          key={item.title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {item.icon || <DefaultIcon />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
