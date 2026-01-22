-- CreateTable
CREATE TABLE "AuthUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "primaryDeviceId" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecretEnc" TEXT,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthPasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthPasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- CreateIndex
CREATE INDEX "AuthUser_primaryDeviceId_idx" ON "AuthUser"("primaryDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthPasswordResetToken_tokenHash_key" ON "AuthPasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthPasswordResetToken_userId_idx" ON "AuthPasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "AuthPasswordResetToken_expiresAt_idx" ON "AuthPasswordResetToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "AuthPasswordResetToken" ADD CONSTRAINT "AuthPasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
