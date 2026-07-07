-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "mobileNavAdmin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mobileNavPanel" BOOLEAN NOT NULL DEFAULT true;
