import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaDbDownUntil: number | undefined
  prismaLastDownReason: string | undefined
}

function readNonEmptyEnv(name: string): string | undefined {
  const value = process.env[name]
  const trimmed = typeof value === 'string' ? value.trim() : ''
  return trimmed ? trimmed : undefined
}

export function getDatabaseUrl(): string | undefined {
  return (
    readNonEmptyEnv('DATABASE_URL') ||
    // Prisma Postgres
    readNonEmptyEnv('PRISMA_DATABASE_URL') ||
    // Common hosting/integration env vars (e.g. Vercel Postgres)
    readNonEmptyEnv('POSTGRES_PRISMA_URL') ||
    readNonEmptyEnv('POSTGRES_URL_NON_POOLING') ||
    readNonEmptyEnv('POSTGRES_URL')
  )
}

export function getDatabaseUrlSource():
  | 'DATABASE_URL'
  | 'PRISMA_DATABASE_URL'
  | 'POSTGRES_PRISMA_URL'
  | 'POSTGRES_URL_NON_POOLING'
  | 'POSTGRES_URL'
  | null {
  if (readNonEmptyEnv('DATABASE_URL')) return 'DATABASE_URL'
  if (readNonEmptyEnv('PRISMA_DATABASE_URL')) return 'PRISMA_DATABASE_URL'
  if (readNonEmptyEnv('POSTGRES_PRISMA_URL')) return 'POSTGRES_PRISMA_URL'
  if (readNonEmptyEnv('POSTGRES_URL_NON_POOLING')) return 'POSTGRES_URL_NON_POOLING'
  if (readNonEmptyEnv('POSTGRES_URL')) return 'POSTGRES_URL'
  return null
}

function ensureDatabaseUrl(): string {
  const url = getDatabaseUrl()
  if (url && !readNonEmptyEnv('DATABASE_URL')) {
    // Prisma schema expects env("DATABASE_URL"); map provider-specific vars.
    process.env.DATABASE_URL = url
  }
  if (!url) {
    throw new Error('Missing DATABASE_URL')
  }
  return url
}

function ensurePrisma(): PrismaClient {
  ensureDatabaseUrl()

  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const client = new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}

// Avoid instantiating Prisma at module scope when env is missing.
// Preserve existing import API via a Proxy.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = ensurePrisma()
    const value = Reflect.get(client as unknown as object, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

const DEFAULT_DB_DOWN_MS = 30_000

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

function shouldTripDbCircuit(error: unknown): boolean {
  const msg = getErrorMessage(error)
  // Common Prisma/Postgres connectivity signals
  return (
    msg.includes('P1001') || // can't reach database server
    msg.includes('Timed out fetching a new connection from the connection pool') ||
    msg.includes('connection pool') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('PrismaClientInitializationError')
  )
}

export function isDbDown(): boolean {
  const until = globalForPrisma.prismaDbDownUntil
  return typeof until === 'number' && until > Date.now()
}

export function getDbDownReason(): string | undefined {
  return globalForPrisma.prismaLastDownReason
}

export function markDbDown(error: unknown, downMs: number = DEFAULT_DB_DOWN_MS) {
  if (!shouldTripDbCircuit(error)) return

  const now = Date.now()
  const prevUntil = globalForPrisma.prismaDbDownUntil ?? 0
  const nextUntil = now + downMs
  globalForPrisma.prismaDbDownUntil = Math.max(prevUntil, nextUntil)
  globalForPrisma.prismaLastDownReason = getErrorMessage(error)
}
