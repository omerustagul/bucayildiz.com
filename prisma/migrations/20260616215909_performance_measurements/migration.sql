/*
  Warnings:

  - You are about to drop the `Performance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Performance" DROP CONSTRAINT "Performance_athleteId_fkey";

-- DropTable
DROP TABLE "Performance";

-- CreateTable
CREATE TABLE "PerformanceMeasurement" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "measuredAt" TEXT NOT NULL,
    "vo2" DOUBLE PRECISION,
    "percentile" INTEGER,
    "bodyFat" DOUBLE PRECISION,
    "muscle" DOUBLE PRECISION,
    "speed" INTEGER,
    "endurance" INTEGER,
    "power" INTEGER,
    "technique" INTEGER,
    "tactic" INTEGER,
    "passing" INTEGER,
    "sprint30" DOUBLE PRECISION,
    "verticalJump" INTEGER,
    "maxHr" INTEGER,
    "trainingLoad" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PerformanceMeasurement_athleteId_measuredAt_idx" ON "PerformanceMeasurement"("athleteId", "measuredAt");

-- AddForeignKey
ALTER TABLE "PerformanceMeasurement" ADD CONSTRAINT "PerformanceMeasurement_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
