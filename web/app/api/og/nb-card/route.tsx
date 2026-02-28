/**
 * OG Image for NB-Card share links
 *
 * GET /api/og/nb-card
 *
 * Returns a 1200×630 branded card image used as og:image when NB-Card share
 * links are previewed in WhatsApp, Twitter, iMessage, etc.
 *
 * No secrets evaluated at import time — safe for next build.
 */

import { ImageResponse } from "next/og";

export async function GET() {
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
