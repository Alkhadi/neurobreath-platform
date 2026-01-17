import Link from 'next/link';
import { LastReviewed } from '@/components/evidence/LastReviewed';
import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';

interface TrustPageShellProps {
  title: string;
  summary: string;
  lastReviewed: string;
  reviewIntervalDays?: number;
  region?: Region;
  children: React.ReactNode;
}

export function TrustPageShell({
  title,
  summary,
  lastReviewed,
  reviewIntervalDays = 180,
  region,
  children,
}: TrustPageShellProps) {
  const hubHref = region ? `/${getRegionKey(region)}/trust` : '/trust';
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-12 space-y-8">
        <div className="text-sm text-slate-500">
          <Link href={hubHref} className="hover:text-slate-700">Trust Centre</Link> / {title}
        </div>
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{summary}</p>
        </header>
        <LastReviewed reviewedAt={lastReviewed} reviewIntervalDays={reviewIntervalDays} />
        <section className="space-y-6">{children}</section>
      </div>
    </main>
  );
}
