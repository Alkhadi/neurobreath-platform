/**
 * OG Image for NB-Card share links
 *
 * GET /api/og/nb-card
 * GET /api/og/nb-card?token=<token>
 *
 * Without a token: returns a generic 1200×630 NB-Card branded image.
 * With a token: fetches the NbCardShare snapshot and renders a personalized
 * card preview with the holder's name, job title, and contact details.
 *
 * Used as og:image / twitter:image for /nb-card/s/[token] share pages so
 * that social platform link previews are always token-backed and personalized.
 *
 * No secrets evaluated at import time — safe for next build.
 */

import { type NextRequest } from "next/server";
import {
  createGenericNbCardPreviewImage,
  createNbCardPreviewImage,
} from "@/lib/nbcard/share/previewImage";

// ---------------------------------------------------------------------------
// Share snapshot fetcher
// ---------------------------------------------------------------------------

async function fetchShareSnapshot(token: string): Promise<{
  cardModel: unknown;
  pngUrl: string | null;
} | null> {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(
      `${baseUrl}/api/nb-card/share?token=${encodeURIComponent(token)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json() as Promise<{ cardModel: unknown; pngUrl: string | null }>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return createGenericNbCardPreviewImage();
  }

  const share = await fetchShareSnapshot(token);
  if (!share) {
    return createGenericNbCardPreviewImage();
  }

  return createNbCardPreviewImage(share.cardModel);
}
