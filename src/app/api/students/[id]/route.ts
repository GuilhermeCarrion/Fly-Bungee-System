import { StudentController } from "@/server/controllers/StudentController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const studentController = new StudentController();

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Context) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  const { id } = await params;
  return studentController.show(id, academyId as string);
}

export async function PATCH(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  const { id } = await params;
  return studentController.update(req, id, academyId as string);
}

export async function DELETE(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  const { id } = await params;
  return studentController.delete(id, academyId as string);
}
