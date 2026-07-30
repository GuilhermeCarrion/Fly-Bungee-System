import { classSessionSchema } from "@/schemas/classSession.schema";
import { ClassSessionService } from "../services/ClassSessionService";
import { NextResponse } from "next/server";
import { AppError, handleError } from "@/lib/errors";

const service = new ClassSessionService();

export class ClassSessionController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = classSessionSchema.safeParse(body);

      if (!parsed.success) {
        throw new AppError(
          "Dados inválidos: " + parsed.error.issues[0].message,
          400,
        );
      }

      const result = await service.create(parsed.data, academyId);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  }

  async index(req: Request, academyId: string) {
    try {
      const url = new URL(req.url);
      const fromStr = url.searchParams.get("from");
      const toStr = url.searchParams.get("to");
      const from = fromStr ? new Date(fromStr) : undefined;
      const to = toStr ? new Date(toStr) : undefined;
      const sessions = await service.list(academyId, from, to);
      return NextResponse.json(sessions, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }
}
