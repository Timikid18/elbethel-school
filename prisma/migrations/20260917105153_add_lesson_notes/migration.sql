-- CreateTable
CREATE TABLE "LessonNote" (
    "id" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'application/pdf',
    "fileSize" INTEGER,
    "fileData" BYTEA NOT NULL,
    "uploadedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonNote_className_isActive_idx" ON "LessonNote"("className", "isActive");

-- CreateIndex
CREATE INDEX "LessonNote_division_isActive_idx" ON "LessonNote"("division", "isActive");

-- AddForeignKey
ALTER TABLE "LessonNote" ADD CONSTRAINT "LessonNote_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
