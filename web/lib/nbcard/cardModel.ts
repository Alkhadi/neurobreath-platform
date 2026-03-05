/**
 * cardModel.ts — Single source-of-truth CardModel schema
 *
 * Every UI (form, canvas editor, template picker, share/export) reads and
 * writes this model. This removes the drift that was possible when the form
 * and canvas were separate mental models.
 *
 * VERSIONING: bump CARD_MODEL_VERSION when the shape changes and add a
 * migration in migrateCardModel() below.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Version
// ---------------------------------------------------------------------------

export const CARD_MODEL_VERSION = 1;

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export const CardMetaSchema = z.object({
  id: z.string(),
  version: z.number().int().min(1).default(CARD_MODEL_VERSION),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CardMeta = z.infer<typeof CardMetaSchema>;

// ---------------------------------------------------------------------------
// Style
// ---------------------------------------------------------------------------

export const CardStyleSchema = z.object({
  /** Key into the BACKGROUND_PRESETS registry */
  backgroundPresetId: z.string().optional(),
  /** Accent colour token (hex or design-token string) */
  accentColor: z.string().optional(),
  /** Font-family identifier matched to the font-selector values */
  fontFamily: z.string().optional(),
  /** Key into IndexedDB image store (or a server blob path) */
  backgroundImageRef: z.string().optional(),
});

export type CardStyle = z.infer<typeof CardStyleSchema>;

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const CardProfileSchema = z.object({
  /** Key into IndexedDB image store */
  photoRef: z.string().optional(),
  fullName: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  /** Short tagline shown on card (max 50 chars) */
  profileDescription: z.string().max(50).optional(),
  /** Business description line shown on card (max 50 chars) */
  businessDescription: z.string().max(50).optional(),
});

export type CardProfile = z.infer<typeof CardProfileSchema>;

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

export const CardSocialSchema = z.object({
  website: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  linkedin: z.string().optional(),
  x: z.string().optional(),
});

export type CardSocial = z.infer<typeof CardSocialSchema>;

// ---------------------------------------------------------------------------
// Category data (discriminated by category)
// ---------------------------------------------------------------------------

export type CardCategory = "address" | "bank" | "business" | "flyer" | "wedding";

export const CardCategorySchema = z.enum(["address", "bank", "business", "flyer", "wedding"]);

// --- Address ---

export const AddressCategoryDataSchema = z.object({
  line1: z.string().default(""),
  line2: z.string().optional(),
  city: z.string().default(""),
  postcode: z.string().default(""),
  country: z.string().default(""),
  mapLabel: z.string().optional(),
  directionsNote: z.string().max(60).optional(),
  /** Full Google Maps /dir/?api=1&destination=… URL override */
  mapUrlOverride: z.string().optional(),
  /** Plain-text destination (no links) */
  mapDestinationOverride: z.string().max(80).optional(),
});

export type AddressCategoryData = z.infer<typeof AddressCategoryDataSchema>;

// --- Bank ---

export const BankCategoryDataSchema = z.object({
  bankName: z.string().default(""),
  accountName: z.string().default(""),
  sortCode: z.string().default(""),
  accountNumber: z.string().default(""),
  iban: z.string().optional(),
  swift: z.string().optional(),
  disclaimer: z.string().max(120).optional(),
});

export type BankCategoryData = z.infer<typeof BankCategoryDataSchema>;

// --- Business ---

export const BusinessCategoryDataSchema = z.object({
  companyName: z.string().default(""),
  services: z.string().default(""),
  hours: z.string().optional(),
  address: z.string().optional(),
  bookingLink: z.string().optional(),
  tagline: z.string().max(80).optional(),
});

export type BusinessCategoryData = z.infer<typeof BusinessCategoryDataSchema>;

// --- Flyer ---

export const FlyerCategoryDataSchema = z.object({
  headline: z.string().default(""),
  subheadline: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
});

export type FlyerCategoryData = z.infer<typeof FlyerCategoryDataSchema>;

// --- Wedding ---

export const WeddingCategoryDataSchema = z.object({
  coupleNames: z.string().default(""),
  date: z.string().default(""),
  venue: z.string().default(""),
  rsvpLabel: z.string().optional(),
  rsvpUrl: z.string().optional(),
});

export type WeddingCategoryData = z.infer<typeof WeddingCategoryDataSchema>;

// Union type for category data
export type CategoryData =
  | { category: "address"; data: AddressCategoryData }
  | { category: "bank"; data: BankCategoryData }
  | { category: "business"; data: BusinessCategoryData }
  | { category: "flyer"; data: FlyerCategoryData }
  | { category: "wedding"; data: WeddingCategoryData };

// ---------------------------------------------------------------------------
// Canvas elements
// ---------------------------------------------------------------------------

export const CanvasElementTypeSchema = z.enum(["text", "image", "link", "shape", "qr"]);

export type CanvasElementType = z.infer<typeof CanvasElementTypeSchema>;

export const CanvasElementSchema = z.object({
  id: z.string(),
  type: CanvasElementTypeSchema,
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  rotate: z.number().default(0),
  zIndex: z.number().int().default(0),
  /** For text/link elements */
  text: z.string().optional(),
  /** For image elements — IndexedDB key or server URL */
  imageRef: z.string().optional(),
  /** For link elements */
  linkUrl: z.string().optional(),
  linkLabel: z.string().optional(),
  /**
   * data-link-id attribute on the rendered DOM element.
   * Used by the PDF exporter to collect bounding boxes for link annotations.
   */
  dataLinkId: z.string().optional(),
  /** Free-form style bag (CSS-ish values) */
  style: z.record(z.string(), z.unknown()).optional(),
  /** If set, this element is bound to a model field path (e.g. "profile.fullName") */
  fieldBinding: z.string().optional(),
  /** Whether this element is visible */
  visible: z.boolean().default(true),
  /** Whether this element is locked (cannot be moved/resized) */
  locked: z.boolean().default(false),
});

