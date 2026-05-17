import * as jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function authenticateRequest(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 },
      ),
      userId: null,
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    return { error: null, userId: decoded.userId };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 },
      ),
      userId: null,
    };
  }
}
