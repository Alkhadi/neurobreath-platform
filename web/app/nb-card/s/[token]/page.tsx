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

async function fetchShare(token: string): Promise<{
  token: string;
  cardModel: unknown;
  pngUrl: string | null;
  pdfUrl: string | null;
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
    return res.json() as Promise<{
      token: string;
      cardModel: unknown;
      pngUrl: string | null;
      pdfUrl: string | null;
    }>;
  } catch {
    return null;
  }
}

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

  // Use the token-backed OG route so social platforms always get a personalized
  // preview image, even when pngUrl has not yet been generated.
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const ogImageUrl = `${baseUrl}/api/og/nb-card?token=${encodeURIComponent(token)}`;

  return {
    title,
    description: "View and download this digital business card.",
    openGraph: {
      title,
      description: "View and download this digital business card.",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImageUrl],
    },
  };
}

export default async function NbCardSharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const share = await fetchShare(token);

  if (!share) notFound();

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
          pngUrl={share.pngUrl}
          pdfUrl={share.pdfUrl}
        />

        <div className="text-center mt-8 text-xs text-gray-400">
          <p>
            Create your own digital card at{" "}
            <Link href="/resources/nb-card" className="text-purple-500 hover:underline">
              NB-Card
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
