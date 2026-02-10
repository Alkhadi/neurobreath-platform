import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '../..');

const scripts = [
  'scripts/search-console/robots-sitemap-check.mjs',
  'scripts/search-console/structured-data-check.mjs',
  'scripts/search-console/indexing-policy-check.mjs',
  'scripts/search-console/perf-cwv-check.mjs',
];

for (const script of scripts) {
  // Log each step so CI surfaces which sub-check failed.
  // Use an explicit cwd so this runner works even if invoked outside `web/`.
  // eslint-disable-next-line no-console
  console.log(`[search-console-ready] ${script}`);
  const result = spawnSync('node', [script], { stdio: 'inherit', env: process.env, cwd: webRoot });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
