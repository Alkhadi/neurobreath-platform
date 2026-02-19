#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

function rm(target) {
  try {
    fs.rmSync(target, { recursive: true, force: true })
    return true
  } catch {
    return false
  }
}

function exists(p) {
  try {
    fs.accessSync(p)
    return true
  } catch {
    return false
  }
}

function usage() {
  // eslint-disable-next-line no-console
  console.log('Usage: node scripts/clean.mjs [--deep]')
  // eslint-disable-next-line no-console
  console.log('  --deep  Also removes web/node_modules (slow).')
}

const args = new Set(process.argv.slice(2))
if (args.has('--help') || args.has('-h')) {
  usage()
  process.exit(0)
}

const deep = args.has('--deep')

const repoRoot = process.cwd()
const webDir = path.join(repoRoot, 'web')

const targets = [
  // Next.js
  path.join(webDir, '.next'),

  // Playwright / test artifacts
  path.join(webDir, 'test-results'),
  path.join(webDir, 'playwright-report'),
  path.join(repoRoot, 'test-results'),
  path.join(repoRoot, 'playwright-report'),

  // Generated reports (these are gitignored; safe to wipe)
  path.join(webDir, 'reports'),

  // Vercel local state (should never be committed)
  path.join(repoRoot, '.vercel'),
  path.join(webDir, '.vercel'),

  // Wrong-directory install drift
  path.join(repoRoot, 'node_modules'),
]

if (deep) {
  targets.push(path.join(webDir, 'node_modules'))
}

let removed = 0
for (const t of targets) {
  if (!exists(t)) continue
  if (rm(t)) removed += 1
}

// eslint-disable-next-line no-console
console.log(`[clean] Done. Removed ${removed} paths${deep ? ' (deep)' : ''}.`)
