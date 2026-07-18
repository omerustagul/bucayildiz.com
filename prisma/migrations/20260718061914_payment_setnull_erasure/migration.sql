-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_athleteId_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "payerName" TEXT,
ALTER COLUMN "athleteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;
