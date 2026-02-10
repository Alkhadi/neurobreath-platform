import { NextRequest, NextResponse } from "next/server";
import { UploadConfigError, generatePresignedUploadUrl } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, isPublic = true } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
      fileName,
      contentType,
      isPublic
    );

    return NextResponse.json({ uploadUrl, cloud_storage_path });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    if (error instanceof UploadConfigError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

