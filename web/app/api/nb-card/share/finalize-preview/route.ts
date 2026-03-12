/**
 * POST /api/nb-card/share/finalize-preview
 *
 * Stores or generates a preview PNG for a share that was created without one
 * (previewStatus = "pending") or needs a retry after a failed attempt.
 *
 * This is the fallback path when the initial offscreen capture in
 * createServerShareFromProfile fails. Callers may either submit raw PNG bytes,
 * or omit them and let the server render the preview directly from the stored
 * CardModel snapshot.
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
 *   imageBase64?:  string   — raw PNG encoded as base64 (max 1.4 M chars)
 *   deviceId?:     string   — anonymous device id (for owner check)
 * }
 *
 * Response: { ok: true, previewStatus: "ready" }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma, isDbDown } from "@/lib/db";
import { z } from "zod";
import {
  preparePreviewPersistenceFromBytes,
  renderNbCardPreviewToBuffer,
} from "@/lib/nbcard/share/previewPersistence";

export const dynamic = "force-dynamic";

const MAX_B64_CHARS = 1_400_000;
const MAX_BYTES = 1_048_576; // 1 MB

const RequestSchema = z.object({
  token: z.string().min(1),
  imageBase64: z.string().max(MAX_B64_CHARS).optional(),
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

// ---------------------------------------------------------------------------
// Prisma type stubs
// ---------------------------------------------------------------------------

type ShareRecord = {
  cardModelJson: Record<string, unknown>;
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
      cardModelJson: true,
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

  const now = new Date();

  let bytes: Buffer;
  if (imageBase64) {
    bytes = Buffer.from(imageBase64, "base64");
    if (bytes.length === 0 || bytes.length > MAX_BYTES) {
      return NextResponse.json(
        { error: `Preview image must be between 1 B and ${MAX_BYTES} bytes.` },
        { status: 400 }
      );
    }
  } else {
    try {
      bytes = await renderNbCardPreviewToBuffer(share.cardModelJson);
    } catch (err) {
      await db().nbCardShare.update({
        where: { token },
        data: {
          previewStatus: "failed",
          previewError:
            err instanceof Error ? err.message : "Server preview generation failed.",
          previewLastTriedAt: now,
          previewAttemptCount: { increment: 1 },
        },
      });

      return NextResponse.json(
        { error: "Could not generate preview." },
        { status: 500 }
      );
    }

    if (bytes.length === 0 || bytes.length > MAX_BYTES) {
      await db().nbCardShare.update({
        where: { token },
        data: {
          previewStatus: "failed",
          previewError: "Server-generated preview exceeded storage limits.",
          previewLastTriedAt: now,
          previewAttemptCount: { increment: 1 },
        },
      });

      return NextResponse.json(
        { error: `Generated preview exceeded ${MAX_BYTES} bytes.` },
        { status: 500 }
      );
    }
  }

  const updateData = {
    ...(await preparePreviewPersistenceFromBytes({
      token,
      bytes,
      generatedAt: now,
    })),
    previewAttemptCount: { increment: 1 },
  };

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
