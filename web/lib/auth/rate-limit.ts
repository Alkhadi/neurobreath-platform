import { prisma } from '@/lib/db';

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

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

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

export async function checkRateLimit(
  req: Request,
  email: string,
  attemptType: 'login' | 'password_reset' | 'register' = 'login'
): Promise<RateLimitResult> {
  const ipAddress = getClientIp(req);
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check by email first
    const emailRecord = await authRateLimitDelegate().findUnique({
      where: {
        email_attemptType: {
          email: normalizedEmail,
          attemptType,
        },
      },
    });

    if (emailRecord) {
      // If locked, check if still locked
      if (emailRecord.lockedUntil && emailRecord.lockedUntil > new Date()) {
        return {
          allowed: false,
          remaining: 0,
          lockedUntil: emailRecord.lockedUntil,
          message: `Too many attempts. Please try again after ${emailRecord.lockedUntil.toLocaleString()}.`,
        };
      }

      // If lockout expired, reset
      if (emailRecord.lockedUntil && emailRecord.lockedUntil <= new Date()) {
        await authRateLimitDelegate().update({
          where: { id: emailRecord.id },
          data: {
            attemptCount: 0,
            lockedUntil: null,
            firstAttemptAt: new Date(),
            lastAttemptAt: new Date(),
          },
        });
        return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS, lockedUntil: null };
      }

      // Check if sliding window expired (reset after 1 hour of no attempts)
      const timeSinceLastAttempt = Date.now() - emailRecord.lastAttemptAt.getTime();
      if (timeSinceLastAttempt > 60 * 60 * 1000) {
        await authRateLimitDelegate().update({
          where: { id: emailRecord.id },
          data: {
            attemptCount: 0,
            firstAttemptAt: new Date(),
            lastAttemptAt: new Date(),
          },
        });
        return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS, lockedUntil: null };
      }

      // Check remaining attempts
      const remaining = MAX_LOGIN_ATTEMPTS - emailRecord.attemptCount;
      if (remaining <= 0) {
        const lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await authRateLimitDelegate().update({
          where: { id: emailRecord.id },
          data: { lockedUntil: lockoutUntil },
        });
        return {
          allowed: false,
          remaining: 0,
          lockedUntil: lockoutUntil,
          message: 'Too many failed attempts. Please try again in 15 minutes.',
        };
      }

      return { allowed: true, remaining, lockedUntil: null };
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

    if (ipRecord?.lockedUntil && ipRecord.lockedUntil > new Date()) {
      return {
        allowed: false,
        remaining: 0,
        lockedUntil: ipRecord.lockedUntil,
        message: 'Too many attempts from this network. Please try again later.',
      };
    }

    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS, lockedUntil: null };
  } catch {
    // If DB fails, allow but warn
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS, lockedUntil: null };
  }
}

export async function recordFailedAttempt(
  req: Request,
  email: string,
  attemptType: 'login' | 'password_reset' | 'register' = 'login'
): Promise<void> {
  const ipAddress = getClientIp(req);
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Record by email
    const existingEmail = await authRateLimitDelegate().findUnique({
      where: {
        email_attemptType: {
          email: normalizedEmail,
          attemptType,
        },
      },
    });

    if (existingEmail) {
      await authRateLimitDelegate().update({
        where: { id: existingEmail.id },
        data: {
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
        },
      });
    } else {
      await authRateLimitDelegate().create({
        data: {
          email: normalizedEmail,
          attemptType,
          attemptCount: 1,
          ipAddress,
          firstAttemptAt: new Date(),
          lastAttemptAt: new Date(),
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
      await authRateLimitDelegate().update({
        where: { id: existingIp.id },
        data: {
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
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
        },
      });
    }
  } catch {
    // Fail silently
  }
}

export async function clearRateLimitOnSuccess(
  email: string,
  attemptType: 'login' | 'password_reset' | 'register' = 'login'
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    await authRateLimitDelegate().deleteMany({
      where: {
        email: normalizedEmail,
        attemptType,
      },
    });
  } catch {
    // Fail silently
  }
}
