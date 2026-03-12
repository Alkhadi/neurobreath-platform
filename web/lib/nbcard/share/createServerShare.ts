/**
 * createServerShare.ts
 *
 * Client-side utilities that call POST /api/nb-card/share and return
 * a canonical share URL for use in QR codes, copy-link flows, etc.
 *
 * Two entry points:
 *   createServerShare()             — low-level, takes a pre-built CardModel
 *   createServerShareFromProfile()  — full pipeline: Profile → normalize assets
 *                                     → CardModel → upload PNG → API
 *
 * Handles degraded mode (DB unavailable) gracefully — callers receive a
 * typed result so they can fall back to a local URL without crashing.
 */

import type { CardModel } from "@/lib/nbcard/cardModel";
import type { Profile } from "@/lib/utils";
import type { TemplateSelection } from "@/lib/nbcard-templates";

// ---------------------------------------------------------------------------
// Browser-safe base64 helper (no Node.js Buffer dependency)
// ---------------------------------------------------------------------------

/**
 * Encode a Blob as a base64 string for inclusion in the share API request
 * when object storage is unavailable (DB fallback path).
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const CHUNK = 8192;
  for (let i = 0; i < bytes.byteLength; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ServerShareResult =
  | {
      ok: true;
      token: string;
      /** Canonical public URL, e.g. https://example.com/nb-card/s/<token> */
      shareUrl: string;
    }
  | {
      ok: false;
      /** True when the DB/share service is temporarily unavailable */
      degraded: boolean;
      error: string;
    };

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Create a server-backed share record for the given CardModel.
 *
 * On success returns the canonical share URL.
 * On failure (network, degraded, validation) returns ok: false with context.
 *
 * @param cardModel         — Fully resolved CardModel.
 * @param deviceId          — Anonymous device ID (optional).
 * @param pngUrl            — Pre-uploaded S3/R2 PNG URL (optional).
 * @param previewPngBase64  — Raw PNG as base64 for DB storage when S3 is
 *                            unavailable (optional).
 */
