import {
  ProfessorSchema,
  ProfessorUpdateSchema,
} from "@/schemas/professor.schema";
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

  async getById(id: string, academyId: string) {
    const professor = await repository.findById(id, academyId);
    if (!professor) throw new AppError("Professor não encontrado", 404);
    return professor;
  }

  async update(id: string, data: ProfessorUpdateSchema, academyId: string) {
    const professor = await repository.findById(id, academyId);
    if (!professor) throw new AppError("Professor não encontrado", 404);

    if (data.cpf && data.cpf !== professor.cpf) {
      const exist = await repository.findByCpf(data.cpf, academyId);
      if (exist)
        throw new AppError(
          "Já existe um professor com este CPF nesta unidade",
          409,
        );
    }

    return await repository.update(id, data);
  }

  async delete(id: string, academyId: string) {
    const professor = await repository.findById(id, academyId);

    if (!professor) throw new AppError("Professor não encontrado", 404);

    // Não permite inativar se professor possui aulas futuras
    const futuras = await repository.countFutureClasses(id, academyId);
    if (futuras > 0) {
      throw new AppError(
        "Professor tem aulas futuras agendadas. Cancele ou reatribua antes de inativar",
        409,
      );
    }

    return await repository.softDelete(id);
  }
}
