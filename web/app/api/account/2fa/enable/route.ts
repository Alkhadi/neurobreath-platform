import { z } from 'zod';
import type { NextRequest } from 'next/server';
import { verifySync } from 'otplib';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { getAuthedUserId } from '@/lib/auth/require-auth';
import { decryptTotpSecret } from '@/lib/auth/totp';

export const runtime = 'nodejs';

const Schema = z.object({
  token: z.string().min(4).max(12),
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

    const user = await prisma.authUser.findUnique({ where: { id: auth.userId } });
    if (!user) return Response.json({ ok: false, message: 'Not found' }, { status: 404 });
    if (!user.twoFactorSecretEnc) {
      return Response.json({ ok: false, message: '2FA not set up yet' }, { status: 400 });
    }

    const secret = decryptTotpSecret(user.twoFactorSecretEnc);
    const result = verifySync({ strategy: 'totp', secret, token: parsed.data.token.trim() });
    const ok = !!(result as { valid?: boolean }).valid;
    if (!ok) {
      return Response.json({ ok: false, message: 'Invalid code', fieldErrors: { token: 'Invalid code' } }, { status: 400 });
    }

    await prisma.authUser.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });

    return Response.json({ ok: true, message: '2FA enabled.' });
  } catch (error) {
    markDbDown(error);
    return Response.json({ ok: false, message: 'Failed to enable 2FA' }, { status: 500 });
  }
}
