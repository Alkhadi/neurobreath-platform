import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { buddyAsk } from '@/lib/buddy/server/ask';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type LogLevel = 'info' | 'warn' | 'error';

function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function shouldSampleInfo(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const raw = process.env.BUDDY_OBS_SAMPLE_RATE;
  const rate = raw ? Number.parseFloat(raw) : 0.1;
  const clamped = Number.isFinite(rate) ? Math.max(0, Math.min(1, rate)) : 0.1;
  return Math.random() < clamped;
}

function logJson(level: LogLevel, payload: Record<string, unknown>) {
  // JSON lines for easy ingestion; avoid raw question text.
  const line = JSON.stringify({ ts: new Date().toISOString(), level, ...payload });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

interface RequestPayload {
  question?: string;
  intentId?: string;
  pathname?: string;
  locale?: string;
  // Optional, non-identifying client-side snapshot for personalization
  userSnapshot?: unknown;
  jurisdiction?: 'UK' | 'US' | 'EU';

  // Back-compat
  query?: string;
}

function toSafeNumber(input: unknown): number | undefined {
  const n = typeof input === 'number' ? input : Number.parseInt(String(input || ''), 10);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(0, Math.min(10_000, n));
}

function toSafeStringArray(input: unknown, max = 12): string[] | undefined {
  if (!Array.isArray(input)) return undefined;
  const out = input
    .map((x) => String(x || '').trim())
    .filter(Boolean)
    .slice(0, max);
  return out.length ? out : undefined;
}

function sanitizeUserSnapshot(input: unknown): Record<string, unknown> | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const raw = input as Record<string, unknown>;

  const focusGardenRaw = raw.focusGarden;
  const focusGarden = focusGardenRaw && typeof focusGardenRaw === 'object'
    ? {
        conditions: toSafeStringArray((focusGardenRaw as Record<string, unknown>).conditions, 8),
        minutesPerDay: toSafeNumber((focusGardenRaw as Record<string, unknown>).minutesPerDay),
        hasWeeklyPlan: typeof (focusGardenRaw as Record<string, unknown>).hasWeeklyPlan === 'boolean'
          ? (focusGardenRaw as Record<string, unknown>).hasWeeklyPlan
          : undefined,
      }
    : undefined;

  const safe: Record<string, unknown> = {
    role: typeof raw.role === 'string' ? raw.role : undefined,
    savedItemsCount: toSafeNumber(raw.savedItemsCount),
    routineSlotsCount: toSafeNumber(raw.routineSlotsCount),
    activeJourneysCount: toSafeNumber(raw.activeJourneysCount),
    topTags: toSafeStringArray(raw.topTags, 8),
    focusGarden,
  };

  // Remove empty focusGarden.
  if (focusGarden && !focusGarden.conditions && typeof focusGarden.minutesPerDay !== 'number' && typeof focusGarden.hasWeeklyPlan !== 'boolean') {
    delete safe.focusGarden;
  }

  const hasAny = Object.values(safe).some((v) => v !== undefined);
  return hasAny ? safe : undefined;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as RequestPayload | null;
  const raw = String(body?.question || body?.query || '').trim();

  const requestId = crypto.randomUUID();
  const questionHash = sha256Hex(raw);
  const questionLength = raw.length;

  if (!raw) {
    return NextResponse.json(
      {
        error: 'Missing question',
      },
      { status: 400 }
    );
  }

  try {
    const result = await buddyAsk(
      req,
      {
        question: raw,
        intentId: typeof body?.intentId === 'string' ? body.intentId : undefined,
        pathname: body?.pathname,
        jurisdiction: body?.jurisdiction,
        userSnapshot: sanitizeUserSnapshot(body?.userSnapshot),
      },
      { requestId }
    );

    // Structured observability log (sampled in production).
    const warnings = result.meta.warnings || [];
    const logPayload = {
      msg: 'buddy.ask',
      requestId,
      pathname: body?.pathname,
      jurisdiction: body?.jurisdiction,
      question: {
        hash: questionHash,
        length: questionLength,
        intentClass: result.meta.intentClass,
      },
      decision: {
        internalCoverage: result.meta.internalCoverage,
        usedInternal: result.meta.usedInternal,
        usedExternal: result.meta.usedExternal,
        usedProviders: result.meta.usedProviders,
      },
      cache: result.meta.cache,
      linkValidation: result.meta.verifiedLinks,
      timingsMs: result.meta.timingsMs,
      warnings,
      dev: process.env.NODE_ENV !== 'production' ? result.meta.dev : undefined,
    };

    if (warnings.length > 0) {
      logJson('warn', logPayload);
    } else if (shouldSampleInfo()) {
      logJson('info', logPayload);
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logJson('error', {
      msg: 'buddy.ask.error',
      requestId,
      pathname: body?.pathname,
      jurisdiction: body?.jurisdiction,
      question: { hash: questionHash, length: questionLength },
      error: { message },
    });

    return NextResponse.json({ error: 'Buddy request failed', requestId }, { status: 500 });
  }
}
