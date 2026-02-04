import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { prisma, isDbDown, getDbDownReason, markDbDown, getDatabaseUrl } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { checkRateLimit, clearRateLimitOnSuccess, getRetryAfterSeconds, recordFailedAttempt } from '@/lib/auth/rate-limit';
import { verifyTurnstile } from '@/lib/security/turnstile';

export const runtime = 'nodejs';

const Schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  confirmPassword: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
  primaryDeviceId: z.string().max(120).optional(),
  turnstileToken: z.string().optional(),
});

export async function POST(req: Request) {
  if (isDbDown()) {
    return Response.json(
      { ok: false, message: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await req.json().catch(() => null);
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, message: 'Invalid form data' }, { status: 400 });
    }

    const { email, password, confirmPassword, name, primaryDeviceId, turnstileToken } = parsed.data;

    const normalizedEmail = email.trim().toLowerCase();

    const rate = await checkRateLimit(req, normalizedEmail, 'register');
    if (!rate.allowed) {
      const retryAfter = getRetryAfterSeconds(rate);
      return Response.json(
        { ok: false, message: 'Please try again later.' },
        {
          status: 429,
          headers: {
            'cache-control': 'no-store',
            ...(retryAfter ? { 'Retry-After': String(retryAfter) } : null),
          },
        }
      );
    }

    if (!/\d/.test(password)) {
      return Response.json(
        {
          ok: false,
          message: 'Password must be at least 8 characters and include at least one number.',
          fieldErrors: {
            password: 'Use 8+ characters and include at least one number.',
          },
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { ok: false, message: 'Passwords do not match', fieldErrors: { confirmPassword: 'Passwords do not match' } },
        { status: 400 }
      );
    }

    const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (turnstileEnabled) {
      if (!turnstileToken) {
        return Response.json({ ok: false, message: 'Please complete the spam protection check.' }, { status: 400 });
      }

      const verified = await verifyTurnstile(req, turnstileToken);
      if (!verified.ok) {
        const status = verified.error === 'MISSING_SECRET' ? 500 : 400;
        const message =
          verified.error === 'MISSING_SECRET'
            ? 'Security check is not configured yet. Please contact support.'
            : verified.error === 'NETWORK_ERROR'
            ? 'Security check temporarily unavailable. Please try again.'
            : 'Security check failed. Please try again.';
        return Response.json({ ok: false, message }, { status });
      }
    }

    const existing = await prisma.authUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      await recordFailedAttempt(req, normalizedEmail, 'register');
      return Response.json(
        { ok: false, message: 'Unable to create account. If you already have an account, try signing in.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    try {
      await prisma.authUser.create({
        data: {
          email: normalizedEmail,
          name: name?.trim() || null,
          passwordHash,
          primaryDeviceId: primaryDeviceId?.trim() || null,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        await recordFailedAttempt(req, normalizedEmail, 'register');
        return Response.json(
          { ok: false, message: 'Unable to create account. If you already have an account, try signing in.' },
          { status: 409 }
        );
      }
      throw err;
    }

    await clearRateLimitOnSuccess(normalizedEmail, 'register');

    return Response.json({ ok: true, message: 'Account created. You can now sign in.' });
  } catch (error) {
    markDbDown(error);

    console.error('[auth/register] error', error instanceof Error ? error.message : error);

    const msg = error instanceof Error ? error.message : 'Server error';
    const isMissingDbUrl = msg.includes('Missing DATABASE_URL');
    const isMisconfig = msg.includes('PASSWORD_PEPPER');
    const isMissingTable = msg.includes('AuthUser') && (msg.includes('does not exist') || msg.includes('relation'));
    const isDbError = msg.includes('P1001') || msg.includes('ECONNREFUSED') || msg.includes('PrismaClientInitializationError');

    const isDev = process.env.NODE_ENV !== 'production';

    return Response.json(
      {
        ok: false,
        message: isMissingDbUrl
          ? isDev
            ? 'Database is not configured (DATABASE_URL is missing). Set it in web/.env.local (or your container env) and restart the server.'
            : 'Server database is not configured yet. Please contact support.'
          : isMisconfig
          ? isDev
            ? 'Auth is not configured (PASSWORD_PEPPER is missing). Set it in web/.env.local (or your container env) and restart the server.'
            : 'Server auth is not configured yet. Please contact support.'
          : isMissingTable
          ? 'Auth database tables are not ready yet. Run Prisma migrations and try again.'
          : isDbError
          ? 'Database unavailable'
          : 'Registration failed. Please try again in a moment.',
        ...(isDev
          ? {
              debug: {
                nodeEnv: process.env.NODE_ENV ?? 'unknown',
                hasDatabaseUrl: !!getDatabaseUrl(),
                hasPasswordPepper: !!process.env.PASSWORD_PEPPER,
              },
            }
          : null),
      },
      { status: 500 }
    );
  }
}
