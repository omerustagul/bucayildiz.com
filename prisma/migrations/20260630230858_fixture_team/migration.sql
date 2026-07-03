-- AlterTable
ALTER TABLE "Fixture" ADD COLUMN     "teamId" TEXT;

-- CreateIndex
CREATE INDEX "Fixture_teamId_idx" ON "Fixture"("teamId");

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
