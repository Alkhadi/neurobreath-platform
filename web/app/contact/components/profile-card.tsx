"use client";

import { Profile, cn, CardLayer, type TextLayer } from "@/lib/utils";
import { buildMapHref } from "@/lib/nbcard/mapHref";
import { stripUrls, clamp } from "@/lib/nbcard/sanitize";
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaTwitter, FaGlobe, FaPhone, FaEnvelope, FaHome } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { resolveAssetUrl } from "../lib/nbcard-assets";
import { generateProfileVCard, getProfileShareUrl, renderBankQrText, renderFlyerQrText } from "../lib/nbcard-share";
import { CaptureImage } from "./capture-image";
import styles from "./profile-card.module.css";
import type { TemplateSelection, Template } from "@/lib/nbcard-templates";
import {
  getTemplateThemeTokens,
  isLightColor,
  getTemplateExportDimensions,
  loadTemplateManifest,
  getTemplateById,
} from "@/lib/nbcard-templates";

type WalletFieldDescriptor = {
  key: string;
  type: "text";
  id: string;
  box?: { x: number; y: number; w: number; h: number };
  style?: { fontSize?: number; fontWeight?: number; align?: "left" | "center" | "right"; fit?: string };
};

type WalletSlotDescriptor = {
  key: string;
  type: "image";
  id: string;
  box?: { x: number; y: number; w: number; h: number };
  fit?: "cover" | "contain";
  shape?: "roundedRect" | "rect";
  radius?: number;
};

type WalletTemplateDescriptor = {
  schemaVersion: number;
  size?: { width: number; height: number };
  category?: string;
  fields?: WalletFieldDescriptor[];
  slots?: WalletSlotDescriptor[];
};

