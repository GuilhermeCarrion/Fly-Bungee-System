import { AppointmentSchema } from "@/schemas/appointment.schema";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { ClassSessionRepository } from "../repositories/ClassSessionRepository";
import { AppError } from "@/lib/errors";

const appointmentRepository = new AppointmentRepository();
const sessionRepository = new ClassSessionRepository();

export class AppointmentService {
  async create(data: AppointmentSchema, academyId: string) {
    // Verificar se a aula existe e buscar capacidade atual
    const session = await sessionRepository.findById(
      data.classSessionId,
      academyId,
    );

    if (!session) throw new AppError("Aula não encontrada", 404);

    // Valida lotação
    const currentOccupancy = session._count.appointments;
    if (currentOccupancy >= session.capacity) {
      // Aula lotada = conflito com o estado atual (não input inválido) → 409
      throw new AppError("Esta aula já atingiu a capacidade máxima", 409);
    }

    const isDuplicate = await appointmentRepository.findDuplicate(
      data.studentId,
      data.classSessionId,
    );

    if (isDuplicate)
      throw new AppError("Aluno já está agendado para essa aula", 409);

    return await appointmentRepository.create({ ...data, academyId });
  }
}
