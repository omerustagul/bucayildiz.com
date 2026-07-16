-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "applicationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_applicationId_key" ON "Athlete"("applicationId");

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

