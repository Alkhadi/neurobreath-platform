import { prisma } from '@/lib/db';
import { createHmac } from 'crypto';

type AttemptType = 'login' | 'password_reset' | 'register' | 'magic_link';

type AuthRateLimitRecord = {
  id: string;
  attemptCount: number;
  lockedUntil: Date | null;
  lastAttemptAt: Date;
};

type AuthRateLimitDelegate = {
  findUnique(args: unknown): Promise<AuthRateLimitRecord | null>;
  update(args: unknown): Promise<AuthRateLimitRecord>;
  create(args: unknown): Promise<AuthRateLimitRecord>;
  deleteMany(args: unknown): Promise<unknown>;
};

function authRateLimitDelegate(): AuthRateLimitDelegate {
  const delegate = (prisma as unknown as Record<string, unknown>)['authRateLimit'];
  return delegate as AuthRateLimitDelegate;
}

const MAGIC_LINK_COOLDOWN_MS = 60 * 1000; // 60 seconds

const RATE_LIMITS: Record<AttemptType, { maxAttempts: number; windowMs: number; lockMs: number }> = {
  login: { maxAttempts: 5, windowMs: 60 * 60 * 1000, lockMs: 15 * 60 * 1000 },
  register: { maxAttempts: 5, windowMs: 15 * 60 * 1000, lockMs: 15 * 60 * 1000 },
  password_reset: { maxAttempts: 5, windowMs: 15 * 60 * 1000, lockMs: 15 * 60 * 1000 },
  magic_link: { maxAttempts: 3, windowMs: 10 * 60 * 1000, lockMs: 10 * 60 * 1000 },
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  lockedUntil: Date | null;
  message?: string;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function getRateLimitSalt(): string {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'dev-nextauth-secret';
}

function hashKey(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHmac('sha256', getRateLimitSalt()).update(normalized).digest('hex');
}

function secondsUntil(date: Date): number {
  const diffMs = date.getTime() - Date.now();
  return Math.max(1, Math.ceil(diffMs / 1000));
}

async function resetWindow(id: string) {
  await authRateLimitDelegate().update({
    where: { id },
    data: {
      attemptCount: 0,
      lockedUntil: null,
      firstAttemptAt: new Date(),
      lastAttemptAt: new Date(),
    },
  });
}

async function enforceLimit(record: AuthRateLimitRecord, attemptType: AttemptType): Promise<RateLimitResult> {
  const policy = RATE_LIMITS[attemptType];
  const now = new Date();

  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      lockedUntil: record.lockedUntil,
      message:
        attemptType === 'magic_link'
          ? 'Please wait a moment before requesting another sign-in link.'
          : 'Too many attempts. Please try again shortly.',
    };
  }

  const timeSinceLastAttempt = Date.now() - record.lastAttemptAt.getTime();
  if (timeSinceLastAttempt > policy.windowMs) {
    await resetWindow(record.id);
    return { allowed: true, remaining: policy.maxAttempts, lockedUntil: null };
  }

  const remaining = policy.maxAttempts - record.attemptCount;
  if (remaining <= 0) {
    const lockoutUntil = new Date(Date.now() + policy.lockMs);
    await authRateLimitDelegate().update({
      where: { id: record.id },
      data: { lockedUntil: lockoutUntil },
    });

    return {
      allowed: false,
      remaining: 0,
      lockedUntil: lockoutUntil,
      message:
        attemptType === 'magic_link'
          ? 'Please wait a moment before requesting another sign-in link.'
          : 'Too many attempts. Please try again shortly.',
    };
  }

  return { allowed: true, remaining, lockedUntil: null };
}

export async function checkRateLimit(
  req: Request,
  email: string,
  attemptType: AttemptType = 'login'
): Promise<RateLimitResult> {
  const ipAddress = hashKey(getClientIp(req));
  const emailKey = hashKey(email);

  try {
    // Check by email first
    const emailRecord = await authRateLimitDelegate().findUnique({
      where: {
        email_attemptType: {
          email: emailKey,
          attemptType,
        },
      },
    });

    if (emailRecord) {
      return await enforceLimit(emailRecord, attemptType);
    }

    // Also check by IP (secondary defense)
    const ipRecord = await authRateLimitDelegate().findUnique({
      where: {
        ipAddress_attemptType: {
          ipAddress,
          attemptType,
        },
      },
    });

    if (ipRecord) {
      const result = await enforceLimit(ipRecord, attemptType);
      if (!result.allowed) {
        // Prefer generic messaging for network-based lockouts.
        return {
          ...result,
          message:
            attemptType === 'magic_link'
              ? 'Please wait a moment before requesting another sign-in link.'
              : 'Too many attempts from this network. Please try again later.',
        };
      }
      return result;
    }

    const policy = RATE_LIMITS[attemptType];
    return { allowed: true, remaining: policy.maxAttempts, lockedUntil: null };
  } catch {
    // If DB fails, allow but warn
    const policy = RATE_LIMITS[attemptType];
    return { allowed: true, remaining: policy.maxAttempts, lockedUntil: null };
  }
}

