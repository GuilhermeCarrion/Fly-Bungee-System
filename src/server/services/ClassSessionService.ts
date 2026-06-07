import { ClassSessionSchema } from "@/schemas/classSession.schema";
import { ClassSessionRepository } from "../repositories/ClassSessionRepository";

const repository = new ClassSessionRepository();

export class ClassSessionService {
  async create(data: ClassSessionSchema, academyId: string) {
    // Prisma já garante a unicidade via @@unique([academyId, startAt]) no schema
    return await repository.create({ ...data, academyId });
  }

  async list(academyId: string) {
    return await repository.findAll(academyId);
  }

  async update(
    id: string,
    data: Partial<ClassSessionSchema>,
    academyId: string,
  ) {
    const classSession = await repository.findById(id, academyId);

    if (!classSession) throw new Error("Aula não encontrada");

    return await repository.update(id, data);
  }
}
