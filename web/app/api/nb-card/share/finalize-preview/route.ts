/**
 * POST /api/nb-card/share/finalize-preview
 *
 * Late-submission endpoint: stores a preview PNG for a share that was
 * created without one (previewStatus = "pending").
 *
 * This is the reliable fallback path when the initial offscreen capture
 * in createServerShareFromProfile fails — the client can retry capture
 * and submit the resulting PNG here.
 *
 * Auth (one of):
 *   - x-internal-secret: <NB_INTERNAL_SECRET>   (server-to-server / admin)
 *   - Session email matches ownerEmail           (signed-in owner)
 *   - deviceId in body matches ownerDeviceId     (anonymous owner)
 *
 * Will NOT overwrite an existing "ready" preview — idempotent.
 *
 * Request body:
 * {
 *   token:         string   — share token
 *   imageBase64:   string   — raw PNG encoded as base64 (max 1.4 M chars)
 *   deviceId?:     string   — anonymous device id (for owner check)
 * }
 *
 * Response: { ok: true, previewStatus: "ready" }
 */

import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma, isDbDown } from "@/lib/db";
import { z } from "zod";
import { isStorageConfigured } from "@/lib/aws-config";
import { uploadBufferToS3Direct } from "@/lib/s3";

export const dynamic = "force-dynamic";

const MAX_B64_CHARS = 1_400_000;
const MAX_BYTES = 1_048_576; // 1 MB

const RequestSchema = z.object({
  token: z.string().min(1),
  imageBase64: z.string().max(MAX_B64_CHARS),
  deviceId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function isInternalRequest(req: NextRequest): boolean {
  const secret = process.env.NB_INTERNAL_SECRET;
  if (!secret) return false;
  return req.headers.get("x-internal-secret") === secret;
}

/** Extract PNG dimensions from a Buffer by reading the IHDR chunk. */
function getPngDimensions(
  buf: Buffer
): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (buf[0] !== 137 || buf[1] !== 80 || buf[2] !== 78) return null;
  try {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Prisma type stubs
// ---------------------------------------------------------------------------

type ShareRecord = {
  ownerEmail: string | null;
  ownerDeviceId: string | null;
  pngUrl: string | null;
  previewPngBytes: Buffer | null;
  previewStatus: string | null;
  isPublic: boolean;
  expiresAt: Date | null;
};

function db() {
  return prisma as unknown as {
    nbCardShare: {
      findUnique(args: {
        where: { token: string };
        select: Record<string, boolean>;
      }): Promise<ShareRecord | null>;
      update(args: {
        where: { token: string };
        data: Record<string, unknown>;
      }): Promise<{ token: string }>;
    };
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
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

  const { token, imageBase64, deviceId } = parsed.data;

  if (isDbDown()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 }
    );
  }

  // Fetch the share record
  const share = await db().nbCardShare.findUnique({
    where: { token },
    select: {
      ownerEmail: true,
      ownerDeviceId: true,
      pngUrl: true,
      previewPngBytes: true,
      previewStatus: true,
      isPublic: true,
      expiresAt: true,
    },
  });

  if (!share) {
    return NextResponse.json({ error: "Share not found." }, { status: 404 });
  }

  if (share.expiresAt && share.expiresAt < new Date()) {
    return NextResponse.json({ error: "Share has expired." }, { status: 410 });
  }

  // Auth check — must be internal secret or verified owner
  const internal = isInternalRequest(req);
  if (!internal) {
    const session = await getServerSession(authOptions).catch(() => null);
    const callerEmail = session?.user?.email ?? null;

    const isEmailOwner =
      callerEmail && share.ownerEmail && callerEmail === share.ownerEmail;
    const isDeviceOwner =
      deviceId && share.ownerDeviceId && deviceId === share.ownerDeviceId;

    if (!isEmailOwner && !isDeviceOwner) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }
  }

  // Idempotent: don't overwrite an existing ready preview
  if (
    share.previewStatus === "ready" &&
    (share.pngUrl || share.previewPngBytes)
  ) {
    return NextResponse.json({ ok: true, previewStatus: "ready" });
  }

  // Decode and validate the PNG bytes
  const bytes = Buffer.from(imageBase64, "base64");
  if (bytes.length === 0 || bytes.length > MAX_BYTES) {
    return NextResponse.json(
      { error: `Preview image must be between 1 B and ${MAX_BYTES} bytes.` },
      { status: 400 }
    );
  }

  const dims = getPngDimensions(bytes);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const now = new Date();

  // Persist: try object storage first, fall back to DB bytes
  let updateData: Record<string, unknown>;

  if (isStorageConfigured()) {
    try {
      const s3Url = await uploadBufferToS3Direct(
        bytes,
        `nb-card-preview-${token}.png`,
        "image/png"
      );
      if (!s3Url) throw new Error("uploadBufferToS3Direct returned null");

      updateData = {
        pngUrl: s3Url,
        // Clear DB bytes after successful S3 promotion
        previewPngBytes: null,
        previewPngMimeType: null,
        previewStatus: "ready",
        previewGeneratedAt: now,
        previewSha256: sha256,
        previewPngWidth: dims?.width ?? null,
        previewPngHeight: dims?.height ?? null,
        previewLastTriedAt: now,
        previewAttemptCount: { increment: 1 },
      };
    } catch (uploadErr) {
      console.error("[finalize-preview] S3 upload failed, using DB:", uploadErr);
      updateData = {
        previewPngBytes: bytes,
        previewPngMimeType: "image/png",
        previewStatus: "ready",
        previewGeneratedAt: now,
        previewSha256: sha256,
        previewPngWidth: dims?.width ?? null,
        previewPngHeight: dims?.height ?? null,
        previewLastTriedAt: now,
        previewAttemptCount: { increment: 1 },
      };
    }
  } else {
    updateData = {
      previewPngBytes: bytes,
      previewPngMimeType: "image/png",
      previewStatus: "ready",
      previewGeneratedAt: now,
      previewSha256: sha256,
      previewPngWidth: dims?.width ?? null,
      previewPngHeight: dims?.height ?? null,
      previewLastTriedAt: now,
      previewAttemptCount: { increment: 1 },
    };
  }

  try {
    await db().nbCardShare.update({ where: { token }, data: updateData });
  } catch (err) {
    console.error("[finalize-preview] DB update failed:", err);
    return NextResponse.json(
      { error: "Could not save preview." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, previewStatus: "ready" });
}
