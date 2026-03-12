import { createHash } from "crypto";
import { isStorageConfigured } from "@/lib/aws-config";
import { uploadBufferToS3Direct } from "@/lib/s3";
import { createNbCardPreviewImage } from "./previewImage";

export type StoredPreviewFields = {
  pngUrl: string | null;
  previewPngBytes: Buffer | null;
  previewPngMimeType: string | null;
  previewPngWidth: number | null;
  previewPngHeight: number | null;
  previewGeneratedAt: Date;
  previewSha256: string;
  previewStatus: "ready";
  previewError: null;
  previewLastTriedAt: Date;
};

export function getPngDimensions(
  buf: Buffer
): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (buf[0] !== 137 || buf[1] !== 80 || buf[2] !== 78) return null;
  try {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

export async function renderNbCardPreviewToBuffer(
  cardModel: Record<string, unknown>
): Promise<Buffer> {
  const response = createNbCardPreviewImage(cardModel);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function preparePreviewPersistenceFromBytes(options: {
  token: string;
  bytes: Buffer;
  mimeType?: string;
  generatedAt?: Date;
}): Promise<StoredPreviewFields> {
  const { token, bytes, mimeType = "image/png" } = options;
  const generatedAt = options.generatedAt ?? new Date();
  const dims = getPngDimensions(bytes);
  const sha256 = createHash("sha256").update(bytes).digest("hex");

  if (isStorageConfigured()) {
    try {
      const s3Url = await uploadBufferToS3Direct(
        bytes,
        `nb-card-preview-${token}.png`,
        mimeType
      );

      if (s3Url) {
        return {
          pngUrl: s3Url,
          previewPngBytes: null,
          previewPngMimeType: null,
          previewPngWidth: dims?.width ?? null,
          previewPngHeight: dims?.height ?? null,
          previewGeneratedAt: generatedAt,
          previewSha256: sha256,
          previewStatus: "ready",
          previewError: null,
          previewLastTriedAt: generatedAt,
        };
      }
    } catch (err) {
      console.error("[nb-card/preview] S3 upload failed, using DB bytes:", err);
    }
  }

  return {
    pngUrl: null,
    previewPngBytes: bytes,
    previewPngMimeType: mimeType,
    previewPngWidth: dims?.width ?? null,
    previewPngHeight: dims?.height ?? null,
    previewGeneratedAt: generatedAt,
    previewSha256: sha256,
    previewStatus: "ready",
    previewError: null,
    previewLastTriedAt: generatedAt,
  };
}