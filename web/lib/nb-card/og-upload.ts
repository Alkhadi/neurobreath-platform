/**
 * OG Image Upload Utility (client-side)
 *
 * Computes a stable SHA-256 hash of the visually significant card fields and
 * uploads a PNG blob to /api/nb-card/og-image.  The API route deduplicates
 * uploads: if the hash matches what is stored in the DB the stored URL is
 * returned without re-uploading.
 *
 * Usage (fire-and-forget):
 *   void uploadCardOgImage(pngBlob, redactedProfile, deviceId).catch(() => undefined);
 */

import type { Profile } from "@/lib/utils";

/** Fields that determine the visual appearance of a card. */
function visualHashPayload(profile: Profile): string {
  return JSON.stringify({
    fullName: profile.fullName ?? "",
    jobTitle: profile.jobTitle ?? "",
    photoUrl: profile.photoUrl ?? "",
    backgroundUrl: profile.backgroundUrl ?? "",
    frameUrl: profile.frameUrl ?? "",
    gradient: profile.gradient ?? "",
    accentColor: profile.accentColor ?? "",
    cardCategory: profile.cardCategory ?? "",
    layers: profile.layers ?? [],
    fontKey: profile.typography?.fontKey ?? "",
  });
}

/** Returns hex-encoded SHA-256 of the card's visual fields. */
export async function computeCardHash(profile: Profile): Promise<string> {
  const payload = visualHashPayload(profile);
  const encoded = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Uploads a captured card PNG as the OG preview image for the given profile.
 *
 * @returns The public S3 URL of the stored image, or null if the upload failed
 *          or was skipped because the hash matched an existing entry.
 */
export async function uploadCardOgImage(
  pngBlob: Blob,
  profile: Profile,
  deviceId: string
): Promise<string | null> {
  try {
    if (!profile.id) return null;

    const cardHash = await computeCardHash(profile);

    const form = new FormData();
    form.append("profileId", profile.id);
    form.append("cardHash", cardHash);
    form.append("deviceId", deviceId);
    form.append("image", pngBlob, "og-image.png");

    const res = await fetch("/api/nb-card/og-image", { method: "POST", body: form });
    if (!res.ok) return null;

    const json = (await res.json()) as { ogImageUrl?: string };
    return json.ogImageUrl ?? null;
  } catch {
    return null;
  }
}
