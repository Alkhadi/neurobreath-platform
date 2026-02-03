-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "progressConsentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UniversalProgressEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "activityType" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "durationSeconds" INTEGER,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniversalProgressEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UniversalProgressEvent" ADD CONSTRAINT "UniversalProgressEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "UniversalProgressEvent_userId_activityType_activityId_key"
  ON "UniversalProgressEvent"("userId", "activityType", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversalProgressEvent_deviceId_activityType_activityId_key"
  ON "UniversalProgressEvent"("deviceId", "activityType", "activityId");

-- CreateIndex
CREATE INDEX "UniversalProgressEvent_userId_activityType_idx"
  ON "UniversalProgressEvent"("userId", "activityType");

-- CreateIndex
CREATE INDEX "UniversalProgressEvent_deviceId_activityType_idx"
  ON "UniversalProgressEvent"("deviceId", "activityType");
