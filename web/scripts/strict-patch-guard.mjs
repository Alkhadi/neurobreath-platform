#!/usr/bin/env node
/*
  STRICT PATCH MODE guard (repo-enforced)

  Goals:
  - Prevent committing/build artifacts
  - Prevent out-of-scope edits (default: web/ + .github/ + select root docs)
  - Prevent dependency drift (package.json / lockfile) unless explicitly allowed
  - Prevent Prisma schema/migration changes unless explicitly allowed

  Local usage:
    node web/scripts/strict-patch-guard.mjs --staged
    node web/scripts/strict-patch-guard.mjs --range origin/main...HEAD

  CI usage (PRs):
    BASE_SHA=<sha> HEAD_SHA=<sha> node web/scripts/strict-patch-guard.mjs --ci

  Overrides (explicit, intentional):
    ALLOW_OUT_OF_SCOPE=1
    ALLOW_DEP_CHANGES=1
    ALLOW_PRISMA_CHANGES=1
    ALLOW_MIXED_PATCH=1
*/

import { execFileSync } from 'node:child_process';
import process from 'node:process';

function runGit(args, opts = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  }).trim();
}

function getChangedFilesFromDiffArgs(diffArgs) {
  const output = runGit(['diff', '--name-only', ...diffArgs]);
  if (!output) return [];
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getDiffTextForFile(diffArgs, filePath) {
  // Minimal context keeps parsing predictable.
  return runGit(['diff', '--unified=0', ...diffArgs, '--', filePath], {
    maxBuffer: 1024 * 1024 * 10,
  });
}

function getCommitMessagesForRange(rangeSpec) {
  // Returns concatenated commit bodies in the range.
  // Works with both ".." and "..." range specs.
  return runGit(['log', '--format=%B', rangeSpec], {
    maxBuffer: 1024 * 1024 * 10,
  });
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  const getValue = (flag) => {
    const idx = argv.indexOf(flag);
    if (idx === -1) return null;
    const next = argv[idx + 1];
    return typeof next === 'string' && !next.startsWith('--') ? next : null;
  };

  return {
    staged: args.has('--staged'),
    ci: args.has('--ci'),
    range: getValue('--range'),
  };
}

function isAllowedPath(filePath) {
  // This repo often needs cross-cutting fixes (header/footer/CSS, content updates,
  // scripts, shared packages). Keep scope broad, but enforce safety via other guards
  // (artifacts, deps, prisma, etc.).
  if (filePath.startsWith('web/')) return true;
  if (filePath.startsWith('.github/')) return true;
  if (filePath.startsWith('.githooks/')) return true;
  if (filePath.startsWith('docs/')) return true;
  if (filePath.startsWith('packages/')) return true;
  if (filePath.startsWith('scripts/')) return true;
  if (filePath.startsWith('shared/')) return true;
  if (filePath.startsWith('serverless/')) return true;
  if (filePath.startsWith('flutter_app/')) return true;
  if (filePath.startsWith('deliverables/')) return true;
  if (filePath.startsWith('public/')) return true;
  if (filePath.startsWith('reports/')) return true;

  // Allow common root-level config/docs/scripts.
  if (/^[^/]+\.(md|ts|tsx|js|mjs|cjs|json|yml|yaml|sh)$/.test(filePath)) return true;

  return false;
}

function isForbiddenArtifact(filePath) {
  const normalized = filePath.replaceAll('\\', '/');

  if (normalized.includes('/.next/')) return true;
  if (normalized.startsWith('web/.next/')) return true;
  if (normalized.includes('/node_modules/')) return true;
  if (normalized.startsWith('web/node_modules/')) return true;
  if (normalized.startsWith('web/playwright-report/')) return true;
  if (normalized.startsWith('web/test-results/')) return true;
  if (normalized.startsWith('test-results/')) return true;
  if (normalized.endsWith('.tsbuildinfo')) return true;

  return false;
}

function isDependencyChange(filePath) {
  // Lockfile changes always count as dependency drift.
  return filePath === 'web/yarn.lock';
}

function isPackageJson(filePath) {
  return filePath === 'web/package.json' || filePath === 'package.json';
}

function packageJsonTouchesDependencySections(diffText) {
  // Heuristic: if the diff includes dependency section keys, treat as dep drift.
  // This allows safe edits like scripts/postinstall without needing an override.
  return /"(dependencies|devDependencies|peerDependencies|optionalDependencies)"\s*:/m.test(
    diffText,
  );
}

function hasOverrideToken(commitMessages, token) {
  return commitMessages.includes(token);
}

function classifyDomain(filePath) {
  if (filePath.startsWith('web/prisma/')) return 'prisma';
  if (filePath === 'web/yarn.lock') return 'deps';
  if (filePath === 'web/package.json' || filePath === 'package.json') return 'web-config';
  if (filePath.startsWith('.github/workflows/')) return 'ci';
  if (filePath.startsWith('web/app/api/')) return 'api';
  if (filePath.startsWith('web/scripts/')) return 'web-scripts';
  if (filePath.startsWith('web/tests/')) return 'tests';
  if (filePath.startsWith('web/')) return 'web-app';
  if (filePath.startsWith('.githooks/')) return 'hooks';
  if (filePath === 'AI_AGENT_RULES.md') return 'policy';
  if (filePath.startsWith('docs/')) return 'docs';
  if (filePath.startsWith('.github/')) return 'github';
  return 'other';
}

function isPrismaChange(filePath) {
  return (
    filePath === 'web/prisma/schema.prisma' ||
    filePath.startsWith('web/prisma/migrations/')
  );
}

function fail(message, details = []) {
  const lines = [
    '',
    'STRICT PATCH MODE: BLOCKED',
    message,
    ...details.map((d) => `- ${d}`),
    '',
    'Overrides (use only when explicitly intended):',
    '- ALLOW_OUT_OF_SCOPE=1',
    '- ALLOW_DEP_CHANGES=1',
    '- ALLOW_PRISMA_CHANGES=1',
    '- ALLOW_MIXED_PATCH=1',
    '',
    'CI-friendly override tokens (put in a commit message when approved):',
    '- #allow-out-of-scope',
    '- #allow-deps',
    '- #allow-prisma',
    '- #allow-mixed-patch',
    '',
  ];
  process.stderr.write(lines.join('\n'));
  process.exit(1);
}

function main() {
  const { staged, ci, range } = parseArgs(process.argv);

  const allowOutOfScopeEnv = process.env.ALLOW_OUT_OF_SCOPE === '1';
  const allowDepChangesEnv = process.env.ALLOW_DEP_CHANGES === '1';
  const allowPrismaChangesEnv = process.env.ALLOW_PRISMA_CHANGES === '1';
  const allowMixedPatchEnv = process.env.ALLOW_MIXED_PATCH === '1';

  let changedFiles = [];
  let diffArgs = [];
  let rangeSpecForCommits = null;

  if (staged) {
    diffArgs = ['--cached'];
    changedFiles = getChangedFilesFromDiffArgs(diffArgs);
  } else if (ci) {
    const baseSha = process.env.BASE_SHA;
    const headSha = process.env.HEAD_SHA || 'HEAD';

    if (!baseSha) {
      fail('Missing BASE_SHA for CI guard run.', [
        'Set BASE_SHA to the PR base commit SHA (e.g. github.event.pull_request.base.sha).',
      ]);
    }

    diffArgs = [`${baseSha}...${headSha}`];
    rangeSpecForCommits = `${baseSha}...${headSha}`;
    changedFiles = getChangedFilesFromDiffArgs(diffArgs);
  } else if (range) {
    diffArgs = [range];
    rangeSpecForCommits = range;
    changedFiles = getChangedFilesFromDiffArgs(diffArgs);
  } else {
    // Fallback: compare working tree changes against HEAD.
    diffArgs = ['HEAD'];
    changedFiles = getChangedFilesFromDiffArgs(diffArgs);
  }

  if (changedFiles.length === 0) return;

  const commitMessages =
    !staged && rangeSpecForCommits ? getCommitMessagesForRange(rangeSpecForCommits) : '';

  // Commit-message override tokens for CI friendliness (env vars aren't practical in PR CI).
  const allowOutOfScopeToken = hasOverrideToken(commitMessages, '#allow-out-of-scope');
  const allowDepChangesToken = hasOverrideToken(commitMessages, '#allow-deps');
  const allowPrismaChangesToken = hasOverrideToken(commitMessages, '#allow-prisma');
  const allowMixedPatchToken = hasOverrideToken(commitMessages, '#allow-mixed-patch');

  const allowOutOfScope = allowOutOfScopeEnv || allowOutOfScopeToken;
  const allowDepChanges = allowDepChangesEnv || allowDepChangesToken;
  const allowPrismaChanges = allowPrismaChangesEnv || allowPrismaChangesToken;
  const allowMixedPatch = allowMixedPatchEnv || allowMixedPatchToken;

  const forbiddenArtifacts = changedFiles.filter(isForbiddenArtifact);
  if (forbiddenArtifacts.length > 0) {
    fail('Build/test artifacts must never be committed.', forbiddenArtifacts);
  }

  if (!allowOutOfScope) {
    const outOfScope = changedFiles.filter((p) => !isAllowedPath(p));
    if (outOfScope.length > 0) {
      fail('Edits outside the allowed scope are blocked by default.', outOfScope);
    }
  }

  if (!allowDepChanges) {
    const lockfileChanges = changedFiles.filter(isDependencyChange);

    const packageJsonDepChanges = changedFiles
      .filter(isPackageJson)
      .filter((packageJsonPath) => {
        const diffText = getDiffTextForFile(diffArgs, packageJsonPath);
        return packageJsonTouchesDependencySections(diffText);
      });

    const allDepChanges = [...new Set([...lockfileChanges, ...packageJsonDepChanges])];
    if (allDepChanges.length > 0) {
      fail('Dependency/lockfile changes require explicit approval.', allDepChanges);
    }
  }

  if (!allowPrismaChanges) {
    const prismaChanges = changedFiles.filter(isPrismaChange);
    if (prismaChanges.length > 0) {
      fail('Prisma schema/migration changes require explicit approval.', prismaChanges);
    }
  }

  // Optional "one task = one patch" heuristic:
  // Block risky mixed patches (deps+code, prisma+code, ci+code) unless explicitly allowed.
  if (!allowMixedPatch) {
    const domains = new Set(changedFiles.map(classifyDomain));

    const hasPrisma = domains.has('prisma');
    const hasDeps = domains.has('deps');
    const hasCi = domains.has('ci');

    // "Risky" domains are the ones most likely to represent true multi-task patches.
    // CI + scripts/config is commonly a single infra change and should be allowed.
    const riskyDomains = new Set(['web-app', 'api', 'prisma', 'deps']);
    const hasRisky = [...domains].some((d) => riskyDomains.has(d));

    const mixedPrisma = hasPrisma && (domains.size > 1);
    const mixedDeps = hasDeps && (domains.size > 1);
    const mixedCi = hasCi && hasRisky;

    if (mixedPrisma || mixedDeps || mixedCi) {
      fail('Mixed-scope patch detected. Split into separate patches or add an explicit override.', [
        'If this mix is intentional, include #allow-mixed-patch in a commit message (and also #allow-deps/#allow-prisma if applicable).',
        `Domains: ${[...domains].sort().join(', ')}`,
      ]);
    }
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  fail('Guard script crashed unexpectedly.', stack ? [message, stack] : [message]);
}
