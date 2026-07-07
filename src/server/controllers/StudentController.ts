import { studentSchema } from "@/schemas/students.schema";
import { StudentService } from "../services/StudentService";
import { NextResponse } from "next/server";
import { AppError, handleError } from "@/lib/errors";

const studentService = new StudentService();

export class StudentController {
  async store(req: Request, academyId: string) {
    try {
      const body = await req.json();
      const parsed = studentSchema.safeParse(body);

      if (!parsed.success) {
        throw new AppError(
          "Dados inválidos: " + parsed.error.issues[0].message,
          400,
        );
      }

      const result = await studentService.create(parsed.data, academyId);

      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      return handleError(error);
    }
  }

  async index(academyId: string) {
    try {
      const students = await studentService.list(academyId);
      return NextResponse.json(students, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }
}
