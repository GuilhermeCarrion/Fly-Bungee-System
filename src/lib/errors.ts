import { NextResponse } from "next/server";

export class AppError extends Error {
  // Erro esperado de negocio, que carrega o status HTTP correto
  constructor(
    message: string,
    public status: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  // Qualquer coisa não prevista = 500, sem vazar datalhe interno
  console.error("Erro inesperado:", error);
  return NextResponse.json(
    { error: "Erro interno no servidor" },
    { status: 500 },
  );
}
