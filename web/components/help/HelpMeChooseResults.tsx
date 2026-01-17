'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { HelpMeChooseInput } from '@/lib/recommendations/help-me-choose';
import { getHelpMeChooseRecommendations } from '@/lib/recommendations/help-me-choose';
import { getJourneyById } from '@/lib/journeys/journeys';
import { GLOSSARY_TERM_MAP } from '@/lib/glossary/glossary';

interface HelpMeChooseResultsProps {
  region: 'UK' | 'US';
}

const answersKey = (region: 'UK' | 'US') => `helpMeChooseAnswers:${region}`;
const planKey = (region: 'UK' | 'US') => `helpMeChoosePlan:${region}`;

const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // ignore
  }
};

export function HelpMeChooseResults({ region }: HelpMeChooseResultsProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<HelpMeChooseInput | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(answersKey(region));
    if (stored) {
      setAnswers(JSON.parse(stored));
    }
  }, [region]);

  const recommendations = useMemo(() => {
    if (!answers) return null;
    return getHelpMeChooseRecommendations(answers, region);
  }, [answers, region]);

  useEffect(() => {
    if (recommendations) {
      window.localStorage.setItem(planKey(region), JSON.stringify(recommendations));
    }
  }, [recommendations, region]);

  if (!answers) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">No saved answers yet</h2>
        <p className="mt-2 text-sm text-slate-600">Start the wizard to build a personalised plan.</p>
        <Link
          href={`/${region === 'US' ? 'us' : 'uk'}/help-me-choose`}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Start the wizard
        </Link>
      </div>
    );
  }

  if (!recommendations) return null;

  const journeyMeta = getJourneyById(recommendations.recommendedJourneyId);
  const keyTerms = journeyMeta?.keyTerms
    .map(termId => GLOSSARY_TERM_MAP.get(termId))
    .filter(Boolean)
    .map(term => ({
      id: term!.id,
      label: region === 'US' ? term!.localeVariants.us.spelling : term!.localeVariants.uk.spelling,
      href: `/${region === 'US' ? 'us' : 'uk'}/glossary/${term!.id}`,
    })) || [];

  const summaryText = [
    `Recommended journey: ${recommendations.journey.title}`,
    `Tools to try now: ${recommendations.tools.map(tool => tool.title).join(', ')}`,
    `Guides to learn more: ${recommendations.guides.map(guide => guide.title).join(', ')}`,
    'Educational guidance only. No personal data stored.',
  ].join('\n');

  const clearAnswers = () => {
    window.localStorage.removeItem(answersKey(region));
    setAnswers(null);
  };

  const deletePlan = () => {
    window.localStorage.removeItem(planKey(region));
  };

  const restart = () => {
    clearAnswers();
    deletePlan();
    router.push(`/${region === 'US' ? 'us' : 'uk'}/help-me-choose`);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Your recommended next step</h2>
        <p className="text-sm text-slate-600">Based on your answers, here is a short plan to start today.</p>
        <Link
          href={recommendations.journey.href}
          className="mt-4 block rounded-2xl border border-indigo-200 bg-indigo-50 p-4 hover:border-indigo-300"
        >
          <p className="text-xs uppercase tracking-wide text-indigo-600">Starter journey</p>
          <p className="text-lg font-semibold text-slate-900">{recommendations.journey.title}</p>
          <p className="text-sm text-slate-600">{recommendations.journey.reason}</p>
        </Link>
        {keyTerms.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Key terms</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {keyTerms.map(term => (
                <Link
                  key={term.id}
                  href={term.href}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-300"
                >
                  {term.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Try now</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {recommendations.tools.map(tool => (
            <Link key={tool.id} href={tool.href} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300">
              <p className="text-base font-semibold text-slate-900">{tool.title}</p>
              <p className="text-sm text-slate-600">{tool.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Learn more</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {recommendations.guides.map(guide => (
            <Link key={guide.id} href={guide.href} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300">
              <p className="text-base font-semibold text-slate-900">{guide.title}</p>
              <p className="text-sm text-slate-600">{guide.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Trust & safety</h3>
        <p className="text-xs text-slate-500">Educational guidance only. Not medical advice.</p>
        <div className="mt-3 flex flex-col gap-2">
          {recommendations.trustLinks.map(link => (
            <Link key={link.id} href={link.href} className="text-sm font-semibold text-indigo-600 hover:underline">
              {link.title}
            </Link>
          ))}
        </div>
      </section>

      <details className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-amber-900">When to seek help</summary>
        <div className="mt-3 text-sm text-amber-900">
          {region === 'US' ? (
            <p>
              If you feel unsafe or in immediate danger, call <strong>911</strong> or local emergency services. For urgent mental health support, contact a local crisis line.
            </p>
          ) : (
            <p>
              If you feel unsafe or in immediate danger, call <strong>999</strong> or <strong>112</strong>. For urgent help, contact <strong>NHS 111</strong> or local services.
            </p>
          )}
        </div>
      </details>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Save and share</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => copyText(summaryText)}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Copy plan summary
          </button>
          <button
            type="button"
            onClick={deletePlan}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Delete saved plan
          </button>
          <button
            type="button"
            onClick={clearAnswers}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Clear my answers
          </button>
          <button
            type="button"
            onClick={restart}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Restart
          </button>
        </div>
      </section>
    </div>
  );
}
