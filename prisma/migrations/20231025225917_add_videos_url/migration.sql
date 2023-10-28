/*
  Warnings:

  - Added the required column `video_url` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_url` to the `Workouts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercises" ADD COLUMN     "video_url" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Workouts" ADD COLUMN     "logo_url" VARCHAR(255) NOT NULL;
