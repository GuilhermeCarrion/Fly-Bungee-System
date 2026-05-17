import { loginSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  async login(req: Request) {
    const body = await req.json();

    // Verificando dados do input
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos " + parsed.error.message },
        { status: 400 },
      );
    }

    // Desestruturando email e senha para login
    const { email, password } = parsed.data;

    // Validando se login foi efetuado com sucesso
    try {
      const result = await authService.login(email, password);

      return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
      // Capturando erro do Service
      const errorMessage = error.message || "Erro interno no servidor";

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
  }

  // Retorna dados do usuário autenticado
  async getMe(userId: string) {
    try {
      const user = await authService.getProfile(userId);
      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Erro ao buscar usuário" },
        { status: 400 },
      );
    }
  }
}
