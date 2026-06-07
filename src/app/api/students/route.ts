import { StudentController } from "@/server/controllers/StudentController";
import { authenticateRequest } from "@/server/middleware/AuthMiddleware";

const studentController = new StudentController();

export async function POST(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  return studentController.store(req, academyId);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);
  if (error) return error;

  return studentController.index(academyId);
}
