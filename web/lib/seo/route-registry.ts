import fs from 'fs/promises';
import path from 'path';
import { getFixtures, hasFixtures } from './route-fixtures';

export interface RouteInventoryEntry {
  url: string;
  pattern: string;
  isDynamic: boolean;
  filePath?: string;
}

const APP_DIR = path.resolve(process.cwd(), 'app');
const ROUTE_JSON_PATH = path.resolve(process.cwd(), '.seo/routes.json');

const isRouteGroup = (segment: string) => segment.startsWith('(') && segment.endsWith(')');
const isIgnoredSegment = (segment: string) => segment.startsWith('_');

function normalizePattern(pattern: string): string {
  return pattern
    .replace(/\[\.\.\.(.+?)\]/g, ':$1*')
    .replace(/\[(.+?)\]/g, ':$1');
}

async function scanAppDirectory(baseDir: string): Promise<RouteInventoryEntry[]> {
  const entries: RouteInventoryEntry[] = [];

  async function walk(dir: string, segments: string[]) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (isIgnoredSegment(item.name)) continue;
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (item.name === 'api') continue;
        const nextSegments = [...segments];
        if (!isRouteGroup(item.name)) {
          nextSegments.push(item.name);
        }
        await walk(fullPath, nextSegments);
      }

      if (item.isFile() && item.name === 'page.tsx') {
        const routePath = segments.length ? `/${segments.join('/')}` : '/';
        const pattern = normalizePattern(routePath);
        const isDynamic = pattern.includes(':');
        entries.push({
          url: routePath,
          pattern,
          isDynamic,
          filePath: fullPath,
        });
      }
    }
  }

  await walk(baseDir, []);
  return entries;
}

export async function loadRouteInventory(): Promise<{ routes: RouteInventoryEntry[]; missingFixtures: string[] }> {
  let routes: RouteInventoryEntry[] = [];

  try {
    const jsonData = await fs.readFile(ROUTE_JSON_PATH, 'utf-8');
    const parsed = JSON.parse(jsonData) as { routes: Array<{ url: string; pattern: string; isDynamic: boolean; path?: string }> };
    routes = parsed.routes.map(route => ({
      url: route.url,
      pattern: normalizePattern(route.pattern),
      isDynamic: route.isDynamic,
      filePath: route.path ? path.resolve(APP_DIR, route.path) : undefined,
    }));
  } catch {
    routes = [];
  }

  if (routes.length === 0) {
    routes = await scanAppDirectory(APP_DIR);
  } else {
    const scanned = await scanAppDirectory(APP_DIR);
    const known = new Set(routes.map(route => route.pattern));
    scanned.forEach(route => {
      if (!known.has(route.pattern)) {
        routes.push(route);
        known.add(route.pattern);
      }
    });
  }

  const missingFixtures = routes
    .filter(route => route.isDynamic)
    .map(route => route.pattern)
    .filter(pattern => {
      if (hasFixtures(pattern)) return false;
      if (pattern.includes(':region') && hasFixtures('/:region')) return false;
      return true;
    });

  return { routes, missingFixtures };
}

export function expandRoutePattern(pattern: string): string[] {
  if (!pattern.includes(':')) return [pattern];
  const direct = getFixtures(pattern).filter(pathname => !pathname.includes(':'));
  if (direct.length) return direct;

  if (pattern.includes(':region')) {
    const regions = getFixtures('/:region');
    if (regions.length) {
      return regions
        .map(regionPath => {
          const regionKey = regionPath.replace(/^\//, '');
          return pattern.replace(':region', regionKey);
        })
        .filter(pathname => !pathname.includes(':'));
    }
  }

  return [];
}
