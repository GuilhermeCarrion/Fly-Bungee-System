import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 },
      );
    }
    // Removendo o "Bearer "
    const token = authHeader.substring(7);

    // Removendo sessão do banco e invalidando token
    await prisma.session.deleteMany({
      where: { token }, // Deleta todas as sessões com esse token
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer logout: ", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
