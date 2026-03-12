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

import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

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
// Category label helper
// ---------------------------------------------------------------------------

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    personal: "Personal Card",
    business: "Business Card",
    address: "Address Card",
    bank: "Payment Details",
    flyer: "Digital Flyer",
    wedding: "Wedding Card",
  };
  return labels[category] ?? "Digital Card";
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return genericOgImage();
  }

  const share = await fetchShareSnapshot(token);
  if (!share) {
    return genericOgImage();
  }

  const card = share.cardModel as Record<string, unknown>;
  const profile = ((card.profile ?? {}) as Record<string, unknown>);
  const category =
    typeof card.category === "string" ? card.category : "personal";

  const name =
    typeof profile.fullName === "string" ? profile.fullName : "";
  const jobTitle =
    typeof profile.jobTitle === "string" ? profile.jobTitle : "";
  const phone = typeof profile.phone === "string" ? profile.phone : "";
  const email = typeof profile.email === "string" ? profile.email : "";
  const categoryLabel = getCategoryLabel(category);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
        }}
      >
        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            flex: 1,
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: "flex",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 24,
                padding: "6px 20px",
                fontSize: 22,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: 0.5,
              }}
            >
              {categoryLabel}
            </div>
          </div>

          {/* Name — primary identity */}
          {name ? (
            <div
              style={{
                fontSize: name.length > 20 ? 60 : 72,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 14,
                letterSpacing: -1,
              }}
            >
              {name}
            </div>
          ) : (
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 14,
              }}
            >
              NB-Card
            </div>
          )}

          {/* Job title */}
          {jobTitle && (
            <div
              style={{
                fontSize: 34,
                color: "rgba(255,255,255,0.72)",
                marginBottom: 36,
                lineHeight: 1.2,
              }}
            >
              {jobTitle}
            </div>
          )}

          {/* Contact details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {email && (
              <div style={{ fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
                {email}
              </div>
            )}
            {phone && (
              <div style={{ fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
                {phone}
              </div>
            )}
          </div>
        </div>

        {/* Right branding panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "48px 60px",
            minWidth: 220,
          }}
        >
          {/* Divider line (visual) */}
          <div
            style={{
              width: 1,
              height: "100%",
              background: "rgba(255,255,255,0.1)",
              position: "absolute",
              left: "78%",
              top: 0,
            }}
          />

          {/* CTA pill — top */}
          <div
            style={{
              display: "flex",
              padding: "10px 24px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 0.3,
            }}
          >
            Tap to view
          </div>

          {/* Branding — bottom */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: 0.5,
              }}
            >
              POWERED BY
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: -0.5,
              }}
            >
              NB-Card
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// ---------------------------------------------------------------------------
// Generic fallback (no token)
// ---------------------------------------------------------------------------

function genericOgImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
        }}
      >
        {/* Brand name */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          NB-Card
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 38,
            opacity: 0.88,
            marginTop: 28,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Digital Business Card
        </div>

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            marginTop: 64,
            padding: "20px 56px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.22)",
            fontSize: 28,
            letterSpacing: 0.5,
          }}
        >
          Tap to view full card with background
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
