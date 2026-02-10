import fs from 'node:fs/promises';
import path from 'node:path';

type RoutesMap = {
  generatedAt: string;
  routes: string[];
  staticRoutes: string[];
  dynamicRoutes: string[];
};

const APP_DIR = path.join(process.cwd(), 'app');
const OUTPUT = path.join(process.cwd(), 'generated', 'appRoutes.json');

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name === 'node_modules') continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip api routes
      if (dir === APP_DIR && entry.name === 'api') continue;
      out.push(...(await walk(full)));
      continue;
    }

    if (entry.isFile()) {
      if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        out.push(full);
      }
    }
  }

  return out;
}

function toRoute(filePath: string): { route: string; isDynamic: boolean } {
  const rel = path.relative(APP_DIR, filePath);
  const withoutPage = rel.replace(/\/(page\.(tsx|ts))$/i, '');
  const segments = withoutPage.split(path.sep).filter(Boolean);

  const cleaned: string[] = [];
  let isDynamic = false;

  for (const seg of segments) {
    // Route groups and parallel routes should not affect URL.
    if (seg.startsWith('(') && seg.endsWith(')')) continue;
    if (seg.startsWith('@')) continue;

    if (seg.includes('[') || seg.includes(']')) isDynamic = true;
    cleaned.push(seg);
  }

  const route = '/' + cleaned.join('/');
  return { route: route === '/' ? '/' : route.replace(/\/+$/g, ''), isDynamic };
}

export async function generateRoutesMap(): Promise<RoutesMap> {
  if (!(await pathExists(APP_DIR))) {
    throw new Error(`Cannot find app directory at ${APP_DIR}`);
  }

  const pageFiles = await walk(APP_DIR);
  const all = pageFiles.map(toRoute);

  const routes = Array.from(new Set(all.map((r) => r.route))).sort();
  const staticRoutes = Array.from(new Set(all.filter((r) => !r.isDynamic).map((r) => r.route))).sort();
  const dynamicRoutes = Array.from(new Set(all.filter((r) => r.isDynamic).map((r) => r.route))).sort();

  return {
    generatedAt: new Date().toISOString(),
    routes,
    staticRoutes,
    dynamicRoutes,
  };
}

async function main() {
  const data = await generateRoutesMap();
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify(data, null, 2) + '\n', 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Generated ${OUTPUT} with ${data.routes.length} routes (${data.staticRoutes.length} static, ${data.dynamicRoutes.length} dynamic)`);
}

if (require.main === module) {
  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
