import { prisma } from "@/lib/prisma";
import { getBearerToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
      const token = getBearerToken(req);

      if(!token) {
        return NextResponse.json({error:'Não autenticado'}, {status:401})
      }

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
