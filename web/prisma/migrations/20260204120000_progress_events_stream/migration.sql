-- Add append-only progress event stream + device/user linkage
-- This migration is intentionally small and reversible.

-- Needed for gen_random_uuid() default used by ProgressEvent.id
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "ProgressEvent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT NOT NULL,
    "path" TEXT,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "ProgressEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserDevice" (
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDevice_pkey" PRIMARY KEY ("deviceId")
);

CREATE INDEX "ProgressEvent_userId_occurredAt_idx" ON "ProgressEvent"("userId", "occurredAt");
CREATE INDEX "ProgressEvent_deviceId_occurredAt_idx" ON "ProgressEvent"("deviceId", "occurredAt");
CREATE INDEX "ProgressEvent_type_occurredAt_idx" ON "ProgressEvent"("type", "occurredAt");
CREATE INDEX "UserDevice_userId_lastSeenAt_idx" ON "UserDevice"("userId", "lastSeenAt");

ALTER TABLE "ProgressEvent"
ADD CONSTRAINT "ProgressEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserDevice"
ADD CONSTRAINT "UserDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
