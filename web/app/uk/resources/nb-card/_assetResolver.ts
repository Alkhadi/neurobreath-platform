/**
 * Asset Resolution & Local Storage Layer for NB-Card
 * 
 * Handles three URL sources reliably for both preview and capture:
 * 1) /public/nb-card/templates/... (built-in, always capture-safe)
 * 2) https://... (remote URLs, attempted capture-safe)
 * 3) local://<key> (IndexedDB-stored user uploads)
 * 
 * Used by:
 * - ProfileCard (preview rendering)
 * - share-buttons (PNG/PDF capture)
 * - ProfileManager (asset management UI)
 */

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'nbcard-assets';
const DB_VERSION = 1;
const STORE_ASSETS = 'blobs'; // Store: { key, blob, mimeType }
const NAMESPACE_GUEST = 'guest-' + getOrCreateGuestId();
const NAMESPACE_SIGNED_IN = (email?: string) => email ? `signed-${email}` : NAMESPACE_GUEST;

// Guest device ID (persisted once)
function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'server';
  const key = 'nbcard-guest-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_ASSETS)) {
          db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

interface _StoredAsset {
  id: string; // Full key: namespace:filename
  blob: Blob;
  mimeType: string;
}

/**
 * Save a user-uploaded file to IndexedDB
 * Returns: local://<key> URL for storing in profile
 */
export async function saveUserAsset(
  file: Blob,
  userEmail?: string
): Promise<string> {
  const namespace = userEmail ? NAMESPACE_SIGNED_IN(userEmail) : NAMESPACE_GUEST;
  const key = `${namespace}:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  const db = await getDb();
  await db.put(STORE_ASSETS, {
    id: key,
    blob: file,
    mimeType: file.type,
  });
  
  return `local://${key}`;
}

/**
 * Retrieve a stored asset and create an object URL
 * Returns: { src: objectURL, revoke: () => void }
 * 
 * CALLER MUST revoke() when done to prevent memory leaks
 */
export async function resolveAssetUrl(
  url: string | undefined,
  _userEmail?: string
): Promise<{ src: string; revoke?: () => void } | null> {
  if (!url) return null;

  // Built-in template: keep as-is
  if (url.startsWith('/nb-card/templates/')) {
    return { src: url };
  }

  // Remote URL: keep as-is (assume CORS is handled or capture-safe)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return { src: url };
  }

  // Local upload: retrieve from IndexedDB and create objectURL
  if (url.startsWith('local://')) {
    try {
      const key = url.substring(8); // Remove 'local://'
      const db = await getDb();
      const asset = await db.get(STORE_ASSETS, key);
      
      if (!asset) {
        console.warn(`Asset not found: ${key}`);
        return null;
      }

      const objectUrl = URL.createObjectURL(asset.blob);
      return {
        src: objectUrl,
        revoke: () => URL.revokeObjectURL(objectUrl),
      };
    } catch (err) {
      console.error('Failed to resolve local asset:', err);
      return null;
    }
  }

  return null;
}

/**
 * Delete a user asset from IndexedDB
 */
export async function deleteUserAsset(url: string): Promise<void> {
  if (!url.startsWith('local://')) return;

  try {
    const key = url.substring(8);
    const db = await getDb();
    await db.delete(STORE_ASSETS, key);
  } catch (err) {
    console.error('Failed to delete asset:', err);
  }
}

/**
 * Clean up all object URLs created from resolveAssetUrl
 * Call this when component unmounts or changes occur
 */
export function revokeAssetUrl(resolved: { revoke?: () => void } | null | undefined): void {
  resolved?.revoke?.();
}
