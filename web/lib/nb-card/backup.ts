/**
 * NB-Card Backup & Restore
 * Implements versioned JSON backup/import per spec (BACKUP_SCHEMA.json)
 */

import type { Contact, Profile } from "@/lib/utils";

export type NBCardBackupV1 = {
  version: 1;
  exportedAt: string; // ISO 8601
  cards: Profile[];
  contacts: Contact[];
};

function nowIso(): string {
  return new Date().toISOString();
}

function makeImportedId(originalId: unknown): string {
  const base = typeof originalId === "string" && originalId.trim() ? originalId.trim() : "item";

  // Prefer UUID when available (browser).
  const uuid =
    typeof globalThis !== "undefined" &&
    "crypto" in globalThis &&
    globalThis.crypto &&
    "randomUUID" in globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : null;

  if (uuid) return `${base}-imported-${uuid}`;
  return `${base}-imported-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Export all cards and contacts to a versioned JSON backup
 */
export function createBackup(profiles: Profile[], contacts: Contact[]): NBCardBackupV1 {
  return {
    version: 1,
    exportedAt: nowIso(),
    cards: profiles,
    contacts: contacts,
  };
}

/**
 * Validate backup file structure
 * Returns null if invalid, otherwise returns the validated backup
 */
export function validateBackup(data: unknown): NBCardBackupV1 | null {
  if (!data || typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;

  // Canonical format
  if (obj.version === 1) {
    if (typeof obj.exportedAt !== "string") return null;
    if (!Array.isArray(obj.cards)) return null;
    if (!Array.isArray(obj.contacts)) return null;

    return obj as NBCardBackupV1;
  }

  // Backward-compat: legacy local-state export shape.
  // { schemaVersion: 1, profiles: Profile[], contacts: Contact[], updatedAt?: string }
  if (obj.schemaVersion === 1 && Array.isArray(obj.profiles)) {
    return {
      version: 1,
      exportedAt: typeof obj.updatedAt === "string" && obj.updatedAt ? obj.updatedAt : nowIso(),
      cards: obj.profiles as Profile[],
      contacts: Array.isArray(obj.contacts) ? (obj.contacts as Contact[]) : [],
    };
  }

  return null;
}

/**
 * Conflict resolution strategy for imports
 */
export type ConflictStrategy = "skip" | "overwrite" | "duplicate";

/**
 * Apply migrations from older backup versions (future-proof)
 */
export function migrateBackup(backup: NBCardBackupV1): NBCardBackupV1 {
  // v1: no migrations needed yet
  // Future versions: add transformation logic here
  return backup;
}

/**
 * Merge imported cards with existing cards based on conflict strategy
 */
export function mergeCards(
  existing: Profile[],
  imported: Profile[],
  strategy: ConflictStrategy = "duplicate"
): Profile[] {
  if (strategy === "overwrite") {
    // Replace all existing cards
    return imported;
  }

  if (strategy === "skip") {
    // Keep existing, add only new IDs
    const existingIds = new Set(existing.map((p) => p.id));
    const newCards = imported.filter((p) => !existingIds.has(p.id));
    return [...existing, ...newCards];
  }

  // duplicate: import all with new IDs for duplicates
  const existingIds = new Set(existing.map((p) => p.id));
  const deduplicated = imported.map((p) => {
    const nextId = typeof p.id === "string" && p.id.trim() ? p.id.trim() : "";

    if (!nextId) {
      return { ...p, id: makeImportedId(p.id) };
    }

    if (existingIds.has(nextId)) {
      return { ...p, id: makeImportedId(nextId) };
    }

    return { ...p, id: nextId };
  });

  return [...existing, ...deduplicated];
}

/**
 * Merge imported contacts with existing contacts
 */
export function mergeContacts(
  existing: Contact[],
  imported: Contact[],
  strategy: ConflictStrategy = "duplicate"
): Contact[] {
  if (strategy === "overwrite") {
    return imported;
  }

  if (strategy === "skip") {
    const existingIds = new Set(existing.map((c) => c.id));
    const newContacts = imported.filter((c) => !existingIds.has(c.id));
    return [...existing, ...newContacts];
  }

  // duplicate
  const existingIds = new Set(existing.map((c) => c.id));
  const deduplicated = imported.map((c) => {
    const nextId = typeof c.id === "string" && c.id.trim() ? c.id.trim() : "";

    if (!nextId) {
      return { ...c, id: makeImportedId(c.id) };
    }

    if (existingIds.has(nextId)) {
      return { ...c, id: makeImportedId(nextId) };
    }

    return { ...c, id: nextId };
  });

  return [...existing, ...deduplicated];
}
