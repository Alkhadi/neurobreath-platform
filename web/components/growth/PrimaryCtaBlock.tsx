import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';
import { TrackedLink } from '@/components/analytics/TrackedLink';

interface PrimaryCtaBlockProps {
  region: Region;
  title: string;
  description: string;
  primary: { label: string; href: string; event?: 'home_primary_cta_click' | 'journey_start_click' };
  secondary?: { label: string; href: string; event?: 'home_secondary_cta_click' };
}

export function PrimaryCtaBlock({ region, title, description, primary, secondary }: PrimaryCtaBlockProps) {
  const regionKey = getRegionKey(region);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600 max-w-2xl">{description}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <TrackedLink
          href={primary.href}
          event={primary.event || 'home_primary_cta_click'}
          payload={{ href: primary.href, source: `/${regionKey}` }}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {primary.label}
        </TrackedLink>

        {secondary ? (
          <TrackedLink
            href={secondary.href}
            event={secondary.event || 'home_secondary_cta_click'}
            payload={{ href: secondary.href, source: `/${regionKey}` }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {secondary.label}
          </TrackedLink>
        ) : null}
      </div>
    </section>
  );
}
