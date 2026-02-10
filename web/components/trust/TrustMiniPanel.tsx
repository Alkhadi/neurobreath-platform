import Link from 'next/link';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';

interface TrustMiniPanelProps {
  region: Region;
  compact?: boolean;
}

export function TrustMiniPanel({ region, compact }: TrustMiniPanelProps) {
  const regionKey = getRegionKey(region);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Trust & safety</h2>
      <p className="mt-2 text-sm text-slate-600">
        Educational information only. Not medical advice. Use the Trust Centre to understand our evidence policy, citations, privacy, and safeguarding.
      </p>

      <div className={compact ? 'mt-3 flex flex-wrap gap-3 text-sm' : 'mt-4 flex flex-wrap gap-3 text-sm'}>
        <Link href={`/${regionKey}/trust`} className="text-indigo-600 hover:underline">Trust Centre</Link>
        <Link href={`/${regionKey}/trust/evidence-policy`} className="text-indigo-600 hover:underline">Evidence policy</Link>
        <Link href={`/${regionKey}/trust/last-reviewed`} className="text-indigo-600 hover:underline">Last reviewed</Link>
        <Link href={`/${regionKey}/trust/disclaimer`} className="text-indigo-600 hover:underline">Disclaimer</Link>
        <Link href={`/${regionKey}/trust/privacy`} className="text-indigo-600 hover:underline">Privacy</Link>
      </div>
    </aside>
  );
}
