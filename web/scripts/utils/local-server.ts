import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'

type WithServerOptions = {
  baseURL?: string
  port?: number
  healthPath?: string
  reuseExisting?: boolean
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

async function waitForHealth(url: string, timeoutMs: number) {
  const started = Date.now()
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'follow' })
      if (res.ok) return
    } catch {
      // ignore
    }

    if (Date.now() - started > timeoutMs) {
      throw new Error(`Server did not become healthy in ${timeoutMs}ms: ${url}`)
    }

    await sleep(250)
  }
}

function cleanNextBuildArtifacts() {
  try {
    fs.rmSync('.next', { recursive: true, force: true })
  } catch {
    // ignore
  }
}

async function killProcess(proc: ReturnType<typeof spawnYarn>) {
  proc.kill('SIGTERM')
  await sleep(500)
  if (!proc.killed) proc.kill('SIGKILL')
}

function spawnYarn(args: string[]) {
  // Use `yarn` directly; works in this repo’s tooling.
  return spawn('yarn', args, {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env },
  })
}

async function runYarn(args: string[]) {
  const proc = spawnYarn(args)
  const code: number = await new Promise((resolve, reject) => {
    proc.once('error', reject)
    proc.once('exit', (exitCode) => resolve(exitCode ?? 1))
  })
  if (code !== 0) {
    throw new Error(`Command failed: yarn ${args.join(' ')} (exit ${code})`)
  }
}

async function isPortFree(port: number) {
  return await new Promise<boolean>((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(false))
    server.listen(port, '127.0.0.1', () => {
      server.close(() => resolve(true))
    })
  })
}

async function pickPort(preferredPort: number) {
  if (await isPortFree(preferredPort)) return preferredPort
  for (let p = preferredPort + 1; p <= preferredPort + 25; p += 1) {
    if (await isPortFree(p)) return p
  }
  return preferredPort
}

function startNextServer(port: number) {
  // Yarn v1 doesn't support `yarn next ...` unless there's a script named `next`.
  // Use the existing `start` script and forward args.
  return spawnYarn(['start', '--', '-p', String(port)])
}

export async function withLocalServer<T>(fn: (baseURL: string) => Promise<T>, opts: WithServerOptions = {}) {
  const envBaseURL = process.env.BASE_URL
  const requestedBaseURL = (opts.baseURL ?? envBaseURL)?.replace(/\/$/, '')
  const preferredPort = opts.port ?? Number(process.env.LOCAL_SERVER_PORT || 3000)
  const healthPath = opts.healthPath ?? '/api/healthz'

  // If a baseURL is explicitly provided, prefer it. If it's local and not healthy,
  // start a server for it (so gates can run with BASE_URL=http://localhost:3001).
  if (requestedBaseURL) {
    try {
      const url = new URL(requestedBaseURL)
      const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
      const requestedPort = url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80

      if (!isLocalhost) {
        await waitForHealth(`${requestedBaseURL}${healthPath}`, 30_000)
        return fn(requestedBaseURL)
      }

      try {
        await waitForHealth(`${requestedBaseURL}${healthPath}`, 2_500)
        return fn(requestedBaseURL)
      } catch {
        // fall through to managed server startup on requested port
      }

      opts = { ...opts, port: requestedPort, reuseExisting: false }
    } catch {
      // If BASE_URL is malformed, ignore and proceed with managed server.
    }
  }

  // Prefer reusing an already-running server on the preferred port if it's healthy.
  if (opts.reuseExisting !== false) {
    const candidateBaseURL = `http://localhost:${preferredPort}`
    try {
      await waitForHealth(`${candidateBaseURL}${healthPath}`, 2_500)
      return fn(candidateBaseURL)
    } catch {
      // fall through
    }
  }

  // If the preferred port is occupied but unhealthy, don't fight it; pick another port.
  const port = await pickPort(opts.port ?? preferredPort)
  const baseURL = `http://localhost:${port}`
  const healthUrl = `${baseURL}${healthPath}`

  const hasNextBuild = fs.existsSync(path.join('.next', 'BUILD_ID'))

  // If there is no build, we must produce one.
  if (!hasNextBuild) {
    cleanNextBuildArtifacts()
    await runYarn(['build'])
  }

  let proc = startNextServer(port)

  try {
    try {
      await waitForHealth(healthUrl, 60_000)
    } catch (err) {
      // If `.next` is corrupted/partial (common after interrupted builds or cleanup),
      // Next can boot but fail every request. Recover by forcing a clean rebuild once.
      await killProcess(proc)
      cleanNextBuildArtifacts()
      await runYarn(['build'])
      proc = startNextServer(port)
      await waitForHealth(healthUrl, 120_000)
    }

    return await fn(baseURL)
  } finally {
    await killProcess(proc)
  }
}
