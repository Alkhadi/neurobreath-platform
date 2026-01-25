import { S3Client } from "@aws-sdk/client-s3";

export function getBucketConfig() {
  return {
    bucketName: process.env.AWS_BUCKET_NAME ?? "",
    folderPrefix: process.env.AWS_FOLDER_PREFIX ?? "",
    region: process.env.AWS_REGION ?? "us-east-1",
  };
}

export function createS3Client(region?: string) {
  return new S3Client({
    region: region ?? process.env.AWS_REGION ?? "us-east-1",
  });
}

