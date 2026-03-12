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
  isPublic: boolean;
  expiresAt: Date | null;
  previewPngBytes: Buffer | null;
  previewPngMimeType: string | null;
  /** "pending" | "ready" | "failed" | null */
  previewStatus: string | null;
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
        previewStatus: true,
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
        // Immutable since preview bytes don't change once generated
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  // Priority 3: branded fallback — cache aggressively for failed previews,
  // but keep short for pending so social crawlers retry when preview arrives.
  const isPending = record.previewStatus === "pending";
  return brandedFallback(req, token, isPending);
}

// ---------------------------------------------------------------------------
// Branded fallback helper
// ---------------------------------------------------------------------------

/**
 * Redirect to the branded OG fallback.
 *
 * @param pending  When true (preview still being generated), send a short
 *                 cache TTL so crawlers check back soon for the real image.
 *                 When false/absent, allow a longer cache to avoid hammering
 *                 the OG route for shares that permanently have no preview.
 */
function brandedFallback(
  req: NextRequest,
  token?: string,
  pending?: boolean
): Response {
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
    headers: {
      // pending: short TTL so crawlers retry — real preview may arrive soon
      // ready/failed/null: longer TTL — fewer unnecessary fallback requests
      "Cache-Control": pending
        ? "public, max-age=60, s-maxage=60"
        : "public, max-age=3600, s-maxage=3600",
    },
  });
}
