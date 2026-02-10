import type { NextRequest } from 'next/server';
import { generateSecret, generateURI } from 'otplib';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { getAuthedUserId } from '@/lib/auth/require-auth';
import { encryptTotpSecret } from '@/lib/auth/totp';

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
    const user = await prisma.authUser.findUnique({ where: { id: auth.userId } });
    if (!user) return Response.json({ ok: false, message: 'Not found' }, { status: 404 });

    const secret = generateSecret();
    const secretEnc = encryptTotpSecret(secret);

    await prisma.authUser.update({
      where: { id: user.id },
      data: {
        twoFactorSecretEnc: secretEnc,
        twoFactorEnabled: false,
      },
    });

    const issuer = 'NeuroBreath';
    const otpauthUrl = generateURI({ issuer, label: user.email, secret, strategy: 'totp' });
    const masked = `${secret.slice(0, 3)}…${secret.slice(-3)}`;

    return Response.json({ ok: true, otpauthUrl, maskedSecret: masked, message: 'Scan the QR and enter the code to enable 2FA.' });
  } catch (error) {
    markDbDown(error);
    const msg = error instanceof Error ? error.message : 'Server error';
    const isMisconfig = msg.includes('TWOFA_ENCRYPTION_KEY');

    return Response.json(
      { ok: false, message: isMisconfig ? '2FA is not configured on this server yet' : 'Failed to set up 2FA' },
      { status: 500 }
    );
  }
}
