-- CreateTable
CREATE TABLE "NbCardFrame" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NbCardFrame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NbCardFrame_category_isActive_sortOrder_idx" ON "NbCardFrame"("category", "isActive", "sortOrder");
