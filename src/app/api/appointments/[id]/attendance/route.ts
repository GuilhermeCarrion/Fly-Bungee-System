import { AppointmentController } from "@/server/controllers/AppointmentController";
import { authorizeRequest } from "@/server/middleware/AuthMiddleware";

const controller = new AppointmentController();
type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Context) {
  // PRESENÇA: QUALQUER usuário atenticado
  const { error, academyId, userId } = await authorizeRequest(req);
  if (error) return error;

  const { id } = await params;
  return controller.attendance(req, id, academyId as string, userId as string);
}