export async function createServerShare(options: {
  cardModel: CardModel;
  deviceId?: string;
  pngUrl?: string;
  previewPngBase64?: string;
}): Promise<ServerShareResult> {
  const { cardModel, deviceId, pngUrl, previewPngBase64 } = options;

  try {
    const res = await fetch("/api/nb-card/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardModel: cardModel as Record<string, unknown>,
        deviceId: deviceId ?? undefined,
        pngUrl: pngUrl ?? undefined,
        previewPngBase64: previewPngBase64 ?? undefined,
      }),
    });

    // DB degraded — the API returns 503 with degraded: true
    if (res.status === 503) {
      const data = (await res.json().catch(() => ({}))) as {
        degraded?: boolean;
        error?: string;
      };
      return {
        ok: false,
        degraded: data.degraded ?? true,
        error: data.error ?? "Share service temporarily unavailable.",
      };
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      return {
        ok: false,
        degraded: false,
        error: data.error ?? `Share failed (${res.status})`,
      };
    }

    const data = (await res.json()) as {
      token: string;
      shareUrl: string;
    };

    if (!data.token || !data.shareUrl) {
      return {
        ok: false,
        degraded: false,
        error: "Invalid response from share service.",
      };
    }

    return { ok: true, token: data.token, shareUrl: data.shareUrl };
  } catch (err) {
    return {
      ok: false,
      degraded: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

// ---------------------------------------------------------------------------
// Full pipeline: Profile → normalize assets → CardModel → share
// ---------------------------------------------------------------------------

/**
 * Create a server share from the editor's Profile type.
 *
 * Pipeline:
 *   1. Normalize local:// and blob: asset refs to stable S3 URLs
 *   2. Build CardModel via profileToCardModel
 *   3. Optionally upload a pre-rendered PNG blob as the share's preview image
 *   4. POST /api/nb-card/share and return the canonical token URL
 *
 * Always resolves — never throws. Returns ok: false with context on any failure.
 */
export async function createServerShareFromProfile(options: {
  profile: Profile;
  templateSelection?: TemplateSelection;
  deviceId?: string;
  /** Pre-rendered PNG blob of the card — uploaded and stored as pngUrl in NbCardShare */
  pngBlob?: Blob;
  /** Signed-in user email for IndexedDB namespace resolution */
  userEmail?: string;
}): Promise<ServerShareResult> {
  const { profile, templateSelection, deviceId, pngBlob, userEmail } = options;

  try {
    // Lazy imports keep the chunk out of the initial bundle
    const [
      { profileToCardModel },
      { normalizeProfileAssets, normalizeLayerImageRefs, uploadBlobToS3 },
    ] = await Promise.all([
      import("./profileToCardModel"),
      import("./normalizeAssets"),
    ]);

    // 1. Normalize local-only asset refs in parallel (best-effort)
    //    - Profile photo + background → S3
    //    - AvatarLayer images → S3
    const [normalized, normalizedLayers] = await Promise.all([
      normalizeProfileAssets(
        { photoUrl: profile.photoUrl, backgroundUrl: profile.backgroundUrl },
        userEmail
      ).catch(() => ({
        photoUrl: profile.photoUrl,
        backgroundUrl: profile.backgroundUrl,
      })),
      normalizeLayerImageRefs(profile.layers ?? [], userEmail).catch(
        () => profile.layers ?? []
      ),
    ]);

    // 2. Build a resolved profile with stable S3 refs
    const resolvedProfile: Profile = {
      ...profile,
      ...(normalized.photoUrl ? { photoUrl: normalized.photoUrl } : {}),
      ...(normalized.backgroundUrl
        ? { backgroundUrl: normalized.backgroundUrl }
        : {}),
      // Use the normalized layers (AvatarLayer srcs are now S3 URLs or cleared)
      layers: normalizedLayers,
    };

    // 3. Build full CardModel — includes all canvas layers in canvas.elements
    const cardModel = profileToCardModel(resolvedProfile, templateSelection);

    // 4. Apply stable asset refs to cardModel style/profile
    if (normalized.backgroundUrl?.startsWith("https://")) {
      cardModel.style.backgroundImageRef = normalized.backgroundUrl;
    }
    if (normalized.photoUrl?.startsWith("https://")) {
      cardModel.profile.photoRef = normalized.photoUrl;
    }

    // 4b. Resolve template background URL from manifest when no backgroundImageRef is set.
    //     This replaces the heuristic path guess in the viewer with a real, authoritative URL.
    if (cardModel.style.backgroundPresetId && !cardModel.style.backgroundImageRef) {
      try {
        const { loadTemplateManifest } = await import("@/lib/nbcard-templates");
        const manifest = await loadTemplateManifest();
        const template = manifest.templates.find(
          (t) => t.id === cardModel.style.backgroundPresetId
        );
        if (template?.src) {
          // Same-origin template asset — stable across all devices on this host
          cardModel.style.backgroundImageRef = template.src;
        }
      } catch {
        // Best-effort: if manifest fails, viewer falls back to backgroundPresetId heuristic
      }
    }

    // 5. Generate preview PNG + persist to the best available storage backend.
    //    Priority: object storage (S3/R2) → DB bytes → no preview (share still works).
    let pngUrl: string | undefined;
    let previewPngBase64: string | undefined;

    try {
      const { captureSharePreviewBlob } = await import("./renderSharePreviewPng");

      // Use caller-provided blob (from visible editor capture) when available,
      // otherwise render the snapshot offscreen — works even when the editor
      // is collapsed or the visible card DOM is not mounted.
      const previewBlob =
        pngBlob ?? (await captureSharePreviewBlob(cardModel));

      if (previewBlob) {
        // Try object storage first (best performance for viewers)
        const s3Url = await uploadBlobToS3(
          previewBlob,
          `nb-card-share-${Date.now()}.png`
        ).catch(() => null);

        if (s3Url) {
          pngUrl = s3Url;
        } else {
          // Object storage unavailable — encode blob for DB persistence so
          // shares always have a preview regardless of storage config.
          previewPngBase64 = await blobToBase64(previewBlob).catch(
            () => undefined
          );
        }
      }
    } catch {
      // Best-effort: share creation continues without preview image
    }

    // 6. Create the NbCardShare record
    return createServerShare({ cardModel, deviceId, pngUrl, previewPngBase64 });
  } catch (err) {
    return {
      ok: false,
      degraded: false,
      error: err instanceof Error ? err.message : "Share creation failed",
    };
  }
}
