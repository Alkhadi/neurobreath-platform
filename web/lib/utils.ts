import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// NBCard Contact Page Types and Utilities
export const gradientOptions = [
  { name: "Purple Dream", gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)" },
  { name: "Ocean Blue", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Sunset", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Forest", gradient: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  { name: "Lavender", gradient: "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)" },
  { name: "Fire", gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" },
  { name: "Deep Ocean", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Royal", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
];

export interface Profile {
  id: string;
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  profileDescription: string;
  businessDescription: string;
  photoUrl?: string;
  backgroundUrl?: string;
  frameUrl?: string;
  gradient: string;
  address?: string;
  website?: string;
  wellbeingLink?: string;
  bankSortCode?: string;
  bankAccountNumber?: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
    snapchat?: string;
    pinterest?: string;
    whatsapp?: string;
  };
  // Category-specific fields (NB-Card enhancement)
  cardCategory?: "PROFILE" | "ADDRESS" | "BANK" | "BUSINESS";
  addressCard?: {
    recipientName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postcode?: string;
    country?: string;
    directionsNote?: string;
    mapLinkLabel?: string;
    mapQueryOverride?: string;
    phoneLabel?: string;
    emailLabel?: string;
  };
  bankCard?: {
    accountName?: string;
    bankName?: string;
    sortCode?: string;
    accountNumber?: string;
    iban?: string;
    swiftBic?: string;
    paymentLink?: string;
    paymentLinkLabel?: string;
    referenceNote?: string;
  };
  businessCard?: {
    companyName?: string;
    tagline?: string;
    services?: string;
    websiteUrl?: string;
    locationNote?: string;
    hours?: string;
    bookingLink?: string;
    bookingLinkLabel?: string;
    vatOrRegNo?: string;
  };
}

// NB-Card guest namespace: shared with `web/app/contact/lib/nbcard-assets.ts`
const NBCARD_DEVICE_ID_KEY = "nbcard-device-id";

export function getOrCreateNbcardDeviceId(): string {
  if (typeof window === "undefined") return "default";
  let deviceId = window.localStorage.getItem(NBCARD_DEVICE_ID_KEY);
  if (deviceId) return deviceId;

  const uuid =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  deviceId = `device-${uuid}`;
  window.localStorage.setItem(NBCARD_DEVICE_ID_KEY, deviceId);
  return deviceId;
}

export type NbcardSavedCardCategory = "PROFILE" | "ADDRESS" | "BANK" | "BUSINESS";

// Local-first Saved Cards model (stored in localStorage)
export type NbcardSavedCard = {
  id: string;
  title: string;
  category: NbcardSavedCardCategory;
  snapshot: Profile;
  updatedAt: number; // epoch ms
  createdAt?: number; // epoch ms
};

type NbcardSavedActiveIds = Partial<Record<NbcardSavedCardCategory, string>>;

const NBCARD_SAVED_KEY_PREFIX = "nbcard:saved:"; // REQUIRED format: nbcard:saved:<namespace>
const NBCARD_SAVED_ACTIVE_KEY_PREFIX = "nbcard:saved:active:";

// Legacy keys (kept for safe migration only)
const NBCARD_LEGACY_SAVED_KEY_PREFIX = "nbcard:savedCards:v1:";
const NBCARD_LEGACY_ACTIVE_KEY_PREFIX = "nbcard:savedCards:activeId:v1:";

function nbcardSavedKey(namespace: string): string {
  return `${NBCARD_SAVED_KEY_PREFIX}${namespace}`;
}

function nbcardSavedActiveKey(namespace: string): string {
  return `${NBCARD_SAVED_ACTIVE_KEY_PREFIX}${namespace}`;
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function coerceCategory(value: unknown): NbcardSavedCardCategory | null {
  return value === "PROFILE" || value === "ADDRESS" || value === "BANK" || value === "BUSINESS" ? value : null;
}

export function getNbcardSavedNamespace(userEmail?: string | null): string {
  const normalized = (userEmail ?? "").toString().trim().toLowerCase();
  if (normalized && normalized.includes("@")) return normalized;
  return getOrCreateNbcardDeviceId();
}

export function loadNbcardSavedCards(namespace: string): NbcardSavedCard[] {
  if (typeof window === "undefined") return [];

  const parsed = safeJsonParse<unknown>(window.localStorage.getItem(nbcardSavedKey(namespace)));
  if (!Array.isArray(parsed)) return [];

  const out: NbcardSavedCard[] = [];

  for (const raw of parsed) {
    if (!isRecord(raw)) continue;

    const category = coerceCategory(raw.category);
    if (!category) continue;

    const id = typeof raw.id === "string" ? raw.id : null;
    const title = typeof raw.title === "string" ? raw.title : null;
    const snapshot = isRecord(raw.snapshot) ? (raw.snapshot as unknown as Profile) : null;
    if (!id || !title || !snapshot) continue;

    const updatedAt = typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now();
    const createdAt = typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? raw.createdAt : undefined;

    out.push({
      id,
      title,
      category,
      snapshot,
      updatedAt,
      ...(createdAt ? { createdAt } : {}),
    });
  }

  return out;
}

export function saveNbcardSavedCards(namespace: string, cards: NbcardSavedCard[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(nbcardSavedKey(namespace), JSON.stringify(cards));
}

export function upsertNbcardSavedCard(namespace: string, next: Omit<NbcardSavedCard, "updatedAt"> & { updatedAt?: number }): NbcardSavedCard[] {
  const cards = loadNbcardSavedCards(namespace);
  const idx = cards.findIndex((c) => c.id === next.id);
  const updatedAt = typeof next.updatedAt === "number" && Number.isFinite(next.updatedAt) ? next.updatedAt : Date.now();

  const withTimestamps: NbcardSavedCard = {
    ...next,
    updatedAt,
    createdAt: typeof next.createdAt === "number" && Number.isFinite(next.createdAt) ? next.createdAt : cards[idx]?.createdAt ?? updatedAt,
  };

  const updated = idx >= 0 ? cards.map((c) => (c.id === next.id ? withTimestamps : c)) : [withTimestamps, ...cards];
  saveNbcardSavedCards(namespace, updated);
  return updated;
}

export function deleteNbcardSavedCard(namespace: string, id: string): NbcardSavedCard[] {
  const cards = loadNbcardSavedCards(namespace);
  const updated = cards.filter((c) => c.id !== id);
  saveNbcardSavedCards(namespace, updated);

  const active = loadNbcardActiveSavedCardIds(namespace);
  const nextActive: NbcardSavedActiveIds = { ...active };
  (Object.keys(nextActive) as NbcardSavedCardCategory[]).forEach((k) => {
    if (nextActive[k] === id) delete nextActive[k];
  });
  saveNbcardActiveSavedCardIds(namespace, nextActive);

  return updated;
}

export function loadNbcardActiveSavedCardIds(namespace: string): NbcardSavedActiveIds {
  if (typeof window === "undefined") return {};
  const parsed = safeJsonParse<NbcardSavedActiveIds>(window.localStorage.getItem(nbcardSavedActiveKey(namespace)));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveNbcardActiveSavedCardIds(namespace: string, next: NbcardSavedActiveIds): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(nbcardSavedActiveKey(namespace), JSON.stringify(next));
}

export function setNbcardActiveSavedCardId(namespace: string, category: NbcardSavedCardCategory, id: string | null): void {
  const state = loadNbcardActiveSavedCardIds(namespace);
  const next: NbcardSavedActiveIds = { ...state };
  if (id) next[category] = id;
  else delete next[category];
  saveNbcardActiveSavedCardIds(namespace, next);
}

export function migrateNbcardSavedCardsFromLegacy(namespace: string, legacyNamespaces: string[]): void {
  if (typeof window === "undefined") return;

  // If new storage already exists, do nothing.
  const existing = window.localStorage.getItem(nbcardSavedKey(namespace));
  const existingActive = window.localStorage.getItem(nbcardSavedActiveKey(namespace));
  if (existing || existingActive) return;

  for (const legacyNs of legacyNamespaces) {
    const legacyCardsRaw = window.localStorage.getItem(`${NBCARD_LEGACY_SAVED_KEY_PREFIX}${legacyNs}`);
    const legacyActiveRaw = window.localStorage.getItem(`${NBCARD_LEGACY_ACTIVE_KEY_PREFIX}${legacyNs}`);

    const legacyCards = safeJsonParse<unknown[]>(legacyCardsRaw);
    const legacyActive = safeJsonParse<NbcardSavedActiveIds>(legacyActiveRaw);

    const migratedCards: NbcardSavedCard[] = Array.isArray(legacyCards)
      ? legacyCards
          .map((c) => {
            if (!isRecord(c)) return null;
            const category = coerceCategory(c.category);
            if (!category) return null;
            const id = typeof c.id === "string" ? c.id : null;
            const title = typeof c.name === "string" ? c.name : typeof c.title === "string" ? c.title : null;
            const snapshotRaw = c.profile ?? c.snapshot;
            const snapshot = isRecord(snapshotRaw) ? (snapshotRaw as unknown as Profile) : null;
            if (!id || !title || !snapshot) return null;
            const updatedAtRaw = c.updatedAt;
            const createdAtRaw = c.createdAt;
            const updatedAt =
              typeof updatedAtRaw === "string"
                ? Date.parse(updatedAtRaw)
                : typeof updatedAtRaw === "number"
                ? updatedAtRaw
                : Date.now();
            const createdAt =
              typeof createdAtRaw === "string"
                ? Date.parse(createdAtRaw)
                : typeof createdAtRaw === "number"
                ? createdAtRaw
                : undefined;

            return {
              id,
              title,
              category,
              snapshot,
              updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
              ...(typeof createdAt === "number" && Number.isFinite(createdAt) ? { createdAt } : {}),
            };
          })
          .filter((c): c is NbcardSavedCard => c !== null)
      : [];

    if (migratedCards.length > 0) {
      saveNbcardSavedCards(namespace, migratedCards);
    }

    if (legacyActive && typeof legacyActive === "object") {
      saveNbcardActiveSavedCardIds(namespace, legacyActive);
    }

    if (migratedCards.length > 0 || (legacyActive && typeof legacyActive === "object")) {
      return;
    }
  }
}

export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  company: string;
  category: "Business" | "Personal";
  notes: string;
  createdAt: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export const defaultProfile: Profile = {
  id: "default",
  fullName: "Alkhadi Koroma",
  jobTitle: "Flutter Developer",
  phone: "+44-77-1315-0495",
  email: "koromadjmoe@gmail.com",
  profileDescription: "",
  businessDescription: "",
  gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
  socialMedia: {},
};