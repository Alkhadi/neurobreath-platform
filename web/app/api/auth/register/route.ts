import { z } from 'zod';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
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

    if (password !== confirmPassword) {
      return Response.json(
        { ok: false, message: 'Passwords do not match', fieldErrors: { confirmPassword: 'Passwords do not match' } },
        { status: 400 }
      );
    }

    const turnstileRequired = process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (turnstileRequired) {
      if (!turnstileToken) {
        return Response.json({ ok: false, message: 'Spam protection required' }, { status: 400 });
      }
      const verified = await verifyTurnstile(req, turnstileToken);
      if (!verified.ok) {
        const status = verified.error === 'MISSING_SECRET' ? 500 : 400;
        const message =
          verified.error === 'MISSING_SECRET'
            ? 'Spam protection is not configured yet. Please try again later.'
            : 'Verification failed. Please try again.';
        return Response.json({ ok: false, message }, { status });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Do not reveal account existence; behave the same for existing emails.
    const existing = await prisma.authUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return Response.json({ ok: true, message: 'If your email can be registered, you can now sign in.' });
    }

    const passwordHash = await hashPassword(password);

    await prisma.authUser.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
        passwordHash,
        primaryDeviceId: primaryDeviceId?.trim() || null,
      },
    });

    return Response.json({ ok: true, message: 'Account created. You can now sign in.' });
  } catch (error) {
    markDbDown(error);

    const msg = error instanceof Error ? error.message : 'Server error';
    const isMisconfig = msg.includes('PASSWORD_PEPPER');
    const isMissingTable = msg.includes('AuthUser') && (msg.includes('does not exist') || msg.includes('relation'));
    const isDbError = msg.includes('P1001') || msg.includes('ECONNREFUSED') || msg.includes('PrismaClientInitializationError');

    return Response.json(
      {
        ok: false,
        message: isMisconfig
          ? 'Server auth is not configured yet'
          : isMissingTable
          ? 'Auth database tables are not ready yet. Run Prisma migrations and try again.'
          : isDbError
          ? 'Database unavailable'
          : 'Registration failed',
      },
      { status: 500 }
    );
  }
}
