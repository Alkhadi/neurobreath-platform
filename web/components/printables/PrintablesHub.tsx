'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { PRINTABLES, getPrintableSummary, getPrintableTitle } from '@/lib/printables/printables';

const formatLabel = (value: string) => value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

const FEATURED_COLLECTIONS = [
  {
    id: 'classroom-essentials',
    title: 'Classroom essentials',
    description: 'Foundational classroom supports for predictable routines.',
    printableIds: ['classroom-calm-corner-checklist', 'visual-schedule-template', 'break-card-template'],
  },
  {
    id: 'parent-starter-pack',
    title: 'Parent starter pack',
    description: 'Quick wins for morning, evening, and homework support.',
    printableIds: ['daily-routine-planner', 'sleep-routine-checklist', 'homework-support-checklist'],
  },
  {
    id: 'workplace-adjustments',
    title: 'Workplace reasonable adjustments',
    description: 'Professional templates for adjustments and meeting support.',
    printableIds: ['reasonable-adjustments-request', 'meeting-accommodations-checklist', 'workplace-focus-plan'],
  },
];

interface PrintablesHubProps {
  region: Region;
}

export function PrintablesHub({ region }: PrintablesHubProps) {
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState('all');
  const [type, setType] = useState('all');
  const [condition, setCondition] = useState('all');
  const [supportNeed, setSupportNeed] = useState('all');
  const regionKey = getRegionKey(region);

  const filters = useMemo(() => {
    const audiences = Array.from(new Set(PRINTABLES.map(item => item.audience))).sort();
    const types = Array.from(new Set(PRINTABLES.map(item => item.type))).sort();
    const conditions = Array.from(new Set(PRINTABLES.flatMap(item => item.conditionTags))).sort();
    const supportNeeds = Array.from(new Set(PRINTABLES.flatMap(item => item.supportNeedsTags))).sort();
    return { audiences, types, conditions, supportNeeds };
  }, []);

  const filtered = useMemo(() => {
    return PRINTABLES.filter(item => {
      const matchesQuery = [getPrintableTitle(item, region), getPrintableSummary(item, region)]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesAudience = audience === 'all' || item.audience === audience;
      const matchesType = type === 'all' || item.type === type;
      const matchesCondition = condition === 'all' || item.conditionTags.includes(condition as never);
      const matchesSupportNeed = supportNeed === 'all' || item.supportNeedsTags.includes(supportNeed as never);
      return matchesQuery && matchesAudience && matchesType && matchesCondition && matchesSupportNeed;
    });
  }, [audience, condition, query, region, supportNeed, type]);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-slate-500">Printables & Templates</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
          Print‑friendly resources for home, school, and work
        </h1>
        <p className="text-base text-slate-600 max-w-3xl">
          Practical, educator‑informed templates you can print or download. Educational information only — not medical advice or diagnosis.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${regionKey}/conditions`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Explore conditions
          </Link>
          <Link
            href={`/${regionKey}/journeys`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Starter journeys
          </Link>
          <Link
            href={`/${regionKey}/help-me-choose`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Help me choose
          </Link>
          <Link
            href={`/${regionKey}/trust`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Trust centre
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURED_COLLECTIONS.map(collection => (
          <div key={collection.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{collection.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{collection.description}</p>
            <div className="mt-4 space-y-2">
              {collection.printableIds.map(id => {
                const printable = PRINTABLES.find(item => item.id === id);
                if (!printable) return null;
                return (
                  <Link
                    key={id}
                    href={`/${regionKey}/printables/${id}`}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 hover:border-indigo-300"
                  >
                    {getPrintableTitle(printable, region)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Find the right printable</h2>
            <p className="text-sm text-slate-600">Search or filter by audience, type, or support need.</p>
          </div>
          <div className="text-sm text-slate-500">Showing {filtered.length} of {PRINTABLES.length}</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Search
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search printables"
              className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Audience
            <select
              value={audience}
              onChange={event => setAudience(event.target.value)}
              className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {filters.audiences.map(value => (
                <option key={value} value={value}>
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Type
            <select
              value={type}
              onChange={event => setType(event.target.value)}
              className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {filters.types.map(value => (
                <option key={value} value={value}>
                  {formatLabel(value)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Condition tags
            <select
              value={condition}
              onChange={event => setCondition(event.target.value)}
              className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {filters.conditions.map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 uppercase">
            Support needs
            <select
              value={supportNeed}
              onChange={event => setSupportNeed(event.target.value)}
              className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              {filters.supportNeeds.map(value => (
                <option key={value} value={value}>
                  {formatLabel(value)}
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
              setAudience('all');
              setType('all');
              setCondition('all');
              setSupportNeed('all');
            }}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Reset filters
          </button>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No matches yet. Try clearing a filter or searching by a different term.
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filtered.map(item => (
            <Link
              key={item.id}
              href={`/${regionKey}/printables/${item.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">{getPrintableTitle(item, region)}</h3>
              <p className="mt-2 text-sm text-slate-600">{getPrintableSummary(item, region)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {formatLabel(item.audience)}
                </span>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">
                  {formatLabel(item.type)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                  {item.estimatedTimeToUse}
                </span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
        <h2 className="text-lg font-semibold text-slate-900">Educational use only</h2>
        <p className="mt-2">
          These printables are designed for educational support, not medical advice, diagnosis, or treatment. If you are
          worried about immediate safety, follow your local safeguarding guidance.
        </p>
      </section>
    </div>
  );
}
