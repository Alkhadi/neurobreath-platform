-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "consentState" JSONB,
ADD COLUMN     "consentUpdatedAt" TIMESTAMP(3);
