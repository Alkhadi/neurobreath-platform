/**
 * /nb-card/s/[token] -- Universal QR Share Page
 *
 * SERVER component: fetches CardModel from share API, renders via
 * SharePageClient for download actions.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SharePageClient from "./SharePageClient";

// ---------------------------------------------------------------------------
// Share data fetcher
// ---------------------------------------------------------------------------

type ShareData = {
  token: string;
  cardModel: unknown;
  pngUrl: string | null;
  pdfUrl: string | null;
  /** True when any preview image is available (S3 pngUrl or DB bytes) */
  hasPreview: boolean;
};

async function fetchShare(token: string): Promise<ShareData | null> {
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
    return res.json() as Promise<ShareData>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const share = await fetchShare(token);
  if (!share) return { title: "Card not found -- NB-Card" };

  const cardModel = share.cardModel as Record<string, unknown>;
  const profile = (cardModel.profile ?? {}) as Record<string, unknown>;
  const name =
    typeof profile.fullName === "string" ? profile.fullName : "NB-Card";
  const title = `${name}'s Digital Card`;

  const baseUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // Point social platforms at the canonical preview endpoint.
  // This serves the real preview PNG (S3 or DB) when available,
  // falling back to the personalized branded OG card otherwise.
  const previewUrl = `${baseUrl}/api/nb-card/share/preview?token=${encodeURIComponent(token)}`;

  return {
    title,
    description: "View and download this digital business card.",
    openGraph: {
      title,
      description: "View and download this digital business card.",
      images: [{ url: previewUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [previewUrl],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function NbCardSharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await fetchShare(token);

  if (!share) notFound();

  const baseUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // Compute the best preview image URL to pass to the viewer.
  // Priority: pngUrl (S3, most efficient) -> preview endpoint (DB bytes)
  // The viewer shows this as <img> with a layer-reconstruction fallback.
  const previewImageUrl: string | null =
    share.pngUrl ??
    (share.hasPreview
      ? `${baseUrl}/api/nb-card/share/preview?token=${encodeURIComponent(token)}`
      : null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Digital Business Card
          </h1>
          <p className="text-sm text-gray-500 mt-1">Powered by NB-Card</p>
        </div>

        <SharePageClient
          token={token}
          cardModel={share.cardModel}
          pngUrl={previewImageUrl}
          pdfUrl={share.pdfUrl}
        />

        <div className="text-center mt-8 text-xs text-gray-400">
          <p>
            Create your own digital card at{" "}
            <Link
              href="/resources/nb-card"
              className="text-purple-500 hover:underline"
            >
              NB-Card
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
