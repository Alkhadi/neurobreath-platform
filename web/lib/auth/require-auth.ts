import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 500; message: string };

export async function getAuthedUserId(request: NextRequest): Promise<AuthResult> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return { ok: false, status: 500, message: 'Auth is not configured (missing NEXTAUTH_SECRET)' };
  }

  try {
    const token = await getToken({ req: request, secret });
    const userId = (token as { uid?: string } | null)?.uid || token?.sub;
    if (!userId) return { ok: false, status: 401, message: 'Not authenticated' };

    return { ok: true, userId };
  } catch {
    return { ok: false, status: 401, message: 'Not authenticated' };
  }
}
