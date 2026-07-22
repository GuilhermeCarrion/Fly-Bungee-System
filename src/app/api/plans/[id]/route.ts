import { PlanController } from "@/server/controllers/PlanController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const planController = new PlanController();

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Context) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  const { id } = await params;
  return await planController.show(id, academyId as string);
}

export async function PATCH(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  const { id } = await params;
  return await planController.update(req, id, academyId as string);
}
export async function DELETE(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  const { id } = await params;
  return await planController.deactivate(id, academyId as string);
}
