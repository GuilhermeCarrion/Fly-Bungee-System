import { ProfessorSchema } from "@/schemas/professor.schema";
import { ProfessorRepository } from "../repositories/ProfessorRepository";
import { AppError } from "@/lib/errors";

const repository = new ProfessorRepository();

export class ProfessorService {
  async create(data: ProfessorSchema, academyId: string) {
    const professorExists = await repository.findByCpf(data.cpf, academyId);

    if (professorExists)
      throw new AppError(
        "Já existe um professor com este CPF cadastrado nesta unidade",
        409,
      );

    return await repository.create({ ...data, academyId });
  }

  async list(academyId: string) {
    return await repository.findAll(academyId);
  }

  // Verificar esse update
  async update(id: string, data: ProfessorSchema) {
    return await repository.update(id, { ...data });
  }

  async delete(id: string, academyId: string) {
    const professor = await repository.findById(id, academyId);

    if (!professor) throw new AppError("Professor não encontrado", 404);
    // Validar se professor possui aulas futuras
    return await repository.softDelete(id);
  }
}
