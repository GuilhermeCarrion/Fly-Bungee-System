import { AppError, handleError } from "@/lib/errors";
import { StudentPackageService } from "../services/StudentPackageService";
import { studentPackageSchema } from "@/schemas/studentPackage.schema";
import { NextResponse } from "next/server";

const service = new StudentPackageService();

export class StudentPackageController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = studentPackageSchema.safeParse(body);
      if (!parsed.success)
        throw new AppError(
          "Dados inválidos: " + parsed.error.issues[0].message,
          400,
        );

      const result = await service.assign(parsed.data, academyId);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      handleError(error);
    }
  }

  async index(studentId: string, academyId: string) {
    try {
      const packages = await service.listByStudent(studentId, academyId);
      return NextResponse.json(packages, { status: 200 });
    } catch (error) {
      handleError(error);
    }
  }

  async delete(id: string, academyId: string) {
    try {
      await service.cancel(id, academyId);
      return NextResponse.json(
        { message: "Pacote cancelado" },
        { status: 200 },
      );
    } catch (error) {
      handleError(error);
    }
  }
}
