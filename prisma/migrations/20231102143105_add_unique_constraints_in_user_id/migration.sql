/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Trainers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Students_user_id_key" ON "Students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Trainers_user_id_key" ON "Trainers"("user_id");
