'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const COOKIE_NAME = 'nb_region';

const setRegionCookie = (region: 'uk' | 'us') => {
  document.cookie = `${COOKIE_NAME}=${region}; path=/; max-age=31536000; SameSite=Lax`;
};

export function RegionSwitcher() {
  const pathname = usePathname() || '/';
  const currentRegion = pathname.startsWith('/us') ? 'us' : 'uk';
  const basePath = pathname.replace(/^\/(uk|us)/, '') || '/';

  const ukPath = `/uk${basePath === '/' ? '' : basePath}`;
  const usPath = `/us${basePath === '/' ? '' : basePath}`;

  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <span className="font-semibold text-slate-700">Region</span>
      <Link
        href={ukPath}
        onClick={() => setRegionCookie('uk')}
        className={`rounded-full px-2 py-1 ${currentRegion === 'uk' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        aria-label="Switch to United Kingdom content"
      >
        UK
      </Link>
      <Link
        href={usPath}
        onClick={() => setRegionCookie('us')}
        className={`rounded-full px-2 py-1 ${currentRegion === 'us' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        aria-label="Switch to United States content"
      >
        US
      </Link>
    </div>
  );
}
