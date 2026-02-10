import { NextRequest, NextResponse } from "next/server";
import { getAuthedUserId } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/db";
import { generatePresignedUploadUrl } from "@/lib/s3";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

async function getAdminEmail(req: NextRequest): Promise<string | null> {
  const auth = await getAuthedUserId(req);
  if (!auth.ok) return null;
  
  const user = await prisma.authUser.findUnique({
    where: { id: auth.userId },
    select: { email: true },
  });
  
  return user?.email || null;
}

export async function POST(req: NextRequest) {
  try {
    const email = await getAdminEmail(req);
    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPEG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (3MB max)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 3MB." },
        { status: 400 }
      );
    }

    // Generate presigned URL for upload
    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
      file.name,
      file.type,
      true // isPublic
    );

    // Upload file to S3
    const arrayBuffer = await file.arrayBuffer();
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: arrayBuffer,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to storage");
    }

    // Get public URL
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${cloud_storage_path}`;

    return NextResponse.json({ imageUrl: publicUrl });
  } catch (error) {
    console.error("Failed to upload frame image:", error);
    return NextResponse.json(
      { error: "Failed to upload frame image" },
      { status: 500 }
    );
  }
}
