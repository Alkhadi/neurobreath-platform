-- Migration: NbCardShare preview image storage + lifecycle state fields
--
-- Covers two phases of the preview system:
--   1. DB-backed preview image storage (fallback when S3/R2 is not configured)
--   2. Preview lifecycle state tracking (pending → ready | failed)
--
-- Uses IF NOT EXISTS on all columns because some environments may have had
-- the first six storage fields applied earlier via `prisma db push`.
-- `migrate deploy` applies this migration exactly once; IF NOT EXISTS is
-- harmless for a clean database and safe for databases already migrated
-- partially via db:push.

-- ── Preview image storage ────────────────────────────────────────────────────
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewPngBytes"    BYTEA;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewPngMimeType" TEXT;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewPngWidth"    INTEGER;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewPngHeight"   INTEGER;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewGeneratedAt" TIMESTAMP(3);
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewSha256"      TEXT;

-- ── Preview lifecycle state ───────────────────────────────────────────────────
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewStatus"       TEXT;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewError"        TEXT;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewAttemptCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NbCardShare" ADD COLUMN IF NOT EXISTS "previewLastTriedAt"  TIMESTAMP(3);
