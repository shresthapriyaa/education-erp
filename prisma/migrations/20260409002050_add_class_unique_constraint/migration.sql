/*
  Warnings:

  - A unique constraint covering the columns `[name,teacherId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Class_name_teacherId_key" ON "Class"("name", "teacherId");
