#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function findRepoRoot(startDir) {
  let current = startDir;
  for (let i = 0; i < 10; i += 1) {
    const gitDir = path.join(current, '.git');
    if (fs.existsSync(gitDir)) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function runGit(repoRoot, args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function chmodIfExists(filePath) {
  try {
    fs.chmodSync(filePath, 0o755);
  } catch {
    // ignore
  }
}

function main() {
  // Running inside web/ on postinstall
  const repoRoot = findRepoRoot(process.cwd());
  if (!repoRoot) return;

  const hooksDir = path.join(repoRoot, '.githooks');
  if (!fs.existsSync(hooksDir)) return;

  // Ensure hooks are executable.
  chmodIfExists(path.join(hooksDir, 'pre-commit'));
  chmodIfExists(path.join(hooksDir, 'pre-push'));

  // Auto-enable repo hooks.
  // This sets a repo-local git config (not global).
  try {
    runGit(repoRoot, ['config', 'core.hooksPath', '.githooks']);
  } catch {
    // If git is unavailable (e.g., some CI contexts), do nothing.
  }
}

try {
  main();
} catch {
  // Never fail install due to hooks.
}
