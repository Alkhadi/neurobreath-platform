import { openDB, type IDBPDatabase } from 'idb';

import type { Contact, Profile } from '@/lib/utils';

export type NbcardLocalState = {
  schemaVersion: 1;
  profiles: Profile[];
  contacts: Contact[];
  updatedAt: string; // ISO
};

// Versioned keys ensure future website updates don't overwrite user data.
const STORAGE_KEY_PROFILES = 'nbcard:v1:profiles';
const STORAGE_KEY_CONTACTS = 'nbcard:v1:contacts';
const STORAGE_KEY_UPDATED_AT = 'nbcard:v1:updatedAt';

// Backwards-compatible legacy keys (read-only migration).
const LEGACY_KEY_PROFILES = 'nbcard_profiles';
const LEGACY_KEY_CONTACTS = 'nbcard_contacts';
const LEGACY_KEY_UPDATED_AT = 'nbcard_updated_at';

const DB_NAME = 'nbcard';
const DB_VERSION = 1;
const STORE_KV = 'kv';

type KvKey = string;

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_KV)) {
          db.createObjectStore(STORE_KV);
        }
      },
    });
  }
  return dbPromise;
}

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

async function kvGet<T>(key: KvKey): Promise<T | null> {
  try {
    const db = await getDb();
    return (await db.get(STORE_KV, key)) as T | null;
  } catch {
    // Fallback to localStorage
    return safeJsonParse<T>(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null);
  }
}

async function kvSet<T>(key: KvKey, value: T): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE_KV, value, key);
  } catch {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

async function kvDel(key: KvKey): Promise<void> {
  try {
    const db = await getDb();
    await db.delete(STORE_KV, key);
  } catch {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }
}

export async function loadNbcardLocalState(fallbackProfiles: Profile[], fallbackContacts: Contact[] = []): Promise<NbcardLocalState> {
  const [profilesV1, contactsV1, updatedAtV1, profilesLegacy, contactsLegacy, updatedAtLegacy] = await Promise.all([
    kvGet<Profile[]>(STORAGE_KEY_PROFILES),
    kvGet<Contact[]>(STORAGE_KEY_CONTACTS),
    kvGet<string>(STORAGE_KEY_UPDATED_AT),
    kvGet<Profile[]>(LEGACY_KEY_PROFILES),
    kvGet<Contact[]>(LEGACY_KEY_CONTACTS),
    kvGet<string>(LEGACY_KEY_UPDATED_AT),
  ]);

  // One-way migration: if v1 is missing but legacy exists, copy forward.
  const profiles = profilesV1 ?? profilesLegacy;
  const contacts = contactsV1 ?? contactsLegacy;
  const updatedAt = updatedAtV1 ?? updatedAtLegacy;

  await Promise.all([
    profilesV1 ? Promise.resolve() : profilesLegacy ? kvSet(STORAGE_KEY_PROFILES, profilesLegacy) : Promise.resolve(),
    contactsV1 ? Promise.resolve() : contactsLegacy ? kvSet(STORAGE_KEY_CONTACTS, contactsLegacy) : Promise.resolve(),
    updatedAtV1 ? Promise.resolve() : updatedAtLegacy ? kvSet(STORAGE_KEY_UPDATED_AT, updatedAtLegacy) : Promise.resolve(),
  ]);

  return {
    schemaVersion: 1,
    profiles: Array.isArray(profiles) && profiles.length > 0 ? profiles : fallbackProfiles,
    contacts: Array.isArray(contacts) ? contacts : fallbackContacts,
    updatedAt: typeof updatedAt === 'string' && updatedAt ? updatedAt : nowIso(),
  };
}

export async function saveNbcardLocalState(next: { profiles: Profile[]; contacts: Contact[] }): Promise<string> {
  const updatedAt = nowIso();
  await Promise.all([
    kvSet(STORAGE_KEY_PROFILES, next.profiles),
    kvSet(STORAGE_KEY_CONTACTS, next.contacts),
    kvSet(STORAGE_KEY_UPDATED_AT, updatedAt),
  ]);
  return updatedAt;
}

export async function exportNbcardLocalState(): Promise<NbcardLocalState> {
  const profiles = (await kvGet<Profile[]>(STORAGE_KEY_PROFILES)) ?? [];
  const contacts = (await kvGet<Contact[]>(STORAGE_KEY_CONTACTS)) ?? [];
  const updatedAt = (await kvGet<string>(STORAGE_KEY_UPDATED_AT)) ?? nowIso();

  return {
    schemaVersion: 1,
    profiles,
    contacts,
    updatedAt,
  };
}

export async function importNbcardLocalState(state: NbcardLocalState): Promise<void> {
  await Promise.all([
    kvSet(STORAGE_KEY_PROFILES, state.profiles),
    kvSet(STORAGE_KEY_CONTACTS, state.contacts),
    kvSet(STORAGE_KEY_UPDATED_AT, state.updatedAt || nowIso()),
  ]);
}

export async function resetNbcardProfiles(): Promise<void> {
  await kvDel(STORAGE_KEY_PROFILES);
  await kvSet(STORAGE_KEY_UPDATED_AT, nowIso());
}

export async function resetNbcardContacts(): Promise<void> {
  await kvDel(STORAGE_KEY_CONTACTS);
  await kvSet(STORAGE_KEY_UPDATED_AT, nowIso());
}
