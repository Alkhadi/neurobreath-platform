/**
 * GET /api/nb-card/share/preview?token=<token>
 *
 * Canonical token-backed preview image endpoint.
 *
 * Serving priority:
 *   1. pngUrl  — redirect to object storage URL (S3/R2)
 *   2. previewPngBytes — stream DB-backed PNG bytes directly
 *   3. Fallback — redirect to branded /api/og/nb-card?token=<token>
 *
 * Used as the og:image / twitter:image source for share pages so social
 * platforms always receive the real preview PNG when available, and a
 * meaningful branded fallback otherwise.
 *
 * No auth required — shares are public by design.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma, isDbDown } from "@/lib/db";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Prisma type stub
// ---------------------------------------------------------------------------

type PreviewRecord = {
  pngUrl: string | null;
  pdfUrl: string | null;
  isPublic: boolean;
  expiresAt: Date | null;
  previewPngBytes: Buffer | null;
  previewPngMimeType: string | null;
};

function db() {
  return prisma as unknown as {
    nbCardShare: {
      findUnique(args: {
        where: { token: string };
        select: Record<string, boolean>;
      }): Promise<PreviewRecord | null>;
    };
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return brandedFallback(req);
  }

  if (isDbDown()) {
    return brandedFallback(req, token);
  }

  let record: PreviewRecord | null = null;
  try {
    record = await db().nbCardShare.findUnique({
      where: { token },
      select: {
        pngUrl: true,
        isPublic: true,
        expiresAt: true,
        previewPngBytes: true,
        previewPngMimeType: true,
      },
    });
  } catch {
    return brandedFallback(req, token);
  }

  if (!record || !record.isPublic) {
    return brandedFallback(req, token);
  }

  if (record.expiresAt && record.expiresAt < new Date()) {
    return brandedFallback(req, token);
  }

  // Priority 1: object storage URL — redirect (browser/crawlers follow 302)
  if (record.pngUrl) {
    return NextResponse.redirect(record.pngUrl, {
      status: 302,
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  // Priority 2: DB-backed bytes — stream directly
  if (record.previewPngBytes && record.previewPngBytes.length > 0) {
    return new Response(record.previewPngBytes, {
      status: 200,
      headers: {
        "Content-Type": record.previewPngMimeType ?? "image/png",
        "Content-Length": String(record.previewPngBytes.length),
        // Immutable since preview bytes don't change after generation
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  // Priority 3: branded fallback
  return brandedFallback(req, token);
}

// ---------------------------------------------------------------------------
// Branded fallback helper
// ---------------------------------------------------------------------------

function brandedFallback(req: NextRequest, token?: string): Response {
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : req.nextUrl.origin);

  const fallbackUrl = token
    ? `${baseUrl}/api/og/nb-card?token=${encodeURIComponent(token)}`
    : `${baseUrl}/api/og/nb-card`;

  return NextResponse.redirect(fallbackUrl, {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
