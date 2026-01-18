'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const COOKIE_NAME = 'nb_region';

const setRegionCookie = (region: 'uk' | 'us') => {
  document.cookie = `${COOKIE_NAME}=${region}; path=/; max-age=31536000; SameSite=Lax`;
};

const getRegionCookie = (): 'uk' | 'us' | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  const value = match.slice(`${COOKIE_NAME}=`.length);
  return value === 'us' || value === 'uk' ? value : null;
};

const REGION_SCOPED_PREFIXES = [
  '/about',
  '/breathing',
  '/conditions',
  '/editorial',
  '/glossary',
  '/guides',
  '/help-me-choose',
  '/journeys',
  '/printables',
  '/tools',
  '/trust',
] as const;

export function RegionSwitcher() {
  const pathname = usePathname() || '/';
  const basePath = useMemo(() => pathname.replace(/^\/(uk|us)/, '') || '/', [pathname]);

  const [currentRegion, setCurrentRegion] = useState<'uk' | 'us'>(
    pathname.startsWith('/us') ? 'us' : 'uk'
  );

  useEffect(() => {
    setCurrentRegion(getRegionCookie() ?? (pathname.startsWith('/us') ? 'us' : 'uk'));
  }, [pathname]);

  const isRegionScoped =
    basePath === '/' ||
    REGION_SCOPED_PREFIXES.some((prefix) => basePath === prefix || basePath.startsWith(`${prefix}/`));

  const ukPath = isRegionScoped ? `/uk${basePath === '/' ? '' : basePath}` : basePath;
  const usPath = isRegionScoped ? `/us${basePath === '/' ? '' : basePath}` : basePath;

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
