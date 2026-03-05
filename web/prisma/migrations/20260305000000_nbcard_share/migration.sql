-- CreateTable: NbCardShare
-- Stores tokenised share snapshots for the Universal QR / share link feature.

CREATE TABLE "NbCardShare" (
    "token"         TEXT NOT NULL,
    "cardModelJson" JSONB NOT NULL,
    "pngUrl"        TEXT,
    "pdfUrl"        TEXT,
    "ownerEmail"    TEXT,
    "ownerDeviceId" TEXT,
    "isPublic"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt"     TIMESTAMP(3),

    CONSTRAINT "NbCardShare_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE INDEX "NbCardShare_ownerEmail_idx" ON "NbCardShare"("ownerEmail");

-- CreateIndex
CREATE INDEX "NbCardShare_ownerDeviceId_idx" ON "NbCardShare"("ownerDeviceId");

-- CreateIndex
CREATE INDEX "NbCardShare_createdAt_idx" ON "NbCardShare"("createdAt");
