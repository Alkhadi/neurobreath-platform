'use client';

import { useId } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { resolveGlossaryTerm } from '@/lib/glossary/recogniseTerms';

interface GlossaryTooltipProps {
  termId: string;
  display: string;
  region: Region;
}

export function GlossaryTooltip({ termId, display, region }: GlossaryTooltipProps) {
  const id = useId();
  const term = resolveGlossaryTerm(termId);

  if (!term) return <span>{display}</span>;

  const definition = term.plainEnglishDefinition;
  const href = `/${getRegionKey(region)}/glossary/${term.id}`;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border-b border-dotted border-indigo-400 text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-describedby={id}
          >
            {display}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            id={id}
            sideOffset={8}
            className="z-50 max-w-xs rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-lg"
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">{term.term}</p>
              <p className="text-xs text-slate-600">{definition}</p>
              <Link href={href} className="text-xs font-semibold text-indigo-600 hover:underline">
                Learn more
              </Link>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
