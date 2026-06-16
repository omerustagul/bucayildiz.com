-- CreateTable
CREATE TABLE "ConsentDocument" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isConsent" BOOLEAN NOT NULL DEFAULT true,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "ordering" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "documentKey" TEXT NOT NULL,
    "documentVersion" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "textHash" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "granterName" TEXT NOT NULL,
    "granterRelation" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'basvuru',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" TIMESTAMP(3),
    "applicationId" TEXT,
    "athleteId" TEXT,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsentDocument_active_idx" ON "ConsentDocument"("active");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentDocument_key_version_key" ON "ConsentDocument"("key", "version");

-- CreateIndex
CREATE INDEX "ConsentRecord_applicationId_idx" ON "ConsentRecord"("applicationId");

-- CreateIndex
CREATE INDEX "ConsentRecord_athleteId_idx" ON "ConsentRecord"("athleteId");

-- CreateIndex
CREATE INDEX "ConsentRecord_documentKey_idx" ON "ConsentRecord"("documentKey");

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_documentKey_documentVersion_fkey" FOREIGN KEY ("documentKey", "documentVersion") REFERENCES "ConsentDocument"("key", "version") ON DELETE RESTRICT ON UPDATE CASCADE;
