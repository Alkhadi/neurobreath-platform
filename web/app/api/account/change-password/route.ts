import { z } from 'zod';
import type { NextRequest } from 'next/server';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { getAuthedUserId } from '@/lib/auth/require-auth';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

export const runtime = 'nodejs';

const Schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
  confirmPassword: z.string().min(8).max(200),
});

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return Response.json(
      { ok: false, message: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    );
  }

  const auth = await getAuthedUserId(request);
  if (!auth.ok) {
    return Response.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  try {
    const body: unknown = await request.json().catch(() => null);
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, message: 'Invalid request' }, { status: 400 });
    }

    const { currentPassword, newPassword, confirmPassword } = parsed.data;
    if (newPassword !== confirmPassword) {
      return Response.json(
        { ok: false, message: 'Passwords do not match', fieldErrors: { confirmPassword: 'Passwords do not match' } },
        { status: 400 }
      );
    }

    const user = await prisma.authUser.findUnique({ where: { id: auth.userId } });
    if (!user) return Response.json({ ok: false, message: 'Not found' }, { status: 404 });

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return Response.json(
        { ok: false, message: 'Current password is incorrect', fieldErrors: { currentPassword: 'Incorrect password' } },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.authUser.update({ where: { id: user.id }, data: { passwordHash } });

    return Response.json({ ok: true, message: 'Password changed.' });
  } catch (error) {
    markDbDown(error);
    return Response.json({ ok: false, message: 'Failed to change password' }, { status: 500 });
  }
}
