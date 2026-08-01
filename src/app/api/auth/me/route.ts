import { AuthController } from "@/server/controllers/AuthController";
import { authenticateRequest } from "@/server/middleware/AuthMiddleware";
import { NextResponse } from "next/server";

const authController = new AuthController();

export async function GET(request: Request) {
  // Validando token
  const { error, userId } = authenticateRequest(request);

  if (error) return error;

  if (!userId)
    return NextResponse.json(
      { error: "Usuário não autorizado" },
      { status: 401 },
    );

  // Busca dados do usuário
  return authController.getMe(userId);
}
