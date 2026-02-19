#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import net from 'node:net'

function readText(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch {
    return null
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

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim()
}

function warn(msg) {
  // eslint-disable-next-line no-console
  console.warn(`[doctor] WARN: ${msg}`)
}

function ok(msg) {
  // eslint-disable-next-line no-console
  console.log(`[doctor] OK: ${msg}`)
}

function info(msg) {
  // eslint-disable-next-line no-console
  console.log(`[doctor] ${msg}`)
}

function parsePinnedNode(repoRoot) {
  const nvmrc = path.join(repoRoot, '.nvmrc')
  const nodeVersion = path.join(repoRoot, '.node-version')
  const raw = readText(nvmrc) ?? readText(nodeVersion)
  if (!raw) return null
  return raw.trim().replace(/^v/i, '')
}

function parseNodeVersion(v) {
  const raw = v.replace(/^v/i, '')
  const [major, minor, patch] = raw.split('.').map((n) => Number(n))
  return { raw, major, minor, patch }
}

async function isPortOpen(port) {
  return await new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port })
    socket.once('connect', () => {
      socket.end()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
    socket.setTimeout(500)
    socket.once('timeout', () => {
      socket.destroy()
      resolve(false)
    })
  })
}

function walkFiles(dir, exts, limit = 4000) {
  const out = []
  const stack = [dir]

  while (stack.length) {
    const cur = stack.pop()
    if (!cur) break

    let entries
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true })
    } catch {
      continue
    }

    for (const e of entries) {
      if (e.name.startsWith('.')) continue
      if (e.name === 'node_modules') continue
      if (e.name === '.next') continue

      const full = path.join(cur, e.name)
      if (e.isDirectory()) {
        stack.push(full)
        continue
      }
      if (!e.isFile()) continue
      if (!exts.some((x) => e.name.endsWith(x))) continue

      out.push(full)
      if (out.length >= limit) return out
    }
  }

  return out
}

