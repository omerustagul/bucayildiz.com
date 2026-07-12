-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "isPitch" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "heroMobileImageUrl" TEXT,
ADD COLUMN     "homeGalleryFeaturedUrl" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "url" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "employment" TEXT NOT NULL DEFAULT 'full-time',
    "description" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "postingId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL DEFAULT '',
    "cvUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "consentTextHash" TEXT NOT NULL,
    "consentVersion" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_athleteId_createdAt_idx" ON "Notification"("athleteId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_athleteId_readAt_idx" ON "Notification"("athleteId", "readAt");

-- CreateIndex
CREATE INDEX "JobPosting_active_idx" ON "JobPosting"("active");

-- CreateIndex
CREATE INDEX "JobApplication_postingId_idx" ON "JobApplication"("postingId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- CreateIndex
CREATE INDEX "Facility_isPitch_idx" ON "Facility"("isPitch");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_postingId_fkey" FOREIGN KEY ("postingId") REFERENCES "JobPosting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
