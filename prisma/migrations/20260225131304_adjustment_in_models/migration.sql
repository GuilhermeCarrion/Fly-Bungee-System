/*
  Warnings:

  - Added the required column `weightKg` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "heightCm" INTEGER,
ADD COLUMN     "registredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "weightKg" DECIMAL(65,30) NOT NULL;
