import { StudentPackageSchema } from "@/schemas/studentPackage.schema";
import { PlanRepository } from "../repositories/PlanRepository";
import { StudentPackageRepository } from "../repositories/StudentPackageRepository";
import { StudentRepository } from "../repositories/StudentRepository";
import { AppError } from "@/lib/errors";
import { StudentPackageStatus } from "@prisma/client";

const repository = new StudentPackageRepository();
const planRepository = new PlanRepository();
const studentRepository = new StudentRepository();

export class StudentPackageService {
  // Atribui um plano a um aluno, DERIVANDO créditos e validade do plano.
  async assign(data: StudentPackageSchema, academyId: string) {
    const student = await studentRepository.findById(data.studentId, academyId);
    if (!student) throw new AppError("Aluno não encontrado", 404);
    if (!student.active)
      throw new AppError(
        "Não é possível atribuir pacote a um aluno inativo",
        409,
      );

    const plan = await planRepository.findById(data.planId, academyId);
    if (!plan) throw new AppError("Plano não encontrado", 404);
    if (!plan.active) throw new AppError("Este plano está inativo", 409);

    if (plan.isTrial) {
      const usedTrial = await repository.findTrialByStudent(
        data.studentId,
        academyId,
      );
      if (usedTrial)
        throw new AppError("Este aluno já utilizou a aula experimental", 409);
    }

    const startedAt = data.startedAt ?? new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + plan.validityDays);

    return await repository.create({
      academyId,
      studentId: data.studentId,
      planId: data.planId,
      creditsTotal: plan.credits, // derivado do plano
      creditsRemaining: plan.credits, // Começa cheio
      startedAt,
      expiresAt, // startedAt + validityDays
    });
  }

  // Função recursiva para validar expiração do plano - provisório até automação cron
  async listByStudent(studentId: string, academyId: string) {
    await repository.expireStale(academyId);
    return await repository.listByStudent(studentId, academyId);
  }

  async cancel(id: string, academyId: string) {
    const pkg = await repository.findById(id, academyId);
    if (!pkg) throw new AppError("Pacote não encontrado", 404);

    return await repository.update(id, {
      status: StudentPackageStatus.CANCELLED,
    });
  }
}