export async function recordFailedAttempt(
  req: Request,
  email: string,
  attemptType: AttemptType = 'login'
): Promise<void> {
  const ipAddress = hashKey(getClientIp(req));
  const emailKey = hashKey(email);

  const policy = RATE_LIMITS[attemptType];
  const magicCooldownUntil = attemptType === 'magic_link' ? new Date(Date.now() + MAGIC_LINK_COOLDOWN_MS) : null;

  try {
    // Record by email
    const existingEmail = await authRateLimitDelegate().findUnique({
      where: {
        email_attemptType: {
          email: emailKey,
          attemptType,
        },
      },
    });

    if (existingEmail) {
      const nextLockedUntil =
        attemptType === 'magic_link'
          ? (() => {
              const windowLock = new Date(Date.now() + policy.lockMs);
              const shouldWindowLock = existingEmail.attemptCount + 1 >= policy.maxAttempts;
              const candidate = shouldWindowLock ? windowLock : (magicCooldownUntil as Date);
              if (!candidate) return existingEmail.lockedUntil;
              if (!existingEmail.lockedUntil) return candidate;
              return existingEmail.lockedUntil > candidate ? existingEmail.lockedUntil : candidate;
            })()
          : existingEmail.lockedUntil;

      await authRateLimitDelegate().update({
        where: { id: existingEmail.id },
        data: {
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
          ...(attemptType === 'magic_link' ? { lockedUntil: nextLockedUntil } : null),
        },
      });
    } else {
      await authRateLimitDelegate().create({
        data: {
          email: emailKey,
          attemptType,
          attemptCount: 1,
          ipAddress,
          firstAttemptAt: new Date(),
          lastAttemptAt: new Date(),
          ...(attemptType === 'magic_link' ? { lockedUntil: magicCooldownUntil } : null),
        },
      });
    }

    // Also track by IP (secondary)
    const existingIp = await authRateLimitDelegate().findUnique({
      where: {
        ipAddress_attemptType: {
          ipAddress,
          attemptType,
        },
      },
    });

    if (existingIp) {
      const nextLockedUntil =
        attemptType === 'magic_link'
          ? (() => {
              const windowLock = new Date(Date.now() + policy.lockMs);
              const shouldWindowLock = existingIp.attemptCount + 1 >= policy.maxAttempts;
              const candidate = shouldWindowLock ? windowLock : (magicCooldownUntil as Date);
              if (!candidate) return existingIp.lockedUntil;
              if (!existingIp.lockedUntil) return candidate;
              return existingIp.lockedUntil > candidate ? existingIp.lockedUntil : candidate;
            })()
          : existingIp.lockedUntil;

      await authRateLimitDelegate().update({
        where: { id: existingIp.id },
        data: {
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
          ...(attemptType === 'magic_link' ? { lockedUntil: nextLockedUntil } : null),
        },
      });
    } else {
      await authRateLimitDelegate().create({
        data: {
          ipAddress,
          attemptType,
          attemptCount: 1,
          firstAttemptAt: new Date(),
          lastAttemptAt: new Date(),
          ...(attemptType === 'magic_link' ? { lockedUntil: magicCooldownUntil } : null),
        },
      });
    }
  } catch {
    // Fail silently
  }
}

export async function clearRateLimitOnSuccess(
  email: string,
  attemptType: AttemptType = 'login'
): Promise<void> {
  const emailKey = hashKey(email);
  try {
    await authRateLimitDelegate().deleteMany({
      where: {
        email: emailKey,
        attemptType,
      },
    });
  } catch {
    // Fail silently
  }
}

export function getRetryAfterSeconds(result: RateLimitResult): number | null {
  if (!result.lockedUntil) return null;
  return secondsUntil(result.lockedUntil);
}