function normalizeTextValue(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function safeText(value: unknown, fallback: string = ""): string {
  const t = normalizeTextValue(value);
  return t || fallback;
}

function getWalletFieldValue(profile: Profile, key: string, shareUrl: string): string {
  const address = profile.addressCard;
  const bank = profile.bankCard;
  const business = profile.businessCard;
  const flyer = profile.flyerCard;
  const wedding = profile.weddingCard;

  switch (key) {
    // Common
    case "fullName":
      return safeText(profile.fullName);
    case "jobTitle":
      return safeText(profile.jobTitle);
    case "phone":
      return safeText(profile.phone);
    case "email":
      return safeText(profile.email);
    case "website":
      return safeText(business?.websiteUrl ?? profile.website ?? profile.socialMedia?.website);

    // Address
    case "recipientName":
      return safeText(address?.recipientName ?? profile.fullName);
    case "addressLine1":
      return safeText(address?.addressLine1 ?? profile.address);
    case "addressLine2":
      return safeText(address?.addressLine2);
    case "city":
      return safeText(address?.city);
    case "postcode":
      return safeText(address?.postcode);
    case "country":
      return safeText(address?.country);

    // Bank
    case "bankName":
      return safeText(bank?.bankName);
    case "accountName":
      return safeText(bank?.accountName ?? profile.fullName);
    case "sortCode":
      return safeText(bank?.sortCode ?? profile.bankSortCode);
    case "accountNumber":
      return safeText(bank?.accountNumber ?? profile.bankAccountNumber);
    case "iban":
      return safeText(bank?.iban);
    case "swiftBic":
      return safeText(bank?.swiftBic);
    case "swift":
      return safeText(bank?.swiftBic);
    case "referenceNote":
      return safeText(bank?.referenceNote);
    case "reference":
      return safeText(bank?.referenceNote);
    case "paymentLink":
      return safeText(bank?.paymentLink ?? shareUrl);
    case "paymentLinkLabel":
      return safeText(bank?.paymentLinkLabel);

    // Business
    case "co":
      return safeText(business?.companyName);
    case "companyName":
      return safeText(business?.companyName);
    case "tagline":
      return safeText(business?.tagline);
    case "services":
      return safeText(business?.services);
    case "locationNote":
      return safeText(business?.locationNote);
    case "hours":
      return safeText(business?.hours);
    case "bookingLink":
      return safeText(business?.bookingLink);
    case "bookingLinkLabel":
      return safeText(business?.bookingLinkLabel);
    case "vatOrRegNo":
      return safeText(business?.vatOrRegNo);

    // Flyer / Wedding
    case "title": {
      const src = profile.cardCategory === "WEDDING" ? wedding : flyer;
      return safeText(src?.headline ?? profile.fullName);
    }
    case "subtitle": {
      const src = profile.cardCategory === "WEDDING" ? wedding : flyer;
      return safeText(src?.subheadline ?? profile.jobTitle);
    }
    case "details":
      return safeText(profile.profileDescription || profile.businessDescription);
    case "cta": {
      const src = profile.cardCategory === "WEDDING" ? wedding : flyer;
      return safeText(src?.ctaText ?? "Scan QR");
    }
    case "ctaUrl": {
      const src = profile.cardCategory === "WEDDING" ? wedding : flyer;
      return safeText(src?.ctaUrl ?? shareUrl);
    }
    default:
      return "";
  }
}

function computeWalletQrValue(profile: Profile, shareUrl: string): string {
  const category = (profile.cardCategory ?? "PROFILE").toString().toUpperCase();

  if (category === "BANK") return renderBankQrText(profile, shareUrl);
  if (category === "FLYER" || category === "WEDDING") return renderFlyerQrText(profile, shareUrl);

  const vcard = generateProfileVCard(profile, {
    includeAddress: category === "ADDRESS",
    includeBusiness: category === "BUSINESS" || category === "PROFILE",
  });
  if (vcard.length > 1200) return shareUrl;
  return vcard;
}

function setSvgImageHref(img: SVGElement, href: string) {
  img.setAttribute("href", href);
  // Legacy fallback for some renderers.
  img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", href);
}

function applyShrinkToFit(params: {
  textEl: SVGTextElement;
  text: string;
  boxWidth: number;
  fontSize: number;
  fontWeight: number;
  fontFamily?: string;
}) {
  const { textEl, text, boxWidth, fontSize, fontWeight, fontFamily } = params;
  if (!text || !boxWidth || !fontSize) return;

  // Use a canvas measurement approximation. This avoids needing the SVG to be in-DOM.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const family = fontFamily || "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  ctx.font = `${fontWeight} ${fontSize}px ${family}`;
  const width = ctx.measureText(text).width;
  if (!width) return;
  if (width <= boxWidth) return;

  const next = Math.max(10, Math.floor(fontSize * (boxWidth / width) * 0.98));
  textEl.setAttribute("font-size", String(next));
}

function getSvgNumericAttr(el: Element, name: string): number | null {
  const raw = el.getAttribute(name);
  if (!raw) return null;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

function parseStopColor(stop: Element): string | null {
  const direct = stop.getAttribute("stop-color")?.trim();
  if (direct) return direct;
  const style = stop.getAttribute("style") ?? "";
  const m = style.match(/stop-color\s*:\s*([^;]+)\s*;?/i);
  return m?.[1]?.trim() || null;
}

function parseHexToRgb(color: string): { r: number; g: number; b: number } | null {
  const c = color.trim();
  const hex = c.startsWith("#") ? c.slice(1) : c;
  if (!/^[0-9a-fA-F]{3}$/.test(hex) && !/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  const full = hex.length === 3 ? hex.split("").map((ch) => ch + ch).join("") : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (![r, g, b].every((v) => Number.isFinite(v))) return null;
  return { r, g, b };
}

function luminanceFromRgb(rgb: { r: number; g: number; b: number }): number {
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

function guessBackgroundIsDark(doc: Document, svg: SVGSVGElement): boolean | null {
  const viewBox = svg.getAttribute("viewBox")?.trim();
  let vbW: number | null = null;
  let vbH: number | null = null;
  if (viewBox) {
    const parts = viewBox.split(/\s+/).map((p) => parseFloat(p));
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      vbW = parts[2];
      vbH = parts[3];
    }
  }

  const rects = Array.from(svg.querySelectorAll("rect"));
  const baseRect = rects.find((r) => {
    const x = getSvgNumericAttr(r, "x") ?? 0;
    const y = getSvgNumericAttr(r, "y") ?? 0;
    const w = getSvgNumericAttr(r, "width");
    const h = getSvgNumericAttr(r, "height");
    if (x !== 0 || y !== 0) return false;
    if (w == null || h == null) return false;
    if (vbW != null && vbH != null) {
      return Math.abs(w - vbW) < 0.5 && Math.abs(h - vbH) < 0.5;
    }
    return true;
  });

  const fill = baseRect?.getAttribute("fill")?.trim();
  if (!fill) return null;

  const rgb = parseHexToRgb(fill);
  if (rgb) return luminanceFromRgb(rgb) < 0.55;

  const urlMatch = fill.match(/^url\(#([^\)]+)\)$/);
  if (urlMatch) {
    const id = urlMatch[1];
    const gradient = doc.getElementById(id);
    if (gradient) {
      const stops = Array.from(gradient.querySelectorAll("stop"));
      const colors = stops
        .map(parseStopColor)
        .filter((c): c is string => typeof c === "string" && c.length > 0)
        .map((c) => parseHexToRgb(c))
        .filter((c): c is { r: number; g: number; b: number } => c !== null);
      if (colors.length > 0) {
        const avg = colors.reduce((sum, c) => sum + luminanceFromRgb(c), 0) / colors.length;
        return avg < 0.55;
      }
    }
  }

  return null;
}

function wrapTextToLines(params: {
  text: string;
  maxWidth: number;
  maxLines: number;
  fontSize: number;
  fontWeight: number;
  fontFamily?: string;
}): string[] {
  const { text, maxWidth, maxLines, fontSize, fontWeight, fontFamily } = params;
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [""];
  if (!maxWidth || maxLines <= 1) return [cleaned];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [cleaned];
  const family = fontFamily || "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  ctx.font = `${fontWeight} ${fontSize}px ${family}`;

  const words = cleaned.split(" ");
  const lines: string[] = [];
  let current = "";

  const pushLine = (line: string) => {
    if (lines.length < maxLines) lines.push(line);
  };

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    const width = ctx.measureText(next).width;
    if (width <= maxWidth || !current) {
      current = next;
      continue;
    }

    pushLine(current);
    current = word;
    if (lines.length >= maxLines - 1) break;
  }

  if (lines.length < maxLines) {
    pushLine(current);
  }

  // If we still have remaining words, append them onto the last line and let shrink-to-fit handle it.
  const usedWords = lines.join(" ").split(" ").filter(Boolean).length;
  if (usedWords < words.length && lines.length > 0) {
    const remaining = words.slice(usedWords).join(" ");
    lines[lines.length - 1] = `${lines[lines.length - 1]} ${remaining}`.trim();
  }

  return lines;
}

function setSvgTextValue(params: {
  textEl: SVGTextElement;
  value: string;
  boxWidth?: number;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
}): { usedText: string } {
  const { textEl, value, boxWidth, fontSize, fontWeight, fontFamily } = params;

  const tspans = Array.from(textEl.querySelectorAll("tspan"));
  if (tspans.length === 0) {
    textEl.textContent = value;
    return { usedText: value };
  }

  const maxLines = Math.max(1, tspans.length);
  const width = typeof boxWidth === "number" && boxWidth > 0 ? boxWidth : undefined;
  const fs = typeof fontSize === "number" && fontSize > 0 ? fontSize : 40;
  const fw = typeof fontWeight === "number" && fontWeight > 0 ? fontWeight : 600;

  const lines = width ? wrapTextToLines({ text: value, maxWidth: width, maxLines, fontSize: fs, fontWeight: fw, fontFamily }) : [value];
  for (let i = 0; i < tspans.length; i++) {
    tspans[i].textContent = lines[i] ?? "";
  }

  return { usedText: lines.join(" ").trim() };
}

function renderWalletSvg(params: {
  svgSource: string;
  descriptor: WalletTemplateDescriptor;
  profile: Profile;
  shareUrl: string;
  photoHref?: string | null;
  logoHref?: string | null;
  backgroundHref?: string | null;
  qrHref?: string | null;
  paletteHex?: string | null;
}): string {
  const { svgSource, descriptor, profile, shareUrl, photoHref, logoHref, backgroundHref, qrHref, paletteHex } = params;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgSource, "image/svg+xml");
  const svg = doc.documentElement;

  // Force responsive sizing.
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  // Auto-contrast wallet templates by overriding CSS vars used for text.
  // Many bundled bank/business SVGs ship dark backgrounds but default --nb-text to dark.
  let walletTextColor: string | null = null;
  try {
    const palette = typeof paletteHex === "string" ? paletteHex.trim() : "";
    if (/^#[0-9a-fA-F]{3}$/.test(palette) || /^#[0-9a-fA-F]{6}$/.test(palette)) {
      (svg as unknown as SVGSVGElement).style.setProperty("--nb-bg", palette);
    }

    const paletteSaysLight = palette ? isLightColor(palette) : null;
    const guessedDark =
      guessBackgroundIsDark(doc, svg as unknown as SVGSVGElement) ??
      ["bank", "business"].includes((descriptor.category ?? "").toString().toLowerCase());
    const bgIsDark = paletteSaysLight !== null ? !paletteSaysLight : guessedDark;

    walletTextColor = bgIsDark ? "#ffffff" : "#000000";
    (svg as unknown as SVGSVGElement).style.setProperty("--nb-text", walletTextColor);
    (svg as unknown as SVGSVGElement).style.setProperty("--nb-muted", walletTextColor);
  } catch {
    walletTextColor = null;
  }

  // Calculate font family once for all fields
  const selectedFontKey = profile.typography?.fontKey ?? "inter";
  const fontFamilyMap: Record<string, string> = {
    "inter": "Inter, sans-serif",
    "roboto": "Roboto, sans-serif",
    "open-sans": "Open Sans, sans-serif",
    "lato": "Lato, sans-serif",
    "montserrat": "Montserrat, sans-serif",
    "poppins": "Poppins, sans-serif",
    "raleway": "Raleway, sans-serif",
    "nunito": "Nunito, sans-serif",
    "source-sans-3": "Source Sans 3, sans-serif",
    "merriweather": "Merriweather, serif",
    "playfair-display": "Playfair Display, serif",
    "ubuntu": "Ubuntu, sans-serif",
    "fira-sans": "Fira Sans, sans-serif",
    "manrope": "Manrope, sans-serif",
    "plus-jakarta-sans": "Plus Jakarta Sans, sans-serif",
  };
  const walletFontFamily = fontFamilyMap[selectedFontKey] || "Inter, sans-serif";

  const fields = Array.isArray(descriptor.fields) ? descriptor.fields : [];
  for (const field of fields) {
    if (!field || field.type !== "text" || typeof field.id !== "string") continue;
    const value = getWalletFieldValue(profile, field.key, shareUrl);
    const textEl = doc.getElementById(field.id);
    if (!textEl) continue;
    if (textEl.tagName.toLowerCase() !== "text") continue;

    const svgText = textEl as unknown as SVGTextElement;
    
    // Hide empty fields to avoid placeholder text
    if (!value || !value.trim()) {
      svgText.setAttribute("opacity", "0");
      svgText.setAttribute("display", "none");
      svgText.textContent = "";
      continue;
    }
    
    // Show field with value
    svgText.setAttribute("opacity", "1");
    svgText.removeAttribute("display");

    const fontSize = typeof field.style?.fontSize === "number" ? field.style.fontSize : undefined;
    const fontWeight = typeof field.style?.fontWeight === "number" ? field.style.fontWeight : 600;
    const boxWidth = typeof field.box?.w === "number" ? field.box.w : undefined;

    const { usedText } = setSvgTextValue({ textEl: svgText, value, boxWidth, fontSize, fontWeight, fontFamily: walletFontFamily });

    // Requested: strict black/white contrast for editable template text.
    if (walletTextColor) {
      svgText.setAttribute("fill", walletTextColor);
    }

    const align = field.style?.align;
    if (align === "center") svgText.setAttribute("text-anchor", "middle");
    else if (align === "right") svgText.setAttribute("text-anchor", "end");
    else if (align === "left") svgText.setAttribute("text-anchor", "start");

    if (typeof fontSize === "number") {
      svgText.setAttribute("font-size", String(fontSize));
    }

    // Apply selected font family to SVG text
    svgText.setAttribute("font-family", walletFontFamily);

    if (field.style?.fit === "shrink-to-fit" && typeof fontSize === "number" && typeof boxWidth === "number") {
      applyShrinkToFit({ textEl: svgText, text: usedText || value, boxWidth, fontSize, fontWeight, fontFamily: walletFontFamily });
    }
  }

  const slots = Array.isArray(descriptor.slots) ? descriptor.slots : [];
  for (const slot of slots) {
    if (!slot || slot.type !== "image" || typeof slot.id !== "string") continue;

    let href: string | undefined;
    if (slot.key === "profilePhoto" || slot.key === "speakerPhoto") href = photoHref ?? undefined;
    if (slot.key === "logo") href = logoHref ?? photoHref ?? undefined;
    if (slot.key === "backgroundImage") href = backgroundHref ?? undefined;
    if (slot.key === "qr") href = qrHref ?? undefined;
    if (!href) continue;

    const existing = doc.getElementById(slot.id);
    if (!existing) continue;

    const tag = existing.tagName.toLowerCase();
    if (tag === "image") {
      setSvgImageHref(existing as unknown as SVGElement, href);
      continue;
    }

    if (tag === "rect") {
      const rect = existing as unknown as SVGRectElement;
      const x = rect.getAttribute("x") ?? "0";
      const y = rect.getAttribute("y") ?? "0";
      const w = rect.getAttribute("width") ?? "0";
      const h = rect.getAttribute("height") ?? "0";
      const rx = rect.getAttribute("rx") ?? (typeof slot.radius === "number" ? String(slot.radius) : "0");
      const ry = rect.getAttribute("ry") ?? (typeof slot.radius === "number" ? String(slot.radius) : "0");

      const img = doc.createElementNS("http://www.w3.org/2000/svg", "image");
      img.setAttribute("id", slot.id + "__img");
      img.setAttribute("x", x);
      img.setAttribute("y", y);
      img.setAttribute("width", w);
      img.setAttribute("height", h);
      img.setAttribute(
        "preserveAspectRatio",
        slot.fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"
      );
      setSvgImageHref(img as unknown as SVGElement, href);

      const needsClip = (parseFloat(rx) || 0) > 0 || (parseFloat(ry) || 0) > 0;
      if (needsClip) {
        const clipId = `clip_${slot.id}`;
        let defs = svg.querySelector("defs");
        if (!defs) {
          defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
          svg.insertBefore(defs, svg.firstChild);
        }

        if (!doc.getElementById(clipId)) {
          const clip = doc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
          clip.setAttribute("id", clipId);
          const clipRect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
          clipRect.setAttribute("x", x);
          clipRect.setAttribute("y", y);
          clipRect.setAttribute("width", w);
          clipRect.setAttribute("height", h);
          clipRect.setAttribute("rx", rx);
          clipRect.setAttribute("ry", ry);
          clip.appendChild(clipRect);
          defs.appendChild(clip);
        }

        img.setAttribute("clip-path", `url(#${clipId})`);
      }

      rect.parentNode?.insertBefore(img, rect.nextSibling);
    }
  }

  return new XMLSerializer().serializeToString(svg);
}

interface ProfileCardProps {
  profile: Profile;
  onPhotoClick?: (e?: React.MouseEvent) => void;
  showEditButton?: boolean;
  userEmail?: string; // For IndexedDB namespace
  templateSelection?: TemplateSelection; // Template background/overlay
  selectedTemplate?: Template; // Full template metadata for export dimensions
  captureId?: string;
  editMode?: boolean; // Free Layout Editor: enable drag/resize
  canvasEditMode?: boolean; // Canvas Edit Mode: inline editing on preview
  selectedLayerId?: string | null; // Free Layout Editor: currently selected layer
  onLayerUpdate?: (layerId: string, updates: Partial<CardLayer>) => void; // Free Layout Editor: update layer
  onLayerSelect?: (layerId: string | null) => void; // Free Layout Editor: select layer
}

// Helper component to render a single card layer
function CardLayerRenderer({
  layer,
  editMode,
  canvasEditMode,
  isSelected,
  onSelect,
  onUpdate,
  containerRef,
}: {
  layer: CardLayer;
  editMode?: boolean;
  canvasEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<CardLayer>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, layerX: 0, layerY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, layerW: 0, layerH: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  if (!layer.visible) return null;

  // Canvas Edit Mode: inline text editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!canvasEditMode || layer.type !== 'text' || layer.locked) return;
    e.stopPropagation();
    const textContent = layer.type === 'text' ? layer.style.content : '';
    setEditValue(textContent || '');
    setIsEditing(true);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    if (!canvasEditMode || layer.type !== 'avatar' || layer.locked) return;
    e.stopPropagation();
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (evt: Event) => {
      const file = (evt.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (src) {
          onUpdate?.(layer.id, { style: { ...layer.style, src } });
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const commitEdit = () => {
    if (layer.type === 'text' && editValue !== layer.style.content) {
      const newStyle = { ...layer.style, content: editValue };
      onUpdate?.(layer.id, { style: newStyle } as Partial<TextLayer>);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!editMode || layer.locked) return;
    e.stopPropagation();
    
    onSelect?.(layer.id);
    
    const container = containerRef.current;
    if (!container) return;
    
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
    });
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !editMode || layer.locked) return;
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const deltaX = (e.clientX - dragStart.x) / rect.width * 100;
    const deltaY = (e.clientY - dragStart.y) / rect.height * 100;
    
    const newX = Math.max(0, Math.min(100 - layer.w, dragStart.layerX + deltaX));
    const newY = Math.max(0, Math.min(100 - layer.h, dragStart.layerY + deltaY));
    
    onUpdate?.(layer.id, { x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleResizePointerDown = (e: React.PointerEvent, _corner: string) => {
    if (!editMode || layer.locked) return;
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      layerW: layer.w,
      layerH: layer.h,
    });
    setIsResizing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing || !editMode || layer.locked) return;
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const deltaX = (e.clientX - resizeStart.x) / rect.width * 100;
    const deltaY = (e.clientY - resizeStart.y) / rect.height * 100;
    
    const newW = Math.max(5, Math.min(100 - layer.x, resizeStart.layerW + deltaX));
    const newH = Math.max(5, Math.min(100 - layer.y, resizeStart.layerH + deltaY));
    
    onUpdate?.(layer.id, { w: newW, h: newH });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      e.stopPropagation();
      setIsResizing(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${layer.x}%`,
    top: `${layer.y}%`,
    width: `${layer.w}%`,
    height: `${layer.h}%`,
    transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
    zIndex: layer.zIndex,
    pointerEvents: (editMode && !layer.locked) || (canvasEditMode && !layer.locked) ? "auto" : "none",
    cursor: canvasEditMode && !layer.locked 
      ? (layer.type === 'text' ? 'text' : layer.type === 'avatar' ? 'pointer' : 'default')
      : (editMode && !layer.locked ? (isDragging ? "grabbing" : "grab") : undefined),
    outline: editMode && isSelected ? "2px solid #A855F7" : undefined,
    outlineOffset: "2px",
  };

  const renderContent = () => {
    if (layer.type === "text") {
      const hasContent = layer.style.content && layer.style.content.trim().length > 0;
      const showPlaceholder = canvasEditMode && !hasContent;

      return (
        /* eslint-disable-next-line react/forbid-dom-props */
        <div
          style={{
            width: "100%",
            height: "100%",
            fontSize: `${layer.style.fontSize}px`,
            fontWeight: layer.style.fontWeight,
            fontFamily: "var(--nb-font, ui-sans-serif, system-ui, sans-serif)",
            textAlign: layer.style.align,
            color: showPlaceholder ? "rgba(156, 163, 175, 0.6)" : layer.style.color,
            backgroundColor: layer.style.backgroundColor || "transparent",
            padding: layer.style.padding ? `${layer.style.padding}px` : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: layer.style.align === "center" ? "center" : layer.style.align === "right" ? "flex-end" : "flex-start",
            wordBreak: "break-word",
            overflow: "hidden",
            fontStyle: showPlaceholder ? "italic" : undefined,
          }}
          data-html2canvas-ignore={showPlaceholder ? "true" : undefined}
          data-placeholder={showPlaceholder ? "true" : undefined}
        >
          {hasContent ? layer.style.content : (showPlaceholder ? "Double-click to edit text" : "")}
        </div>
      );
    }

    if (layer.type === "avatar") {
      return (
        /* eslint-disable-next-line react/forbid-dom-props */
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: `${layer.style.borderRadius}px`,
            borderWidth: layer.style.borderWidth ? `${layer.style.borderWidth}px` : undefined,
            borderColor: layer.style.borderColor || "transparent",
            borderStyle: layer.style.borderWidth ? "solid" : undefined,
            overflow: "hidden",
          }}
        >
          {layer.style.src && (
            /* eslint-disable-next-line @next/next/no-img-element, react/forbid-dom-props */
            <img
              src={layer.style.src}
              alt="Layer avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: layer.style.fit,
              }}
            />
          )}
        </div>
      );
    }

    if (layer.type === "shape") {
      const { shapeKind, fill, stroke, strokeWidth, opacity, cornerRadius } = layer.style;

      if (shapeKind === "rect") {
        return (
          /* eslint-disable-next-line react/forbid-dom-props */
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: fill,
              border: stroke && strokeWidth ? `${strokeWidth}px solid ${stroke}` : undefined,
              opacity,
              borderRadius: cornerRadius ? `${cornerRadius}px` : undefined,
            }}
          />
        );
      }

      if (shapeKind === "circle") {
        return (
          /* eslint-disable-next-line react/forbid-dom-props */
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: fill,
              border: stroke && strokeWidth ? `${strokeWidth}px solid ${stroke}` : undefined,
              opacity,
              borderRadius: "50%",
            }}
          />
        );
      }

      if (shapeKind === "line") {
        return (
          /* eslint-disable-next-line react/forbid-dom-props */
          <div
            style={{
              width: "100%",
              height: strokeWidth ? `${strokeWidth}px` : "2px",
              backgroundColor: fill,
              opacity,
            }}
          />
        );
      }
    }

    return null;
  };

  return (
    /* eslint-disable-next-line react/forbid-dom-props */
    <div
      style={style}
      onPointerDown={editMode ? handlePointerDown : undefined}
      onPointerMove={isDragging ? handlePointerMove : isResizing ? handleResizePointerMove : undefined}
      onPointerUp={isDragging ? handlePointerUp : isResizing ? handleResizePointerUp : undefined}
      onDoubleClick={handleDoubleClick}
      onClick={layer.type === 'avatar' ? handleAvatarClick : undefined}
    >
      {renderContent()}
      
      {/* Inline text editor overlay */}
      {isEditing && layer.type === 'text' && (
        /* eslint-disable-next-line react/forbid-dom-props */
        <div
          data-html2canvas-ignore="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line react/forbid-dom-props */}
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                commitEdit();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              fontSize: layer.type === 'text' ? `${layer.style.fontSize}px` : '16px',
              fontWeight: layer.type === 'text' ? layer.style.fontWeight : 'normal',
              color: layer.type === 'text' ? layer.style.color : '#000',
              textAlign: layer.type === 'text' ? layer.style.align : 'left',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #10B981',
              borderRadius: '4px',
              padding: '8px',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>
      )}
      
      {/* Resize handle (bottom-right corner) */}
      {editMode && isSelected && !layer.locked && (
        /* eslint-disable-next-line react/forbid-dom-props */
        <div
          data-html2canvas-ignore="true"
          style={{
            position: "absolute",
            right: -4,
            bottom: -4,
            width: 12,
            height: 12,
            backgroundColor: "#A855F7",
            border: "2px solid white",
            borderRadius: "50%",
            cursor: "nwse-resize",
            zIndex: 1,
          }}
          onPointerDown={(e) => handleResizePointerDown(e, "br")}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        />
      )}
    </div>
  );
}

export function ProfileCard({
  profile,
  onPhotoClick,
  showEditButton = false,
  userEmail,
  templateSelection,
  selectedTemplate,
  captureId,
  editMode = false,
  canvasEditMode = false,
  selectedLayerId = null,
  onLayerUpdate,
  onLayerSelect,
}: ProfileCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const walletQrSourceRef = useRef<HTMLDivElement | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [resolvedBackgroundUrl, setResolvedBackgroundUrl] = useState<string | null>(null);
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string | null>(null);
  const [backgroundRevoke, setBackgroundRevoke] = useState<(() => void) | null>(null);
  const [photoRevoke, setPhotoRevoke] = useState<(() => void) | null>(null);
  const [walletSvgSource, setWalletSvgSource] = useState<string | null>(null);
  const [walletDescriptor, setWalletDescriptor] = useState<WalletTemplateDescriptor | null>(null);
  const [walletQrDataUrl, setWalletQrDataUrl] = useState<string | null>(null);
  const [walletRenderedSvg, setWalletRenderedSvg] = useState<string | null>(null);

  const [resolvedTemplate, setResolvedTemplate] = useState<Template | undefined>(selectedTemplate);

  const assetNamespace = userEmail ?? sessionEmail ?? undefined;

  // Ensure we have full template metadata even when the parent doesn't pass it.
  useEffect(() => {
    let cancelled = false;

    const backgroundId = templateSelection?.backgroundId;
    if (!backgroundId) {
      setResolvedTemplate(selectedTemplate);
      return () => {
        cancelled = true;
      };
    }

    if (selectedTemplate?.id === backgroundId) {
      setResolvedTemplate(selectedTemplate);
      return () => {
        cancelled = true;
      };
    }

    loadTemplateManifest()
      .then((manifest) => getTemplateById(manifest.templates, backgroundId))
      .then((tpl) => {
        if (cancelled) return;
        setResolvedTemplate(tpl ?? selectedTemplate);
      })
      .catch(() => {
        if (cancelled) return;
        setResolvedTemplate(selectedTemplate);
      });

    return () => {
      cancelled = true;
    };
  }, [templateSelection?.backgroundId, selectedTemplate]);

  // Determine if we're using template mode (new) or legacy background mode
  const useTemplateMode = Boolean(templateSelection?.backgroundId);

  const looksLikeWalletTemplate = Boolean(useTemplateMode && templateSelection?.backgroundId?.startsWith("wallet-"));

  const isWalletTemplate = Boolean(
    useTemplateMode &&
      resolvedTemplate?.engine === "nb-wallet" &&
      typeof resolvedTemplate?.fieldsSrc === "string" &&
      resolvedTemplate.fieldsSrc.trim()
  );

  // Phase 2: Get export dimensions from template metadata
  const exportDimensions = resolvedTemplate ? getTemplateExportDimensions(resolvedTemplate) : { width: 1600, height: 900 };
  const aspectRatioValue = exportDimensions.width / exportDimensions.height;

  const templateTheme = useTemplateMode && !isWalletTemplate ? getTemplateThemeTokens(templateSelection?.backgroundId) : null;
  const templateSurfaceIsLight = Boolean(useTemplateMode && templateTheme?.tone === "light");

  // Auto-contrast: if palette color is set, override text color based on palette luminance.
  const paletteColor = isWalletTemplate ? undefined : templateSelection?.backgroundColor;
  const paletteSurfaceIsLight = useTemplateMode && paletteColor ? isLightColor(paletteColor) : null;
  const effectiveSurfaceIsLight = paletteSurfaceIsLight !== null ? paletteSurfaceIsLight : templateSurfaceIsLight;

  // Requested: strict black/white contrast (no grays) for light/dark surfaces.
  const contentTextClass = effectiveSurfaceIsLight ? "text-black" : "text-white";
  const hoverRowClass = effectiveSurfaceIsLight ? "hover:bg-black/5" : "hover:bg-white/10";
  const softPanelClass = effectiveSurfaceIsLight ? "bg-black/5" : "bg-white/10";
  const dividerBorderClass = effectiveSurfaceIsLight ? "border-black/10" : "border-white/20";
  const socialChipClass = effectiveSurfaceIsLight ? "bg-black/10 text-black" : "bg-white/20 text-white";

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const theme = templateTheme;
    const tint = isWalletTemplate ? undefined : templateSelection?.backgroundColor;

    // Template background filter (nb-wallet templates render their own styling)
    el.style.setProperty("--nbcard-template-bg-filter", theme?.backgroundFilter ?? "none");

    // Overlays (keep consistent for UI + exports)
    el.style.setProperty(
      "--nbcard-template-readability-alpha",
      String(isWalletTemplate ? 0 : typeof theme?.readabilityOverlayAlpha === "number" ? theme.readabilityOverlayAlpha : 0.35)
    );
    el.style.setProperty(
      "--nbcard-template-lighten-alpha",
      String(isWalletTemplate ? 0 : typeof theme?.lightenOverlayAlpha === "number" ? theme.lightenOverlayAlpha : 0)
    );

    // Palette tint
    if (typeof tint === "string" && tint.trim()) {
      el.style.setProperty("--nbcard-template-tint", tint.trim());
      el.style.setProperty("--nbcard-template-tint-alpha", "0.25");
    } else {
      el.style.setProperty("--nbcard-template-tint", "transparent");
      el.style.setProperty("--nbcard-template-tint-alpha", "0");
    }

    // Accent color (optional)
    const accent = (profile as unknown as { accentColor?: string }).accentColor;
    const nextAccent = (accent ?? "").toString().trim();
    if (/^#[0-9a-fA-F]{6}$/.test(nextAccent)) {
      el.style.setProperty("--nb-accent", nextAccent);
    } else {
      el.style.removeProperty("--nb-accent");
    }
  }, [profile, isWalletTemplate, templateSelection?.backgroundColor, templateSelection?.backgroundId, templateTheme]);
  
  // Build template paths from IDs
  // New naming: "modern-geometric-landscape" -> "modern-geometric-landscape.svg"
  // Old naming: "modern_geometric_v1_landscape" -> "modern_geometric_landscape_bg.svg" (fallback)
  const getTemplatePath = (id: string, type: 'background' | 'overlay'): string => {
    // Try new direct naming first
    if (id && !id.includes('_v')) {
      const suffix = type === 'background' ? '.svg' : '.svg';
      return `/nb-card/templates/${type}s/${id}${suffix}`;
    }
    // Fallback for legacy versioned IDs
    const base = id.replace(/_v\d+_/, '_');
    const suffix = type === 'background' ? '_bg.svg' : '.svg';
    return `/nb-card/templates/${type}s/${base}${suffix}`;
  };
  
  const templateBackgroundSrc = useTemplateMode && templateSelection?.backgroundId
    ? (isWalletTemplate || looksLikeWalletTemplate ? null : (resolvedTemplate?.src ?? getTemplatePath(templateSelection.backgroundId, 'background')))
    : null;
  const templateOverlaySrc = useTemplateMode && templateSelection?.overlayId
    ? (isWalletTemplate ? null : getTemplatePath(templateSelection.overlayId, 'overlay'))
    : null;

  const shareUrl = getProfileShareUrl(profile.id);
  const walletQrValue = isWalletTemplate ? computeWalletQrValue(profile, shareUrl) : null;

  // Load nb-wallet SVG + descriptor
  useEffect(() => {
    let cancelled = false;

    if (!isWalletTemplate || !resolvedTemplate?.src || !resolvedTemplate?.fieldsSrc) {
      setWalletSvgSource(null);
      setWalletDescriptor(null);
      setWalletRenderedSvg(null);
      return;
    }

    (async () => {
      const [svgRes, fieldsRes] = await Promise.all([
        fetch(resolvedTemplate.src, { cache: "no-store" }),
        fetch(resolvedTemplate.fieldsSrc!, { cache: "no-store" }),
      ]);

      if (!svgRes.ok) throw new Error(`Failed to load template SVG (${svgRes.status})`);
      if (!fieldsRes.ok) throw new Error(`Failed to load template fields (${fieldsRes.status})`);

      const [svgText, fieldsRaw] = await Promise.all([svgRes.text(), fieldsRes.json()]);
      if (cancelled) return;

      setWalletSvgSource(svgText);
      setWalletDescriptor(fieldsRaw as WalletTemplateDescriptor);
    })().catch((err) => {
      console.error("Failed to load wallet template", err);
      if (!cancelled) {
        setWalletSvgSource(null);
        setWalletDescriptor(null);
        setWalletRenderedSvg(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isWalletTemplate, resolvedTemplate?.src, resolvedTemplate?.fieldsSrc]);

  // Convert the wallet QR SVG into a data URL for embedding into the template SVG.
  useEffect(() => {
    if (!isWalletTemplate || !walletQrValue) {
      setWalletQrDataUrl(null);
      return;
    }

    const svg = walletQrSourceRef.current?.querySelector("svg");
    if (!svg) return;

    try {
      const xml = new XMLSerializer().serializeToString(svg);
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
      setWalletQrDataUrl(dataUrl);
    } catch {
      setWalletQrDataUrl(null);
    }
  }, [isWalletTemplate, walletQrValue]);

  // Render the wallet template SVG with injected text + images.
  useEffect(() => {
    if (!isWalletTemplate || !walletSvgSource || !walletDescriptor) {
      setWalletRenderedSvg(null);
      return;
    }

    try {
      const next = renderWalletSvg({
        svgSource: walletSvgSource,
        descriptor: walletDescriptor,
        profile,
        shareUrl,
        photoHref: resolvedPhotoUrl,
        logoHref: resolvedPhotoUrl,
        backgroundHref: resolvedBackgroundUrl,
        qrHref: walletQrDataUrl,
        paletteHex: templateSelection?.backgroundColor ?? null,
      });
      setWalletRenderedSvg(next);
    } catch (err) {
      console.error("Failed to render wallet template", err);
      setWalletRenderedSvg(null);
    }
  }, [isWalletTemplate, walletSvgSource, walletDescriptor, profile, shareUrl, resolvedPhotoUrl, resolvedBackgroundUrl, walletQrDataUrl, templateSelection?.backgroundColor]);

  useEffect(() => {
    let cancelled = false;
    getSession()
      .then((s) => {
        if (cancelled) return;
        const email = (s?.user?.email ?? "").toString().trim().toLowerCase();
        setSessionEmail(email && email.includes("@") ? email : null);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resolve background URL (frameUrl or backgroundUrl)
  useEffect(() => {
    const backgroundSource = profile?.frameUrl || profile?.backgroundUrl;
    const revokeFn = backgroundRevoke;
    
    // Cleanup previous objectURL
    if (revokeFn) {
      revokeFn();
      setBackgroundRevoke(null);
    }
    
    if (!backgroundSource) {
      setResolvedBackgroundUrl(null);
      return;
    }
    
    resolveAssetUrl(backgroundSource, assetNamespace)
      .then((result) => {
        if (result) {
          setResolvedBackgroundUrl(result.src);
          if (result.revoke) {
            setBackgroundRevoke(() => result.revoke);
          }
        } else {
          setResolvedBackgroundUrl(null);
        }
      })
      .catch((err) => {
        console.error("Failed to resolve background:", err);
        setResolvedBackgroundUrl(null);
      });
      
    return () => {
      if (revokeFn) {
        revokeFn();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.frameUrl, profile?.backgroundUrl, assetNamespace]);

  // Resolve photo URL
  useEffect(() => {
    const revokeFn = photoRevoke;
    
    // Cleanup previous objectURL
    if (revokeFn) {
      revokeFn();
      setPhotoRevoke(null);
    }
    
    if (!profile?.photoUrl) {
      setResolvedPhotoUrl(null);
      return;
    }
    
    resolveAssetUrl(profile.photoUrl, assetNamespace)
      .then((result) => {
        if (result) {
          setResolvedPhotoUrl(result.src);
          if (result.revoke) {
            setPhotoRevoke(() => result.revoke);
          }
        } else {
          setResolvedPhotoUrl(null);
        }
      })
      .catch((err) => {
        console.error("Failed to resolve photo:", err);
        setResolvedPhotoUrl(null);
      });
      
    return () => {
      if (revokeFn) {
        revokeFn();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.photoUrl, assetNamespace]);
  const gradientClassMap: Record<string, string> = {
    "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)": "bg-gradient-to-br from-purple-600 to-blue-500",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)": "bg-gradient-to-br from-indigo-500 to-purple-600",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)": "bg-gradient-to-br from-fuchsia-400 to-rose-500",
    "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)": "bg-gradient-to-br from-emerald-500 to-green-400",
    "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)": "bg-gradient-to-br from-violet-400 to-fuchsia-500",
    "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)": "bg-gradient-to-br from-orange-400 to-rose-400",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)": "bg-gradient-to-br from-sky-400 to-cyan-400",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)": "bg-gradient-to-br from-pink-400 to-yellow-300",
  };
  const defaultGradient = "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)";
  const gradientClass =
    gradientClassMap[profile?.gradient ?? ""] ??
    gradientClassMap[defaultGradient];

  // Priority order: template > legacy frameUrl/backgroundUrl > gradient
  const hasWalletBackground = Boolean(isWalletTemplate && walletRenderedSvg);
  const hasTemplateBackground = hasWalletBackground || Boolean(templateBackgroundSrc);
  const hasLegacyBackground = !useTemplateMode && Boolean(resolvedBackgroundUrl);
  const hasAnyBackground = hasTemplateBackground || hasLegacyBackground;

  const socialMediaLinks = [
    { icon: FaGlobe, url: profile?.socialMedia?.website, color: "#6366F1", label: "Website" },
    { icon: FaInstagram, url: profile?.socialMedia?.instagram, color: "#E1306C" },
    { icon: FaFacebook, url: profile?.socialMedia?.facebook, color: "#1877F2" },
    { icon: FaTiktok, url: profile?.socialMedia?.tiktok, color: "#000000" },
    { icon: FaLinkedin, url: profile?.socialMedia?.linkedin, color: "#0A66C2" },
    { icon: FaTwitter, url: profile?.socialMedia?.twitter, color: "#1DA1F2" },
  ];

  const isFlyerPromoPortrait = templateSelection?.backgroundId === "flyer-promo-portrait" || templateSelection?.backgroundId === "flyer_promo_v1_portrait";
  
  // Phase 2: Use template metadata for aspect ratio (no distortion)
  // Remove hardcoded orientationClass; apply aspect-ratio via inline style

  const selectedFontKey = profile.typography?.fontKey ?? "inter";
  const fontVarName = `--font-${selectedFontKey}`;

  return (
    /* eslint-disable-next-line react/forbid-dom-props */
    <div
      id={captureId ?? "profile-card-capture"}
      ref={rootRef}
      className={cn(
        "relative isolate w-full max-w-md mx-auto rounded-3xl overflow-hidden",
        styles.card3dEdge,
        !hasAnyBackground && gradientClass,
        hasAnyBackground && (isWalletTemplate ? "bg-white" : (effectiveSurfaceIsLight ? "bg-white" : "bg-black"))
      )}
      style={{ 
        aspectRatio: aspectRatioValue,
        // @ts-expect-error - CSS custom properties
        "--nb-font": `var(${fontVarName})`,
      }}
    >
      {isWalletTemplate && walletQrValue ? (
        <div ref={walletQrSourceRef} className="fixed left-[-10000px] top-0 opacity-0 pointer-events-none select-none" aria-hidden="true">
          <QRCodeSVG value={walletQrValue} size={512} includeMargin level="M" />
        </div>
      ) : null}

      {/* TEMPLATE BACKGROUND LAYER (z=0) */}
      {hasWalletBackground && walletRenderedSvg ? (
        <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
          <div className={cn("w-full h-full", styles.templateBgImage)} dangerouslySetInnerHTML={{ __html: walletRenderedSvg }} />
        </div>
      ) : null}

      {!hasWalletBackground && hasTemplateBackground && templateBackgroundSrc && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <CaptureImage
            src={templateBackgroundSrc}
            alt="Card background"
            className={cn("w-full h-full object-cover", styles.templateBgImage)}
          />
        </div>
      )}

      {/* OPTIONAL PALETTE TINT (z=1) */}
      {!isWalletTemplate && hasTemplateBackground && templateSelection?.backgroundColor ? (
        <div className={cn("absolute inset-0 z-[1] pointer-events-none", styles.templateTint)} aria-hidden="true" />
      ) : null}

      {/* LIGHTEN HARSH TEMPLATES (z=1) */}
      {!isWalletTemplate && hasTemplateBackground && templateTheme?.lightenOverlayAlpha && templateTheme.lightenOverlayAlpha > 0 ? (
        <div className={cn("absolute inset-0 z-[1] pointer-events-none", styles.templateLighten)} aria-hidden="true" />
      ) : null}

      {/* LEGACY BACKGROUND LAYER (z=0, only if no template) */}
      {!useTemplateMode && hasLegacyBackground && resolvedBackgroundUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <CaptureImage
            src={resolvedBackgroundUrl}
            alt="Card background"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Readability overlay for readability (z=1) */}
      {!isWalletTemplate && hasAnyBackground && (templateTheme?.readabilityOverlayAlpha ?? 0.35) > 0 ? (
        <div className={cn("absolute inset-0 z-[1] pointer-events-none", styles.templateReadability)} aria-hidden="true" />
      ) : null}

      {/* TEMPLATE OVERLAY LAYER (z=2) */}
      {!isWalletTemplate && hasTemplateBackground && templateOverlaySrc ? (
        <div className="absolute inset-0 z-[2] pointer-events-none select-none">
          <CaptureImage src={templateOverlaySrc} alt="Card overlay" className="w-full h-full object-cover" />
        </div>
      ) : null}

      {/* CARD CONTENT (z=10) */}
      {isWalletTemplate ? null : (
      <div className={cn("relative z-10 p-8", contentTextClass)}>
        {isFlyerPromoPortrait ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 text-white">
                    <h2
                      className="text-3xl font-bold leading-tight"
                      data-pdf-text={(profile.cardCategory === "WEDDING" ? profile.weddingCard?.headline : profile.flyerCard?.headline) ?? ""}
                    >
                      {(profile.cardCategory === "WEDDING" ? profile.weddingCard?.headline : profile.flyerCard?.headline) ||
                        profile.fullName ||
                        "Headline"}
                    </h2>
                    {(profile.cardCategory === "WEDDING" ? profile.weddingCard?.subheadline : profile.flyerCard?.subheadline) || profile.jobTitle ? (
                      <p
                        className="mt-2 text-base opacity-90"
                        data-pdf-text={(profile.cardCategory === "WEDDING" ? profile.weddingCard?.subheadline : profile.flyerCard?.subheadline) ?? ""}
                      >
                        {(profile.cardCategory === "WEDDING" ? profile.weddingCard?.subheadline : profile.flyerCard?.subheadline) || profile.jobTitle}
                      </p>
                    ) : null}
                  </div>

                  {/* Main panel */}
                  <div className="rounded-2xl bg-white/95 p-5 text-gray-900">
                    {profile.profileDescription ? (
                      <p className="text-sm text-gray-700" data-pdf-text={profile.profileDescription}>
                        {profile.profileDescription}
                      </p>
                    ) : null}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="flex flex-col gap-2">
                        <a
                          href={(profile.cardCategory === "WEDDING" ? profile.weddingCard?.ctaUrl : profile.flyerCard?.ctaUrl) || shareUrl}
                          data-pdf-link={(profile.cardCategory === "WEDDING" ? profile.weddingCard?.ctaUrl : profile.flyerCard?.ctaUrl) || shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity",
                            styles.accentBorder,
                            styles.accentText
                          )}
                        >
                          {(profile.cardCategory === "WEDDING" ? profile.weddingCard?.ctaText : profile.flyerCard?.ctaText) || "Open link"}
                        </a>
                        <p
                          className="text-xs text-gray-600 break-all"
                          data-pdf-text={(profile.cardCategory === "WEDDING" ? profile.weddingCard?.ctaUrl : profile.flyerCard?.ctaUrl) || shareUrl}
                        >
                          {(profile.cardCategory === "WEDDING" ? profile.weddingCard?.ctaUrl : profile.flyerCard?.ctaUrl) || shareUrl}
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="rounded-xl bg-white p-2 shadow-md">
                          <QRCodeSVG value={renderFlyerQrText(profile, shareUrl)} size={120} includeMargin level="M" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact strip */}
                  <div className="rounded-2xl bg-black/80 p-4 text-white">
                    <div className="flex flex-col gap-2 text-sm">
                      {profile.phone ? (
                        <a href={`tel:${profile.phone}`} data-pdf-link={`tel:${profile.phone}`} className="underline">
                          <span data-pdf-text={profile.phone}>{profile.phone}</span>
                        </a>
                      ) : null}
                      {profile.email ? (
                        <a href={`mailto:${profile.email}`} data-pdf-link={`mailto:${profile.email}`} className="underline">
                          <span data-pdf-text={profile.email}>{profile.email}</span>
                        </a>
                      ) : null}
                      {profile.website ? (
                        <a href={profile.website} data-pdf-link={profile.website} className="underline break-all">
                          <span data-pdf-text={profile.website}>{profile.website}</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
        ) : (
          <>
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                        {resolvedPhotoUrl ? (
                          <CaptureImage
                            src={resolvedPhotoUrl}
                            alt={profile?.fullName ?? "Profile"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500 text-4xl font-bold text-white">
                            {profile?.fullName?.charAt(0)?.toUpperCase() ?? "A"}
                          </div>
                        )}
                      </div>
                      {showEditButton && onPhotoClick && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPhotoClick(e);
                          }}
                          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                          aria-label="Upload photo"
                          data-html2canvas-ignore="true"
                        >
                          <svg
                            className={cn("w-5 h-5", styles.accentText)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 0 016 0z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
        {/* Name & Title */}
        <h2 className={cn("text-3xl font-bold text-center mb-2", styles.signatureFont)}>
          <span data-pdf-text={profile?.fullName ?? ""}>{profile?.fullName ?? "Name"}</span>
        </h2>
        <p className="text-lg text-center mb-6 opacity-90">
          <span data-pdf-text={profile?.jobTitle ?? ""}>{profile?.jobTitle ?? "Job Title"}</span>
        </p>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <a
            href={`tel:${profile?.phone ?? ""}`}
            data-pdf-link={`tel:${profile?.phone ?? ""}`}
            className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", hoverRowClass)}
          >
            <FaPhone className="text-xl" />
            <span className="text-lg" data-pdf-text={profile?.phone ?? ""}>
              {profile?.phone ?? "Phone"}
            </span>
          </a>
          <a
            href={`mailto:${profile?.email ?? ""}`}
            data-pdf-link={`mailto:${profile?.email ?? ""}`}
            className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", hoverRowClass)}
          >
            <FaEnvelope className="text-xl" />
            <span className="text-lg" data-pdf-text={profile?.email ?? ""}>
              {profile?.email ?? "Email"}
            </span>
          </a>
          {profile?.address && (
            <div className="flex items-center gap-3 p-2">
              <FaHome className="text-xl" />
              <div className="flex flex-col">
                <span className="text-sm opacity-75">Find Address:</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                  data-pdf-link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base underline hover:opacity-80 transition-opacity"
                >
                  Click Here
                </a>
              </div>
            </div>
          )}
          {profile?.website && (
            <a
              href={profile.website}
              data-pdf-link={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", hoverRowClass)}
            >
              <FaGlobe className="text-xl" />
              <span className="text-lg break-all" data-pdf-text={profile.website}>
                {profile.website}
              </span>
            </a>
          )}
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {socialMediaLinks.map((social, index) => {
            const Icon = social.icon;
            if (!social.url) return null;
            return (
              <a
                key={index}
                href={social.url}
                data-pdf-link={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "backdrop-blur-md p-3 rounded-full transition-all hover:scale-110",
                  socialChipClass,
                  effectiveSurfaceIsLight ? "hover:bg-black/15" : "hover:bg-white/30"
                )}
                aria-label={`Visit ${social.url}`}
              >
                <Icon className="text-2xl" />
              </a>
            );
          })}
        </div>

        {/* Descriptions */}
        {profile?.profileDescription && (
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-2">Profile</h3>
            <p className="text-sm opacity-90">{profile.profileDescription}</p>
          </div>
        )}
        {profile?.businessDescription && (
          <div className={cn("mt-3 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-2">Business</h3>
            <p className="text-sm opacity-90">{profile.businessDescription}</p>
          </div>
        )}

        {/* Category-specific Details Blocks */}
        {profile?.cardCategory === "ADDRESS" && profile?.addressCard && (
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-3 text-base">Address</h3>
            <div className="text-sm space-y-1">
              {profile.addressCard.recipientName && (
                <p className="font-semibold" data-pdf-text={profile.addressCard.recipientName}>
                  {profile.addressCard.recipientName}
                </p>
              )}
              {profile.addressCard.addressLine1 && <p data-pdf-text={profile.addressCard.addressLine1}>{profile.addressCard.addressLine1}</p>}
              {profile.addressCard.addressLine2 && <p data-pdf-text={profile.addressCard.addressLine2}>{profile.addressCard.addressLine2}</p>}
              {profile.addressCard.city && profile.addressCard.postcode && (
                <p data-pdf-text={`${profile.addressCard.city}, ${profile.addressCard.postcode}`}>{profile.addressCard.city}, {profile.addressCard.postcode}</p>
              )}
              {profile.addressCard.country && <p data-pdf-text={profile.addressCard.country}>{profile.addressCard.country}</p>}
              {profile.addressCard.directionsNote && (
                <p className="mt-2 text-xs opacity-75 italic" data-pdf-text={stripUrls(clamp(profile.addressCard.directionsNote, 60))}>
                  {stripUrls(clamp(profile.addressCard.directionsNote, 60))}
                </p>
              )}
              {(profile.addressCard.addressLine1 || profile.addressCard.mapUrlOverride || profile.addressCard.mapDestinationOverride || profile.addressCard.mapQueryOverride) && (
                <div className={cn("mt-3 pt-3 border-t", dividerBorderClass)}>
                  <p className="text-xs opacity-75 mb-1">Find Address:</p>
                  <a
                    href={buildMapHref(profile.addressCard)}
                    data-pdf-link={buildMapHref(profile.addressCard)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold underline hover:opacity-80 transition-opacity break-words"
                  >
                    {profile.addressCard.mapLinkLabel || "Get Directions"}
                  </a>
                </div>
              )}

              {(profile.addressCard.phoneLabel || profile.addressCard.emailLabel) && (profile.phone || profile.email) ? (
                <div className={cn("mt-3 pt-3 border-t space-y-2", dividerBorderClass)}>
                  {profile.phone ? (
                    <a
                      href={`tel:${profile.phone}`}
                      data-pdf-link={`tel:${profile.phone}`}
                      className="inline-flex items-center gap-2 text-sm underline hover:opacity-80 transition-opacity"
                    >
                      <span className="opacity-80">{profile.addressCard.phoneLabel || "Call"}:</span>
                      <span data-pdf-text={profile.phone}>{profile.phone}</span>
                    </a>
                  ) : null}
                  {profile.email ? (
                    <a
                      href={`mailto:${profile.email}`}
                      data-pdf-link={`mailto:${profile.email}`}
                      className="block text-sm underline hover:opacity-80 transition-opacity"
                    >
                      <span className="opacity-80">{profile.addressCard.emailLabel || "Email"}:</span>{" "}
                      <span data-pdf-text={profile.email}>{profile.email}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {profile?.cardCategory === "BANK" && profile?.bankCard && (
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-3 text-base">Bank Details</h3>
            <div className="text-sm space-y-2">
              {profile.bankCard.bankName && (
                <p>
                  <span className="opacity-75">Bank:</span>{" "}
                  <span data-pdf-text={profile.bankCard.bankName}>{profile.bankCard.bankName}</span>
                </p>
              )}
              {profile.bankCard.accountName && (
                <p>
                  <span className="opacity-75">Account Name:</span>{" "}
                  <span data-pdf-text={profile.bankCard.accountName}>{profile.bankCard.accountName}</span>
                </p>
              )}
              {profile.bankCard.sortCode && (
                <p>
                  <span className="opacity-75">Sort Code:</span>{" "}
                  <span data-pdf-text={profile.bankCard.sortCode}>{profile.bankCard.sortCode}</span>
                </p>
              )}
              {profile.bankCard.accountNumber && (
                <p>
                  <span className="opacity-75">Account Number:</span>{" "}
                  <span data-pdf-text={profile.bankCard.accountNumber}>{profile.bankCard.accountNumber}</span>
                </p>
              )}
              {profile.bankCard.iban && (
                <p>
                  <span className="opacity-75">IBAN:</span>{" "}
                  <span data-pdf-text={profile.bankCard.iban}>{profile.bankCard.iban}</span>
                </p>
              )}
              {profile.bankCard.swiftBic && (
                <p>
                  <span className="opacity-75">SWIFT/BIC:</span>{" "}
                  <span data-pdf-text={profile.bankCard.swiftBic}>{profile.bankCard.swiftBic}</span>
                </p>
              )}
              {profile.bankCard.referenceNote && (
                <p className="mt-2 text-xs opacity-75 italic" data-pdf-text={profile.bankCard.referenceNote}>
                  {profile.bankCard.referenceNote}
                </p>
              )}
              {profile.bankCard.paymentLink && (
                <div className={cn("mt-3 pt-3 border-t", dividerBorderClass)}>
                  <a
                    href={profile.bankCard.paymentLink}
                    data-pdf-link={profile.bankCard.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
                  >
                    {profile.bankCard.paymentLinkLabel || "Send Money"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {profile?.cardCategory === "BUSINESS" && profile?.businessCard && (
          <div className={cn("mt-6 backdrop-blur-md p-4 rounded-lg", softPanelClass)}>
            <h3 className="font-semibold mb-3 text-base">Business</h3>
            <div className="text-sm space-y-2">
              {profile.businessCard.companyName && (
                <p className="font-semibold text-base" data-pdf-text={profile.businessCard.companyName}>
                  {profile.businessCard.companyName}
                </p>
              )}
              {profile.businessCard.tagline && (
                <p className="opacity-90 italic" data-pdf-text={profile.businessCard.tagline}>
                  {profile.businessCard.tagline}
                </p>
              )}
              {profile.businessCard.services && (
                <p className="opacity-90" data-pdf-text={profile.businessCard.services}>
                  {profile.businessCard.services}
                </p>
              )}
              {profile.businessCard.websiteUrl && (
                <p>
                  <span className="opacity-75">Website:</span>{" "}
                  <a
                    href={profile.businessCard.websiteUrl}
                    data-pdf-link={profile.businessCard.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 transition-opacity"
                  >
                    <span data-pdf-text={profile.businessCard.websiteUrl}>{profile.businessCard.websiteUrl}</span>
                  </a>
                </p>
              )}
              {profile.businessCard.hours && (
                <p>
                  <span className="opacity-75">Hours:</span>{" "}
                  <span data-pdf-text={profile.businessCard.hours}>{profile.businessCard.hours}</span>
                </p>
              )}
              {profile.businessCard.locationNote && (
                <p>
                  <span className="opacity-75">Location:</span>{" "}
                  <span data-pdf-text={profile.businessCard.locationNote}>{profile.businessCard.locationNote}</span>
                </p>
              )}
              {profile.businessCard.vatOrRegNo && (
                <p className="text-xs opacity-75">
                  VAT/Reg:{" "}
                  <span data-pdf-text={profile.businessCard.vatOrRegNo}>{profile.businessCard.vatOrRegNo}</span>
                </p>
              )}
              {profile.businessCard.bookingLink && (
                <div className={cn("mt-3 pt-3 border-t", dividerBorderClass)}>
                  <a
                    href={profile.businessCard.bookingLink}
                    data-pdf-link={profile.businessCard.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
                  >
                    {profile.businessCard.bookingLinkLabel || "Book Now"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
          </>
        )}
      </div>
      )}

      {/* FREE LAYOUT EDITOR: CUSTOM LAYERS (z=15) */}
      {profile.layers && profile.layers.length > 0 && (
        <div className="absolute inset-0 z-[15] pointer-events-none">
          {profile.layers
            .filter((l) => l.visible)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((layer) => (
              <CardLayerRenderer
                key={layer.id}
                layer={layer}
                editMode={editMode}
                canvasEditMode={canvasEditMode}
                isSelected={selectedLayerId === layer.id}
                onSelect={onLayerSelect}
                onUpdate={onLayerUpdate}
                containerRef={rootRef}
              />
            ))}
        </div>
      )}
    </div>
  );
}

