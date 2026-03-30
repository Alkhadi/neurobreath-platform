import { Metadata } from 'next';
import { FileText, CheckCircle, Calendar, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editorial Standards | Trust Centre | NeuroBreath',
  description: 'The standards, process, and people behind NeuroBreath content. How we write, review, and update every page.',
};

const standards = [
  {
    title: 'Evidence-first',
    description: 'Every factual claim is supported by a citation from a Tier A (clinical guideline, systematic review, Cochrane) or Tier B (peer-reviewed journal, established charity) source. We do not publish assertions without evidence.',
  },
  {
    title: 'UK-specific by default',
    description: 'All primary guidance references UK sources — NHS, NICE, BDA, NAS, IDA UK, and HCPC-registered professionals. Where US or international sources are used, they are clearly labelled.',
  },
  {
    title: 'Professional review',
    description: 'Clinical and educational content is reviewed by qualified professionals before publication. Review credentials are displayed on relevant pages. See our Review Registry for details.',
  },
  {
    title: 'Educational framing only',
    description: 'No content on NeuroBreath is presented as medical advice or a substitute for professional assessment. Every page carries an Educational Disclaimer and appropriate signposting to professional services.',
  },
  {
    title: 'Scheduled review intervals',
    description: 'All hub pages are scheduled for review within 90–180 days of publication (depending on content category). Overdue pages are flagged internally until reviewed.',
  },
  {
    title: 'Transparent corrections',
    description: 'Material corrections are noted in the page changelog with the correction date. We do not silently edit factual errors — they are disclosed.',
  },
];

const reviewProcess = [
  { step: 1, label: 'Research & drafting', detail: 'Author reviews primary sources (NICE, NHS, Cochrane, BDA) and drafts content anchored to citations.' },
  { step: 2, label: 'Editorial review', detail: 'A second reviewer checks accuracy, tone, accessibility, and safety language. Plain English standard applied throughout.' },
  { step: 3, label: 'Professional sign-off', detail: 'For clinical and educational content, a qualified professional (listed on page) reviews and approves before publication.' },
  { step: 4, label: 'Publication with metadata', detail: 'Pages are published with last-reviewed date, reviewer role, next review date, and evidence tier displayed.' },
  { step: 5, label: 'Scheduled re-review', detail: 'Content enters the review calendar. Trigger events (new NICE guidance, significant research) can bring forward review.' },
];

export default function EditorialStandardsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Editorial Standards</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Last reviewed: 19 January 2026</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        NeuroBreath is a YMYL (Your Money or Your Life) platform — our content has real consequences for real people.
        These standards define how we write, review, and maintain every page to meet the highest expectations for
        health information quality.
      </p>

      {/* Our 6 standards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Our Six Editorial Standards
        </h2>
        <ul className="space-y-4">
          {standards.map((s, i) => (
            <li key={i} className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Review process */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Publication &amp; Review Process
        </h2>
        <ol className="space-y-3">
          {reviewProcess.map((r) => (
            <li key={r.step} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {r.step}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.label}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Review cadence */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Review Cadence by Content Type</h2>
        <div className="space-y-2">
          {[
            { type: 'Clinical condition hubs (ADHD, Autism, Anxiety)', cadence: 'Every 90 days', tier: 'Tier A required' },
            { type: 'Dyslexia educational content', cadence: 'Every 120 days', tier: 'Tier A required' },
            { type: 'Breathing & wellbeing tools', cadence: 'Every 180 days', tier: 'Tier A required' },
            { type: 'Trust & governance pages', cadence: 'Every 90 days', tier: 'Internal review' },
            { type: 'Journey and guided pathways', cadence: 'Every 180 days', tier: 'Tier A or B' },
          ].map((row) => (
            <div key={row.type} className="flex flex-wrap items-start justify-between gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
              <span className="text-slate-900 dark:text-slate-100 font-medium">{row.type}</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">{row.cadence}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">{row.tier}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who reviews */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Who Reviews Our Content
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Clinical and educational reviewers are identified by professional registration or credential. Current
          reviewer roles include:
        </p>
        <ul className="space-y-2">
          {[
            'SENCo (QTS, National Award for SEN Coordination) — dyslexia, ADHD, autism education content',
            'Educational Psychologist (BPS Chartered, HCPC Registered) — assessment tools and learning difference hubs',
            'Clinical Psychologist (HCPC Registered) — anxiety, sleep, and mental health content',
            'Occupational Therapist (HCPC Registered) — breathing, movement, and self-regulation tools',
            'NeuroBreath Editorial Team — governance, policy, and trust centre pages',
          ].map((role) => (
            <li key={role} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              {role}
            </li>
          ))}
        </ul>
      </section>

      {/* Source tiers */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Evidence Source Tiers</h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">Tier A — Highest Evidence</p>
            <p className="text-sm text-green-800 dark:text-green-200">NICE guidelines, NHS clinical guidance, Cochrane systematic reviews, WHO guidance, Royal College guidelines.</p>
          </div>
          <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Tier B — Strong Supporting Evidence</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">Peer-reviewed journal articles, established UK/US charities (BDA, NAS, IDA, Samaritans), government research bodies.</p>
          </div>
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Tier C — Informational Only</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Professional experience, community knowledge, non-peer-reviewed sources. Clearly labelled. Not used for clinical claims.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <p>See also:
          {' '}<Link href="/trust/evidence-policy" className="text-blue-600 dark:text-blue-400 underline">Evidence Policy</Link>
          {' '}·{' '}<Link href="/trust/editorial-policy" className="text-blue-600 dark:text-blue-400 underline">Editorial Policy</Link>
          {' '}·{' '}<Link href="/trust/contact" className="text-blue-600 dark:text-blue-400 underline">Report a concern</Link>
        </p>
      </div>
    </div>
  );
}
