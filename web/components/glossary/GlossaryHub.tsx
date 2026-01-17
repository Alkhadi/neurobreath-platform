'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { GlossaryTerm } from '@/lib/glossary/glossary';
import { POPULAR_TERM_IDS } from '@/lib/glossary/glossary';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';

interface GlossaryHubProps {
  terms: GlossaryTerm[];
  region: Region;
}

const TAGS: Array<{ id: GlossaryTerm['tags'][number]; label: string }> = [
  { id: 'condition', label: 'Conditions' },
  { id: 'tool', label: 'Tools' },
  { id: 'education', label: 'Education' },
  { id: 'school', label: 'School' },
  { id: 'workplace', label: 'Workplace' },
  { id: 'parenting', label: 'Parenting' },
  { id: 'evidence', label: 'Evidence' },
];

const getSpelling = (term: GlossaryTerm, region: Region) =>
  region === 'US' ? term.localeVariants.us.spelling : term.localeVariants.uk.spelling;

export function GlossaryHub({ terms, region }: GlossaryHubProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<GlossaryTerm['tags'][number] | 'all'>('all');

  const filtered = useMemo(() => {
    return terms.filter(term => {
      const spelling = getSpelling(term, region);
      const matchesQuery = !query || spelling.toLowerCase().includes(query.toLowerCase());
      const matchesTag = activeTag === 'all' || term.tags.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [terms, query, activeTag, region]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    filtered.forEach(term => {
      const spelling = getSpelling(term, region);
      const letter = spelling.charAt(0).toUpperCase();
      const list = map.get(letter) || [];
      list.push(term);
      map.set(letter, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, region]);

  const popularTerms = terms.filter(term => POPULAR_TERM_IDS.includes(term.id));
  const regionKey = getRegionKey(region);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Search the glossary</h2>
            <p className="text-sm text-slate-600">Plain‑English definitions for neurodivergent support and learning.</p>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search terms"
              className="w-full text-sm text-slate-900 outline-none"
              aria-label="Search glossary terms"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag('all')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              activeTag === 'all' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
            }`}
          >
            All
          </button>
          {TAGS.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setActiveTag(tag.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                activeTag === tag.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Popular terms</h2>
        <p className="text-sm text-slate-600">A quick start for the most searched concepts.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularTerms.map(term => (
            <Link
              key={term.id}
              href={`/${regionKey}/glossary/${term.id}`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-indigo-300"
            >
              {getSpelling(term, region)}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">A–Z index</h2>
        <p className="text-sm text-slate-600">Browse by letter or use the search box.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {grouped.map(([letter]) => (
            <a key={letter} href={`#glossary-${letter}`} className="text-sm font-semibold text-indigo-600 hover:underline">
              {letter}
            </a>
          ))}
        </div>
        <div className="mt-6 space-y-6">
          {grouped.map(([letter, list]) => (
            <div key={letter} id={`glossary-${letter}`} className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">{letter}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map(term => (
                  <Link
                    key={term.id}
                    href={`/${regionKey}/glossary/${term.id}`}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:border-indigo-300"
                  >
                    <span className="font-semibold text-slate-900">{getSpelling(term, region)}</span>
                    <p className="mt-1 text-xs text-slate-500">{term.plainEnglishDefinition}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Start here</h2>
        <p className="text-sm text-slate-600">Not sure where to begin? Use a guided starting point.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/${regionKey}/conditions`}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Explore conditions
          </Link>
          <Link
            href={`/${regionKey}/help-me-choose`}
            className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:border-indigo-300"
          >
            Help me choose
          </Link>
        </div>
      </section>
    </div>
  );
}
