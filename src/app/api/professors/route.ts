import { ProfessorController } from "@/server/controllers/ProfessorController";
import { authenticateRequest } from "@/server/middleware/AuthMiddleware";

const professorController = new ProfessorController();

export async function POST(req: Request) {
  const { error, academyId } = authenticateRequest(req);

  if (error) return error;

  return professorController.strore(req, academyId);
}

export async function GET(req: Request) {
  const { error, academyId } = authenticateRequest(req);

  if (error) return error;

  return professorController.index(academyId);
}
