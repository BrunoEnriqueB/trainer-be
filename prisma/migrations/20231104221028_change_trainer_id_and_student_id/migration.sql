/*
  Warnings:

  - The primary key for the `Students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Students` table. All the data in the column will be lost.
  - The primary key for the `Trainers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Trainers` table. All the data in the column will be lost.
  - The required column `student_id` was added to the `Students` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `trainer_id` was added to the `Trainers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Exercises" DROP CONSTRAINT "Exercises_trainer_id_fkey";

-- DropForeignKey
ALTER TABLE "Workout_Tracker" DROP CONSTRAINT "Workout_Tracker_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Workout_Tracker" DROP CONSTRAINT "Workout_Tracker_trainer_id_fkey";

-- DropForeignKey
ALTER TABLE "Workouts" DROP CONSTRAINT "Workouts_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Workouts" DROP CONSTRAINT "Workouts_trainer_id_fkey";

-- DropForeignKey
ALTER TABLE "trainerxstudent" DROP CONSTRAINT "trainerxstudent_student_id_fkey";

-- DropForeignKey
ALTER TABLE "trainerxstudent" DROP CONSTRAINT "trainerxstudent_trainer_id_fkey";

-- AlterTable
ALTER TABLE "Students" DROP CONSTRAINT "Students_pkey",
DROP COLUMN "id",
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD CONSTRAINT "Students_pkey" PRIMARY KEY ("student_id");

-- AlterTable
ALTER TABLE "Trainers" DROP CONSTRAINT "Trainers_pkey",
DROP COLUMN "id",
ADD COLUMN     "trainer_id" TEXT NOT NULL,
ADD CONSTRAINT "Trainers_pkey" PRIMARY KEY ("trainer_id");

-- AddForeignKey
ALTER TABLE "trainerxstudent" ADD CONSTRAINT "trainerxstudent_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "Trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainerxstudent" ADD CONSTRAINT "trainerxstudent_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "Trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts" ADD CONSTRAINT "Workouts_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "Trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts" ADD CONSTRAINT "Workouts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Tracker" ADD CONSTRAINT "Workout_Tracker_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "Trainers"("trainer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_Tracker" ADD CONSTRAINT "Workout_Tracker_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
