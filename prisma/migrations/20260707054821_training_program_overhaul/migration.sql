-- AlterTable
ALTER TABLE "Training" DROP COLUMN "type",
ADD COLUMN     "scope" TEXT NOT NULL DEFAULT 'team',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'planned';

-- CreateTable
CREATE TABLE "TrainingDrill" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingDrill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingAttendance" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingDrill_trainingId_idx" ON "TrainingDrill"("trainingId");

-- CreateIndex
CREATE INDEX "TrainingAttendance_athleteId_idx" ON "TrainingAttendance"("athleteId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingAttendance_trainingId_athleteId_key" ON "TrainingAttendance"("trainingId", "athleteId");

-- CreateIndex
CREATE INDEX "Training_status_idx" ON "Training"("status");

-- AddForeignKey
ALTER TABLE "TrainingDrill" ADD CONSTRAINT "TrainingDrill_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAttendance" ADD CONSTRAINT "TrainingAttendance_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAttendance" ADD CONSTRAINT "TrainingAttendance_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
