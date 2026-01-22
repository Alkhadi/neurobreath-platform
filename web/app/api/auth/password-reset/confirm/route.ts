import { z } from 'zod';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { hashResetToken } from '@/lib/auth/resetToken';

export const runtime = 'nodejs';

const Schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(200),
  confirmPassword: z.string().min(8).max(200),
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
      return Response.json({ ok: false, message: 'Invalid request' }, { status: 400 });
    }

    const { token, password, confirmPassword } = parsed.data;
    if (password !== confirmPassword) {
      return Response.json(
        { ok: false, message: 'Passwords do not match', fieldErrors: { confirmPassword: 'Passwords do not match' } },
        { status: 400 }
      );
    }

    const tokenHash = hashResetToken(token);
    const record = await prisma.authPasswordResetToken.findUnique({ where: { tokenHash } });

    if (!record) {
      return Response.json({ ok: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await prisma.authPasswordResetToken.delete({ where: { id: record.id } }).catch(() => undefined);
      return Response.json({ ok: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.authUser.update({ where: { id: record.userId }, data: { passwordHash } }),
      prisma.authPasswordResetToken.deleteMany({ where: { userId: record.userId } }),
    ]);

    return Response.json({ ok: true, message: 'Password updated. You can now sign in.' });
  } catch (error) {
    markDbDown(error);
    const msg = error instanceof Error ? error.message : 'Server error';
    const isMisconfig = msg.includes('PASSWORD_PEPPER');

    return Response.json(
      { ok: false, message: isMisconfig ? 'Server auth is not configured yet' : 'Failed to update password' },
      { status: 500 }
    );
  }
}
