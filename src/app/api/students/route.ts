import { StudentController } from "@/server/controllers/StudentController";
import {
  authenticateRequest,
  authorizeRequest,
} from "@/server/middleware/AuthMiddleware";
import { Role } from "@prisma/client";

const studentController = new StudentController();

export async function POST(req: Request) {
  const { error, academyId } = await authorizeRequest(req, [
    Role.ADMIN,
    Role.GESTOR,
  ]);
  if (error) return error;

  return studentController.store(req, academyId!);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  return studentController.index(academyId);
}
