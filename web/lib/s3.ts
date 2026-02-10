import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client, getBucketConfig } from "./aws-config";

export class UploadConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadConfigError";
  }
}

function getUploadConfigOrThrow() {
  const { bucketName, folderPrefix, region } = getBucketConfig();
  if (!bucketName) {
    throw new UploadConfigError("Missing AWS_BUCKET_NAME; uploads are disabled.");
  }
  return { bucketName, folderPrefix, region };
}

export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  isPublic: boolean = true
) {
  const { bucketName, folderPrefix, region } = getUploadConfigOrThrow();
  const s3Client = createS3Client(region);

  const cloud_storage_path = isPublic
    ? `${folderPrefix}public/uploads/${Date.now()}-${fileName}`
    : `${folderPrefix}uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
    ContentType: contentType,
    ContentDisposition: isPublic ? "attachment" : undefined,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { uploadUrl, cloud_storage_path };
}

export async function getFileUrl(cloud_storage_path: string, isPublic: boolean = true) {
  const { bucketName, region } = getUploadConfigOrThrow();

  if (isPublic) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
  } else {
    const s3Client = createS3Client(region);
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: cloud_storage_path,
      ResponseContentDisposition: "attachment",
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }
}

export async function deleteFile(cloud_storage_path: string) {
  const { bucketName, region } = getUploadConfigOrThrow();
  const s3Client = createS3Client(region);
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
  });
  await s3Client.send(command);
}

