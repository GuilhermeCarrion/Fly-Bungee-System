import { ClassSessionController } from "@/server/controllers/ClassSessionController";
import { authenticateRequest } from "@/server/middleware/AuthMiddleware";

const classSessionController = new ClassSessionController();

export async function POST(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  return classSessionController.store(req, academyId!);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  return classSessionController.index(academyId!);
}
