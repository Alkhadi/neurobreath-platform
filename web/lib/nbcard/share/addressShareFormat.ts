/**
 * addressShareFormat.ts — Address card share text / email HTML formatter
 *
 * Produces three output formats for the "Share as Text" action:
 *  - plainText   → WhatsApp/SMS-friendly
 *  - markdownText → nicer where Markdown is supported
 *  - emailHtml   → professional HTML with clickable links for email clients
 *
 * Uses the existing buildMapHref() from mapHref.ts so the Google Maps URL
 * logic is consistent with the card preview.
 */

import type { AddressCategoryData } from "../cardModel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProfileLike = {
  fullName?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
};

type SocialLike = {
  website?: string;
};

export type AddressCardLike = {
  profile?: ProfileLike;
  social?: SocialLike;
  categoryData: AddressCategoryData;
};

export type AddressShareTextOutput = {
  mapsLabel: string;
  mapsUrl: string;
  /** WhatsApp/SMS-friendly */
  plainText: string;
  /** Markdown-formatted (where supported) */
  markdownText: string;
  /** Professional HTML for email clients */
  emailHtml: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const clean = (v?: string): string =>
  typeof v === "string" ? v.trim() : "";

const has = (v?: string): boolean => clean(v).length > 0;

const joinNonEmpty = (
  parts: Array<string | undefined>,
  sep = ", "
): string => parts.map(clean).filter(Boolean).join(sep);

function buildAddressDestination(data: AddressCategoryData): string {
  const override = clean(data.mapDestinationOverride);
  if (override) return override;
  return joinNonEmpty(
    [data.line1, data.line2, data.city, data.postcode, data.country],
    ", "
  );
}

export function buildGoogleMapsDirectionsUrl(
  data: AddressCategoryData
): string {
  const overrideUrl = clean(data.mapUrlOverride);
  if (overrideUrl) return overrideUrl;
  const destination = buildAddressDestination(data);
  const encoded = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}

export function getAddressMapLabel(data: AddressCategoryData): string {
  const label = clean(data.mapLabel);
  return label || "Click Here";
}

// ---------------------------------------------------------------------------
// Main formatter
// ---------------------------------------------------------------------------

export function formatAddressShareText(
  card: AddressCardLike
): AddressShareTextOutput {
  const p = card.profile ?? {};
  const s = card.social ?? {};
  const d = card.categoryData;

  const fullName = clean(p.fullName);
  const jobTitle = clean(p.jobTitle);
  const phone = clean(p.phone);
  const email = clean(p.email);
  const website = clean(s.website);

  const mapsLabel = getAddressMapLabel(d);
  const mapsUrl = buildGoogleMapsDirectionsUrl(d);

  const addressLines: string[] = [
    clean(d.line1),
    clean(d.line2),
    joinNonEmpty([d.city, d.postcode], ", "),
    clean(d.country),
  ].filter(Boolean);

  const directionsNote = clean(d.directionsNote);

  const headerLine =
    has(fullName) && has(jobTitle)
      ? `${fullName} — ${jobTitle}`
      : fullName || jobTitle || "Address Details";

  // -------------------------------------------------------------------------
  // Plain text (WhatsApp / SMS)
  // -------------------------------------------------------------------------

  const plainParts: string[] = [
    headerLine,
    "",
    "Address:",
    ...addressLines.map((x) => `• ${x}`),
  ];

  if (directionsNote) {
    plainParts.push("", "Directions note:", `• ${directionsNote}`);
  }

  const contactParts: string[] = [];
  if (has(phone)) contactParts.push(`Phone: ${phone}`);
  if (has(email)) contactParts.push(`Email: ${email}`);
  if (has(website)) contactParts.push(`Website: ${website}`);
  if (contactParts.length) plainParts.push("", ...contactParts);

  plainParts.push("", `${mapsLabel}: ${mapsUrl}`);

  const plainText = plainParts.join("\n");

  // -------------------------------------------------------------------------
  // Markdown
  // -------------------------------------------------------------------------

  const mdParts: string[] = [
    `**${escapeMd(headerLine)}**`,
    "",
    "**Address:**",
    ...addressLines.map((x) => `- ${escapeMd(x)}`),
  ];

  if (directionsNote) {
    mdParts.push("", "**Directions note:**", `- ${escapeMd(directionsNote)}`);
  }

  if (contactParts.length) {
    mdParts.push(
      "",
      ...contactParts.map((x) => {
        const idx = x.indexOf(":");
        const key = x.slice(0, idx);
        const val = x.slice(idx + 1).trim();
        return `**${escapeMd(key)}:** ${escapeMd(val)}`;
      })
    );
  }

  mdParts.push("", `**${escapeMd(mapsLabel)}:** ${mapsUrl}`);

  const markdownText = mdParts.join("\n");

  // -------------------------------------------------------------------------
  // Email HTML
  // -------------------------------------------------------------------------

  const emailHtml = buildEmailHtml({
    headerLine,
    addressLines,
    directionsNote,
    phone,
    email,
    website,
    mapsLabel,
    mapsUrl,
  });

  return { mapsLabel, mapsUrl, plainText, markdownText, emailHtml };
}

// ---------------------------------------------------------------------------
// Email HTML builder
// ---------------------------------------------------------------------------

type EmailHtmlInput = {
  headerLine: string;
  addressLines: string[];
  directionsNote?: string;
  phone?: string;
  email?: string;
  website?: string;
  mapsLabel: string;
  mapsUrl: string;
};

function buildEmailHtml(input: EmailHtmlInput): string {
  const {
    headerLine,
    addressLines,
    directionsNote,
    phone,
    email,
    website,
    mapsLabel,
    mapsUrl,
  } = input;

  const parts: string[] = [];

  parts.push(`
<div style="font-family:Inter,Arial,sans-serif;line-height:1.45;color:#111827;">
  <div style="font-size:16px;font-weight:700;margin-bottom:10px;">${escHtml(headerLine)}</div>
  <div style="font-size:13px;font-weight:700;margin:12px 0 6px;">Address</div>
  <div style="font-size:13px;color:#374151;">
    ${addressLines.map((l) => `<div>${escHtml(l)}</div>`).join("")}
  </div>`);

  if (directionsNote) {
    parts.push(`
  <div style="font-size:13px;font-weight:700;margin:12px 0 6px;">Directions note</div>
  <div style="font-size:13px;color:#374151;">${escHtml(directionsNote)}</div>`);
  }

  const contactBits: string[] = [];
  if (has(phone))
    contactBits.push(`<div><b>Phone:</b> ${escHtml(phone!)}</div>`);
  if (has(email))
    contactBits.push(
      `<div><b>Email:</b> <a href="mailto:${escHtml(email!)}" style="color:#2563eb;text-decoration:none;">${escHtml(email!)}</a></div>`
    );
  if (has(website))
    contactBits.push(
      `<div><b>Website:</b> <a href="${escHtml(website!)}" style="color:#2563eb;text-decoration:none;">${escHtml(website!)}</a></div>`
    );

  if (contactBits.length) {
    parts.push(`
  <div style="font-size:13px;font-weight:700;margin:12px 0 6px;">Contact</div>
  <div style="font-size:13px;color:#374151;">
    ${contactBits.join("")}
  </div>`);
  }

  parts.push(`
  <div style="margin-top:14px;">
    <a href="${escHtml(mapsUrl)}"
       style="display:inline-block;background:#7c3aed;color:white;padding:10px 12px;border-radius:10px;font-weight:700;font-size:13px;text-decoration:none;">
      ${escHtml(mapsLabel)}
    </a>
    <div style="font-size:12px;color:#6b7280;margin-top:8px;">
      If the button does not open, copy/paste this link:<br/>
      <span style="word-break:break-all;">${escHtml(mapsUrl)}</span>
    </div>
  </div>
</div>`);

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Escape helpers
// ---------------------------------------------------------------------------

function escapeMd(s: string): string {
  return s.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
