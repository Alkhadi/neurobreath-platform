import type { NextRequest } from 'next/server';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { getAuthedUserId } from '@/lib/auth/require-auth';

export const runtime = 'nodejs';

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
    await prisma.authUser.update({
      where: { id: auth.userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecretEnc: null,
      },
    });

    return Response.json({ ok: true, message: '2FA disabled.' });
  } catch (error) {
    markDbDown(error);
    return Response.json({ ok: false, message: 'Failed to disable 2FA' }, { status: 500 });
  }
}
