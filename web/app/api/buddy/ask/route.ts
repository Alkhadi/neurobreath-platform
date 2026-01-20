import { NextRequest, NextResponse } from 'next/server';
import { buddyAsk } from '@/lib/buddy/server/ask';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface RequestPayload {
  question?: string;
  pathname?: string;
  locale?: string;
  jurisdiction?: 'UK' | 'US' | 'EU';

  // Back-compat
  query?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as RequestPayload | null;
  const raw = String(body?.question || body?.query || '').trim();

  if (!raw) {
    return NextResponse.json(
      {
        error: 'Missing question',
      },
      { status: 400 }
    );
  }

  const result = await buddyAsk(req, {
    question: raw,
    pathname: body?.pathname,
    jurisdiction: body?.jurisdiction,
  });

  return NextResponse.json(result);
}
