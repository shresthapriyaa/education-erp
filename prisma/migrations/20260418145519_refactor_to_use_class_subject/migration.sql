/*
  Warnings:

  - You are about to drop the column `detectedZoneId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `distanceFromZone` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Fee` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolZone` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,assignmentId]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,subjectId,classId,academicYear,term]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classSubjectId,day,startTime]` on the table `Routine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classSubjectId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classSubjectId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Material` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `academicYear` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPassed` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obtainedMarks` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMarks` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classSubjectId` to the `Routine` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sex` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PDF', 'VIDEO', 'LINK', 'DOCUMENT', 'IMAGE');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('MIDTERM', 'FINAL', 'UNIT_TEST', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'WAIVED');

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_detectedZoneId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_classId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolZone" DROP CONSTRAINT "SchoolZone_schoolId_fkey";

-- DropIndex
DROP INDEX "Routine_classId_day_startTime_key";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "classSubjectId" TEXT NOT NULL,
ADD COLUMN     "totalMarks" DOUBLE PRECISION NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "detectedZoneId",
DROP COLUMN "distanceFromZone";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "classId" TEXT NOT NULL,
ADD COLUMN     "passMarks" DOUBLE PRECISION NOT NULL DEFAULT 40,
ADD COLUMN     "totalMarks" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "type" "ExamType" NOT NULL;

-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "paid",
ADD COLUMN     "paidDate" TIMESTAMP(3),
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "status" "FeeStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "classSubjectId" TEXT NOT NULL,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LibraryBook" ADD COLUMN     "available" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "type",
ADD COLUMN     "type" "MaterialType" NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "classId" TEXT NOT NULL,
ADD COLUMN     "isPassed" BOOLEAN NOT NULL,
ADD COLUMN     "obtainedMarks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "term" TEXT NOT NULL,
ADD COLUMN     "totalMarks" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "classId",
DROP COLUMN "subjectId",
DROP COLUMN "teacherId",
ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "sex",
ADD COLUMN     "sex" "UserSex" NOT NULL;

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "SchoolZone";

-- DropEnum
DROP TYPE "Usersex";

-- CreateTable
CREATE TABLE "AssignmentMaterial" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MaterialType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "marksObtained" DOUBLE PRECISION NOT NULL,
    "grade" TEXT,
    "remarks" TEXT,
    "isAbsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_examId_studentId_key" ON "ExamResult"("examId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_assignmentId_key" ON "Grade"("studentId", "assignmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_studentId_subjectId_classId_academicYear_term_key" ON "Result"("studentId", "subjectId", "classId", "academicYear", "term");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_classSubjectId_day_startTime_key" ON "Routine"("classSubjectId", "day", "startTime");

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentMaterial" ADD CONSTRAINT "AssignmentMaterial_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
