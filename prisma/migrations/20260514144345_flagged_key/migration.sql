-- CreateTable
CREATE TABLE "flagged_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "replaceWord" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flagged_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flagged_keywords_keyword_key" ON "flagged_keywords"("keyword");
