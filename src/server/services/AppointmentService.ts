import { AppointmentSchema } from "@/schemas/appointment.schema";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { ClassSessionRepository } from "../repositories/ClassSessionRepository";

const appointmentRepository = new AppointmentRepository();
const sessionRepository = new ClassSessionRepository();

export class AppointmentService {
  async create(data: AppointmentSchema, academyId: string) {
    // Verificar se a aula existe e buscar capacidade atual
    const session = await sessionRepository.findById(
      data.classSessionId,
      academyId,
    );

    if (!session) throw new Error("Aula não encontrada");

    // Valida lotação
    const currentOccupancy = session._count.appointments;
    if (currentOccupancy >= session.capacity) {
      throw new Error("Está aula já atingiu a capacidade máxima");
    }

    const isDuplicate = await appointmentRepository.findDuplicate(
      data.studentId,
      data.classSessionId,
    );

    if (isDuplicate) throw new Error("Aluno já está agendado para essa aula");

    return await appointmentRepository.create({ ...data, academyId });
  }
}