function extractEnvKeysFromSource(text) {
  const keys = new Set()
  for (const m of text.matchAll(/process\.env\.([A-Z0-9_]+)/g)) keys.add(m[1])
  for (const m of text.matchAll(/process\.env\[['"]([A-Z0-9_]+)['"]\]/g)) keys.add(m[1])
  return keys
}

function parseEnvExampleKeys(envExampleText) {
  const keys = new Set()
  const lines = envExampleText.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('##')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    if (!/^[A-Z0-9_]+$/.test(key)) continue
    keys.add(key)
  }
  return keys
}

function shouldIgnoreEnvKey(key) {
  // Ignore common runtime/platform env vars that are not meant to be mirrored into web/.env.example
  // (they are injected by Next.js/Vercel/GitHub Actions/CI or provided by the runtime).
  if (key === 'NODE_ENV') return true
  if (key === 'CI') return true
  if (key === 'PORT') return true
  if (key === 'CHROME_PATH') return true
  if (key === 'COMMIT_SHA') return true
  if (key === 'GIT_SHA') return true
  if (key === 'BASE_SHA') return true
  if (key === 'HEAD_SHA') return true
  if (key.startsWith('VERCEL')) return true
  if (key.startsWith('GITHUB_')) return true
  return false
}

async function main() {
  const repoRoot = process.cwd()
  const webDir = path.join(repoRoot, 'web')

  info(`Repo root: ${repoRoot}`)

  if (!exists(path.join(repoRoot, 'package.json'))) {
    warn('No package.json at repo root. Root scripts may not work as expected.')
  }

  if (!exists(path.join(webDir, 'package.json'))) {
    warn('Missing web/package.json. Expected Next.js app under web/.')
    process.exitCode = 1
    return
  }
  ok('Found web/package.json')

  const pinned = parsePinnedNode(repoRoot)
  const node = parseNodeVersion(process.version)

  info(`Node: ${node.raw}`)
  if (pinned) {
    info(`Pinned Node: ${pinned}`)
    const pinnedParsed = parseNodeVersion(pinned)
    if (pinnedParsed.major !== node.major) {
      warn(`Node major mismatch (pinned ${pinnedParsed.major}, current ${node.major}). Use: nvm install && nvm use`)
    } else {
      ok('Node major matches pinned version')
    }
  } else {
    warn('No .nvmrc or .node-version found. Add one to pin Node.')
  }

  try {
    const yarnVersion = run('yarn', ['-v'])
    info(`Yarn: ${yarnVersion}`)
  } catch {
    warn('Yarn is not available on PATH. Install Yarn 1.x (or enable via corepack if your setup uses it).')
  }

  const rootNodeModules = path.join(repoRoot, 'node_modules')
  const webNodeModules = path.join(webDir, 'node_modules')

  if (exists(rootNodeModules)) {
    warn('Root node_modules exists (wrong-directory install drift). Prefer installing only in web/: `cd web && yarn install`')
  } else {
    ok('No root node_modules')
  }

  if (!exists(webNodeModules)) {
    warn('web/node_modules is missing. Run: `cd web && yarn install`')
  } else {
    ok('web/node_modules present')
  }

  if (exists(path.join(repoRoot, 'yarn.lock'))) {
    warn('Root yarn.lock exists. This usually means someone installed dependencies at repo root (avoid).')
  }

  if (!exists(path.join(webDir, 'yarn.lock'))) {
    warn('Missing web/yarn.lock. Dependency installs may be unstable without it.')
    process.exitCode = 1
  } else {
    ok('Found web/yarn.lock')
  }

  // Env policy
  const webEnvExample = path.join(webDir, '.env.example')
  if (!exists(webEnvExample)) {
    warn('Missing web/.env.example (required).')
    process.exitCode = 1
  } else {
    ok('Found web/.env.example')
  }

  // Ensure .env.local files are NOT tracked by git
  try {
    run('git', ['ls-files', '--error-unmatch', 'web/.env.local'])
    warn('web/.env.local is tracked by git (should never happen). Remove from git history and ensure it is ignored.')
    process.exitCode = 1
  } catch {
    // not tracked
  }

  // Prisma sanity (best-effort)
  const prismaSchema = path.join(webDir, 'prisma', 'schema.prisma')
  if (exists(prismaSchema)) {
    ok('Found Prisma schema')
    const prismaClientA = path.join(webDir, 'node_modules', '@prisma', 'client')
    const prismaClientB = path.join(webDir, 'node_modules', '.prisma', 'client')
    if (!exists(prismaClientA) && !exists(prismaClientB)) {
      warn('Prisma Client not found. Run: `cd web && yarn prisma:generate` (or `yarn typecheck` which runs prisma generate).')
    } else {
      ok('Prisma Client appears generated')
    }
  } else {
    info('Prisma schema not found (skipping Prisma checks).')
  }

  // Env var name coverage (fast heuristic)
  const envExampleText = readText(webEnvExample)
  if (envExampleText) {
    const exampleKeys = parseEnvExampleKeys(envExampleText)

    // Focus on runtime code; exclude web/scripts (CI + repo tooling) to avoid noisy false positives.
    const scanRoots = [path.join(webDir, 'app'), path.join(webDir, 'lib'), path.join(webDir, 'components')]
      .filter((p) => exists(p))

    const sourceKeys = new Set()
    for (const root of scanRoots) {
      const files = walkFiles(root, ['.ts', '.tsx', '.js', '.mjs', '.cjs'])
      for (const f of files) {
        const txt = readText(f)
        if (!txt) continue
        for (const k of extractEnvKeysFromSource(txt)) sourceKeys.add(k)
      }
    }

    const missingFromExample = Array.from(sourceKeys)
      .filter((k) => !shouldIgnoreEnvKey(k))
      .filter((k) => !exampleKeys.has(k))
      .sort()
    if (missingFromExample.length) {
      warn(`Env vars referenced in code but missing from web/.env.example: ${missingFromExample.join(', ')}`)
      warn('Add missing env var NAMES to web/.env.example (no values).')
    } else {
      ok('Env var names referenced in code appear covered by web/.env.example')
    }
  }

  // Port sanity
  const port3000 = await isPortOpen(3000)
  if (port3000) {
    warn('Port 3000 is currently in use. If dev/start fails, pick another port (e.g. `PORT=3001 yarn dev`).')
  } else {
    ok('Port 3000 appears free')
  }

  info('Doctor complete. If you see warnings, run `yarn clean` and/or switch Node via `nvm use`.')
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[doctor] Error:', err)
  process.exit(1)
})
