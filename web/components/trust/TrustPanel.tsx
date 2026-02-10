import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';

interface TrustPanelProps {
  region: Region;
  title?: string;
}

export function TrustPanel({ region, title = 'Trust & evidence' }: TrustPanelProps) {
  const regionKey = getRegionKey(region);

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2">
        NeuroBreath provides educational support only — not medical advice or diagnosis. Learn how we keep content safe and evidence‑informed.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          href={`/${regionKey}/trust/evidence-policy`}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          Evidence policy
        </Link>
        <Link
          href={`/${regionKey}/trust/citations`}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
        >
          Citations
        </Link>
      </div>
    </section>
  );
}
