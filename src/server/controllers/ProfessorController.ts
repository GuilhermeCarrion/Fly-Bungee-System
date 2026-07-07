import { AppError, handleError } from "@/lib/errors";
import { professorSchema } from "@/schemas/professor.schema";
import { ProfessorService } from "@/server/services/ProfessorService";
import { NextResponse } from "next/server";

const professorService = new ProfessorService();

export class ProfessorController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();

      const parsed = professorSchema.safeParse(body);

      if (!parsed.success) {
        throw new AppError(
          "Dados inválidos: " + parsed.error.issues[0].message,
          400,
        );
      }

      const result = await professorService.create(parsed.data, academyId);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  }

  async index(academyId: string) {
    try {
      const professors = await professorService.list(academyId);
      return NextResponse.json(professors, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(id: string, academyId: string) {
    try {
      await professorService.delete(id, academyId);
      return NextResponse.json(
        { message: "Professor removido" },
        { status: 200 },
      );
    } catch (error) {
      return handleError(error);
    }
  }
}
