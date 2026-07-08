/*
  Warnings:

  - A unique constraint covering the columns `[academyId,cpf]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_cpf_key";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Student_academyId_cpf_key" ON "Student"("academyId", "cpf");
