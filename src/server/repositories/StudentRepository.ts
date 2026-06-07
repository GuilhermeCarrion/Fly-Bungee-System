import { prisma } from "@/lib/prisma";
import { StudentSchema } from "@/schemas/students.schema";

export class StudentRepository {
  async create(data: StudentSchema & { academyId: string }) {
    return await prisma.student.create({ data });
  }

  async findByCpf(cpf: string, academyId: string) {
    return await prisma.student.findUnique({
      where: { cpf, academyId },
    });
  }

  async findAll(academyId: string) {
    return await prisma.student.findMany({
      where: { academyId },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string, academyId: string) {
    return await prisma.student.findFirst({
      where: { id, academyId },
    });
  }

  async update(id: string, data: Partial<StudentSchema>) {
    return await prisma.student.update({
      where: { id },
      data,
    });
  }
}
