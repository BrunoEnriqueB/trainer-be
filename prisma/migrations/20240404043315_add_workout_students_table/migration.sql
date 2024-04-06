-- CreateTable
CREATE TABLE "Workouts_Students" (
    "id" SERIAL NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "Workouts_Students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workouts_Students_workout_id_student_id_key" ON "Workouts_Students"("workout_id", "student_id");

-- AddForeignKey
ALTER TABLE "Workouts_Students" ADD CONSTRAINT "Workouts_Students_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts_Students" ADD CONSTRAINT "Workouts_Students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
