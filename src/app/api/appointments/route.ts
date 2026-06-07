import { AppointmentController } from "@/server/controllers/AppointmentController";
import { authenticateRequest } from "@/server/middleware/AuthMiddleware";

const appointmentController = new AppointmentController();

export async function POST(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  //Store executara a validação de lotação e duplicidade
  return appointmentController.store(req, academyId!);
}
