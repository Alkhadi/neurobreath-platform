-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "technique" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "breaths" INTEGER NOT NULL DEFAULT 0,
    "rounds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalBreaths" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastSessionDate" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "badgeKey" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "badgeIcon" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "challengeKey" TEXT NOT NULL,
    "challengeName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetSessions" INTEGER NOT NULL,
    "currentSessions" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "lastCompletedDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQuest" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "questDate" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "technique" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoicePreference" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "voiceName" TEXT NOT NULL DEFAULT 'UK English Voice',
    "voiceSpeed" TEXT NOT NULL DEFAULT 'Steady',
    "useTTS" BOOLEAN NOT NULL DEFAULT true,
    "useVibration" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoicePreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingPassage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "levelBand" TEXT NOT NULL,
    "nbLevel" TEXT,
    "license" TEXT NOT NULL DEFAULT 'public-domain',
    "sourceAttribution" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readabilityHint" TEXT,
    "learnerGroups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingPassage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "levelBand" TEXT NOT NULL,
    "nbLevel" TEXT,
    "words" TEXT[],
    "wordCount" INTEGER NOT NULL,
    "license" TEXT NOT NULL DEFAULT 'public-domain',
    "category" TEXT,
    "learnerGroups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PseudowordList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "levelBand" TEXT NOT NULL,
    "nbLevel" TEXT,
    "items" TEXT[],
    "generatorParams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PseudowordList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprehensionQuestion" (
    "id" TEXT NOT NULL,
    "passageId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" JSONB NOT NULL,
    "correctChoiceIndex" INTEGER NOT NULL,
    "explanation" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'intermediate',
    "questionType" TEXT NOT NULL DEFAULT 'literal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComprehensionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingAttempt" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "assessmentType" TEXT NOT NULL,
    "learnerGroup" TEXT,
    "passageId" TEXT,
    "wordListId" TEXT,
    "pseudowordListId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "levelBandTarget" TEXT,
    "levelBandResult" TEXT,
    "confidence" TEXT,
    "placementLevel" TEXT,
    "placementConfidence" TEXT,
    "placementPlanJson" JSONB,
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "wordsCorrect" INTEGER NOT NULL DEFAULT 0,
    "errorsTotal" INTEGER NOT NULL DEFAULT 0,
    "accuracyPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wcpm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selfCorrections" INTEGER NOT NULL DEFAULT 0,
    "comprehensionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comprehensionCorrect" INTEGER NOT NULL DEFAULT 0,
    "comprehensionTotal" INTEGER NOT NULL DEFAULT 0,
    "readingProfile" JSONB,
    "readingLevelBand" TEXT,
    "readingLevelPercentile" INTEGER NOT NULL DEFAULT 0,
    "strengthsNeeds" JSONB,
    "notes" TEXT,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptErrorDetail" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "wordIndex" INTEGER NOT NULL,
    "wordText" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "corrected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttemptErrorDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptWordResponse" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "responseTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttemptWordResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptComprehensionResponse" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttemptComprehensionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonCatalog" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "nbLevel" TEXT NOT NULL,
    "learnerGroups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skillFocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lessonType" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 15,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "suggestedNext" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "orderInLevel" INTEGER NOT NULL DEFAULT 0,
    "contentPath" TEXT,
    "thumbnailUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFreeContent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerPlacement" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "learnerGroup" TEXT NOT NULL,
    "currentLevel" TEXT NOT NULL,
    "placementConfidence" TEXT NOT NULL DEFAULT 'medium',
    "assessmentId" TEXT,
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placementPlanJson" JSONB,
    "lessonsCompleted" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentLessonSlug" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearnerPlacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SENDReport" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "learnerName" TEXT,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessmentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sessionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dateRangeJson" JSONB NOT NULL,
    "patternSummary" TEXT NOT NULL,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "challenges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" TEXT NOT NULL DEFAULT 'medium',
    "generatedBy" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedContent" TEXT,
    "isPrintFriendly" BOOLEAN NOT NULL DEFAULT true,
    "disclaimerShown" BOOLEAN NOT NULL DEFAULT true,
    "disclaimer" TEXT NOT NULL DEFAULT 'This report provides training recommendations only and is NOT a diagnostic assessment. For formal educational or clinical assessment, please consult qualified professionals.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SENDReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentAccess" (
    "id" TEXT NOT NULL,
    "parentEmail" TEXT,
    "parentCode" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "learnerName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "ParentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_deviceId_completedAt_idx" ON "Session"("deviceId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_deviceId_key" ON "Progress"("deviceId");

-- CreateIndex
CREATE INDEX "Badge_deviceId_idx" ON "Badge"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_deviceId_badgeKey_key" ON "Badge"("deviceId", "badgeKey");

-- CreateIndex
CREATE INDEX "Challenge_deviceId_category_idx" ON "Challenge"("deviceId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_deviceId_challengeKey_key" ON "Challenge"("deviceId", "challengeKey");

-- CreateIndex
CREATE INDEX "DailyQuest_deviceId_questDate_idx" ON "DailyQuest"("deviceId", "questDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuest_deviceId_questDate_category_key" ON "DailyQuest"("deviceId", "questDate", "category");

-- CreateIndex
CREATE UNIQUE INDEX "VoicePreference_deviceId_key" ON "VoicePreference"("deviceId");

-- CreateIndex
CREATE INDEX "ReadingPassage_levelBand_createdAt_idx" ON "ReadingPassage"("levelBand", "createdAt");

-- CreateIndex
CREATE INDEX "ReadingPassage_nbLevel_idx" ON "ReadingPassage"("nbLevel");

-- CreateIndex
CREATE INDEX "WordList_levelBand_idx" ON "WordList"("levelBand");

-- CreateIndex
CREATE INDEX "WordList_levelBand_category_idx" ON "WordList"("levelBand", "category");

-- CreateIndex
CREATE INDEX "WordList_nbLevel_idx" ON "WordList"("nbLevel");

-- CreateIndex
CREATE INDEX "PseudowordList_levelBand_idx" ON "PseudowordList"("levelBand");

-- CreateIndex
CREATE INDEX "PseudowordList_nbLevel_idx" ON "PseudowordList"("nbLevel");

-- CreateIndex
CREATE INDEX "ComprehensionQuestion_passageId_idx" ON "ComprehensionQuestion"("passageId");

-- CreateIndex
CREATE INDEX "ComprehensionQuestion_passageId_questionType_idx" ON "ComprehensionQuestion"("passageId", "questionType");

-- CreateIndex
CREATE INDEX "ReadingAttempt_deviceId_createdAt_idx" ON "ReadingAttempt"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "ReadingAttempt_deviceId_assessmentType_idx" ON "ReadingAttempt"("deviceId", "assessmentType");

-- CreateIndex
CREATE INDEX "ReadingAttempt_passageId_idx" ON "ReadingAttempt"("passageId");

-- CreateIndex
CREATE INDEX "AttemptErrorDetail_attemptId_idx" ON "AttemptErrorDetail"("attemptId");

-- CreateIndex
CREATE INDEX "AttemptWordResponse_attemptId_idx" ON "AttemptWordResponse"("attemptId");

-- CreateIndex
CREATE INDEX "AttemptComprehensionResponse_attemptId_idx" ON "AttemptComprehensionResponse"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptComprehensionResponse_attemptId_questionId_key" ON "AttemptComprehensionResponse"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonCatalog_slug_key" ON "LessonCatalog"("slug");

-- CreateIndex
CREATE INDEX "LessonCatalog_nbLevel_idx" ON "LessonCatalog"("nbLevel");

-- CreateIndex
CREATE INDEX "LessonCatalog_isActive_nbLevel_idx" ON "LessonCatalog"("isActive", "nbLevel");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerPlacement_deviceId_key" ON "LearnerPlacement"("deviceId");

-- CreateIndex
CREATE INDEX "LearnerPlacement_deviceId_idx" ON "LearnerPlacement"("deviceId");

-- CreateIndex
CREATE INDEX "LearnerPlacement_currentLevel_idx" ON "LearnerPlacement"("currentLevel");

-- CreateIndex
CREATE INDEX "SENDReport_deviceId_reportDate_idx" ON "SENDReport"("deviceId", "reportDate");

-- CreateIndex
CREATE INDEX "SENDReport_deviceId_createdAt_idx" ON "SENDReport"("deviceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ParentAccess_parentCode_key" ON "ParentAccess"("parentCode");

-- CreateIndex
CREATE INDEX "ParentAccess_parentCode_idx" ON "ParentAccess"("parentCode");

-- CreateIndex
CREATE INDEX "ParentAccess_deviceId_idx" ON "ParentAccess"("deviceId");

-- CreateIndex
CREATE INDEX "ParentAccess_isActive_idx" ON "ParentAccess"("isActive");

-- AddForeignKey
ALTER TABLE "ComprehensionQuestion" ADD CONSTRAINT "ComprehensionQuestion_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "ReadingPassage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingAttempt" ADD CONSTRAINT "ReadingAttempt_passageId_fkey" FOREIGN KEY ("passageId") REFERENCES "ReadingPassage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingAttempt" ADD CONSTRAINT "ReadingAttempt_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "WordList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingAttempt" ADD CONSTRAINT "ReadingAttempt_pseudowordListId_fkey" FOREIGN KEY ("pseudowordListId") REFERENCES "PseudowordList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptErrorDetail" ADD CONSTRAINT "AttemptErrorDetail_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ReadingAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptWordResponse" ADD CONSTRAINT "AttemptWordResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ReadingAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptComprehensionResponse" ADD CONSTRAINT "AttemptComprehensionResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ReadingAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptComprehensionResponse" ADD CONSTRAINT "AttemptComprehensionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ComprehensionQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
