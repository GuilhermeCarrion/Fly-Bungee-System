import { AppointmentController } from "@/server/controllers/AppointmentController";
import { authorizeRequest } from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const appointmentController = new AppointmentController();

export async function POST(req: Request) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
    Role.PROFESSOR,
  ]);
  if (error) return error;

  //Store executara a validação de lotação e duplicidade
  return appointmentController.store(req, academyId!);
}
