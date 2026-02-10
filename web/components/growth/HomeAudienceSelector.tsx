'use client';

/* eslint-disable jsx-a11y/aria-proptypes */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import type { AudienceKey, LocaleCopy } from '@/lib/i18n/localeCopy';
import { trackEvent } from '@/lib/analytics/events';

export interface AudienceRecommendation {
  id: string;
  label: string;
  description: string;
  href: string;
  tags: Array<AudienceKey | string>;
  primary?: boolean;
}

interface HomeAudienceSelectorProps {
  region: Region;
  copy: LocaleCopy;
  recommendations: AudienceRecommendation[];
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

const scoreFor = (rec: AudienceRecommendation, audience: AudienceKey) => {
  // Deterministic scoring: audience tag match is strongest, otherwise stable baseline.
  const audienceHit = rec.tags.includes(audience) ? 100 : 0;
  const primaryBoost = rec.primary ? 10 : 0;
  return audienceHit + primaryBoost;
};

export function HomeAudienceSelector({ region, copy, recommendations }: HomeAudienceSelectorProps) {
  const regionKey = getRegionKey(region);
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
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{copy.audience.label}</h2>
            <p className="text-sm text-slate-600">Choose your context to prioritise the best next step.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Audience selector">
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
                  className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {option.label}
                </button>
              ) : (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed="false"
                  onClick={onSelect}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ranked.slice(0, 6).map(card => (
          <Link
            key={card.id}
            href={card.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            onClick={() => trackEvent('home_secondary_cta_click', { href: card.href, label: card.label, source: `/${regionKey}` })}
          >
            <div className="text-base font-semibold text-slate-900 group-hover:text-slate-950">{card.label}</div>
            <p className="mt-2 text-sm text-slate-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
