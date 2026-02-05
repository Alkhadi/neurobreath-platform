-- CreateTable
CREATE TABLE "SubjectProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kind" TEXT NOT NULL DEFAULT 'learner',
    "displayName" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "SubjectProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectAccess" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "canWrite" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubjectProfile_createdByUserId_createdAt_idx" ON "SubjectProfile"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "SubjectProfile_archivedAt_idx" ON "SubjectProfile"("archivedAt");

-- CreateIndex
CREATE INDEX "SubjectAccess_userId_subjectId_idx" ON "SubjectAccess"("userId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectAccess_subjectId_userId_key" ON "SubjectAccess"("subjectId", "userId");

-- AddForeignKey
ALTER TABLE "SubjectAccess" ADD CONSTRAINT "SubjectAccess_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "SubjectProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectAccess" ADD CONSTRAINT "SubjectAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
