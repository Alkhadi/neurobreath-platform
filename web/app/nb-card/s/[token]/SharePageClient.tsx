"use client";

/**
 * SharePageClient.tsx -- Client component for the Universal QR share page.
 *
 * Handles:
 * - Displaying the card snapshot (PNG or a minimal text render if no PNG)
 * - Download PNG button (uses pre-generated pngUrl or triggers re-capture)
 * - Download PDF button (uses pre-generated pdfUrl or generates on-the-fly)
 * - Copy Text button (formatted plain-text summary)
 * - QR code for offline mode B (encodes share URL)
 */

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { CardModel } from "@/lib/nbcard/cardModel";
import { migrateCardModel } from "@/lib/nbcard/cardModel";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type SharePageClientProps = {
  token: string;
  cardModel: unknown;
  pngUrl: string | null;
  pdfUrl: string | null;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SharePageClient({
  token,
  cardModel: rawCardModel,
  pngUrl,
  pdfUrl,
}: SharePageClientProps) {
  const card = migrateCardModel(rawCardModel);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/nb-card/s/${token}`
      : `/nb-card/s/${token}`;

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);

  // Ref to the card preview div (used for on-the-fly capture)
  const previewRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Download PNG
  // ---------------------------------------------------------------------------

  async function handleDownloadPng() {
    setDownloading("png");
    try {
      if (pngUrl) {
        triggerDownload(pngUrl, "nb-card.png");
        return;
      }
      // Fallback: capture the preview element
      if (previewRef.current) {
        const { captureToBlob } = await import("@/lib/nbcard/export/capture");
        const blob = await captureToBlob(previewRef.current, { scale: 2 });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, "nb-card.png");
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) {
      console.error("PNG download failed:", err);
    } finally {
      setDownloading(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Download PDF
  // ---------------------------------------------------------------------------

  async function handleDownloadPdf() {
    setDownloading("pdf");
    try {
      if (pdfUrl) {
        triggerDownload(pdfUrl, "nb-card.pdf");
        return;
      }
      // Fallback: generate PDF on the fly from the preview element
      if (previewRef.current) {
        const { captureCardAsPdf } = await import(
          "@/lib/nbcard/export/generatePdfWithLinks"
        );
        const pdfBlob = await captureCardAsPdf(previewRef.current, "nb-card");
        const url = URL.createObjectURL(pdfBlob);
        triggerDownload(url, "nb-card.pdf");
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloading(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Copy text
  // ---------------------------------------------------------------------------

  async function handleCopyText() {
    const text = buildCardText(card);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: prompt
      window.prompt("Copy this text:", text);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const profile = card.profile ?? {};
  const social = card.social ?? {};
  // categoryData accessed via buildCardText helper below

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div
        ref={previewRef}
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background:
            card.style.backgroundPresetId
              ? undefined
              : "linear-gradient(135deg, #9333ea, #3b82f6)",
          fontFamily: card.style.fontFamily ?? "Inter, sans-serif",
        }}
      >
        {pngUrl ? (
          // Show pre-generated PNG if available
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pngUrl}
            alt="Your digital card"
            className="w-full rounded-2xl"
          />
        ) : (
          // Minimal text-based card render
          <div className="p-6 text-white min-h-48">
            {profile.fullName && (
              <p className="text-xl font-bold">{profile.fullName}</p>
            )}
            {profile.jobTitle && (
              <p className="text-sm opacity-80 mt-0.5">{profile.jobTitle}</p>
            )}
            {profile.phone && (
              <p className="text-sm mt-2">{profile.phone}</p>
            )}
            {profile.email && (
              <p className="text-sm">{profile.email}</p>
            )}
            {social.website && (
              <a
                href={social.website}
                className="text-sm underline block mt-1"
                target="_blank"
                rel="noopener noreferrer"
                data-link-id="link:website"
                data-link-url={social.website}
              >
                {social.website}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={handleDownloadPng}
          disabled={downloading === "png"}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          aria-label="Download card as PNG image"
        >
          {downloading === "png" ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <DownloadIcon />
          )}
          Download Image (PNG)
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={downloading === "pdf"}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-purple-600 text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all disabled:opacity-60"
          aria-label="Download card as PDF with active links"
        >
          {downloading === "pdf" ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full" />
          ) : (
            <PdfIcon />
          )}
          Download PDF (active links)
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all"
          aria-label="Copy card details as formatted text"
        >
          <CopyIcon />
          {copied ? "Copied!" : "Copy text"}
        </button>
      </div>

      {/* QR code (for re-sharing) */}
      <div className="rounded-2xl bg-white p-5 flex flex-col items-center gap-3 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700">Share this card</p>
        <QRCodeSVG
          value={shareUrl}
          size={160}
          level="M"
          includeMargin
        />
        <p className="text-xs text-gray-400 text-center break-all">{shareUrl}</p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl).catch(() => undefined);
            window.prompt("Share URL:", shareUrl);
          }}
          className="text-xs text-purple-600 hover:underline"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function buildCardText(card: CardModel): string {
  const lines: string[] = [];
  const p = card.profile ?? {};
  const s = card.social ?? {};
  const d = card.categoryData ?? {};

  if (p.fullName) lines.push(p.jobTitle ? `${p.fullName} — ${p.jobTitle}` : p.fullName);
  if (p.phone) lines.push(`Phone: ${p.phone}`);
  if (p.email) lines.push(`Email: ${p.email}`);
  if (s.website) lines.push(`Website: ${s.website}`);

  // Category-specific fields
  if (card.category === "address") {
    const addr = d as Record<string, unknown>;
    const addressParts = [
      addr.line1,
      addr.line2,
      addr.city,
      addr.postcode,
      addr.country,
    ].filter((v): v is string => typeof v === "string" && v.length > 0);
    if (addressParts.length) {
      lines.push("", "Address:", ...addressParts.map((x) => `  ${x}`));
    }
    if (typeof addr.directionsNote === "string" && addr.directionsNote) {
      lines.push(`Note: ${addr.directionsNote}`);
    }
    if (typeof addr.line1 === "string") {
      const dest = encodeURIComponent(
        [addr.line1, addr.city, addr.postcode, addr.country]
          .filter(Boolean)
          .join(", ")
      );
      lines.push(``, `Directions: https://www.google.com/maps/dir/?api=1&destination=${dest}`);
    }
  } else if (card.category === "bank") {
    const b = d as Record<string, unknown>;
    if (b.bankName) lines.push("", `Bank: ${b.bankName}`);
    if (b.accountName) lines.push(`Account Name: ${b.accountName}`);
    if (b.sortCode) lines.push(`Sort Code: ${b.sortCode}`);
    if (b.accountNumber) lines.push(`Account Number: ${b.accountNumber}`);
    if (b.iban) lines.push(`IBAN: ${b.iban}`);
    if (b.swift) lines.push(`SWIFT/BIC: ${b.swift}`);
  } else if (card.category === "business") {
    const biz = d as Record<string, unknown>;
    if (biz.companyName) lines.push("", `Company: ${biz.companyName}`);
    if (biz.services) lines.push(`Services: ${biz.services}`);
    if (biz.hours) lines.push(`Hours: ${biz.hours}`);
    if (biz.bookingLink) lines.push(`Book: ${biz.bookingLink}`);
  } else if (card.category === "flyer") {
    const fl = d as Record<string, unknown>;
    if (fl.headline) lines.push("", String(fl.headline));
    if (fl.subheadline) lines.push(String(fl.subheadline));
    if (fl.eventDate) lines.push(`Date: ${fl.eventDate}`);
    if (fl.location) lines.push(`Location: ${fl.location}`);
    if (fl.ctaUrl) lines.push(`${fl.ctaLabel ?? "More info"}: ${fl.ctaUrl}`);
  } else if (card.category === "wedding") {
    const w = d as Record<string, unknown>;
    if (w.coupleNames) lines.push("", String(w.coupleNames));
    if (w.date) lines.push(`Date: ${w.date}`);
    if (w.venue) lines.push(`Venue: ${w.venue}`);
    if (w.rsvpUrl) lines.push(`${w.rsvpLabel ?? "RSVP"}: ${w.rsvpUrl}`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Icon components (inline SVG to avoid icon library dependency)
// ---------------------------------------------------------------------------

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
