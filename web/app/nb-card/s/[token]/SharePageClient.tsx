"use client";

/**
 * SharePageClient.tsx -- Client component for the Universal QR share page.
 *
 * Rendering priority:
 *   1. pngUrl — pre-generated S3 PNG (full visual fidelity)
 *   2. Canvas layer render — serialized layers from CardModel.canvas.elements
 *   3. Minimal text/fallback render — for snapshots with no image or layers
 *
 * All share actions (PNG, PDF, copy-text, QR) remain fully functional.
 * Google Maps address links preserved via buildMapHref.
 */

import { useState, useRef, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { CardModel, CanvasElement } from "@/lib/nbcard/cardModel";
import { migrateCardModel } from "@/lib/nbcard/cardModel";
import { buildMapHref } from "@/lib/nbcard/mapHref";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SharePageClientProps = {
  token: string;
  cardModel: unknown;
  pngUrl: string | null;
  pdfUrl: string | null;
};

// ---------------------------------------------------------------------------
// Canvas layer renderer
// ---------------------------------------------------------------------------

/** Renders all canvas elements from CardModel.canvas.elements as absolute-
 *  positioned children inside a relative parent card container.
 *  Coordinates are percentages 0-100 of the parent's width/height.
 */
function CanvasLayerViewer({ elements }: { elements: CanvasElement[] }) {
  if (!elements || elements.length === 0) return null;
  const sorted = [...elements]
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  return (
    <>
      {sorted.map((el) => (
        <CanvasElementRenderer key={el.id} element={el} />
      ))}
    </>
  );
}

function CanvasElementRenderer({ element: el }: { element: CanvasElement }) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${el.x}%`,
    top: `${el.y}%`,
    width: `${el.w}%`,
    height: `${el.h}%`,
    transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
    zIndex: el.zIndex ?? 0,
    overflow: "hidden",
  };
  const s = (el.style ?? {}) as Record<string, unknown>;

  if (el.type === "text") {
    return (
      <div
        style={{
          ...baseStyle,
          fontSize: typeof s.fontSize === "number" ? `${s.fontSize}px` : "14px",
          fontFamily: typeof s.fontFamily === "string" ? s.fontFamily : "inherit",
          fontWeight: s.fontWeight === "bold" ? "bold" : "normal",
          textAlign: s.align === "center" ? "center" : s.align === "right" ? "right" : "left",
          color: typeof s.color === "string" ? s.color : "#000",
          backgroundColor: typeof s.backgroundColor === "string" ? s.backgroundColor : undefined,
          padding: typeof s.padding === "number" ? `${s.padding}px` : undefined,
          display: "flex",
          alignItems: "center",
          wordBreak: "break-word",
        }}
      >
        {el.linkUrl ? (
          <a href={el.linkUrl} target="_blank" rel="noopener noreferrer"
             style={{ color: "inherit", textDecoration: "underline", width: "100%" }}>
            {el.text ?? ""}
          </a>
        ) : (
          <span style={{ width: "100%" }}>{el.text ?? ""}</span>
        )}
      </div>
    );
  }

  if (el.type === "image" && el.imageRef) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={el.imageRef}
        alt=""
        style={{
          ...baseStyle,
          objectFit: s.fit === "contain" ? "contain" : "cover",
          borderRadius: typeof s.borderRadius === "number" ? `${s.borderRadius}px` : undefined,
          border: typeof s.borderWidth === "number" && s.borderWidth > 0 && typeof s.borderColor === "string"
            ? `${s.borderWidth}px solid ${s.borderColor}` : undefined,
        }}
      />
    );
  }

  if (el.type === "shape") {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: typeof s.fill === "string" ? s.fill : "transparent",
          border: typeof s.strokeWidth === "number" && s.strokeWidth > 0 && typeof s.stroke === "string"
            ? `${s.strokeWidth}px solid ${s.stroke}` : undefined,
          borderRadius: (s.shapeKind as string) === "circle"
            ? "50%"
            : typeof s.cornerRadius === "number" ? `${s.cornerRadius}px` : undefined,
          opacity: typeof s.opacity === "number" ? s.opacity : 1,
        }}
      />
    );
  }

  if (el.type === "qr") {
    const qrValue = typeof s.value === "string" && s.value ? s.value : "https://neurobreath.app";
    return (
      <div style={{ ...baseStyle, display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: typeof s.background === "string" ? s.background : "#fff" }}>
        <QRCodeSVG
          value={qrValue}
          style={{ width: "100%", height: "100%" }}
          level={(s.level as "L" | "M" | "Q" | "H") ?? "M"}
          fgColor={typeof s.fill === "string" ? s.fill : "#000"}
          bgColor={typeof s.background === "string" ? s.background : "#fff"}
          marginSize={typeof s.marginSize === "number" ? s.marginSize : 1}
        />
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Background template URL helper (last-resort fallback only)
//
// In normal flow, cardModel.style.backgroundImageRef is now populated by
// createServerShareFromProfile() with the authoritative template.src URL from
// the manifest, so this function is only called when that field is absent
// (e.g. for snapshots created before the manifest-lookup fix).
// ---------------------------------------------------------------------------

function getBackgroundTemplateUrl(presetId: string): string {
  const base = presetId.replace(/[-_](background|overlay|bg|ov)$/i, "");
  return `/nb-card/templates/backgrounds/${base}_bg.svg`;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SharePageClient({ token, cardModel: rawCardModel, pngUrl, pdfUrl }: SharePageClientProps) {
  const card = useMemo(() => migrateCardModel(rawCardModel), [rawCardModel]);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/nb-card/s/${token}`
    : `/nb-card/s/${token}`;

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"png" | "pdf" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const hasLayers = card.canvas.elements.length > 0;
  const bgImageRef = card.style.backgroundImageRef;
  const bgPresetId = card.style.backgroundPresetId;
  const hasBg = !!(bgImageRef || bgPresetId);
  const profile = card.profile ?? {};
  const social = card.social ?? {};

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  async function handleDownloadPng() {
    setDownloading("png");
    try {
      if (pngUrl) { triggerDownload(pngUrl, "nb-card.png"); return; }
      if (previewRef.current) {
        const { captureToBlob } = await import("@/lib/nbcard/export/capture");
        const blob = await captureToBlob(previewRef.current, { scale: 2 });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, "nb-card.png");
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) { console.error("PNG download failed:", err); }
    finally { setDownloading(null); }
  }

  async function handleDownloadPdf() {
    setDownloading("pdf");
    try {
      if (pdfUrl) { triggerDownload(pdfUrl, "nb-card.pdf"); return; }
      if (previewRef.current) {
        const { captureCardAsPdf } = await import("@/lib/nbcard/export/generatePdfWithLinks");
        const pdfBlob = await captureCardAsPdf(previewRef.current, "nb-card");
        const url = URL.createObjectURL(pdfBlob);
        triggerDownload(url, "nb-card.pdf");
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) { console.error("PDF download failed:", err); }
    finally { setDownloading(null); }
  }

  async function handleCopyText() {
    const text = buildCardText(card);
    try { await navigator.clipboard.writeText(text); }
    catch { window.prompt("Copy this text:", text); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const cardContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingBottom: "62.9%", // 86mm × 54mm business card ratio
    overflow: "hidden",
    fontFamily: card.style.fontFamily ?? "Inter, sans-serif",
    background: !hasBg ? "linear-gradient(135deg, #9333ea, #3b82f6)" : undefined,
  };

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div className="rounded-2xl overflow-hidden shadow-2xl" ref={previewRef}>
        {pngUrl ? (
          // Priority 1: pre-generated PNG
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pngUrl} alt="Your digital card" className="w-full rounded-2xl" />
        ) : (
          // Priority 2 & 3: reconstruct from snapshot
          <div style={cardContainerStyle}>
            {/* Background */}
            {hasBg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bgImageRef ?? getBackgroundTemplateUrl(bgPresetId!)}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
              />
            )}

            {hasLayers ? (
              /* Priority 2: canvas layers */
              <CanvasLayerViewer elements={card.canvas.elements} />
            ) : (
              /* Priority 3: text fallback */
              <div className="absolute inset-0 p-4 text-white" style={{ zIndex: 1 }}>
                {profile.photoRef && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photoRef} alt={profile.fullName ?? ""}
                    className="w-12 h-12 rounded-full object-cover mb-2" />
                )}
                {profile.fullName && <p className="text-xl font-bold">{profile.fullName}</p>}
                {profile.jobTitle && <p className="text-sm opacity-80 mt-0.5">{profile.jobTitle}</p>}
                {profile.phone && <p className="text-sm mt-2">{profile.phone}</p>}
                {profile.email && <p className="text-sm">{profile.email}</p>}
                {social.website && (
                  <a href={social.website} className="text-sm underline block mt-1"
                     target="_blank" rel="noopener noreferrer"
                     data-link-id="link:website" data-link-url={social.website}>
                    {social.website}
                  </a>
                )}
                {card.category === "address" && <AddressFallback card={card} />}
                {card.category === "bank" && <BankFallback card={card} />}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 gap-3">
        <button onClick={handleDownloadPng} disabled={downloading === "png"}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
          aria-label="Download card as PNG image">
          {downloading === "png" ? <Spinner /> : <DownloadIcon />}
          Download Image (PNG)
        </button>

        <button onClick={handleDownloadPdf} disabled={downloading === "pdf"}
          className="flex items-center justify-center gap-2 w-full bg-white border-2 border-purple-600 text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-all disabled:opacity-60"
          aria-label="Download card as PDF with active links">
          {downloading === "pdf" ? <Spinner color="purple" /> : <PdfIcon />}
          Download PDF (active links)
        </button>

        <button onClick={handleCopyText}
          className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all"
          aria-label="Copy card details as formatted text">
          <CopyIcon />
          {copied ? "Copied!" : "Copy text"}
        </button>
      </div>

      {/* Re-share QR */}
      <div className="rounded-2xl bg-white p-5 flex flex-col items-center gap-3 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold text-gray-700">Share this card</p>
        <QRCodeSVG value={shareUrl} size={160} level="M" includeMargin />
        <p className="text-xs text-gray-400 text-center break-all">{shareUrl}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(shareUrl).catch(() => undefined); }}
          className="text-xs text-purple-600 hover:underline">
          Copy link
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components for text fallback
// ---------------------------------------------------------------------------

