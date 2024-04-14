/*
  Warnings:

  - You are about to drop the `Workouts_Students` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workout_id,exercise_id]` on the table `workoutxexercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Workouts_Students" DROP CONSTRAINT "Workouts_Students_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Workouts_Students" DROP CONSTRAINT "Workouts_Students_workout_id_fkey";

-- DropTable
DROP TABLE "Workouts_Students";

-- CreateTable
CREATE TABLE "workoutxstudents" (
    "id" SERIAL NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,
    "schedule" INTEGER[],

    CONSTRAINT "workoutxstudents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workoutxstudents_workout_id_student_id_key" ON "workoutxstudents"("workout_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "workoutxexercise_workout_id_exercise_id_key" ON "workoutxexercise"("workout_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "workoutxstudents" ADD CONSTRAINT "workoutxstudents_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutxstudents" ADD CONSTRAINT "workoutxstudents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
