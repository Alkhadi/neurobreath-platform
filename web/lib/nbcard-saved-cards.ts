import type { Profile } from "@/lib/utils";

export type SavedCardCategory = "PROFILE" | "ADDRESS" | "BANK" | "BUSINESS" | "FLYER";

export type SavedCardRecord = {
  id: string; // also the Profile.id that will be loaded/shared
  name: string;
  category: SavedCardCategory;
  profile: Profile;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  templateId?: string;
};

const KEY_SAVED_CARDS_PREFIX = "nbcard:savedCards:v1:";
const KEY_SAVED_ACTIVE_PREFIX = "nbcard:savedCards:activeId:v1:";
const KEY_DRAFT_PREFIX = "nbcard:profileDraft:v1:";

function nowIso(): string {
  return new Date().toISOString();
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getNbcardStorageNamespace(params: { userEmail?: string; profileEmail?: string }): string {
  const raw = (params.userEmail ?? params.profileEmail ?? "").trim().toLowerCase();
  if (raw && raw.includes("@")) return `email:${raw}`;
  return "guest";
}

function getSavedCardsKey(namespace: string): string {
  return `${KEY_SAVED_CARDS_PREFIX}${namespace}`;
}

function getActiveKey(namespace: string): string {
  return `${KEY_SAVED_ACTIVE_PREFIX}${namespace}`;
}

function getDraftKey(namespace: string, profileId: string): string {
  return `${KEY_DRAFT_PREFIX}${namespace}:${profileId}`;
}

export function getCategoryFromProfile(profile: Profile): SavedCardCategory {
  switch (profile.cardCategory) {
    case "ADDRESS":
      return "ADDRESS";
    case "BANK":
      return "BANK";
    case "BUSINESS":
      return "BUSINESS";
    case "FLYER":
      return "FLYER";
    default:
      return "PROFILE";
  }
}

export function normalizeProfileForCategory(profile: Profile, category: SavedCardCategory): Profile {
  if (category === "PROFILE") {
    const { addressCard: _addressCard, bankCard: _bankCard, businessCard: _businessCard, cardCategory: _cardCategory, ...rest } = profile;
    return {
      ...rest,
      cardCategory: undefined,
      socialMedia: rest.socialMedia ?? {},
    };
  }

  if (category === "FLYER") {
    const { addressCard: _addressCard, bankCard: _bankCard, businessCard: _businessCard, ...rest } = profile;
    return {
      ...rest,
      cardCategory: "FLYER",
      socialMedia: profile.socialMedia ?? {},
      flyerCard: profile.flyerCard ?? {},
      addressCard: undefined,
      bankCard: undefined,
      businessCard: undefined,
    };
  }

  const cardCategory = category;

  return {
    ...profile,
    cardCategory,
    socialMedia: profile.socialMedia ?? {},
    addressCard: cardCategory === "ADDRESS" ? (profile.addressCard ?? {}) : undefined,
    bankCard: cardCategory === "BANK" ? (profile.bankCard ?? {}) : undefined,
    businessCard: cardCategory === "BUSINESS" ? (profile.businessCard ?? {}) : undefined,
    flyerCard: undefined,
  };
}

export function generateProfileId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function loadSavedCards(namespace: string): SavedCardRecord[] {
  if (typeof window === "undefined") return [];
  const parsed = safeJsonParse<SavedCardRecord[]>(window.localStorage.getItem(getSavedCardsKey(namespace)));
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((c) => c && typeof c === "object")
    .map((c) => c as SavedCardRecord)
    .filter((c) => typeof c.id === "string" && typeof c.name === "string" && typeof c.category === "string" && c.profile);
}

export function saveSavedCards(namespace: string, cards: SavedCardRecord[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getSavedCardsKey(namespace), JSON.stringify(cards));
}

export function upsertSavedCard(namespace: string, next: SavedCardRecord): SavedCardRecord[] {
  const cards = loadSavedCards(namespace);
  const idx = cards.findIndex((c) => c.id === next.id);
  const withTimestamps: SavedCardRecord = {
    ...next,
    createdAt: next.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  const updated = idx >= 0 ? cards.map((c) => (c.id === next.id ? withTimestamps : c)) : [withTimestamps, ...cards];
  saveSavedCards(namespace, updated);
  return updated;
}

export function deleteSavedCard(namespace: string, id: string): SavedCardRecord[] {
  const cards = loadSavedCards(namespace);
  const updated = cards.filter((c) => c.id !== id);
  saveSavedCards(namespace, updated);

  const active = loadActiveSavedCardIds(namespace);
  const nextActive: Partial<Record<SavedCardCategory, string>> = { ...active };
  (Object.keys(nextActive) as SavedCardCategory[]).forEach((k) => {
    if (nextActive[k] === id) delete nextActive[k];
  });
  saveActiveSavedCardIds(namespace, nextActive);

  return updated;
}

export function loadActiveSavedCardIds(namespace: string): Partial<Record<SavedCardCategory, string>> {
  if (typeof window === "undefined") return {};
  const parsed = safeJsonParse<Partial<Record<SavedCardCategory, string>>>(window.localStorage.getItem(getActiveKey(namespace)));
  if (!parsed || typeof parsed !== "object") return {};
  return parsed;
}

export function saveActiveSavedCardIds(namespace: string, next: Partial<Record<SavedCardCategory, string>>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getActiveKey(namespace), JSON.stringify(next));
}

export function setActiveSavedCardId(namespace: string, category: SavedCardCategory, id: string | null): void {
  const state = loadActiveSavedCardIds(namespace);
  const next: Partial<Record<SavedCardCategory, string>> = { ...state };
  if (id) next[category] = id;
  else delete next[category];
  saveActiveSavedCardIds(namespace, next);
}

export function loadProfileDraft(namespace: string, profileId: string): Profile | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<Profile>(window.localStorage.getItem(getDraftKey(namespace, profileId)));
}

export function saveProfileDraft(namespace: string, profile: Profile): void {
  if (typeof window === "undefined") return;
  if (!profile.id) return;
  window.localStorage.setItem(getDraftKey(namespace, profile.id), JSON.stringify(profile));
}

export function clearProfileDraft(namespace: string, profileId: string): void {
  if (typeof window === "undefined") return;
  if (!profileId) return;
  window.localStorage.removeItem(getDraftKey(namespace, profileId));
}
