"use client";

import * as React from "react";

import html2canvas from "html2canvas";
import { PDFDocument, PDFName, StandardFonts, rgb } from "pdf-lib";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import Image from "next/image";
import { getSession } from "next-auth/react";

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
} from "../lib/nbcard-share";
import {
  exportNbcardLocalState,
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

async function captureProfileCardPng(): Promise<Blob> {
  const target = document.getElementById("profile-card-capture");
  if (!target) throw new Error("Profile card element not found");

  // CAPTURE-SAFE TIMING (MANDATORY):
  // 1. Wait for fonts to load
  await document.fonts.ready;

  // 2. Wait for all images inside card to decode
  const images = target.querySelectorAll<HTMLImageElement>("img");
  await Promise.all(
    Array.from(images).map((img) => {
      if (img.decode) return img.decode().catch(() => {});
      return Promise.resolve();
    })
  );

  // 3. Wait 2 animation frames to ensure layout is flushed after background/avatar changes
  await new Promise((resolve) => 
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  );

  // COLOR FIDELITY: No color conversion, no filters
  const canvas = await html2canvas(target, {
    scale: 2,
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

type PdfAnnotsArrayLike = {
  push: (value: unknown) => void;
};

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

async function createSimplePdf(profile: Profile, shareUrl: string, qrDataUrl?: string) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Capture card as PNG and embed it
  let cardImageHeight = 0;
  let cardY = height - 80;
  let cardX = 48;
  let cardPdfWidth = Math.min(width - 96, 400);
  try {
    const cardPngBlob = await captureProfileCardPng();
    const cardPngBytes = await cardPngBlob.arrayBuffer();
    const cardImage = await doc.embedPng(cardPngBytes);
    const cardAspect = cardImage.width / cardImage.height;
    cardPdfWidth = Math.min(width - 96, 400);
    cardImageHeight = cardPdfWidth / cardAspect;
    cardX = (width - cardPdfWidth) / 2;
    cardY = height - 80 - cardImageHeight;

    page.drawImage(cardImage, {
      x: cardX,
      y: cardY,
      width: cardPdfWidth,
      height: cardImageHeight,
    });

    // Overlay clickable areas from the DOM onto the embedded image.
    try {
      const root = document.getElementById("profile-card-capture");
      if (root && cardImageHeight > 0 && cardPdfWidth > 0) {
        addPdfLinkOverlaysFromDom({
          doc,
          page,
          root,
          cardX,
          cardY,
          cardPdfWidth,
          cardPdfHeight: cardImageHeight,
        });
      }
    } catch {
      // ignore overlay failures; keep embedded image PDF
    }
  } catch (err) {
    console.error("Failed to embed card image in PDF:", err);
    // Fallback: text-only
    page.drawText(profile.fullName || "NBCard", {
      x: 48,
      y: height - 80,
      size: 22,
      font: fontBold,
      color: rgb(0.12, 0.12, 0.14),
    });
  }

  let y = cardY - 30;

  // Add clickable contact info below card
  page.drawText("Contact Information:", {
    x: 48,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0.12, 0.12, 0.14),
  });
  y -= 20;

  if (profile.phone) {
    const phoneText = `📞 ${profile.phone}`;
    page.drawText(phoneText, {
      x: 48,
      y,
      size: 11,
      font,
      color: rgb(0.23, 0.36, 0.95),
    });
    // Add clickable link using pdf-lib's link API
    const phoneUri = `tel:${profile.phone.replace(/\s/g, "")}`;
    page.drawRectangle({
      x: 48,
      y: y - 4,
      width: font.widthOfTextAtSize(phoneText, 11),
      height: 14,
      opacity: 0,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0,
    });
    // Use the annotation dictionary approach
    try {
      const annots = page.node.Annots();
      if (annots) {
        const linkDict = doc.context.obj({
          Type: 'Annot',
          Subtype: 'Link',
          Rect: [48, y - 4, 48 + font.widthOfTextAtSize(phoneText, 11), y + 10],
          Border: [0, 0, 0],
          A: {
            S: 'URI',
            URI: phoneUri,
          },
        });
        annots.push(doc.context.register(linkDict));
      }
    } catch {
      // Annotation API not available, continue without links
    }
    y -= 18;
  }

  if (profile.email) {
    const emailText = `📧 ${profile.email}`;
    page.drawText(emailText, {
      x: 48,
      y,
      size: 11,
      font,
      color: rgb(0.23, 0.36, 0.95),
    });
    y -= 18;
  }

  y -= 10;
  page.drawText("Profile link:", {
    x: 48,
    y,
    size: 11,
    font: fontBold,
    color: rgb(0.20, 0.20, 0.23),
  });
  y -= 18;

  page.drawText(shareUrl, {
    x: 48,
    y,
    size: 10,
    font,
    color: rgb(0.23, 0.36, 0.95),
  });

  if (qrDataUrl) {
    try {
      const qrBytes = await fetch(qrDataUrl).then((r) => r.arrayBuffer());
      const qrImage = await doc.embedPng(qrBytes);
      const qrSize = 120;
      page.drawImage(qrImage, {
        x: width - 48 - qrSize,
        y: Math.max(60, cardY - cardImageHeight - 20),
        width: qrSize,
        height: qrSize,
      });
    } catch {
      // QR embedding failed, continue without it
    }
  }

  page.drawText("Generated by NBCard", {
    x: 48,
    y: 36,
    size: 9,
    font,
    color: rgb(0.55, 0.55, 0.60),
  });

  return await doc.save();
}

function renderShareText(profile: Profile, shareUrl: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`${profile.fullName}`);
  if (profile.jobTitle) lines.push(profile.jobTitle);
  lines.push(""); // blank line
  
  // Address
  if (profile.address) {
    lines.push("🏠 Find Address:");
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`;
    lines.push(`Click Here: ${mapsUrl}`);
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
    if (profile.addressCard.directionsNote) lines.push(`Note: ${profile.addressCard.directionsNote}`);
    const mapQuery = profile.addressCard.mapQueryOverride || 
      [profile.addressCard.addressLine1, profile.addressCard.addressLine2, profile.addressCard.city, profile.addressCard.postcode, profile.addressCard.country]
        .filter(Boolean).join(", ");
    if (mapQuery) {
      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
      lines.push(`${profile.addressCard.mapLinkLabel || "Click Here"}: ${mapsLink}`);
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

export function ShareButtons({ profile, profiles, contacts, onSetProfiles, onSetContacts }: ShareButtonsProps) {
  const [isQrOpen, setIsQrOpen] = React.useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = React.useState(false);
  const [isQrVcard, setIsQrVcard] = React.useState(false);
  const [busyKey, setBusyKey] = React.useState<string | null>(null);

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
  const [selectedFrameCategory, setSelectedFrameCategory] = React.useState<"ADDRESS" | "BANK" | "BUSINESS">("ADDRESS");

  const NAMESPACED_STATE_KEY_PREFIX = "nbcard:namespacedState:v1:";

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

  const shareUrl = React.useMemo(() => getProfileShareUrl(profile.id), [profile.id]);

  const qrValue = React.useMemo(() => {
    if (!isQrVcard) return shareUrl;
    const vcard = generateProfileVCard(profile);
    if (vcard.length > 1200) return shareUrl;
    return vcard;
  }, [isQrVcard, profile, shareUrl]);

  async function withBusy<T>(key: string, fn: () => Promise<T>): Promise<T | null> {
    if (busyKey) return null;
    setBusyKey(key);
    try {
      return await fn();
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
    await withBusy("share", async () => {
      const ok = await shareViaWebShare({
        title: `NBCard — ${profile.fullName}`,
        text: `Here’s my contact card: ${shareUrl}`,
      });
      if (!ok) {
        const copied = await copyTextToClipboard(shareUrl);
        toast.message("Share not available", { description: copied ? "Link copied instead." : "Copy the link manually." });
      }
    });
  }

  async function handleDownloadVcard() {
    await withBusy("vcard", async () => {
      const vcard = generateProfileVCard(profile);
      downloadBlob(new Blob([vcard], { type: "text/vcard" }), `${profile.fullName.replace(/\s+/g, "_")}_NBCard.vcf`);
      toast.success("vCard downloaded");
    });
  }

  async function handleShareVcardFile() {
    await withBusy("vcard-share", async () => {
      const vcard = generateProfileVCard(profile);
      const blob = new Blob([vcard], { type: "text/vcard" });
      const fileName = `${profile.fullName.replace(/\s+/g, "_")}.vcf`;
      const ok = await shareViaWebShare({
        title: `vCard — ${profile.fullName}`,
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
  }

  async function handleDownloadPng() {
    await withBusy("png", async () => {
      const png = await captureProfileCardPng();
      downloadBlob(png, `${profile.fullName.replace(/\s+/g, "_")}_NBCard.png`);
      toast.success("PNG downloaded");
    });
  }

  async function handleSharePng() {
    await withBusy("png-share", async () => {
      const png = await captureProfileCardPng();
      const fileName = `${profile.fullName.replace(/\s+/g, "_")}.png`;
      const ok = await shareViaWebShare({
        title: `NBCard — ${profile.fullName}`,
        files: [new File([png], fileName, { type: "image/png" })],
      });
      if (ok) {
        toast.success("Shared image");
      } else {
        downloadBlob(png, `${profile.fullName.replace(/\s+/g, "_")}_NBCard.png`);
        toast.message("Share not supported", { description: "Image downloaded instead." });
      }
    });
  }

  async function handleDownloadPdf() {
    await withBusy("pdf", async () => {
      let qrPngUrl: string | undefined;
      try {
        const svg = document.getElementById("nbcard-qr-svg");
        if (svg) {
          const xml = new XMLSerializer().serializeToString(svg);
          const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
          const pngBlob = await dataUrlToPngBlob(svgDataUrl);
          qrPngUrl = URL.createObjectURL(pngBlob);
        }
      } catch {
        // ignore
      }

      const pdfBytes = await createSimplePdf(profile, shareUrl, qrPngUrl);
      if (qrPngUrl) URL.revokeObjectURL(qrPngUrl);

      downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), `${profile.fullName.replace(/\s+/g, "_")}_NBCard.pdf`);
      toast.success("PDF downloaded");
    });
  }

  function openWhatsapp() {
    const url = buildWhatsappUrl(`Here’s my contact card: ${shareUrl}`);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openEmail() {
    window.location.href = buildMailtoUrl(profile);
  }

  function openSms() {
    window.location.href = buildSmsUrl(profile);
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
      const json = await exportNbcardLocalState();
      downloadBlob(new Blob([JSON.stringify(json, null, 2)], { type: "application/json" }), `nbcard_backup.json`);
      toast.success("Backup exported");
    });
  }

  async function handleImportJson(file: File) {
    await withBusy("json-import", async () => {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await importNbcardLocalState(parsed);
      const next = await exportNbcardLocalState();
      onSetProfiles(next.profiles);
      onSetContacts(next.contacts);
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
    await withBusy("text-share", async () => {
      const text = renderShareText(profile, shareUrl);
      const ok = await shareViaWebShare({
        title: `${profile.fullName} - Contact Info`,
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
  }

  async function handleShareViaEmail() {
    await withBusy("email-share", async () => {
      // Try PDF with navigator.share first
      if (navigator.share && navigator.canShare) {
        try {
          const pdfBytes = await createSimplePdf(profile, shareUrl);
          const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
          const fileName = `${profile.fullName.replace(/\s+/g, "_")}_NBCard.pdf`;
          const file = new File([pdfBlob], fileName, { type: "application/pdf" });
          
          const canShareFile = navigator.canShare({ files: [file] });
          if (canShareFile) {
            const text = renderShareText(profile, shareUrl);
            await navigator.share({
              title: `${profile.fullName} - NBCard`,
              text: text,
              files: [file],
            });
            toast.success("Shared via email");
            return;
          }
        } catch (e) {
          console.error("Share with PDF failed:", e);
        }
      }
      
      // Fallback: mailto with text body
      const text = renderShareText(profile, shareUrl);
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(`${profile.fullName} - NBCard`)}&body=${encodeURIComponent(text)}`;
      window.location.href = mailtoUrl;
      toast.message("Email opened", { description: "Attachments not supported via mailto." });
    });
  }

  const savedCategoryOptions: Array<{ key: SavedCardCategory; label: string }> = React.useMemo(
    () => [
      { key: "PROFILE", label: "Profile" },
      { key: "ADDRESS", label: "Address" },
      { key: "BANK", label: "Bank" },
      { key: "BUSINESS", label: "Business" },
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
    <div className="rounded-2xl border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Share Your Profile</h2>
          <p className="text-sm text-muted-foreground">Export as QR/PDF/vCard/image, or share via WhatsApp, email, or SMS.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCopyLink} disabled={!!busyKey}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Link
          </Button>

          <Button onClick={handleShareNative} disabled={!!busyKey}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" disabled={!!busyKey}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Exports</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsQrOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPdf} disabled={!!busyKey}>
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPng} disabled={!!busyKey}>
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSharePng} disabled={!!busyKey}>
                Share PNG
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
              <DropdownMenuItem onClick={() => setIsPrivacyOpen(true)}>Privacy & Storage</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={openWhatsapp} disabled={!!busyKey}>
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" onClick={openEmail} disabled={!!busyKey}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" onClick={openSms} disabled={!!busyKey}>
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
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleSaveCurrentAsNew()} disabled={!!busyKey}>
              Save current as new
            </Button>
            <Button size="sm" variant="secondary" onClick={handleUpdateSelected} disabled={!!busyKey || !activeSavedIdForCategory}>
              Overwrite selected
            </Button>
            <Button size="sm" variant="outline" onClick={handleNewEmptyCard} disabled={!!busyKey}>
              New empty card
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {savedCategoryOptions.map((c) => (
            <Button
              key={c.key}
              type="button"
              size="sm"
              variant={savedCategory === c.key ? "default" : "outline"}
              onClick={() => openFocusedEditor(c.key)}
              disabled={!!busyKey}
            >
              {c.label}
            </Button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                : "Edit Business Card"}
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
                      { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname" },
                      { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourname" },
                      { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname" },
                      { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
                      { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/yourname" },
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
            <DialogDescription>Default encodes your profile link. Optionally encode a lightweight vCard.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="text-sm">
              <div className="font-medium">Encode vCard</div>
              <div className="text-muted-foreground">If too large, we fall back to link.</div>
            </div>
            <Button
              type="button"
              variant={isQrVcard ? "default" : "outline"}
              onClick={() => {
                const next = !isQrVcard;
                if (next) {
                  const vcard = generateProfileVCard(profile);
                  if (vcard.length > 1200) {
                    toast.message("vCard too large for QR", { description: "Using link QR instead." });
                    setIsQrVcard(false);
                    return;
                  }
                }
                setIsQrVcard(next);
              }}
            >
              {isQrVcard ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-center rounded-xl border bg-muted/30 p-4">
            <QRCodeSVG id="nbcard-qr-svg" value={qrValue} size={260} includeMargin level="M" />
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
