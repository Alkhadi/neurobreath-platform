import { spawnSync } from 'child_process';

const scripts = [
  'scripts/search-console/robots-sitemap-check.mjs',
  'scripts/search-console/structured-data-check.mjs',
  'scripts/search-console/indexing-policy-check.mjs',
  'scripts/search-console/perf-cwv-check.mjs',
];

for (const script of scripts) {
  const result = spawnSync('node', [script], { stdio: 'inherit', env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
