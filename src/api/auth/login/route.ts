import { comparePassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    // Se validação falhar
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos" + validation.error.message },
        { status: 400 },
      );
    }

    // Dados validados
    const { email, password } = validation.data;

    // Busca usuário da academia
    const user = await prisma.user.findUnique({
      where: { email },
      include: { academy: true }, //inclui dados da academia
    });

    if (!user || !user.active) {
      return NextResponse.json(
        { error: "Email ou senha invalidos" },
        { status: 401 },
      );
    }

    const passwordMatch = comparePassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 },
      );
    }

    // Gerando JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, //Payload
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Salvando sessão no banco em milesegundos (7 dias)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Retornando sucesso e dados do usuário sem senha
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        academyId: user.academyId,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login: ", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
