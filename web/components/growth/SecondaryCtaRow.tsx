import Link from 'next/link';
import { TrackClick } from '@/components/analytics/TrackClick';
import type { AnalyticsEventName } from '@/lib/analytics/events';

interface SecondaryCtaRowProps {
  actions: Array<{ label: string; href: string; event?: AnalyticsEventName }>;
}

export function SecondaryCtaRow({ actions }: SecondaryCtaRowProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {actions.map(action => (
        <TrackClick key={action.href + action.label} event={action.event || 'home_secondary_cta_click'} payload={{ href: action.href, label: action.label }}>
          <Link
            href={action.href}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {action.label}
          </Link>
        </TrackClick>
      ))}
    </div>
  );
}
