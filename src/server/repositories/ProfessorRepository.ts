import { ProfessorSchema } from "@/schemas/professor.schema";
import { prisma } from "@/lib/prisma";

export class ProfessorRepository {
  async create(data: ProfessorSchema & { academyId: string }) {
    return await prisma.professor.create({ data });
  }

  async findByCpf(cpf: string, academyId: string) {
    return await prisma.professor.findFirst({
      where: { cpf, academyId, deletedAt: null },
    });
  }

  async findAll(academyId: string) {
    return await prisma.professor.findMany({
      where: { academyId, deletedAt: null },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string, academyId: string) {
    return await prisma.professor.findUnique({
      where: { id, academyId, deletedAt: null },
    });
  }

  async update(id: string, data: ProfessorSchema) {
    return await prisma.professor.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return await prisma.professor.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }
}
