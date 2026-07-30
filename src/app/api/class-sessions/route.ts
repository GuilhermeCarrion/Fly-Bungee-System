import { ClassSessionController } from "@/server/controllers/ClassSessionController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const classSessionController = new ClassSessionController();

export async function POST(req: Request) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
    Role.PROFESSOR,
  ]);
  if (error) return error;

  return classSessionController.store(req, academyId!);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  return classSessionController.index(req, academyId!);
}
