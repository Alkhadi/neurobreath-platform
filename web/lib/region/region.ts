export type Region = 'UK' | 'US';
export type RegionKey = 'uk' | 'us';

const REGION_LOCALES: Record<Region, { language: string; locale: string }> = {
  UK: { language: 'en-GB', locale: 'en_GB' },
  US: { language: 'en-US', locale: 'en_US' },
};

export function getRegionFromPath(pathname: string): Region {
  if (pathname.startsWith('/us')) return 'US';
  return 'UK';
}

export function getRegionKey(region: Region): RegionKey {
  return region === 'US' ? 'us' : 'uk';
}

export function getRegionFromKey(region: string | undefined): Region {
  return region?.toLowerCase() === 'us' ? 'US' : 'UK';
}

export function getLocaleForRegion(region: Region): { language: string; locale: string } {
  return REGION_LOCALES[region];
}

export function withRegionPrefix(path: string, region: Region): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${getRegionKey(region)}${clean}`;
}

export function getRegionAlternates(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash to match canonical URL pattern (e.g., /uk not /uk/)
  const ukPath = clean === '/' ? '/uk' : `/uk${clean}`;
  const usPath = clean === '/' ? '/us' : `/us${clean}`;
  return {
    'en-GB': ukPath,
    'en-US': usPath,
  };
}
