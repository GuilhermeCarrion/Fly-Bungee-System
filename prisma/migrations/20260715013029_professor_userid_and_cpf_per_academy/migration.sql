/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academyId,cpf]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Professor_cpf_key";

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Professor_userId_key" ON "Professor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_academyId_cpf_key" ON "Professor"("academyId", "cpf");

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
