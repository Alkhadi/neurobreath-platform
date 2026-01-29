export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getDatabaseUrl } from '@/lib/db';

export async function GET() {
  return Response.json(
    {
      ok: true,
      env: {
        nodeEnv: process.env.NODE_ENV ?? 'unknown',
        hasDatabaseUrl: !!getDatabaseUrl(),
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasPasswordPepper: !!process.env.PASSWORD_PEPPER,
      },
      platform: {
        isVercel: !!process.env.VERCEL,
      },
    },
    {
      status: 200,
      headers: {
        'cache-control': 'no-store',
      },
    }
  );
}
