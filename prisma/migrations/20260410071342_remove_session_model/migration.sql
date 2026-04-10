/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,date,classId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_classId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_teacherId_fkey";

-- DropIndex
DROP INDEX "Attendance_studentId_sessionId_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "sessionId",
ADD COLUMN     "classId" TEXT;

-- DropTable
DROP TABLE "Session";

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_classId_key" ON "Attendance"("studentId", "date", "classId");
