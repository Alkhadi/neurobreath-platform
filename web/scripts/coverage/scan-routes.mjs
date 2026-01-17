import path from 'path';
import { fileURLToPath } from 'url';
import { writeFile, mkdir } from 'fs/promises';
import { buildRouteRegistry } from '../content/route-registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const reportDir = path.join(rootDir, 'reports', 'coverage');

const registry = buildRouteRegistry();

await mkdir(reportDir, { recursive: true });

await writeFile(path.join(reportDir, 'routes-scan.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  totalRoutes: registry.length,
  routes: registry,
}, null, 2));

console.log(`Route scan complete: ${registry.length} routes.`);
