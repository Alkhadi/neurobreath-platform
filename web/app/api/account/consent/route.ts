import { z } from 'zod';
import type { NextRequest } from 'next/server';

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db';
import { getAuthedUserId } from '@/lib/auth/require-auth';

export const runtime = 'nodejs';

const ConsentSchema = z.object({
  functional: z.boolean(),
  analytics: z.boolean(),
  // Optional metadata for debugging/future-proofing
  version: z.string().min(1).max(50).optional(),
  timestamp: z.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
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
    const user = await prisma.authUser.findUnique({
      where: { id: auth.userId },
      select: { consentState: true, consentUpdatedAt: true },
    });

    return Response.json({ ok: true, consent: user?.consentState ?? null, updatedAt: user?.consentUpdatedAt ?? null });
  } catch (error) {
    markDbDown(error);
    return Response.json({ ok: false, message: 'Failed to load consent' }, { status: 500 });
  }
}

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
    const parsed = ConsentSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ ok: false, message: 'Invalid request' }, { status: 400 });
    }

    const state = {
      essential: true,
      functional: parsed.data.functional,
      analytics: parsed.data.analytics,
      version: parsed.data.version ?? '1.0',
      timestamp: parsed.data.timestamp ?? Date.now(),
    };

    await prisma.authUser.update({
      where: { id: auth.userId },
      data: {
        consentState: state,
        consentUpdatedAt: new Date(),
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    markDbDown(error);
    return Response.json({ ok: false, message: 'Failed to save consent' }, { status: 500 });
  }
}
