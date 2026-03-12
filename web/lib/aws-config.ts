import { S3Client } from "@aws-sdk/client-s3";

export function getBucketConfig() {
  return {
    bucketName: process.env.AWS_BUCKET_NAME ?? "",
    folderPrefix: process.env.AWS_FOLDER_PREFIX ?? "",
    region: process.env.AWS_REGION ?? "us-east-1",
  };
}

/** Returns true when S3/R2 object storage is configured via env vars. */
export function isStorageConfigured(): boolean {
  return !!(process.env.AWS_BUCKET_NAME?.trim());
}

export function createS3Client(region?: string) {
  return new S3Client({
    region: region ?? process.env.AWS_REGION ?? "us-east-1",
  });
}

