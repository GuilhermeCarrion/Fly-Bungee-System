import { PlanSchema, PlanUpdateSchema } from "@/schemas/plan.schema";
import { PlanRepository } from "../repositories/PlanRepository";
import { AppError } from "@/lib/errors";
import { da } from "zod/v4/locales";

const repository = new PlanRepository();

export class PlanService {
  async create(data: PlanSchema, academyId: string) {
    const exist = await repository.findByName(data.name, academyId);
    if (exist)
      throw new AppError("Já existe um plano com esse nome nesta unidade", 409);

    return await repository.create({ ...data, academyId });
  }

  async list(academyId: string, onlyActive = false) {
    return await repository.findAll(academyId, onlyActive);
  }

  async getById(id: string, academyId: string) {
    return await repository.findById(id, academyId);
  }

  async update(id: string, data: PlanUpdateSchema, academyId: string) {
    const plan = await repository.findById(id, academyId);
    if (!plan) throw new AppError("Plano não encontrado", 404);

    if (data.name && data.name !== plan.name) {
      const exist = await repository.findByName(data.name, academyId);
      if (exist)
        throw new AppError(
          "Já existe um plano com este nome nesta unidade",
          409,
        );
    }

    return await repository.update(id, data);
  }

  // Desativa (não apaga, preserva pacotes já vendidos que apontam para o plano)
  async deactivate(id: string, academyId: string) {
    const plan = await repository.findById(id, academyId);
    if (!plan) throw new AppError("Plano não encontrado", 404);

    return await repository.update(id, { active: false });
  }
}
