import { prisma } from "@/lib/prisma";
import { ClassSessionSchema } from "@/schemas/classSession.schema";

export class ClassSessionRepository {
  async create(data: ClassSessionSchema & { academyId: string }) {
    return await prisma.classSession.create({ data });
  }

  async findAll(academyId: string) {
    return await prisma.classSession.findMany({
      where: { academyId, status: "OPEN" },
      include: { professor: { select: { name: true } } },
      orderBy: { startAt: "asc" },
    });
  }

  async findById(id: string, academyId: string) {
    return await prisma.classSession.findFirst({
      where: { id, academyId },
      include: { _count: { select: { appointments: true } } },
    });
  }

  async update(id: string, data: Partial<ClassSessionSchema>) {
    return await prisma.classSession.update({
      where: { id },
      data,
    });
  }
}
