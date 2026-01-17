'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EvidenceSource } from '@/lib/evidence/evidence-registry';

interface CitationsProps {
  sources: EvidenceSource[];
  title?: string;
  className?: string;
  compact?: boolean;
}

export function Citations({ sources, title = 'Evidence sources', className, compact = false }: CitationsProps) {
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
    <section className={cn('rounded-2xl border border-slate-200 bg-white/80 p-6', className)}>
      <h2 className={cn('font-semibold text-slate-900', compact ? 'text-base' : 'text-lg')}>{title}</h2>
      <p className="text-sm text-slate-600 mt-1">
        References are shown for transparency. You can copy links without leaving this page.
      </p>
      <ul className="mt-4 space-y-3">
        {sources.map((source, index) => (
          <li key={source.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{source.title}</p>
                <p className="text-xs text-slate-600">{source.publisher}</p>
                <p className="text-xs text-slate-500 mt-1 break-all">{source.url}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    {source.region}
                  </span>
                  {source.contentType ? (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700">
                      {source.contentType.replace('_', ' ')}
                    </span>
                  ) : null}
                  {source.lastChecked ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                      Checked {source.lastChecked}
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(source.url, index)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                aria-label={`Copy link for ${source.title}`}
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
