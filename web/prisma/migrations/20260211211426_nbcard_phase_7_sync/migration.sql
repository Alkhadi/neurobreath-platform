-- CreateTable
CREATE TABLE "NBCardProfile" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT,
    "deviceId" TEXT,
    "profileId" TEXT NOT NULL,
    "profileData" JSONB NOT NULL,
    "templateData" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NBCardProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NBCardContact" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT,
    "deviceId" TEXT,
    "contactId" TEXT NOT NULL,
    "contactData" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NBCardContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NBCardProfile_userEmail_updatedAt_idx" ON "NBCardProfile"("userEmail", "updatedAt");

-- CreateIndex
CREATE INDEX "NBCardProfile_deviceId_updatedAt_idx" ON "NBCardProfile"("deviceId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NBCardProfile_userEmail_profileId_key" ON "NBCardProfile"("userEmail", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "NBCardProfile_deviceId_profileId_key" ON "NBCardProfile"("deviceId", "profileId");

-- CreateIndex
CREATE INDEX "NBCardContact_userEmail_updatedAt_idx" ON "NBCardContact"("userEmail", "updatedAt");

-- CreateIndex
CREATE INDEX "NBCardContact_deviceId_updatedAt_idx" ON "NBCardContact"("deviceId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NBCardContact_userEmail_contactId_key" ON "NBCardContact"("userEmail", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "NBCardContact_deviceId_contactId_key" ON "NBCardContact"("deviceId", "contactId");
