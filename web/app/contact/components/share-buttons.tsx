"use client";

import * as React from "react";

import html2canvas from "html2canvas";
import { waitForAllFonts } from "@/lib/nb-card/font-loader";
import { PDFDocument, PDFName } from "pdf-lib";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";

import { buildMapHref } from "@/lib/nbcard/mapHref";
import { stripUrls, clamp } from "@/lib/nbcard/sanitize";
import { captureToBlob } from "@/lib/nbcard/export/capture";
import { shareFileOrFallback, blobToFile } from "@/lib/nbcard/export/share";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Contact, Profile } from "@/lib/utils";
import type { TemplateSelection, Template } from "@/lib/nbcard-templates";
import { loadTemplateManifest, getTemplateById } from "@/lib/nbcard-templates";

import { ProfileCard } from "./profile-card";

import {
  createBackup,
  validateBackup,
  migrateBackup,
  mergeCards,
  mergeContacts,
  type ConflictStrategy,
} from "@/lib/nb-card/backup";

import { RedactionDialog } from "@/components/nbcard/RedactionDialog";
import { ShareModeDialog, type ShareMode } from "@/components/nbcard/ShareModeDialog";
import {
  applyRedaction,
  getDefaultIncludedFieldsForProfile,
  getPopulatedFields,
  type RedactableField,
} from "@/lib/nb-card/redaction";
import { getRecommendedCaptureScale, runExportPreflight } from "@/lib/nb-card/export-preflight";
import {
  type NbcardSavedCard,
  type NbcardSavedCardCategory,
  getNbcardSavedNamespace,
  getOrCreateNbcardDeviceId,
  loadNbcardActiveSavedCardIds,
  loadNbcardSavedCards,
  migrateNbcardSavedCardsFromLegacy,
  setNbcardActiveSavedCardId,
  upsertNbcardSavedCard,
  deleteNbcardSavedCard,
} from "@/lib/utils";

import { GradientSelector } from "./gradient-selector";
import { FrameChooser } from "./frame-chooser";
import { storeAsset, generateAssetKey } from "../lib/nbcard-assets";

import {
  type SavedCardCategory,
  generateProfileId,
  getCategoryFromProfile,
  normalizeProfileForCategory,
} from "@/lib/nbcard-saved-cards";


import {
  downloadBlob,
  copyTextToClipboard,
  shareViaWebShare,
  getProfileShareUrl,
  generateProfileVCard,
  buildMailtoUrl,
  buildSmsUrl,
  buildWhatsappUrl,
  renderBankQrText,
  renderFlyerQrText,
} from "../lib/nbcard-share";
import { uploadCardOgImage } from "@/lib/nb-card/og-upload";
import {
  importNbcardLocalState,
  resetNbcardContacts,
  resetNbcardProfiles,
} from "../lib/nbcard-storage";

import { Download, Link as LinkIcon, Mail, MessageSquare, QrCode, Share2 } from "lucide-react";

export type ShareButtonsProps = {
  profile: Profile;
  profiles: Profile[];
  contacts: Contact[];
  onSetProfiles: (next: Profile[]) => void;
  onSetContacts: (next: Contact[]) => void;
  templateSelection?: TemplateSelection;
  showPrivacyControls?: boolean;
  /**
   * Pre-resolved canonical server share URL (e.g. /nb-card/s/<token>).
   * When provided, replaces the browser-local ?profile=<id> URL in all
   * share flows (copy link, native share, email, WhatsApp, QR display).
   * Falls back to the local URL when null/undefined (degraded / not yet ready).
   */
  canonicalShareUrl?: string | null;
};

