/*
  Warnings:

  - You are about to drop the column `equipment` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `muscleGroups` on the `exercises` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "equipment",
DROP COLUMN "muscleGroups";
