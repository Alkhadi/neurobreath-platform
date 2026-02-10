'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReferenceItem {
  title: string;
  publisher: string;
  url: string;
  region?: 'UK' | 'US' | 'GLOBAL';
  badge?: string;
}

interface ReferencesProps {
  title?: string;
  items: ReferenceItem[];
  className?: string;
}

export function References({ title = 'References', items, className }: ReferencesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setCopiedIndex(null);
    }
  };

  if (!items.length) return null;

  return (
    <section className={cn('rounded-2xl border border-slate-200 bg-slate-50/70 p-6', className)}>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-600 mt-1">
        Sources are listed for transparency. We do not require you to open external sites.
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-600">{item.publisher}</p>
                <p className="text-xs text-slate-500 mt-1 break-all">{item.url}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.region ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                      {item.region}
                    </span>
                  ) : null}
                  {item.badge ? (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(item.url, index)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                aria-label={`Copy link for ${item.title}`}
              >
                {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedIndex === index ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
