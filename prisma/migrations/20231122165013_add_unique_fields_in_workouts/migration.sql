/*
  Warnings:

  - A unique constraint covering the columns `[trainer_id,name]` on the table `Workouts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workouts_trainer_id_name_key" ON "Workouts"("trainer_id", "name");
