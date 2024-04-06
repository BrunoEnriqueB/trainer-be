/*
  Warnings:

  - You are about to drop the column `student_id` on the `Workouts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workouts" DROP CONSTRAINT "Workouts_student_id_fkey";

-- AlterTable
ALTER TABLE "Workouts" DROP COLUMN "student_id";
