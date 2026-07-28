-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PENDING', 'PRESENT', 'ABSENT', 'NO_SHOW');

-- DropIndex
DROP INDEX "Appointment_classSessionId_studentId_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "attendance" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "checkedInAt" TIMESTAMP(3),
ADD COLUMN     "checkedInById" TEXT,
ADD COLUMN     "studentPackageId" TEXT;

-- AlterTable
ALTER TABLE "ClassSession" ADD COLUMN     "durationMin" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "minCapacity" INTEGER NOT NULL DEFAULT 3;

-- CreateIndex
CREATE INDEX "Appointment_classSessionId_studentId_idx" ON "Appointment"("classSessionId", "studentId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentPackageId_fkey" FOREIGN KEY ("studentPackageId") REFERENCES "StudentPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
