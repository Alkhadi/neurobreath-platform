import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { JOURNEYS } from '@/lib/journeys/journeys';
import { TrustPanel } from '@/components/trust/TrustPanel';
import { TrackedLink } from '@/components/analytics/TrackedLink';

interface JourneysHubProps {
  region: Region;
}

export function JourneysHub({ region }: JourneysHubProps) {
  const regionKey = getRegionKey(region);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-slate-500">Starter journeys</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Choose a starter journey</h1>
        <p className="text-base text-slate-600 max-w-3xl">
          Journeys combine guides and tools into short, practical steps. Educational guidance only — not medical advice.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${regionKey}/printables`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Printables
          </Link>
          <Link
            href={`/${regionKey}/trust/evidence-policy`}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
          >
            Evidence policy
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {JOURNEYS.map(journey => (
          <TrackedLink
            key={journey.id}
            href={journey.hrefs[region]}
            event="journey_start_click"
            payload={{ href: journey.hrefs[region], label: journey.title, source: `/${regionKey}/journeys` }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300"
          >
            <h2 className="text-lg font-semibold text-slate-900">{journey.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{journey.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {journey.supportNeeds.map(tag => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </TrackedLink>
        ))}
      </section>

      <TrustPanel region={region} title="Trust panel" />
    </div>
  );
}
