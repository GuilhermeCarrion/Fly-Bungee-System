import { classSessionSchema } from "@/schemas/classSession.schema";
import { ClassSessionService } from "../services/ClassSessionService";
import { NextResponse } from "next/server";

const service = new ClassSessionService();

export class ClassSessionController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = classSessionSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      }

      const result = await service.create(parsed.data, academyId);
      return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  async index(academyId: string) {
    try {
      const sessions = await service.list(academyId);
      return NextResponse.json(sessions, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
