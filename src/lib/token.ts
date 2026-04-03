import jwt from "jsonwebtoken";

/**
 * Formato do payload que é definido no jwt.sign
 */
export type JwtPayloadApp = {
  userId: number;
  role: "ADMIN" | "GESTOR" | "PROFESSOR";
  academyId: number;
  iat?: number;
  exp?: number;
};

/**
 * Verifica JWT:
 * - Valido: retorna payload
 * - Invalido: retorna null
 */

export function verifyJwt(token: string): JwtPayloadApp | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string") return null;

    const payload = decoded as JwtPayloadApp;
    if (!payload.userId || !payload.role || !payload.academyId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extrai o token JWT do header no formato:
 * Authorization:Bearer <token>
 *
 * Retornos possíveis:
 * - String: token extraido com sucesso
 * - Null: Token não encontrado, não existe no header ou fora do padrão
 */

export function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  if (!authHeader.startsWith("Bearer")) return null;

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) return null;

  return token;
}
