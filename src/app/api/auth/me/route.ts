import { AuthController } from "@/server/controllers/AuthController";
import { authenticateRequest } from "@/server/middleware/AuthMiddleware";

const authController = new AuthController();

export async function GET(request: Request) {
  // Validando token
  const { error, userId } = authenticateRequest(request);

  if (error || !userId) {
    return error;
  }

  // Busca dados do usuário
  return authController.getMe(userId);
}
