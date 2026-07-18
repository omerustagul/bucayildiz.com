-- CreateTable
CREATE TABLE "ReminderLog" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "daysBefore" INTEGER NOT NULL,
    "recipients" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReminderLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReminderLog_sentAt_idx" ON "ReminderLog"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderLog_kind_targetId_daysBefore_key" ON "ReminderLog"("kind", "targetId", "daysBefore");
