/**
 * NB-Card Server Sync Library (Phase 7)
 * 
 * Client-side utilities for syncing profiles and contacts with server
 * Handles upload, download, and merge strategies
 */

import type { Profile, Contact } from '@/lib/utils';
import type { TemplateSelection } from '@/lib/nbcard-templates';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncResult {
  success: boolean;
  synced?: {
    profiles: number;
    contacts: number;
  };
  error?: string;
  timestamp?: string;
}

export interface PullResult {
  success: boolean;
  profiles: Array<{
    id: string;
    profileData: Profile;
    templateData?: TemplateSelection;
    updatedAt: string;
    createdAt: string;
  }>;
  contacts: Array<{
    id: string;
    contactData: Contact;
    updatedAt: string;
    createdAt: string;
  }>;
  error?: string;
  timestamp?: string;
}

/**
 * Upload local profiles and contacts to server
 */
export async function syncToServer(
  deviceId: string,
  profiles: Profile[],
  contacts: Contact[]
): Promise<SyncResult> {
  try {
    const payload = {
      deviceId,
      profiles: profiles.map((p) => ({
        id: p.id,
        profileData: p,
        templateData: undefined, // TODO: Get from localStorage or state
        updatedAt: new Date().toISOString(),
      })),
      contacts: contacts.map((c) => ({
        id: c.id,
        contactData: c,
        updatedAt: new Date().toISOString(),
      })),
    };

    const response = await fetch('/api/nb-card/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      synced: result.synced,
      timestamp: result.timestamp,
    };
  } catch (error) {
    console.error('[NBCard Sync] Upload failed:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Download profiles and contacts from server
 */
export async function pullFromServer(deviceId: string): Promise<PullResult> {
  try {
    const response = await fetch(`/api/nb-card/pull?deviceId=${encodeURIComponent(deviceId)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      profiles: result.profiles,
      contacts: result.contacts,
      timestamp: result.timestamp,
    };
  } catch (error) {
    console.error('[NBCard Sync] Pull failed:', error);
    return {
      success: false,
      profiles: [],
      contacts: [],
      error: String(error),
    };
  }
}

/**
 * Merge downloaded server data with local data
 * Strategy: Deduplicate by UUID, prefer most recent updatedAt
 */
export function mergeProfiles(
  localProfiles: Profile[],
  serverProfiles: Array<{ id: string; profileData: Profile; updatedAt: string }>
): Profile[] {
  const merged = new Map<string, Profile>();

  // Add all local profiles first
  for (const profile of localProfiles) {
    merged.set(profile.id, profile);
  }

  // Merge server profiles (overwrite if server is newer)
  for (const serverItem of serverProfiles) {
    const local = merged.get(serverItem.id);
    
    if (!local) {
      // New profile from server
      merged.set(serverItem.id, serverItem.profileData);
    } else {
      // Compare timestamps - prefer most recent
      const localUpdated = new Date(local.id); // Fallback: use ID as timestamp if no updatedAt
      const serverUpdated = new Date(serverItem.updatedAt);
      
      if (serverUpdated > localUpdated) {
        merged.set(serverItem.id, serverItem.profileData);
      }
      // else: keep local (it's newer)
    }
  }

  return Array.from(merged.values());
}

/**
 * Merge downloaded server contacts with local contacts
 */
export function mergeContacts(
  localContacts: Contact[],
  serverContacts: Array<{ id: string; contactData: Contact; updatedAt: string }>
): Contact[] {
  const merged = new Map<string, Contact>();

  // Add all local contacts first
  for (const contact of localContacts) {
    merged.set(contact.id, contact);
  }

  // Merge server contacts
  for (const serverItem of serverContacts) {
    const local = merged.get(serverItem.id);
    
    if (!local) {
      merged.set(serverItem.id, serverItem.contactData);
    } else {
      // Compare timestamps - prefer most recent
      const localUpdated = new Date(local.createdAt || local.id);
      const serverUpdated = new Date(serverItem.updatedAt);
      
      if (serverUpdated > localUpdated) {
        merged.set(serverItem.id, serverItem.contactData);
      }
    }
  }

  return Array.from(merged.values());
}

/**
 * Full sync flow: Pull from server, merge with local, push back to server
 */
export async function fullSync(
  deviceId: string,
  localProfiles: Profile[],
  localContacts: Contact[]
): Promise<{
  success: boolean;
  mergedProfiles: Profile[];
  mergedContacts: Contact[];
  error?: string;
}> {
  try {
    // 1. Pull from server
    const pullResult = await pullFromServer(deviceId);
    if (!pullResult.success) {
      throw new Error(pullResult.error || 'Pull failed');
    }

    // 2. Merge with local data
    const mergedProfiles = mergeProfiles(localProfiles, pullResult.profiles);
    const mergedContacts = mergeContacts(localContacts, pullResult.contacts);

    // 3. Push merged data back to server
    const syncResult = await syncToServer(deviceId, mergedProfiles, mergedContacts);
    if (!syncResult.success) {
      throw new Error(syncResult.error || 'Sync failed');
    }

    return {
      success: true,
      mergedProfiles,
      mergedContacts,
    };
  } catch (error) {
    console.error('[NBCard Sync] Full sync failed:', error);
    return {
      success: false,
      mergedProfiles: localProfiles,
      mergedContacts: localContacts,
      error: String(error),
    };
  }
}
