import { z } from 'zod';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { createResetToken } from '@/lib/auth/resetToken';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sendPasswordResetEmail } from '@/lib/email/sendPasswordReset';

export const runtime = 'nodejs';

const Schema = z.object({
  email: z.string().email().max(200),
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
      return Response.json({ ok: true, message: 'If an account exists, you will receive an email shortly.' });
    }

    const { email, turnstileToken } = parsed.data;

    // If password reset emailing isn't configured, fail closed for everyone.
    if (!process.env.RESEND_API_KEY || !process.env.SITE_BASE_URL) {
      return Response.json({ ok: false, message: 'Server email is not configured' }, { status: 500 });
    }

    const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
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
    const user = await prisma.authUser.findUnique({ where: { email: normalizedEmail } });

    // Always respond generically to prevent enumeration.
    if (!user) {
      return Response.json({ ok: true, message: 'If an account exists, you will receive an email shortly.' });
    }

    // Invalidate existing tokens for this user
    await prisma.authPasswordResetToken.deleteMany({ where: { userId: user.id } });

    const { token, tokenHash } = createResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.authPasswordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    await sendPasswordResetEmail({ toEmail: user.email, token });

    return Response.json({ ok: true, message: 'If an account exists, you will receive an email shortly.' });
  } catch (error) {
    markDbDown(error);
    return Response.json({ ok: true, message: 'If an account exists, you will receive an email shortly.' });
  }
}
