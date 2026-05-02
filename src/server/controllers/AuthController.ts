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
      const token = await authService.login(email, password);

      return NextResponse.json({ token }, { status: 200 });
    } catch (error: any) {
      // Capturando erro do Service
      const errorMessage = error.message || "Erro interno no servidor";

      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
  }
}
