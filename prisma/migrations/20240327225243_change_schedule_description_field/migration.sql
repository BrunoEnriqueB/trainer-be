/*
  Warnings:

  - You are about to drop the column `schedule_description` on the `Workouts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workouts" DROP COLUMN "schedule_description",
ADD COLUMN     "schedule" INTEGER[];
