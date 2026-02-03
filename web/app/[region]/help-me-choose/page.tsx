import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HelpMeChooseWizard } from '@/components/help/HelpMeChooseWizard';
import { TrustPanel } from '@/components/trust/TrustPanel';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

interface HelpMeChoosePageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: HelpMeChoosePageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/help-me-choose`;
  const alternates = getRegionAlternates('/help-me-choose');

  const baseMetadata = generatePageMetadata({
    title: 'Help me choose a support plan',
    description:
      'Answer a few short questions to get a personalised starter plan, tools to try now, and trusted guidance. Educational only.',
    path,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: generateCanonicalUrl(path),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function HelpMeChoosePage({ params }: HelpMeChoosePageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-500">Help me choose</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Find a starter plan in a few minutes</h1>
          <p className="text-base text-slate-600 max-w-3xl">
            Answer a few short questions and we will recommend a starter journey, tools to try now, and guides to explore.
            Educational guidance only — not medical advice or diagnosis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${regionKey}/trust/evidence-policy`}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
            >
              Evidence policy
            </Link>
            <Link
              href={`/${regionKey}/trust/disclaimer`}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
            >
              Disclaimer
            </Link>
          </div>
        </header>

        <HelpMeChooseWizard region={region} />

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Explore while you decide</h2>
          <p className="text-sm text-slate-600">These starter links are available now — everything stays on‑site.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link
              href={`/${regionKey}/guides/breathing-exercises-for-stress`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-indigo-300"
            >
              Calm starter journey
            </Link>
            <Link
              href="/tools/roulette"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-indigo-300"
            >
              Quick calm tool
            </Link>
            <Link
              href="/guides/quick-calm-in-5-minutes"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-indigo-300"
            >
              Quick calm guide
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">Privacy first</h2>
          <p className="mt-2">
            We do not collect personal data in this wizard. Your answers and plan are stored only on your device.
          </p>
        </section>

        <TrustPanel region={region} title="Trust panel" />
      </div>
    </div>
  );
}
