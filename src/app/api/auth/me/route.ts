import { prisma } from "@/lib/prisma";
import { getBearerToken, verifyJwt } from "@/lib/token";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extrair token do header
    const token = getBearerToken(req);

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Validando token
    const payload = verifyJwt(token);

    if (!payload) return NextResponse.json({ user: null }, { status: 200 });

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt <= new Date(Date.now())) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        academyId: session.user.academyId,
      },
    });
  } catch (error) {
    console.error("Erro em /me", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
