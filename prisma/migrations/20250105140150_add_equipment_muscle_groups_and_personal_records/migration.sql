-- Safe creation of Body enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "Body" AS ENUM ('UPPER', 'LOWER', 'CORE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscle_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" "Body" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "muscle_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_records" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipmentToExercise" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExerciseToMuscleGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentToExercise_AB_unique" ON "_EquipmentToExercise"("A", "B");
CREATE INDEX "_EquipmentToExercise_B_index" ON "_EquipmentToExercise"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToMuscleGroup_AB_unique" ON "_ExerciseToMuscleGroup"("A", "B");
CREATE INDEX "_ExerciseToMuscleGroup_B_index" ON "_ExerciseToMuscleGroup"("B");

-- AlterTable
ALTER TABLE "sets" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "restDuration" INTEGER,
ADD COLUMN "actualRestTaken" INTEGER;

-- AlterTable
ALTER TABLE "workout_exercises" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "restAfter" INTEGER,
ADD COLUMN "notes" TEXT;

-- Safe conversion of JSON columns
ALTER TABLE "exercises" 
ADD COLUMN "difficulty_new" JSONB,
ADD COLUMN "movements_new" JSONB,
ADD COLUMN "imageUrls_new" JSONB;

-- Convert existing data to JSONB
UPDATE "exercises" 
SET "difficulty_new" = CAST("difficulty" AS JSONB),
    "movements_new" = CAST("movements" AS JSONB),
    "imageUrls_new" = CASE 
        WHEN "imageUrls" IS NULL THEN NULL 
        ELSE CAST("imageUrls" AS JSONB)
    END;

-- Drop old columns and rename new ones
ALTER TABLE "exercises" 
DROP COLUMN "difficulty",
DROP COLUMN "movements",
DROP COLUMN "imageUrls";

ALTER TABLE "exercises" 
ALTER COLUMN "difficulty_new" SET NOT NULL,
ALTER COLUMN "movements_new" SET NOT NULL;

ALTER TABLE "exercises" 
RENAME COLUMN "difficulty_new" TO "difficulty";

ALTER TABLE "exercises" 
RENAME COLUMN "movements_new" TO "movements";

ALTER TABLE "exercises" 
RENAME COLUMN "imageUrls_new" TO "imageUrls";

-- AddForeignKey
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "personal_records" ADD CONSTRAINT "personal_records_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToExercise" ADD CONSTRAINT "_EquipmentToExercise_A_fkey" FOREIGN KEY ("A") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_EquipmentToExercise" ADD CONSTRAINT "_EquipmentToExercise_B_fkey" FOREIGN KEY ("B") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToMuscleGroup" ADD CONSTRAINT "_ExerciseToMuscleGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ExerciseToMuscleGroup" ADD CONSTRAINT "_ExerciseToMuscleGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "personal_records_exerciseId_idx" ON "personal_records"("exerciseId");
CREATE INDEX "personal_records_workoutId_idx" ON "personal_records"("workoutId");
CREATE INDEX "personal_records_setId_idx" ON "personal_records"("setId");
