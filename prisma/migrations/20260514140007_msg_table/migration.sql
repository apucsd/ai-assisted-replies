-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "originalMsg" TEXT NOT NULL,
    "safeMsg" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "keyFlags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
