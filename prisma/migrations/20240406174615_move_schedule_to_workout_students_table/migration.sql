/*
  Warnings:

  - You are about to drop the column `schedule` on the `Workouts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workouts" DROP COLUMN "schedule";

-- AlterTable
ALTER TABLE "Workouts_Students" ADD COLUMN     "schedule" INTEGER[];
