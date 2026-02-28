/**
 * NB-Card OG Image Upload API
 *
 * POST /api/nb-card/og-image
 *
 * Accepts a multipart/form-data body with:
 *   - profileId  (string)
 *   - cardHash   (string) — SHA-256 of visual fields, computed client-side
 *   - deviceId   (string)
 *   - image      (File / Blob, image/png, max 5 MB)
 *
 * Behaviour:
 * 1. Validates ownership via NextAuth session email OR deviceId.
 * 2. If the stored ogImageHash equals the submitted cardHash, returns the
 *    cached ogImageUrl without re-uploading (deduplication).
 * 3. Otherwise uploads the PNG to S3 and updates the DB row.
 *
 * Returns: { ogImageUrl: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { prisma, isDbDown, getDbDownReason } from "@/lib/db";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createS3Client, getBucketConfig } from "@/lib/aws-config";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Minimal Prisma delegate types (avoids stale-type TS squiggles)
type OgRow = { ogImageUrl: string | null; ogImageHash: string | null };
type NBCardOgDelegate = {
  nBCardProfile: {
    findFirst(args: {
      where: Record<string, string>;
      select: { ogImageUrl: true; ogImageHash: true };
    }): Promise<OgRow | null>;
    updateMany(args: {
      where: Record<string, string>;
      data: { ogImageUrl: string; ogImageHash: string; ogImageAt: Date };
    }): Promise<{ count: number }>;
  };
};

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json(
      { error: "Database unavailable", dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const profileId = String(form.get("profileId") ?? "").trim();
  const cardHash = String(form.get("cardHash") ?? "").trim();
  const deviceId = String(form.get("deviceId") ?? "").trim();
  const imageEntry = form.get("image");

  if (!profileId || !cardHash || !deviceId || !(imageEntry instanceof Blob)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (imageEntry.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds 5 MB limit" }, { status: 413 });
  }

  // Determine ownership
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email?.toLowerCase() ?? null;

  const ownerWhere: Record<string, string> = userEmail
    ? { userEmail, profileId }
    : { deviceId, profileId };

  const nbPrisma = prisma as unknown as NBCardOgDelegate;

  // Check for hash hit (no re-upload needed)
  try {
    const existing = await nbPrisma.nBCardProfile.findFirst({
      where: ownerWhere,
      select: { ogImageUrl: true, ogImageHash: true },
    });

    if (existing?.ogImageHash === cardHash && existing.ogImageUrl) {
      return NextResponse.json({ ogImageUrl: existing.ogImageUrl });
    }
  } catch {
    // Non-fatal: proceed to upload
  }

  // Upload PNG to S3
  const { bucketName, folderPrefix, region } = getBucketConfig();
  if (!bucketName) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const s3Key = `${folderPrefix}public/og-images/nbcard-${profileId}.png`;
  const imageBytes = new Uint8Array(await imageEntry.arrayBuffer());

  try {
    const s3Client = createS3Client(region);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: imageBytes,
        ContentType: "image/png",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
  } catch (err) {
    console.error("[OG Image] S3 upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }

  const ogImageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;

  // Persist URL + hash in DB
  try {
    await nbPrisma.nBCardProfile.updateMany({
      where: ownerWhere,
      data: { ogImageUrl, ogImageHash: cardHash, ogImageAt: new Date() },
    });
  } catch (err) {
    // Uploaded but DB write failed — still return the URL so the client can use it
    console.error("[OG Image] DB update failed:", err);
  }

  return NextResponse.json({ ogImageUrl });
}
