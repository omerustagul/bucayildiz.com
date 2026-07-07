-- CreateTable
CREATE TABLE "AthleteAssignment" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'message',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "fileUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AthleteAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionPlan" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionMeal" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "kcal" INTEGER,
    "protein" INTEGER,
    "carbs" INTEGER,
    "fat" INTEGER,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NutritionMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLog" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "photoUrl" TEXT,
    "note" TEXT NOT NULL DEFAULT '',
    "kcal" INTEGER,
    "protein" INTEGER,
    "carbs" INTEGER,
    "fat" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AthleteAssignment_athleteId_createdAt_idx" ON "AthleteAssignment"("athleteId", "createdAt");

-- CreateIndex
CREATE INDEX "NutritionPlan_athleteId_active_idx" ON "NutritionPlan"("athleteId", "active");

-- CreateIndex
CREATE INDEX "NutritionMeal_planId_idx" ON "NutritionMeal"("planId");

-- CreateIndex
CREATE INDEX "MealLog_athleteId_date_idx" ON "MealLog"("athleteId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MealLog_mealId_athleteId_date_key" ON "MealLog"("mealId", "athleteId", "date");

-- AddForeignKey
ALTER TABLE "AthleteAssignment" ADD CONSTRAINT "AthleteAssignment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionPlan" ADD CONSTRAINT "NutritionPlan_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionMeal" ADD CONSTRAINT "NutritionMeal_planId_fkey" FOREIGN KEY ("planId") REFERENCES "NutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "NutritionMeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
