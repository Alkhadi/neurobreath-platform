import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CONDITIONS } from '@/lib/coverage/conditions';
import { getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import ConditionsHub from '@/components/conditions/conditions-hub';
import type { Metadata } from 'next';

interface RegionConditionsProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionConditionsProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const canonical = generateCanonicalUrl(`/${regionKey}/conditions`);

  return {
    title: region === 'US' ? 'Conditions we cover' : 'Conditions we cover',
    description: 'Educational support across neurodivergent conditions and related support areas, with practical tools and guides.',
    alternates: {
      canonical,
      languages: {
        'en-GB': generateCanonicalUrl('/uk/conditions'),
        'en-US': generateCanonicalUrl('/us/conditions'),
      },
    },
  };
}

const supportNeedLabels: Record<string, string> = {
  focus: 'Focus',
  'executive-function': 'Executive function',
  routines: 'Routines',
  'emotional-regulation': 'Emotional regulation',
  sensory: 'Sensory',
  communication: 'Communication',
  sleep: 'Sleep',
  reading: 'Reading',
  writing: 'Writing',
  math: 'Maths',
  stress: 'Stress',
  anxiety: 'Anxiety',
  visual: 'Visual processing',
  motor: 'Motor skills',
  confidence: 'Confidence',
};

const audienceLabels: Record<string, string> = {
  child: 'Children',
  teen: 'Teens',
  adult: 'Adults',
  'parent-carer': 'Parents & carers',
  teacher: 'Teachers',
  workplace: 'Workplace',
};

export default async function RegionConditionsPage({ params }: RegionConditionsProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const audienceFlows = [
    {
      id: 'parent-carer',
      label: 'Parents & carers',
      description: 'Quick guides, calm routines, and practical tools for home support.',
      links: [
        { label: 'Start with guides', href: `/${regionKey}/guides` },
        { label: 'Safeguarding', href: `/${regionKey}/trust/safeguarding` },
      ],
    },
    {
      id: 'teacher',
      label: 'Teachers',
      description: 'Classroom-friendly strategies, accommodations, and quick resets.',
      links: [
        { label: 'Teaching guides', href: `/${regionKey}/guides` },
        { label: 'Evidence policy', href: `/${regionKey}/trust/evidence-policy` },
      ],
    },
    {
      id: 'teen',
      label: 'Teens',
      description: 'Focus boosts, stress resets, and sleep routines you can use today.',
      links: [
        { label: 'Teen-friendly guides', href: `/${regionKey}/guides` },
        { label: 'Browse tools', href: '/tools' },
      ],
    },
    {
      id: 'adult',
      label: 'Adults',
      description: 'Work-ready support for attention, routines, and wellbeing.',
      links: [
        { label: 'Adult guides', href: `/${regionKey}/guides` },
        { label: 'Workplace support', href: '/workplace' },
      ],
    },
    {
      id: 'child',
      label: 'Children',
      description: 'Gentle routines, calm activities, and parent-led practices.',
      links: [
        { label: 'Start with guides', href: `/${regionKey}/guides` },
        { label: 'Tools for kids', href: '/tools' },
      ],
    },
    {
      id: 'workplace',
      label: 'Workplace',
      description: 'Work-friendly routines, planning aids, and stress management.',
      links: [
        { label: 'Workplace support', href: '/workplace' },
        { label: 'Trust centre', href: `/${regionKey}/trust` },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-500">Conditions we cover</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
            NeuroBreath coverage across neurodivergent needs
          </h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Educational support, practical tools, and evidence-informed guidance. We do not provide medical advice or diagnoses.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${regionKey}/guides`} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Explore guides
            </Link>
            <Link href="/tools" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300">
              Browse tools
            </Link>
            <Link href={`/${regionKey}/trust`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300">
              Trust centre
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Start here by audience</h2>
            <p className="text-sm text-slate-600">Pick the support context that fits you best.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {audienceFlows.map(flow => (
              <article key={flow.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{flow.label}</h3>
                <p className="mt-2 text-sm text-slate-600">{flow.description}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  {flow.links.map(link => (
                    <Link key={link.label} href={link.href} className="text-indigo-600 hover:underline">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <ConditionsHub
          conditions={CONDITIONS}
          regionKey={regionKey}
          supportNeedLabels={supportNeedLabels}
          audienceLabels={audienceLabels}
        />
      </div>
    </main>
  );
}
