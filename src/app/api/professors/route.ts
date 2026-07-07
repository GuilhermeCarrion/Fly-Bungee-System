import { ProfessorController } from "@/server/controllers/ProfessorController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const professorController = new ProfessorController();

export async function POST(req: Request) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);

  if (error) return error;

  return professorController.store(req, academyId!);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);

  if (error) return error;

  return professorController.index(academyId);
}

// DELETE - Aplicar mesma regra do POST de authorizeRequest
