-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "homeGalleryCategoryId" TEXT;

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'antrenor',
    "licence" TEXT,
    "photoUrl" TEXT,
    "bio" TEXT NOT NULL DEFAULT '',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "capacity" TEXT,
    "features" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandingRow" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "isOurs" BOOLEAN NOT NULL DEFAULT false,
    "played" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StandingRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffMember_group_idx" ON "StaffMember"("group");

-- CreateIndex
CREATE INDEX "Folder_categoryId_idx" ON "Folder"("categoryId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MediaCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