function AddressFallback({ card }: { card: CardModel }) {
  const d = card.categoryData as Record<string, unknown>;
  const mapHref = buildMapHref(
    {
      addressLine1: d.line1 as string | undefined,
      addressLine2: d.line2 as string | undefined,
      city: d.city as string | undefined,
      postcode: d.postcode as string | undefined,
      country: d.country as string | undefined,
      mapUrlOverride: d.mapUrlOverride as string | undefined,
      mapDestinationOverride: d.mapDestinationOverride as string | undefined,
    },
    {
      addressLine1: d.line1 as string | undefined,
      city: d.city as string | undefined,
      postcode: d.postcode as string | undefined,
      country: d.country as string | undefined,
    }
  );
  const parts = [d.line1, d.line2, d.city, d.postcode, d.country]
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  if (parts.length === 0) return null;
  return (
    <div className="mt-2 text-sm">
      {parts.map((p, i) => <p key={i}>{p}</p>)}
      <a href={mapHref} target="_blank" rel="noopener noreferrer"
         className="underline mt-1 block"
         data-link-id="link:mapDirections" data-link-url={mapHref}>
        {(d.mapLabel as string | undefined) ?? "Get Directions"}
      </a>
    </div>
  );
}

function BankFallback({ card }: { card: CardModel }) {
  const b = card.categoryData as Record<string, unknown>;
  return (
    <div className="mt-2 text-sm space-y-0.5">
      {!!b.bankName && <p>Bank: {String(b.bankName)}</p>}
      {!!b.accountName && <p>Account: {String(b.accountName)}</p>}
      {!!b.sortCode && <p>Sort Code: {String(b.sortCode)}</p>}
      {!!b.accountNumber && <p>Account No: {String(b.accountNumber)}</p>}
      {!!b.iban && <p>IBAN: {String(b.iban)}</p>}
      {!!b.swift && <p>SWIFT: {String(b.swift)}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Build plain-text card summary (for copy-text action)
// ---------------------------------------------------------------------------

function buildCardText(card: CardModel): string {
  const lines: string[] = [];
  const p = card.profile ?? {};
  const s = card.social ?? {};
  const d = (card.categoryData ?? {}) as Record<string, unknown>;

  if (p.fullName) lines.push(p.jobTitle ? `${p.fullName} — ${p.jobTitle}` : p.fullName);
  if (p.phone) lines.push(`Phone: ${p.phone}`);
  if (p.email) lines.push(`Email: ${p.email}`);
  if (s.website) lines.push(`Website: ${s.website}`);
  if (s.instagram) lines.push(`Instagram: ${s.instagram}`);
  if (s.linkedin) lines.push(`LinkedIn: ${s.linkedin}`);

  if (card.category === "address") {
    const parts = [d.line1, d.line2, d.city, d.postcode, d.country]
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    if (parts.length) lines.push("", "Address:", ...parts.map((x) => `  ${x}`));
    if (typeof d.directionsNote === "string" && d.directionsNote) lines.push(`Note: ${d.directionsNote}`);
    const mapHref = buildMapHref(
      { addressLine1: d.line1 as string | undefined, addressLine2: d.line2 as string | undefined,
        city: d.city as string | undefined, postcode: d.postcode as string | undefined, country: d.country as string | undefined,
        mapUrlOverride: d.mapUrlOverride as string | undefined, mapDestinationOverride: d.mapDestinationOverride as string | undefined },
      { addressLine1: d.line1 as string | undefined, city: d.city as string | undefined,
        postcode: d.postcode as string | undefined, country: d.country as string | undefined }
    );
    lines.push("", `Directions: ${mapHref}`);
  } else if (card.category === "bank") {
    if (d.bankName) lines.push("", `Bank: ${d.bankName}`);
    if (d.accountName) lines.push(`Account Name: ${d.accountName}`);
    if (d.sortCode) lines.push(`Sort Code: ${d.sortCode}`);
    if (d.accountNumber) lines.push(`Account Number: ${d.accountNumber}`);
    if (d.iban) lines.push(`IBAN: ${d.iban}`);
    if (d.swift) lines.push(`SWIFT/BIC: ${d.swift}`);
  } else if (card.category === "business") {
    if (d.companyName) lines.push("", `Company: ${d.companyName}`);
    if (d.services) lines.push(`Services: ${d.services}`);
    if (d.hours) lines.push(`Hours: ${d.hours}`);
    if (d.bookingLink) lines.push(`Book: ${d.bookingLink}`);
  } else if (card.category === "flyer") {
    if (d.headline) lines.push("", String(d.headline));
    if (d.subheadline) lines.push(String(d.subheadline));
    if (d.eventDate) lines.push(`Date: ${d.eventDate}`);
    if (d.location) lines.push(`Location: ${d.location}`);
    if (d.ctaUrl) lines.push(`${d.ctaLabel ?? "More info"}: ${d.ctaUrl}`);
  } else if (card.category === "wedding") {
    if (d.coupleNames) lines.push("", String(d.coupleNames));
    if (d.date) lines.push(`Date: ${d.date}`);
    if (d.venue) lines.push(`Venue: ${d.venue}`);
    if (d.rsvpUrl) lines.push(`${d.rsvpLabel ?? "RSVP"}: ${d.rsvpUrl}`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Utility
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

// ---------------------------------------------------------------------------
// Inline icons
// ---------------------------------------------------------------------------

function Spinner({ color = "white" }: { color?: string }) {
  return (
    <span
      className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full"
      style={{ borderColor: color === "white" ? "#fff" : "#9333ea", borderTopColor: "transparent" }}
      aria-hidden="true"
    />
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
