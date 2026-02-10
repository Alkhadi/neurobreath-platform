'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ConditionEntry } from '@/lib/coverage/conditions';

interface ConditionsHubProps {
  conditions: ConditionEntry[];
  regionKey: string;
  supportNeedLabels: Record<string, string>;
  audienceLabels: Record<string, string>;
}

const normaliseText = (value: string) => value.toLowerCase().trim();

const titleCase = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');

const formatSlugLabel = (path: string, suffix: string) => {
  const cleaned = path
    .replace(/^\//, '')
    .replace(/^guides\//, '')
    .replace(/^tools\//, '')
    .replace(/^conditions\//, '')
    .replace(/[-/]+/g, ' ')
    .trim();

  return `${titleCase(cleaned)} ${suffix}`.trim();
};

const getGuideLink = (path: string, regionKey: string) =>
  path.startsWith('/guides/') ? `/${regionKey}${path}` : path;

export default function ConditionsHub({ conditions, regionKey, supportNeedLabels, audienceLabels }: ConditionsHubProps) {
  const [query, setQuery] = useState('');
  const [supportNeed, setSupportNeed] = useState('all');
  const [audience, setAudience] = useState('all');
  const [category, setCategory] = useState('all');

  const supportNeeds = useMemo(() => {
    const values = new Set<string>();
    conditions.forEach(condition => condition.supportNeeds.forEach(tag => values.add(tag)));
    return Array.from(values).sort();
  }, [conditions]);

  const audiences = useMemo(() => {
    const values = new Set<string>();
    conditions.forEach(condition => condition.audience.forEach(tag => values.add(tag)));
    return Array.from(values).sort();
  }, [conditions]);

  const categories = useMemo(() => {
    const values = new Set<string>();
    conditions.forEach(condition => values.add(condition.category));
    return Array.from(values).sort();
  }, [conditions]);

  const filtered = useMemo(() => {
    const needle = normaliseText(query);
    return conditions.filter(condition => {
      if (supportNeed !== 'all' && !condition.supportNeeds.includes(supportNeed)) return false;
      if (audience !== 'all' && !condition.audience.includes(audience)) return false;
      if (category !== 'all' && condition.category !== category) return false;
      if (!needle) return true;

      const haystack = [
        condition.canonicalName,
        condition.summary,
        ...condition.aliases,
        ...condition.supportNeeds.map(tag => supportNeedLabels[tag] || tag),
        ...condition.audience.map(tag => audienceLabels[tag] || tag),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [conditions, supportNeed, audience, category, query, supportNeedLabels, audienceLabels]);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Find support quickly</h2>
            <p className="text-sm text-slate-600">Filter by needs, audience, or category.</p>
          </div>
          <div className="text-sm text-slate-500">Showing {filtered.length} of {conditions.length}</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Search
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search conditions"
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Support need
            <select
              value={supportNeed}
              onChange={event => setSupportNeed(event.target.value)}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {supportNeeds.map(tag => (
                <option key={tag} value={tag}>
                  {supportNeedLabels[tag] || tag}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Audience
            <select
              value={audience}
              onChange={event => setAudience(event.target.value)}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {audiences.map(tag => (
                <option key={tag} value={tag}>
                  {audienceLabels[tag] || tag}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Category
            <select
              value={category}
              onChange={event => setCategory(event.target.value)}
              className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {categories.map(tag => (
                <option key={tag} value={tag}>
                  {titleCase(tag.replace(/-/g, ' '))}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSupportNeed('all');
              setAudience('all');
              setCategory('all');
            }}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Reset filters
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No matches yet. Try clearing a filter or searching by a different term.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(condition => (
            <article key={condition.conditionId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">{condition.canonicalName}</h2>
                <p className="text-sm text-slate-600">{condition.summary}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {condition.supportNeeds.map(tag => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {supportNeedLabels[tag] || tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                {condition.audience.map(tag => audienceLabels[tag] || tag).join(' · ')}
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">Start here</div>
                <div className="flex flex-col gap-2">
                  {condition.pillarPath ? (
                    <Link href={condition.pillarPath} className="text-sm font-semibold text-indigo-600 hover:underline">
                      Condition hub
                    </Link>
                  ) : null}
                  {condition.starterGuides.slice(0, 3).map(guide => (
                    <Link key={guide} href={getGuideLink(guide, regionKey)} className="text-sm text-slate-700 hover:text-slate-900">
                      {formatSlugLabel(guide, 'Guide')}
                    </Link>
                  ))}
                  {condition.tools.slice(0, 3).map(tool => (
                    <Link key={tool} href={tool} className="text-sm text-slate-700 hover:text-slate-900">
                      {formatSlugLabel(tool, 'Tool')}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-3 text-xs">
                <Link href={`/${regionKey}/trust/evidence-policy`} className="text-indigo-600 hover:underline">Evidence policy</Link>
                <Link href={`/${regionKey}/trust/safeguarding`} className="text-indigo-600 hover:underline">Safeguarding</Link>
                <Link href={`/${regionKey}/trust/disclaimer`} className="text-indigo-600 hover:underline">Disclaimer</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