export type CanvasElement = z.infer<typeof CanvasElementSchema>;

export const CanvasStateSchema = z.object({
  elements: z.array(CanvasElementSchema).default([]),
  selectedElementId: z.string().optional(),
});

export type CanvasState = z.infer<typeof CanvasStateSchema>;

// ---------------------------------------------------------------------------
// CardModel — the single source of truth
// ---------------------------------------------------------------------------

export const CardModelSchema = z.object({
  meta: CardMetaSchema,
  category: CardCategorySchema,
  style: CardStyleSchema.default({}),
  profile: CardProfileSchema.default({}),
  social: CardSocialSchema.default({}),
  /**
   * Category-specific data stored as an open record.
   * Use the typed accessors (getAddressData, getBankData, etc.) to read.
   */
  categoryData: z.record(z.string(), z.unknown()).default({}),
  canvas: CanvasStateSchema.default({ elements: [] }),
});

export type CardModel = z.infer<typeof CardModelSchema>;

// ---------------------------------------------------------------------------
// Typed category data accessors
// ---------------------------------------------------------------------------

export function getAddressData(card: CardModel): AddressCategoryData {
  return AddressCategoryDataSchema.parse(card.categoryData ?? {});
}

export function getBankData(card: CardModel): BankCategoryData {
  return BankCategoryDataSchema.parse(card.categoryData ?? {});
}

export function getBusinessData(card: CardModel): BusinessCategoryData {
  return BusinessCategoryDataSchema.parse(card.categoryData ?? {});
}

export function getFlyerData(card: CardModel): FlyerCategoryData {
  return FlyerCategoryDataSchema.parse(card.categoryData ?? {});
}

export function getWeddingData(card: CardModel): WeddingCategoryData {
  return WeddingCategoryDataSchema.parse(card.categoryData ?? {});
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createCardModel(
  category: CardCategory,
  overrides?: Partial<CardModel>
): CardModel {
  const now = new Date().toISOString();
  const base: CardModel = {
    meta: {
      id: generateId(),
      version: CARD_MODEL_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    category,
    style: {},
    profile: {},
    social: {},
    categoryData: {},
    canvas: { elements: [] },
  };
  return { ...base, ...overrides };
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ---------------------------------------------------------------------------
// Migration (bump CARD_MODEL_VERSION when schema changes)
// ---------------------------------------------------------------------------

export function migrateCardModel(raw: unknown): CardModel {
  const parsed = CardModelSchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  // Attempt best-effort repair for older data shapes
  if (raw && typeof raw === "object") {
    const attempt = { ...(raw as Record<string, unknown>) };
    if (!attempt.meta) {
      const now = new Date().toISOString();
      attempt.meta = {
        id: generateId(),
        version: CARD_MODEL_VERSION,
        createdAt: now,
        updatedAt: now,
      };
    }
    if (!attempt.category) attempt.category = "address";
    if (!attempt.style) attempt.style = {};
    if (!attempt.profile) attempt.profile = {};
    if (!attempt.social) attempt.social = {};
    if (!attempt.categoryData) attempt.categoryData = {};
    if (!attempt.canvas) attempt.canvas = { elements: [] };

    const retried = CardModelSchema.safeParse(attempt);
    if (retried.success) return retried.data;
  }

  // Absolute fallback — return a fresh address card
  return createCardModel("address");
}

// ---------------------------------------------------------------------------
// Field binder mapping
// canonical canvas element IDs bound to model field paths
// ---------------------------------------------------------------------------

/**
 * Maps profile/social field paths to their canonical canvas element ID.
 * e.g. "profile.fullName" → "text:fullName"
 *
 * When a form field changes, the canvas element with this ID gets its text
 * updated. When the canvas element is edited inline, the model field is set.
 */
export const FIELD_BINDER_MAP: Record<string, string> = {
  "profile.fullName": "text:fullName",
  "profile.jobTitle": "text:jobTitle",
  "profile.phone": "text:phone",
  "profile.email": "text:email",
  "profile.profileDescription": "text:profileDescription",
  "profile.businessDescription": "text:businessDescription",
  "social.website": "link:website",
  // Address fields
  "categoryData.line1": "text:address.line1",
  "categoryData.line2": "text:address.line2",
  "categoryData.city": "text:address.city",
  "categoryData.postcode": "text:address.postcode",
  "categoryData.country": "text:address.country",
  "categoryData.mapLabel": "link:mapDirections",
  // Bank fields
  "categoryData.bankName": "text:bank.bankName",
  "categoryData.accountName": "text:bank.accountName",
  "categoryData.sortCode": "text:bank.sortCode",
  "categoryData.accountNumber": "text:bank.accountNumber",
  // Business fields
  "categoryData.companyName": "text:business.companyName",
  "categoryData.services": "text:business.services",
  // Flyer fields
  "categoryData.headline": "text:flyer.headline",
  "categoryData.subheadline": "text:flyer.subheadline",
  // Wedding fields
  "categoryData.coupleNames": "text:wedding.coupleNames",
  "categoryData.date": "text:wedding.date",
  "categoryData.venue": "text:wedding.venue",
};
