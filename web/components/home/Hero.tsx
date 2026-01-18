import Image from 'next/image';
import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import type { LocaleCopy } from '@/lib/i18n/localeCopy';
import type { QuickSelectorRecommendation } from '@/components/home/QuickSelector';
import { QuickSelector } from '@/components/home/QuickSelector';

interface HomeHeroProps {
  region: Region;
  copy: LocaleCopy;
  recommendations: QuickSelectorRecommendation[];
}

function BadgeDot() {
  return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />;
}

export function HomeHero({ region, copy, recommendations }: HomeHeroProps) {
  const regionKey = getRegionKey(region);

  return (
    <section aria-label="NeuroBreath homepage hero" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero/neurobreath-hero.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Adaptive overlay for text legibility (light + dark) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/75 to-white/90 dark:from-slate-950/75 dark:via-slate-950/70 dark:to-slate-950/90" />

        {/* Subtle brand tint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.12),transparent_55%)]" />

        {/* Subtle texture (CSS-only) to reduce banding */}
        <div className="absolute inset-0 opacity-[0.22] [background-image:repeating-linear-gradient(0deg,rgba(15,23,42,0.06)_0,rgba(15,23,42,0.06)_1px,transparent_1px,transparent_2px)] dark:opacity-[0.18] dark:[background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_2px)]" />
      </div>

      <div className="relative">
        <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1200px] py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                  <BadgeDot />
                  {copy.trustStrip.disclaimer}
                </span>
                <Link
                  href={`/${regionKey}/trust`}
                  className="text-xs font-semibold text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
                >
                  {copy.trustStrip.trustCentreLabel}
                </Link>
              </div>

              <h1 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {copy.valueProp}
              </h1>
              <p className="mt-4 text-base text-slate-700 dark:text-slate-200 max-w-2xl">
                {copy.heroSubtitle}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={`/${regionKey}/help-me-choose`}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                >
                  Help me choose
                </Link>
                <Link
                  href={`/${regionKey}/journeys`}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-50 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
                >
                  Starter journeys
                </Link>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={`/${regionKey}/conditions`}
                  className="rounded-xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/25 dark:text-slate-50 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
                >
                  Browse conditions
                </Link>
                <Link
                  href="/techniques/sos"
                  className="rounded-xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/25 dark:text-slate-50 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
                >
                  Try a quick calm tool
                </Link>
                <Link
                  href={`/${regionKey}/trust`}
                  className="rounded-xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/25 dark:text-slate-50 dark:hover:border-slate-700 dark:focus-visible:ring-offset-slate-950"
                >
                  {copy.trustStrip.trustCentreLabel}
                </Link>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/55">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-semibold">{copy.trustStrip.disclaimer}</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">We focus on practical, educational support — not diagnosis or treatment.</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                      href={`/${regionKey}/trust`}
                      className="text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
                    >
                      {copy.trustStrip.trustCentreLabel}
                    </Link>
                    <Link
                      href={`/${regionKey}/trust/last-reviewed`}
                      className="text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm dark:text-indigo-300 dark:focus-visible:ring-offset-slate-950"
                    >
                      {copy.trustStrip.lastReviewedLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <QuickSelector regionKey={regionKey} copy={copy} recommendations={recommendations} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
