/**
 * normalizeAssets.ts
 *
 * Before creating a public server share, replace any device-local asset
 * references in a Profile or canvas layers with stable S3 URLs so another
 * device can load them.
 *
 * Handles:
 *   - local://  — IndexedDB blobs stored via nbcard-assets.ts
 *   - blob:     — in-memory object URLs (File picker, canvas capture)
 *
 * Everything else (https://, /nb-card/templates/...) is returned unchanged.
 * data: URIs are returned unchanged — they are self-contained.
 *
 * This module is safe to call from the client side only (uses browser APIs).
 */

import { retrieveAsset } from "@/app/contact/lib/nbcard-assets";
import type { CardLayer, AvatarLayer } from "@/lib/utils";

// ---------------------------------------------------------------------------
// S3 upload via existing presigned-URL flow
// ---------------------------------------------------------------------------

const PRESIGNED_ENDPOINT = "/api/upload/presigned";
const COMPLETE_ENDPOINT = "/api/upload/complete";

/**
 * Upload a Blob to S3 using the existing presigned-URL flow.
 * Returns the public S3 URL, or null if upload is unavailable or fails.
 */
export async function uploadBlobToS3(
  blob: Blob,
  filename: string
): Promise<string | null> {
  try {
    // Step 1: Request a presigned PUT URL
    const presignedRes = await fetch(PRESIGNED_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: filename,
        contentType: blob.type || "image/png",
        isPublic: true,
      }),
    });
    if (!presignedRes.ok) return null;

    const { uploadUrl, cloud_storage_path } = (await presignedRes.json()) as {
      uploadUrl?: string;
      cloud_storage_path?: string;
    };
    if (!uploadUrl || !cloud_storage_path) return null;

    // Step 2: PUT blob directly to S3
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": blob.type || "image/png" },
      body: blob,
    });
    if (!putRes.ok) return null;

    // Step 3: Resolve the public URL
    const completeRes = await fetch(COMPLETE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cloud_storage_path, isPublic: true }),
    });
    if (!completeRes.ok) return null;

    const { fileUrl } = (await completeRes.json()) as { fileUrl?: string };
    return fileUrl ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Single asset normalization
// ---------------------------------------------------------------------------

/**
 * Resolves a single asset URL to a stable S3 URL if possible.
 * Returns undefined if the asset cannot be resolved or uploaded.
 * Returns the original URL for remote and path-based URLs.
 */
async function normalizeAssetUrl(
  url: string | undefined,
  userEmail: string | undefined,
  filenameHint: string
): Promise<string | undefined> {
  if (!url) return undefined;

  // Remote URL — stable cross-device
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }

  // Same-origin template/static paths — stable across devices on the same host
  if (url.startsWith("/")) {
    return url;
  }

  // Self-contained data URI — keep as-is
  if (url.startsWith("data:")) {
    return url;
  }

  // IndexedDB asset reference
  if (url.startsWith("local://")) {
    const assetKey = url.slice("local://".length);
    const blob = await retrieveAsset(assetKey, userEmail).catch(() => null);
    if (!blob) return undefined;
    const s3Url = await uploadBlobToS3(blob, `${filenameHint}.png`);
    return s3Url ?? undefined;
  }

  // In-memory object URL
  if (url.startsWith("blob:")) {
    try {
      const res = await fetch(url);
      if (!res.ok) return undefined;
      const blob = await res.blob();
      const s3Url = await uploadBlobToS3(blob, `${filenameHint}.png`);
      return s3Url ?? undefined;
    } catch {
      return undefined;
    }
  }

  // Unknown format — return as-is and hope for the best
  return url;
}

// ---------------------------------------------------------------------------
// Profile asset normalization
// ---------------------------------------------------------------------------

export type NormalizedAssets = {
  /** Resolved photoUrl (S3 URL if was local, original otherwise) */
  photoUrl?: string;
  /** Resolved backgroundUrl (S3 URL if was local, original otherwise) */
  backgroundUrl?: string;
};

/**
 * Returns stable S3 URLs for any local-only image refs in a Profile.
 * Always resolves — never throws. Returns the original URL as fallback
 * if normalization fails (e.g. S3 unavailable, asset not found).
 */
export async function normalizeProfileAssets(
  profile: { photoUrl?: string; backgroundUrl?: string },
  userEmail?: string
): Promise<NormalizedAssets> {
  const profileId = String(Date.now());

  const [photoUrl, backgroundUrl] = await Promise.allSettled([
    normalizeAssetUrl(profile.photoUrl, userEmail, `photo-${profileId}`),
    normalizeAssetUrl(profile.backgroundUrl, userEmail, `bg-${profileId}`),
  ]);

  return {
    photoUrl:
      photoUrl.status === "fulfilled"
        ? (photoUrl.value ?? profile.photoUrl)
        : profile.photoUrl,
    backgroundUrl:
      backgroundUrl.status === "fulfilled"
        ? (backgroundUrl.value ?? profile.backgroundUrl)
        : profile.backgroundUrl,
  };
}

// ---------------------------------------------------------------------------
// Canvas layer asset normalization
// ---------------------------------------------------------------------------

/**
 * Normalize local-only image refs in canvas layers (AvatarLayer.style.src).
 * - local:// refs → retrieve from IndexedDB → upload to S3
 * - blob: refs → fetch → upload to S3
 * - Other refs (https://, data:, /) → unchanged
 *
 * Returns a new layers array with stable S3 URLs replacing local refs.
 * Layers whose normalization fails are returned with their original ref intact.
 */
export async function normalizeLayerImageRefs(
  layers: CardLayer[],
  userEmail?: string
): Promise<CardLayer[]> {
  return Promise.all(
    layers.map(async (layer): Promise<CardLayer> => {
      if (layer.type !== "avatar") return layer;

      const av = layer as AvatarLayer;
      const src = av.style.src;

      if (!src || (!src.startsWith("local://") && !src.startsWith("blob:"))) {
        return layer;
      }

      const stableUrl = await normalizeAssetUrl(
        src,
        userEmail,
        `layer-img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      ).catch(() => null);

      if (!stableUrl || stableUrl === src) return layer;

      return {
        ...av,
        style: { ...av.style, src: stableUrl },
      } as CardLayer;
    })
  );
}
