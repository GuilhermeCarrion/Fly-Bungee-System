import { prisma } from "@/lib/prisma";
import { AppointmentSchema } from "@/schemas/appointment.schema";

export class AppointmentRepository {
  async create(data: AppointmentSchema & { academyId: string }) {
    return await prisma.appointment.create({ data });
  }

  // Verifica se aluno já está na aula
  async findDuplicate(studentId: string, classSessionId: string) {
    return await prisma.appointment.findUnique({
      where: {
        classSessionId_studentId: { classSessionId, studentId },
      },
    });
  }

  async findAllBySession(classSessionId: string, academyId: string) {
    return await prisma.appointment.findMany({
      where: { classSessionId, academyId },
      include: { student: { select: { name: true, weightKg: true } } },
    });
  }
}
