/**
 * NB-Card Local Asset Storage (IndexedDB)
 * Stores user-uploaded images (background + avatar) with namespace isolation:
 * - Guest: device-id (generated once, stored in localStorage)
 * - Signed-in: user email (when available)
 */

const DB_NAME = "nbcard-assets";
const DB_VERSION = 1;
const STORE_NAME = "assets";
const DEVICE_ID_KEY = "nbcard-device-id";

function getDeviceId(): string {
  if (typeof window === "undefined") return "default";
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

function getUserNamespace(userEmail?: string): string {
  return userEmail || getDeviceId();
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Store structure: { key: "namespace:assetKey", blob: Blob, timestamp: number }
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
  });
}

/**
 * Store a Blob in IndexedDB
 * Returns a "local://<key>" URL to store in Profile
 */
export async function storeAsset(blob: Blob, assetKey: string, userEmail?: string): Promise<string> {
  const db = await openDB();
  const namespace = getUserNamespace(userEmail);
  const fullKey = `${namespace}:${assetKey}`;
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    
    const record = {
      key: fullKey,
      blob,
      timestamp: Date.now(),
    };
    
    const request = store.put(record);
    
    request.onsuccess = () => resolve(`local://${assetKey}`);
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
}

/**
 * Retrieve a Blob from IndexedDB by key
 */
export async function retrieveAsset(assetKey: string, userEmail?: string): Promise<Blob | null> {
  const db = await openDB();
  const namespace = getUserNamespace(userEmail);
  const fullKey = `${namespace}:${assetKey}`;
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(fullKey);
    
    request.onsuccess = () => {
      const record = request.result;
      resolve(record?.blob || null);
    };
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
}

/**
 * Delete an asset from IndexedDB
 */
export async function deleteAsset(assetKey: string, userEmail?: string): Promise<void> {
  const db = await openDB();
  const namespace = getUserNamespace(userEmail);
  const fullKey = `${namespace}:${assetKey}`;
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(fullKey);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
}

/**
 * Resolve asset URL to a renderable src
 * - "/nb-card/templates/..." -> returns as-is (built-in template)
 * - "https://..." -> returns as-is (remote URL, may have CORS issues but we try)
 * - "local://<key>" -> retrieves from IndexedDB and returns objectURL
 * 
 * Returns { src, revoke } where revoke() cleans up objectURLs
 */
export async function resolveAssetUrl(
  inputUrl: string | undefined,
  userEmail?: string
): Promise<{ src: string; revoke?: () => void } | null> {
  if (!inputUrl) return null;
  
  // Built-in template (same-origin)
  if (inputUrl.startsWith("/nb-card/templates/")) {
    return { src: inputUrl };
  }
  
  // Remote URL (may have CORS)
  if (inputUrl.startsWith("http://") || inputUrl.startsWith("https://")) {
    return { src: inputUrl };
  }
  
  // Local IndexedDB asset
  if (inputUrl.startsWith("local://")) {
    const assetKey = inputUrl.replace("local://", "");
    try {
      const blob = await retrieveAsset(assetKey, userEmail);
      if (!blob) return null;
      
      const objectUrl = URL.createObjectURL(blob);
      return {
        src: objectUrl,
        revoke: () => URL.revokeObjectURL(objectUrl),
      };
    } catch (err) {
      console.error("Failed to retrieve local asset:", err);
      return null;
    }
  }
  
  // Unknown format, return as-is
  return { src: inputUrl };
}

/**
 * Generate a unique asset key for uploads
 */
export function generateAssetKey(prefix: "bg" | "avatar"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
