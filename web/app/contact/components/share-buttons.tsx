"use client";

import * as React from "react";

import html2canvas from "html2canvas";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

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

async function createSimplePdf(profile: Profile, shareUrl: string, qrDataUrl?: string) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Capture card as PNG and embed it
  let cardImageHeight = 0;
  let cardY = height - 80;
  try {
    const cardPngBlob = await captureProfileCardPng();
    const cardPngBytes = await cardPngBlob.arrayBuffer();
    const cardImage = await doc.embedPng(cardPngBytes);
    const cardAspect = cardImage.width / cardImage.height;
    const cardPdfWidth = Math.min(width - 96, 400);
    cardImageHeight = cardPdfWidth / cardAspect;
    const cardX = (width - cardPdfWidth) / 2;
    cardY = height - 80 - cardImageHeight;

    page.drawImage(cardImage, {
      x: cardX,
      y: cardY,
      width: cardPdfWidth,
      height: cardImageHeight,
    });
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
  
  // Bank details
  if (profile.bankSortCode || profile.bankAccountNumber) {
    lines.push(""); // blank line
    lines.push("Bank Details:");
    if (profile.bankSortCode) lines.push(`Sort Code: ${profile.bankSortCode}`);
    if (profile.bankAccountNumber) lines.push(`Account: ${profile.bankAccountNumber}`);
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
