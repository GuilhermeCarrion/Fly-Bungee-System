import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Autenticação - Prova de identidade
export function authenticateRequest(request: Request) {
  const authHeader = request.headers.get("authorization");

  // Valida se token existe no request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 },
      ),
      userId: null,
      academyId: null,
    };
  }

  // Padronização do token
  const token = authHeader.split(" ")[1];

  try {
    // Valida: Integridade e Validade do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      academyId: string;
    };

    return {
      error: null,
      userId: decoded.userId,
      academyId: decoded.academyId,
    };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 },
      ),
      userId: null,
      academyId: null,
    };
  }
}

// Autorização - define o que vc pode fazer
export async function authorizeRequest(
  request: Request,
  allowedRoles?: Role[],
) {
  // Reutilização para identificação da request
  const base = authenticateRequest(request);

  if (base.error) return { ...base, role: null as Role | null };

  // Banco é a fonte da verdade, busca pela permissão na "hora"
  const user = await prisma.user.findUnique({
    where: { id: base.userId as string },
    select: { role: true, active: true },
  });

  if (!user || !user.active) {
    return {
      error: NextResponse.json(
        { error: "Usuário inválido ou inativo" },
        { status: 401 },
      ),
      userId: null,
      academyId: null,
      role: null as Role | null,
    };
  }

  /**
   * Decidindo "quem pode o quê" - Autorização genérica, quem define é a rota (quem chama)
   *
   * Whitelist vinda da rota define quem entra. A função checa se o papel do usuário está na lista.
   * Se não estiver -> 403 - "Sei quem é você, mas essa ação não é para seu perfil"
   */

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { error: "Acesso negado para seu perfil" },
        { status: 403 },
      ),
      userId: base.userId,
      academyId: base.academyId,
      role: user.role,
    };
  }

  return {
    error: null,
    userId: base.userId,
    academyId: base.academyId,
    role: user.role,
  };
}
