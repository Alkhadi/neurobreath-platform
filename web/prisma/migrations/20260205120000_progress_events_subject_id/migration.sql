-- Add subjectId for future parent/teacher subject views
-- For now, API enforces subjectId to be self (user id) for signed-in users, or NULL for guests.

ALTER TABLE "ProgressEvent" ADD COLUMN "subjectId" TEXT;

CREATE INDEX "ProgressEvent_subjectId_occurredAt_idx" ON "ProgressEvent"("subjectId", "occurredAt");
