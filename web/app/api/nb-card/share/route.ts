/**
 * POST /api/nb-card/share
 *
 * Creates a tokenised share snapshot and returns the share token + URL.
 *
 * Request body:
 * {
 *   cardModel:         CardModel — sanitised card data
 *   pngUrl?:           string   — S3/R2 URL when object storage succeeded
 *   previewPngBase64?: string   — raw PNG as base64 when S3 is unavailable
 *   pdfUrl?:           string   — pre-uploaded PDF URL (optional)
 *   deviceId?:         string   — anonymous device id
 * }
 *
 * Response: { token: string; shareUrl: string }
 *
 * GET /api/nb-card/share?token=<token>
 *
 * Fetches an existing share record.
 *
 * Response: { token, cardModel, pngUrl, pdfUrl, hasPreview }
 */

import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma, isDbDown } from "@/lib/db";
import {
  preparePreviewPersistenceFromBytes,
  renderNbCardPreviewToBuffer,
} from "@/lib/nbcard/share/previewPersistence";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Max raw PNG size we will store in the DB (~1 MB of raw bytes).
// base64 overhead ≈ 4/3, so 1.4 M chars encodes ~1.05 MB of bytes.
const MAX_PREVIEW_BYTES = 1_048_576; // 1 MB
const MAX_PREVIEW_B64_CHARS = 1_400_000;

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const ShareRequestSchema = z.object({
  cardModel: z.record(z.string(), z.unknown()),
  pngUrl: z.string().url().optional(),
  /** Raw PNG bytes encoded as base64 — DB-backed fallback when S3 unavailable */
  previewPngBase64: z.string().max(MAX_PREVIEW_B64_CHARS).optional(),
  pdfUrl: z.string().url().optional(),
  deviceId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Prisma type stubs — avoids relying on generated types at build time
// ---------------------------------------------------------------------------

type NbCardShareCreateData = {
  cardModelJson: Record<string, unknown>;
  pngUrl?: string | null;
  pdfUrl?: string | null;
  ownerEmail?: string | null;
  ownerDeviceId?: string | null;
  expiresAt: Date;
  previewPngBytes?: Buffer | null;
  previewPngMimeType?: string | null;
  previewPngWidth?: number | null;
  previewPngHeight?: number | null;
  previewGeneratedAt?: Date | null;
  previewSha256?: string | null;
  previewStatus?: string | null;
  previewError?: string | null;
  previewAttemptCount?: number;
  previewLastTriedAt?: Date | null;
};

type NbCardShareRecord = {
  token: string;
  cardModelJson: unknown;
  pngUrl: string | null;
  pdfUrl: string | null;
  isPublic: boolean;
  expiresAt: Date | null;
  previewPngBytes: Buffer | null;
  previewStatus: string | null;
};

type NbCardShareDb = {
  create(args: { data: NbCardShareCreateData }): Promise<{ token: string }>;
  findUnique(args: {
    where: { token: string };
    select: Record<string, boolean>;
  }): Promise<NbCardShareRecord | null>;
};

function db(): { nbCardShare: NbCardShareDb } {
  return prisma as unknown as { nbCardShare: NbCardShareDb };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ShareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cardModel, pngUrl, previewPngBase64, pdfUrl, deviceId } =
    parsed.data;

  const session = await getServerSession(authOptions).catch(() => null);
  const ownerEmail = session?.user?.email ?? null;
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  if (isDbDown()) {
    return NextResponse.json(
      { error: "Share service temporarily unavailable.", degraded: true },
      { status: 503 }
    );
  }

  // Decode and validate DB-backed preview bytes (only when pngUrl is absent)
  let previewFields: Partial<NbCardShareCreateData> = {};
  if (!pngUrl && previewPngBase64) {
    const bytes = Buffer.from(previewPngBase64, "base64");
    if (bytes.length > 0 && bytes.length <= MAX_PREVIEW_BYTES) {
      previewFields = await preparePreviewPersistenceFromBytes({
        token: randomUUID(),
        bytes,
      });
    }
  }

  if (!pngUrl && !previewFields.previewPngBytes) {
    const attemptedAt = new Date();
    try {
      const bytes = await renderNbCardPreviewToBuffer(cardModel);
      if (bytes.length > 0 && bytes.length <= MAX_PREVIEW_BYTES) {
        previewFields = await preparePreviewPersistenceFromBytes({
          token: randomUUID(),
          bytes,
          generatedAt: attemptedAt,
        });
      } else {
        previewFields = {
          previewStatus: "failed",
          previewError: "Server-generated preview exceeded storage limits.",
          previewLastTriedAt: attemptedAt,
        };
      }
    } catch (err) {
      previewFields = {
        previewStatus: "failed",
        previewError:
          err instanceof Error ? err.message : "Server preview generation failed.",
        previewLastTriedAt: attemptedAt,
      };
    }
  }

  // Determine initial preview lifecycle state
  const hasPreviewNow = !!(pngUrl || previewFields.previewPngBytes);
  const previewStatus = hasPreviewNow
    ? "ready"
    : (previewFields.previewStatus ?? "pending");
  const previewAttemptCount = hasPreviewNow || previewStatus === "failed" ? 1 : 0;

  try {
    const record = await db().nbCardShare.create({
      data: {
        cardModelJson: cardModel,
        pngUrl: pngUrl ?? null,
        pdfUrl: pdfUrl ?? null,
        ownerEmail: ownerEmail ?? null,
        ownerDeviceId: deviceId ?? null,
        expiresAt,
        previewStatus,
        previewAttemptCount,
        ...previewFields,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? req.nextUrl.origin;
    const shareUrl = `${baseUrl}/nb-card/s/${record.token}`;

    return NextResponse.json({ token: record.token, shareUrl });
  } catch (err) {
    console.error("[nb-card/share] DB error:", err);
    return NextResponse.json(
      { error: "Could not create share link. Please try again." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token is required." }, { status: 400 });
  }

  if (isDbDown()) {
    return NextResponse.json(
      { error: "Share service temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    const record = await db().nbCardShare.findUnique({
      where: { token },
      select: {
        token: true,
        cardModelJson: true,
        pngUrl: true,
        pdfUrl: true,
        isPublic: true,
        expiresAt: true,
        previewStatus: true,
        // Only fetch existence flag — never send raw bytes to browser
        previewPngBytes: true,
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Share not found." }, { status: 404 });
    }

    if (record.expiresAt && record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This share link has expired." },
        { status: 410 }
      );
    }

    if (!record.isPublic) {
      return NextResponse.json(
        { error: "Share not accessible." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      token: record.token,
      cardModel: record.cardModelJson,
      pngUrl: record.pngUrl,
      pdfUrl: record.pdfUrl,
      /** True when any preview image is available (S3 URL or DB bytes) */
      hasPreview: !!(record.pngUrl || record.previewPngBytes),
      /** "pending" | "ready" | "failed" | null */
      previewStatus: record.previewStatus,
    });
  } catch (err) {
    console.error("[nb-card/share] GET error:", err);
    return NextResponse.json(
      { error: "Could not fetch share." },
      { status: 500 }
    );
  }
}