function contactsToCsv(contacts: Contact[]): string {
  const header = ["id", "name", "email", "phone", "notes", "createdAt"].join(",");
  const rows = contacts.map((c) =>
    [
      c.id,
      c.name ?? "",
      c.email ?? "",
      c.phone ?? "",
      (c.notes ?? "").replace(/\r\n|\r|\n/g, " "),
      c.createdAt ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

async function dataUrlToPngBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src.slice(0, 60)}`));
    img.src = src;
  });
}

// UNIFIED EXPORT PIPELINE: Guarantees Download and Share use identical assets
async function buildExportAssets(
  profile: Profile,
  shareUrl: string,
  options: { includePdf?: boolean } = {},
  captureElementId: string = "profile-card-capture"
): Promise<{ pngBlob: Blob; pdfBytes?: Uint8Array }> {
  // 1. Capture PNG once (used by both PNG export and PDF embed)
  const pngBlob = await captureProfileCardPng(captureElementId);

  if (!options.includePdf) return { pngBlob };

  // 2. Generate QR code PNG if available (only needed for PDF)
  let qrPngUrl: string | undefined;
  try {
    const svg = document.getElementById("nbcard-qr-svg");
    if (svg) {
      const xml = new XMLSerializer().serializeToString(svg);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
      const qrPngBlob = await dataUrlToPngBlob(svgDataUrl);
      qrPngUrl = URL.createObjectURL(qrPngBlob);
    }
  } catch {
    // ignore QR if unavailable
  }

  try {
    // 3. Generate PDF embedding the captured PNG
    const pdfBytes = await createSimplePdf(profile, shareUrl, qrPngUrl, pngBlob, captureElementId);
    return { pngBlob, pdfBytes };
  } finally {
    if (qrPngUrl) URL.revokeObjectURL(qrPngUrl);
  }
}

async function captureProfileCardPng(captureElementId: string): Promise<Blob> {
  const target = document.getElementById(captureElementId);
  if (!target) throw new Error("Element not found");
  
  // CRITICAL: Wait for fonts to finish loading before capture
  await waitForAllFonts(5000);

  // Extra stability delay: let the browser paint text layers with loaded fonts.
  // A single rAF is not enough — fonts trigger reflow, then a repaint cycle.
  await new Promise((resolve) => setTimeout(resolve, 150));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  // Force a synchronous reflow so all text dimensions are settled before capture.
  void target.offsetHeight;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  
  // Use the new capture helper for consistent, reliable capture
  try {
    return await captureToBlob(target, {
      scale: getRecommendedCaptureScale(),
      backgroundColor: null,
    });
  } catch (error) {
    // Fallback to preflight + html2canvas if the helper fails
    const preflight = await runExportPreflight(target);
    if (!preflight.ready) {
      throw new Error(preflight.warnings[0] ?? "Export preflight failed");
    }

    // Flush layout after any template/avatar changes
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    // COLOR FIDELITY: No color conversion, no filters
    const canvas = await html2canvas(target, {
      scale: getRecommendedCaptureScale(),
      backgroundColor: null,
      useCORS: true,
      logging: false,
      allowTaint: false,
    });

    // PNG export with true alpha (no JPEG color shifts)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Failed to create image blob"));
        else resolve(blob);
      }, "image/png", 1.0);
    });
  }
}

type PdfAnnotsArrayLike = {
  push: (value: unknown) => void;
};

/**
 * Wait for the off-screen export card to be fully rendered in the DOM.
 * A double-rAF alone is insufficient — React needs ≥1 commit cycle, fonts
 * need to load, and images inside the card need to decode.  This helper
 * polls until the element exists AND has a non-zero bounding rect, then
 * pauses for a short layout-stabilisation delay.
 */
async function waitForExportRender(captureId: string, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  // Poll until the element is in the DOM with non-zero dimensions
  while (Date.now() - start < timeoutMs) {
    const el = document.getElementById(captureId);
    if (el && el.getBoundingClientRect().height > 0) break;
    await new Promise((r) => requestAnimationFrame(r));
  }
  // Two full paint frames + a short timer for font/layout stabilisation
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise((r) => setTimeout(r, 120));
}

function getPdfPageNode(page: unknown): { Annots?: () => unknown; set: (name: PDFName, value: unknown) => void } | null {
  if (!page || typeof page !== "object") return null;
  const node = (page as { node?: unknown }).node;
  if (!node || typeof node !== "object") return null;

  const set = (node as { set?: unknown }).set;
  if (typeof set !== "function") return null;

  return node as unknown as { Annots?: () => unknown; set: (name: PDFName, value: unknown) => void };
}

function ensurePdfAnnotsArray(doc: PDFDocument, page: unknown): PdfAnnotsArrayLike | null {
  // pdf-lib's Page API doesn't expose a stable link helper, so we use a minimal
  // annotation dictionary approach.
  const node = getPdfPageNode(page);
  if (!node) return null;

  const existing = node.Annots?.();
  if (existing && typeof (existing as { push?: unknown }).push === "function") {
    return existing as unknown as PdfAnnotsArrayLike;
  }

  const arr = doc.context.obj([]);
  node.set(PDFName.of("Annots"), arr);
  return arr as unknown as PdfAnnotsArrayLike;
}

function addPdfLinkOverlaysFromDom(params: {
  doc: PDFDocument;
  page: unknown;
  root: HTMLElement;
  cardX: number;
  cardY: number;
  cardPdfWidth: number;
  cardPdfHeight: number;
}) {
  const { doc, page, root, cardX, cardY, cardPdfWidth, cardPdfHeight } = params;
  const rootRect = root.getBoundingClientRect();
  if (!rootRect.width || !rootRect.height) return;

  const scaleX = cardPdfWidth / rootRect.width;
  const scaleY = cardPdfHeight / rootRect.height;

  const annots = ensurePdfAnnotsArray(doc, page);
  if (!annots) return;
  const linkEls = root.querySelectorAll<HTMLElement>("[data-pdf-link]");

  linkEls.forEach((el) => {
    const uri = (el.getAttribute("data-pdf-link") || "").trim();
    if (!uri) return;

    // Avoid empty placeholder URIs.
    if (uri === "tel:" || uri === "mailto:") return;

    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const relX = r.left - rootRect.left;
    const relTop = r.top - rootRect.top;

    const x1 = cardX + relX * scaleX;
    const x2 = x1 + r.width * scaleX;

    // DOM y grows down from top; PDF y grows up from bottom.
    const yTop = cardY + cardPdfHeight - relTop * scaleY;
    const y1 = yTop - r.height * scaleY;
    const y2 = yTop;

    if (!Number.isFinite(x1) || !Number.isFinite(x2) || !Number.isFinite(y1) || !Number.isFinite(y2)) return;
    if (x2 <= x1 || y2 <= y1) return;

    try {
      const linkDict = doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x1, y1, x2, y2],
        Border: [0, 0, 0],
        A: {
          S: "URI",
          URI: uri,
        },
      });
      annots.push(doc.context.register(linkDict));
    } catch {
      // best-effort
    }
  });
}

async function createSimplePdf(profile: Profile, shareUrl: string, qrDataUrl: string | undefined, cardPngBlob: Blob, captureElementId: string) {
  const doc = await PDFDocument.create();
  try {
    const cardPngBytes = await cardPngBlob.arrayBuffer();
    const cardImage = await doc.embedPng(cardPngBytes);
    // Single-page PDF sized exactly to the captured image (no appended info below).
    const page = doc.addPage([cardImage.width, cardImage.height]);
    const pageWidth = cardImage.width;
    const pageHeight = cardImage.height;

    page.drawImage(cardImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    // Overlay clickable areas from the DOM onto the embedded image.
    try {
      const root = document.getElementById(captureElementId);
      if (root && pageWidth > 0 && pageHeight > 0) {
        addPdfLinkOverlaysFromDom({
          doc,
          page,
          root,
          cardX: 0,
          cardY: 0,
          cardPdfWidth: pageWidth,
          cardPdfHeight: pageHeight,
        });
      }
    } catch {
      // ignore overlay failures; keep embedded image PDF
    }
  } catch (err) {
    console.error("Failed to embed card image in PDF:", err);
    // Fallback: return an empty PDF rather than appending extra info.
    // (Keeping failure mode simple avoids exporting misleading/duplicated content.)
    void profile;
    void shareUrl;
    void qrDataUrl;
  }

  return await doc.save();
}

// TODO Phase 5 Enhancement: Business Card Dual-Sided PDF Export
// To implement 2-page PDF (front + back):
// 1. Pass template switch callback from NBCardPanel to ShareButtons
// 2. In export pipeline: capture front → switch to back template → capture back
// 3. Create PDF with both pages using pdf-lib addPage()
// 4. Ensure both pages have same dimensions (exportWidth × exportHeight)
// For now, business cards export the currently visible side only.

function renderShareText(profile: Profile, shareUrl: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`${profile.fullName}`);
  if (profile.jobTitle) lines.push(profile.jobTitle);
  lines.push(""); // blank line
  
  // Address
  if (profile.address) {
    lines.push(`🏠 ${profile.address}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`;
    lines.push(`📍 Open in Google Maps: ${mapsUrl}`);
    lines.push(""); // blank line
  }
  
  // Contact
  if (profile.phone) lines.push(`📞 ${profile.phone}`);
  if (profile.email) lines.push(`📧 ${profile.email}`);
  if (profile.website) lines.push(`🌐 ${profile.website}`);
  if (profile.wellbeingLink) lines.push(`💚 Wellbeing: ${profile.wellbeingLink}`);
  
  // Socials
  const socials: string[] = [];
  if (profile.socialMedia?.instagram) socials.push(`Instagram: ${profile.socialMedia.instagram}`);
  if (profile.socialMedia?.facebook) socials.push(`Facebook: ${profile.socialMedia.facebook}`);
  if (profile.socialMedia?.linkedin) socials.push(`LinkedIn: ${profile.socialMedia.linkedin}`);
  if (profile.socialMedia?.twitter) socials.push(`X (Twitter): ${profile.socialMedia.twitter}`);
  if (profile.socialMedia?.tiktok) socials.push(`TikTok: ${profile.socialMedia.tiktok}`);
  if (profile.socialMedia?.youtube) socials.push(`YouTube: ${profile.socialMedia.youtube}`);
  if (profile.socialMedia?.whatsapp) socials.push(`WhatsApp: ${profile.socialMedia.whatsapp}`);
  
  if (socials.length > 0) {
    lines.push(""); // blank line
    lines.push("Social Media:");
    socials.forEach(s => lines.push(s));
  }
  
  // Bank details (legacy fields)
  if (profile.bankSortCode || profile.bankAccountNumber) {
    lines.push(""); // blank line
    lines.push("Bank Details:");
    if (profile.bankSortCode) lines.push(`Sort Code: ${profile.bankSortCode}`);
    if (profile.bankAccountNumber) lines.push(`Account: ${profile.bankAccountNumber}`);
  }

  // Category-specific details
  if (profile.cardCategory === "ADDRESS" && profile.addressCard) {
    lines.push("");
    lines.push("📍 Address:");
    if (profile.addressCard.addressLine1) lines.push(profile.addressCard.addressLine1);
    if (profile.addressCard.addressLine2) lines.push(profile.addressCard.addressLine2);
    const cityLine = [profile.addressCard.city, profile.addressCard.postcode].filter(Boolean).join(", ");
    if (cityLine) lines.push(cityLine);
    if (profile.addressCard.country) lines.push(profile.addressCard.country);
    
    // Sanitize directionsNote (no URLs)
    if (profile.addressCard.directionsNote) {
      const sanitized = stripUrls(clamp(profile.addressCard.directionsNote, 60));
      if (sanitized) lines.push(`Note: ${sanitized}`);
    }
    
    // Use buildMapHref for consistent link generation
    const mapsLink = buildMapHref(profile.addressCard);
    if (mapsLink) {
      lines.push(`${profile.addressCard.mapLinkLabel || "Get Directions"}: ${mapsLink}`);
    }
  }

  if (profile.cardCategory === "BANK" && profile.bankCard) {
    lines.push("");
    lines.push("💳 Bank Details:");
    if (profile.bankCard.bankName) lines.push(`Bank: ${profile.bankCard.bankName}`);
    if (profile.bankCard.accountName) lines.push(`Account Name: ${profile.bankCard.accountName}`);
    if (profile.bankCard.sortCode) lines.push(`Sort Code: ${profile.bankCard.sortCode}`);
    if (profile.bankCard.accountNumber) lines.push(`Account Number: ${profile.bankCard.accountNumber}`);
    if (profile.bankCard.iban) lines.push(`IBAN: ${profile.bankCard.iban}`);
    if (profile.bankCard.swiftBic) lines.push(`SWIFT/BIC: ${profile.bankCard.swiftBic}`);
    if (profile.bankCard.referenceNote) lines.push(`Note: ${profile.bankCard.referenceNote}`);
    if (profile.bankCard.paymentLink) {
      lines.push(`${profile.bankCard.paymentLinkLabel || "Send Money"}: ${profile.bankCard.paymentLink}`);
    }
  }

  if (profile.cardCategory === "BUSINESS" && profile.businessCard) {
    lines.push("");
    lines.push("💼 Business:");
    if (profile.businessCard.companyName) lines.push(`Company: ${profile.businessCard.companyName}`);
    if (profile.businessCard.services) lines.push(`Services: ${profile.businessCard.services}`);
    if (profile.businessCard.websiteUrl) lines.push(`Website: ${profile.businessCard.websiteUrl}`);
    if (profile.businessCard.hours) lines.push(`Hours: ${profile.businessCard.hours}`);
    if (profile.businessCard.locationNote) lines.push(`Location: ${profile.businessCard.locationNote}`);
    if (profile.businessCard.vatOrRegNo) lines.push(`VAT/Reg: ${profile.businessCard.vatOrRegNo}`);
    if (profile.businessCard.bookingLink) {
      lines.push(`${profile.businessCard.bookingLinkLabel || "Book Now"}: ${profile.businessCard.bookingLink}`);
    }
  }
  
  // Profile link
  lines.push(""); // blank line
  lines.push("View my profile:");
  lines.push(shareUrl);
  
  return lines.join("\n");
}

export function ShareButtons({ profile, profiles, contacts, onSetProfiles, onSetContacts, templateSelection, showPrivacyControls = true, canonicalShareUrl }: ShareButtonsProps) {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [isQrOpen, setIsQrOpen] = React.useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = React.useState(false);
  const [isQrVcard, setIsQrVcard] = React.useState(true);
  const [isPrintOpen, setIsPrintOpen] = React.useState(false);
  const [busyKey, setBusyKey] = React.useState<string | null>(null);

  const [isRedactionOpen, setIsRedactionOpen] = React.useState(false);
  const [pendingRedactionAction, setPendingRedactionAction] = React.useState<((fields: Set<RedactableField>) => void) | null>(null);
  const [lastRedactionFields, setLastRedactionFields] = React.useState<Set<RedactableField> | null>(null);
  const [exportCaptureProfile, setExportCaptureProfile] = React.useState<Profile | null>(null);
  const [exportCaptureWidth, setExportCaptureWidth] = React.useState<number>(448);
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | undefined>(undefined);

  type PendingShareAction = {
    channel: string;
    onImage: () => Promise<void>;
    onText: () => Promise<void>;
  };
  const [pendingShare, setPendingShare] = React.useState<PendingShareAction | null>(null);

  function requestShareMode(
    channel: string,
    onImage: () => Promise<void>,
    onText: () => Promise<void>
  ) {
    if (busyKey) return;
    // Auto-select "image" mode when the card has a visual canvas
    // (layers, template background, or custom background) — skips the mode dialog.
    const hasVisualCanvas = !!(
      (profile.layers && profile.layers.length > 0) ||
      templateSelection?.backgroundId ||
      profile.backgroundUrl ||
      profile.frameUrl
    );
    if (hasVisualCanvas) {
      void onImage();
      return;
    }
    setPendingShare({ channel, onImage, onText });
  }

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load template when templateSelection changes
  React.useEffect(() => {
    if (!templateSelection?.backgroundId) {
      setSelectedTemplate(undefined);
      return;
    }
    
    let cancelled = false;
    loadTemplateManifest()
      .then((manifest) => {
        if (cancelled) return;
        const template = getTemplateById(manifest.templates, templateSelection.backgroundId!);
        setSelectedTemplate(template ?? undefined);
      })
      .catch(() => {
        if (!cancelled) setSelectedTemplate(undefined);
      });
    
    return () => { cancelled = true; };
  }, [templateSelection?.backgroundId]);

  const EXPORT_CAPTURE_ID = "profile-card-capture-export";

  /** Snapshot the live card's rendered width and mount the off-screen export card.
   *  This ensures the export container matches the live canvas dimensions exactly,
   *  so pixel-based font sizes in text layers render at the correct proportion.  */
  function mountExportCard(redacted: Profile) {
    const liveCard =
      document.getElementById("profile-card-capture") ??
      document.getElementById("profile-card-capture-wrapper");
    if (liveCard) {
      const w = liveCard.getBoundingClientRect().width;
      if (w > 0) setExportCaptureWidth(Math.round(w));
    }
    setExportCaptureProfile(redacted);
  }

  function getDefaultIncludedFields(nextProfile: Profile): Set<RedactableField> {
    return getDefaultIncludedFieldsForProfile(nextProfile);
  }

  function requestRedactionAndRun(run: (redacted: Profile) => Promise<void>) {
    if (busyKey) return;

    // Skip Redaction Dialog for canvas-only cards (no populated form fields).
    // Use default included fields and proceed directly.
    const populated = getPopulatedFields(profile);
    if (populated.length === 0) {
      const defaults = getDefaultIncludedFields(profile);
      setLastRedactionFields(defaults);
      const redacted = applyRedaction(profile, defaults);
      void run(redacted);
      return;
    }

    setPendingRedactionAction(() => {
      return (fields: Set<RedactableField>) => {
        const clonedFields = new Set(fields);
        setLastRedactionFields(clonedFields);
        const redacted = applyRedaction(profile, clonedFields);
        void run(redacted);
      };
    });
    setIsRedactionOpen(true);
  }

  const [sessionEmail, setSessionEmail] = React.useState<string | null>(null);
  const deviceId = React.useMemo(() => getOrCreateNbcardDeviceId(), []);
  const [storageNamespace, setStorageNamespace] = React.useState<string>(() => {
    // Default to guest namespace immediately; upgrade to email namespace once session loads.
    const deviceId = getOrCreateNbcardDeviceId();
    return `device:${deviceId}`;
  });

  // Focus editor (tabbed categories)
  const [activeEditorTab, setActiveEditorTab] = React.useState<SavedCardCategory>(() => getCategoryFromProfile(profile));
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [editorProfile, setEditorProfile] = React.useState<Profile>(profile);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const persistTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const backgroundInputRef = React.useRef<HTMLInputElement>(null);
  const [showFrameChooser, setShowFrameChooser] = React.useState(false);
  const [selectedFrameCategory, setSelectedFrameCategory] = React.useState<"ADDRESS" | "BANK" | "BUSINESS" | "FLYER" | "WEDDING">(
    "ADDRESS"
  );

  const NAMESPACED_STATE_KEY_PREFIX = "nbcard:namespacedState:v1:";

  // Ref to latest handleShareNative — allows the global event listener to call it
  // without re-registering the listener on every render.
  const shareNativeRef = React.useRef<() => void>(() => undefined);

  React.useEffect(() => {
    let cancelled = false;
    getSession()
      .then((s) => {
        if (cancelled) return;
        const email = (s?.user?.email ?? "").toString().trim().toLowerCase();
        const normalized = email && email.includes("@") ? email : "";
        setSessionEmail(normalized || null);

        const deviceId = getOrCreateNbcardDeviceId();
        const ns = normalized ? `email:${normalized}` : `device:${deviceId}`;
        setStorageNamespace(ns);
      })
      .catch(() => {
        // ignore; remain in device namespace
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Best-effort restore of namespaced NBCard state into the active store on mount/namespace change.
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(`${NAMESPACED_STATE_KEY_PREFIX}${storageNamespace}`);
      if (!raw) return;

      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object") return;

      const state = parsed as { schemaVersion?: number; profiles?: Profile[]; contacts?: Contact[]; updatedAt?: string };
      if (!Array.isArray(state.profiles) || state.profiles.length === 0) return;

      onSetProfiles(state.profiles);
      onSetContacts(Array.isArray(state.contacts) ? state.contacts : []);

      // Keep the underlying IndexedDB/localStorage keys in sync with the active namespace.
      void importNbcardLocalState({
        schemaVersion: 1,
        profiles: state.profiles,
        contacts: Array.isArray(state.contacts) ? state.contacts : [],
        updatedAt: typeof state.updatedAt === "string" && state.updatedAt ? state.updatedAt : new Date().toISOString(),
      });
    } catch {
      // ignore corrupted cache
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageNamespace]);

  // Debounced persistence of the active NBCard state into the current namespace.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!storageNamespace) return;

    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    setSaveStatus("saving");

    persistTimerRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          `${NAMESPACED_STATE_KEY_PREFIX}${storageNamespace}`,
          JSON.stringify({
            schemaVersion: 1,
            profiles,
            contacts,
            updatedAt: new Date().toISOString(),
          })
        );
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("idle");
      }
    }, 650);

    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [contacts, profiles, storageNamespace]);

  // Saved Cards persistence namespace (REQUIRED): session email (lowercased) OR device-id
  const savedCardsNamespace = React.useMemo(() => getNbcardSavedNamespace(sessionEmail ?? deviceId), [deviceId, sessionEmail]);

  const [savedCards, setSavedCards] = React.useState<NbcardSavedCard[]>([]);
  const [activeSavedIds, setActiveSavedIds] = React.useState<Partial<Record<NbcardSavedCardCategory, string>>>({});
  const [savedCategory, setSavedCategory] = React.useState<SavedCardCategory>(() => getCategoryFromProfile(profile));

  React.useEffect(() => {
    // Safe migration from previous storage formats into `nbcard:saved:<namespace>`.
    migrateNbcardSavedCardsFromLegacy(savedCardsNamespace, [
      sessionEmail ? `email:${sessionEmail}` : `device:${deviceId}`,
      `device:${deviceId}`,
      "guest",
    ]);

    setSavedCards(loadNbcardSavedCards(savedCardsNamespace));
    setActiveSavedIds(loadNbcardActiveSavedCardIds(savedCardsNamespace));
  }, [savedCardsNamespace, sessionEmail, deviceId]);

  // Local fallback URL — used when canonical server share is not yet available
  const localShareUrl = React.useMemo(() => getProfileShareUrl(profile.id), [profile.id]);
  // Prefer canonical server-backed URL; fall back to local ?profile=<id> URL
  const shareUrl = canonicalShareUrl ?? localShareUrl;

  // Event listener for "Share Your Profile" button in NBCardPanel.
  // Stable effect; ref is kept current via assignment during render (below).
  React.useEffect(() => {
    const handler = () => { shareNativeRef.current(); };
    window.addEventListener("nb-share-request", handler);
    return () => window.removeEventListener("nb-share-request", handler);
  }, []);

  const qrValue = React.useMemo(() => {
    // When data mode is off, encode the share URL.
    if (!isQrVcard) return shareUrl;

    const category = getCategoryFromProfile(profile);
    const fields = lastRedactionFields ?? getDefaultIncludedFields(profile);
    const redacted = applyRedaction(profile, fields);

    // BANK / FLYER / WEDDING use dedicated compact formatters.
    if (category === "BANK") {
      const txt = renderBankQrText(redacted, shareUrl);
      return txt.length > 2000 ? shareUrl : txt;
    }
    if (category === "FLYER" || category === "WEDDING") {
      const txt = renderFlyerQrText(redacted, shareUrl);
      return txt.length > 2000 ? shareUrl : txt;
    }

    const vcard = generateProfileVCard(redacted, {
      includeAddress: category === "ADDRESS",
      includeBusiness: category === "BUSINESS" || category === "PROFILE",
      shareUrl,
    });
    // Fall back to URL if vCard exceeds QR capacity (~2331 bytes at Level M)
    if (vcard.length > 2000) return shareUrl;
    return vcard;
  }, [isQrVcard, lastRedactionFields, profile, shareUrl]);

  async function withBusy<T>(key: string, fn: () => Promise<T>): Promise<T | null> {
    if (busyKey) return null;
    setBusyKey(key);
    try {
      return await fn();
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      return null;
    } finally {
      setBusyKey(null);
    }
  }

  async function handleCopyLink() {
    await withBusy("copy", async () => {
      const ok = await copyTextToClipboard(shareUrl);
      if (!ok) throw new Error("Copy failed");
      toast.success("Profile link copied");
    });
  }

  async function handleShareNative() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "Share",
        // IMAGE path
        async () => {
          await withBusy("share", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              const { pngBlob } = await buildExportAssets(redacted, shareUrl, {}, EXPORT_CAPTURE_ID);
              void uploadCardOgImage(pngBlob, redacted, deviceId).catch(() => undefined);
              const ok = await shareViaWebShare({
                title: `NBCard — ${redacted.fullName || profile.fullName}`,
                text: `Here’s my contact card: ${shareUrl}`,
                files: [new File([pngBlob], `${safeName}.png`, { type: "image/png" })],
              });
              if (!ok) {
                // File sharing not supported (e.g. Atlas, Firefox) — try text share, then download.
                const textOk = await shareViaWebShare({
                  title: `NBCard — ${redacted.fullName || profile.fullName}`,
                  text: `Here\u2019s my contact card: ${shareUrl}`,
                  url: shareUrl,
                });
                if (!textOk) {
                  downloadBlob(pngBlob, `${safeName}_NBCard.png`);
                  toast.success("Card image downloaded");
                }
              } else {
                toast.success("Shared");
              }
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          await withBusy("share-text", async () => {
            const text = renderShareText(redacted, shareUrl);
            const ok = await shareViaWebShare({
              title: `NBCard — ${redacted.fullName || profile.fullName}`,
              text,
              url: shareUrl,
            });
            if (!ok) {
              await copyTextToClipboard(text);
              toast.success("Text copied to clipboard");
            } else {
              toast.success("Shared as text");
            }
          });
        }
      );
    });
  }

  // Keep ref current so the stable event listener always calls the latest version.
  shareNativeRef.current = handleShareNative;

  async function handleDownloadQrCardImage() {
    requestRedactionAndRun(async (redacted) => {
      await withBusy("qr-card", async () => {
        mountExportCard(redacted);
        try {
          await waitForExportRender(EXPORT_CAPTURE_ID);

          // 1. Capture the card preview as a high-DPI PNG
          const { pngBlob } = await buildExportAssets(redacted, shareUrl, {}, EXPORT_CAPTURE_ID);

          // 2. Get the hidden QR SVG element and convert to an image
          const qrSvg = document.getElementById("nbcard-qr-composite");
          if (!qrSvg) throw new Error("QR composite element not found");
          const xml = new XMLSerializer().serializeToString(qrSvg);
          const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;

          // 3. Load both images
          const cardObjUrl = URL.createObjectURL(pngBlob);
          try {
            const [cardImg, qrImg] = await Promise.all([loadImage(cardObjUrl), loadImage(svgDataUrl)]);

            // 4. Composite on an offscreen canvas
            const canvas = document.createElement("canvas");
            canvas.width = cardImg.naturalWidth;
            canvas.height = cardImg.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas 2d context unavailable");

            ctx.drawImage(cardImg, 0, 0);

            // Place QR in bottom-right corner (22% of card width) with white background
            const qrSize = Math.round(canvas.width * 0.22);
            const margin = Math.round(canvas.width * 0.03);
            const qrX = canvas.width - qrSize - margin;
            const qrY = canvas.height - qrSize - margin;
            const pad = Math.round(qrSize * 0.07);
            ctx.fillStyle = "rgba(255,255,255,0.94)";
            ctx.fillRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2);
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            // 5. Export composite
            const composite = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob(
                (b) => { if (!b) reject(new Error("Failed to create QR card blob")); else resolve(b); },
                "image/png",
                1.0
              );
            });

            const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
            downloadBlob(composite, `${safeName}_QRCard.png`);
            toast.success("QR Card image downloaded");
          } finally {
            URL.revokeObjectURL(cardObjUrl);
          }
        } finally {
          setExportCaptureProfile(null);
        }
      });
    });
  }

  async function handleDownloadVcard() {
    requestRedactionAndRun(async (redacted) => {
      await withBusy("vcard", async () => {
        const category = getCategoryFromProfile(profile);
        const vcard = generateProfileVCard(redacted, {
          includeAddress: category === "ADDRESS",
          includeBusiness: category === "BUSINESS" || category === "PROFILE",
        });
        const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
        downloadBlob(new Blob([vcard], { type: "text/vcard" }), `${safeName}_NBCard.vcf`);
        toast.success("vCard downloaded");
      });
    });
  }

  async function handleShareVcardFile() {
    requestRedactionAndRun(async (redacted) => {
      await withBusy("vcard-share", async () => {
        const category = getCategoryFromProfile(profile);
        const vcard = generateProfileVCard(redacted, {
          includeAddress: category === "ADDRESS",
          includeBusiness: category === "BUSINESS" || category === "PROFILE",
        });
        const blob = new Blob([vcard], { type: "text/vcard" });
        const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
        const fileName = `${safeName}.vcf`;
        const ok = await shareViaWebShare({
          title: `vCard — ${redacted.fullName || profile.fullName}`,
          text: "Add me to your contacts.",
          files: [new File([blob], fileName, { type: "text/vcard" })],
        });
        if (ok) {
          toast.success("Shared vCard");
        } else {
          downloadBlob(blob, fileName);
          toast.message("Share not supported", { description: "vCard downloaded instead." });
        }
      });
    });
  }

  function handleDownloadPng() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "Image Export",
        // IMAGE with background
        async () => {
          await withBusy("png", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pngBlob } = await buildExportAssets(redacted, shareUrl, {}, EXPORT_CAPTURE_ID);
              void uploadCardOgImage(pngBlob, redacted, deviceId).catch(() => undefined);
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              const ok = await shareViaWebShare({
                title: `NBCard — ${redacted.fullName || profile.fullName}`,
                files: [new File([pngBlob], `${safeName}.png`, { type: "image/png" })],
              });
              if (!ok) {
                downloadBlob(pngBlob, `${safeName}_NBCard.png`);
                toast.success("PNG downloaded");
              } else {
                toast.success("Image shared");
              }
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT only
        async () => {
          await withBusy("text-share", async () => {
            const text = renderShareText(redacted, shareUrl);
            const ok = await shareViaWebShare({
              title: `NBCard — ${redacted.fullName || profile.fullName}`,
              text,
            });
            if (!ok) {
              await copyTextToClipboard(text);
              toast.success("Text copied to clipboard");
            } else {
              toast.success("Shared as text");
            }
          });
        }
      );
    });
  }

  function handleSharePng() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "Share PNG",
        // IMAGE path
        async () => {
          await withBusy("png-share", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pngBlob } = await buildExportAssets(redacted, shareUrl, {}, EXPORT_CAPTURE_ID);
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              const ok = await shareViaWebShare({
                title: `NBCard — ${redacted.fullName || profile.fullName}`,
                files: [new File([pngBlob], `${safeName}.png`, { type: "image/png" })],
              });
              if (ok) {
                toast.success("Shared image");
              } else {
                downloadBlob(pngBlob, `${safeName}_NBCard.png`);
                toast.message("Sharing not supported here", { description: "Image downloaded instead." });
              }
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          await withBusy("text-share", async () => {
            const text = renderShareText(redacted, shareUrl);
            const ok = await shareViaWebShare({
              title: `NBCard — ${redacted.fullName || profile.fullName}`,
              text,
            });
            if (!ok) {
              await copyTextToClipboard(text);
              toast.success("Text copied to clipboard");
            } else {
              toast.success("Shared as text");
            }
          });
        }
      );
    });
  }

  function handleDownloadPdf() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "PDF Export",
        // IMAGE (PDF with embedded canvas)
        async () => {
          await withBusy("pdf", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pdfBytes } = await buildExportAssets(redacted, shareUrl, { includePdf: true }, EXPORT_CAPTURE_ID);
              if (!pdfBytes) throw new Error("Failed to generate PDF");
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), `${safeName}_NBCard.pdf`);
              toast.success("PDF downloaded");
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          await withBusy("text-share", async () => {
            const text = renderShareText(redacted, shareUrl);
            const ok = await shareViaWebShare({
              title: `NBCard — ${redacted.fullName || profile.fullName}`,
              text,
            });
            if (!ok) {
              await copyTextToClipboard(text);
              toast.success("Text copied to clipboard");
            } else {
              toast.success("Shared as text");
            }
          });
        }
      );
    });
  }

  function handleSharePdf() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "Share PDF",
        // IMAGE (PDF with embedded canvas)
        async () => {
          await withBusy("pdf-share", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pdfBytes } = await buildExportAssets(redacted, shareUrl, { includePdf: true }, EXPORT_CAPTURE_ID);
              if (!pdfBytes) throw new Error("Failed to generate PDF");
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
              const pdfFile = blobToFile(pdfBlob, `${safeName}.pdf`);
              const shared = await shareFileOrFallback({
                file: pdfFile,
                title: `NBCard — ${redacted.fullName || profile.fullName || "NB-Card"}`,
                text: "Here's my NBCard profile",
                fallbackDownload: true,
              });
              if (shared) {
                toast.success("PDF shared");
              }
            } catch (error) {
              toast.error("Failed to share PDF");
              console.error(error);
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          await withBusy("text-share", async () => {
            const text = renderShareText(redacted, shareUrl);
            const ok = await shareViaWebShare({
              title: `NBCard — ${redacted.fullName || profile.fullName}`,
              text,
            });
            if (!ok) {
              await copyTextToClipboard(text);
              toast.success("Text copied to clipboard");
            } else {
              toast.success("Shared as text");
            }
          });
        }
      );
    });
  }

  function handlePrint() {
    setIsPrintOpen(true);
  }

  function openWhatsapp() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "WhatsApp",
        // IMAGE path
        async () => {
          await withBusy("whatsapp-share", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pngBlob } = await buildExportAssets(redacted, shareUrl, {}, EXPORT_CAPTURE_ID);
              void uploadCardOgImage(pngBlob, redacted, deviceId).catch(() => undefined);
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              const file = new File([pngBlob], `${safeName}_NBCard.png`, { type: "image/png" });
              // On mobile the share sheet lets the user pick WhatsApp directly
              const ok = await shareViaWebShare({
                title: `NBCard — ${redacted.fullName || profile.fullName}`,
                text: shareUrl,
                files: [file],
              });
              if (ok) {
                toast.success("Card image ready to share");
              } else {
                // File sharing not supported (desktop / HTTP). Download the PNG
                // AND open WhatsApp with the share link so the recipient sees a
                // branded card preview (og:image) even without the file attachment.
                downloadBlob(pngBlob, `${safeName}_NBCard.png`);
                window.open(
                  buildWhatsappUrl(`Check out my card: ${shareUrl}`),
                  "_blank",
                  "noopener,noreferrer"
                );
                toast.message("Image downloaded + WhatsApp opened", {
                  description:
                    "Attach the downloaded image to your WhatsApp chat for the full card design.",
                });
              }
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          await withBusy("whatsapp-text", async () => {
            const text = renderShareText(redacted, shareUrl);
            const ok = await shareViaWebShare({
              title: `NBCard — ${redacted.fullName || profile.fullName}`,
              text,
            });
            if (!ok) {
              window.open(buildWhatsappUrl(text), "_blank", "noopener,noreferrer");
            }
          });
        }
      );
    });
  }

  function openEmail() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "Email",
        // IMAGE path — share via Web Share API with PDF attachment (contains embedded canvas)
        async () => {
          await withBusy("email-image", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pdfBytes } = await buildExportAssets(redacted, shareUrl, { includePdf: true }, EXPORT_CAPTURE_ID);
              if (pdfBytes) {
                const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
                const pdfFile = new File([pdfBytes], `${safeName}_NBCard.pdf`, { type: "application/pdf" });
                const ok = await shareViaWebShare({
                  title: `NBCard — ${redacted.fullName || profile.fullName}`,
                  text: `My NBCard: ${shareUrl}`,
                  files: [pdfFile],
                });
                if (ok) {
                  toast.success("PDF ready to attach in email");
                  return;
                }
                // Fallback: download PDF then open mailto
                downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), `${safeName}_NBCard.pdf`);
                toast.message("PDF downloaded — attach it to your email");
              }
              window.location.href = buildMailtoUrl(redacted, shareUrl);
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          window.location.href = buildMailtoUrl(redacted, shareUrl);
        }
      );
    });
  }

  function openSms() {
    requestRedactionAndRun(async (redacted) => {
      requestShareMode(
        "SMS / Messages",
        // IMAGE path
        async () => {
          await withBusy("sms-image", async () => {
            mountExportCard(redacted);
            try {
              await waitForExportRender(EXPORT_CAPTURE_ID);
              const { pngBlob } = await buildExportAssets(redacted, shareUrl, {}, EXPORT_CAPTURE_ID);
              const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
              const file = new File([pngBlob], `${safeName}_NBCard.png`, { type: "image/png" });
              const ok = await shareViaWebShare({
                title: `NBCard — ${redacted.fullName || profile.fullName}`,
                text: shareUrl,
                files: [file],
              });
              if (ok) {
                toast.success("Card image ready to share");
              } else {
                downloadBlob(pngBlob, `${safeName}_NBCard.png`);
                toast.message("Image downloaded", { description: "Attach it to your message." });
                window.location.href = buildSmsUrl(redacted, shareUrl);
              }
            } finally {
              setExportCaptureProfile(null);
            }
          });
        },
        // TEXT path
        async () => {
          window.location.href = buildSmsUrl(redacted, shareUrl);
        }
      );
    });
  }

  async function handleExportContactsCsv() {
    await withBusy("contacts-csv", async () => {
      const csv = contactsToCsv(contacts);
      downloadBlob(new Blob([csv], { type: "text/csv" }), `nbcard_contacts.csv`);
      toast.success("Contacts CSV exported");
    });
  }

  async function handleExportJson() {
    await withBusy("json-export", async () => {
      const backup = createBackup(profiles, contacts);
      downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }), `nbcard_backup.json`);
      toast.success("Backup exported");
    });
  }

  async function handleImportJson(file: File) {
    await withBusy("json-import", async () => {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const backup = validateBackup(parsed);
      if (!backup) throw new Error("Invalid backup file");

      const migrated = migrateBackup(backup);
      const strategy: ConflictStrategy = "duplicate";

      const nextProfiles = mergeCards(profiles, migrated.cards, strategy);
      const nextContacts = mergeContacts(contacts, migrated.contacts, strategy);

      await importNbcardLocalState({
        schemaVersion: 1,
        profiles: nextProfiles,
        contacts: nextContacts,
        updatedAt: migrated.exportedAt || new Date().toISOString(),
      });

      onSetProfiles(nextProfiles);
      onSetContacts(nextContacts);
      toast.success("Backup imported");
    });
  }

  async function handleResetProfiles() {
    await withBusy("reset-profiles", async () => {
      await resetNbcardProfiles();
      toast.success("Profiles reset");
      onSetProfiles(profiles.slice(0, 1));
    });
  }

  async function handleResetContacts() {
    await withBusy("reset-contacts", async () => {
      await resetNbcardContacts();
      onSetContacts([]);
      toast.success("Contacts cleared");
    });
  }

  async function handleShareAsText() {
    requestRedactionAndRun(async (redacted) => {
      await withBusy("text-share", async () => {
        const text = renderShareText(redacted, shareUrl);
        const ok = await shareViaWebShare({
          title: `${redacted.fullName || profile.fullName} - Contact Info`,
          text,
        });
        if (!ok) {
          const copied = await copyTextToClipboard(text);
          if (copied) {
            toast.success("Contact info copied to clipboard");
          } else {
            toast.error("Failed to copy text");
          }
        } else {
          toast.success("Shared as text");
        }
      });
    });
  }

  async function handleShareViaEmail() {
    requestRedactionAndRun(async (redacted) => {
      await withBusy("email-share", async () => {
      // Try PDF with navigator.share first
      if (navigator.share && navigator.canShare) {
        try {
          mountExportCard(redacted);
          await waitForExportRender(EXPORT_CAPTURE_ID);
          const { pdfBytes } = await buildExportAssets(redacted, shareUrl, { includePdf: true }, EXPORT_CAPTURE_ID);
          if (!pdfBytes) throw new Error("Failed to generate PDF");
          const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
          const safeName = (redacted.fullName || profile.fullName || "nbcard").trim().replace(/\s+/g, "_");
          const fileName = `${safeName}_NBCard.pdf`;
          const file = new File([pdfBlob], fileName, { type: "application/pdf" });
          
          const canShareFile = navigator.canShare({ files: [file] });
          if (canShareFile) {
            const text = renderShareText(redacted, shareUrl);
            await navigator.share({
              title: `${redacted.fullName || profile.fullName} - NBCard`,
              text: text,
              files: [file],
            });
            toast.success("Shared via email");
            return;
          }
        } catch (e) {
          console.error("Share with PDF failed:", e);
        } finally {
          setExportCaptureProfile(null);
        }
      }
      
      // Fallback: mailto with text body
      const text = renderShareText(redacted, shareUrl);
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(`${redacted.fullName || profile.fullName} - NBCard`)}&body=${encodeURIComponent(text)}`;
      window.location.href = mailtoUrl;
      toast.message("Email opened", { description: "Attachments not supported via mailto." });
      });
    });
  }

  const savedCategoryOptions: Array<{ key: SavedCardCategory; label: string }> = React.useMemo(
    () => [
      { key: "PROFILE", label: "Profile" },
      { key: "ADDRESS", label: "Address" },
      { key: "BANK", label: "Bank" },
      { key: "BUSINESS", label: "Business" },
      { key: "FLYER", label: "Flyer" },
      { key: "WEDDING", label: "Wedding" },
    ],
    []
  );

  const activeSavedIdForCategory = activeSavedIds[savedCategory] ?? null;
  const savedCardsInCategory = React.useMemo(
    () =>
      savedCards
        .filter((c) => c.category === savedCategory)
        .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1)),
    [savedCards, savedCategory]
  );

  // Keep the editor draft in sync with the currently active profile.
  React.useEffect(() => {
    if (!isEditorOpen) {
      setEditorProfile(profile);
      setActiveEditorTab(getCategoryFromProfile(profile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id, isEditorOpen]);

  function updateActiveProfileSlot(nextProfile: Profile) {
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx < 0) {
      toast.error("Could not update active profile");
      return;
    }
    const next = [...profiles];
    next[idx] = nextProfile;
    onSetProfiles(next);
  }

  function withEditorDefaults(base: Profile, tab: SavedCardCategory): Profile {
    if (tab === "PROFILE") {
      return {
        ...base,
        cardCategory: "PROFILE",
        socialMedia: base.socialMedia ?? {},
      };
    }

    if (tab === "ADDRESS") {
      return {
        ...base,
        cardCategory: "ADDRESS",
        socialMedia: base.socialMedia ?? {},
        addressCard: {
          mapLinkLabel: "Click Here",
          phoneLabel: "Call",
          emailLabel: "Email",
          ...(base.addressCard ?? {}),
        },
      };
    }

    if (tab === "BANK") {
      return {
        ...base,
        cardCategory: "BANK",
        socialMedia: base.socialMedia ?? {},
        bankCard: {
          paymentLinkLabel: "Send Money",
          ...(base.bankCard ?? {}),
        },
      };
    }

    if (tab === "BUSINESS") {
      return {
        ...base,
        cardCategory: "BUSINESS",
        socialMedia: base.socialMedia ?? {},
        businessCard: {
          bookingLinkLabel: "Book Now",
          ...(base.businessCard ?? {}),
        },
      };
    }

    if (tab === "FLYER") {
      return {
        ...base,
        cardCategory: "FLYER",
        socialMedia: base.socialMedia ?? {},
        flyerCard: {
          ...(base.flyerCard ?? {}),
        },
      };
    }

    if (tab === "WEDDING") {
      return {
        ...base,
        cardCategory: "WEDDING",
        socialMedia: base.socialMedia ?? {},
        weddingCard: {
          ...(base.weddingCard ?? {}),
        },
      };
    }

    return { ...base, socialMedia: base.socialMedia ?? {} };
  }

  function openFocusedEditor(tab: SavedCardCategory) {
    setSavedCategory(tab);
    setActiveEditorTab(tab);

    const nextProfile = withEditorDefaults(profile, tab);
    setEditorProfile(nextProfile);
    updateActiveProfileSlot(nextProfile);
    setIsEditorOpen(true);
  }

  async function handleEditorPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const assetKey = generateAssetKey("avatar");
      const localUrl = await storeAsset(file, assetKey, sessionEmail ?? undefined);
      const next = { ...editorProfile, photoUrl: localUrl };
      setEditorProfile(next);
      updateActiveProfileSlot(next);
      toast.success("Photo uploaded and stored locally");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleEditorBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const assetKey = generateAssetKey("bg");
      const localUrl = await storeAsset(file, assetKey, sessionEmail ?? undefined);
      const next = { ...editorProfile, backgroundUrl: localUrl, frameUrl: undefined };
      setEditorProfile(next);
      updateActiveProfileSlot(next);
      toast.success("Background uploaded and stored locally");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload background");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleEditorClearBackground() {
    const next = { ...editorProfile, backgroundUrl: undefined, frameUrl: undefined };
    setEditorProfile(next);
    updateActiveProfileSlot(next);
  }

  function flushNamespacedStateNow() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        `${NAMESPACED_STATE_KEY_PREFIX}${storageNamespace}`,
        JSON.stringify({
          schemaVersion: 1,
          profiles,
          contacts,
          updatedAt: new Date().toISOString(),
        })
      );
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    }
  }

  function handleLoadSavedCard(cardId: string) {
    const card = savedCards.find((c) => c.id === cardId);
    if (!card) {
      toast.error("Saved card not found");
      return;
    }

    updateActiveProfileSlot(card.snapshot);
    setSavedCategory(card.category);
    setNbcardActiveSavedCardId(savedCardsNamespace, card.category, card.id);
    setActiveSavedIds((prev) => ({ ...prev, [card.category]: card.id }));
    toast.success("Loaded saved card");
  }

  function handleSaveCurrentAsNew() {
    const id = generateProfileId();
    const nextProfile: Profile = normalizeProfileForCategory(
      {
        ...profile,
        id,
        frameUrl: profile.frameUrl,
        backgroundUrl: profile.backgroundUrl,
        photoUrl: profile.photoUrl,
      },
      savedCategory
    );

    const record: NbcardSavedCard = {
      id,
      title: `${savedCategoryOptions.find((c) => c.key === savedCategory)?.label ?? "Card"} — ${profile.fullName || "Untitled"}`,
      category: savedCategory,
      snapshot: nextProfile,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const nextCards = upsertNbcardSavedCard(savedCardsNamespace, record);
    setSavedCards(nextCards);
    setNbcardActiveSavedCardId(savedCardsNamespace, savedCategory, id);
    setActiveSavedIds((prev) => ({ ...prev, [savedCategory]: id }));

    // Load immediately so the user can edit/share this exact snapshot.
    updateActiveProfileSlot(nextProfile);
    toast.success("Saved & loaded");
  }

  function handleUpdateSelected() {
    const activeId = activeSavedIdForCategory;
    if (!activeId) {
      toast.message("Select a saved card first");
      return;
    }
    if (profile.id !== activeId) {
      toast.message("Load the saved card first", { description: "Then edit and update it." });
      return;
    }

    const existing = savedCards.find((c) => c.id === activeId);
    if (!existing) {
      toast.error("Saved card not found");
      return;
    }

    const nextProfile = normalizeProfileForCategory(profile, savedCategory);

    const nextCards = upsertNbcardSavedCard(savedCardsNamespace, {
      ...existing,
      category: savedCategory,
      snapshot: nextProfile,
      title: existing.title,
      createdAt: existing.createdAt,
    });
    setSavedCards(nextCards);
    toast.success("Saved card updated");
  }

  function handleNewEmptyCard() {
    const id = generateProfileId();
    const cleared: Profile = {
      ...profile,
      id,
      fullName: "",
      jobTitle: "",
      phone: "",
      email: "",
      profileDescription: "",
      businessDescription: "",
      address: "",
      website: "",
      wellbeingLink: "",
      bankSortCode: "",
      bankAccountNumber: "",
      socialMedia: {},
      photoUrl: undefined,
      backgroundUrl: undefined,
      frameUrl: undefined,
    };

    const nextProfile = normalizeProfileForCategory(cleared, savedCategory);
    updateActiveProfileSlot(nextProfile);

    // A new draft is not a saved record yet.
    setNbcardActiveSavedCardId(savedCardsNamespace, savedCategory, null);
    setActiveSavedIds((prev) => {
      const next = { ...prev };
      delete next[savedCategory];
      return next;
    });

    toast.message("New empty card", { description: "This draft is not saved until you click ‘Save current as new’." });
  }

  function handleRename(cardId: string) {
    const existing = savedCards.find((c) => c.id === cardId);
    if (!existing) return;
    const nextName = prompt("Rename saved card", existing.title)?.trim();
    if (!nextName) return;
    const nextCards = upsertNbcardSavedCard(savedCardsNamespace, { ...existing, title: nextName });
    setSavedCards(nextCards);
    toast.success("Renamed");
  }

  function handleDuplicate(cardId: string) {
    const existing = savedCards.find((c) => c.id === cardId);
    if (!existing) return;
    const id = generateProfileId();
    const clonedProfile = { ...existing.snapshot, id };
    const nextCards = upsertNbcardSavedCard(savedCardsNamespace, {
      ...existing,
      id,
      title: `${existing.title} (copy)`,
      snapshot: clonedProfile,
      createdAt: Date.now(),
    });
    setSavedCards(nextCards);
    toast.success("Duplicated");
  }

  function handleDelete(cardId: string) {
    if (!confirm("Delete this saved card?")) return;
    const nextCards = deleteNbcardSavedCard(savedCardsNamespace, cardId);
    setSavedCards(nextCards);
    setActiveSavedIds(loadNbcardActiveSavedCardIds(savedCardsNamespace));
    toast.success("Deleted");
  }

  return (
    <div className="rounded-2xl border bg-card p-3 sm:p-4 md:p-6">
      {/* Off-screen clean-mode export card: no editor UI (editMode=false, no selected layer) */}
      {exportCaptureProfile ? (
        <div
          className="fixed left-[-10000px] top-0"
          aria-hidden="true"
          style={{
            width: `${exportCaptureWidth}px`,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
          }}
        >
          <ProfileCard
            profile={exportCaptureProfile}
            showEditButton={false}
            userEmail={undefined}
            templateSelection={templateSelection}
            selectedTemplate={selectedTemplate}
            captureId={EXPORT_CAPTURE_ID}
            editMode={false}
            selectedLayerId={null}
          />
        </div>
      ) : null}

      {/* Hidden QR element used exclusively for QR Card image composite export */}
      <div className="fixed left-[-10000px] top-0 pointer-events-none select-none" aria-hidden="true">
        {hasMounted ? <QRCodeSVG id="nbcard-qr-composite" value={qrValue} size={256} level="M" /> : null}
      </div>

      <RedactionDialog
        isOpen={isRedactionOpen}
        profile={profile}
        onClose={() => {
          setIsRedactionOpen(false);
          setPendingRedactionAction(null);
        }}
        onConfirm={(fields) => {
          setIsRedactionOpen(false);
          const action = pendingRedactionAction;
          setPendingRedactionAction(null);
          action?.(fields);
        }}
      />

      <ShareModeDialog
        open={!!pendingShare}
        channel={pendingShare?.channel ?? "Share"}
        onSelect={async (mode: ShareMode) => {
          const action = pendingShare;
          setPendingShare(null);
          if (!action) return;
          if (mode === "image") await action.onImage();
          else await action.onText();
        }}
        onCancel={() => setPendingShare(null)}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold">Share Your Profile</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Export as QR/PDF/vCard/image, or share via WhatsApp, email, or SMS.</p>
          {!sessionEmail ? (
            <p className="mt-2 text-sm text-purple-600 font-medium">
              💡 <Link href="/signin" className="underline hover:text-purple-700">Sign in</Link> to save your cards across devices and access advanced features.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Button variant="outline" size="sm" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm" onClick={handleCopyLink} disabled={!!busyKey}>
            <LinkIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Copy Link
          </Button>

          <Button size="sm" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm" onClick={handleShareNative} disabled={!!busyKey}>
            <Share2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm" disabled={!!busyKey}>
                <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Exports</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsQrOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadQrCardImage} disabled={!!busyKey}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Card Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint} disabled={!!busyKey}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </DropdownMenuItem>
              {/* Business card exports */}
              {selectedTemplate?.cardCategory === 'BUSINESS' && selectedTemplate?.side ? (
                <>
                  <DropdownMenuItem onClick={handleDownloadPng} disabled={!!busyKey}>
                    Export {selectedTemplate.side === 'front' ? 'Front' : 'Back'} PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPdf} disabled={!!busyKey}>
                    Export {selectedTemplate.side === 'front' ? 'Front' : 'Back'} PDF
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleDownloadPdf} disabled={!!busyKey}>
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPng} disabled={!!busyKey}>
                    Download PNG
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={handleSharePng} disabled={!!busyKey}>
                Share PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSharePdf} disabled={!!busyKey}>
                Share PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadVcard} disabled={!!busyKey}>
                Download vCard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareVcardFile} disabled={!!busyKey}>
                Share vCard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleShareAsText} disabled={!!busyKey}>
                Share as Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareViaEmail} disabled={!!busyKey}>
                <Mail className="mr-2 h-4 w-4" />
                Share via Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportContactsCsv} disabled={!!busyKey}>
                Export contacts CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {showPrivacyControls ? (
                <DropdownMenuItem onClick={() => setIsPrivacyOpen(true)}>Privacy & Storage</DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm" onClick={openWhatsapp} disabled={!!busyKey}>
            <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm" onClick={openEmail} disabled={!!busyKey}>
            <Mail className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="h-8 sm:h-10 px-2.5 sm:px-4 text-xs sm:text-sm" onClick={openSms} disabled={!!busyKey}>
            SMS
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-muted/20 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Saved Cards</div>
            <div className="text-xs text-muted-foreground">Save multiple cards per category and load instantly before sharing.</div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3" onClick={() => handleSaveCurrentAsNew()} disabled={!!busyKey}>
              Save current as new
            </Button>
            <Button size="sm" variant="secondary" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3" onClick={handleUpdateSelected} disabled={!!busyKey || !activeSavedIdForCategory}>
              Overwrite selected
            </Button>
            <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3" onClick={handleNewEmptyCard} disabled={!!busyKey}>
              New empty card
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {savedCategoryOptions.map((c) => (
            <Button
              key={c.key}
              type="button"
              size="sm"
              className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              variant={savedCategory === c.key ? "default" : "outline"}
              onClick={() => openFocusedEditor(c.key)}
              disabled={!!busyKey}
            >
              {c.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {savedCardsInCategory.length === 0 ? (
            <div className="text-sm text-muted-foreground">No saved cards yet for this category.</div>
          ) : null}

          {savedCardsInCategory.map((c) => {
            const isActive = c.id === activeSavedIdForCategory;
            const bgSrc = c.snapshot.frameUrl || c.snapshot.backgroundUrl;
            const canUseImageBg = typeof bgSrc === "string" && bgSrc.length > 0 && !bgSrc.startsWith("local://");
            const canUseNextImage = canUseImageBg && typeof bgSrc === "string" && bgSrc.startsWith("/");

            return (
              <div key={c.id} className={`rounded-lg border p-3 ${isActive ? "border-primary" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-20 overflow-hidden rounded-md border bg-gradient-to-br from-purple-600 to-blue-500" aria-hidden="true">
                      {canUseNextImage ? <Image src={bgSrc} alt="" width={80} height={48} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(c.updatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isActive ? "secondary" : "default"}
                    onClick={() => handleLoadSavedCard(c.id)}
                    disabled={!!busyKey}
                  >
                    {isActive ? "Loaded" : "Load"}
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleRename(c.id)} disabled={!!busyKey}>
                    Rename
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDuplicate(c.id)} disabled={!!busyKey}>
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)} disabled={!!busyKey}>
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-2xl" aria-describedby="nbcard-editor-desc">
          <DialogHeader>
            <DialogTitle>
              {activeEditorTab === "PROFILE"
                ? "Edit Profile"
                : activeEditorTab === "ADDRESS"
                ? "Edit Address Card"
                : activeEditorTab === "BANK"
                ? "Edit Bank Card"
                : activeEditorTab === "BUSINESS"
                ? "Edit Business Card"
                : activeEditorTab === "FLYER"
                ? "Edit Flyer Card"
                : "Edit Wedding Card"}
            </DialogTitle>
            <DialogDescription id="nbcard-editor-desc">
              Changes update the live card instantly and autosave on this device.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-1">
            {saveStatus === "saving" ? <div className="text-xs text-muted-foreground italic">Saving…</div> : null}
            {saveStatus === "saved" ? <div className="text-xs text-green-600 font-semibold">✓ Saved</div> : null}

            {activeEditorTab === "PROFILE" ? (
              <div className="mt-4 space-y-6">
                <GradientSelector
                  selectedGradient={editorProfile.gradient}
                  onSelect={(gradient) => {
                    const next = { ...editorProfile, gradient };
                    setEditorProfile(next);
                    updateActiveProfileSlot(next);
                  }}
                  onClearBackground={editorProfile.backgroundUrl ? handleEditorClearBackground : undefined}
                />

                <div>
                  <label htmlFor="nbcard-editor-bg" className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Background (optional)
                  </label>

                  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Professional frames made for you</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Choose a frame style for how you want your profile presented.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setSelectedFrameCategory("ADDRESS")}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedFrameCategory === "ADDRESS"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Address details
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFrameCategory("BANK")}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedFrameCategory === "BANK"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Bank details
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFrameCategory("BUSINESS")}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedFrameCategory === "BUSINESS"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Business profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFrameCategory("FLYER")}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedFrameCategory === "FLYER"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Flyer
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFrameCategory("WEDDING")}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          selectedFrameCategory === "WEDDING"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Wedding
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFrameChooser(true)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                      disabled={uploading}
                    >
                      Browse Professional Frames
                    </button>
                  </div>

                  <input
                    ref={backgroundInputRef}
                    id="nbcard-editor-bg"
                    type="file"
                    accept="image/*"
                    onChange={handleEditorBackgroundUpload}
                    className="hidden"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => backgroundInputRef.current?.click()}
                      disabled={uploading}
                      className="flex-1 px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {uploading
                        ? "Uploading…"
                        : editorProfile.backgroundUrl || editorProfile.frameUrl
                        ? "Change Background Image"
                        : "Upload Background Image"}
                    </button>

                    {(editorProfile.backgroundUrl || editorProfile.frameUrl) && (
                      <button
                        type="button"
                        onClick={handleEditorClearBackground}
                        className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Use Gradient
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="nbcard-editor-photo" className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <input
                    ref={photoInputRef}
                    id="nbcard-editor-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleEditorPhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {uploading ? "Uploading…" : editorProfile.photoUrl ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="nbcard-editor-fullName"
                      type="text"
                      required
                      autoFocus
                      value={editorProfile.fullName}
                      onChange={(e) => {
                        const next = { ...editorProfile, fullName: e.target.value };
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      id="nbcard-editor-jobTitle"
                      type="text"
                      required
                      value={editorProfile.jobTitle}
                      onChange={(e) => {
                        const next = { ...editorProfile, jobTitle: e.target.value };
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      id="nbcard-editor-phone"
                      type="tel"
                      value={editorProfile.phone}
                      onChange={(e) => {
                        const next = { ...editorProfile, phone: e.target.value };
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="nbcard-editor-email"
                      type="email"
                      value={editorProfile.email}
                      onChange={(e) => {
                        const next = { ...editorProfile, email: e.target.value };
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="nbcard-editor-website" className="block text-sm font-semibold text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      id="nbcard-editor-website"
                      type="url"
                      value={editorProfile.website ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const next = {
                          ...editorProfile,
                          website: value,
                          socialMedia: { ...(editorProfile.socialMedia ?? {}), website: value },
                        };
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nbcard-editor-profileDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Description ({(editorProfile.profileDescription ?? "").length}/50)
                  </label>
                  <input
                    id="nbcard-editor-profileDescription"
                    type="text"
                    maxLength={50}
                    value={editorProfile.profileDescription}
                    onChange={(e) => {
                      const next = { ...editorProfile, profileDescription: e.target.value };
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {([
                      { key: "instagram", label: "Instagram", placeholder: "Instagram profile URL" },
                      { key: "facebook", label: "Facebook", placeholder: "Facebook profile URL" },
                      { key: "tiktok", label: "TikTok", placeholder: "TikTok profile URL" },
                      { key: "linkedin", label: "LinkedIn", placeholder: "LinkedIn profile URL" },
                      { key: "twitter", label: "X (Twitter)", placeholder: "X profile URL" },
                    ] as const).map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label htmlFor={`nbcard-editor-social-${key}`} className="block text-sm font-semibold text-gray-700 mb-2">
                          {label}
                        </label>
                        <input
                          id={`nbcard-editor-social-${key}`}
                          type="url"
                          value={editorProfile.socialMedia?.[key] ?? ""}
                          onChange={(e) => {
                            const next = {
                              ...editorProfile,
                              socialMedia: { ...(editorProfile.socialMedia ?? {}), [key]: e.target.value },
                            };
                            setEditorProfile(next);
                            updateActiveProfileSlot(next);
                          }}
                          placeholder={placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeEditorTab === "ADDRESS" ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-recipient" className="block text-sm font-semibold text-gray-700 mb-2">
                      Recipient Name (optional)
                    </label>
                    <input
                      id="nbcard-editor-recipient"
                      type="text"
                      autoFocus
                      value={editorProfile.addressCard?.recipientName ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), recipientName: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-mapLabel" className="block text-sm font-semibold text-gray-700 mb-2">
                      Map Link Label
                    </label>
                    <input
                      id="nbcard-editor-mapLabel"
                      type="text"
                      value={editorProfile.addressCard?.mapLinkLabel ?? "Click Here"}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), mapLinkLabel: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-address1" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      id="nbcard-editor-address1"
                      type="text"
                      value={editorProfile.addressCard?.addressLine1 ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), addressLine1: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-address2" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      id="nbcard-editor-address2"
                      type="text"
                      value={editorProfile.addressCard?.addressLine2 ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), addressLine2: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="nbcard-editor-city"
                      type="text"
                      value={editorProfile.addressCard?.city ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), city: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-postcode" className="block text-sm font-semibold text-gray-700 mb-2">
                      Postcode
                    </label>
                    <input
                      id="nbcard-editor-postcode"
                      type="text"
                      value={editorProfile.addressCard?.postcode ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), postcode: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="nbcard-editor-country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      id="nbcard-editor-country"
                      type="text"
                      value={editorProfile.addressCard?.country ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), country: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nbcard-editor-directions" className="block text-sm font-semibold text-gray-700 mb-2">
                    Directions Note (optional, short)
                  </label>
                  <input
                    id="nbcard-editor-directions"
                    type="text"
                    maxLength={60}
                    value={editorProfile.addressCard?.directionsNote ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        {
                          ...editorProfile,
                          addressCard: { ...(editorProfile.addressCard ?? {}), directionsNote: e.target.value },
                        },
                        "ADDRESS"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="nbcard-editor-mapOverride" className="block text-sm font-semibold text-gray-700 mb-2">
                    Map Query Override (optional)
                  </label>
                  <input
                    id="nbcard-editor-mapOverride"
                    type="text"
                    value={editorProfile.addressCard?.mapQueryOverride ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        {
                          ...editorProfile,
                          addressCard: { ...(editorProfile.addressCard ?? {}), mapQueryOverride: e.target.value },
                        },
                        "ADDRESS"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-phoneLabel" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Label
                    </label>
                    <input
                      id="nbcard-editor-phoneLabel"
                      type="text"
                      value={editorProfile.addressCard?.phoneLabel ?? "Call"}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), phoneLabel: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-emailLabel" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Label
                    </label>
                    <input
                      id="nbcard-editor-emailLabel"
                      type="text"
                      value={editorProfile.addressCard?.emailLabel ?? "Email"}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          {
                            ...editorProfile,
                            addressCard: { ...(editorProfile.addressCard ?? {}), emailLabel: e.target.value },
                          },
                          "ADDRESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeEditorTab === "BANK" ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-bank-accountName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      id="nbcard-editor-bank-accountName"
                      type="text"
                      autoFocus
                      value={editorProfile.bankCard?.accountName ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), accountName: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-bank-bankName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      id="nbcard-editor-bank-bankName"
                      type="text"
                      value={editorProfile.bankCard?.bankName ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), bankName: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-bank-sortCode" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sort Code
                    </label>
                    <input
                      id="nbcard-editor-bank-sortCode"
                      type="text"
                      value={editorProfile.bankCard?.sortCode ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), sortCode: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-bank-accountNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      id="nbcard-editor-bank-accountNumber"
                      type="text"
                      value={editorProfile.bankCard?.accountNumber ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), accountNumber: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-bank-iban" className="block text-sm font-semibold text-gray-700 mb-2">
                      IBAN (optional)
                    </label>
                    <input
                      id="nbcard-editor-bank-iban"
                      type="text"
                      value={editorProfile.bankCard?.iban ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), iban: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-bank-swift" className="block text-sm font-semibold text-gray-700 mb-2">
                      SWIFT/BIC (optional)
                    </label>
                    <input
                      id="nbcard-editor-bank-swift"
                      type="text"
                      value={editorProfile.bankCard?.swiftBic ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), swiftBic: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-bank-paymentLink" className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Link (optional)
                    </label>
                    <input
                      id="nbcard-editor-bank-paymentLink"
                      type="url"
                      value={editorProfile.bankCard?.paymentLink ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), paymentLink: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-bank-paymentLabel" className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Link Label
                    </label>
                    <input
                      id="nbcard-editor-bank-paymentLabel"
                      type="text"
                      value={editorProfile.bankCard?.paymentLinkLabel ?? "Send Money"}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), paymentLinkLabel: e.target.value } },
                          "BANK"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="nbcard-editor-bank-reference" className="block text-sm font-semibold text-gray-700 mb-2">
                    Reference Note (optional, short)
                  </label>
                  <input
                    id="nbcard-editor-bank-reference"
                    type="text"
                    maxLength={60}
                    value={editorProfile.bankCard?.referenceNote ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        { ...editorProfile, bankCard: { ...(editorProfile.bankCard ?? {}), referenceNote: e.target.value } },
                        "BANK"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : null}

            {activeEditorTab === "FLYER" ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="nbcard-editor-flyer-headline" className="block text-sm font-semibold text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    id="nbcard-editor-flyer-headline"
                    type="text"
                    autoFocus
                    value={editorProfile.flyerCard?.headline ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        { ...editorProfile, flyerCard: { ...(editorProfile.flyerCard ?? {}), headline: e.target.value } },
                        "FLYER"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="nbcard-editor-flyer-subheadline" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subheadline (optional)
                  </label>
                  <input
                    id="nbcard-editor-flyer-subheadline"
                    type="text"
                    value={editorProfile.flyerCard?.subheadline ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        { ...editorProfile, flyerCard: { ...(editorProfile.flyerCard ?? {}), subheadline: e.target.value } },
                        "FLYER"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-flyer-ctaText" className="block text-sm font-semibold text-gray-700 mb-2">
                      CTA Text (optional)
                    </label>
                    <input
                      id="nbcard-editor-flyer-ctaText"
                      type="text"
                      value={editorProfile.flyerCard?.ctaText ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, flyerCard: { ...(editorProfile.flyerCard ?? {}), ctaText: e.target.value } },
                          "FLYER"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-flyer-ctaUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      CTA URL (optional)
                    </label>
                    <input
                      id="nbcard-editor-flyer-ctaUrl"
                      type="url"
                      value={editorProfile.flyerCard?.ctaUrl ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, flyerCard: { ...(editorProfile.flyerCard ?? {}), ctaUrl: e.target.value } },
                          "FLYER"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeEditorTab === "WEDDING" ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="nbcard-editor-wedding-headline" className="block text-sm font-semibold text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    id="nbcard-editor-wedding-headline"
                    type="text"
                    autoFocus
                    value={editorProfile.weddingCard?.headline ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        { ...editorProfile, weddingCard: { ...(editorProfile.weddingCard ?? {}), headline: e.target.value } },
                        "WEDDING"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="nbcard-editor-wedding-subheadline" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subheadline (optional)
                  </label>
                  <input
                    id="nbcard-editor-wedding-subheadline"
                    type="text"
                    value={editorProfile.weddingCard?.subheadline ?? ""}
                    onChange={(e) => {
                      const next = withEditorDefaults(
                        { ...editorProfile, weddingCard: { ...(editorProfile.weddingCard ?? {}), subheadline: e.target.value } },
                        "WEDDING"
                      );
                      setEditorProfile(next);
                      updateActiveProfileSlot(next);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-wedding-ctaText" className="block text-sm font-semibold text-gray-700 mb-2">
                      CTA Text (optional)
                    </label>
                    <input
                      id="nbcard-editor-wedding-ctaText"
                      type="text"
                      value={editorProfile.weddingCard?.ctaText ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, weddingCard: { ...(editorProfile.weddingCard ?? {}), ctaText: e.target.value } },
                          "WEDDING"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-wedding-ctaUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      CTA URL (optional)
                    </label>
                    <input
                      id="nbcard-editor-wedding-ctaUrl"
                      type="url"
                      value={editorProfile.weddingCard?.ctaUrl ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, weddingCard: { ...(editorProfile.weddingCard ?? {}), ctaUrl: e.target.value } },
                          "WEDDING"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeEditorTab === "BUSINESS" ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-business-company" className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      id="nbcard-editor-business-company"
                      type="text"
                      autoFocus
                      value={editorProfile.businessCard?.companyName ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), companyName: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-business-tagline" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tagline (optional, short)
                    </label>
                    <input
                      id="nbcard-editor-business-tagline"
                      type="text"
                      maxLength={60}
                      value={editorProfile.businessCard?.tagline ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), tagline: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="nbcard-editor-business-services" className="block text-sm font-semibold text-gray-700 mb-2">
                      Services (short, max 80)
                    </label>
                    <input
                      id="nbcard-editor-business-services"
                      type="text"
                      maxLength={80}
                      value={editorProfile.businessCard?.services ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), services: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-business-website" className="block text-sm font-semibold text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      id="nbcard-editor-business-website"
                      type="url"
                      value={editorProfile.businessCard?.websiteUrl ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), websiteUrl: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-business-location" className="block text-sm font-semibold text-gray-700 mb-2">
                      Location Note (optional)
                    </label>
                    <input
                      id="nbcard-editor-business-location"
                      type="text"
                      maxLength={60}
                      value={editorProfile.businessCard?.locationNote ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), locationNote: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-business-hours" className="block text-sm font-semibold text-gray-700 mb-2">
                      Hours (optional)
                    </label>
                    <input
                      id="nbcard-editor-business-hours"
                      type="text"
                      maxLength={60}
                      value={editorProfile.businessCard?.hours ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), hours: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-business-vat" className="block text-sm font-semibold text-gray-700 mb-2">
                      VAT/Reg No (optional)
                    </label>
                    <input
                      id="nbcard-editor-business-vat"
                      type="text"
                      value={editorProfile.businessCard?.vatOrRegNo ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), vatOrRegNo: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nbcard-editor-business-booking" className="block text-sm font-semibold text-gray-700 mb-2">
                      Booking Link (optional)
                    </label>
                    <input
                      id="nbcard-editor-business-booking"
                      type="url"
                      value={editorProfile.businessCard?.bookingLink ?? ""}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), bookingLink: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="nbcard-editor-business-bookingLabel" className="block text-sm font-semibold text-gray-700 mb-2">
                      Booking Link Label
                    </label>
                    <input
                      id="nbcard-editor-business-bookingLabel"
                      type="text"
                      value={editorProfile.businessCard?.bookingLinkLabel ?? "Book Now"}
                      onChange={(e) => {
                        const next = withEditorDefaults(
                          { ...editorProfile, businessCard: { ...(editorProfile.businessCard ?? {}), bookingLinkLabel: e.target.value } },
                          "BUSINESS"
                        );
                        setEditorProfile(next);
                        updateActiveProfileSlot(next);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={flushNamespacedStateNow}>
              Save
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showFrameChooser ? (
        <FrameChooser
          category={selectedFrameCategory}
          onSelect={(frameUrl) => {
            const next = { ...editorProfile, frameUrl, backgroundUrl: undefined };
            setEditorProfile(next);
            updateActiveProfileSlot(next);
            setShowFrameChooser(false);
          }}
          onClose={() => setShowFrameChooser(false)}
        />
      ) : null}

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan to import card data directly. Card data mode encodes your
              contact details into the QR code so scanners can save them
              without visiting a link.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="text-sm">
                <div className="font-medium">Card data mode</div>
                <div className="text-muted-foreground">Encodes card data directly into QR (falls back to link if too large).</div>
              </div>
              <Button
                type="button"
                variant={isQrVcard ? "default" : "outline"}
                onClick={() => {
                  const next = !isQrVcard;
                  if (!next) {
                    setIsQrVcard(false);
                    return;
                  }

                  const category = getCategoryFromProfile(profile);

                  if (category === "BANK" || category === "FLYER" || category === "WEDDING") {
                    setIsQrVcard(true);
                    return;
                  }

                  requestRedactionAndRun(async (redacted) => {
                    const vcard = generateProfileVCard(redacted, {
                      includeAddress: category === "ADDRESS",
                      includeBusiness: category === "BUSINESS" || category === "PROFILE",
                      shareUrl,
                    });
                    if (vcard.length > 2000) {
                      toast.message("Card data too large for QR", { description: "Using link QR instead." });
                      setIsQrVcard(false);
                      return;
                    }
                    setIsQrVcard(true);
                  });
                }}
              >
                {isQrVcard ? "On" : "Off"}
              </Button>
            </div>

          <div className="flex items-center justify-center rounded-xl border bg-muted/30 p-4">
            {hasMounted ? <QRCodeSVG id="nbcard-qr-svg" value={qrValue} size={260} includeMargin level="M" /> : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCopyLink}>
              Copy Link
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await withBusy("qr-png", async () => {
                  const svg = document.getElementById("nbcard-qr-svg");
                  if (!svg) throw new Error("QR not found");
                  const xml = new XMLSerializer().serializeToString(svg);
                  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
                  const pngBlob = await dataUrlToPngBlob(svgDataUrl);
                  downloadBlob(pngBlob, `${profile.fullName.replace(/\s+/g, "_")}_QR.png`);
                  toast.success("QR downloaded");
                });
              }}
              disabled={!!busyKey}
            >
              Download QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPrivacyControls ? (
        <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Privacy & Data Controls</DialogTitle>
              <DialogDescription>Your profiles and captured contacts are stored locally on this device.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Backup</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleExportJson} disabled={!!busyKey}>
                    Export JSON
                  </Button>
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        await handleImportJson(f);
                        e.target.value = "";
                      }}
                    />
                    <Button asChild variant="outline" disabled={!!busyKey}>
                      <span>Import JSON</span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Reset</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="destructive" onClick={handleResetProfiles} disabled={!!busyKey}>
                    Reset Profiles
                  </Button>
                  <Button variant="destructive" onClick={handleResetContacts} disabled={!!busyKey}>
                    Clear Contacts
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" onClick={() => setIsPrivacyOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Print your card</DialogTitle>
            <DialogDescription>
              Download a high-quality PDF then open it in any PDF viewer to print, or use browser print.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Recommended: PDF download for best quality */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Recommended</p>
              <Button
                className="w-full"
                onClick={() => {
                  setIsPrintOpen(false);
                  handleDownloadPdf();
                }}
                disabled={!!busyKey}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF for printing
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Best quality &#8212; open the PDF in any viewer and set paper size when printing.
              </p>
            </div>

            {/* Business card front + back guidance */}
            {getCategoryFromProfile(profile) === "BUSINESS" ? (
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs font-semibold text-blue-900 mb-1">Printing front &amp; back</p>
                <ol className="text-xs text-blue-800 list-decimal list-inside space-y-1">
                  <li>Download PDF of the front side (above)</li>
                  <li>Switch to the back template using the template picker</li>
                  <li>Download PDF of the back side</li>
                  <li>Print both at business card size (85&#215;55&nbsp;mm / 3.5&#215;2&nbsp;in)</li>
                </ol>
              </div>
            ) : null}

            {/* Browser print fallback */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Browser print</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsPrintOpen(false); window.print(); }}
                >
                  A4 (210&#215;297&nbsp;mm)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsPrintOpen(false); window.print(); }}
                >
                  Letter (8.5&#215;11&nbsp;in)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Browser print captures the visible page; use PDF download for exact card output.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsPrintOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/*
 * Legacy share-buttons implementation kept temporarily for safety.
 * It is fully commented out to avoid build/typecheck issues.
 
      const linkHeight = 8; // Height of clickable area
      const cardCenterX = cardX + (cardWidth / 2);
      
      // Phone link overlay (appears around 60% down the card)
      if (profile?.phone) {
        const phoneY = cardY + (cardHeight * 0.55);
        pdf.link(cardX + 15, phoneY - 4, cardWidth - 30, linkHeight, {
          url: `tel:${profile.phone.replace(/\s/g, "")}`,
        });
      }

      // Email link overlay (appears around 65% down the card)
      if (profile?.email) {
        const emailY = cardY + (cardHeight * 0.62);
        pdf.link(cardX + 15, emailY - 4, cardWidth - 30, linkHeight, {
          url: `mailto:${profile.email}`,
        });
      }

      // Social media links overlay (appear around 70-85% down the card)
      const socialMediaY = cardY + (cardHeight * 0.72);
      const socialIconSize = 12;
      const socialGap = 4;
      
      const socialLinks = [
        { url: profile?.socialMedia?.instagram },
        { url: profile?.socialMedia?.facebook },
        { url: profile?.socialMedia?.tiktok },
        { url: profile?.socialMedia?.linkedin },
        { url: profile?.socialMedia?.twitter },
        { url: profile?.socialMedia?.website },
      ].filter(link => link.url);

      // Calculate starting X for centered social media icons
      const totalSocialWidth = (socialLinks.length * socialIconSize) + ((socialLinks.length - 1) * socialGap);
      let socialX = cardCenterX - (totalSocialWidth / 2);

      socialLinks.forEach((link) => {
        if (link.url) {
          pdf.link(socialX, socialMediaY - 4, socialIconSize, socialIconSize, {
            url: link.url,
          });
          socialX += socialIconSize + socialGap;
        }
      });

      // Add text information below the card with clickable links
      let currentY = cardY + cardHeight + 15;

      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "bold");
      pdf.text("Contact Information", cardX, currentY);
      currentY += 10;

      // Phone (visible clickable text)
      if (profile?.phone) {
        pdf.setFontSize(11);
        pdf.setTextColor(147, 51, 234);
        pdf.setFont("helvetica", "normal");
        pdf.textWithLink(`📞 ${profile.phone}`, cardX, currentY, {
          url: `tel:${profile.phone.replace(/\s/g, "")}`,
        });
        currentY += 6;
      }

      // Email (visible clickable text)
      if (profile?.email) {
        pdf.setFontSize(11);
        pdf.setTextColor(59, 130, 246);
        pdf.textWithLink(`📧 ${profile.email}`, cardX, currentY, {
          url: `mailto:${profile.email}`,
        });
        currentY += 6;
      }

      // Social Media Links (visible clickable text)
      const visibleSocialLinks = [
        { icon: "🌐", name: "Website", url: profile?.socialMedia?.website },
        { icon: "📷", name: "Instagram", url: profile?.socialMedia?.instagram },
        { icon: "👤", name: "Facebook", url: profile?.socialMedia?.facebook },
        { icon: "🐦", name: "Twitter", url: profile?.socialMedia?.twitter },
        { icon: "💼", name: "LinkedIn", url: profile?.socialMedia?.linkedin },
        { icon: "🎵", name: "TikTok", url: profile?.socialMedia?.tiktok },
      ].filter(link => link.url);

      if (visibleSocialLinks.length > 0) {
        currentY += 5;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text("Social Media:", cardX, currentY);
        currentY += 6;

        pdf.setFont("helvetica", "normal");
        visibleSocialLinks.forEach(link => {
          if (currentY > pageHeight - 20) return;
          
          pdf.setTextColor(147, 51, 234);
          pdf.textWithLink(`${link.icon} ${link.name}`, cardX, currentY, {
            url: link.url ?? "",
          });
          currentY += 6;
        });
      }

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        `Generated by NBCard - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Add professional branding line
      pdf.setDrawColor(147, 51, 234);
      pdf.setLineWidth(0.5);
      pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

      // Save the PDF
      pdf.save(`${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_NBCard_Perfect.pdf`);
      
      setTimeout(() => {
        alert("✅ Perfect PDF with 100% exact capture and clickable overlays generated!");
      }, 100);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("❌ Failed to generate PDF. Please try again. Error: " + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const exportVCard = async () => {
    try {
      // Generate vCard with photo
      const vCardData = profileImageDataUrl 
        ? await generateVCardData(true)
        : await generateVCardData(false);

      const blob = new Blob([vCardData], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        alert("✅ vCard with photo downloaded successfully! Import it to your contacts app.");
      }, 100);
    } catch (error) {
      console.error("vCard export error:", error);
      alert("❌ Failed to export vCard. Please try again.");
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(profileText);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Contact Card - ${profile?.fullName ?? "Profile"}`);
    const body = encodeURIComponent(profileText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(profileText);
    window.location.href = `sms:?body=${text}`;
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contact Card - ${profile?.fullName ?? "Profile"}`,
          text: profileText,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      alert("Web Share API is not supported in your browser");
    }
  };

  const captureAsImage = async () => {
    setGeneratingImage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const imageDataUrl = await captureProfileCard();
      setProfileImageDataUrl(imageDataUrl);

      // Convert data URL to blob and download
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_NBCard.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setTimeout(() => {
        alert("✅ High-quality image downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("Image capture error:", error);
      alert("❌ Failed to capture image. Please try again. Error: " + (error as Error).message);
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Profile</h2>

      {/* Sharing Options Grid * /}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={generateQRWithImage}
          disabled={generatingQR}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaQrcode className="text-2xl" />
          <span className="text-sm font-semibold">{generatingQR ? "Creating..." : "QR Code"}</span>
        </button>

        <button
          onClick={generatePDF}
          disabled={generating}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaFilePdf className="text-2xl" />
          <span className="text-sm font-semibold">{generating ? "Creating..." : "PDF"}</span>
        </button>

        <button
          onClick={exportVCard}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaDownload className="text-2xl" />
          <span className="text-sm font-semibold">vCard</span>
        </button>

        <button
          onClick={captureAsImage}
          disabled={generatingImage}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaImage className="text-2xl" />
          <span className="text-sm font-semibold">{generatingImage ? "Creating..." : "Image"}</span>
        </button>

        <button
          onClick={shareViaWhatsApp}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaWhatsapp className="text-2xl" />
          <span className="text-sm font-semibold">WhatsApp</span>
        </button>

        <button
          onClick={shareViaEmail}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaEnvelope className="text-2xl" />
          <span className="text-sm font-semibold">Email</span>
        </button>

        <button
          onClick={shareViaSMS}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaSms className="text-2xl" />
          <span className="text-sm font-semibold">SMS</span>
        </button>

        <button
          onClick={shareNative}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaShareAlt className="text-2xl" />
          <span className="text-sm font-semibold">More</span>
        </button>
      </div>

      {/* QR Code Modal * /}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">QR Code with Profile Image</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div ref={qrRef} className="flex justify-center mb-4 p-4 bg-gray-50 rounded-lg">
              {hasMounted ? (
                <QRCodeSVG 
                  value={qrCodeValue || "Loading..."} 
                  size={280} 
                  level="M" 
                  includeMargin
                  imageSettings={profileImageDataUrl ? {
                    src: profileImageDataUrl,
                    height: 50,
                    width: 50,
                    excavate: true,
                  } : undefined}
                />
              ) : null}
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>✨ Enhanced QR Code</strong><br/>
                Contains your full contact details with embedded profile image
              </p>
            </div>

            <button
              onClick={downloadQR}
              disabled={downloadingQR}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload />
              {downloadingQR ? "Downloading..." : "Download Professional QR Code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

*/
