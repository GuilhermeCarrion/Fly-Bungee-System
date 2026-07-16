import { ProfessorController } from "@/server/controllers/ProfessorController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const professorController = new ProfessorController();

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Context) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  const { id } = await params;
  return professorController.show(id, academyId as string);
}

export async function PATCH(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  const { id } = await params;
  return professorController.update(req, id, academyId as string);
}

export async function DELETE(req: Request, { params }: Context) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  const { id } = await params;
  return professorController.delete(id, academyId as string);
}
