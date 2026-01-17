'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CitationItem {
  label: string;
  url: string;
  note?: string;
}

interface CitationListProps {
  title?: string;
  sources: CitationItem[];
  className?: string;
}

export function CitationList({ title = 'Citations', sources, className }: CitationListProps) {
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

  if (!sources.length) return null;

  return (
    <section className={cn('rounded-2xl border border-slate-200 bg-slate-50/70 p-6', className)} data-citation-list>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-600 mt-1">Sources are copy‑only for transparency — external links are not clickable.</p>
      <ul className="mt-4 space-y-3">
        {sources.map((source, index) => (
          <li key={`${source.label}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{source.label}</p>
                <p className="text-xs text-slate-500 mt-1 break-all">{source.url}</p>
                {source.note ? <p className="text-xs text-slate-500 mt-1">{source.note}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(source.url, index)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                aria-label={`Copy link for ${source.label}`}
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
