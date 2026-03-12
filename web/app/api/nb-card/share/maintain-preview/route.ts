/**
 * POST /api/nb-card/share/maintain-preview
 *
 * Maintenance job for NbCardShare preview storage lifecycle.
 * Protected by NB_INTERNAL_SECRET — call from your deployment pipeline,
 * a scheduled cron trigger (e.g. Vercel Cron, GitHub Actions, etc.), or
 * manually via curl:
 *
 *   curl -X POST https://your-host/api/nb-card/share/maintain-preview \
 *     -H "x-internal-secret: <NB_INTERNAL_SECRET>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"action":"promote"}'
 *
 * Actions:
 *
 *   promote  — when S3/R2 is now configured, upload DB-backed preview bytes
 *              to object storage, set pngUrl, clear previewPngBytes.
 *              Prevents DB from becoming a permanent storage sink.
 *
 *   prune    — clear previewPngBytes from expired or failed shares to
 *              reclaim DB space. Active shares are never touched.
 *
 *   all      — run promote then prune (recommended for scheduled jobs).
 *
 * Request body: { action: "promote" | "prune" | "all", batchSize?: number }
 * Response:     { ok: true, promoted: N, pruned: N, errors: N }
 *
 * No-auth-header → 401 (safe to expose the URL; secret guards access).
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbDown } from "@/lib/db";
import { isStorageConfigured } from "@/lib/aws-config";
import { uploadBufferToS3Direct } from "@/lib/s3";
import { z } from "zod";

export const dynamic = "force-dynamic";

const DEFAULT_BATCH = 50;
const MAX_BATCH = 200;

const RequestSchema = z.object({
  action: z.enum(["promote", "prune", "all"]),
  batchSize: z.number().int().min(1).max(MAX_BATCH).optional(),
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function isInternalRequest(req: NextRequest): boolean {
  const secret = process.env.NB_INTERNAL_SECRET;
  if (!secret) return false;
  return req.headers.get("x-internal-secret") === secret;
}

// ---------------------------------------------------------------------------
// Prisma type stubs
// ---------------------------------------------------------------------------

type PromotionCandidate = {
  token: string;
  previewPngBytes: Buffer;
  previewPngMimeType: string | null;
  previewSha256: string | null;
};

type PruneCandidate = {
  token: string;
};

function db() {
  return prisma as unknown as {
    nbCardShare: {
      findMany(args: {
        where: Record<string, unknown>;
        select: Record<string, boolean>;
        take: number;
      }): Promise<PromotionCandidate[] | PruneCandidate[]>;
      update(args: {
        where: { token: string };
        data: Record<string, unknown>;
      }): Promise<{ token: string }>;
    };
  };
}

// ---------------------------------------------------------------------------
// Promote: DB bytes → S3
// ---------------------------------------------------------------------------

async function promoteToObjectStorage(
  batchSize: number
): Promise<{ promoted: number; errors: number }> {
  if (!isStorageConfigured()) {
    // Nothing to do — object storage not available
    return { promoted: 0, errors: 0 };
  }

  // Find shares with DB-backed preview bytes that haven't been promoted
  const candidates = (await db().nbCardShare.findMany({
    where: {
      previewPngBytes: { not: null },
      pngUrl: null,
      // Only promote "ready" shares (bytes were successfully stored)
      previewStatus: "ready",
    },
    select: {
      token: true,
      previewPngBytes: true,
      previewPngMimeType: true,
      previewSha256: true,
    },
    take: batchSize,
  })) as PromotionCandidate[];

  let promoted = 0;
  let errors = 0;

  for (const share of candidates) {
    try {
      const s3Url = await uploadBufferToS3Direct(
        share.previewPngBytes,
        `nb-card-preview-${share.token}.png`,
        share.previewPngMimeType ?? "image/png"
      );

      if (!s3Url) {
        errors++;
        continue;
      }

      await db().nbCardShare.update({
        where: { token: share.token },
        data: {
          pngUrl: s3Url,
          // Clear DB bytes now that S3 holds the canonical copy
          previewPngBytes: null,
          previewPngMimeType: null,
        },
      });

      promoted++;
    } catch (err) {
      console.error(
        `[maintain-preview] promote failed for token ${share.token}:`,
        err
      );
      errors++;
    }
  }

  return { promoted, errors };
}

// ---------------------------------------------------------------------------
// Prune: clear bytes from expired / permanently failed shares
// ---------------------------------------------------------------------------

async function pruneStalePreviewBytes(
  batchSize: number
): Promise<{ pruned: number; errors: number }> {
  const now = new Date();

  // Prune candidates:
  // 1. Expired shares (expiresAt < now) — their previews will never be served
  // 2. Permanently failed shares older than 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const candidates = (await db().nbCardShare.findMany({
    where: {
      previewPngBytes: { not: null },
      OR: [
        // Expired shares
        { expiresAt: { lt: now } },
        // Failed shares that haven't been retried in 30 days
        {
          previewStatus: "failed",
          previewLastTriedAt: { lt: thirtyDaysAgo },
        },
      ],
    },
    select: { token: true },
    take: batchSize,
  })) as PruneCandidate[];

  let pruned = 0;
  let errors = 0;

  for (const share of candidates) {
    try {
      await db().nbCardShare.update({
        where: { token: share.token },
        data: {
          previewPngBytes: null,
          previewPngMimeType: null,
          previewPngWidth: null,
          previewPngHeight: null,
        },
      });
      pruned++;
    } catch (err) {
      console.error(
        `[maintain-preview] prune failed for token ${share.token}:`,
        err
      );
      errors++;
    }
  }

  return { pruned, errors };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isInternalRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorised. Provide x-internal-secret header." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, batchSize = DEFAULT_BATCH } = parsed.data;

  if (isDbDown()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 }
    );
  }

  let totalPromoted = 0;
  let totalPruned = 0;
  let totalErrors = 0;

  try {
    if (action === "promote" || action === "all") {
      const { promoted, errors } = await promoteToObjectStorage(batchSize);
      totalPromoted += promoted;
      totalErrors += errors;
    }

    if (action === "prune" || action === "all") {
      const { pruned, errors } = await pruneStalePreviewBytes(batchSize);
      totalPruned += pruned;
      totalErrors += errors;
    }
  } catch (err) {
    console.error("[maintain-preview] unexpected error:", err);
    return NextResponse.json(
      { error: "Maintenance job encountered an unexpected error." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    action,
    promoted: totalPromoted,
    pruned: totalPruned,
    errors: totalErrors,
    storageConfigured: isStorageConfigured(),
  });
}
