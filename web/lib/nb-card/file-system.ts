/**
 * File System Access API utility for NB-Card.
 * Enables users to save/load card profiles as JSON files
 * and export cards as PNG/PDF directly to device folders.
 *
 * Uses the File System Access API (Chrome/Edge) with fallback
 * to standard download links for unsupported browsers.
 */

import type { Profile, Contact } from "@/lib/utils";

/** Check if File System Access API is available */
export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "showSaveFilePicker" in window &&
    "showOpenFilePicker" in window &&
    "showDirectoryPicker" in window
  );
}

/** Show a "save file" picker and write content to the chosen file. */
export async function saveFileToDevice(
  data: string | Blob,
  suggestedName: string,
  types?: FilePickerAcceptType[],
): Promise<{ ok: boolean; name?: string }> {
  if (!isFileSystemAccessSupported()) {
    // Fallback: standard download
    const blob = typeof data === "string" ? new Blob([data], { type: "application/json" }) : data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName;
    a.click();
    URL.revokeObjectURL(url);
    return { ok: true, name: suggestedName };
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: types ?? [
        {
          description: "NB-Card File",
          accept: { "application/json": [".json", ".nbcard"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    const blob = typeof data === "string" ? new Blob([data], { type: "application/json" }) : data;
    await writable.write(blob);
    await writable.close();
    return { ok: true, name: handle.name };
  } catch (err: unknown) {
    // User cancelled the picker
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false };
    }
    throw err;
  }
}

/** Show a "open file" picker and read the selected file. */
export async function openFileFromDevice(
  types?: FilePickerAcceptType[],
): Promise<{ ok: boolean; content?: string; name?: string }> {
  if (!isFileSystemAccessSupported()) {
    // Fallback: standard file input
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,.nbcard";
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          resolve({ ok: false });
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ ok: true, content: reader.result as string, name: file.name });
        reader.onerror = () => resolve({ ok: false });
        reader.readAsText(file);
      };
      input.click();
    });
  }

  try {
    const [handle] = await window.showOpenFilePicker({
      types: types ?? [
        {
          description: "NB-Card File",
          accept: { "application/json": [".json", ".nbcard"] },
        },
      ],
      multiple: false,
    });
    const file = await handle.getFile();
    const content = await file.text();
    return { ok: true, content, name: file.name };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false };
    }
    throw err;
  }
}

/** Save a single card profile as a .nbcard JSON file */
export async function saveCardFile(profile: Profile): Promise<{ ok: boolean; name?: string }> {
  const safeName = (profile.fullName || "NB-Card").replace(/[^a-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "_");
  const payload = JSON.stringify(
    {
      version: 1,
      type: "nb-card-profile",
      exportedAt: new Date().toISOString(),
      profile,
    },
    null,
    2,
  );
  return saveFileToDevice(payload, `${safeName}.nbcard`);
}

/** Load a card profile from a .nbcard JSON file */
export async function loadCardFile(): Promise<{ ok: boolean; profile?: Profile; error?: string }> {
  const result = await openFileFromDevice();
  if (!result.ok || !result.content) return { ok: false };

  try {
    const parsed = JSON.parse(result.content);
    if (parsed.type !== "nb-card-profile" || !parsed.profile) {
      return { ok: false, error: "Invalid NB-Card file format" };
    }
    return { ok: true, profile: parsed.profile as Profile };
  } catch {
    return { ok: false, error: "Failed to parse file" };
  }
}

/** Export all profiles and contacts as a backup file */
export async function saveAllCardsFile(
  profiles: Profile[],
  contacts: Contact[],
): Promise<{ ok: boolean; name?: string }> {
  const payload = JSON.stringify(
    {
      version: 1,
      type: "nb-card-backup",
      exportedAt: new Date().toISOString(),
      profiles,
      contacts,
    },
    null,
    2,
  );
  return saveFileToDevice(payload, `NB-Card-Backup-${new Date().toISOString().slice(0, 10)}.nbcard`);
}

/** Load all profiles and contacts from a backup file */
export async function loadAllCardsFile(): Promise<{
  ok: boolean;
  profiles?: Profile[];
  contacts?: Contact[];
  error?: string;
}> {
  const result = await openFileFromDevice();
  if (!result.ok || !result.content) return { ok: false };

  try {
    const parsed = JSON.parse(result.content);
    if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
      return { ok: false, error: "Invalid backup file format" };
    }
    return {
      ok: true,
      profiles: parsed.profiles as Profile[],
      contacts: Array.isArray(parsed.contacts) ? (parsed.contacts as Contact[]) : [],
    };
  } catch {
    return { ok: false, error: "Failed to parse backup file" };
  }
}

/** Save a PNG/PDF blob directly to the device filesystem */
export async function saveImageToDevice(
  blob: Blob,
  suggestedName: string,
  mimeType: string,
): Promise<{ ok: boolean; name?: string }> {
  const ext = mimeType.includes("pdf") ? ".pdf" : ".png";
  const types: FilePickerAcceptType[] = [
    {
      description: mimeType.includes("pdf") ? "PDF Document" : "PNG Image",
      accept: { [mimeType]: [ext] },
    },
  ];
  return saveFileToDevice(blob, suggestedName, types);
}

// --- Folder operations (Chrome File System Access only) ---

/** Pick a directory and return its handle for repeated writes */
export async function pickSaveFolder(): Promise<FileSystemDirectoryHandle | null> {
  if (!isFileSystemAccessSupported() || !("showDirectoryPicker" in window)) {
    return null;
  }
  try {
    return await window.showDirectoryPicker({ mode: "readwrite" });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return null;
    }
    throw err;
  }
}

/** Save a file into a chosen directory handle */
export async function saveToFolder(
  dirHandle: FileSystemDirectoryHandle,
  fileName: string,
  data: string | Blob,
): Promise<{ ok: boolean }> {
  try {
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    const blob = typeof data === "string" ? new Blob([data], { type: "application/json" }) : data;
    await writable.write(blob);
    await writable.close();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Create a subfolder inside a directory handle */
export async function createSubfolder(
  dirHandle: FileSystemDirectoryHandle,
  folderName: string,
): Promise<FileSystemDirectoryHandle | null> {
  try {
    return await dirHandle.getDirectoryHandle(folderName, { create: true });
  } catch {
    return null;
  }
}

// --- TypeScript declarations for File System Access API ---
declare global {
  interface Window {
    showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
    showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;
  }

  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
  }

  interface OpenFilePickerOptions {
    types?: FilePickerAcceptType[];
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
  }

  interface DirectoryPickerOptions {
    id?: string;
    mode?: "read" | "readwrite";
    startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
  }

  interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string[]>;
  }
}
