'use client';

/* eslint-disable jsx-a11y/aria-proptypes */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { AudienceKey, LocaleCopy } from '@/lib/i18n/localeCopy';
import { trackEvent } from '@/lib/analytics/events';

export interface QuickSelectorRecommendation {
  id: string;
  label: string;
  description: string;
  href: string;
  tags: Array<AudienceKey | string>;
  primary?: boolean;
}

interface QuickSelectorProps {
  regionKey: string;
  copy: LocaleCopy;
  recommendations: QuickSelectorRecommendation[];
  maxCards?: number;
}

const STORAGE_KEY = 'nb:audience:v1';

const readStoredAudience = (): AudienceKey | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  if (raw === 'me' || raw === 'parent-carer' || raw === 'teacher' || raw === 'workplace') return raw;
  return null;
};

const storeAudience = (audience: AudienceKey) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, audience);
};

const scoreFor = (rec: QuickSelectorRecommendation, audience: AudienceKey) => {
  const audienceHit = rec.tags.includes(audience) ? 100 : 0;
  const primaryBoost = rec.primary ? 10 : 0;
  return audienceHit + primaryBoost;
};

export function QuickSelector({ regionKey, copy, recommendations, maxCards = 3 }: QuickSelectorProps) {
  const [audience, setAudience] = useState<AudienceKey>(() => readStoredAudience() || 'me');

  const ranked = useMemo(() => {
    const stable = recommendations.map((rec, idx) => ({ rec, idx }));
    stable.sort((a, b) => {
      const sa = scoreFor(a.rec, audience);
      const sb = scoreFor(b.rec, audience);
      if (sb !== sa) return sb - sa;
      return a.idx - b.idx;
    });
    return stable.map(x => x.rec);
  }, [recommendations, audience]);

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{copy.audience.label}</p>
          <h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">Next step in under a minute</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Pick your context to prioritise the best starting point.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Audience quick selector">
        {copy.audience.options.map(option => {
          const selected = option.key === audience;
          const onSelect = () => {
            setAudience(option.key);
            storeAudience(option.key);
            trackEvent('home_audience_select', { audience: option.key, source: `/${regionKey}` });
          };

          return selected ? (
            <button
              key={option.key}
              type="button"
              aria-pressed="true"
              onClick={onSelect}
              className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              {option.label}
            </button>
          ) : (
            <button
              key={option.key}
              type="button"
              aria-pressed="false"
              onClick={onSelect}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-950/40 dark:text-slate-200 dark:border-slate-800 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3">
        {ranked.slice(0, maxCards).map(card => (
          <Link
            key={card.id}
            href={card.href}
            className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
            onClick={() => trackEvent('home_secondary_cta_click', { href: card.href, label: card.label, source: `/${regionKey}` })}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{card.label}</div>
              <span aria-hidden="true" className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">
                →
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
